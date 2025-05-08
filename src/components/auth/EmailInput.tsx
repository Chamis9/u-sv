
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/features/language";

interface EmailInputProps {
  form: any;
  label: string;
}

export function EmailInput({ form, label }: EmailInputProps) {
  const { currentLanguage } = useLanguage();
  
  const getPlaceholder = () => {
    switch (currentLanguage.code) {
      case 'lv':
        return "E-pasts";
      case 'ru':
        return "Электронная почта";
      default:
        return "Email";
    }
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
              placeholder={getPlaceholder()}
              {...field}
              className="focus:ring-2 focus:ring-offset-1 focus:ring-orange-400/50"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
