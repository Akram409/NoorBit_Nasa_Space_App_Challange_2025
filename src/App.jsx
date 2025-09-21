import { useState } from 'react'
import { SparklesPreviewColorful ,SparklesPreview} from './pages/Home/HeroSection'
import { FeaturesSection } from './pages/Home/FeatureSection'
import { OrbitTimeline } from './pages/Home/OrbitTimeLine'
import GallerySection from './pages/Home/GallerySection'
import { TestimonialSection } from './pages/Home/TestimonialSection'
import { Docks } from './pages/Home/Docks'
import { Footer } from './pages/Home/Footer'
import { DocksSection } from './pages/Home/DocksSection'


function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="min-h-screen relative">
     <DocksSection />
    <SparklesPreviewColorful />
    
    <FeaturesSection/>
    {/* <OrbitTimeline /> */}
    {/* <GallerySection/> */}
    <TestimonialSection />
    <Footer />
   
    </div>
  )
}

export default App
