
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
    form.setValue("email", email);
    setShowDropdown(false);
  };

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              {...field}
              onFocus={() => {
                setInputFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setInputFocused(false);
                  setShowDropdown(false);
                }, 200);
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
