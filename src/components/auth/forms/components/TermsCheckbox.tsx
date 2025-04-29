
import React from "react";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface TermsCheckboxProps {
  form: UseFormReturn<any>;
  label: string;
}

export function TermsCheckbox({ form, label }: TermsCheckboxProps) {
  return (
    <FormField
      control={form.control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm cursor-pointer">
              {label}
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
