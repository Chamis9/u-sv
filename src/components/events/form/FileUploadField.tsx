
import React from "react";
import { Upload } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useLanguage } from "@/features/language";

interface FileUploadFieldProps {
  form: any;
  name: string;
  label: string;
  description: string;
  fileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

export const FileUploadField = ({
  form,
  name,
  label,
  description,
  fileName,
  onFileChange,
  accept = "*",
}: FileUploadFieldProps) => {
  const { currentLanguage } = useLanguage();
  
  // Translate helper
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const inputId = `${name}-file`;
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <label htmlFor={inputId} className="cursor-pointer">
                <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center space-x-2 hover:bg-secondary/80">
                  <Upload className="h-4 w-4" />
                  <span>{t("Augšupielādēt failu", "Upload file")}</span>
                </div>
                <input
                  type="file"
                  id={inputId}
                  className="hidden"
                  accept={accept}
                  onChange={onFileChange}
                />
              </label>
              {fileName && (
                <span className="text-sm text-muted-foreground">
                  {fileName}
                </span>
              )}
            </div>
          </FormControl>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
