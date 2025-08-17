import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

function ManageAvailabilityPage() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [availabilityData, setAvailabilityData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState({}); // Lacak perubahan

    // 1. Ambil daftar semua kamar untuk dropdown
    useEffect(() => {
        const fetchRooms = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5001/api/admin/rooms', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRooms(response.data);
                if (response.data.length > 0) {
                    setSelectedRoomId(response.data[0].id); // Pilih kamar pertama sebagai default
                }
            } catch (error) {
                toast.error(error.response?.data?.message||'Gagal mengambil daftar kamar.');
            }
        };
        fetchRooms();
    }, []);

    // 2. Ambil data ketersediaan saat kamar atau bulan berubah
    const fetchAvailability = useCallback(async () => {
        if (!selectedRoomId) return;
        setLoading(true);
        setChanges({}); // Reset perubahan saat data baru dimuat
        const token = localStorage.getItem('token');
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        try {
            const response = await axios.get(`http://localhost:5001/api/admin/availability/${selectedRoomId}`, {
                params: { year, month },
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailabilityData(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal mengambil data ketersediaan.');
        } finally {
            setLoading(false);
        }
    }, [selectedRoomId, currentDate]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // 3. Handler untuk menyimpan perubahan
    const handleSaveChanges = async () => {
        const updates = Object.values(changes);
        if (updates.length === 0) {
            toast.success('Tidak ada perubahan untuk disimpan.');
            return;
        }
        setSaving(true);
        const toastId = toast.loading('Menyimpan perubahan...');
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5001/api/admin/availability', { updates }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Ketersediaan berhasil diperbarui!', { id: toastId });
            setChanges({}); // Reset perubahan setelah berhasil
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal menyimpan perubahan.', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    // 4. Handler untuk mengubah data di state lokal
    const handleDataChange = (id, field, value) => {
        // Update data di tampilan
        setAvailabilityData(prevData =>
            prevData.map(day => (day.id === id ? { ...day, [field]: value } : day))
        );
        // Lacak perubahan untuk dikirim ke backend
        setChanges(prevChanges => ({
            ...prevChanges,
            [id]: {
                ...availabilityData.find(d => d.id === id), // Ambil data asli
                ...prevChanges[id], // Ambil perubahan sebelumnya
                id,
                [field]: value,
            }
        }));
    };

    const changeMonth = (offset) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Manajemen Inventaris Harian</h1>

            {/* Kontrol */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Tipe Kamar</label>
                    <select value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)} className="input-style dark:bg-slate-900 dark:text-white text-slate-900">
                        {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-1 -mb-5">
                    <button onClick={() => changeMonth(-1)} className="btn-secondary p-2 dark:bg-slate-900 dark:text-white"><ChevronLeft size={20} /></button>
                    <span className="font-bold text-lg w-48 text-center dark:text-white">
                        {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="btn-secondary p-2 dark:bg-slate-900 dark:text-white"><ChevronRight size={20} /></button>
                </div>
                <button onClick={handleSaveChanges} disabled={saving || Object.keys(changes).length === 0} className="btn-primary -mb-5">
                    <Save size={18} className="mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* Tabel Inventaris */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="th-style dark:text-white text-slate-900 ">Tanggal</th>
                                <th className="th-style dark:text-white text-slate-900">Sisa Kamar</th>
                                <th className="th-style dark:text-white text-slate-900">Status Penjualan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="3" className="text-center p-4">Memuat data...</td></tr>
                            ) : (
                                availabilityData.map(day => (
                                    <tr key={day.id}>
                                        <td className="td-style font-semibold dark:text-white">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</td>
                                        <td className="td-style">
                                            <input
                                                type="number"
                                                value={day.available_quantity}
                                                onChange={e => handleDataChange(day.id, 'available_quantity', parseInt(e.target.value, 10))}
                                                className="input-style w-24 text-center dark:bg-slate-900 dark:text-white text-slate-900"
                                            />
                                        </td>
                                        <td className="td-style">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={day.is_active}
                                                    onChange={e => handleDataChange(day.id, 'is_active', e.target.checked)}
                                                    className="sr-only peer dark:text-white"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{day.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageAvailabilityPage;
