import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, Loader } from 'lucide-react';

// --- PERBAIKAN: Deklarasikan apiUrl satu kali di sini ---
const apiUrl = import.meta.env.VITE_API_URL;

function PaymentPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${apiUrl}/api/public/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooking(response.data);
                setFinalPrice(response.data.total_price);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gagal memuat detail pesanan.');
                navigate('/dashboard/my-bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, navigate]);

    const handleVerifyPromo = async () => {
        if (!promoCode.trim()) {
            toast.error('Silakan masukkan kode promo.');
            return;
        }
        const toastId = toast.loading('Memverifikasi kode...');
        try {
            const response = await axios.post(`${apiUrl}/api/public/promos/verify`, { code: promoCode });
            const { discountPercentage } = response.data;
            
            const discountAmount = (booking.total_price * discountPercentage) / 100;
            setDiscount(discountAmount);
            setFinalPrice(booking.total_price - discountAmount);
            setPromoMessage(`Diskon ${discountPercentage}% berhasil diterapkan!`);
            toast.success('Kode promo valid!', { id: toastId });
        } catch (error) {
            setDiscount(0);
            setFinalPrice(booking.total_price);
            setPromoMessage('');
            toast.error(error.response?.data?.message || 'Kode promo tidak valid.', { id: toastId });
        }
    };

    const handlePayment = async () => {
        setPaying(true);
        const toastId = toast.loading('Memproses pembayaran...');
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${apiUrl}/api/public/bookings/${bookingId}/pay`, 
                { promoCode: discount > 0 ? promoCode : null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Pembayaran berhasil!', { id: toastId });
            navigate(`/payment-success/${bookingId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Pembayaran gagal.', { id: toastId });
            setPaying(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader className="animate-spin" /></div>;
    
    // PERBAIKAN: Tambahkan fungsi formatCurrency yang hilang
    const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-center">Konfirmasi Pembayaran</h1>
                
                <div className="space-y-2">
                    <label className="label-style">Punya Kode Promo?</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Masukkan kode di sini"
                            className="input-style flex-grow uppercase dark:bg-slate-900 dark:text-white text-slate-900"
                        />
                        <button onClick={handleVerifyPromo} className="btn-secondary flex-shrink-0">Terapkan</button>
                    </div>
                    {promoMessage && <p className="text-sm text-green-600 dark:text-green-400">{promoMessage}</p>}
                </div>

                <div className="border-t border-b py-4 space-y-2">
                    <div className="flex justify-between"><span>Kamar:</span><span className="font-semibold dark:text-white">{booking?.room_name}</span></div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-200"><span>Harga Asli:</span><span>{formatCurrency(booking?.total_price || 0)}</span></div>
                    {discount > 0 && (
                        <div className="flex justify-between text-red-500">
                            <span>Diskon:</span>
                            <span>- {formatCurrency(discount)}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between text-xl font-bold">
                    <span>Total Bayar:</span>
                    <span>{formatCurrency(finalPrice)}</span>
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
