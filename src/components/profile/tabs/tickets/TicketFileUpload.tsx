
import React, { useState } from "react";
import { useLanguage } from "@/features/language";
import { FormLabel } from "@/components/ui/form";
import { UploadCloud } from "lucide-react";

interface TicketFileUploadProps {
  onChange: (file: File | null) => void;
}

export function TicketFileUpload({ onChange }: TicketFileUploadProps) {
  const { currentLanguage } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is valid (PDF, JPG, PNG)
      const fileType = selectedFile.type;
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(fileType)) {
        setFileError(t(
          "Neatbalstīts faila formāts. Lūdzu, izvēlieties PDF, JPG vai PNG failu",
          "Unsupported file format. Please select a PDF, JPG or PNG file"
        ));
        setFile(null);
        onChange(null);
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError(t(
          "Faila izmērs nedrīkst pārsniegt 10MB",
          "File size cannot exceed 10MB"
        ));
        setFile(null);
        onChange(null);
        return;
      }
      
      setFile(selectedFile);
      onChange(selectedFile);
      setFileError(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border border-input rounded-md p-2">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <UploadCloud className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {file ? file.name : t("Izvēlieties failu vai velciet to šeit", "Click to browse or drag and drop")}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {t("PDF, JPG, PNG (max. 10MB)", "PDF, JPG, PNG (max. 10MB)")}
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {fileError && <p className="text-sm text-destructive">{fileError}</p>}
    </div>
  );
}
