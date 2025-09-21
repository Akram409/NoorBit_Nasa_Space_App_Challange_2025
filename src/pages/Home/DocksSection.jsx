// FileName: /src/pages/Home/DocksSection.jsx
import { useState, useEffect } from 'react';
import { LimelightNav } from '@/components/limelight-nav';
import { Home, LayoutList, MessageSquareText, Info, LayoutDashboard } from 'lucide-react';

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const customNavItems = [
  {
    id: 'home',
    sectionId: 'home-section',
    icon: <Home />,
    label: 'Home',
    onClick: () => scrollToSection('home-section')
  },
  {
    id: 'features',
    sectionId: 'features-section',
    icon: <LayoutList />,
    label: 'Features',
    onClick: () => scrollToSection('features-section')
  },
  {
    id: 'testimonials',
    sectionId: 'testimonial-section',
    icon: <MessageSquareText />,
    label: 'Testimonials',
    onClick: () => scrollToSection('testimonial-section')
  },
{
    id: 'dashboard',
    sectionId: 'dashboard-section',
    icon: <LayoutDashboard />,
    label: 'Dashboard',
    onClick: () => scrollToSection('dashboard-section')
  },
];

export function DocksSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = customNavItems.findIndex(item => item.sectionId === sectionId);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    customNavItems.forEach(item => {
      const element = document.getElementById(item.sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleTabChange = (index) => {
    setActiveIndex(index);
  };

  return (
    <LimelightNav
      className="bg-transparent dark:bg-card/50 dark:border-accent/50 rounded-xl"
      items={customNavItems}
      defaultActiveIndex={activeIndex}
      onTabChange={handleTabChange}
    />
  );
}