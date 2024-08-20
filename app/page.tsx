import Image from "next/image";
import { IoLogoAndroid } from "react-icons/io";
import { FaApple } from "react-icons/fa";

export default function Home() {
  return (
    <main className="space-y-20 my-8 px-0 md:px-8 mt-20">
      <section className="flex flex-col md:flex-row justify-between px-8 ">
        <div className="w-full md:w-1/2 mb-4">
          <div className="flex items-center">
            <div className="ring-offset-2 ring-4 mr-1 ring-yellow rounded-full w-2 h-2"></div>
            <div className="w-full border-b-4 border-yellow"></div>
          </div>
          <h3 className="text-5xl font-arialb mt-8 ">
            Berinteraksi dan berbagi pengalaman!
          </h3>
          <p className="text-2xl font-medium mt-12 pr-10">
            Dapatkan akses ke informasi dan pengetahuan teruji dan terpecaya
            dalam budidaya berbagai macam burung kenari dari komunitas manajemen
            ternak kenari.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/assets/image/section-1.jpg"
            alt="hero"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full h-[350px] relative mt-10 md:mt-0"
          />
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-4 p-8 bg-foreground  gap-8 md:gap-4">
        <div className="flex flex-col items-center justify-center gap-4 ">
          <Image
            src="/assets/image/section-2-img-1.jpg"
            alt="hero"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-[420px] h-[240px] relative"
          />
          <h4 className="font-arialb text-2xl">Kebersihan</h4>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 ">
          <Image
            src="/assets/image/section-2-img-2.jpg"
            alt="hero"
            width={0}
            height={0}
            sizes="50vw"
            className="object-cover w-[420px] h-[240px] relative"
          />
          <h4 className="font-arialb text-2xl">Jenis Kandang ternak</h4>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 ">
          <Image
            src="/assets/image/section-2-img-3.jpg"
            alt="hero"
            width={0}
            height={0}
            sizes="10vw"
            className="object-cover w-[420px] h-[240px] relative"
          />
          <h4 className="font-arialb text-2xl">Pengaturan Ruangan</h4>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 ">
          <Image
            src="/assets/image/section-2-img-4.jpg"
            alt="hero"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-[420px] h-[240px] relative"
          />
          <h4 className="font-arialb text-2xl">Pengaturan Indukan</h4>
        </div>
      </section>
      <section id="app" className="relative">
        <div id="top" className="flex flex-col md:flex-row absolute w-full ">
          <div className="relative w-[500px] h-[500px]"></div>
          <div className="w-full hidden md:block">
            <div className="flex items-center mt-20">
              <div className="w-full border-b-4 border-yellow"></div>
              <div className="ring-offset-2 ring-4 mr-1 ring-yellow rounded-full w-2 h-2"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <Image
            src="/assets/image/img-app.png"
            alt="hero"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full h-[700px] relative"
          />
          <div className="mt-32 z-10">
            <h4 className="font-arialb text-4xl">
              Berhasil dalam budidaya burung kenari!
            </h4>
            <p className="text-2xl font-medium mt-4">
              Aplikasi CBSM diciptakan untuk berbagi pengetahuan dan mengenalkan
              sebuah sistem untuk mengelola budidaya burung kenari.
            </p>
            <h5 className="text-4xl font-arialb mt-8">Coba sekarang!</h5>
            <div className="flex flex-col md:flex-row mt-4 space-x-0 md:space-x-4 space-y-2 md:space-y-0">
              <a
                href="https://app.cbsm.co.id/uploads/cbsm-1.2.3.apk"
                target="_blank"
                className="bg-primary px-16 py-2 text-yellow font-arialb flex items-center justify-center cursor-pointer "
              >
                <IoLogoAndroid size={24} className="mr-2" />
                Android
              </a>
              <a
                href="https://apps.apple.com/id/app/cbsm/id6593665827?l=id"
                target="_blank"
                className="bg-primary px-16 py-2 text-yellow font-arialb flex items-center justify-center "
              >
                <FaApple size={24} className="mr-2" />
                IOS
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="bg-yellow p-8">
        <div
          id="footer-header"
          className="flex flex-col md:flex-row items-center justify-center "
        >
          <h4 className="font-arialb text-4xl min-w-fit">Tentang Kami</h4>
          <div className="w-full hidden md:block">
            <div className="flex items-center ml-4">
              <div className="w-full border-b-4 border-primary"></div>
              <div className="ring-offset-2 ring-offset-primary ring-2 mr-1 ring-primary rounded-full w-3 h-3"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium mt-4">
          <div className="space-y-4">
            <p>
              CBSM (Canary Breeding System Management) adalah solusi utama Anda
              untuk mengelola dan mengoptimalkan pengembangbiakan burung kenari.
              Platform kami dirancang khusus untuk para pembiak yang berfokus
              pada pengembangan burung kenari Yorkshire yang diimpor.
            </p>
            <p>
              Platform kami memiliki fitur kemampuan perekaman data terperinci,
              yang memungkinkan Anda untuk menyimpan catatan yang akurat untuk
              setiap burung kenari, termasuk pasangan pengembangbiakan dan data
              inkubasi. Selain itu, CBSM menyediakan statistik dan wawasan yang
              kuat untuk membantu Anda memantau populasi burung kenari Anda dari
              waktu ke waktu. Anda dapat memfilter data
            </p>
          </div>
          <div className="space-y-4">
            <p>
              berdasarkan tahun, jenis kelamin, dan status telur untuk
              mendapatkan wawasan berharga tentang aktivitas pengembangbiakan
              Anda.
            </p>
            <p>
              Dengan CBSM, Anda juga mendapatkan manfaat dari pemfilteran
              berbasis pemilik, yang memungkinkan Anda untuk hanya melihat
              burung kenari yang Anda miliki, sehingga menyederhanakan
              pengelolaan koleksi Anda. Antarmuka yang ramah pengguna memastikan
              bahwa navigasi dan pengelolaan catatan Anda intuitif dan efisien.
              Bergabunglah dengan komunitas CBSM hari ini dan tingkatkan
              pengalaman manajemen pengembangbiakan burung kenari Anda!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
