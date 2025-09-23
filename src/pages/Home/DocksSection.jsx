import { useState, useEffect } from "react";
import { LimelightNav } from "@/components/limelight-nav";
import {
  Home,
  LayoutList,
  MessageSquareText,
  OrbitIcon,
  Satellite,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";




export function DocksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const customNavItems = [
  {
    id: "home",
    sectionId: "home-section",
    icon: <Home />,
    label: "Home",
    onClick: () => scrollToSection("home-section"),
  },
  {
    id: "features",
    sectionId: "features-section",
    icon: <LayoutList />,
    label: "Features",
    onClick: () => scrollToSection("features-section"),
  },
   {
    id: "orbit-timeline",          
    sectionId: "orbit-timeline-section",
    icon: <OrbitIcon />,     
    label: "Orbit Timeline",
    onClick: () => scrollToSection("orbit-timeline-section"),
  },
   {
    id: "glory-video-section",          
    sectionId: "glory-video-section",
    icon: <Video />,     
    label: "Glory Video",
    onClick: () => scrollToSection("glory-video-section"),
  },
  {
    id: "testimonials",
    sectionId: "testimonial-section",
    icon: <MessageSquareText />,
    label: "Testimonials",
    onClick: () => scrollToSection("testimonial-section"),
  },
  {
    id: "dashboard",
    sectionId: "dashboard-section",
    icon: <Satellite />,
    label: "Dashboard",
    onClick: () => navigate("/dashboard")
  },
];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-15% 0px -60% 0px",
      threshold: [0.1, 0.5, 0.9],
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = customNavItems.findIndex(
            (item) => item.sectionId === sectionId
          );
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    customNavItems.forEach((item) => {
      const element = document.getElementById(item.sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [customNavItems]);

const handleTabChange = (index) => {
    setActiveIndex(index);
    // The onClick in customNavItems already handles scrolling,
    // but if you want to ensure it, you can call it here too.
    // customNavItems[index].onClick();
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
