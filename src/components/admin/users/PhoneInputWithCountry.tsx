import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countryCodes, validatePhoneNumber } from "@/utils/phoneUtils";
import { useLanguage } from "@/features/language";

// Helper to display country flag using ISO country code
const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  return (
    <div className="w-6 h-4 inline-flex items-center justify-center mr-2 overflow-hidden">
      <img 
        src={`/flags/${countryCode.toLowerCase()}.svg`}
        width="20"
        height="15"
        alt=""
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

interface PhoneInputWithCountryProps {
  label: string;
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function PhoneInputWithCountry({
  label,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
  required = false,
  placeholder
}: PhoneInputWithCountryProps) {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const [localError, setLocalError] = useState<string>("");
  
  // Find selected country info for placeholder
  const selectedCountry = countryCodes.find(c => c.code === countryCode);
  
  // Validate phone number based on country requirements
  useEffect(() => {
    if (!phoneNumber.trim()) {
      setLocalError("");
      return;
    }
    
    // Remove spaces for validation
    const digits = phoneNumber.replace(/\s/g, '');
    
    if (!validatePhoneNumber(digits, countryCode)) {
      const country = countryCodes.find(c => c.code === countryCode);
      const expectedLength = country?.digits.join(t(' vai ', ' or '));
      setLocalError(t(
        `Telefona numuram jāsatur ${expectedLength} cipari`,
        `Phone number must contain ${expectedLength} digits`
      ));
    } else {
      setLocalError("");
    }
  }, [phoneNumber, countryCode, t]);
  
  // Only allow numbers and spaces in phone field
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s]/g, '');
    onPhoneNumberChange(value);
  };
  
  return (
    <div className="space-y-2">
      <Label>{label}{required && " *"}</Label>
      
      <div className="flex space-x-2">
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-28">
            <SelectValue>
              <div className="flex items-center">
                {selectedCountry && (
                  <CountryFlag countryCode={selectedCountry.country.toLowerCase()} />
                )}
                <span>{countryCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countryCodes.map((country) => (
                <SelectItem 
                  key={country.code} 
                  value={country.code}
                  className="flex items-center"
                >
                  <div className="flex items-center">
                    <CountryFlag countryCode={country.country.toLowerCase()} />
                    <span>{country.code}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Input
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder || selectedCountry?.format || ""}
          className={(error || localError) ? "border-red-500" : ""}
        />
      </div>
      
      {(error || localError) && (
        <p className="text-red-500 text-sm">{error || localError}</p>
      )}
    </div>
  );
}
