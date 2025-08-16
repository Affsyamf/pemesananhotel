import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import komponen ulasan yang sudah kita rancang
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';

const RoomDetailPage = () => {
  const { roomId } = useParams(); // Ambil ID kamar dari URL, misal: /rooms/3
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Cek apakah user sudah login dari token di localStorage
  const token = localStorage.getItem('token');
  const userInfo = token ? { token } : null;

  // Fungsi untuk mengambil data kamar dan ulasannya
  const fetchRoomAndReviews = async () => {
    try {
      setLoading(true);
      // Ganti URL jika diperlukan, tapi ini harusnya sudah sesuai dengan backend Anda
      const roomUrl = `http://localhost:5001/api/public/rooms/${roomId}`;
      const reviewsUrl = `http://localhost:5001/api/public/rooms/${roomId}/reviews`;

      // Menggunakan Promise.all untuk fetch data secara paralel
      const [roomResponse, reviewsResponse] = await Promise.all([
        axios.get(roomUrl),
        axios.get(reviewsUrl)
      ]);
      
      setRoom(roomResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil data detail kamar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomAndReviews();
    }
  }, [roomId]);

  // Fungsi untuk menangani pengiriman ulasan baru
  const handleReviewSubmit = async ({ rating, comment }) => {
    setSubmitLoading(true);
    const toastId = toast.loading('Mengirim ulasan...');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Kirim token otentikasi
        },
      };
      const reviewUrl = `http://localhost:5001/api/public/rooms/${roomId}/reviews`;
      await axios.post(reviewUrl, { rating, comment }, config);
      
      toast.success('Ulasan Anda berhasil dikirim!', { id: toastId });
      // Refresh daftar ulasan setelah berhasil
      fetchRoomAndReviews(); 
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
      {/* Bagian Detail Kamar */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <img src={room.image_url} alt={room.name} className="w-full h-96 object-cover rounded-lg mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{room.name}</h1>
        <div className="flex items-center my-3">
          <StarRating value={room.averageRating} />
          <span className="ml-3 text-gray-600 dark:text-gray-300">({room.numReviews} ulasan)</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-4 text-lg">{room.description}</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-4">Rp {Number(room.price).toLocaleString('id-ID')}</p>
      </div>

      <hr className="my-10 border-gray-300 dark:border-gray-600" />

      {/* Bagian Ulasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <ReviewList reviews={reviews} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          {userInfo ? (
            <ReviewForm onSubmit={handleReviewSubmit} isLoading={submitLoading} />
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
};

export default RoomDetailPage;
