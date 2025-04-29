
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function TermsCheckbox({ form, translations }: { form: any; translations: any }) {
  return (
    <FormField
      control={form.control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal">
              {translations.terms}
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
