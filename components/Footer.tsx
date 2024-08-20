import React from "react";
import Image from "next/image";

function Footer() {
  return (
    <div className="bg-primary text-white p-8 flex flex-col items-center justify-center w-full">
      <Image
        src="/assets/image/logo-small-big.webp"
        alt="logo"
        width={100}
        height={50}
      />
      <div className="text-center text-sm text-white/70 max-w-xl">
        Seluruh hak cipta foto dan grafis yang ditampilkan dalam laman ini
        merupakan milik komunitas CBSM dan dilarang untuk disadur, digunakan
        untuk kepentingan diluar CBSM.
      </div>
      <div className="text-center text-sm text-white/70 mt-2">
        &copy; 2024 CBSM
      </div>
    </div>
  );
}

export default Footer;
