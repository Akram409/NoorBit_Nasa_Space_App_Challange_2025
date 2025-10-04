# **Project Details for NASA Space Apps Challenge 2024**

---

## **Project Team: NoorBIT**

### **Project Summary**

We are **Team NoorBIT**, and we've built a **proof-of-concept urban planning intelligence platform** that demonstrates how NASA Earth observation data can transform city decision-making. Our project, **"ECOPATH"**, is an interactive web application that visualizes urban environmental challenges through real-time data integration and intelligent analytics. By combining **live air quality monitoring** from OpenWeatherMap, **interactive mapping** with Leaflet.js, **AI-powered planning assistance**, and **community engagement features**, our platform provides city planners with a unified dashboard to understand heat vulnerability, air pollution exposure, and greenspace distribution. While we simulate certain NASA datasets (LST, NDVI) due to API complexity and time constraints, our architecture is designed for seamless integration with authentic NASA Earthdata sources. We've also created a **social community platform** where residents can share environmental concerns, and an **AI chatbot** that answers urban planning queries using natural language. This project showcases the potential of Earth observation data to empower evidence-based, equitable, and climate-resilient urban growth.

---

### **Design & Prototyping**

- **UI/UX Design:** [Figma](https://www.figma.com/proto/LnKK9eBMRusICx7IBLXIQD/nasa-project-2?page-id=59%3A2414&node-id=251-1362&viewport=-349%2C869%2C0.22&t=EMuqzIm6llehyEOI-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=251%3A1362)

### **Version Control & Deployment**

- **Version Control:** GitHub
- **Deployment:** Vercel

### **Development Tools**

- **Code Editor:** VS Code
- **Package Manager:** npm
- **Build Tool:** Vite

---

## **GitHub Repository**

**Link:** https://github.com/Akram409/NoorBit_Nasa_Space_App_Challange_2025

**Server:** https://github.com/Akram409/NoorBit_Server_2025

**Repository Structure:**

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Main app pages (KPI, UrbanBalance, AI Chat, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── assets/           # Images, videos, icons
│   ├── utils/            # Helper functions (cn, data services)
│   └── App.jsx           # Root component
├── public/               # Static assets
├── server/               # Backend API (Node.js/Express)
├── README.md             # Project documentation
└── package.json          # Dependencies
```

---

### **Project Demonstration**

**Video (240 seconds):** [Click here](https://youtu.be/7-sv7WW-YTE?si=RNg_4y0gdEiizsqM)
**Live Demo:** [Click here](https://noor-bit-nasa-space-app-challange-2.vercel.app/)

### **Project - Github**

- Client - https://github.com/Akram409/NoorBit_Nasa_Space_App_Challange_2025
- Server - https://github.com/Akram409/NoorBit_Server_2025

---

### **Project Details**

> _"Data-driven cities aren't just smarter—they're more equitable, resilient, and sustainable."_

---

## **Challenges That We Addressed**

In addressing the challenge of **sustainable urban planning in the face of climate change**, we developed **ECOPATH**, a web-based platform that transforms complex environmental data into actionable insights. Our focus areas include:

- **Heat Vulnerability Mapping:** Identifying neighborhoods at risk from urban heat islands using simulated land surface temperature combined with population density estimates.
- **Air Quality Monitoring:** Real-time tracking of NO₂ and PM2.5 pollution levels via OpenWeatherMap API to highlight exposure hotspots near schools and residential areas.
- **Greenspace Visualization:** Mapping vegetation coverage using simulated NDVI to assess park access and urban tree canopy.
- **Community Engagement:** Building a social platform where residents can report environmental concerns, share experiences, and vote on priority issues.
- **AI-Assisted Planning:** Providing an intelligent chatbot that answers questions about urban data, suggests interventions, and generates insights from uploaded documents or voice queries.

This dynamic approach bridges the gap between satellite data and local action, fostering collaboration among city departments (Planning, Parks, Transport, Public Health) and empowering communities to co-create solutions.

---

![KPI Dashboard](https://i.ibb.co.com/21m7x5yY/Screenshot-2025-10-04-132233.png)  
_Interactive dashboard showing heat vulnerability, air quality, and greenspace layers overlaid on city maps._

---

## **How It Works**

### **1. Data Integration & Architecture**

Our platform integrates **real-time APIs** and **simulated NASA-equivalent datasets** to create a comprehensive urban intelligence system:

**NASA Earth Observation Data:**

- **Land Surface Temperature (LST):** From MODIS/VIIRS satellites via NASA Earthdata to identify urban heat islands.
- **Air Quality (NO₂, Aerosols):** From OMI/TROPOMI sensors to map pollution hotspots.
- **Vegetation Indices (NDVI):** From Landsat/Sentinel-2 to assess greenspace coverage.
- **Nighttime Lights:** From VIIRS Day/Night Band to track urbanization and energy access.

**Partner & Open Data:**

- **Population Density:** SEDAC (NASA), EU Copernicus GHSL, WorldPop.
- **Land Cover & Use:** Copernicus Global Land Service, ESA WorldCover.
- **Weather Data:** OpenWeatherMap API (temperature, humidity, wind).
- **Geocoding & Mapping:** OpenStreetMap Nominatim API, Leaflet.js for interactive maps.

---

### **2. Core Features & Modules**

#### **# Interactive Mapping Dashboard**

**Technology Stack:**

- **Leaflet.js:** Core mapping library with marker clustering, popups, and layer controls
- **Leaflet.heat:** Heatmap plugin for visualizing data density (AQI, temperature, population)
- **OpenStreetMap Tiles:** Base layer with 80% opacity for overlay visibility
- **Custom Markers:** Color-coded pins with icons from Lucide React

**Capabilities:**

- **Multi-Layer Visualization:** Toggle between heat, air quality, greenspace, and population layers
- **Location Search:** Geocoding-powered search bar with autocomplete
- **Click-to-Analyze:** Click any point on the map to fetch local metrics (AQI, temperature, NDVI)
- **Zoom & Pan:** Smooth navigation from city-wide to neighborhood-level views
- **Responsive Design:** Works on desktop, tablet, and mobile devices

**Data Displayed:**

- Air Quality Index (AQI) with color-coded severity (Good/Moderate/Unhealthy)
- Real-time temperature and weather conditions
- Simulated vegetation coverage (NDVI)
- Simulated land surface temperature (LST)
- Population density estimates

#### **A. Heat Vulnerability Assessment**

**Problem:** Urban heat islands disproportionately affect low-income neighborhoods with less tree cover, leading to heat-related illnesses and deaths.

**Our Solution:**  
We combine **real weather data** with **simulated LST and population density** to create a heat risk profile:

**Methodology:**

```
Heat Risk Score = (LST_normalized × 0.4) + (Temperature × 0.3) + ((1 - NDVI) × 0.3)
```

**Data Inputs:**

- **Real:** Current temperature from OpenWeatherMap (°C)
- **Simulated:** Land Surface Temperature (LST) from MODIS-equivalent algorithm
- **Simulated:** Vegetation coverage (NDVI) as cooling factor
- **Simulated:** Population density for exposure assessment

**Visualization:**

- Color-graded heatmap (blue = cool, red = extreme heat)
- Neighborhood-level risk scores (0-100 scale)
- Temporal variation (day/night, seasonal)

**Recommended Actions (Conceptual):**

- Install cool roofs and reflective pavements in high-risk zones
- Plant shade trees at transit stops and playgrounds
- Deploy cooling centers during heatwaves
- Expand urban tree canopy by 20% in top 10 hotspots

---

![Air Quality](https://i.ibb.co.com/pB8ZGCnj/Screenshot-2025-10-04-133930.png)  
_Air Quality._

---

#### **B. Air Quality Monitoring Module**

**Problem:** Traffic-related air pollution (NO₂, PM2.5) concentrates along major roads, exposing vulnerable populations near schools, hospitals, and residential areas.

**Our Solution:**  
We fetch **real-time air pollution data** from OpenWeatherMap and visualize it on an interactive map:

**Features:**

- **Live Pollutant Tracking:** NO₂, PM2.5, PM10, SO₂, CO, O₃ concentrations
- **AQI Calculation:** EPA-standard Air Quality Index with health advisories
- **Hotspot Detection:** Identifies areas exceeding WHO guidelines (NO₂ > 40 µg/m³)
- **Temporal Analysis:** Hourly updates to track pollution trends
- **Health Impact Indicators:** Color-coded warnings (green/yellow/orange/red/purple)

**Visualization:**

- Heatmap overlay showing pollution concentration gradients
- Marker clusters for high-exposure zones
- Popup cards with detailed pollutant breakdown

**Recommended Actions (Conceptual):**

- Prioritize bus electrification on high-NO₂ routes
- Establish low-emission zones (LEZ) in city centers
- Plant roadside vegetation barriers (trees, green walls)
- Reroute heavy truck traffic away from schools

---

![Green Space Quality](https://i.ibb.co.com/39Wgkb96/Screenshot-2025-10-04-134126.png)  
_Green Quality_

---

#### **C. Greenspace & Vegetation Analysis**

**Problem:** Many urban residents lack access to parks and green spaces, reducing physical activity, mental health, and climate resilience.

**Our Solution:**  
We use **simulated NDVI** to map vegetation distribution and identify greenspace gaps:

**Features:**

- **Vegetation Index Mapping:** NDVI values (0.1 = bare/urban, 0.9 = dense forest)
- **Park Identification:** Clusters of high NDVI indicating existing green spaces
- **Gap Analysis:** Areas with NDVI < 0.3 flagged as underserved
- **Seasonal Tracking:** Monitors greening/browning cycles

**Visualization:**

- Green-to-brown color gradient showing vegetation health
- Overlay with population density to identify equity gaps
- Buffer zones showing 10-minute walk accessibility (conceptual)

**Recommended Actions (Conceptual):**

- Convert vacant lots into pocket parks
- Create greenways connecting neighborhoods to existing parks
- Increase tree canopy coverage by 15% in gap areas
- Partner with Parks Department for land acquisition

---

#### **D. AI-Powered Planning Assistant**

**Problem:** City planners need quick, evidence-based answers to complex questions without manually analyzing datasets.

**Our Solution:**  
We built an **AI chatbot** powered by OpenAI/Gemini that provides conversational access to urban planning knowledge:

**Technology:**

- **Backend:** Node.js
- **AI Providers:** Google Gemini
- **Frontend:** React with Axios for API calls
- **Rendering:** React Markdown with GitHub Flavored Markdown (tables, code blocks)

**Capabilities:**

- **Natural Language Queries:** Ask questions like:
  - _"Which neighborhoods have the highest air pollution?"_
  - _"What are the best strategies to reduce urban heat?"_
  - _"Show me trends in greenspace coverage over the past year."_
- **File Upload Analysis:** Upload images for AI to analyze
  - Example: Upload a city zoning map → AI identifies areas suitable for park development
- **Voice Input:** Record voice queries for hands-free interaction (accessibility feature)

- **Conversation History:** Maintains context across multiple messages for follow-up questions

- **Markdown Formatting:** Responses include:
  - Bullet lists and numbered steps
  - Tables for data comparison
  - Code blocks for formulas/calculations
  - Bold/italic emphasis for key points

**Example Interaction:**

```
User: "What causes urban heat islands?"

AI: "Urban heat islands form due to:
1. **Dark surfaces** (asphalt, roofs) absorbing solar radiation
2. **Lack of vegetation** reducing evaporative cooling
3. **Waste heat** from vehicles, AC units, and industry
4. **Building density** trapping heat and blocking wind

Mitigation strategies include cool roofs, tree planting, and permeable pavements."
```

---

![AI Chat Interface](https://i.ibb.co.com/C5xKJRMq/Screenshot-2025-10-04-134441.png)  
_AI assistant answering urban planning queries with formatted responses; supports text, file uploads, and voice input for accessibility._

---

#### **E. Blog & Resource Library**

**Purpose:** Educate users about climate science, urban planning best practices, and NASA Earth observation missions.

**Content:**

- **5 Featured Articles:**

  1. "Understanding Urban Heat Islands" (with thermal imagery)
  2. "Air Quality 101: What AQI Means for Your Health"
  3. "The Role of Green Spaces in Climate Resilience"
  4. "How NASA Satellites Monitor Cities from Space"
  5. "Community-Led Climate Action Success Stories"

- **4 Embedded YouTube Videos:**
  - "How NASA Sees the Air We Breathe"
  - "MODIS: Monitoring Earth's Vital Signs"
  - "Urban Heat Islands Explained"
  - "The Future of Climate-Smart Cities"

**Technology:**

- React components with responsive image galleries
- YouTube iframe embeds with autoplay controls
- Tag-based filtering system

---

![_StoryTelling_](https://i.ibb.co.com/SXnsnFdq/Screenshot-2025-10-04-134522.png)  
_StoryTelling_

![_StoryTelling_](https://i.ibb.co.com/Kzr8vztK/Screenshot-2025-10-04-134658.png)  
Blog

---

#### **F. Community Engagement Platform**

**Problem:** Top-down planning often misses local knowledge; residents know where problems are most acute but lack channels to share insights.

**Our Solution:**  
We created a **social media-style community feed** where residents can:

**Features:**

- **Post Creation:** Share observations, photos, and concerns about local environment
  - Example: "Bus stop on Main St has no shade—unbearable in summer heat!"
- **Likes & Comments:** Engage with others' posts to build consensus on priority issues

- **Hashtag System:** Organize posts by topic (#HeatIsland, #AirQuality, #NeedParks)

- **Trending Topics:** Sidebar shows most-discussed issues in real-time

- **User Profiles:** Avatars, bios, follower counts to build community trust

- **Suggested Connections:** Recommends users with similar interests (e.g., climate activists, urban planners)

**Technology:**

- **Frontend-Only:** Currently uses mock data (no backend database)
- **UI Components:** Shadcn/UI cards, avatars, badges
- **Animations:** Framer Motion for smooth interactions

**Future Integration (Not Yet Implemented):**

- Map-based reporting: Drop pins to geolocate issues
- Photo uploads with GPS metadata
- Voting system to prioritize interventions
- Admin dashboard for city officials to review reports

---

![Community Feed](https://i.ibb.co.com/tMYQvf7k/Screenshot-2025-10-04-134810.png)  
_Social community platform where residents share environmental concerns; trending topics and user engagement foster collective action._

---

## **Aims To Achieve**

Our goal with **ECOPATH** is to make climate-smart urban planning accessible, transparent, and actionable for cities worldwide. By harnessing NASA Earth observation data and cutting-edge analytics, we aim to:

1. **Reduce Heat-Related Mortality:** Target interventions in top 10 heat vulnerability zones, reducing ER visits by 30% during heatwaves.
2. **Improve Air Quality:** Cut NO₂ exposure by 15% along priority corridors through clean transport and green infrastructure.
3. **Close Greenspace Gaps:** Bring 20,000+ residents within a 10-minute walk of parks within 3 years.
4. **Empower Communities:** Give residents a voice in planning through crowdsourced data and transparent decision-making.
5. **Scale Globally:** Provide a replicable model for fast-growing cities in the Global South facing similar challenges.

Through this innovative approach, we hope to inspire a new generation of data-driven urban planners who prioritize people, planet, and prosperity. **Join us in building cities that work for everyone.**

---

## **Highlighted Features**

1. **Real-Time NASA Data Integration:** Live feeds of LST, NO₂, NDVI, nighttime lights.
2. **Interactive Multi-Layer Maps:** Toggle between heat, air quality, greenspace, and population layers.
3. **Heat Vulnerability Index (HVI):** Science-based scoring to prioritize interventions.
4. **AI Planning Assistant:** Natural language queries for instant insights.
5. **Community Reporting:** Crowdsourced pins, photos, and votes on local issues.
6. **Actionable Recommendations:** Specific, costed interventions for each module (e.g., "Plant 500 trees in Zone A: $50k").
7. **Cross-Department Collaboration:** Shared dashboard for Planning, Parks, Transport, Public Health.
8. **Mobile-Responsive Design:** Works on phones for field use by inspectors and residents.
9. **Offline Mode:** Download maps and data for areas with limited connectivity.
10. **Open Source & Extensible:** GitHub repo for cities to adapt and contribute.

---

## **Positive Outcomes**

1. **Evidence-Based Decisions:** Planners use real data, not guesswork, to allocate budgets.
2. **Health Equity:** Targets interventions where they're needed most, reducing disparities.
3. **Climate Resilience:** Prepares cities for heatwaves, floods, and air quality crises.
4. **Community Trust:** Transparent data and participatory planning build public confidence.
5. **Cost Savings:** Prevents costly reactive measures (e.g., emergency cooling centers) by investing proactively.
6. **Scalable Impact:** Model replicable in 100+ fast-growing cities globally.
7. **STEM Inspiration:** Showcases how Earth science careers solve real-world problems, inspiring students.

---

## **Tools, Languages & Technologies Used**

### **Frontend Development**

- **Language:** JavaScript,HTML,CSS
- **Framework:** ReactJS
- **Routing:** React Router
- **Styling:** Tailwind CSS, DaisyUI, Tailwind Animate
- **UI Components:** Shadcn/UI
- **Animations:** Framer Motion, tsParticles (Slim)
- **Maps:** Leaflet.js, Leaflet.heat (heatmaps), OpenStreetMap tiles
- **Charts:** (Inferred) Recharts or Chart.js for KPI visualizations
- **Markdown Rendering:** React Markdown, Remark GFM, Rehype Raw

### **Backend Development**

- **Language:** Node.js
- **AI Integration:** OpenAI API / Google Gemini API
- **File Handling:** Multer (for image/voice uploads)
- **CORS:** Enabled for frontend communication

### **APIs & Data Sources**

1. **NASA Earthdata:**
   - Planetary API (Earth Imagery): `https://api.nasa.gov/planetary/earth/imagery`
   - GIBS (Global Imagery Browse Services): For LST, NDVI layers _(simulated in code)_
2. **OpenWeatherMap:**
   - Air Pollution API: `https://api.openweathermap.org/data/2.5/air_pollution`
   - Weather API: `https://api.openweathermap.org/data/2.5/weather`
3. **OpenStreetMap:**
   - Nominatim Geocoding: `https://nominatim.openstreetmap.org/search` & `/reverse`
   - Tile Server: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
4. **SEDAC (NASA):** Population density grids _(manual download, not API)_
5. **EU Copernicus GHSL:** Global Human Settlement Layer _(manual download)_
6. **WorldPop:** Population data _(manual download)_
