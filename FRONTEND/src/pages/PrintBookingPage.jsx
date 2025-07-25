// frontend/src/pages/PrintBookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Printer } from 'lucide-react';

function PrintBookingPage() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5001/api/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Gagal mengambil detail pesanan.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookingDetails();
    }, [bookingId]);

    if (loading) {
        return <div className="p-10 text-center">Memuat data pesanan...</div>;
    }

    if (!booking) {
        return <div className="p-10 text-center text-red-500">Data pesanan tidak ditemukan.</div>;
    }

    // Format harga
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.price);

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white shadow-lg p-8 sm:p-12" id="receipt">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hotel Mewah</h1>
                        <p className="text-gray-500 dark:text-slate-900">Bukti Pemesanan</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold dark:text-slate-900">ID Pesanan:</p>
                        <p className="font-mono text-gray-700">#{booking.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6 my-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-900 uppercase">Dipesan Oleh</h3>
                        <p className="text-lg text-gray-800 dark:text-slate-900 font-bold">{booking.guest_name}</p>
                        <p className="text-gray-600 dark:text-slate-900">{booking.email}</p>
                        <p className="text-gray-600 dark:text-slate-900">{booking.guest_address}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase dark:text-slate-900">Detail Pesanan</h3>
                        <p className="text-lg text-gray-800 dark:text-slate-900 font-bold">{new Date(booking.booking_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-gray-600 dark:text-slate-900">Tanggal Pembuatan: {new Date(booking.created_at).toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold dark:text-slate-900">Deskripsi</th>
                                <th className="p-3 text-sm font-semibold text-right dark:text-slate-900">Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3">
                                    <p className="font-bold text-gray-800">{booking.room_name}</p>
                                    <p className="text-gray-600 text-sm dark:text-slate-900">{booking.room_type}</p>
                                </td>
                                <td className="p-3 text-right dark:text-slate-900 font-bold">{formattedPrice}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="p-3 font-bold text-right dark:text-slate-900">Total</td>
                                <td className="p-3 font-bold text-right text-xl dark:text-slate-900">{formattedPrice}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="mt-12 text-center text-xs text-gray-500 dark:text-slate-900 font-bold">
                    <p>Terima kasih telah memilih Hotel Mewah. Harap tunjukkan bukti ini saat check-in.</p>
                </div>
            </div>

            <button onClick={() => window.print()} className="btn-primary mt-8 flex items-center print:hidden">
                <Printer size={18} className="mr-2" />
                Cetak Bukti Pesanan
            </button>
        </div>
    );
}

export default PrintBookingPage;