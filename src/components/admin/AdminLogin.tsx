
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useLanguage } from "@/features/language";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { checkAdminCredentials } from "@/utils/authHelpers";

const formSchema = z.object({
  email: z.string().email({
    message: "Lūdzu, ievadiet derīgu e-pasta adresi.",
  }),
  password: z.string().min(6, {
    message: "Parolei jābūt vismaz 6 simbolus garai.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function AdminLogin({ isOpen, onClose, onLoginSuccess }: AdminLoginProps) {
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
      // Izmantojam atjaunināto autentifikācijas metodi
      const isAdmin = await checkAdminCredentials(data.email, data.password);

      if (!isAdmin) {
        throw new Error("Not authorized as admin");
      }

      toast({
        description: currentLanguage.code === 'lv' 
          ? "Veiksmīgi pieslēdzies administratora panelim." 
          : "Successfully logged into the admin panel.",
      });
      
      // Atjauninam lapu, lai atjauninātu autentifikācijas statusu
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

  // Translation helper function
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Administratora pieslēgšanās', 'Administrator Login')}</DialogTitle>
          <DialogDescription>
            {t('Lūdzu, ievadiet savus administratora pieslēgšanās datus.', 'Please enter your administrator credentials.')}
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
