
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
    // Mēģinām reģistrēt lietotāju Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@netieku.es',
      password: 'raivis2025!',
    });

    // Ja ir kļūda, bet tā ir par to, ka lietotājs jau eksistē, mēs varam turpināt
    if (authError && !authError.message.includes('already registered')) {
      console.error('Kļūda veidojot administratora kontu Auth:', authError);
      return false;
    }

    // Pārbaudām, vai lietotājs jau eksistē admin_user tabulā
    const { data: existingUser, error: checkError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', 'admin@netieku.es')
      .maybeSingle();

    // Ja jau eksistē, tad nav jāieliek vēlreiz
    if (existingUser) {
      return true;
    }

    // Pievienojam ierakstu admin_user tabulā
    const { error: insertError } = await supabase
      .from('admin_user')
      .insert({
        email: 'admin@netieku.es'
      });

    if (insertError) {
      console.error('Kļūda pievienojot administratoru admin_user tabulā:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Kļūda createAdminUser:', error);
    return false;
  }
};

// Pievienot funkciju, kas ļauj viegli izveidot administratora kontu
export const setupAdminAccount = async () => {
  try {
    // Vispirms pārbaudām, vai administrators jau eksistē
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', 'admin@netieku.es')
      .maybeSingle();

    if (checkError) {
      console.error('Kļūda pārbaudot administratora kontu:', checkError);
      return false;
    }

    // Ja administrators jau eksistē, atgriežam true
    if (existingAdmin) {
      console.log('Administrators jau eksistē!');
      return true;
    }

    // Ja administrators neeksistē, izveidojam jaunu
    return await createAdminUser();
  } catch (error) {
    console.error('Kļūda setupAdminAccount:', error);
    return false;
  }
};
