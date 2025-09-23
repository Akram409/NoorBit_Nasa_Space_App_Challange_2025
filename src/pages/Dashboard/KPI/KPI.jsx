import React, { useState } from "react";
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
} from "lucide-react";

const KPIPage = () => {
  const [activeKPIs, setActiveKPIs] = useState({
    temperature: true,
    airPollution: true,
    greenCover: true,
    waterPollution: true,
    flood: true,
  });

  const toggleKPI = (kpi) => {
    setActiveKPIs((prev) => ({ ...prev, [kpi]: !prev[kpi] }));
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-neutral-900 min-h-screen ">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm dark:shadow-neutral-900/20">
          <div className="relative h-96">
            {/* Map placeholder - you can integrate actual map here */}
            <div className="w-full h-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-neutral-400">
                Map Integration Area
              </p>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 left-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-600 rounded-l-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                  Map
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-r-lg transition-colors">
                  Satellite
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Your area"
                  className="w-full px-4 py-2 pr-10 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 dark:text-neutral-500" />
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
              <button className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-t-lg transition-colors">
                +
              </button>
              <div className="w-full h-px bg-gray-200 dark:bg-neutral-600"></div>
              <button className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-b-lg transition-colors">
                −
              </button>
            </div>
          </div>
        </div>

        {/* KPI Controls Panel */}
        <div className="space-y-4">
          {/* KPI Toggles */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
              KPI
            </h3>
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
                
                // Switch colors
                const switchBgColor = isActive 
                  ? `bg-${color}-500 dark:bg-${color}-600` 
                  : "bg-gray-200 dark:bg-neutral-700";
                
                // Text and icon colors
                const textColor = isActive 
                  ? `text-${color}-600 dark:text-${color}-400 font-semibold` 
                  : "text-gray-700 dark:text-neutral-300";
                
                const iconColor = isActive 
                  ? `text-${color}-600 dark:text-${color}-400` 
                  : "text-gray-500 dark:text-neutral-400";

                return (
                  <div key={key} className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-neutral-700/50 p-2 rounded-lg transition-colors">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleKPI(key)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${switchBgColor} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 after:ease-in-out peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${color}-300 dark:peer-focus:ring-${color}-800`}
                      ></div>
                    </label>
                    <Icon 
                      className={`w-4 h-4 transition-colors duration-200 ${iconColor}`} 
                    />
                    <span 
                      className={`text-sm transition-colors duration-200 ${textColor}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
              🛰️ NASA Data Sources
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-neutral-400">
              <div className="hover:text-gray-800 dark:hover:text-neutral-300 transition-colors">• MODIS Land Surface Temperature</div>
              <div className="hover:text-gray-800 dark:hover:text-neutral-300 transition-colors">• Landsat NDVI Vegetation Index</div>
              <div className="hover:text-gray-800 dark:hover:text-neutral-300 transition-colors">• GPM Precipitation Data</div>
              <div className="hover:text-gray-800 dark:hover:text-neutral-300 transition-colors">• GEDI Forest Structure</div>
              <div className="hover:text-gray-800 dark:hover:text-neutral-300 transition-colors">• VIIRS Nighttime Lights</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Climate Insights Panel */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/20">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-800">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              AI
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
              AI Climate Insights
            </h3>
            <p className="text-gray-600 dark:text-neutral-300 mb-4 leading-relaxed">
              Based on current climate readings: 35% tree cover and 15% cool
              roofs, your city could achieve a 2.6°C temperature reduction and
              improve air quality by 24 AQI points
            </p>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></div>
                  <span className="font-medium text-red-700 dark:text-red-300">
                    Priority Action
                  </span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Plant 15,000 trees in Ward 12
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">
                    Economic Impact
                  </span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  $3.2M healthcare savings
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    Energy Savings
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  24% cooling demand reduction
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                <Share className="w-4 h-4" />
                <span>Share Scenario</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                <Play className="w-4 h-4" />
                <span>Run Simulation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIPage;
