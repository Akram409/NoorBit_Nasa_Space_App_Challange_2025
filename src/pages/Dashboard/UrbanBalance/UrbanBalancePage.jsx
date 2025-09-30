import React, { useState, useEffect, useRef } from "react";
import "./UrbanBalancePage.css";
import { MapPin, Thermometer, Wind, Leaf, Droplets, CloudRain, RefreshCw, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";


// Fix for default markers in Leaflet
const initializeLeafletIcons = (L) => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

const UrbanBalancePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("Dhaka, Chittagong, Bangladesh");
  const [coordinates, setCoordinates] = useState([22.3569, 91.7832]); // Chittagong coordinates
  const [environmentalData, setEnvironmentalData] = useState({
    airQuality: 0,
    greenCover: 0,
    waterQuality: 0,
    noise: 0,
    temperature: 0,
    humidity: 0,
    co2: 0,
    carbonFootprint: 0,
    pm2_5: 0,
    pm10: 0,
    no2: 0,
    windSpeed: 0,
    urbanDensity: 0,
    landSurfaceTemp: 0,
  });
  const [currentHealthScore, setCurrentHealthScore] = useState(48);
  const [projectedHealthScore, setProjectedHealthScore] = useState(75);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [pollutionZones, setPollutionZones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Simulation state
  const [simulationValues, setSimulationValues] = useState({
    greenCover: 35,
    solarAdoption: 20,
    publicTransport: 40,
    wasteRecycling: 30,
    waterConservation: 45,
  });

  const [simulatedData, setSimulatedData] = useState(null);
  const [notification, setNotification] = useState(null);

  // NASA API Configuration - Replace with your actual API key
  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "demo_key";

  // NASA API endpoints
  const NASA_APIS = {
    imagery: "https://api.nasa.gov/planetary/earth/imagery",
    assets: "https://api.nasa.gov/planetary/earth/assets",
    modis: "https://modis-images.gsfc.nasa.gov/",
    landsat: "https://landsat-pds.s3.amazonaws.com/",
  };

  // External API endpoints
  const EXTERNAL_APIS = {
    airQuality: "https://api.openweathermap.org/data/2.5/air_pollution",
    weather: "https://api.openweathermap.org/data/2.5/weather",
    geocoding: "https://nominatim.openstreetmap.org/search",
  };

  // Handle simulation parameter changes
  const handleSimulationChange = (paramId, value) => {
    setSimulationValues(prev => ({
      ...prev,
      [paramId]: value[0] 
    }));
  };

  // Calculate simulated environmental values
  const calculateSimulatedValue = (metric) => {
    const baseValue = environmentalData[metric] || 0;
    let change = 0;

    // Define baselines for percentage-based calculations
    const baselineGreenCover = 35;
    const baselineSolarAdoption = 20;
    const baselinePublicTransport = 40;
    const baselineWasteRecycling = 30;
    const baselineWaterConservation = 45;

    // Green Cover Impact
    const greenCoverDiff = simulationValues.greenCover - baselineGreenCover;
    if (metric === 'temperature') {
      change += greenCoverDiff * -0.05; // More green = lower temp
    } else if (metric === 'airQuality') {
      change += greenCoverDiff * -0.3; // More green = better air (lower AQI)
    } else if (metric === 'carbonFootprint') {
      change += greenCoverDiff * -0.2;
    }

    // Solar Adoption Impact
    const solarDiff = simulationValues.solarAdoption - baselineSolarAdoption;
    if (metric === 'carbonFootprint') {
      change += solarDiff * -0.4;
    } else if (metric === 'airQuality') {
      change += solarDiff * -0.2;
    }

    // Public Transport Impact
    const transportDiff = simulationValues.publicTransport - baselinePublicTransport;
    if (metric === 'airQuality') {
      change += transportDiff * -0.4;
    } else if (metric === 'carbonFootprint') {
      change += transportDiff * -0.3;
    } else if (metric === 'noise') {
      change += transportDiff * -0.2;
    }

    // Waste Recycling Impact
    const recycleDiff = simulationValues.wasteRecycling - baselineWasteRecycling;
    if (metric === 'carbonFootprint') {
      change += recycleDiff * -0.15;
    } else if (metric === 'waterQuality') {
      change += recycleDiff * 0.1; // More recycling = better water quality (higher %)
    }

    // Water Conservation Impact
    const waterDiff = simulationValues.waterConservation - baselineWaterConservation;
    if (metric === 'waterQuality') {
      change += waterDiff * 0.3; // More conservation = better water quality (higher %)
    }

    // Apply change and ensure values stay within realistic bounds
    let newValue = baseValue + change;
    
    // Clamp values to realistic ranges
    switch(metric) {
      case 'temperature':
        newValue = Math.max(15, Math.min(45, newValue));
        break;
      case 'airQuality': // Lower AQI is better
        newValue = Math.max(0, Math.min(200, newValue));
        break;
      case 'carbonFootprint':
        newValue = Math.max(50, Math.min(500, newValue));
        break;
      case 'waterQuality': // Higher % is better
        newValue = Math.max(0, Math.min(100, newValue));
        break;
      case 'noise': // Lower dB is better
        newValue = Math.max(30, Math.min(100, newValue));
        break;
      default:
        newValue = Math.max(0, Math.min(100, newValue));
    }

    return newValue;
  };

  // Calculate simulated health score
  const calculateSimulatedHealthScore = () => {
    const simulatedMetrics = {
      airQuality: calculateSimulatedValue('airQuality'),
      greenCover: simulationValues.greenCover,
      waterQuality: calculateSimulatedValue('waterQuality'),
      noise: calculateSimulatedValue('noise'),
      carbonFootprint: calculateSimulatedValue('carbonFootprint'),
      temperature: calculateSimulatedValue('temperature'),
      humidity: environmentalData.humidity,
      windSpeed: environmentalData.windSpeed,
    };

    return calculateHealthScore(simulatedMetrics);
  };

  // Apply simulation to the map and update environmental data
  const applySimulation = () => {
    const newSimulatedData = {
      ...environmentalData,
      temperature: calculateSimulatedValue('temperature'),
      airQuality: calculateSimulatedValue('airQuality'),
      carbonFootprint: calculateSimulatedValue('carbonFootprint'),
      waterQuality: calculateSimulatedValue('waterQuality'),
      noise: calculateSimulatedValue('noise'),
      greenCover: simulationValues.greenCover,
    };

    setSimulatedData(newSimulatedData);
    setEnvironmentalData(newSimulatedData);

    const newHealthScore = calculateSimulatedHealthScore();
    setCurrentHealthScore(newHealthScore);
    setProjectedHealthScore(Math.min(100, newHealthScore + 10));

    // Update map marker popup with new data
    if (markerRef.current) {
      markerRef.current.setPopupContent(`<div>
        <strong>${selectedLocation.split(',')[0]}</strong><br/>
        <span style="color: #4CAF50; font-weight: bold;">✓ Simulation Applied</span><br/>
        Health Score: ${newHealthScore}%<br/>
        Air Quality: ${newSimulatedData.airQuality?.toFixed(1)}<br/>
        Green Cover: ${newSimulatedData.greenCover?.toFixed(1)}%<br/>
        Temperature: ${newSimulatedData.temperature?.toFixed(1)}°C
      </div>`);
      markerRef.current.openPopup();
    }

    // Show success notification
    showNotification('Simulation applied successfully! Map updated with new environmental data.', 'success');
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // NASA Earth Imagery API
  const fetchNASAImagery = async (lat, lon) => {
    try {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const dateString = date.toISOString().split("T")[0];

      const url = `${NASA_APIS.imagery}?lon=${lon}&lat=${lat}&date=${dateString}&dim=0.10&api_key=${NASA_API_KEY}`;
      
      console.log("Fetching NASA imagery from:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NASA Imagery API error: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
    } catch (error) {
      console.warn("NASA Imagery fetch failed:", error);
      return null;
    }
  };

  // Real Air Quality Data from OpenWeatherMap
  const fetchAirQualityData = async (lat, lon) => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "demo_key") {
      console.warn("OpenWeatherMap API key not configured");
      return null;
    }

    try {
      const url = `${EXTERNAL_APIS.airQuality}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
      console.log("Fetching air quality data from:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Air Quality API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        aqi: data.list[0]?.main?.aqi * 20 || 50,
        co: data.list[0]?.components?.co || 300,
        no2: data.list[0]?.components?.no2 || 40,
        o3: data.list[0]?.components?.o3 || 80,
        so2: data.list[0]?.components?.so2 || 20,
        pm2_5: data.list[0]?.components?.pm2_5 || 25,
        pm10: data.list[0]?.components?.pm10 || 45,
      };
    } catch (error) {
      console.warn("Air Quality fetch failed:", error);
      return null;
    }
  };

  // Weather Data from OpenWeatherMap
  const fetchWeatherData = async (lat, lon) => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "demo_key") {
      return null;
    }

    try {
      const url = `${EXTERNAL_APIS.weather}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        temperature: data.main?.temp || 28,
        humidity: data.main?.humidity || 65,
        pressure: data.main?.pressure || 1013,
        windSpeed: data.wind?.speed || 3.5,
        cloudiness: data.clouds?.all || 40,
      };
    } catch (error) {
      console.warn("Weather fetch failed:", error);
      return null;
    }
  };

  // Simulate NASA MODIS/Landsat data for vegetation and land use
  const fetchSatelliteData = async (lat, lon) => {
    try {
      const urbanDensity = calculateUrbanDensity(lat, lon);
      const vegetationIndex = calculateNDVI(lat, lon);
      const waterBodies = detectWaterBodies(lat, lon);

      return {
        urbanDensity,
        vegetationIndex,
        waterBodies,
        landSurfaceTemp: await estimateLandSurfaceTemperature(lat, lon),
        carbonEmissions: estimateCarbonEmissions(lat, lon, urbanDensity),
      };
    } catch (error) {
      console.warn("Satellite data processing failed:", error);
      return null;
    }
  };

  // Helper functions for NASA data simulation
  const calculateUrbanDensity = (lat, lon) => {
    const majorCities = {
      chittagong: { lat: 22.3569, lon: 91.7832, density: 75 },
      dhaka: { lat: 23.8103, lon: 90.4125, density: 95 },
      mumbai: { lat: 19.076, lon: 72.8777, density: 85 },
      delhi: { lat: 28.6139, lon: 77.209, density: 90 },
      bangalore: { lat: 12.9716, lon: 77.5946, density: 75 },
    };

    let nearestCity = null;
    let minDistance = Infinity;

    Object.entries(majorCities).forEach(([city, coords]) => {
      const distance = Math.sqrt(
        Math.pow(lat - coords.lat, 2) + Math.pow(lon - coords.lon, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = coords;
      }
    });

    const distanceFactor = Math.max(0.3, 1 - minDistance * 50);
    return nearestCity ? Math.round(nearestCity.density * distanceFactor) : 45;
  };

  const calculateNDVI = (lat, lon) => {
    const seasonalFactor = Math.sin((new Date().getMonth() / 12) * 2 * Math.PI) * 0.2 + 0.8;
    const baseNDVI = Math.random() * 0.3 + 0.2;
    return Math.round(baseNDVI * seasonalFactor * 100);
  };

  const detectWaterBodies = (lat, lon) => {
    const coastalCities = [
      { lat: 22.3569, lon: 91.7832 }, // Chittagong
      { lat: 19.076, lon: 72.8777 }, // Mumbai
      { lat: 13.0827, lon: 80.2707 }, // Chennai
    ];

    const isCoastal = coastalCities.some(
      (city) => Math.abs(lat - city.lat) < 0.5 && Math.abs(lon - city.lon) < 0.5
    );

    return isCoastal ? Math.random() * 30 + 40 : Math.random() * 20 + 10;
  };

  const estimateLandSurfaceTemperature = async (lat, lon) => {
    const baseTemp = 25 + (Math.abs(lat) < 20 ? 8 : 0);
    const urbanHeatIsland = calculateUrbanDensity(lat, lon) * 0.15;
    const seasonalVariation = Math.sin((new Date().getMonth() / 12) * 2 * Math.PI) * 8;
    return Math.round(baseTemp + urbanHeatIsland + seasonalVariation);
  };

  const estimateCarbonEmissions = (lat, lon, urbanDensity) => {
    const populationFactor = urbanDensity / 100;
    const industrialFactor = Math.random() * 0.5 + 0.5;
    const transportFactor = populationFactor * 1.2;
    return Math.round((populationFactor + industrialFactor + transportFactor) * 150);
  };

  // Main function to fetch all environmental data
  const fetchEnvironmentalData = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching environmental data for:", lat, lon);

      const [nasaImageryData, airQualityData, weatherData, satelliteData] = await Promise.allSettled([
        fetchNASAImagery(lat, lon),
        fetchAirQualityData(lat, lon),
        fetchWeatherData(lat, lon),
        fetchSatelliteData(lat, lon),
      ]);

      const combinedData = processEnvironmentalData({
        nasaImagery: nasaImageryData.status === "fulfilled" ? nasaImageryData.value : null,
        airQuality: airQualityData.status === "fulfilled" ? airQualityData.value : null,
        weather: weatherData.status === "fulfilled" ? weatherData.value : null,
        satellite: satelliteData.status === "fulfilled" ? satelliteData.value : null,
      });

      setEnvironmentalData(combinedData);
      updatePollutionZones(lat, lon, combinedData);

      const healthScore = calculateHealthScore(combinedData);
      setCurrentHealthScore(healthScore);
      setProjectedHealthScore(Math.min(100, healthScore + 27));

    } catch (error) {
      console.error("Error fetching environmental data:", error);
      setError("Failed to fetch environmental data from NASA APIs. Using fallback data.");

      const fallbackData = generateEnhancedMockData(lat, lon);
      setEnvironmentalData(fallbackData);
      setCurrentHealthScore(calculateHealthScore(fallbackData));
    } finally {
      setLoading(false);
    }
  };

  // Process and combine all environmental data
  const processEnvironmentalData = ({ nasaImagery, airQuality, weather, satellite }) => {
    return {
      airQuality: airQuality ? airQuality.aqi : Math.random() * 40 + 30,
      pm2_5: airQuality?.pm2_5 || Math.random() * 30 + 15,
      pm10: airQuality?.pm10 || Math.random() * 50 + 25,
      co2: airQuality?.co || Math.random() * 200 + 300,
      no2: airQuality?.no2 || Math.random() * 30 + 20,

      temperature: weather?.temperature || Math.random() * 15 + 25,
      humidity: weather?.humidity || Math.random() * 30 + 50,
      windSpeed: weather?.windSpeed || Math.random() * 5 + 2,

      greenCover: satellite?.vegetationIndex || Math.random() * 30 + 15,
      urbanDensity: satellite?.urbanDensity || calculateUrbanDensity(coordinates[0], coordinates[1]),
      waterQuality: satellite?.waterBodies || Math.random() * 25 + 40,
      landSurfaceTemp: satellite?.landSurfaceTemp || Math.random() * 15 + 25,

      noise: Math.min(100, (satellite?.urbanDensity || 50) + Math.random() * 20),
      carbonFootprint: satellite?.carbonEmissions || Math.random() * 100 + 200,

      lastUpdated: new Date().toISOString(),
    };
  };

  const generateEnhancedMockData = (lat, lon) => {
    const urbanDensity = calculateUrbanDensity(lat, lon);
    const isUrban = urbanDensity > 60;

    return {
      airQuality: isUrban ? Math.random() * 40 + 40 : Math.random() * 20 + 20,
      greenCover: isUrban ? Math.random() * 20 + 10 : Math.random() * 40 + 30,
      waterQuality: Math.random() * 25 + 40,
      noise: isUrban ? Math.random() * 20 + 60 : Math.random() * 20 + 35,
      temperature: Math.random() * 15 + 25,
      humidity: Math.random() * 30 + 50,
      co2: isUrban ? Math.random() * 200 + 400 : Math.random() * 100 + 200,
      carbonFootprint: isUrban ? Math.random() * 150 + 250 : Math.random() * 100 + 150,
      pm2_5: isUrban ? Math.random() * 30 + 20 : Math.random() * 15 + 5,
      pm10: isUrban ? Math.random() * 50 + 30 : Math.random() * 25 + 10,
      no2: isUrban ? Math.random() * 40 + 20 : Math.random() * 20 + 10,
      windSpeed: Math.random() * 5 + 2,
      urbanDensity: urbanDensity,
      landSurfaceTemp: Math.random() * 15 + 25,
      lastUpdated: new Date().toISOString(),
    };
  };

  const updatePollutionZones = (lat, lon, data) => {
    const zones = [];
    if (data.airQuality > 60) {
      zones.push({
        id: "air_pollution",
        coordinates: [
          [lat + 0.01, lon - 0.01],
          [lat + 0.01, lon + 0.01],
          [lat - 0.01, lon + 0.01],
          [lat - 0.01, lon - 0.01],
        ],
        level: data.airQuality > 80 ? "high" : "moderate",
        type: "air_pollution",
        value: data.airQuality,
      });
    }
    setPollutionZones(zones);
  };

  const calculateHealthScore = (data) => {
    const weights = {
      airQuality: 0.25,
      greenCover: 0.2,
      waterQuality: 0.15,
      noise: 0.12,
      carbonFootprint: 0.1,
      temperature: 0.08,
      humidity: 0.05,
      windSpeed: 0.05,
    };

    let score = 0;
    score += (100 - Math.min(100, data.airQuality)) * weights.airQuality;
    score += Math.min(100, data.greenCover * 2) * weights.greenCover;
    score += data.waterQuality * weights.waterQuality;
    score += (100 - Math.min(100, data.noise)) * weights.noise;

    const tempComfort = data.temperature >= 20 && data.temperature <= 28 ? 100 : Math.max(0, 100 - Math.abs(data.temperature - 24) * 5);
    score += tempComfort * weights.temperature;

    return Math.round(Math.max(0, Math.min(100, score)));
  };

  const handleLocationSearch = async (location) => {
    if (!location.trim()) return;

    setIsSearching(true);
    try {
      const geocodeUrl = `${EXTERNAL_APIS.geocoding}?format=json&q=${encodeURIComponent(location)}&limit=1`;
      const response = await fetch(geocodeUrl);
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const newCoords = [parseFloat(lat), parseFloat(lon)];

        setCoordinates(newCoords);
        setSelectedLocation(display_name);
        await fetchEnvironmentalData(newCoords[0], newCoords[1]);
      } else {
        setError("Location not found. Please try another search term.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Failed to search location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize map
  useEffect(() => {
    let mapInstance = null;
    let marker = null;

    const initializeMap = async () => {
      try {
        const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
        initializeLeafletIcons(L);

        if (mapRef.current && !mapInstanceRef.current) {
          mapInstance = L.map(mapRef.current).setView(coordinates, 12);
          mapInstanceRef.current = mapInstance;

          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri © NASA',
            opacity: 0.8,
          }).addTo(mapInstance);

          marker = L.marker(coordinates).addTo(mapInstance);
          markerRef.current = marker;

          marker.bindPopup(`<div>
            <strong>${selectedLocation.split(',')[0]}</strong><br/>
            Health Score: ${currentHealthScore}%<br/>
            Air Quality: ${environmentalData.airQuality?.toFixed(1)}<br/>
            Green Cover: ${environmentalData.greenCover?.toFixed(1)}%
          </div>`).openPopup();

          mapInstance.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const data = await response.json();
              const locationName = data.address?.city || data.address?.town || 'Custom Location';
              
              setCoordinates([lat, lng]);
              setSelectedLocation(locationName);
              await fetchEnvironmentalData(lat, lng);
            } catch (error) {
              console.error('Reverse geocoding failed:', error);
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setError('Failed to load map. Please refresh the page.');
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView(coordinates, 12);
      markerRef.current.setLatLng(coordinates);
      markerRef.current.setPopupContent(`<div>
        <strong>${selectedLocation.split(',')[0]}</strong><br/>
        Health Score: ${currentHealthScore}%<br/>
        Air Quality: ${environmentalData.airQuality?.toFixed(1)}<br/>
        Green Cover: ${environmentalData.greenCover?.toFixed(1)}%
      </div>`);
    }
  }, [coordinates, selectedLocation, currentHealthScore, environmentalData]);

  useEffect(() => {
    fetchEnvironmentalData(coordinates[0], coordinates[1]);
  }, []);

  const getHealthScoreColor = (score) => {
    if (score >= 70) return "#4CAF50";
    if (score >= 50) return "#FFA726";
    return "#F44336";
  };

  const getMetricColor = (value, type) => {
    switch (type) {
      case 'aqi':
        if (value <= 50) return "#4CAF50";
        if (value <= 100) return "#FFA726";
        return "#F44336";
      case 'greenCover':
        if (value >= 60) return "#4CAF50";
        if (value >= 30) return "#FFA726";
        return "#F44336";
      case 'waterQuality':
        if (value >= 70) return "#2196F3";
        if (value >= 50) return "#FFA726";
        return "#F44336";
      case 'noise':
        if (value <= 50) return "#4CAF50";
        if (value <= 70) return "#FFA726";
        return "#F44336";
      case 'temperature':
        if (value >= 20 && value <= 28) return "#4CAF50";
        return "#2196F3";
      default:
        return "#2196F3";
    }
  };

  const getMetricStatus = (value, type) => {
    switch (type) {
      case 'aqi':
        if (value <= 50) return "Good";
        if (value <= 100) return "Moderate";
        if (value <= 150) return "Unhealthy for Sensitive Groups";
        if (value <= 200) return "Unhealthy";
        return "Hazardous";
      case 'greenCover':
        if (value >= 60) return "Excellent";
        if (value >= 30) return "Good";
        return "Low";
      case 'waterQuality':
        if (value >= 70) return "Excellent";
        if (value >= 50) return "Good";
        return "Poor";
      case 'noise':
        if (value <= 50) return "Low";
        if (value <= 70) return "Moderate";
        return "High";
      case 'temperature':
        if (value >= 20 && value <= 28) return "Optimal";
        if (value < 20) return "Cool";
        return "Warm";
      default:
        return "";
    }
  };


  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search location (e.g., London, Tokyo, Paris)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLocationSearch(searchQuery)}
            className="w-full px-4 py-2 pr-20 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
          />
          <button
            onClick={() => handleLocationSearch(searchQuery)}
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-1 top-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-neutral-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
          >
            {isSearching ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Search className="w-3 h-3" />
            )}
            Search
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Map, Actions, and Simulation */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Map Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm dark:shadow-neutral-900/20 flex-1 min-h-[400px]">
            <div className="relative h-full">
              <div ref={mapRef} className="h-full w-full" />
              
              {/* Map Info Overlay */}
              <div className="absolute top-4 left-4 bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-700 z-[1000] min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-neutral-100">
                    {selectedLocation.split(',')[0]}
                  </span>
                  {loading && (
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">
                  Lat: {coordinates[0].toFixed(4)}, Lon: {coordinates[1].toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
              Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Plant More Trees", desc: "Increase green cover from 35% to 47%", icon: "🌳" },
                { title: "Adopt Rooftop Solar", desc: "Reduce carbon footprint by 20-30%", icon: "☀️" },
                { title: "Preserve Waterbodies", desc: "Improve water quality index", icon: "💧" },
                { title: "Improve Public Transport", desc: "Reduce air pollution significantly", icon: "🚊" }
              ].map((action, idx) => (
                <div key={idx} className="flex items-center bg-gray-50 dark:bg-neutral-700/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                  <div className="text-2xl mr-3">{action.icon}</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-neutral-100">{action.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-neutral-400">{action.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Simulation Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-1">
                  Environmental Impact Simulator
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Adjust parameters to see real-time environmental impact
                </p>
              </div>
              <button
                onClick={() => {
                  setSimulationValues({
                    greenCover: 35,
                    solarAdoption: 20,
                    publicTransport: 40,
                    wasteRecycling: 30,
                    waterConservation: 45,
                  });
                  showNotification('Simulation parameters reset.', 'info');
                }}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-lg transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Simulation Controls */}
            <div className="space-y-6">
              {[
                {
                  id: 'greenCover',
                  label: 'Green Cover',
                  icon: '🌳',
                  unit: '%',
                  min: 0,
                  max: 100,
                  step: 5,
                  color: '#4CAF50',
                },
                {
                  id: 'solarAdoption',
                  label: 'Solar Energy Adoption',
                  icon: '☀️',
                  unit: '%',
                  min: 0,
                  max: 100,
                  step: 5,
                  color: '#FF9800',
                },
                {
                  id: 'publicTransport',
                  label: 'Public Transport Usage',
                  icon: '🚊',
                  unit: '%',
                  min: 0,
                  max: 100,
                  step: 5,
                  color: '#2196F3',
                },
                {
                  id: 'wasteRecycling',
                  label: 'Waste Recycling Rate',
                  icon: '♻️',
                  unit: '%',
                  min: 0,
                  max: 100,
                  step: 5,
                  color: '#8BC34A',
                },
                {
                  id: 'waterConservation',
                  label: 'Water Conservation',
                  icon: '💧',
                  unit: '%',
                  min: 0,
                  max: 100,
                  step: 5,
                  color: '#00BCD4',
                },
              ].map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{param.icon}</span>
                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                        {param.label}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-neutral-100 min-w-[3rem] text-right">
                        {simulationValues[param.id]}{param.unit}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSimulationChange(param.id, [Math.max(param.min, simulationValues[param.id] - param.step)])}
                          className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded text-gray-600 dark:text-neutral-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleSimulationChange(param.id, [Math.min(param.max, simulationValues[param.id] + param.step)])}
                          className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded text-gray-600 dark:text-neutral-300 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shadcn Slider */}
                  <Slider
                    value={[simulationValues[param.id]]}
                    onValueChange={(value) => handleSimulationChange(param.id, value)}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Simulated Impact Results */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Projected Environmental Impact
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: 'Temperature',
                    current: environmentalData.temperature,
                    simulated: calculateSimulatedValue('temperature'),
                    unit: '°C',
                    icon: '🌡️',
                    inverse: true
                  },
                  {
                    label: 'Air Quality',
                    current: environmentalData.airQuality,
                    simulated: calculateSimulatedValue('airQuality'),
                    unit: ' AQI',
                    icon: '💨',
                    inverse: true
                  },
                  {
                    label: 'Carbon Footprint',
                    current: environmentalData.carbonFootprint,
                    simulated: calculateSimulatedValue('carbonFootprint'),
                    unit: ' kg',
                    icon: '🏭',
                    inverse: true
                  },
                  {
                    label: 'Water Quality',
                    current: environmentalData.waterQuality,
                    simulated: calculateSimulatedValue('waterQuality'),
                    unit: '%',
                    icon: '💧',
                    inverse: false
                  },
                  {
                    label: 'Noise Level',
                    current: environmentalData.noise,
                    simulated: calculateSimulatedValue('noise'),
                    unit: ' dB',
                    icon: '🔊',
                    inverse: true
                  },
                  {
                    label: 'Health Score',
                    current: currentHealthScore,
                    simulated: calculateSimulatedHealthScore(),
                    unit: '',
                    icon: '❤️',
                    inverse: false
                  },
                ].map((metric, idx) => {
                  const change = metric.simulated - metric.current;
                  const isImprovement = metric.inverse ? change < 0 : change > 0;
                  
                  return (
                    <div key={idx} className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{metric.icon}</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
                          {metric.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                          {metric.current?.toFixed(1)}{metric.unit}
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="text-sm font-bold text-gray-900 dark:text-neutral-100">
                          {metric.simulated?.toFixed(1)}{metric.unit}
                        </div>
                      </div>
                      
                      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                        isImprovement 
                          ? 'text-green-600 dark:text-green-400' 
                          : change === 0 
                          ? 'text-gray-500 dark:text-neutral-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {change !== 0 && (
                          <svg className={`w-3 h-3 ${isImprovement ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>
                          {change === 0 ? 'No change' : `${isImprovement ? '' : '+'}${Math.abs(change).toFixed(1)}${metric.unit}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Apply Simulation Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <button
                onClick={applySimulation}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Apply Simulation to Map
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-neutral-400 mt-2">
                See how these changes would affect your city's environment
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Metrics, Health Score, Suggestions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Environmental Metrics Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
              Environmental Metrics
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Air Quality Index", value: environmentalData.airQuality, type: 'aqi', unit: '' },
                { label: "PM2.5", value: environmentalData.pm2_5, type: 'aqi', unit: ' µg/m³' },
                { label: "PM10", value: environmentalData.pm10, type: 'aqi', unit: ' µg/m³' },
                { label: "NO2", value: environmentalData.no2, type: 'aqi', unit: ' µg/m³' },
                { label: "Green Cover", value: environmentalData.greenCover, type: 'greenCover', unit: '%' },
                { label: "Water Quality", value: environmentalData.waterQuality, type: 'waterQuality', unit: '%' },
                { label: "Noise Pollution", value: environmentalData.noise, type: 'noise', unit: ' dB' },
                { label: "Temperature", value: environmentalData.temperature, type: 'temperature', unit: '°C' },
                { label: "Humidity", value: environmentalData.humidity, type: 'default', unit: '%' },
                { label: "Wind Speed", value: environmentalData.windSpeed, type: 'default', unit: ' m/s' },
                { label: "CO2", value: environmentalData.co2, type: 'default', unit: ' ppm' },
                { label: "Carbon Footprint", value: environmentalData.carbonFootprint, type: 'default', unit: ' kgCO2e' },
                { label: "Urban Density", value: environmentalData.urbanDensity, type: 'default', unit: '%' },
                { label: "Land Surface Temp", value: environmentalData.landSurfaceTemp, type: 'temperature', unit: '°C' },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-neutral-300">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-neutral-100">
                        {metric.value?.toFixed(1)}{metric.unit}
                      </span>
                      {metric.type !== 'default' && (
                        <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: getMetricColor(metric.value, metric.type) }}>
                          {getMetricStatus(metric.value, metric.type)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, metric.value)}%`,
                        backgroundColor: getMetricColor(metric.value, metric.type),
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Health Score Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 dark:text-neutral-100 mb-1">
                Current City Health Score
              </h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mb-6">
                Based on NASA Earth Data
              </p>
              
              {/* Circular Progress */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <svg className="transform -rotate-90" width="200" height="200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    className="dark:stroke-neutral-700"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke={getHealthScoreColor(currentHealthScore)}
                    strokeWidth="12"
                    strokeDasharray={`${(currentHealthScore / 100) * 534.07} 534.07`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-gray-900 dark:text-neutral-100">
                    {currentHealthScore}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                    Health Score
                  </span>
                </div>
              </div>

              {/* Score Range Indicator */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 px-4">
                <span>Poor (0)</span>
                <span>Excellent (100)</span>
              </div>

              {/* Status Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                   style={{ 
                     backgroundColor: `${getHealthScoreColor(currentHealthScore)}20`,
                     color: getHealthScoreColor(currentHealthScore)
                   }}>
                <div className="w-2 h-2 rounded-full" 
                     style={{ backgroundColor: getHealthScoreColor(currentHealthScore) }}></div>
                {currentHealthScore >= 70 ? 'Good' : currentHealthScore >= 50 ? 'Moderate' : 'Needs Improvement'}
              </div>
            </div>
          </div>

          {/* After Suggested Actions Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 shadow-sm dark:shadow-neutral-900/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-green-800 dark:text-green-300">
                  After Suggested Actions
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Projected Improvements
                </p>
              </div>
            </div>

            {/* Improvement Metrics */}
            <div className="space-y-3 mb-6">
              {[
                { 
                  label: "Temperature", 
                  current: environmentalData.temperature?.toFixed(1), 
                  projected: (environmentalData.temperature - 2)?.toFixed(1),
                  unit: "°C",
                  icon: "🌡️"
                },
                { 
                  label: "Air Quality Index", 
                  current: environmentalData.airQuality?.toFixed(0), 
                  projected: Math.max(15, environmentalData.airQuality - 15)?.toFixed(0),
                  unit: "",
                  icon: "💨"
                },
                { 
                  label: "Green Cover", 
                  current: environmentalData.greenCover?.toFixed(0), 
                  projected: (environmentalData.greenCover + 12)?.toFixed(0),
                  unit: "%",
                  icon: "🌳"
                },
                { 
                  label: "Water Quality", 
                  current: environmentalData.waterQuality?.toFixed(0), 
                  projected: Math.min(100, environmentalData.waterQuality + 8)?.toFixed(0),
                  unit: "%",
                  icon: "💧"
                },
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 dark:bg-neutral-800/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{metric.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                      {metric.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">
                      {metric.current}{metric.unit}
                    </span>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {metric.projected}{metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Projected Health Score */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Projected Health Score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {projectedHealthScore}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      +{projectedHealthScore - currentHealthScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full h-3 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${projectedHealthScore}%` }}
                  ></div>
                </div>
                
                {/* Current Score Marker */}
                <div 
                  className="absolute top-0 h-3 w-1 bg-orange-500 rounded-full"
                  style={{ left: `${currentHealthScore}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    Current: {currentHealthScore}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 mt-2">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            {/* Action Summary */}
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">
                    Implementation Timeline
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    These improvements can be achieved within 6-12 months with consistent implementation of suggested actions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-neutral-900/90 flex flex-col justify-center items-center z-[10000] text-white">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg mb-2">Loading NASA Environmental Data...</p>
          <small className="text-gray-400">Fetching satellite imagery, air quality, and climate data</small>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-[10000] max-w-sm flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-[10000] max-w-md animate-slide-up`}>
          <div className={`rounded-lg shadow-lg border p-4 flex items-start gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : notification.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <span className={`flex-shrink-0 ${
              notification.type === 'success' ? 'text-green-600 dark:text-green-400' :
              notification.type === 'error' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {notification.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800 dark:text-green-300' :
                notification.type === 'error' ? 'text-red-800 dark:text-red-300' :
                'text-blue-800 dark:text-blue-300'
              }`}>
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)} 
              className="ml-auto text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrbanBalancePage;
