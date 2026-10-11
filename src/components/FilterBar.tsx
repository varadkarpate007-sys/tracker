import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Priority, Category, TaskFilter } from '../types/task';

interface FilterBarProps {
  filter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  categories: Category[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  categories,
}) => {
  const hasActiveFilters =
    filter.search.trim() !== '' ||
    filter.priority !== 'all' ||
    filter.category !== 'all';

  const resetFilters = () => {
    onChange({
      search: '',
      priority: 'all',
      category: 'all',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          placeholder="Search departmental tasks, titles, or notes..."
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
        />
        {filter.search && (
          <button
            onClick={() => onChange({ ...filter, search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium hidden sm:inline">Priority:</span>
          <select
            value={filter.priority}
            onChange={(e) =>
              onChange({ ...filter, priority: e.target.value as Priority | 'all' })
            }
            className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">Domain:</span>
          <select
            value={filter.category}
            onChange={(e) =>
              onChange({ ...filter, category: e.target.value as Category | 'all' })
            }
            className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer pr-1 max-w-[130px] sm:max-w-none truncate"
          >
            <option value="all">All Domains</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors ml-auto sm:ml-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
