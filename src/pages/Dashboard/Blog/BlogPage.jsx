import React, { useState } from "react";
import { BlogImg, BlogVideo } from "./assets-blog";
import B1 from "../../../assets/BlogAssets/B1.webp";
import { ThumbsUp, ChartBar, ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function BlogPage() {
  const [thumb, setFav] = useState({});
  const toggleThumbsup = (id) => {
    setFav((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <>
      <div className="mx-12">
        <div className="bg-gray-700 rounded-lg flex flex-col lg:flex-row gap-2 ">
          <img
            src={B1}
            alt="b1"
            className="w-[600px] h-64 rounded-r-lg lg:rounded-r-none rounded-l-lg"
          />
          <div className="pt-0 lg:pt-5 pr-0 lg:pr-5 p-2 lg:p-0">
            <p className="text-2xl lg:text-4xl font-semibold mb-3 text-start ">
              Traffic & Wind Effects on Green Infrastructure for Air Quality
            </p>
            <p className="text-gray-400 text-lg lg:text-xl">
              Humanity achieved a fateful milestone last year. The European
              Union's Copernicus Climate Change Service officially declared 2024
              the hottest year on record.
            </p>
            <button className="flex items-center bg-white text-black px-3 py-1 text-xs rounded cursor-pointer hover:bg-gray-200 transition mt-5">
              <p>Read</p>
              <ArrowUpRight className="ml-1" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* News */}
      <div className="mx-12">
        <Carousel>
          <CarouselContent className="gap-4">
            {BlogImg.map((blog) => (
              <CarouselItem
                key={blog.id}
                className=" rounded-md md:basis-1/2 lg:basis-1/3"
              >
                {/* Image */}
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-56 object-cover rounded-md"
                />
                <p className="text-sm font-semibold mb-3 text-start">
                  {blog.title}
                </p>

                <div className="flex gap-3 items-center">
                  {/* Read Button */}
                  <button className="flex items-center bg-white text-black px-3 py-1 text-xs rounded cursor-pointer hover:bg-gray-200 transition">
                    <p>Read</p>
                    <ArrowUpRight className="ml-1" size={14} />
                  </button>

                  {/* Thumbs Up */}
                  <button onClick={() => toggleThumbsup(blog.id)}>
                    <ThumbsUp
                      size={20}
                      className={`transition ${
                        thumb[blog.id] ? "fill-blue-500 text-blue-500" : "text"
                      }`}
                    />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Video */}
      <div className="mx-12">
        <p className="text-2xl font-bold my-5">Featured Videos</p>
        <Carousel>
          <CarouselContent className="gap-4">
            {BlogVideo.map((video) => (
              <CarouselItem
                key={video.id}
                className=" rounded-md md:basis-1/2 lg:basis-1/3"
              >
                {/* Video */}
                <iframe
                  className="w-full h-[250px]"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p className="text-sm font-semibold mb-3 text-start">
                  {video.title}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
