// import React, { useState, useEffect } from "react";
// import { CircularGallery } from "@/components/ui/circular-gallery";
// import { RainbowButton } from "@/components/ui/rainbow-button";
// import { CustomText } from "@/components/customText";
// import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix for default marker icon in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });


// // Mock gallery data for demonstration. Replace with actual data.
// const mockGalleryData = [
//   {
//     common: 'Urban Green Oasis',
//     binomial: 'Sustainable City Park',
//     photo: {
//       url: 'https://images.unsplash.com/photo-1519046904884-53103b34b8d4?auto=format&fit=crop&w=900&q=80',
//       text: 'A lush city park with walking paths and trees.',
//       by: 'John Doe'
//     }
//   },
//   {
//     common: 'Smart City Infrastructure',
//     binomial: 'Integrated Urban Systems',
//     photo: {
//       url: 'https://images.unsplash.com/photo-1518611012118-69672238b257?auto=format&fit=crop&w=900&q=80',
//       text: 'Modern city skyline with smart buildings.',
//       by: 'Jane Smith'
//     }
//   },
//   {
//     common: 'Waterfront Revitalization',
//     binomial: 'Eco-friendly Development',
//     photo: {
//       url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c5d?auto=format&fit=crop&w=900&q=80',
//       text: 'A revitalized waterfront area with public access.',
//       by: 'Peter Jones'
//     }
//   },
//   {
//     common: 'Community Gardens',
//     binomial: 'Urban Agriculture Project',
//     photo: {
//       url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=900&q=80',
//       text: 'Vibrant community garden in an urban setting.',
//       by: 'Alice Brown'
//     }
//   },
// ];

// export function UrbanBalancePage() {
//   const [urbanData, setUrbanData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // --- Fetch GHSL Data (Conceptual) ---
//         // GHSL data is typically large raster files. For a live demo, you might use a pre-processed
//         // GeoJSON representation of urban boundaries or a WMS/WFS service if available.
//         // For this example, we'll use a mock GeoJSON.
//         const mockGHSLGeoJSON = {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               properties: { name: "Urban Area 1", population: 150000, built_up_ratio: 0.7 },
//               geometry: {
//                 type: "Polygon",
//                 coordinates: [[
//                   [-74.05, 40.70], [-74.00, 40.70], [-74.00, 40.75], [-74.05, 40.75], [-74.05, 40.70]
//                 ]]
//               }
//             },
//             {
//               type: "Feature",
//               properties: { name: "Green Zone 1", green_space_ratio: 0.9, population: 5000 },
//               geometry: {
//                 type: "Polygon",
//                 coordinates: [[
//                   [-73.95, 40.78], [-73.90, 40.78], [-73.90, 40.83], [-73.95, 40.83], [-73.95, 40.78]
//                 ]]
//               }
//             }
//           ]
//         };

//         // --- Fetch WorldPop Data (Conceptual) ---
//         // WorldPop data is also gridded. For a live demo, you might fetch a small subset
//         // or use a WMS/WFS service.
//         const mockWorldPopMarkers = [
//           { lat: 40.72, lng: -74.02, density: 15000, label: "High Density Zone A" },
//           { lat: 40.80, lng: -73.92, density: 2000, label: "Low Density Zone B" },
//         ];

//         setUrbanData({
//           ghsl: mockGHSLGeoJSON,
//           worldPop: mockWorldPopMarkers,
//           gallery: mockGalleryData,
//         });

//       } catch (err) {
//         console.error("Failed to fetch urban balance data:", err);
//         setError("Failed to load urban balance data. Please try again later.");
//         // Fallback to mock data
//         setUrbanData({
//           ghsl: { type: "FeatureCollection", features: [] },
//           worldPop: [],
//           gallery: mockGalleryData,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getGeoJsonStyle = (feature) => {
//     if (feature.properties.built_up_ratio) {
//       return {
//         fillColor: '#e74c3c', // Red for built-up areas
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.5
//       };
//     } else if (feature.properties.green_space_ratio) {
//       return {
//         fillColor: '#2ecc71', // Green for green spaces
//         weight: 2,
//         opacity: 1,
//         color: 'white',
//         dashArray: '3',
//         fillOpacity: 0.5
//       };
//     }
//     return {};
//   };

//   return (
//     <div className="min-h-screen w-full relative bg-gray-950 text-white p-8 md:p-16 lg:p-24">
//       <div className="text-center mb-16">
//         <CustomText name="Urban Balance & Sustainability" />
//         <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
//           Visualizing the delicate balance between urban growth and environmental preservation.
//         </p>
//       </div>

//       {loading ? (
//         <div className="text-center text-lg">Loading Urban Data...</div>
//       ) : error ? (
//         <div className="text-center text-red-500 text-lg">{error}</div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Interactive Map Section */}
//           <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-lg p-6 h-[600px]">
//             <h3 className="text-2xl font-bold mb-4">Urban Landscape Map</h3>
//             <MapContainer center={[40.7128, -74.0060]} zoom={12} className="h-[500px] w-full rounded-md">
//               <TileLayer
//                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
//               />
//               {urbanData.ghsl && <GeoJSON data={urbanData.ghsl} style={getGeoJsonStyle} />}
//               {urbanData.worldPop && urbanData.worldPop.map((marker, idx) => (
//                 <Marker key={idx} position={[marker.lat, marker.lng]}>
//                   <Popup>
//                     <strong>{marker.label}</strong><br />
//                     Population Density: {marker.density}
//                   </Popup>
//                 </Marker>
//               ))}
//               {/* Add more GeoJSON layers for NDVI, water bodies, etc. here */}
//             </MapContainer>
//             <p className="text-sm text-gray-400 mt-4">
//               Visualize urban footprint, green spaces, and population density.
//             </p>
//           </div>

//           {/* Sustainability Metrics & Gallery */}
//           <div className="flex flex-col space-y-8">
//             <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-lg p-6">
//               <h3 className="text-2xl font-bold mb-4">Sustainability Metrics</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="p-4 bg-gray-700/50 rounded-md">
//                   <p className="text-lg font-semibold">Built-up Area Growth</p>
//                   <p className="text-3xl text-red-400">+5% <span className="text-sm text-gray-400">since last year</span></p>
//                 </div>
//                 <div className="p-4 bg-gray-700/50 rounded-md">
//                   <p className="text-lg font-semibold">Green Space Loss</p>
//                   <p className="text-3xl text-red-400">-2% <span className="text-sm text-gray-400">since last year</span></p>
//                 </div>
//                 <div className="p-4 bg-gray-700/50 rounded-md">
//                   <p className="text-lg font-semibold">Water Quality Index</p>
//                   <p className="text-3xl text-green-400">78 <span className="text-sm text-gray-400">Good</span></p>
//                 </div>
//                 <div className="p-4 bg-gray-700/50 rounded-md">
//                   <p className="text-lg font-semibold">Biodiversity Score</p>
//                   <p className="text-3xl text-yellow-400">65 <span className="text-sm text-gray-400">Moderate</span></p>
//                 </div>
//               </div>
//               <RainbowButton className="mt-6 w-full">Generate Urban Balance Report</RainbowButton>
//             </div>

//             <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-lg p-6 h-[400px] flex flex-col justify-center items-center">
//               <h3 className="text-2xl font-bold mb-4">Urban Initiatives Showcase</h3>
//               <div className="w-full h-full">
//                 <CircularGallery items={urbanData.gallery} radius={300} autoRotateSpeed={0.05} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }