import { CustomText } from "@/components/customText";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { Thermometer, Droplets, Trees, BarChart3, Shield } from "lucide-react";

const timelineData = [
  {
    id: 1,
    title: "Challenge Description",
    content: `The 2025 NASA Space Apps Challenge focuses on using NASA Earth observation data to support urban planning strategies that balance human well-being and environmental sustainability.`,
    relatedIds: [2, 3],
    icon: Thermometer,
  },
  {
    id: 2,
    title: "Problem Identification",
    content: `Climate change and rapid urbanization pose new challenges for urban areas worldwide, including air pollution, water scarcity, loss of green spaces, and extreme weather events.`,
    relatedIds: [1, 4],
    icon: Droplets,
  },
  {
    id: 3,
    title: "Problems and Solutions",
    content: `Key problems include pollution, lack of green spaces, extreme weather, rapid urbanization, healthcare access, water/waste management, and energy access. Solutions leverage satellite data for monitoring and planning.`,
    relatedIds: [1, 5],
    icon: Trees,
  },
  {
    id: 4,
    title: "Data and Tools",
    content: `NASA Earthdata Worldview, Earth Observatory, SEDAC, Copernicus GHSL, and WorldPop provide satellite imagery and socio-environmental data to inform urban planning and sustainability efforts.`,
    relatedIds: [2, 5],
    icon: BarChart3,
  },
  {
    id: 5,
    title: "Conclusion",
    content: `By utilizing NASA's Earth observation data and partner resources, urban planners can create data-driven solutions to improve quality of life and ensure long-term sustainability in cities facing climate change.`,
    relatedIds: [3, 4],
    icon: Shield,
  },
];

export function OrbitTimeline() {
  return (
    <>
      <div className="">
        {/* Header Section */}
        <div className="text-center">
          <CustomText name="Orbit of Innovation" />
        </div>

        <RadialOrbitalTimeline timelineData={timelineData} />

      </div>
    </>
  );
}

export default {
  OrbitTimeline,
};
