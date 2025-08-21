import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Hotel, Calendar, DollarSign, ListChecks, BarChart } from 'lucide-react';

function PrintReportPage() {
    const location = useLocation();
    const { reportData, dates } = location.state || {}; // Ambil data yang dikirim dari halaman laporan

    useEffect(() => {
        // Otomatis memicu dialog print setelah komponen dimuat
        if (reportData) {
            setTimeout(() => window.print(), 1000);
        }
    }, [reportData]);

    if (!reportData) {
        return (
            <div className="text-center p-10">
                <p>Data laporan tidak ditemukan.</p>
                <Link to="/admin/reports" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Laporan</Link>
            </div>
        );
    }

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div className="bg-white font-sans p-8 print-container">
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .no-print { display: none; }
                    @page { size: A4; margin: 20mm; }
                }
            `}</style>
            
            {/* Header Laporan */}
            <header className="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-8">
                <div className="flex items-center">
                    <Hotel size={40} className="text-gray-800 mr-4" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Laporan Kinerja Hotel</h1>
                        <p className="text-gray-600">Dokumen Internal</p>
                    </div>
                </div>
                <div className="text-right dark:text-slate-900">
                    <p className="font-semibold ">Tanggal Cetak:</p>
                    <p>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
            </header>

            {/* Periode Laporan */}
            <div className="bg-gray-100 p-4 rounded-lg mb-8 text-center">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center justify-center">
                    <Calendar size={18} className="mr-2" />
                    Periode Laporan: {formatDate(dates.startDate)} - {formatDate(dates.endDate)}
                </h2>
            </div>

            {/* Ringkasan Statistik */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ringkasan</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 flex items-center"><DollarSign size={14} className="mr-2"/> Total Pendapatan</p>
                        <p className="text-2xl font-bold text-blue-900">{formatCurrency(reportData.summary.totalRevenue)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-800 flex items-center"><ListChecks size={14} className="mr-2"/> Total Pesanan</p>
                        <p className="text-2xl font-bold text-green-900">{reportData.summary.totalBookings}</p>
                    </div>
                </div>
            </section>

            {/* Kamar Terpopuler */}
            <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                    <BarChart size={18} className="mr-2"/> Kamar Terpopuler
                </h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 dark:text-slate-900 text-center">Peringkat</th>
                            <th className="border p-2 dark:text-slate-900 text-center">Nama Kamar</th>
                            <th className="border p-2 text-center dark:text-slate-900">Jumlah Pesanan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.popularRooms.map((room, index) => (
                            <tr key={room.name} className="hover:bg-gray-50">
                                <td className="border p-2 text-center font-semibold dark:text-slate-900 ">{index + 1}</td>
                                <td className="border p-2 dark:text-slate-900 text-center">{room.name}</td>
                                <td className="border p-2 text-center dark:text-slate-900">{room.bookingCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <footer className="mt-12 text-center text-xs text-gray-500 no-print">
                <p>Klik Ctrl+P atau Cmd+P untuk mencetak laporan ini.</p>
                <Link to="/admin/reports" className="btn-secondary mt-4">Kembali</Link>
            </footer>
        </div>
    );
}

export default PrintReportPage;
