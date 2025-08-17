import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Hotel, Calendar, User, BedDouble } from 'lucide-react'; // Import ikon

function PrintBookingPage() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                // Endpoint ini sudah ada di public.js dan seharusnya mengembalikan semua detail booking
                const response = await axios.get(`http://localhost:5001/api/public/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(response.data);
                setTimeout(() => window.print(), 500);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gagal mengambil detail pesanan');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    if (loading) return <p className="text-center p-10">Memuat detail pesanan...</p>;
    if (!booking) return <p className="text-center p-10">Pesanan tidak ditemukan.</p>;
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; margin: 0; }
                    .no-print { display: none; }
                    .print-container { 
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border: none;
                    }
                }
            `}</style>
            <div className="font-sans p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl print-container">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-gray-100 pb-6 mb-8">
                    <div className="flex items-center">
                        <div className="bg-blue-600 p-3 rounded-full mr-4">
                            <Hotel className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Bukti Reservasi</h1>
                            <p className="text-gray-500">Status: <span className="font-semibold text-green-600 capitalize">{booking.status}</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-700">ID Pesanan</p>
                        <p className="text-lg font-mono text-blue-600">#{booking.id}</p>
                    </div>
                </div>

                {/* Detail Pemesan & Tamu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-sm font-bold text-gray-500 uppercase flex items-center mb-3"><User size={14} className="mr-2"/> Dipesan Oleh</h2>
                        <p className="text-lg font-medium text-gray-800">{booking.username}</p>
                        <p className="text-gray-600">{booking.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-sm font-bold text-gray-500 uppercase flex items-center mb-3"><User size={14} className="mr-2"/> Detail Tamu</h2>
                        <p className="text-lg font-medium text-gray-800">{booking.guest_name}</p>
                        <p className="text-gray-600">{booking.guest_address}</p>
                    </div>
                </div>

                {/* Detail Kamar */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase flex items-center mb-3"><BedDouble size={14} className="mr-2"/> Detail Kamar</h2>
                    <div className="border border-gray-200 rounded-lg p-6 flex justify-between items-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{booking.room_name}</p>
                            <p className="text-gray-600">{booking.room_type}</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(booking.price)}</p>
                    </div>
                </div>

                {/* Detail Tanggal */}
                <div className="grid grid-cols-3 gap-4 bg-blue-50 p-6 rounded-lg text-center">
                    <div>
                        <h2 className="text-sm font-bold text-gray-500 uppercase flex items-center justify-center mb-2"><Calendar size={14} className="mr-2"/> Tanggal Pesan</h2>
                        <p className="text-lg font-semibold text-gray-800">{formatDate(booking.created_at)}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-blue-600 uppercase flex items-center justify-center mb-2"><Calendar size={14} className="mr-2"/> Check-in</h2>
                        <p className="text-lg font-semibold text-blue-800">{formatDate(booking.check_in_date)}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-blue-600 uppercase flex items-center justify-center mb-2"><Calendar size={14} className="mr-2"/> Check-out</h2>
                        <p className="text-lg font-semibold text-blue-800">{formatDate(booking.check_out_date)}</p>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
                    <p>Terima kasih telah melakukan reservasi. Mohon tunjukkan bukti ini saat check-in.</p>
                    <button onClick={() => window.print()} className="no-print mt-6 btn-primary">
                        Cetak Ulang
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PrintBookingPage;
