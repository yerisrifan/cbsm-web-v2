"use client";

import React from "react";
import Image from "next/image";
import { RiMenu3Line } from "react-icons/ri";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex  justify-between items-center bg-primary text-white px-4 md:px-10 pt-2 md:pt-10 pb-2 md:pb-0 shadow-sm">
      <div id="dekstop" className="hidden md:flex font-arialb mb-0 md:mb-4">
        <Image
          src="/assets/image/logo.webp"
          alt="logo"
          width={250}
          height={100}
          className="cursor-pointer"
        />
      </div>
      <div id="mobile" className="flex md:hidden font-arialb">
        <Image
          src="/assets/image/logo.webp"
          alt="logo"
          width={150}
          height={30}
          className="cursor-pointer"
        />
      </div>
      <div className="space-x-4 hidden md:flex font-arialb">
        <a
          href="/"
          className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
        >
          Beranda
        </a>
        <a
          href="#about"
          className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
        >
          Tentang CBSM
        </a>
        <a
          href="#app"
          className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
        >
          Aplikasi CBSM
        </a>
        <a
          target="_blank"
          href="https://lynk.id/pendaftarancbsm"
          className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
        >
          Hubungi Kami
        </a>
      </div>
      <div className="flex md:hidden">
        <button onClick={() => setOpen(!open)}>
          <RiMenu3Line />
        </button>
      </div>
      <div
        id="menu-mobile"
        className={
          open
            ? "flex md:hidden absolute right-0 top-[75px] z-10 cursor-pointer flex-1 bg-primary text-white  py-2  "
            : "hidden"
        }
      >
        <div>
          <div className="bg-primary  text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
            <a href="/">Beranda</a>
          </div>
          <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
            <a href="#about">Tentang CBSM</a>
          </div>
          <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
            <a href="#app">Aplikasi CBSM</a>
          </div>
          <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
            <a target="_blank" href="https://lynk.id/pendaftarancbsm">
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
