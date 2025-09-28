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
  const generateHeatmapData = (center, type, zoomLevel = 12) => {
    const points = [];

    // Adjust density and spread based on zoom level
    const baseRadius = zoomLevel > 14 ? 0.01 : zoomLevel > 12 ? 0.02 : 0.03;
    const numPoints = zoomLevel > 14 ? 200 : zoomLevel > 12 ? 150 : 100;

    // Create multiple temperature zones with varying intensities
    const numZones = 4 + Math.floor(Math.random() * 3); // 4-6 zones

    for (let zone = 0; zone < numZones; zone++) {
      // Create zone center near the selected location
      const zoneLat = center.lat + (Math.random() - 0.5) * baseRadius * 2;
      const zoneLon = center.lon + (Math.random() - 0.5) * baseRadius * 2;

      // Assign different temperature ranges to different zones
      let baseTemp = 20 + Math.random() * 15; // 20-35°C base temperature
      if (zone === 0) baseTemp += 5; // Hottest zone
      if (zone === numZones - 1) baseTemp -= 8; // Coolest zone

      const pointsPerZone = Math.floor(numPoints / numZones);

      for (let i = 0; i < pointsPerZone; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance =
          Math.random() * baseRadius * (0.5 + Math.random() * 0.5);

        const lat = zoneLat + Math.sin(angle) * distance;
        const lng = zoneLon + Math.cos(angle) * distance;

        // Temperature varies within the zone
        const tempVariation = (Math.random() - 0.5) * 6; // ±3°C variation
        const temperature = baseTemp + tempVariation;

        // Intensity should match the max value (10.0 in your case)
        // Scale temperature to intensity (assuming temp range 10-40°C)
        const intensity = Math.max(0, Math.min(10, (temperature - 10) / 3)); // Scale to 0-10

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
    const numClouds = Math.floor(severity * 5) + 10; // 3-8 clouds

    // Generate pollution cloud centers with wind drift
    const windDirection = Math.random() * Math.PI * 2;
    const windStrength = 0.02 + severity * 0.03;

    const pollutionClouds = [];
    for (let i = 0; i < numClouds; i++) {
      // Drift clouds in wind direction
      const driftAmount = windStrength * (i / numClouds);
      pollutionClouds.push({
        lat:
          center.lat +
          (Math.random() - 0.5) * 0.1 +
          Math.sin(windDirection) * driftAmount,
        lon:
          center.lon +
          (Math.random() - 0.5) * 0.1 +
          Math.cos(windDirection) * driftAmount,
        intensity: severity * (0.6 + Math.random() * 0.4),
        radius: 0.02 + Math.random() * 0.05,
        shape: Math.random(), // For irregular shapes
      });
    }

    // Create organic blob patterns
    pollutionClouds.forEach((cloud) => {
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
          cloud.intensity * (0.8 + Math.random() * 0.2),
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
          cloud.intensity * decayFactor * (0.2 + Math.random() * 0.6),
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
        const intensity =
          cloud1.intensity + (cloud2.intensity - cloud1.intensity) * t;

        points.push([
          lat + (Math.random() - 0.5) * turbulence,
          lon + (Math.random() - 0.5) * turbulence,
          intensity * (0.4 + Math.random() * 0.4),
        ]);
      }
    }

    return points;
  };

  const generateGreenCoverHeatmap = (center, percentage) => {
    const points = [];
    const numHotspots = Math.floor(percentage / 20) + 1; // More hotspots for higher percentage
    const baseRadius = 0.03; // Base radius for hotspots

    for (let i = 0; i < numHotspots; i++) {
      // Randomly place hotspots around the center
      const hotspotLat = center.lat + (Math.random() - 0.5) * 0.1;
      const hotspotLon = center.lon + (Math.random() - 0.5) * 0.1;
      const hotspotIntensity = 0.5 + Math.random() * 0.5; // Vary intensity

      // Generate points for each hotspot
      const numPointsPerHotspot = 50 + Math.floor(Math.random() * 50);
      for (let j = 0; j < numPointsPerHotspot; j++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * baseRadius * (0.5 + Math.random()); // Vary distance
        const lat = hotspotLat + Math.sin(angle) * distance;
        const lng = hotspotLon + Math.cos(angle) * distance;

        // Intensity decreases with distance from hotspot center
        const intensity =
          hotspotIntensity * (1 - distance / (baseRadius * 1.5));
        points.push([lat, lng, Math.max(0, intensity)]); // Ensure intensity is not negative
      }
    }

    // Add some background greenness, especially if percentage is high
    if (percentage > 30) {
      const numBackgroundPoints = 100;
      const backgroundRadius = 0.08;
      for (let i = 0; i < numBackgroundPoints; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * backgroundRadius;
        const lat = center.lat + Math.sin(angle) * distance;
        const lng = center.lon + Math.cos(angle) * distance;
        const intensity = (percentage / 100) * (0.1 + Math.random() * 0.2); // Lower intensity for background
        points.push([lat, lng, intensity]);
      }
    }

    return points;
  };

  const generateWaterQualityHeatmap = (center, qualityValue) => {
    const points = [];
    const baseRadius = 0.05; // Base radius for pollution spread
    const numPoints = 100;

    // Determine the "severity" of pollution (0 for good, 1 for bad)
    // Assuming qualityValue is 0-100, where 100 is good.
    // So, severity = (100 - qualityValue) / 100
    const severity = (100 - qualityValue) / 100;

    // Create a central "hotspot" for the water body
    const mainHotspotLat = center.lat + (Math.random() - 0.5) * 0.02;
    const mainHotspotLon = center.lon + (Math.random() - 0.5) * 0.02;

    // Generate points around the main hotspot
    for (let i = 0; i < numPoints; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * baseRadius * (0.5 + severity * 0.5); // Larger spread for worse quality

      const lat = mainHotspotLat + Math.sin(angle) * distance;
      const lng = mainHotspotLon + Math.cos(angle) * distance;

      // Intensity is higher for worse quality, and decreases with distance
      const intensity = severity * (1 - distance / (baseRadius * 1.5));
      points.push([lat, lng, Math.max(0, intensity)]); // Ensure intensity is not negative
    }

    // Add some smaller, irregular "pollution patches" if quality is moderate/poor
    if (severity > 0.3) {
      const numPatches = Math.floor(severity * 5); // More patches for worse quality
      const patchRadius = baseRadius * 0.3;

      for (let i = 0; i < numPatches; i++) {
        const patchLat = center.lat + (Math.random() - 0.5) * 0.1;
        const patchLon = center.lon + (Math.random() - 0.5) * 0.1;

        for (let j = 0; j < 30; j++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * patchRadius;
          const lat = patchLat + Math.sin(angle) * distance;
          const lng = patchLon + Math.cos(angle) * distance;
          const intensity = severity * (0.3 + Math.random() * 0.4); // Patches have moderate intensity
          points.push([lat, lng, intensity]);
        }
      }
    }

    return points;
  };

  const generateFloodRiskHeatmap = (center, riskLevel) => {
    const points = [];

    // Determine risk parameters
    let riskIntensity = 0.3; // Default for Low
    let numHotspots = 2;
    let spreadRadius = 0.04;

    if (riskLevel === "High") {
      riskIntensity = 0.8;
      numHotspots = 6;
      spreadRadius = 0.08;
    } else if (riskLevel === "Moderate") {
      riskIntensity = 0.6;
      numHotspots = 4;
      spreadRadius = 0.06;
    }

    // Create main flood-prone areas (like river valleys, low-lying areas)
    for (let i = 0; i < numHotspots; i++) {
      // Create irregular hotspots around the center
      const hotspotLat = center.lat + (Math.random() - 0.5) * 0.1;
      const hotspotLon = center.lon + (Math.random() - 0.5) * 0.1;

      // Create elongated patterns (like river courses or drainage areas)
      const elongationAngle = Math.random() * Math.PI * 2;
      const elongationFactor = 1.5 + Math.random() * 2; // Make some areas more elongated

      const numPointsPerHotspot = 40 + Math.floor(Math.random() * 60);

      for (let j = 0; j < numPointsPerHotspot; j++) {
        const angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * spreadRadius;

        // Create elongated patterns
        if (
          Math.abs(angle - elongationAngle) < Math.PI / 4 ||
          Math.abs(angle - elongationAngle - Math.PI) < Math.PI / 4
        ) {
          distance *= elongationFactor;
        }

        const lat = hotspotLat + Math.sin(angle) * distance;
        const lng = hotspotLon + Math.cos(angle) * distance;

        // Intensity varies with distance and adds some randomness
        const baseIntensity =
          riskIntensity * (1 - distance / (spreadRadius * 2));
        const intensity = Math.max(
          0,
          baseIntensity * (0.7 + Math.random() * 0.6)
        );

        points.push([lat, lng, intensity]);
      }
    }

    // Add scattered risk points (representing drainage issues, etc.)
    const numScatteredPoints = Math.floor(riskIntensity * 100);
    for (let i = 0; i < numScatteredPoints; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 0.12;
      const lat = center.lat + Math.sin(angle) * distance;
      const lng = center.lon + Math.cos(angle) * distance;
      const intensity = riskIntensity * (0.2 + Math.random() * 0.3);
      points.push([lat, lng, intensity]);
    }

    // Add connecting corridors (like water flow paths)
    if (riskLevel === "High" || riskLevel === "Moderate") {
      const numCorridors = riskLevel === "High" ? 3 : 2;

      for (let i = 0; i < numCorridors; i++) {
        const startAngle = Math.random() * Math.PI * 2;
        const corridorLength = 0.06 + Math.random() * 0.04;
        const numCorridorPoints = 30;

        for (let j = 0; j < numCorridorPoints; j++) {
          const progress = j / numCorridorPoints;
          const distance = progress * corridorLength;
          const width = (0.01 + Math.random() * 0.01) * (1 - progress * 0.5); // Narrowing corridor

          // Main corridor line
          const mainLat = center.lat + Math.sin(startAngle) * distance;
          const mainLng = center.lon + Math.cos(startAngle) * distance;

          // Add width variation
          const sideAngle = startAngle + Math.PI / 2;
          const sideOffset = (Math.random() - 0.5) * width;

          const lat = mainLat + Math.sin(sideAngle) * sideOffset;
          const lng = mainLng + Math.cos(sideAngle) * sideOffset;

          const intensity =
            riskIntensity * (0.4 + Math.random() * 0.3) * (1 - progress * 0.3);
          points.push([lat, lng, Math.max(0, intensity)]);
        }
      }
    }

    return points;
  };

  // **Create visualization layers**
  const createVisualizationLayers = (L, map) => {
    const currentZoom = map.getZoom();
    // Temperature Heatmap Layer
    if (activeKPIs.temperature && temperature) {
      if (layersRef.current.temperature) {
        map.removeLayer(layersRef.current.temperature);
      }

      const heatData = generateHeatmapData(
        selectedLocation,
        "temperature",
        currentZoom
      );

      layersRef.current.temperature = L.heatLayer(heatData, {
        radius: currentZoom > 14 ? 30 : currentZoom > 12 ? 25 : 20, 
        blur: currentZoom > 14 ? 20 : currentZoom > 12 ? 25 : 35, 
        maxZoom: 18, 
        max: 5.0,
        gradient: {
          0.0: "rgba(0, 0, 255, 0)", // Transparent blue (0°C equivalent)
          0.1: "rgba(0, 100, 255, 0.4)", // Light blue (~13°C)
          0.3: "rgba(0, 255, 255, 0.6)", // Cyan (~19°C)
          0.5: "rgba(0, 255, 0, 0.7)", // Green (~25°C)
          0.7: "rgba(255, 255, 0, 0.8)", // Yellow (~31°C)
          0.9: "rgba(255, 100, 0, 0.9)", // Orange (~37°C)
          1.0: "rgba(255, 0, 0, 1)", // Red (≥40°C)
        },
        minOpacity: 0.1, // Reduced for clearer contrast
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
        if (aqi <= 50) {
          // Good - Green
          return {
            0.0: "rgba(0, 228, 0, 0)",
            0.2: "rgba(0, 228, 0, 0.2)",
            0.4: "rgba(0, 228, 0, 0.3)",
            0.6: "rgba(0, 228, 0, 0.4)",
            0.8: "rgba(0, 228, 0, 0.5)",
            1.0: "rgba(0, 228, 0, 0.6)",
          };
        } else if (aqi <= 100) {
          // Moderate - Yellow
          return {
            0.0: "rgba(255, 255, 0, 0)",
            0.2: "rgba(255, 255, 0, 0.2)",
            0.4: "rgba(255, 220, 0, 0.3)",
            0.6: "rgba(255, 200, 0, 0.4)",
            0.8: "rgba(255, 180, 0, 0.5)",
            1.0: "rgba(255, 160, 0, 0.6)",
          };
        } else if (aqi <= 150) {
          // Unhealthy for Sensitive - Orange
          return {
            0.0: "rgba(255, 126, 0, 0)",
            0.2: "rgba(255, 126, 0, 0.3)",
            0.4: "rgba(255, 106, 0, 0.4)",
            0.6: "rgba(255, 86, 0, 0.5)",
            0.8: "rgba(255, 66, 0, 0.6)",
            1.0: "rgba(255, 46, 0, 0.7)",
          };
        } else if (aqi <= 200) {
          // Unhealthy - Red
          return {
            0.0: "rgba(255, 0, 0, 0)",
            0.2: "rgba(255, 0, 0, 0.3)",
            0.4: "rgba(235, 0, 0, 0.4)",
            0.6: "rgba(215, 0, 0, 0.5)",
            0.8: "rgba(195, 0, 0, 0.6)",
            1.0: "rgba(175, 0, 0, 0.7)",
          };
        } else {
          // Hazardous - Purple
          return {
            0.0: "rgba(143, 63, 151, 0)",
            0.2: "rgba(143, 63, 151, 0.4)",
            0.4: "rgba(123, 43, 131, 0.5)",
            0.6: "rgba(103, 23, 111, 0.6)",
            0.8: "rgba(83, 3, 91, 0.7)",
            1.0: "rgba(63, 0, 71, 0.8)",
          };
        }
      };

      // Create main pollution heatmap
      const pollutionData = generatePollutionHeatmap(
        selectedLocation,
        liveData.airPollution.aqi
      );

      const pollutionHeatLayer = L.heatLayer(pollutionData, {
        radius: 20,
        blur: 25,
        maxZoom: 17,
        max: 1.0,
        gradient: getAQIGradient(liveData.airPollution.aqi),
        minOpacity: 0.3,
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
            className: "pollution-particle",
            iconSize: [size, size],
          });

          const particle = L.marker([lat, lon], {
            icon: particleIcon,
            interactive: false,
            zIndexOffset: -1000,
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

    // Green Cover
    if (activeKPIs.greenCover && liveData.greenCover) {
      if (layersRef.current.greenCover) {
        map.removeLayer(layersRef.current.greenCover);
      }

      // Generate heatmap data for green cover
      const greenCoverData = generateGreenCoverHeatmap(
        selectedLocation,
        liveData.greenCover.percentage
      );

      layersRef.current.greenCover = L.heatLayer(greenCoverData, {
        radius: 20, // Adjust radius for desired spread
        blur: 25, // Adjust blur for smoothness
        maxZoom: 17,
        max: 1.0, // Maximum intensity value
        gradient: {
          0.0: "rgba(0, 0, 0, 0)", // Transparent
          0.2: "rgba(144, 238, 144, 0.4)", // LightGreen
          0.4: "rgba(60, 179, 113, 0.6)", // MediumSeaGreen
          0.6: "rgba(34, 139, 34, 0.7)", // ForestGreen
          0.8: "rgba(0, 100, 0, 0.8)", // DarkGreen
          1.0: "rgba(0, 50, 0, 0.9)", // Very Dark Green
        },
        minOpacity: 0.5, // Minimum opacity for subtle edges
      }).addTo(map);
    } else if (layersRef.current.greenCover) {
      map.removeLayer(layersRef.current.greenCover);
      layersRef.current.greenCover = null;
    }

    // Water Quality Markers
    if (activeKPIs.waterPollution && liveData.waterPollution) {
      if (layersRef.current.waterPollution) {
        map.removeLayer(layersRef.current.waterPollution);
      }

      const waterQualityData = generateWaterQualityHeatmap(
        selectedLocation,
        liveData.waterPollution.quality
      );

      // Define gradient based on water quality (good to bad)
      const getWaterQualityGradient = (quality) => {
        // Quality is 0-100, 100 is best.
        // We want red for low quality, blue for high quality.
        // Map quality to a 0-1 scale for gradient, where 0 is bad (red) and 1 is good (blue)
        const normalizedQuality = quality / 100;

        if (normalizedQuality > 0.7) {
          // Good (mostly blue)
          return {
            0.0: "rgba(0, 0, 255, 0)", // Transparent blue
            0.2: "rgba(0, 100, 255, 0.3)", // Light blue
            0.5: "rgba(0, 150, 255, 0.5)", // Medium blue
            0.8: "rgba(0, 200, 255, 0.6)", // Brighter blue
            1.0: "rgba(0, 255, 255, 0.7)", // Cyan
          };
        } else if (normalizedQuality > 0.4) {
          // Moderate (greenish-yellow to light blue)
          return {
            0.0: "rgba(0, 255, 0, 0)", // Transparent green
            0.2: "rgba(100, 255, 0, 0.3)", // Yellow-green
            0.5: "rgba(200, 255, 0, 0.5)", // Yellow
            0.8: "rgba(255, 200, 0, 0.6)", // Orange-yellow
            1.0: "rgba(255, 100, 0, 0.7)", // Orange
          };
        } else {
          // Poor (reddish-brown)
          return {
            0.0: "rgba(255, 0, 0, 0)", // Transparent red
            0.2: "rgba(255, 50, 0, 0.3)", // Orange-red
            0.5: "rgba(200, 50, 0, 0.5)", // Darker orange
            0.8: "rgba(150, 50, 0, 0.6)", // Brownish-orange
            1.0: "rgba(100, 50, 0, 0.7)", // Dark brown
          };
        }
      };

      layersRef.current.waterPollution = L.heatLayer(waterQualityData, {
        radius: 20, // Adjust radius for desired spread
        blur: 25, // Adjust blur for smoothness
        maxZoom: 17,
        max: 1.0, // Maximum intensity value
        gradient: getWaterQualityGradient(liveData.waterPollution.quality),
        minOpacity: 0.3, // Minimum opacity for subtle edges
      }).addTo(map);
    } else if (layersRef.current.waterPollution) {
      map.removeLayer(layersRef.current.waterPollution);
      layersRef.current.waterPollution = null;
    }

    // Flood Risk Zones
    if (activeKPIs.flood && liveData.flood) {
      if (layersRef.current.flood) {
        map.removeLayer(layersRef.current.flood);
      }

      const floodRiskData = generateFloodRiskHeatmap(
        selectedLocation,
        liveData.flood.risk
      );

      // Define gradient based on flood risk level
      const getFloodRiskGradient = (riskLevel) => {
        if (riskLevel === "High") {
          return {
            0.0: "rgba(139, 0, 139, 0)", // Transparent
            0.2: "rgba(139, 0, 139, 0.3)", // Dark Magenta
            0.4: "rgba(148, 0, 211, 0.4)", // Dark Violet
            0.6: "rgba(138, 43, 226, 0.5)", // Blue Violet
            0.8: "rgba(147, 112, 219, 0.6)", // Medium Purple
            1.0: "rgba(186, 85, 211, 0.7)", // Medium Orchid
          };
        } else if (riskLevel === "Moderate") {
          return {
            0.0: "rgba(75, 0, 130, 0)", // Transparent
            0.2: "rgba(75, 0, 130, 0.3)", // Indigo
            0.4: "rgba(106, 90, 205, 0.4)", // Slate Blue
            0.6: "rgba(123, 104, 238, 0.5)", // Medium Slate Blue
            0.8: "rgba(147, 112, 219, 0.6)", // Medium Purple
            1.0: "rgba(176, 196, 222, 0.7)", // Light Steel Blue
          };
        } else {
          // Low
          return {
            0.0: "rgba(65, 105, 225, 0)", // Transparent
            0.2: "rgba(65, 105, 225, 0.2)", // Royal Blue
            0.4: "rgba(100, 149, 237, 0.3)", // Cornflower Blue
            0.6: "rgba(135, 206, 250, 0.4)", // Light Sky Blue
            0.8: "rgba(173, 216, 230, 0.5)", // Light Blue
            1.0: "rgba(176, 224, 230, 0.6)", // Powder Blue
          };
        }
      };

      layersRef.current.flood = L.heatLayer(floodRiskData, {
        radius: 20, // Smaller radius for more defined areas
        blur: 25, // Less blur for more distinct boundaries
        maxZoom: 17,
        max: 1.0,
        gradient: getFloodRiskGradient(liveData.flood.risk),
        minOpacity: 0.3,
      }).addTo(map);
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
              {/* Updated legend indicator for green cover */}
              <div className="w-3 h-3 bg-gradient-to-r from-lime-300 to-green-800 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-neutral-400">
                Green Cover
              </span>
            </div>
          )}
          {activeKPIs.waterPollution && (
            <div className="flex items-center gap-2">
              {/* Updated legend indicator for water quality */}
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded"></div>
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
    temperature: false,
    airPollution: false,
    greenCover: false,
    waterPollution: false,
    flood: false,
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
        [
          [startLat, startLon],
          [midLat, midLon],
          [endLat, endLon],
        ],
        {
          color: "rgba(255, 255, 255, 0.6)",
          weight: 2,
          opacity: 0.7,
          dashArray: "10, 10",
          className: `wind-flow-line wind-flow-${i}`,
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
    let styleElement = document.getElementById("wind-flow-animation");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "wind-flow-animation";
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
    ${Array.from(
      { length: 15 },
      (_, i) => `
      .wind-flow-${i} {
        animation-delay: ${i * 0.2}s;
      }
    `
    ).join("")}
    
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
          background: radial-gradient(circle, rgba(255,255,255,${this.opacity}) 0%, transparent 30%);
          border-radius: 50%;
        "></div>`,
          className: "wind-particle-marker",
          iconSize: [this.size, this.size],
        });

        this.marker = this.L.marker([this.lat, this.lon], {
          icon,
          interactive: false,
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
      particles.forEach((p) => p.update());
      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    return particles.map((p) => p.marker);
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

  // **Auto-refresh every 2 minutes**
  useEffect(() => {
    const interval = setInterval(fetchLiveData, 2 * 60 * 1000);
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
          {/* <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700">
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
          </div> */}
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
