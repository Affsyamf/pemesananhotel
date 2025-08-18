import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) {
        return null; // Jangan tampilkan apa-apa jika hanya ada satu halaman
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between mt-6">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
                <ChevronLeft size={16} className="mr-2 dark:text-white" />
                Sebelumnya
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-400 dark:text-white">
                Halaman <span className="font-semibold dark:text-white">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
            </span>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
                Berikutnya
                <ChevronRight size={16} className="ml-2" />
            </button>
        </div>
    );
}

export default Pagination;
