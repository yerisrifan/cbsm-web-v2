"use client";

import React from "react";
import Image from "next/image";
import { RiMenu3Line } from "react-icons/ri";
import Link from "next/link";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bg-primary text-white shadow-sm w-full relative">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-10 pt-4 md:pt-10 pb-4 md:pb-4">
        <div id="dekstop" className="hidden md:flex font-arialb mb-0 md:mb-4">
          <Image
            src="/assets/image/logo.webp"
            alt="logo"
            width={250}
            height={100}
            style={{ height: "auto" }}
            className="cursor-pointer"
          />
        </div>
        <div id="mobile" className="flex md:hidden font-arialb">
          <Image
            src="/assets/image/logo.webp"
            alt="logo"
            width={150}
            height={30}
            style={{ height: "auto" }}
            className="cursor-pointer"
          />
        </div>
        <div className="space-x-4 hidden md:flex font-arialb">
          <Link
            href="/"
            className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
          >
            Beranda
          </Link>

          <Link
            href="/avigen"
            className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
          >
            Kalkulator Avigen
          </Link>

          <Link
            href="/#app"
            className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
          >
            Aplikasi CBSM
          </Link>
          <Link
            href="/#tutorial"
            className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
          >
            Tutorial
          </Link>
          <Link
            href="/#about"
            className="bg-yellow px-4 py-2 text-primary  hover:bg-yellow/80 transition delay-150 hover:text-white"
          >
            Tentang CBSM
          </Link>
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
              <Link href="/">Beranda</Link>
            </div>
            <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
              <Link href="/avigen">Kalkulator Avigen</Link>
            </div>
            <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
              <Link href="/#app">Aplikasi CBSM</Link>
            </div>
            <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
              <Link href="/#tutorial">Tutorial</Link>
            </div>
            <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
              <Link href="/#about">Tentang CBSM</Link>
            </div>
            <div className="bg-primary text-white px-4 py-2  hover:bg-yellow/80 transition delay-150">
              <a target="_blank" href="https://lynk.id/pendaftarancbsm">
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
