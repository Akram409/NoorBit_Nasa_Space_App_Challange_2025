import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export function SparklesPreview() {
  return (
    <div className="h-[100vh] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Acme
      </h1>
      <div className="w-[40rem] h-40 relative">
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
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        Build faster
      </h1>
    </div>
  );
}

export function SparklesPreviewColorful() {
  return (
    <div className="h-[100vh] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlescolorful"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00ff00"
          speed={0.5}
        />
      </div>

      <div className="flex flex-col items-center justify-center z-20">
        <h1 className="md:text-6xl text-4xl lg:text-8xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Unlock Your Future
        </h1>
        <div className="h-[200px] flex items-center justify-center">
          <GooeyText
            texts={["Innovation", "Creativity", "Inspire", "Change"]}
            morphTime={1}
            cooldownTime={0.25}
            className="md:text-6xl text-3xl lg:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          />
        </div>
        <p className="text-neutral-300 cursor-default text-center text-xl lg:text-2xl mt-4">
          The journey starts here.
        </p>
      </div>
    </div>
  );
}
