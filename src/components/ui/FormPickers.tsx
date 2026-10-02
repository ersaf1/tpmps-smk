'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type Option = { value: string; label: string };

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);
  return ref;
}

const triggerClass = 'flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50/40 focus-visible:border-[#0077B6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100';
const panelClass = 'absolute left-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-2xl border border-sky-100 bg-white p-1.5 shadow-[0_18px_45px_-12px_rgba(15,23,42,0.24)]';

export function FormSelect({ name, value, defaultValue, onChange, options, placeholder = 'Pilih opsi', className = '' }: {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const [open, setOpen] = useState(false);
  const selectedValue = value ?? internalValue;
  const selected = options.find((option) => option.value === selectedValue);
  const ref = useDismiss(open, () => setOpen(false));

  function choose(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative min-w-0 ${className}`}>
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className={triggerClass}>
        <span className={`truncate ${selected ? '' : 'text-slate-400'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-[#0077B6] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div role="listbox" aria-label={placeholder} className={`${panelClass} max-h-64 overflow-y-auto`}>
        {options.map((option) => <button key={option.value} type="button" role="option" aria-selected={selectedValue === option.value} onClick={() => choose(option.value)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-sky-50 focus-visible:bg-sky-50 focus-visible:outline-none ${selectedValue === option.value ? 'bg-sky-50 font-semibold text-[#0077B6]' : 'text-slate-700'}`}><span className="truncate">{option.label}</span>{selectedValue === option.value && <Check aria-hidden="true" className="h-4 w-4 shrink-0" />}</button>)}
      </div>}
    </div>
  );
}

const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const pad = (value: number) => String(value).padStart(2, '0');
const isoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function DatePicker({ name, placeholder }: { name: string; placeholder: string }) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const ref = useDismiss(open, () => setOpen(false));
  const firstWeekday = (view.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const today = isoDate(new Date());
  const display = value ? new Date(`${value}T12:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : placeholder;

  function changeMonth(amount: number) {
    setView(new Date(view.getFullYear(), view.getMonth() + amount, 1));
  }

  return (
    <div ref={ref} className="relative min-w-0">
      <input type="hidden" name={name} value={value} />
      <button type="button" aria-label={placeholder} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((current) => !current)} className={triggerClass}>
        <span className={`truncate ${value ? '' : 'text-slate-400'}`}>{display}</span>
        <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-[#0077B6]" />
      </button>
      {open && <div role="dialog" aria-label={`Kalender ${placeholder.toLowerCase()}`} className={`${panelClass} w-[286px] p-3`}>
        <div className="mb-3 flex items-center justify-between gap-2 px-1">
          <button type="button" aria-label="Bulan sebelumnya" onClick={() => changeMonth(-1)} className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-[#0077B6]"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm font-bold capitalize text-slate-800">{view.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
          <button type="button" aria-label="Bulan berikutnya" onClick={() => changeMonth(1)} className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-[#0077B6]"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">{weekdays.map((day) => <span key={day} className="py-1 text-[11px] font-bold text-slate-400">{day}</span>)}{Array.from({ length: firstWeekday }, (_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => {
          const date = isoDate(new Date(view.getFullYear(), view.getMonth(), index + 1));
          return <button key={date} type="button" aria-label={new Date(`${date}T12:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} aria-pressed={value === date} onClick={() => { setValue(date); setOpen(false); }} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#0077B6] ${value === date ? 'bg-[#0077B6] text-white shadow-sm' : date === today ? 'bg-sky-50 text-[#0077B6] ring-1 ring-sky-200' : 'text-slate-700 hover:bg-sky-50 hover:text-[#0077B6]'}`}>{index + 1}</button>;
        })}</div>
        <div className="mt-3 border-t border-slate-100 pt-2"><button type="button" onClick={() => { setValue(today); setView(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); setOpen(false); }} className="w-full rounded-lg py-2 text-xs font-bold text-[#0077B6] hover:bg-sky-50">Pilih hari ini</button></div>
      </div>}
    </div>
  );
}
