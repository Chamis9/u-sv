
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneFieldProps {
  form: any;
  translations: any;
}

export function PhoneField({ form, translations }: PhoneFieldProps) {
  return (
    <div className="space-y-2">
      <FormLabel>{translations.phoneNumber} <span className="text-muted-foreground text-sm">{translations.optional}</span></FormLabel>
      <div className="flex space-x-2">
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="+371" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+371">+371</SelectItem>
                    <SelectItem value="+370">+370</SelectItem>
                    <SelectItem value="+372">+372</SelectItem>
                    <SelectItem value="+7">+7</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  autoComplete="tel"
                  placeholder="XXXXXXXX"
                  className="focus:ring-2 focus:ring-offset-1 focus:ring-orange-400/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
