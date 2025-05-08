
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/features/language";

interface PasswordInputProps {
  form: any;
  label: string;
}

export function PasswordInput({ form, label }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { currentLanguage } = useLanguage();
  
  const getPlaceholder = () => {
    switch (currentLanguage.code) {
      case 'lv':
        return "••••••••";
      case 'ru':
        return "••••••••";
      default:
        return "••••••••";
    }
  };

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={getPlaceholder()}
                {...field}
                className="pr-10 focus:ring-2 focus:ring-offset-1 focus:ring-orange-400/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
