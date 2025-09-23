import { SparklesPreviewColorful } from "./pages/Home/HeroSection";
import { FeaturesSection } from "./pages/Home/FeatureSection";
import { OrbitTimeline } from "./pages/Home/OrbitTimeLine";
import { TeamSection } from "./pages/Home/TeamSection";

import { Footer } from "./pages/Home/Footer";
import { DocksSection } from "./pages/Home/DocksSection";

function App() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-white to-white dark:from-black dark:to-black">
      <DocksSection />

      <div id="home-section">
        <SparklesPreviewColorful />
      </div>

      <div id="features-section">
        <FeaturesSection />
      </div>

      <div id="orbit-timeline-section">
        <OrbitTimeline />
      </div>

      <div id="testimonial-section">
        <TeamSection />
      </div>

      <div id="footer-section">
        <Footer />
      </div>
    </div>
  );
}

export default App;
