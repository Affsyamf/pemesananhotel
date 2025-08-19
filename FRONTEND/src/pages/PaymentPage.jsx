import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, Loader } from 'lucide-react';

function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5001/api/public/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message||'Gagal memuat detail pesanan.');
                navigate('/dashboard/my-bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, navigate]);

    const handlePayment = async () => {
        setPaying(true);
        const toastId = toast.loading('Memproses pembayaran...');
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5001/api/public/bookings/${bookingId}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Pembayaran berhasil!', { id: toastId });
            navigate(`/payment-success/${bookingId}`); // Arahkan ke halaman sukses
        } catch (error) {
            toast.error(error.response?.data?.message || 'Pembayaran gagal.', { id: toastId });
            setPaying(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" /></div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-center">Konfirmasi Pembayaran</h1>
                <div className="border-t border-b py-4 space-y-2">
                    <div className="flex justify-between"><span>Kamar:</span><span className="font-semibold">{booking?.room_name}</span></div>
                    <div className="flex justify-between"><span>Check-in:</span><span>{new Date(booking?.check_in_date).toLocaleDateString('id-ID')}</span></div>
                    <div className="flex justify-between"><span>Check-out:</span><span>{new Date(booking?.check_out_date).toLocaleDateString('id-ID')}</span></div>
                </div>
                <div className="flex justify-between text-xl font-bold">
                    <span>Total Bayar:</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(booking?.total_price || 0)}</span>
                </div>
                <button onClick={handlePayment} disabled={paying} className="btn-primary w-full flex items-center justify-center">
                    <CreditCard size={20} className="mr-2" />
                    {paying ? 'Memproses...' : 'Bayar Sekarang (Simulasi)'}
                </button>
            </div>
        </div>
    );
}

export default PaymentPage;
