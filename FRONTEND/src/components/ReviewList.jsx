import React from 'react';
import StarRating from './StarRating';

const ReviewList = ({ reviews = [] }) => {
  return (
    <div className="mt-3">
      <h3 className="text-2xl font-bold mb-6">Ulasan Pengguna</h3>
      {reviews.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg text-slate-900 dark:bg-slate-900">
          <p className="dark:text-gray-100 text-slate-900 ">Belum ada ulasan untuk kamar ini. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-2">
                <p className="font-semibold mr-4 capitalize">{review.username}</p>
                <StarRating value={review.rating} />
              </div>
              <p className="text-gray-700 my-2 dark:text-white">"{review.comment}"</p>
              <p className="text-sm text-slate-900 dark:text-gray-300">
                {new Date(review.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
