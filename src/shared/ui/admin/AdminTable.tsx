import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';

interface AdminTableProps<T> {
  headers: string[];
  items: T[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  renderRow: (item: T) => ReactNode;
  emptyMessage?: string;
}

export function AdminTable<T>({
  headers,
  items,
  currentPage,
  itemsPerPage,
  onPageChange,
  renderRow,
  emptyMessage = "No items found."
}: AdminTableProps<T>) {
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="glass-card-inset text-xs font-mono uppercase text-neu-text-muted">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className={`px-6 py-4 font-bold ${h.toLowerCase() === 'actions' ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {items.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-neu-text-muted font-mono">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  {renderRow(item)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 pb-4">
          <span className="text-xs text-neu-text-muted font-mono">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="p-2 rounded-xl glass-card text-neu-text hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm font-bold font-mono px-2">
              {currentPage} / {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="p-2 rounded-xl glass-card text-neu-text hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminTableActions({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) {
  return (
    <td className="px-6 py-4 flex justify-end gap-2">
      <button onClick={onEdit} className="p-2 rounded-xl glass-card text-neu-accent hover:scale-105 active:scale-95 transition-all" title="Edit">
        <Edit size={16} />
      </button>
      <button onClick={onDelete} className="p-2 rounded-xl glass-card text-red-500 hover:scale-105 active:scale-95 transition-all" title="Delete">
        <Trash2 size={16} />
      </button>
    </td>
  );
}
