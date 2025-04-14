
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { countryCodes, findCountryByCode, validatePhoneNumber } from "@/utils/phoneUtils";
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
  
  const [isValid, setIsValid] = useState(true);
  const [localError, setLocalError] = useState("");
  
  // Format info for selected country
  const selectedCountry = findCountryByCode(countryCode);
  const format = selectedCountry?.format || "";
  
  // Validate when phone number or country code changes
  useEffect(() => {
    if (!phoneNumber) {
      setIsValid(true);
      setLocalError("");
      return;
    }
    
    const valid = validatePhoneNumber(phoneNumber, countryCode);
    setIsValid(valid);
    
    if (!valid) {
      const country = findCountryByCode(countryCode);
      const expectedLength = country?.digits.join(" vai ") || "";
      setLocalError(t(
        `Telefona numuram jāsatur ${expectedLength} cipari`,
        `Phone number must contain ${expectedLength} digits`
      ));
    } else {
      setLocalError("");
    }
  }, [phoneNumber, countryCode, t]);
  
  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and spaces
    const value = e.target.value.replace(/[^\d\s]/g, '');
    onPhoneNumberChange(value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">{label}{required && " *"}</Label>
      
      <div className="flex space-x-2">
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="+371" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code} {country.country}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Input
          id="phone"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder || format}
          className={!isValid ? "border-red-500" : ""}
        />
      </div>
      
      {(error || localError) && (
        <p className="text-red-500 text-sm">{error || localError}</p>
      )}
    </div>
  );
}
