// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import RoomTypes from '../components/RoomTypes';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FeaturedRoomCard from '../components/FeaturedRoomCard';
import toast from 'react-hot-toast';

function DashboardPage() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        // Mengambil data dari endpoint publik /api/rooms
         const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${apiUrl}/api/public/featured-rooms`);
        setFeaturedRooms(response.data);
      } catch (error) {
        console.error("Gagal mengambil data kamar unggulan:", error);
        toast.error('Gagal memuat data kamar unggulan.');
        // toats error jika gagal mengambil data
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Hero />
      <About />
      {/* Kirim data kamar yang sudah diambil sebagai props ke RoomTypes */}
      <section className="py-20" id='rooms'>
          <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
                  Kamar Pilihan Kami
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
                  Temukan kenyamanan dan kemewahan yang dirancang khusus untuk Anda.
              </p>
              
              {loading ? (
                  <p className="text-center dark:text-gray-300">Memuat kamar...</p>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {featuredRooms.map(room => (
                          <FeaturedRoomCard key={room.id} room={room} />
                      ))}
                  </div>
              )}
          </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
}

export default DashboardPage;