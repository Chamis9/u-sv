
import React from "react";
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  value: string;
  placeholder: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  required?: boolean;
}

export function EmailInput({ 
  value, 
  placeholder, 
  error, 
  onChange, 
  onFocus, 
  onBlur, 
  required = true 
}: EmailInputProps) {
  return (
    <div className="relative flex-grow">
      <Input
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className="flex-grow h-12 text-base font-playfair placeholder-orange-500/70 bg-white border-orange-300/50" 
      />
      
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}
