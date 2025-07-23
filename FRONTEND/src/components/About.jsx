// frontend/src/components/About.jsx
import React from 'react';

function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Tentang Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop" 
              alt="Hotel Exterior" 
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="text-gray-600 text-lg">
            <p className="mb-4">
              Hotel Mewah adalah destinasi pilihan bagi para pelancong yang mencari kemewahan, kenyamanan, dan pelayanan personal. Berlokasi strategis di jantung kota, hotel kami menawarkan akses mudah ke berbagai atraksi utama sambil menyediakan oase ketenangan.
            </p>
            <p>
              Dengan arsitektur modern dan fasilitas lengkap, kami berkomitmen untuk memberikan pengalaman menginap yang tak hanya memuaskan, tetapi juga menginspirasi. Setiap sudut hotel dirancang dengan detail untuk kenyamanan Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;