import React from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange
}) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dateToFormat = new Date(date);
    dateToFormat.setHours(0,0,0,0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateToFormat.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateToFormat.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // Use the input value which is YYYY-MM-DD
      // Create a date in local time to avoid timezone offset issues
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = value ? new Date(value) : new Date();
      newDate.setFullYear(year, month - 1, day);
      onChange(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [hours, minutes] = e.target.value.split(':').map(Number);
      const newDate = value ? new Date(value) : new Date();
      newDate.setHours(hours, minutes, 0, 0);
      onChange(new Date(newDate));
    }
  };

  const clearDate = () => {
    onChange(undefined);
  };

  // Format date as YYYY-MM-DD for input in local time
  const dateValue = value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : '';
  const timeValue = value ? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}` : '';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        <Calendar className="w-4 h-4 text-gray-400" />
        <input
          type="date"
          value={dateValue}
          onChange={handleDateChange}
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100"
        />
        {value && (
          <button
            type="button"
            onClick={clearDate}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
        <Clock className="w-4 h-4 text-gray-400" />
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100"
        />
      </div>
      {value && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Selected: {formatDate(value)} at {timeValue}
        </div>
      )}
    </div>
  );
};
