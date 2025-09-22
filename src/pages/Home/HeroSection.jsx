import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { MapPin } from "lucide-react";

export function SparklesPreview() {
  return (
    <div className="h-[100vh] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-6xl text-4xl lg:text-8xl font-extrabold text-center text-white relative z-20">
        Building Sustainable Cities
      </h1>
      <div className="w-[35rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

export function SparklesPreviewDark() {
  return (
    <div className="h-[100vh] relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>
      <h1 className="md:text-6xl text-4xl lg:text-8xl font-extrabold text-center text-white relative z-20">
        Designing Resilient Futures
      </h1>
    </div>
  );
}

export function SparklesPreviewColorful() {
  return (
    <div className="h-[100vh] relative w-full bg-white dark:bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      {/* Particle Background */}
      <div className="w-full absolute inset-0 h-screen">
        {/* Light mode particles */}
        <SparklesCore
          id="tsparticles-light"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full dark:hidden"
          particleColor="#0066ff"
          speed={0.5}
        />
        {/* Dark mode particles */}
        <SparklesCore
          id="tsparticles-dark"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full hidden dark:block"
          particleColor="#00ffcc"
          speed={0.5}
        />
      </div>

      {/* Foreground Text */}
      <div className="flex flex-col items-center justify-center z-20">

        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
          <MapPin className="w-4 h-4" />
          NASA Space Apps Challenge 2025
        </div>
        <h1
          className="
            text-4xl md:text-5xl lg:text-7xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 animate-gradient-x
          "
        >
          Data Pathways to Healthy Cities
        </h1>

        <div className="h-[200px] flex items-center justify-center">
          <GooeyText
            texts={[
              "Urban Data",
              "Resilience",
              "Green Spaces",
              "Climate Action",
            ]}
            morphTime={1}
            cooldownTime={0.25}
            className="
              font-bold text-center
              bg-clip-text text-transparent
              bg-gradient-to-b from-black to-neutral-600
              dark:from-neutral-50 dark:to-neutral-400
            "
          />
        </div>

        <p className="cursor-default text-center text-xl lg:text-2xl mt-4 text-neutral-700 dark:text-neutral-300">
          Leveraging data for sustainable urban development.
        </p>
      </div>
    </div>
  );
}
