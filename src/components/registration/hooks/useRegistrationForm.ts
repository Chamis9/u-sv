
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  newsletter?: boolean;
}

export const useRegistrationForm = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { register } = useAuth();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const form = useForm<RegistrationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+371",
      phoneNumber: "",
      newsletter: false
    },
    mode: "onSubmit"
  });

  const passwordValidation = {
    required: t('Lauks ir obligāts', 'This field is required'),
    minLength: {
      value: 8,
      message: t('Vismaz 8 simboli', 'Minimum 8 characters')
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: t(
        'Parolei jāsatur vismaz 1 lielais burts, 1 mazais burts, 1 cipars un 1 īpašais simbols',
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
      )
    }
  };

  const validatePassword = (value: string) => {
    const password = form.watch('password');
    if (!value || !password || value !== password) {
      return t('Paroles nesakrīt', 'Passwords do not match');
    }
    return true;
  };

  const checkEmailExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .rpc('check_email_exists', { check_email: email });
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if email exists:", error);
      return false;
    }
  };
  
  const checkPhoneExists = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .rpc('check_phone_exists', { check_phone: phone });
        
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if phone exists:", error);
      return false;
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const phoneNumber = data.phoneNumber ? `${data.countryCode}${data.phoneNumber}` : "";
      
      // Check if email exists
      const emailExists = await checkEmailExists(data.email);
      if (emailExists) {
        toast({
          title: t('Kļūda', 'Error'),
          description: t('E-pasta adrese jau ir reģistrēta', 'Email is already registered'),
          variant: "destructive"
        });
        return;
      }

      // Check if phone exists (if provided)
      if (phoneNumber) {
        const phoneExists = await checkPhoneExists(phoneNumber);
        if (phoneExists) {
          toast({
            title: t('Kļūda', 'Error'),
            description: t('Telefona numurs jau ir reģistrēts', 'Phone number is already registered'),
            variant: "destructive"
          });
          return;
        }
      }

      // Proceed with registration
      const success = await register(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: phoneNumber || null,
        countryCode: data.countryCode
      });

      if (success) {
        // Redirect to login page after successful registration
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('Kļūda', 'Error'),
        description: error instanceof Error ? error.message : t(
          'Radās kļūda reģistrācijas laikā. Lūdzu mēģiniet vēlreiz.',
          'An error occurred during registration. Please try again.'
        ),
        variant: "destructive"
      });
    }
  };

  return {
    form,
    passwordValidation,
    validatePassword,
    onSubmit,
    t
  };
};
