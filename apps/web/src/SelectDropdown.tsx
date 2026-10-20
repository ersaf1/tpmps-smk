import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

export interface SelectDropdownProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  leadingIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
  required?: boolean;
  align?: "left" | "right";
  width?: string | number;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  id,
  name,
  label,
  value,
  options,
  onChange,
  placeholder = "Pilih opsi...",
  leadingIcon,
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  ariaLabel,
  required = false,
  align = "left",
  width,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Keyboard navigation & accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const nextIndex = (currentIndex + 1) % options.length;
        if (options[nextIndex]) {
          onChange(options[nextIndex].value);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        if (options[prevIndex]) {
          onChange(options[prevIndex].value);
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`sintesa-select-wrap ${className}`}
      style={{ width: width || "100%" }}
    >
      {/* Hidden native select keeps FormData & testing intact */}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-label={ariaLabel || label || placeholder}
        tabIndex={-1}
        className="sintesa-native-select-hidden"
      >
        {!options.some((o) => o.value === value) && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Modern Custom Dropdown Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        className={`sintesa-dropdown-btn ${isOpen ? "is-open" : ""} ${buttonClassName}`}
      >
        <span className="sintesa-dropdown-btn-content">
          {leadingIcon && (
            <span className="sintesa-dropdown-leading-icon">{leadingIcon}</span>
          )}
          {selectedOption?.icon && (
            <span className="sintesa-dropdown-item-icon">
              {selectedOption.icon}
            </span>
          )}
          <span className="sintesa-dropdown-label">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="sintesa-dropdown-badge">
              {selectedOption.badge}
            </span>
          )}
        </span>
        <ChevronDown
          size={15}
          className={`sintesa-dropdown-chevron ${isOpen ? "is-rotated" : ""}`}
        />
      </button>

      {/* Floating Custom Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`sintesa-dropdown-popover align-${align} ${menuClassName}`}
        >
          <div className="sintesa-dropdown-list">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`sintesa-dropdown-item ${isSelected ? "is-selected" : ""}`}
                >
                  <div className="sintesa-dropdown-item-left">
                    {opt.icon && (
                      <span className="sintesa-dropdown-item-icon">
                        {opt.icon}
                      </span>
                    )}
                    <div className="sintesa-dropdown-item-texts">
                      <span className="sintesa-dropdown-item-title">
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="sintesa-dropdown-item-desc">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sintesa-dropdown-item-right">
                    {opt.badge && (
                      <span className="sintesa-dropdown-badge">{opt.badge}</span>
                    )}
                    {isSelected && (
                      <Check size={14} className="sintesa-dropdown-check" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
