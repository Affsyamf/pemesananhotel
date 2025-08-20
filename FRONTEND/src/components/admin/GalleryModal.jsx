import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, ImageOff, Loader } from 'lucide-react';

function GalleryModal({ isOpen, onClose, room }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (isOpen && room) {
            const fetchImages = async () => {
                setLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5001/api/admin/rooms/${room.id}/images`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setImages(response.data);
                } catch (error) {
                    toast.error(error.response?.data?.message||'Gagal memuat galeri.');
                } finally {
                    setLoading(false);
                }
            };
            fetchImages();
        }
    }, [isOpen, room]);

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageUrl.trim()) {
            toast.error('URL gambar tidak boleh kosong.');
            return;
        }
        setIsAdding(true);
        const toastId = toast.loading('Menambahkan gambar...');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5001/api/admin/rooms/${room.id}/images`, 
                { image_url: newImageUrl, alt_text: room.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const response = await axios.get(`http://localhost:5001/api/admin/rooms/${room.id}/images`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImages(response.data);
            setNewImageUrl('');
            toast.success('Gambar berhasil ditambahkan!', { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal menambahkan gambar.', { id: toastId });
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        // Menggunakan window.confirm untuk konfirmasi sederhana
        if (!window.confirm('Anda yakin ingin menghapus gambar ini?')) return;
        
        const toastId = toast.loading('Menghapus gambar...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/admin/images/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImages(prevImages => prevImages.filter(img => img.id !== imageId));
            toast.success('Gambar berhasil dihapus!', { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal menghapus gambar.', { id: toastId });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Galeri: {room?.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X size={24} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader className="animate-spin text-blue-500" size={40} />
                        </div>
                    ) : images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map(image => (
                                <div key={image.id} className="relative group aspect-w-1 aspect-h-1">
                                    <img src={image.image_url} alt={image.alt_text || room.name} className="w-full h-full object-cover rounded-md" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex justify-center items-center rounded-md">
                                        <button onClick={() => handleDeleteImage(image.id)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <ImageOff className="mx-auto text-gray-400" size={48} />
                            <p className="mt-4 text-gray-500 dark:text-gray-400">Galeri ini masih kosong.</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">Tambahkan gambar pertama Anda di bawah ini.</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleAddImage} className="p-5 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-800">
                    <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Masukkan URL gambar baru..."
                        className="input-style flex-grow dark:bg-slate-900 dark:text-white text-slate-900"
                        disabled={isAdding}
                    />
                    <button type="submit" className="btn-primary flex-shrink-0" disabled={isAdding}>
                        {isAdding ? <Loader size={18} className="animate-spin mr-2" /> : <Plus size={18} className="mr-2" />}
                        {isAdding ? 'Menambah...' : 'Tambah'}
                    </button>
                </form>
            </div>
            {/* Simple animation */}
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default GalleryModal;
