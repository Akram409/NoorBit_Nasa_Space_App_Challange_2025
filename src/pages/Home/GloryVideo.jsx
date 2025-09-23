import { CustomText } from "@/components/customText";
import { VideoPlayer } from "@/components/video-thumbnail-player";

export default function GloryVideo() {
  return (
    <div className="flex flex-col gap-20 mb-20">
      {/* Header Section */}
      <div className="text-center">
        <CustomText name="Glory in 240 Seconds" />
      </div>

      <div className="w-full max-w-2xl mx-auto p-4">
        <VideoPlayer
          thumbnailUrl="https://plus.unsplash.com/premium_photo-1661874096599-1d511788c082?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          videoUrl="https://www.youtube.com/embed/xBjPjhjo1dI?si=e8B-143msKv4gvM_"
          title="Creating Smart Cities for a Better Future"
          description="Urbanization and climate change are creating serious challenges like air pollution, water scarcity, and extreme weather. This project explores solutions for building sustainable cities that can adapt to these issues, ensuring healthier and more resilient urban environments."
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
