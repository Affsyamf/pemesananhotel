// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import RoomTypes from '../components/RoomTypes';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function DashboardPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Mengambil data dari endpoint publik /api/rooms
        const response = await axios.get('http://localhost:5001/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error("Gagal mengambil data kamar:", error);
        // Anda bisa menambahkan toast error di sini jika mau
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      {/* Kirim data kamar yang sudah diambil sebagai props ke RoomTypes */}
      <RoomTypes rooms={rooms} loading={loading} />
      <Contact />
      <Footer />
    </div>
  );
}

export default DashboardPage;