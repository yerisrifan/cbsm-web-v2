import Image from "next/image";
import { IoLogoAndroid } from "react-icons/io";
import { FaApple } from "react-icons/fa";

export default function Home() {
  return (
    <main className="space-y-20 my-8 px-4 md:px-8 mt-20">
      <section className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="flex items-center">
            <div className="ring-offset-2 ring-4 mr-1 ring-yellow rounded-full w-2 h-2"></div>
            <div className="w-full border-b-4 border-yellow"></div>
          </div>
          <h3 className="text-3xl md:text-5xl font-arialb mt-6 md:mt-8">
            Berinteraksi dan berbagi pengalaman!
          </h3>
          <p className="text-lg md:text-2xl font-medium mt-6 md:mt-12 pr-0 md:pr-10">
            Dapatkan akses ke informasi dan pengetahuan teruji dan terpecaya
            dalam budidaya berbagai macam burung kenari dari komunitas manajemen
            ternak kenari.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/assets/image/section-1.webp"
            alt="hero"
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full h-[250px] md:h-[350px] relative mt-6 md:mt-0"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4 md:p-8 bg-foreground gap-8 md:gap-4">
        {[
          { src: "section-2-img-1.webp", title: "Kebersihan" },
          { src: "section-2-img-2.webp", title: "Jenis Kandang ternak" },
          { src: "section-2-img-3.webp", title: "Pengaturan Ruangan" },
          { src: "section-2-img-4.webp", title: "Pengaturan Indukan" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Image
              src={`/assets/image/${item.src}`}
              alt={item.title}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover w-full h-[200px] md:h-[240px]"
            />
            <h4 className="font-arialb text-xl md:text-2xl text-center">
              {item.title}
            </h4>
          </div>
        ))}
      </section>

      <section id="app" className="relative px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Image
            src="/assets/image/img-app.webp"
            alt="hero"
            width={0}
            height={0}
            sizes="100vw"
            className="object-contain w-full h-[400px] md:h-[700px] relative"
          />
          <div className="mt-8 md:mt-32 z-10">
            <h4 className="font-arialb text-3xl md:text-4xl">
              Berhasil dalam budidaya burung kenari!
            </h4>
            <p className="text-lg md:text-2xl font-medium mt-4">
              Aplikasi CBSM diciptakan untuk berbagi pengetahuan dan mengenalkan
              sebuah sistem untuk mengelola budidaya burung kenari.
            </p>
            <h5 className="text-3xl md:text-4xl font-arialb mt-8">
              Coba sekarang!
            </h5>
            <div className="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="https://app.cbsm.co.id/uploads/cbsm-1.2.3.apk"
                target="_blank"
                className="bg-primary px-8 md:px-16 py-2 text-yellow font-arialb flex items-center justify-center cursor-pointer"
              >
                <IoLogoAndroid size={24} className="mr-2" />
                Android
              </a>
              <a
                href="https://apps.apple.com/id/app/cbsm/id6593665827?l=id"
                target="_blank"
                className="bg-primary px-8 md:px-16 py-2 text-yellow font-arialb flex items-center justify-center"
              >
                <FaApple size={24} className="mr-2" />
                IOS
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="tutorial">
        <h4 className="font-arialb text-3xl md:text-4xl text-center mb-10">
          Video Tutorial
        </h4>
        <iframe
          className="w-full aspect-video self-stretch md:min-h-96"
          src="https://www.youtube.com/embed/XhFT7SmUYJw?si=tNB8y_KSMhftiYZd"
          frameBorder="0"
          loading="lazy"
          title="Product Overview Video"
          aria-hidden="true"
        />
      </section>

      <section id="about" className="bg-yellow p-4 md:p-8">
        <div
          id="footer-header"
          className="flex flex-col md:flex-row items-center justify-center"
        >
          <h4 className="font-arialb text-3xl md:text-4xl min-w-fit mb-4 md:mb-0">
            Tentang Kami
          </h4>
          <div className="w-full hidden md:block">
            <div className="flex items-center ml-4">
              <div className="w-full border-b-4 border-primary"></div>
              <div className="ring-offset-2 ring-offset-primary ring-2 mr-1 ring-primary rounded-full w-3 h-3"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium mt-4">
          <div className="space-y-4">
            <p className="text-sm md:text-base">
              CBSM (Canary Breeding System Management) adalah solusi utama Anda
              untuk mengelola dan mengoptimalkan pengembangbiakan burung kenari.
              Platform kami dirancang khusus untuk para pembiak yang berfokus
              pada pengembangan burung kenari Yorkshire yang diimpor.
            </p>
            <p className="text-sm md:text-base">
              Platform kami memiliki fitur kemampuan perekaman data terperinci,
              yang memungkinkan Anda untuk menyimpan catatan yang akurat untuk
              setiap burung kenari, termasuk pasangan pengembangbiakan dan data
              inkubasi. Selain itu, CBSM menyediakan statistik dan wawasan yang
              kuat untuk membantu Anda memantau populasi burung kenari Anda dari
              waktu ke waktu. Anda dapat memfilter data
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm md:text-base">
              berdasarkan tahun, jenis kelamin, dan status telur untuk
              mendapatkan wawasan berharga tentang aktivitas pengembangbiakan
              Anda.
            </p>
            <p className="text-sm md:text-base">
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
