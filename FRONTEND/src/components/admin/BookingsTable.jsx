import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Trash2, Printer } from 'lucide-react';

function BookingsTable({ data, onDelete }) {
  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'guest_name', header: 'Nama Tamu' },
    { accessorKey: 'user_username', header: 'Username Pemesan' },
    { accessorKey: 'room_name', header: 'Kamar' },
    { 
      accessorKey: 'booking_date', 
      header: 'Tanggal Booking',
      cell: ({ row }) => new Date(row.original.booking_date).toLocaleDateString('id-ID')
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.original.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link to={`/admin/print-booking/${row.original.id}`} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
            <Printer size={18} />
          </Link>
          <button onClick={() => onDelete(row.original)} className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ], [onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-700">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsTable;