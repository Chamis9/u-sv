
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { countryCodes, validatePhoneNumber } from "@/utils/phoneUtils";
import { useLanguage } from "@/features/language";

// Component to display country code with abbreviation
const CountryCode = ({ countryCode, countryAbbr }: { countryCode: string; countryAbbr: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
        {countryAbbr.toUpperCase()}
      </span>
      <span>{countryCode}</span>
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

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [localError, setLocalError] = useState<string>("");
  
  // Find selected country info for placeholder
  const selectedCountry = countryCodes.find(c => c.code === countryCode);
  
  // Filter countries based on search
  const filteredCountries = countryCodes.filter(country => 
    country.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    country.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    country.country.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Validate phone number based on country requirements
  useEffect(() => {
    if (!phoneNumber.trim()) {
      setLocalError("");
      return;
    }
    
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

  // Handle manual code input
  const handleManualCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Ensure it starts with +
    if (!value.startsWith('+')) {
      value = '+' + value;
    }
    // Only allow + and numbers
    value = value.replace(/[^\d+]/g, '');
    
    // Check if it matches any existing code
    const matchingCountry = countryCodes.find(c => c.code === value);
    if (matchingCountry) {
      onCountryCodeChange(matchingCountry.code);
    } else {
      // Allow custom input but warn user
      onCountryCodeChange(value);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>{label}{required && " *"}</Label>
      
      <div className="flex space-x-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between"
              onClick={() => setOpen(!open)}
            >
              {selectedCountry ? (
                <CountryCode 
                  countryCode={selectedCountry.code} 
                  countryAbbr={selectedCountry.country} 
                />
              ) : (
                <span>{countryCode}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder={t("Meklēt valsti vai kodu...", "Search country or code...")}
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  {t("Nekas nav atrasts", "No results found")}
                  <Input
                    type="text"
                    placeholder={t("Ievadīt kodu manuāli", "Enter code manually")}
                    value={countryCode}
                    onChange={handleManualCodeInput}
                    className="mt-2"
                  />
                </CommandEmpty>
                <ScrollArea className="h-[300px]">
                  <CommandGroup>
                    {filteredCountries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.code}
                        onSelect={() => {
                          onCountryCodeChange(country.code);
                          setOpen(false);
                          setSearchValue("");
                        }}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mr-2">
                            {country.country.toUpperCase()}
                          </span>
                          <span>{country.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500">{country.code}</span>
                          {country.code === countryCode && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Input
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder || selectedCountry?.format || ""}
          className={cn(
            "flex-1",
            (error || localError) ? "border-red-500" : ""
          )}
        />
      </div>
      
      {(error || localError) && (
        <p className="text-red-500 text-sm">{error || localError}</p>
      )}
    </div>
  );
}
