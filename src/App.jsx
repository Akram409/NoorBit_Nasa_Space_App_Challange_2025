import { SparklesPreviewColorful } from './pages/Home/HeroSection'
import { FeaturesSection } from './pages/Home/FeatureSection'
import { OrbitTimeline } from './pages/Home/OrbitTimeLine'
import GallerySection from './pages/Home/GallerySection'
import { TeamSection } from './pages/Home/TestimonialSection'

import { Footer } from './pages/Home/Footer'
import { DocksSection } from './pages/Home/DocksSection'


function App() {
  return (
   <div className="min-h-screen relative">
     <DocksSection />

    <div id="home-section">
      <SparklesPreviewColorful />
    </div>

    <div id="features-section">
      <FeaturesSection />
    </div>

    {/* <OrbitTimeline /> */}
    {/* <GallerySection/> */}

    <div id="testimonial-section" >
      <TeamSection />
    </div>

    <div id="footer-section" >
      <Footer />
    </div>
   
    </div>
  )
}

export default App
