'use client'

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type SwiperType from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductImageSlider = ({ urls }: { urls: string[] }) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
    });
  }, [swiper, urls]);

  const activeStyle =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-6 w-6 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";

  const inactiveStyle = "hidden text-gray-400";

  return (
    <div className="relative overflow-hidden group bg-zinc-100 aspect-square rounded-xl">
      <div className="absolute inset-0 z-10 transition opacity-0 group-hover:opacity-100">
        <div
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className="absolute top-0 bottom-0 right-0 w-1/12 h-full bg-transparent"
        >
          <button
            className={cn(activeStyle, "right-3 transition", {
              [inactiveStyle]: slideConfig.isEnd,
              "hover:bg-primary-300 text-primary-800 opacity-100":
                !slideConfig.isEnd,
            })}
            aria-label="next image"
          >
            <ChevronRight className="w-4 h-4 text-zinc-700" />
          </button>
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className="absolute top-0 bottom-0 left-0 w-1/12 h-full bg-transparent"
        >
          <button
            className={cn(activeStyle, "left-3 transition", {
              [inactiveStyle]: slideConfig.isBeginning,
              "hover:bg-primary-300 text-primary-800 opacity-100":
                !slideConfig.isBeginning,
            })}
            aria-label="prev image"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-700" />
          </button>
        </div>
      </div>

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        modules={[Pagination]}
        className="w-full h-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide
            key={`${url}-${i}`}
            className="relative w-full h-full -z-10"
          >
            <Image
              src={url}
              fill
              loading="lazy"
              className="object-cover object-center w-full h-full -z-10"
              alt="Product image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageSlider;
