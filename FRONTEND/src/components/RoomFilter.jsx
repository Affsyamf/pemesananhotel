// frontend/src/components/RoomFilter.jsx
import React from 'react';

function RoomFilter({ filters, setFilters, availableTypes, availableFacilities }) {
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      price: { ...prev.price, [name]: value === '' ? null : Number(value) }
    }));
  };

  const handleTypeChange = (e) => {
    setFilters(prev => ({ ...prev, type: e.target.value }));
  };

  const handleFacilityChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      const newFacilities = new Set(prev.facilities);
      if (checked) {
        newFacilities.add(value);
      } else {
        newFacilities.delete(value);
      }
      return { ...prev, facilities: Array.from(newFacilities) };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:text-slate-900 dark:bg-gray-800">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-300">Filter Kamar</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filter Harga */}
        <div>
          <label className="block text-sm font-medium text-gray-700  dark:text-gray-300 mb-0">Rentang Harga (Rp)</label>
          <div className="flex items-center space-x-2">
            <input 
              type="number"
              name="min"
              value={filters.price.min ?? ''}
              onChange={handlePriceChange}
              placeholder="Min"
              className="input-style w-full dark:text-gray-300 dark:bg-gray-700"
            />
            <span>-</span>
            <input 
              type="number"
              name="max"
              value={filters.price.max ?? ''}
              onChange={handlePriceChange}
              placeholder="Max"
              className="input-style w-full dark:text-gray-300 dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Filter Tipe Kamar */}
        <div>
          <label className="block text-sm font-medium  dark:text-gray-300 text-gray-700 mb-1">Tipe Kamar</label>
          <select value={filters.type} onChange={handleTypeChange} className="input-style w-full dark:text-gray-300 dark:bg-gray-700">
            <option value="Semua">Semua Tipe</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Filter Fasilitas */}
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-2">Fasilitas</label>
          <div className="grid grid-cols-2 gap-2">
            {availableFacilities.map(facility => (
              <label key={facility} className="flex items-center space-x-2 text-sm dark:text-gray-300 text-gray-600">
                <input
                  type="checkbox"
                  value={facility}
                  checked={filters.facilities.includes(facility)}
                  onChange={handleFacilityChange}
                  className="rounded dark:text-gray-300 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomFilter;