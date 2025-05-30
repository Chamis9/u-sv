
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
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";

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
    setIsLoading(true);
    try {
      console.log("Attempting to login with:", data.email);
      
      // First, sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        console.error("No user found");
        throw new Error("No user found");
      }
      
      console.log("Auth successful, checking admin status");
      
      // Then check if the user is in the admin_user table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_user')
        .select('*')
        .eq('email', data.email)
        .maybeSingle();
      
      if (adminError) {
        console.error("Admin check error:", adminError);
        // Sign out if there's an error checking admin status
        await supabase.auth.signOut();
        throw new Error("Error checking admin status");
      }
      
      if (!adminData) {
        console.error("Not an admin user");
        // Sign out if not an admin
        await supabase.auth.signOut();
        throw new Error("Not authorized as admin");
      }
      
      console.log("Admin login successful:", adminData);
      
      // Save admin status to localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', data.email);

      toast({
        description: currentLanguage.code === 'lv' 
          ? "Veiksmīgi pieslēdzies administratora panelim." 
          : "Successfully logged into the admin panel.",
      });

      // Dispatch an event to update admin count in UI if needed
      if (adminData) {
        const event = new CustomEvent('adminCountUpdated', { 
          detail: { count: 1 } 
        });
        window.dispatchEvent(event);
      }
      
      // Reload the page to update authentication status
      window.location.reload();
      onLoginSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        description: currentLanguage.code === 'lv' 
          ? "Neizdevās pieslēgties. Pārbaudiet savus pieslēgšanās datus." 
          : "Failed to log in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                    {...field} 
                    className="pl-10" 
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
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
