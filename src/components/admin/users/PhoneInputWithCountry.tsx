
import React from "react";
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
import { countryCodes, getCountryFlag } from "@/utils/phoneUtils";
import { useLanguage } from "@/features/language";

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

  // Find selected country info for placeholder
  const selectedCountry = countryCodes.find(c => c.code === countryCode);
  
  return (
    <div className="space-y-2">
      <Label>{label}{required && " *"}</Label>
      
      <div className="flex space-x-2">
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-28">
            <SelectValue 
              placeholder={`${getCountryFlag(countryCodes[0].country)} ${countryCodes[0].code}`} 
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countryCodes.map((country) => (
                <SelectItem 
                  key={country.code} 
                  value={country.code}
                  className="flex items-center space-x-2"
                >
                  <span>{getCountryFlag(country.country)} {country.code}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Input
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder={placeholder || selectedCountry?.format || ""}
          className={error ? "border-red-500" : ""}
        />
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
