// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import RoomTypes from '../components/RoomTypes';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function DashboardPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <RoomTypes />
      <Contact />
      <Footer />
    </div>
  );
}

export default DashboardPage;