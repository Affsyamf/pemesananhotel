import React from 'react';

// Komponen ini menerima 'value' (misal: 4.5) dan 'color' (misal: '#f59e0b')
const StarRating = ({ value = 0, color = '#f59e0b' }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span key={starValue} style={{ color }}>
            {/* Logika untuk menampilkan bintang penuh, setengah, atau kosong */}
            {value >= starValue ? (
              <i className="fas fa-star"></i> // Bintang Penuh
            ) : value >= starValue - 0.5 ? (
              <i className="fas fa-star-half-alt"></i> // Bintang Setengah
            ) : (
              <i className="far fa-star"></i> // Bintang Kosong
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
