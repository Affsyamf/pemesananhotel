import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function PaymentSuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/dashboard/my-bookings');
        }, 5000); // Redirect setelah 5 detik
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
            <CheckCircle className="text-green-500 mb-4" size={80} />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pembayaran Berhasil!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
                Pesanan Anda sedang menunggu konfirmasi dari admin. Anda akan diarahkan sebentar lagi.
            </p>
            <Link to="/dashboard/my-bookings" className="btn-primary mt-6">
                Lihat Riwayat Pesanan
            </Link>
        </div>
    );
}

export default PaymentSuccessPage;
