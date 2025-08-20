import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Fungsi untuk format tanggal ke YYYY-MM-DD
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

function PromoFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        code: '',
        discount_percentage: '',
        expiry_date: '',
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                discount_percentage: initialData.discount_percentage,
                expiry_date: formatDateForInput(initialData.expiry_date),
                is_active: initialData.is_active,
            });
        } else {
            // Reset form untuk promo baru
            setFormData({
                code: '',
                discount_percentage: '',
                expiry_date: '',
                is_active: true,
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold dark:text-white">{isEditing ? 'Edit Kode Promo' : 'Tambah Kode Promo Baru'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="label-style dark:text-white text-slate-900">Kode Promo</label>
                            <input
                                name="code"
                                type="text"
                                value={formData.code}
                                onChange={handleChange}
                                className="input-style uppercase dark:bg-slate-900 dark:text-white text-slate-900"
                                placeholder="CONTOH: LIBURAN10"
                                required
                                disabled={isEditing} // Kode tidak bisa diubah saat edit
                            />
                            {isEditing && <p className="text-xs text-gray-400 mt-1">Kode promo tidak dapat diubah.</p>}
                        </div>
                        <div>
                            <label className="label-style dark:text-white text-slate-900">Persentase Diskon (%)</label>
                            <input
                                name="discount_percentage"
                                type="number"
                                value={formData.discount_percentage}
                                onChange={handleChange}
                                className="input-style dark:bg-slate-900 dark:text-white text-slate-900"
                                placeholder="Contoh: 10"
                                required
                                min="1"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="label-style dark:text-white text-slate-900">Tanggal Kadaluarsa</label>
                            <input
                                name="expiry_date"
                                type="date"
                                value={formData.expiry_date}
                                onChange={handleChange}
                                className="input-style dark:bg-slate-900 dark:text-white text-slate-900"
                                required
                            />
                        </div>
                        {isEditing && (
                             <div>
                                <label className="label-style">Status</label>
                                <div className="flex items-center mt-2">
                                     <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                     <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                         Aktifkan promo ini
                                     </label>
                                </div>
                             </div>
                        )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                        <button type="submit" className="btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PromoFormModal;
