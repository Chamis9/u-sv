
import React from "react";
import { Button } from "@/components/ui/button";
import { useSubscribeForm } from "@/hooks/useSubscribeForm";
import { EmailInput } from "@/components/subscribe/EmailInput";
import { EmailDropdown } from "@/components/subscribe/EmailDropdown";

export function SubscribeForm() {
  const {
    email,
    isLoading,
    previousEmails,
    showDropdown,
    formError,
    texts,
    handleSubmit,
    handleEmailChange,
    handleEmailSelect,
    setShowDropdown
  } = useSubscribeForm();

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md bg-transparent p-0"
    >
      <div className="relative flex-grow">
        <EmailInput
          value={email}
          placeholder={texts.placeholder}
          error={formError}
          onChange={handleEmailChange}
          onFocus={() => previousEmails.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        
        <EmailDropdown
          show={showDropdown && previousEmails.length > 0}
          emails={previousEmails}
          currentEmail={email}
          onSelect={handleEmailSelect}
          label={texts.previousEmails}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg px-6 font-semibold font-playfair" 
        aria-busy={isLoading}
      >
        {isLoading ? texts.sending : texts.button}
      </Button>
    </form>
  );
}
