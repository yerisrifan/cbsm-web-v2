import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <div className="relative">
      <Image
        src="/assets/image/hero-image.webp"
        alt="hero"
        width={0}
        height={0}
        sizes="100vw"
        className="object-cover w-full h-[480px] relative"
      />
      <div className="absolute inset-0 bg-black/50 w-full h-full text-white">
        <div className="flex flex-col items-center md:items-start justify-center h-full ml-0 md:ml-12">
          <h1 className="text-6xl md:text-9xl  font-arialb mb-0 md:md-4">
            CBSM
          </h1>
          <h2 className="text-xl md:text-3xl font-arial italic">
            Canary Breeding System Management
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Hero;
