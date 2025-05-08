
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface NameFieldsProps {
  form: any;
  translations: any;
}

export function NameFields({ form, translations }: NameFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translations.firstName}</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoComplete="given-name"
                className="focus:ring-2 focus:ring-offset-1 focus:ring-orange-400/50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translations.lastName}</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoComplete="family-name"
                className="focus:ring-2 focus:ring-offset-1 focus:ring-orange-400/50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
