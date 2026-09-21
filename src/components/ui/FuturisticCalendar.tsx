'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface FuturisticCalendarProps {
  label?: string;
  isRange?: boolean;
  value?: string; // Format 'YYYY-MM-DD'
  startDate?: string;
  endDate?: string;
  onChange?: (date: string) => void;
  onRangeChange?: (start: string, end: string) => void;
  className?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function FuturisticCalendar({
  label,
  isRange = false,
  value,
  startDate,
  endDate,
  onChange,
  onRangeChange,
  className = ''
}: FuturisticCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialDate = value ? new Date(value) : (startDate ? new Date(startDate) : new Date());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const [tempStart, setTempStart] = useState<string | undefined>(startDate);
  const [tempEnd, setTempEnd] = useState<string | undefined>(endDate);

  // Helper date calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleSelectDay = (day: number) => {
    const selected = formatDateStr(currentYear, currentMonth, day);

    if (!isRange) {
      if (onChange) onChange(selected);
      setIsOpen(false);
    } else {
      if (!tempStart || (tempStart && tempEnd)) {
        setTempStart(selected);
        setTempEnd(undefined);
      } else if (tempStart && !tempEnd) {
        if (new Date(selected) < new Date(tempStart)) {
          setTempStart(selected);
        } else {
          setTempEnd(selected);
          if (onRangeChange) onRangeChange(tempStart, selected);
          setIsOpen(false);
        }
      }
    }
  };

  const isSelected = (day: number) => {
    const str = formatDateStr(currentYear, currentMonth, day);
    if (!isRange) return value === str;
    return str === tempStart || str === tempEnd;
  };

  const isInRange = (day: number) => {
    if (!isRange || !tempStart || !tempEnd) return false;
    const str = formatDateStr(currentYear, currentMonth, day);
    return str > tempStart && str < tempEnd;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-[#0077B6] shrink-0" />
          <span className="text-sm font-medium">
            {!isRange ? (
              value ? value : <span className="text-slate-400">Pilih tanggal...</span>
            ) : tempStart && tempEnd ? (
              `${tempStart} s/d ${tempEnd}`
            ) : tempStart ? (
              `${tempStart} s/d ...`
            ) : (
              <span className="text-slate-400">Pilih rentang tanggal...</span>
            )}
          </span>
        </div>

        {((!isRange && value) || (isRange && tempStart)) && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (onChange) onChange('');
              setTempStart(undefined);
              setTempEnd(undefined);
              if (onRangeChange) onRangeChange('', '');
            }}
            className="p-1 hover:text-rose-600 text-slate-400 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* Calendar Dropdown Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:right-auto sm:w-80 top-full mt-2 z-50 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
          {/* Header Month / Year */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0077B6] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-sm font-bold text-slate-900 tracking-wide">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0077B6] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days Name Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((d, i) => (
              <span key={i} className="text-[11px] font-semibold text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const inRange = isInRange(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${
                    selected
                      ? 'bg-gradient-to-r from-[#0077B6] to-[#0284C7] text-white shadow-md shadow-sky-500/20 z-10'
                      : inRange
                      ? 'bg-sky-100 text-[#0077B6] rounded-none'
                      : today
                      ? 'border border-[#0077B6] text-[#0077B6] bg-sky-50'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#0077B6]'
                  }`}
                >
                  {day}
                  {today && !selected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0077B6]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer close / quick select */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const todayStr = formatDateStr(now.getFullYear(), now.getMonth(), now.getDate());
                if (!isRange && onChange) {
                  onChange(todayStr);
                  setIsOpen(false);
                }
              }}
              className="text-[#0077B6] hover:underline cursor-pointer font-medium"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
