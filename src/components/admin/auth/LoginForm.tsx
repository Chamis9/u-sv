
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { checkAdminCredentials } from "@/utils/authHelpers";
import { useLanguage } from "@/features/language";
import { logActivity } from "@/utils/activityLogger";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

export type FormData = z.infer<typeof formSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { currentLanguage } = useLanguage();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isLoading) return; // Prevent multiple simultaneous attempts
    
    setIsLoading(true);
    
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Login request timed out")), 10000);
      });
      
      const loginPromise = checkAdminCredentials(data.email, data.password);
      
      // Race the login against the timeout
      const isAdmin = await Promise.race([loginPromise, timeoutPromise]) as boolean;

      if (!isAdmin) {
        throw new Error("Not authorized as admin");
      }

      // Log successful login
      logActivity({
        activityType: 'login',
        description: `User logged in successfully`,
        email: data.email
      });

      toast({
        description: currentLanguage.code === 'lv' 
          ? "Veiksmīgi pieslēdzies administratora panelim." 
          : "Successfully logged into the admin panel.",
      });
      
      // Set auth state in localStorage (we'll reload after this anyway)
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', data.email);
      
      // Call success handler first to ensure UI updates properly
      onLoginSuccess();
      
      // Short delay before reload to ensure local states are updated
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error: any) {
      console.error("Login error:", error);
      setIsLoading(false); // Important: reset loading state on error
      
      toast({
        variant: "destructive",
        description: currentLanguage.code === 'lv' 
          ? "Neizdevās pieslēgties. Pārbaudiet savus pieslēgšanās datus." 
          : "Failed to log in. Please check your credentials.",
      });
    }
  };

  // Translation helper function
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('E-pasta adrese', 'Email Address')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="admin@netieku.es" 
                    className="pl-10" 
                    {...field} 
                    disabled={isLoading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Parole', 'Password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10" 
                    {...field}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? t('Slēpt paroli', 'Hide password') : t('Rādīt paroli', 'Show password')}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 text-sm text-muted-foreground">
          {t('Administratoru konti: admin@netieku.es, ieva@netieku.es, gunta@netieku.es', 
             'Admin accounts: admin@netieku.es, ieva@netieku.es, gunta@netieku.es')}
        </div>
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading 
              ? t('Pieslēdzas...', 'Logging in...') 
              : t('Pieslēgties', 'Login')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
