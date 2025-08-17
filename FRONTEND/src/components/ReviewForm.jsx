import React, { useState } from 'react';

const ReviewForm = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
        alert('Silakan pilih rating dan isi komentar Anda.');
        return;
    }
    onSubmit({ rating, comment });
    // Reset form setelah submit
    setRating(0);
    setComment('');
  };

  return (
    <div className="mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-slate-900">
      <h3 className="text-2xl font-bold mb-4 dark:text-white">Tulis Ulasan Anda</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block  text-gray-700 font-semibold mb-2 dark:text-white">Rating Anda</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))} 
            className="w-full p-3 dark:text-white border dark:bg-slate-900 border-slate-800 dark:border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0" disabled className='dark:text-white'>Pilih Rating...</option>
            <option value="5">5 - Luar Biasa</option>
            <option value="4">4 - Baik</option>
            <option value="3">3 - Cukup</option>
            <option value="2">2 - Kurang</option>
            <option value="1">1 - Buruk</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2 dark:text-white">Komentar</label>
          <textarea
            rows="4"
            className="w-full p-3 dark:bg-slate-900 dark:text-white text-slate-900 dark:border-white border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bagikan pengalaman menginap Anda di kamar ini..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 dark:text-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 w-full"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
