// frontend/src/components/Contact.jsx
import React from 'react';

function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Hubungi Kami
        </h2>
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
            <p className="text-center text-gray-600 mb-8">
                Punya pertanyaan atau ingin melakukan reservasi? Jangan ragu untuk menghubungi kami.
            </p>
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">Alamat:</p>
                <p className="text-gray-600">Jl. Kemewahan No. 123, Jakarta, Indonesia</p>
                <p className="text-lg font-semibold text-gray-800 mt-4">Email:</p>
                <p className="text-blue-600 hover:underline cursor-pointer">reservasi@hotelmewah.com</p>
                <p className="text-lg font-semibold text-gray-800 mt-4">Telepon:</p>
                <p className="text-gray-600">(021) 123-4567</p>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;