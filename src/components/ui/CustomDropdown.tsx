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
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
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
            ? 'opacity-50 cursor-not-allowed bg-[#0B132B]/50 border border-white/5 text-[#94A3B8]'
            : isOpen
            ? 'bg-[#0B132B] border border-[#22D3EE]/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] text-[#F8FAFC]'
            : 'bg-[#0E1726]/80 hover:bg-[#131F37] border border-white/10 hover:border-cyan-500/30 text-[#F8FAFC]'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-4 h-4 text-[#22D3EE] shrink-0" />
          )}
          <span className="truncate text-sm font-medium">
            {selectedOption ? selectedOption.label : <span className="text-[#94A3B8]">{placeholder}</span>}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0077B6]/30 border border-[#22D3EE]/30 text-[#22D3EE] font-semibold">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#22D3EE]' : ''
          }`}
        />
      </button>

      {/* DROPDOWN PANEL - STRICT RULE: ALWAYS OPENS DOWNWARD (top-full mt-2) */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl glass-dropdown overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-[#22D3EE]/25">
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
                      ? 'bg-gradient-to-r from-[#0077B6]/40 to-[#22D3EE]/20 text-[#22D3EE] font-semibold border border-[#22D3EE]/30'
                      : 'text-[#F8FAFC] hover:bg-white/5 hover:text-[#22D3EE]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`} />}
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {option.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-[#22D3EE]" />}
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
