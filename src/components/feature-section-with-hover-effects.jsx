import { cn } from "@/lib/utils";
import {
  Thermometer,
  Droplets,
  Trees,
  Wind,
  BarChart3,
  AlertTriangle,
  Leaf,
  Building2,
  Activity,
  Shield,
} from "lucide-react";
import { CustomText } from "./customText";

const features = [
  {
    title: "Air Quality Monitoring",
    description:
      "Real-time tracking of air pollution levels, PM2.5, and harmful emissions to ensure healthier urban environments and combat air quality degradation.",
    icon: <Wind className="w-7 h-7" />,
    gradient: "from-blue-500 to-cyan-500",
    hoverColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    textGradient: "group-hover:from-blue-500 group-hover:to-cyan-500",
  },
  {
    title: "Water Resource Management",
    description:
      "Monitor water scarcity, quality metrics, and distribution systems to address urban water challenges and ensure sustainable water access.",
    icon: <Droplets className="w-7 h-7" />,
    gradient: "from-cyan-500 to-blue-600",
    hoverColor: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20",
    textGradient: "group-hover:from-cyan-500 group-hover:to-blue-600",
  },
  {
    title: "Green Space Analytics",
    description:
      "Track urban green coverage, biodiversity, and the impact of green spaces on city livability to combat excessive urbanization effects.",
    icon: <Trees className="w-7 h-7" />,
    gradient: "from-green-500 to-emerald-600",
    hoverColor: "hover:bg-green-50 dark:hover:bg-green-900/20",
    textGradient: "group-hover:from-green-500 group-hover:to-emerald-600",
  },
  {
    title: "Climate Impact Assessment",
    description:
      "Monitor extreme weather patterns, heatwaves, and temperature variations affecting urban populations and infrastructure resilience.",
    icon: <Thermometer className="w-7 h-7" />,
    gradient: "from-orange-500 to-red-500",
    hoverColor: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
    textGradient: "group-hover:from-orange-500 group-hover:to-red-500",
  },
  {
    title: "Extreme Weather Alerts",
    description:
      "Early warning systems for floods, droughts, and severe weather events to protect urban communities from climate-related disasters.",
    icon: <AlertTriangle className="w-7 h-7" />,
    gradient: "from-yellow-500 to-orange-500",
    hoverColor: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    textGradient: "group-hover:from-yellow-500 group-hover:to-orange-500",
  },
  {
    title: "Urban Planning Insights",
    description:
      "Data-driven analysis for sustainable city development, addressing rapid urbanization challenges and promoting smart growth strategies.",
    icon: <Building2 className="w-7 h-7" />,
    gradient: "from-purple-500 to-indigo-600",
    hoverColor: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    textGradient: "group-hover:from-purple-500 group-hover:to-indigo-600",
  },
  {
    title: "Environmental Data Analytics",
    description:
      "Comprehensive environmental metrics and trends analysis using satellite data and IoT sensors for informed urban decision-making.",
    icon: <BarChart3 className="w-7 h-7" />,
    gradient: "from-indigo-500 to-purple-600",
    hoverColor: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
    textGradient: "group-hover:from-indigo-500 group-hover:to-purple-600",
  },
  {
    title: "Urban Resilience Planning",
    description:
      "Build climate-resilient cities through predictive modeling, adaptive infrastructure planning, and sustainable development pathways.",
    icon: <Shield className="w-7 h-7" />,
    gradient: "from-teal-500 to-green-600",
    hoverColor: "hover:bg-teal-50 dark:hover:bg-teal-900/20",
    textGradient: "group-hover:from-teal-500 group-hover:to-green-600",
  },
  {
    title: "Health Impact Monitoring",
    description:
      "Track correlations between environmental factors and public health in urban settlements to promote healthier living conditions.",
    icon: <Activity className="w-7 h-7" />,
    gradient: "from-pink-500 to-rose-600",
    hoverColor: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    textGradient: "group-hover:from-pink-500 group-hover:to-rose-600",
  },
];

export function FeaturesSectionWithHoverEffects() {

  return (
    <section
      className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-black dark:to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <CustomText name="Features" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-10">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-black rounded-2xl px-8 py-6 shadow-lg border border-gray-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center animate-spin-slow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Building Sustainable Urban Futures
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Through innovative data pathways and smart city solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  gradient,
  hoverColor,
  textGradient,
  index,
}) {
  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-black rounded-2xl p-8 shadow-lg transition-all duration-500 border border-gray-200 dark:border-slate-600",
        "hover:shadow-2xl hover:scale-105 hover:border-transparent hover:-translate-y-2",
        hoverColor,
        index % 3 === 0 && "animate-fade-in-up delay-100",
        index % 3 === 1 && "animate-fade-in-up delay-200",
        index % 3 === 2 && "animate-fade-in-up delay-300"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-all duration-500",
          gradient
        )}
      />
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-75 transition-all duration-500 blur-sm",
          gradient
        )}
      />

      <div className="relative mb-6 z-10">
        <div
          className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r text-white transition-all duration-300",
            "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg",
            gradient
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            "absolute inset-0 w-16 h-16 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-50 group-hover:animate-ping transition-opacity duration-300",
            gradient
          )}
        />
      </div>

      <div className="relative z-10">
        <h3
          className={cn(
            "text-xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-300",
            "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r",
            textGradient
          )}
        >
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
          {description}
        </p>
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <div
          className={cn(
            "w-3 h-3 rounded-full bg-gradient-to-r animate-bounce",
            gradient
          )}
        />
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
        <div
          className={cn("w-2 h-8 bg-gradient-to-b rounded-full", gradient)}
        />
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r rounded-b-2xl transition-all duration-500 w-0 group-hover:w-full",
          gradient
        )}
      />
    </div>
  );
}
