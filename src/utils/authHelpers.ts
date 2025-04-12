
import { supabase } from "@/integrations/supabase/client";

// Pārbauda, vai lietotāja dati atbilst administratora datiem
export const checkAdminCredentials = async (email: string, password: string) => {
  try {
    console.log("Pārbauda administratora pieteikšanās datus:", email);
    
    // Mēģinām pieslēgties ar e-pastu un paroli
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Autentifikācijas kļūda:', authError);
      return false;
    }

    if (!authData.user) {
      console.error('Netika atrasts lietotājs');
      return false;
    }

    // Pārbaudām, vai lietotājs ir administrators mūsu admin_user tabulā
    const { data: adminData, error: adminError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (adminError) {
      console.error('Kļūda pārbaudot administratora statusu:', adminError);
      await supabase.auth.signOut(); // Atslēdzam, ja nav administratora tiesību
      return false;
    }

    if (!adminData) {
      console.error('Lietotājs nav administrators');
      await supabase.auth.signOut(); // Atslēdzam, ja nav administratora tiesību
      return false;
    }

    // Ja viss kārtībā, saglabājam informāciju par administratora pieslēgšanos
    localStorage.setItem('admin_authenticated', 'true');
    return true;
  } catch (error) {
    console.error('Kļūda checkAdminCredentials:', error);
    return false;
  }
};

// Izveidot administratora lietotāju (tikai demo vajadzībām)
export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@netieku.es',
      password: 'raivis2025!',
    });

    if (error) {
      console.error('Kļūda veidojot administratora kontu:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Kļūda createAdminUser:', error);
    return false;
  }
};
