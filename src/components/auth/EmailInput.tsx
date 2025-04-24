import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmailDropdown } from "../subscribe/EmailDropdown";
import { usePreviousEmails } from "@/hooks/usePreviousEmails";

interface EmailInputProps {
  form: any;
  label: string;
}

export function EmailInput({ form, label }: EmailInputProps) {
  const { previousEmails, showDropdown, setShowDropdown } = usePreviousEmails();
  const [inputFocused, setInputFocused] = useState(false);
  
  const handleEmailSelect = (email: string) => {
    setTimeout(() => {
      form.setValue("email", email);
      setShowDropdown(false);
      
      const inputElement = document.getElementById('email-input');
      if (inputElement) {
        inputElement.focus();
      }
      
      event?.stopPropagation();
    }, 0);
  };
  
  const stopPropagation = (e: React.MouseEvent | React.FocusEvent) => {
    e.stopPropagation();
  };

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="relative" onClick={stopPropagation} onFocus={stopPropagation}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              id="email-input"
              type="email"
              autoComplete="email"
              {...field}
              onFocus={(e) => {
                setInputFocused(true);
                setShowDropdown(true);
                stopPropagation(e);
              }}
              onBlur={(e) => {
                setTimeout(() => {
                  setInputFocused(false);
                  if (!e.relatedTarget || !e.relatedTarget.closest('.dropdown-option')) {
                    setShowDropdown(false);
                  }
                }, 200);
                stopPropagation(e);
              }}
              onClick={(e) => {
                setShowDropdown(true);
                stopPropagation(e);
              }}
              className="focus:ring-2 focus:ring-offset-1 focus:ring-orange-400/50"
            />
          </FormControl>
          <EmailDropdown 
            showDropdown={(inputFocused || showDropdown) && previousEmails.length > 0}
            previousEmails={previousEmails}
            onEmailSelect={handleEmailSelect}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
