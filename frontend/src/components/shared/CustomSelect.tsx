import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export const CustomSelect = ({
  value,
  options,
  onChange,
  className = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const selectedLabel =
    options.find((o) => o.value === value)?.label || "Chọn...";

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", () => setIsOpen(false), true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => setIsOpen(false), true);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className={className}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-yellow-400/30 focus:border-yellow-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm text-left"
      >
        {/* Grid sizer: all labels overlap in same cell, width = longest label */}
        <span className="inline-grid">
          {options.map((o) => (
            <span
              key={o.value}
              className="col-start-1 row-start-1 invisible"
            >
              {o.label}
            </span>
          ))}
          <span className="col-start-1 row-start-1 truncate">
            {selectedLabel}
          </span>
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-yellow-400/70 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] rounded-xl bg-red-900/95 backdrop-blur-md border border-yellow-400/30 shadow-2xl overflow-hidden"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  option.value === value
                    ? "bg-yellow-400/20 text-yellow-200 font-semibold"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};
