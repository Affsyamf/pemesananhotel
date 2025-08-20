import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';

function RoomDetailPage() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [mainImage, setMainImage] = useState('');

  const token = localStorage.getItem('token');
  const userInfo = token ? { token } : null;

  // --- PERBAIKAN UTAMA: Menggabungkan semua logika fetch ke dalam satu fungsi ---
  const fetchRoomData = async () => {
    if (!roomId) return;
    setLoading(true);
    try {
        // Definisikan semua URL API di sini
        const roomUrl = `http://localhost:5001/api/public/rooms/${roomId}`;
        const reviewsUrl = `http://localhost:5001/api/public/rooms/${roomId}/reviews`;

        // Siapkan panggilan API dasar
        const apiCalls = [
            axios.get(roomUrl),
            axios.get(reviewsUrl)
        ];

        // Jika pengguna login, tambahkan panggilan API untuk verifikasi ulasan
        if (userInfo) {
            const canReviewUrl = `http://localhost:5001/api/public/rooms/${roomId}/can-review`;
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            apiCalls.push(axios.get(canReviewUrl, config));
        }

        // Jalankan semua panggilan API secara paralel
        const responses = await Promise.all(apiCalls);
        
        const roomData = responses[0].data;
        setRoom(roomData);
        setReviews(responses[1].data);

        // Set gambar utama dari galeri
        if (roomData.images && roomData.images.length > 0) {
            setMainImage(roomData.images[0].image_url);
        }

        // Jika panggilan verifikasi dijalankan, update state 'canReview'
        if (responses.length > 2) {
            setCanReview(responses[2].data.canReview);
        }

    } catch (error) {
        toast.error(error.response?.data?.message ||"Gagal mengambil data detail kamar.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [roomId]); // Hanya perlu satu useEffect

  const handleReviewSubmit = async ({ rating, comment }) => {
    setSubmitLoading(true);
    const toastId = toast.loading('Mengirim ulasan...');
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      const reviewUrl = `http://localhost:5001/api/public/rooms/${roomId}/reviews`;
      await axios.post(reviewUrl, { rating, comment }, config);
      
      toast.success('Ulasan Anda berhasil dikirim!', { id: toastId });
      // Panggil ulang fetchRoomData untuk refresh semuanya
      fetchRoomData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim ulasan.', { id: toastId });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-xl">Memuat Detail Kamar...</p>;
  if (!room) return <p className="text-center mt-20 text-xl">Kamar tidak ditemukan.</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* --- BAGIAN GALERI FOTO --- */}
      <div className="mb-8">
        <div className="mb-4">
            <img 
                src={mainImage || 'https://placehold.co/1200x600'} 
                alt={room.name} 
                className="w-full h-[300px] md:h-[500px] object-cover rounded-lg shadow-lg"
            />
        </div>
        {room.images && room.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto p-2">
                {room.images.map(img => (
                    <button key={img.id} onClick={() => setMainImage(img.image_url)} className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${mainImage === img.image_url ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}>
                        <img 
                            src={img.image_url} 
                            alt={`Thumbnail ${img.id}`} 
                            className="w-24 h-16 object-cover"
                        />
                    </button>
                ))}
            </div>
        )}
      </div>
      
      {/* --- Bagian Detail Kamar --- */}
      {/* PERBAIKAN: Hapus gambar duplikat dari sini */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{room.name}</h1>
        <div className="flex items-center my-3">
          <StarRating value={room.averageRating} />
          <span className="ml-3 text-gray-600 dark:text-gray-300">({room.numReviews} ulasan)</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg">{room.description}</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-4">Rp {Number(room.price).toLocaleString('id-ID')}</p>
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      {/* --- Bagian Ulasan --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <ReviewList reviews={reviews} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          {userInfo ? (
            canReview ? (
              <ReviewForm onSubmit={handleReviewSubmit} isLoading={submitLoading} />
            ) : (
              <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ulas Kamar Ini</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Anda harus menyelesaikan pemesanan untuk kamar ini sebelum dapat memberikan ulasan.
                  </p>
              </div>
            )
          ) : (
            <div className="text-center h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ingin Berbagi Pengalaman?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Anda harus <Link to="/login" className="text-blue-600 hover:underline font-semibold">login</Link> untuk menulis ulasan.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomDetailPage;
