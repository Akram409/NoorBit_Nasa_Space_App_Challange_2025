import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Thermometer,
  Wind,
  Leaf,
  Droplets,
  CloudRain,
  Download,
  Share,
  Play,
  RefreshCw,
  Activity,
  Search,
  Layers,
} from "lucide-react";


// **Data Service Class with Geocoding**
class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // **Geocoding Service**
  async geocodeLocation(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          name: data[0].display_name.split(",")[0],
          fullName: data[0].display_name,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  // **Reverse Geocoding**
  async reverseGeocode(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      if (data) {
        return {
          name:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Unknown",
          fullName: data.display_name,
        };
      }
      return { name: "Unknown Location", fullName: "" };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return { name: "Unknown Location", fullName: "" };
    }
  }

  // **Enhanced data methods with location-based variations**
  async getAirQuality(lat, lon) {
    const cacheKey = `aqi_${lat}_${lon}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Simulate location-based variations
      const baseAQI = 30 + (Math.abs(lat) / 90) * 20;
      const variation = Math.random() * 20;
      const aqi = Math.floor(baseAQI + variation);

      let status = "Good";
      if (aqi > 50) status = "Moderate";
      if (aqi > 100) status = "Unhealthy";

      const result = {
        aqi,
        pm25: Math.floor(aqi * 0.4),
        status,
      };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      return { aqi: 45, pm25: 12, status: "Good" };
    }
  }

  async getTemperature(lat, lon) {
    const cacheKey = `temp_${lat}_${lon}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Temperature based on latitude
      const baseTemp = 30 - Math.abs(lat) / 3;
      const variation = Math.random() * 5 - 2.5;
      const temp = Math.floor(baseTemp + variation);

      const result = {
        value: temp,
        urban: temp + 3,
        rural: temp - 1.2,
      };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      return { value: 22, urban: 25, rural: 21.8 };
    }
  }

  async getGreenCover(lat, lon) {
    try {
      // Simulate based on location
      const baseGreen = 20 + Math.random() * 30;
      const trend = Math.random() > 0.5 ? "increasing" : "stable";

      return {
        percentage: Math.floor(baseGreen),
        trend,
      };
    } catch (error) {
      return { percentage: 35, trend: "stable" };
    }
  }

  async getWaterQuality(lat, lon) {
    try {
      const quality = Math.floor(60 + Math.random() * 30);
      let status = "Good";
      if (quality < 70) status = "Moderate";
      if (quality < 50) status = "Poor";

      return {
        quality,
        status,
      };
    } catch (error) {
      return { quality: 75, status: "Good" };
    }
  }

  async getFloodRisk(lat, lon) {
    try {
      const riskValue = Math.random();
      let risk = "Low";
      if (riskValue > 0.7) risk = "High";
      else if (riskValue > 0.4) risk = "Moderate";

      return {
        risk,
        probability: Math.floor(riskValue * 100),
      };
    } catch (error) {
      return { risk: "Low", probability: 15 };
    }
  }
}

const dataService = new DataService();

// **Map Component**
const MapComponent = ({
  onLocationSelect,
  selectedLocation,
  searchQuery,
  activeKPIs = {},
  liveData = {},
}) => {
  const temperature = liveData?.temperature || null;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const layersRef = useRef({
    temperature: temperature,
    airPollution: null,
    greenCover: null,
    waterPollution: null,
    flood: null,
  });

  // heatmap data**
  const generateHeatmapData = (center, type) => {
    const points = [];


    

    if (type === "temperature") {
      // Create multiple heat centers for blob-like patterns
      const heatCenters = [];
      const numCenters = 3 + Math.floor(Math.random() * 4); // 3-6 heat centers

      // Generate heat center locations
      for (let i = 0; i < numCenters; i++) {
        heatCenters.push({
          lat: center.lat + (Math.random() - 0.5) * 0.1,
          lon: center.lon + (Math.random() - 0.5) * 0.1,
          intensity: 0.5 + Math.random() * 0.5,
          radius: 0.02 + Math.random() * 0.03,
        });
      }

      // Generate points around each heat center
      heatCenters.forEach((heatCenter) => {
        // Core points (high intensity)
        for (let i = 0; i < 30; i++) {
          const angle = (Math.PI * 2 * i) / 30;
          const distance = Math.random() * heatCenter.radius * 0.3;

          points.push([
            heatCenter.lat + Math.sin(angle) * distance,
            heatCenter.lon + Math.cos(angle) * distance,
            heatCenter.intensity * (0.8 + Math.random() * 0.2),
          ]);
        }

        // Mid-range points (medium intensity)
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = heatCenter.radius * (0.3 + Math.random() * 0.4);

          points.push([
            heatCenter.lat + Math.sin(angle) * distance,
            heatCenter.lon + Math.cos(angle) * distance,
            heatCenter.intensity * (0.4 + Math.random() * 0.3),
          ]);
        }

        // Outer points (low intensity)
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = heatCenter.radius * (0.7 + Math.random() * 0.5);

          points.push([
            heatCenter.lat + Math.sin(angle) * distance,
            heatCenter.lon + Math.cos(angle) * distance,
            heatCenter.intensity * (0.1 + Math.random() * 0.2),
          ]);
        }
      });

      // Add connecting points between heat centers
      for (let i = 0; i < heatCenters.length - 1; i++) {
        const center1 = heatCenters[i];
        const center2 = heatCenters[i + 1];

        // Create gradient between centers
        for (let j = 0; j < 20; j++) {
          const t = j / 20;
          const lat = center1.lat + (center2.lat - center1.lat) * t;
          const lon = center1.lon + (center2.lon - center1.lon) * t;
          const intensity =
            center1.intensity + (center2.intensity - center1.intensity) * t;

          // Add some randomness to create natural edges
          for (let k = 0; k < 5; k++) {
            points.push([
              lat + (Math.random() - 0.5) * 0.01,
              lon + (Math.random() - 0.5) * 0.01,
              intensity * (0.3 + Math.random() * 0.4),
            ]);
          }
        }
      }
    } else {
      // Original implementation for other types
      const radius = 0.5;
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const distance = Math.random() * radius;
        const lat = center.lat + Math.sin(angle) * distance;
        const lng = center.lon + Math.cos(angle) * distance;

        let intensity;
        switch (type) {
          case "airPollution":
            intensity = 0.2 + Math.random() * 0.6;
            break;
          case "flood":
            intensity = Math.random() * 0.5;
            break;
          default:
            intensity = Math.random();
        }

        points.push([lat, lng, intensity]);
      }
    }

    return points;
  };

    // **Generate pollution heatmap data**
const generatePollutionHeatmap = (center, aqiValue) => {
  const points = [];
  
  // Create irregular pollution clouds based on AQI severity
  const severity = aqiValue / 200; // Normalize to 0-1 scale
  const numClouds = Math.floor(severity * 5) + 3; // 3-8 clouds
  
  // Generate pollution cloud centers with wind drift
  const windDirection = Math.random() * Math.PI * 2;
  const windStrength = 0.02 + severity * 0.03;
  
  const pollutionClouds = [];
  for (let i = 0; i < numClouds; i++) {
    // Drift clouds in wind direction
    const driftAmount = windStrength * (i / numClouds);
    pollutionClouds.push({
      lat: center.lat + (Math.random() - 0.5) * 0.1 + Math.sin(windDirection) * driftAmount,
      lon: center.lon + (Math.random() - 0.5) * 0.1 + Math.cos(windDirection) * driftAmount,
      intensity: severity * (0.6 + Math.random() * 0.4),
      radius: 0.02 + Math.random() * 0.05,
      shape: Math.random() // For irregular shapes
    });
  }
  
  // Create organic blob patterns
  pollutionClouds.forEach(cloud => {
    // Dense core with irregular shape
    const numCorePoints = 100;
    for (let i = 0; i < numCorePoints; i++) {
      const angle = (Math.PI * 2 * i) / numCorePoints;
      // Add noise to radius for irregular shape
      const noiseRadius = cloud.radius * (0.3 + Math.random() * 0.4);
      const wobble = Math.sin(angle * 3 + cloud.shape) * 0.3 + 1;
      
      points.push([
        cloud.lat + Math.sin(angle) * noiseRadius * wobble,
        cloud.lon + Math.cos(angle) * noiseRadius * wobble,
        cloud.intensity * (0.8 + Math.random() * 0.2)
      ]);
    }
    
    // Diffusion zone with particles
    const numDiffusionPoints = 150;
    for (let i = 0; i < numDiffusionPoints; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = cloud.radius * (0.5 + Math.random() * 1.5);
      // Exponential decay for natural diffusion
      const decayFactor = Math.exp(-distance / cloud.radius);
      
      points.push([
        cloud.lat + Math.sin(angle) * distance,
        cloud.lon + Math.cos(angle) * distance,
        cloud.intensity * decayFactor * (0.2 + Math.random() * 0.6)
      ]);
    }
  });
  
  // Add connecting streams between clouds
  for (let i = 0; i < pollutionClouds.length - 1; i++) {
    const cloud1 = pollutionClouds[i];
    const cloud2 = pollutionClouds[i + 1];
    
    // Create turbulent flow between clouds
    const numStreamPoints = 50;
    for (let j = 0; j < numStreamPoints; j++) {
      const t = j / numStreamPoints;
      const lat = cloud1.lat + (cloud2.lat - cloud1.lat) * t;
      const lon = cloud1.lon + (cloud2.lon - cloud1.lon) * t;
      
      // Add turbulence
      const turbulence = 0.01 * Math.sin(t * Math.PI * 4);
      const intensity = cloud1.intensity + (cloud2.intensity - cloud1.intensity) * t;
      
      points.push([
        lat + (Math.random() - 0.5) * turbulence,
        lon + (Math.random() - 0.5) * turbulence,
        intensity * (0.4 + Math.random() * 0.4)
      ]);
    }
  }
  
  return points;
};

  // **Create visualization layers**
  const createVisualizationLayers = (L, map) => {

    // Temperature Heatmap Layer
    if (activeKPIs.temperature && temperature) {
      if (layersRef.current.temperature) {
        map.removeLayer(layersRef.current.temperature);
      }

      const heatData = generateHeatmapData(selectedLocation, "temperature");

      layersRef.current.temperature = L.heatLayer(heatData, {
        radius: 35, // Increased radius for more overlap
        blur: 25, // Increased blur for smoother gradients
        maxZoom: 17,
        max: 1.0, // Maximum intensity value
        gradient: {
          0.0: "rgba(0, 0, 255, 0)", // Transparent blue
          0.2: "rgba(0, 100, 255, 0.5)", // Light blue
          0.4: "rgba(0, 255, 255, 0.7)", // Cyan
          0.5: "rgba(0, 255, 0, 0.8)", // Green
          0.6: "rgba(255, 255, 0, 0.9)", // Yellow
          0.8: "rgba(255, 100, 0, 0.95)", // Orange
          1.0: "rgba(255, 0, 0, 1)", // Red
        },
        minOpacity: 0.05, // Minimum opacity for subtle edges
      }).addTo(map);
    } else if (layersRef.current.temperature) {
      map.removeLayer(layersRef.current.temperature);
      layersRef.current.temperature = null;
    }

    // Air Pollution Circles
if (activeKPIs.airPollution && liveData.airPollution) {
  if (layersRef.current.airPollution) {
    map.removeLayer(layersRef.current.airPollution);
  }

  const layers = [];
  
  // Determine gradient based on AQI value
  const getAQIGradient = (aqi) => {
    if (aqi <= 50) { // Good - Green
      return {
        0.0: "rgba(0, 228, 0, 0)",
        0.2: "rgba(0, 228, 0, 0.2)",
        0.4: "rgba(0, 228, 0, 0.3)",
        0.6: "rgba(0, 228, 0, 0.4)",
        0.8: "rgba(0, 228, 0, 0.5)",
        1.0: "rgba(0, 228, 0, 0.6)"
      };
    } else if (aqi <= 100) { // Moderate - Yellow
      return {
        0.0: "rgba(255, 255, 0, 0)",
        0.2: "rgba(255, 255, 0, 0.2)",
        0.4: "rgba(255, 220, 0, 0.3)",
        0.6: "rgba(255, 200, 0, 0.4)",
        0.8: "rgba(255, 180, 0, 0.5)",
        1.0: "rgba(255, 160, 0, 0.6)"
      };
    } else if (aqi <= 150) { // Unhealthy for Sensitive - Orange
      return {
        0.0: "rgba(255, 126, 0, 0)",
        0.2: "rgba(255, 126, 0, 0.3)",
        0.4: "rgba(255, 106, 0, 0.4)",
        0.6: "rgba(255, 86, 0, 0.5)",
        0.8: "rgba(255, 66, 0, 0.6)",
        1.0: "rgba(255, 46, 0, 0.7)"
      };
    } else if (aqi <= 200) { // Unhealthy - Red
      return {
        0.0: "rgba(255, 0, 0, 0)",
        0.2: "rgba(255, 0, 0, 0.3)",
        0.4: "rgba(235, 0, 0, 0.4)",
        0.6: "rgba(215, 0, 0, 0.5)",
        0.8: "rgba(195, 0, 0, 0.6)",
        1.0: "rgba(175, 0, 0, 0.7)"
      };
    } else { // Hazardous - Purple
      return {
        0.0: "rgba(143, 63, 151, 0)",
        0.2: "rgba(143, 63, 151, 0.4)",
        0.4: "rgba(123, 43, 131, 0.5)",
        0.6: "rgba(103, 23, 111, 0.6)",
        0.8: "rgba(83, 3, 91, 0.7)",
        1.0: "rgba(63, 0, 71, 0.8)"
      };
    }
  };

  // Create main pollution heatmap
  const pollutionData = generatePollutionHeatmap(
    selectedLocation,
    liveData.airPollution.aqi
  );

  const pollutionHeatLayer = L.heatLayer(pollutionData, {
    radius: 45,
    blur: 35,
    maxZoom: 17,
    max: 1.0,
    gradient: getAQIGradient(liveData.airPollution.aqi),
    minOpacity: 0.05
  });

  layers.push(pollutionHeatLayer);
  
  // Add particle overlay for PM2.5 visualization
  const createParticles = () => {
    const particleMarkers = [];
    const numParticles = Math.floor(liveData.airPollution.aqi / 2);
    
    for (let i = 0; i < numParticles; i++) {
      const offset = 0.05;
      const lat = selectedLocation.lat + (Math.random() - 0.5) * offset;
      const lon = selectedLocation.lon + (Math.random() - 0.5) * offset;
      const size = 1 + Math.random() * 3;
      
      const particleIcon = L.divIcon({
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          border-radius: 50%;
          animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        "></div>`,
        className: 'pollution-particle',
        iconSize: [size, size]
      });
      
      const particle = L.marker([lat, lon], { 
        icon: particleIcon,
        interactive: false,
        zIndexOffset: -1000
      });
      
      particleMarkers.push(particle);
    }
    
    return L.layerGroup(particleMarkers);
  };
  
  // Add particles if AQI is high
  if (liveData.airPollution.aqi > 50) {
    layers.push(createParticles());
  }

  layersRef.current.airPollution = L.layerGroup(layers).addTo(map);
} else if (layersRef.current.airPollution) {
      map.removeLayer(layersRef.current.airPollution);
      layersRef.current.airPollution = null;
    }

    // Green Cover Polygons
    if (activeKPIs.greenCover && liveData.greenCover) {
      if (layersRef.current.greenCover) {
        map.removeLayer(layersRef.current.greenCover);
      }

      const polygons = [];
      for (let i = 0; i < 8; i++) {
        const baseOffset = 0.015;
        const centerLat =
          selectedLocation.lat + (Math.random() - 0.5) * baseOffset * 3;
        const centerLng =
          selectedLocation.lon + (Math.random() - 0.5) * baseOffset * 3;

        const points = [];
        for (let j = 0; j < 6; j++) {
          const angle = (Math.PI * 2 * j) / 6;
          points.push([
            centerLat + Math.sin(angle) * baseOffset,
            centerLng + Math.cos(angle) * baseOffset,
          ]);
        }

        const polygon = L.polygon(points, {
          color: "#228B22",
          fillColor: "#90EE90",
          fillOpacity: 0.4,
          weight: 2,
        });
        polygons.push(polygon);
      }
      layersRef.current.greenCover = L.layerGroup(polygons).addTo(map);
    } else if (layersRef.current.greenCover) {
      map.removeLayer(layersRef.current.greenCover);
      layersRef.current.greenCover = null;
    }

    // Water Quality Markers
    if (activeKPIs.waterPollution && liveData.waterPollution) {
      if (layersRef.current.waterPollution) {
        map.removeLayer(layersRef.current.waterPollution);
      }

      const markers = [];
      for (let i = 0; i < 5; i++) {
        const offset = 0.025;
        const lat = selectedLocation.lat + (Math.random() - 0.5) * offset * 2;
        const lng = selectedLocation.lon + (Math.random() - 0.5) * offset * 2;

        const quality = liveData.waterPollution.quality;
        let iconColor = "blue";
        if (quality < 50) iconColor = "red";
        else if (quality < 70) iconColor = "orange";

        const icon = L.divIcon({
          html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; opacity: 0.7;"></div>`,
          className: "water-quality-marker",
          iconSize: [20, 20],
        });

        const marker = L.marker([lat, lng], { icon }).bindPopup(
          `Water Quality: ${quality}%`
        );
        markers.push(marker);
      }
      layersRef.current.waterPollution = L.layerGroup(markers).addTo(map);
    } else if (layersRef.current.waterPollution) {
      map.removeLayer(layersRef.current.waterPollution);
      layersRef.current.waterPollution = null;
    }

    // Flood Risk Zones
    if (activeKPIs.flood && liveData.flood) {
      if (layersRef.current.flood) {
        map.removeLayer(layersRef.current.flood);
      }

      const zones = [];
      const risk = liveData.flood.risk;
      let opacity = 0.2;
      let color = "#4169E1";

      if (risk === "High") {
        opacity = 0.4;
        color = "#8B008B";
      } else if (risk === "Moderate") {
        opacity = 0.3;
        color = "#9370DB";
      }

      // Create flood risk zones
      for (let i = 1; i <= 3; i++) {
        const circle = L.circle([selectedLocation.lat, selectedLocation.lon], {
          color: color,
          fillColor: color,
          fillOpacity: opacity / i,
          radius: 2000 * i,
          weight: 1,
          dashArray: "5, 10",
        });
        zones.push(circle);
      }

      layersRef.current.flood = L.layerGroup(zones).addTo(map);
    } else if (layersRef.current.flood) {
      map.removeLayer(layersRef.current.flood);
      layersRef.current.flood = null;
    }
  };

  useEffect(() => {
    // Initialize map
    if (mapRef.current && !mapInstanceRef.current) {
      import("leaflet").then((L) => {
        import("leaflet.heat").then(() => {
          mapInstanceRef.current = L.map(mapRef.current).setView(
            [selectedLocation.lat, selectedLocation.lon],
            12
          );

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            opacity: 0.8, // Slightly transparent to show overlays better
          }).addTo(mapInstanceRef.current);

          // Add main location marker
          const icon = L.icon({
            iconUrl:
              "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          });

          markerRef.current = L.marker(
            [selectedLocation.lat, selectedLocation.lon],
            { icon }
          )
            .addTo(mapInstanceRef.current)
            .bindPopup(`<b>${selectedLocation.name}</b>`)
            .openPopup();

          // Handle map clicks
          mapInstanceRef.current.on("click", async (e) => {
            const { lat, lng } = e.latlng;

            markerRef.current.setLatLng([lat, lng]);

            const locationInfo = await dataService.reverseGeocode(lat, lng);

            onLocationSelect(lat, lng, locationInfo.name);
          });

          // Initial layer creation
          createVisualizationLayers(L, mapInstanceRef.current);
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update visualization layers when KPIs or data change
  useEffect(() => {
    if (mapInstanceRef.current) {
      import("leaflet").then((L) => {
        import("leaflet.heat").then(() => {
          createVisualizationLayers(L, mapInstanceRef.current);
        });
      });
    }
  }, [activeKPIs, liveData, selectedLocation]);

  // Update map view when location changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView(
        [selectedLocation.lat, selectedLocation.lon],
        12
      );
      markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lon]);
    }
  }, [selectedLocation]);

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend for active KPI layers */}
      <div className="absolute bottom-20 right-4 bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-700 z-[1000]">
        <h4 className="text-xs font-semibold mb-2 text-gray-900 dark:text-neutral-100">
          Active Layers
        </h4>
        <div className="space-y-1">
          {activeKPIs.temperature && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-neutral-400">
                Temperature
              </span>
            </div>
          )}
          {activeKPIs.airPollution && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50"></div>
              <span className="text-xs text-gray-600 dark:text-neutral-400">
                Air Quality
              </span>
            </div>
          )}
          {activeKPIs.greenCover && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-neutral-400">
                Green Cover
              </span>
            </div>
          )}
          {activeKPIs.waterPollution && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600 dark:text-neutral-400">
                Water Quality
              </span>
            </div>
          )}
          {activeKPIs.flood && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded opacity-50"></div>
              <span className="text-xs text-gray-600 dark:text-neutral-400">
                Flood Risk
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// **Main KPI Page Component**
const KPIPage = () => {
  // **State Management**
  const [activeKPIs, setActiveKPIs] = useState({
    temperature: true,
    airPollution: true,
    greenCover: true,
    waterPollution: true,
    flood: true,
  });

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 40.7128,
    lon: -74.006,
    name: "New York",
  });

  const [liveData, setLiveData] = useState({
    temperature: null,
    airPollution: null,
    greenCover: null,
    waterPollution: null,
    flood: null,
  });
    // State declarations
  const [map, setMap] = useState(null);
  const [aqiValue, setAqiValue] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapType, setMapType] = useState("map");
  const [isSearching, setIsSearching] = useState(false);



// **Create animated wind flow lines**
const createWindFlowLines = (L, map, center) => {
  const windLines = [];
  const numFlows = 15; // Number of wind flow lines
  
  // Simulate wind direction (you can make this dynamic based on real data)
  const windDirection = Math.random() * Math.PI * 2;
  const windSpeed = 5 + Math.random() * 10; // km/h
  
  for (let i = 0; i < numFlows; i++) {
    // Starting position with some randomization
    const startOffset = 0.1;
    const startLat = center.lat + (Math.random() - 0.5) * startOffset * 2;
    const startLon = center.lon + (Math.random() - 0.5) * startOffset * 2;
    
    // Calculate end position based on wind direction
    const distance = 0.05 + Math.random() * 0.1;
    const endLat = startLat + Math.sin(windDirection) * distance;
    const endLon = startLon + Math.cos(windDirection) * distance;
    
    // Create curved path for more natural flow
    const midLat = (startLat + endLat) / 2 + (Math.random() - 0.5) * 0.02;
    const midLon = (startLon + endLon) / 2 + (Math.random() - 0.5) * 0.02;
    
    // Create polyline with arrow decoration
    const windLine = L.polyline(
      [[startLat, startLon], [midLat, midLon], [endLat, endLon]], 
      {
        color: 'rgba(255, 255, 255, 0.6)',
        weight: 2,
        opacity: 0.7,
        dashArray: '10, 10',
        className: `wind-flow-line wind-flow-${i}`
      }
    );
    
    windLines.push(windLine);
  }
  
  // Add CSS animation after a short delay
  setTimeout(() => {
    addWindFlowAnimation();
  }, 100);
  
  return windLines;
};

// **Add CSS animation for wind flow**
const addWindFlowAnimation = () => {
  // Check if style element already exists
  let styleElement = document.getElementById('wind-flow-animation');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'wind-flow-animation';
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = `
    @keyframes flowAnimation {
      0% {
        stroke-dashoffset: 0;
        opacity: 0.3;
      }
      50% {
        opacity: 0.8;
      }
      100% {
        stroke-dashoffset: -20;
        opacity: 0.3;
      }
    }
    
    .wind-flow-line {
      animation: flowAnimation 3s linear infinite;
    }
    
    /* Stagger animation for different lines */
    ${Array.from({length: 15}, (_, i) => `
      .wind-flow-${i} {
        animation-delay: ${i * 0.2}s;
      }
    `).join('')}
    
    /* Arrow markers for wind direction */
    .wind-arrow {
      animation: pulseArrow 2s ease-in-out infinite;
    }
    
    @keyframes pulseArrow {
      0%, 100% {
        transform: scale(1);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
    }
  `;
};

// **Create wind particle system**
const createWindParticles = (L, map, center) => {
  const particles = [];
  const numParticles = 30;
  
  class WindParticle {
    constructor(L, map, center) {
      this.L = L;
      this.map = map;
      this.reset(center);
      this.createMarker();
    }
    
    reset(center) {
      this.lat = center.lat + (Math.random() - 0.5) * 0.2;
      this.lon = center.lon + (Math.random() - 0.5) * 0.2;
      this.speed = 0.001 + Math.random() * 0.002;
      this.direction = Math.random() * Math.PI * 2;
      this.opacity = Math.random();
      this.size = 2 + Math.random() * 4;
    }
    
    createMarker() {
      const icon = this.L.divIcon({
        html: `<div class="wind-particle" style="
          width: ${this.size}px; 
          height: ${this.size}px; 
          background: radial-gradient(circle, rgba(255,255,255,${this.opacity}) 0%, transparent 70%);
          border-radius: 50%;
        "></div>`,
        className: 'wind-particle-marker',
        iconSize: [this.size, this.size]
      });
      
      this.marker = this.L.marker([this.lat, this.lon], { 
        icon,
        interactive: false 
      });
    }
    
    update() {
      this.lat += Math.sin(this.direction) * this.speed;
      this.lon += Math.cos(this.direction) * this.speed;
      this.opacity *= 0.98;
      
      if (this.opacity < 0.1) {
        this.reset({ lat: this.lat, lon: this.lon });
      }
      
      this.marker.setLatLng([this.lat, this.lon]);
    }
  }
  
  // Create particles
  for (let i = 0; i < numParticles; i++) {
    const particle = new WindParticle(L, map, center);
    particles.push(particle);
  }
  
  // Animate particles
  const animateParticles = () => {
    particles.forEach(p => p.update());
    requestAnimationFrame(animateParticles);
  };
  animateParticles();
  
  return particles.map(p => p.marker);
};


  // **Toggle KPI Function**
  const toggleKPI = (kpi) => {
    setActiveKPIs((prev) => ({ ...prev, [kpi]: !prev[kpi] }));
  };

  // **Fetch Live Data Based on Location**
  const fetchLiveData = async () => {
    setIsLoading(true);
    try {
      const promises = [];

      if (activeKPIs.temperature) {
        promises.push(
          dataService
            .getTemperature(selectedLocation.lat, selectedLocation.lon)
            .then((data) => ({ key: "temperature", data }))
        );
      }

      if (activeKPIs.airPollution) {
        promises.push(
          dataService
            .getAirQuality(selectedLocation.lat, selectedLocation.lon)
            .then((data) => ({ key: "airPollution", data }))
        );
      }

      if (activeKPIs.greenCover) {
        promises.push(
          dataService
            .getGreenCover(selectedLocation.lat, selectedLocation.lon)
            .then((data) => ({ key: "greenCover", data }))
        );
      }

      if (activeKPIs.waterPollution) {
        promises.push(
          dataService
            .getWaterQuality(selectedLocation.lat, selectedLocation.lon)
            .then((data) => ({ key: "waterPollution", data }))
        );
      }

      if (activeKPIs.flood) {
        promises.push(
          dataService
            .getFloodRisk(selectedLocation.lat, selectedLocation.lon)
            .then((data) => ({ key: "flood", data }))
        );
      }

      const results = await Promise.all(promises);

      const newData = { ...liveData };
      results.forEach(({ key, data }) => {
        newData[key] = data;
      });

      setLiveData(newData);
    } catch (error) {
      console.error("Error fetching live data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // **Handle Map Click to Select Location**
  const handleMapClick = (lat, lon, name) => {
    setSelectedLocation({ lat, lon, name });
  };

  // **Handle Search**
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const location = await dataService.geocodeLocation(searchQuery);

      if (location) {
        setSelectedLocation({
          lat: location.lat,
          lon: location.lon,
          name: location.name,
        });
      } else {
        alert("Location not found. Please try another search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // **Get display value for KPI**
  const getKPIDisplayValue = (key) => {
    if (!activeKPIs[key] || !liveData[key]) {
      return { value: "--", status: "No data" };
    }

    switch (key) {
      case "temperature":
        return {
          value: `${liveData[key].value}°C`,
          status: `Urban: ${liveData[key].urban}°C`,
        };
      case "airPollution":
        return {
          value: liveData[key].aqi,
          status: liveData[key].status,
        };
      case "greenCover":
        return {
          value: `${liveData[key].percentage}%`,
          status: `Trend: ${liveData[key].trend}`,
        };
      case "waterPollution":
        return {
          value: `${liveData[key].quality}%`,
          status: liveData[key].status,
        };
      case "flood":
        return {
          value: liveData[key].risk,
          status: `Probability: ${liveData[key].probability}%`,
        };
      default:
        return { value: "--", status: "No data" };
    }
  };

  // **Fetch data when location or active KPIs change**
  useEffect(() => {
    fetchLiveData();
  }, [selectedLocation, activeKPIs]);

  // **Auto-refresh every 5 minutes**
  useEffect(() => {
    const interval = setInterval(fetchLiveData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      {/* **Main Dashboard Grid** */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* **Map Section with Live Data Overlay** */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm dark:shadow-neutral-900/20">
          <div className="relative h-full">
            {/* Actual Map Component */}
            <MapComponent
              onLocationSelect={handleMapClick}
              selectedLocation={selectedLocation}
              searchQuery={searchQuery}
              activeKPIs={activeKPIs}
              liveData={liveData}
            />

            {/* **Live Data Overlay on Map** */}
            {selectedLocation && (
              <div className="absolute bottom-4 left-4 bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-200 dark:border-neutral-700 max-w-sm z-[1000]">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-neutral-100">
                    {selectedLocation.name}
                  </span>
                  {isLoading && (
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                  )}
                </div>

                {/* Lat && Lon  */}
                {/* <div className="text-xs text-gray-500 dark:text-neutral-400 mb-2">
                  Lat: {selectedLocation.lat.toFixed(4)}, Lon: {selectedLocation.lon.toFixed(4)}
                </div> */}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {activeKPIs.temperature && liveData.temperature && (
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-red-500" />
                      <span className="text-gray-700 dark:text-neutral-300">
                        {getKPIDisplayValue("temperature").value}
                      </span>
                    </div>
                  )}

                  {activeKPIs.airPollution && liveData.airPollution && (
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-yellow-500 animate-pulse" />
                      <span className="text-gray-700 dark:text-neutral-300 text-xs">
                        AQI: {getKPIDisplayValue("airPollution").value}
                      </span>
                      <span className="text-gray-500 dark:text-neutral-400 text-xs">
                        (Wind: NE 8km/h)
                      </span>
                    </div>
                  )}

                  {activeKPIs.greenCover && liveData.greenCover && (
                    <div className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-green-500" />
                      <span className="text-gray-700 dark:text-neutral-300">
                        {getKPIDisplayValue("greenCover").value}
                      </span>
                    </div>
                  )}

                  {activeKPIs.flood && liveData.flood && (
                    <div className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-purple-500" />
                      <span className="text-gray-700 dark:text-neutral-300">
                        {getKPIDisplayValue("flood").value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Map Type Toggle */}
            <div className="absolute top-4 right-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-[1000]">
              <div className="flex">
                <button
                  onClick={() => setMapType("map")}
                  className={`px-4 py-2 text-sm font-medium border-r border-gray-200 dark:border-neutral-600 rounded-l-lg transition-colors ${
                    mapType === "map"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMapType("satellite")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                    mapType === "satellite"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700"
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/*  Search Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 z-[1000]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location (e.g., London, Tokyo, Paris)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full px-4 py-2 pr-20 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  onClick={handleSearch}
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

            {/* Zoom Controls */}
            {/* <div className="absolute top-20 right-4 flex flex-col bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-[1000]">
              <button 
                onClick={() => {
                  if (window.mapInstance) {
                    window.mapInstance.zoomIn();
                  }
                }}
                className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-t-lg transition-colors"
              >
                +
              </button>
              <div className="w-full h-px bg-gray-200 dark:bg-neutral-600"></div>
              <button 
                onClick={() => {
                  if (window.mapInstance) {
                    window.mapInstance.zoomOut();
                  }
                }}
                className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-b-lg transition-colors"
              >
                −
              </button>
            </div> */}
          </div>

          {/* Location History */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-neutral-400">
                Recent Locations:
              </span>
              <div className="flex gap-2">
                {["New York", "London", "Tokyo", "Paris"].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSearchQuery(city);
                      handleSearch();
                    }}
                    className="text-xs px-2 py-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* **KPI Controls Panel with Live Data** */}
        <div className="space-y-4">
          {/* KPI Toggles with Live Values */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
                KPI
              </h3>
              <button
                onClick={fetchLiveData}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-500 dark:text-neutral-400 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "temperature",
                  label: "Temperature",
                  icon: Thermometer,
                  color: "red",
                },
                {
                  key: "airPollution",
                  label: "Air pollution",
                  icon: Wind,
                  color: "yellow",
                },
                {
                  key: "greenCover",
                  label: "Green cover",
                  icon: Leaf,
                  color: "green",
                },
                {
                  key: "waterPollution",
                  label: "Water pollution",
                  icon: Droplets,
                  color: "blue",
                },
                {
                  key: "flood",
                  label: "Flood",
                  icon: CloudRain,
                  color: "purple",
                },
              ].map(({ key, label, icon: Icon, color }) => {
                const isActive = activeKPIs[key];
                const displayValue = getKPIDisplayValue(key);

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-700/50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleKPI(key)}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${
                            isActive
                              ? `bg-${color}-500 dark:bg-${color}-600`
                              : "bg-gray-200 dark:bg-neutral-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 after:ease-in-out peer-checked:after:translate-x-full`}
                        ></div>
                      </label>
                      <Icon
                        className={`w-4 h-4 transition-colors duration-200 ${
                          isActive
                            ? `text-${color}-600 dark:text-${color}-400`
                            : "text-gray-500 dark:text-neutral-400"
                        }`}
                      />
                      <div>
                        <span
                          className={`text-sm transition-colors duration-200 ${
                            isActive
                              ? `text-${color}-600 dark:text-${color}-400 font-semibold`
                              : "text-gray-700 dark:text-neutral-300"
                          }`}
                        >
                          {label}
                        </span>
                        {isActive && liveData[key] && (
                          <div className="text-xs text-gray-500 dark:text-neutral-500">
                            {displayValue.status}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* **Live Value Display** */}
                    {isActive && liveData[key] && (
                      <div className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                        {displayValue.value}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* **Live Data Status** */}
          {/* <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Live Data Active
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              📍 {selectedLocation.name}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div> */}

          {/* NASA Data Sources */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
              🛰️ NASA Data Sources
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <div className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>MODIS Land Surface Temperature</span>
              </div>
              <div className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Landsat NDVI Vegetation Index</span>
              </div>
              <div className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>GPM Precipitation Data</span>
              </div>
              <div className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>GEDI Forest Structure</span>
              </div>
              <div className="flex items-center gap-2 hover:text-gray-800 dark:hover:text-neutral-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>VIIRS Nighttime Lights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* **AI Climate Insights Panel with Live Data Integration** */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-800">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              AI
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
              AI Climate Insights for {selectedLocation.name}
            </h3>
            <p className="text-gray-600 dark:text-neutral-300 mb-4 leading-relaxed">
              Based on real-time satellite data and climate models for
              coordinates {selectedLocation.lat.toFixed(2)}°,{" "}
              {selectedLocation.lon.toFixed(2)}°:
              {activeKPIs.greenCover && liveData.greenCover && (
                <span>
                  {" "}
                  Current green coverage is {liveData.greenCover.percentage}%
                  with a {liveData.greenCover.trend} trend.
                </span>
              )}
              {activeKPIs.temperature && liveData.temperature && (
                <span>
                  {" "}
                  Urban heat island effect shows{" "}
                  {(
                    liveData.temperature.urban - liveData.temperature.rural
                  ).toFixed(1)}
                  °C difference.
                </span>
              )}
              {activeKPIs.flood && liveData.flood && (
                <span>
                  {" "}
                  Flood risk assessment indicates{" "}
                  {liveData.flood.risk.toLowerCase()} probability (
                  {liveData.flood.probability}%).
                </span>
              )}
            </p>

            {/* **Dynamic Impact Cards Based on Active KPIs and Location** */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {activeKPIs.temperature && liveData.temperature && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
                    <span className="font-medium text-red-700 dark:text-red-300">
                      Temperature Analysis
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Current: {liveData.temperature.value}°C
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    Urban heat: +
                    {(
                      liveData.temperature.urban - liveData.temperature.value
                    ).toFixed(1)}
                    °C
                  </p>
                </div>
              )}

              {activeKPIs.airPollution && liveData.airPollution && (
                <div
                  className={`${
                    liveData.airPollution.aqi > 50
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : "bg-green-50 dark:bg-green-900/20"
                  } rounded-lg p-4 border ${
                    liveData.airPollution.aqi > 50
                      ? "border-yellow-200 dark:border-yellow-800"
                      : "border-green-200 dark:border-green-800"
                  } hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className={`w-2 h-2 ${
                        liveData.airPollution.aqi > 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } rounded-full animate-pulse`}
                    ></div>
                    <span
                      className={`font-medium ${
                        liveData.airPollution.aqi > 50
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-green-700 dark:text-green-300"
                      }`}
                    >
                      Air Quality
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      liveData.airPollution.aqi > 50
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    AQI: {liveData.airPollution.aqi} -{" "}
                    {liveData.airPollution.status}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      liveData.airPollution.aqi > 50
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    PM2.5: {liveData.airPollution.pm25} µg/m³
                  </p>
                </div>
              )}

              {activeKPIs.greenCover && liveData.greenCover && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Vegetation Index
                    </span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Coverage: {liveData.greenCover.percentage}%
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    Trend: {liveData.greenCover.trend}
                  </p>
                </div>
              )}
            </div>

            {/* AI Recommendations based on location */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-neutral-200 mb-2">
                🤖 Location-Specific Recommendations
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-neutral-300">
                {liveData.temperature &&
                  liveData.temperature.urban - liveData.temperature.rural >
                    2 && (
                    <li>
                      • Increase urban tree canopy to reduce heat island effect
                    </li>
                  )}
                {liveData.airPollution && liveData.airPollution.aqi > 50 && (
                  <li>
                    • Implement traffic reduction measures to improve air
                    quality
                  </li>
                )}
                {liveData.greenCover && liveData.greenCover.percentage < 30 && (
                  <li>• Target 40% green coverage for optimal urban cooling</li>
                )}
                {liveData.flood && liveData.flood.probability > 30 && (
                  <li>
                    • Enhance drainage infrastructure for flood mitigation
                  </li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                <Download className="w-4 h-4" />
                <span>Export {selectedLocation.name} Report</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                <Share className="w-4 h-4" />
                <span>Share Analysis</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                <Play className="w-4 h-4" />
                <span>Run Climate Simulation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIPage;
