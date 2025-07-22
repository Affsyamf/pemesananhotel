// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Sedang memuat...');

  useEffect(() => {
    // Alamat URL backend Anda
    axios.get('http://localhost:5001/api/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Gagal terhubung ke backend.');
      });
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen dimuat

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Website Pemesanan Hotel
        </h1>
        <p className="text-lg text-gray-700 p-4 border border-dashed border-gray-300 rounded-md">
          Pesan dari Backend: <span className="font-semibold text-green-600">{message}</span>
        </p>
      </div>
    </div>
  );
}

export default App;