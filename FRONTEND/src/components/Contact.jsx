import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

function Contact() {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Hubungi Kami
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Kami siap membantu Anda 24/7</p>
        </div>
        <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Alamat</h4>
                    <p className="text-gray-600 dark:text-gray-300">Jl. Kemewahan No. 123, Jakarta, Indonesia</p>
                </div>
                <div className="flex flex-col items-center">
                    <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Email</h4>
                    <a href="mailto:reservasi@hotelmewah.com" className="text-blue-600 dark:text-blue-400 hover:underline">afif@gmail.com</a>
                </div>
                <div className="flex flex-col items-center">
                    <Phone className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Telepon</h4>
                    <p className="text-gray-600 dark:text-gray-300">+6289517644630</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;