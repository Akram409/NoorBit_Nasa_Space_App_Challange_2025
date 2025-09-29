import { Books, Banners } from "@/pages/Dashboard/StoryTelling/assets-books";
import Video1 from "../../../assets/StorytellingBooksCover/video_urban.mp4";
import { Heart, ArrowUpRight } from "lucide-react";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const StorytellingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fav, setFav] = useState({});
  const toggleFavorite = (id) => {
    setFav((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter books based on search input
  const filteredBooks = Books.filter((Books) =>
    Books.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      {/* Search Box */}
      <div className="p-5">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search Book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pr-20 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm text-gray-900 dark:text-neutral-100 placeholder-gray-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
        />

        {/* Show Books Only When User Types */}
        {searchTerm.trim() !== "" &&
          (filteredBooks.length > 0 ? (
            <div className="grid grid-cols-4 gap-2.5 mt-2.5">
              {filteredBooks.map((Books) => (
                <div key={Books.id} style={{ textAlign: "center" }}>
                  <img
                    src={Books.image}
                    alt={Books.title}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <p>{Books.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No books found</p>
          ))}
      </div>

      {/* Banners */}
      <div className="mx-12">
        <Carousel>
          <CarouselContent>
            {Banners.map((Banners) => (
              <CarouselItem
                key={Banners.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <img
                  src={Banners.image}
                  alt={Banners.title}
                  className="w-full h-48  rounded-md"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* New Books */}
      <div className="mx-12">
        <p className="text-2xl font-semibold pb-2">New Story</p>
        <Carousel>
          <CarouselContent>
            {Books.map((Books) => {
              return (
                <CarouselItem
                  key={Books.id}
                  className="relative group md:basis-1/2 lg:basis-1/4"
                >
                  <img
                    src={Books.image}
                    alt={Books.title}
                    className="w-full h-40  rounded-md"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white px-2">
                    {/* Title */}
                    <p className="text-sm font-semibold mb-2 text-center">
                      {Books.title}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-5 items-center">
                      {/* Read Button */}
                      <button className="flex items-center bg-white text-black px-3 py-1 text-xs rounded cursor-pointer">
                        <p>Read</p>
                        <ArrowUpRight />
                      </button>

                      {/* Favorite Icon */}
                      <button onClick={() => toggleFavorite(Books.id)}>
                        <Heart
                          size={20}
                          className={`transition ${
                            fav[Books.id]
                              ? "fill-red-500 text-red-500"
                              : "text-white"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Animation Video */}

      <div className="mx-12">
        <p className="text-2xl font-semibold pb-2">Animation</p>
        <video
          src={Video1}
          autoPlay
          loop
          className="w-full lg:w-auto h-48 rounded-md"
        />
      </div>
    </>
  );
};

export default StorytellingPage;
