'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ElementType;
}

interface CustomDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  className = '',
  disabled = false
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          {label}
        </label>
      )}

      {/* Button trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-100 border border-slate-200 text-slate-400'
            : isOpen
            ? 'bg-white border-[#0077B6] ring-2 ring-blue-500/20 shadow-xs text-slate-900'
            : 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-4 h-4 text-[#0077B6] shrink-0" />
          )}
          <span className="truncate text-sm font-medium">
            {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#0077B6] font-semibold">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#0077B6]' : ''
          }`}
        />
      </button>

      {/* DROPDOWN PANEL - STRICT RULE: ALWAYS OPENS DOWNWARD (top-full mt-2) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-white overflow-hidden shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full min-h-[40px] px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 text-[#0077B6] font-semibold border border-sky-100'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0077B6]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0077B6]' : 'text-slate-400'}`} />}
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {option.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-[#0077B6]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
