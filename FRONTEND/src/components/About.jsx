import React from 'react';

function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Tentang Hotel Kami
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Kenyamanan dan Kemewahan yang Menyatu</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Destinasi Pilihan Anda</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
              Hotel Mewah adalah destinasi pilihan bagi para pelancong yang mencari kemewahan, kenyamanan, dan pelayanan personal. Berlokasi strategis di jantung kota, hotel kami menawarkan akses mudah ke berbagai atraksi utama sambil menyediakan oase ketenangan.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Dengan arsitektur modern dan fasilitas lengkap, kami berkomitmen untuk memberikan pengalaman menginap yang tak hanya memuaskan, tetapi juga menginspirasi. Setiap sudut hotel dirancang dengan detail untuk kenyamanan Anda.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop" 
              alt="Hotel Exterior" 
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;