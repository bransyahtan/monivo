"use client";

import { useState } from "react";

interface CurrencyInputProps {
  name: string;
  defaultValue?: number | string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
}

export const CurrencyInput = ({
  name,
  defaultValue = "",
  required,
  placeholder = "0",
  className,
}: CurrencyInputProps) => {
  const formatValue = (val: string | number) => {
    const num = String(val).replace(/\D/g, "");
    if (!num) return "";
    return new Intl.NumberFormat("id-ID").format(Number(num));
  };

  const [displayValue, setDisplayValue] = useState(formatValue(defaultValue));
  const [rawValue, setRawValue] = useState(
    String(defaultValue).replace(/\D|null|undefined/g, ""),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setRawValue(val);
    setDisplayValue(formatValue(val));
  };

  return (
    <>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className={className}
        inputMode="numeric"
      />
      <input type="hidden" name={name} value={rawValue} />
    </>
  );
};
