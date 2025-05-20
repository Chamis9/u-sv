
# netieku.es - Biļešu apmaiņas platforma

## Saturs
1. [Par projektu](#par-projektu)
2. [Tehnoloģiju steks](#tehnoloģiju-steks)
3. [Projekta struktūra](#projekta-struktūra)
4. [Galvenās funkcijas](#galvenās-funkcijas)
5. [Komponentes](#komponentes)
6. [API integrācija](#api-integrācija)
7. [Lokalizācija](#lokalizācija)
8. [Administrācijas panelis](#administrācijas-panelis)
9. [Autentifikācija](#autentifikācija)
10. [Datu bāzes shēma](#datu-bāzes-shēma)
11. [Uzstādīšana un izstrāde](#uzstādīšana-un-izstrāde)

## Par projektu

netieku.es ir biļešu apmaiņas platforma Latvijā, kas ļauj lietotājiem pirkt, pārdot un apmainīties ar biļetēm uz dažādiem pasākumiem. Platforma orientēta uz drošu un ērtu biļešu tirdzniecību starp lietotājiem.

### Mērķi
- Nodrošināt drošu vietu biļešu pārdošanai starp lietotājiem
- Samazināt neizmantotu biļešu daudzumu
- Piedāvāt iespēju iegādāties biļetes uz izpārdotiem pasākumiem
- Veidot uzticamu kopienu ar verificētiem lietotājiem

## Tehnoloģiju steks

Projekts izstrādāts izmantojot šādas tehnoloģijas:

- **Frontend**: 
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn UI komponentes
  - React Router
  - TanStack Query (React Query)

- **Backend/Datubāze**: 
  - Supabase (PostgreSQL)
  - Supabase autentifikācija
  - Supabase Storage
  - Supabase Realtime

- **Papildus bibliotēkas**:
  - date-fns (datumu formatēšanai)
  - react-hook-form (formu validācijai)
  - zod (shēmu validācijai)
  - lucide-react (ikonām)
  - recharts (grafiku vizualizācijai)
  - react-helmet-async (SEO optimizācijai)

## Projekta struktūra

```
/src
  /components        # UI komponentes
    /admin           # Administrācijas paneļa komponentes
    /auth            # Autentifikācijas komponentes
    /events          # Pasākumu komponentes
    /header          # Galvenes komponentes
    /profile         # Profila komponentes
    /ui              # Shadcn UI komponentes
  /contexts          # React konteksti
  /features          # Funkcionalitātes moduļi
    /language        # Valodu atbalsts
  /hooks             # Pielāgotie React hooks
    /tickets         # Biļešu pārvaldības hooks
    /user            # Lietotāju pārvaldības hooks
  /integrations      # Ārējo servisu integrācija
    /supabase        # Supabase konfigurācija
  /lib               # Kopīgās bibliotēkas un utilītfunkcijas
  /pages             # Galvenās lapas
  /types             # TypeScript tipu definīcijas
  /utils             # Utilītfunkcijas
```

## Galvenās funkcijas

### Biļešu pārvaldība
- Biļešu pievienošana pārdošanai
- Biļešu meklēšana pēc kategorijas, datuma un vietas
- Biļešu iegāde
- Biļešu rezervēšana

### Lietotāju pārvaldība
- Reģistrācija un autentifikācija
- Profila pārvaldība
- Lietotāju verifikācija

### Pasākumu pārvaldība
- Pasākumu kategorijas
- Pasākumu meklēšana
- Pasākumu detaļas
- Pasākumu biļetes

### Administrēšana
- Lietotāju pārvaldība
- Kategoriju pārvaldība
- Biļešu pārvaldība
- Abonentu pārvaldība
- Aktivitāšu žurnāls
- Iestatījumi

## Komponentes

### Galvenās komponentes

#### Header
Navigācijas josla ar logo, galveno izvēlni un lietotāja izvēlni.
- **Faila atrašanās vieta**: `src/components/Header.tsx`
- **Funkcionalitāte**: Nodrošina navigāciju, valodu pārslēgšanu un lietotāja izvēlni

#### Footer
Kājene ar informāciju par vietni, saziņas iespējām un juridisko informāciju.
- **Faila atrašanās vieta**: `src/components/Footer.tsx`
- **Funkcionalitāte**: Parāda vietnes pamatinformāciju un navigāciju uz papildu lapām

#### Hero
Galvenās lapas galvdaļa ar aicinājumu uz darbību.
- **Faila atrašanās vieta**: `src/components/Hero.tsx`
- **Funkcionalitāte**: Piesaista lietotāju uzmanību un veicina reģistrāciju vai biļešu meklēšanu

#### EventCard
Pasākuma kartiņa ar detaļām un saiti uz biļetēm.
- **Faila atrašanās vieta**: `src/components/events/components/EventCard.tsx`
- **Funkcionalitāte**: Parāda informāciju par pasākumu, tā datumu, vietu un cenu

#### TicketCard
Biļetes kartiņa ar detaļām un pirkšanas iespējām.
- **Faila atrašanās vieta**: `src/components/events/components/TicketCard.tsx`
- **Funkcionalitāte**: Parāda biļetes informāciju, cenu un ļauj veikt iegādi

### Autentifikācijas komponentes

#### LoginForm
Pieteikšanās forma lietotāja autentifikācijai.
- **Faila atrašanās vieta**: `src/components/auth/forms/LoginForm.tsx`
- **Funkcionalitāte**: Nodrošina pieteikšanās funkcionalitāti ar e-pastu/paroli

#### RegistrationForm
Reģistrācijas forma jauna lietotāja izveidei.
- **Faila atrašanās vieta**: `src/components/auth/forms/RegistrationForm.tsx`
- **Funkcionalitāte**: Ļauj lietotājam izveidot jaunu kontu

### Profila komponentes

#### ProfileContainer
Profila lapas galvenā komponente.
- **Faila atrašanās vieta**: `src/components/profile/ProfileContainer.tsx`
- **Funkcionalitāte**: Organizē profila satura attēlošanu

#### ProfileEditForm
Forma lietotāja datu rediģēšanai.
- **Faila atrašanās vieta**: `src/components/profile/ProfileEditForm.tsx`
- **Funkcionalitāte**: Ļauj lietotājam atjaunināt personīgos datus

#### TicketsTab
Lietotāja biļešu pārvaldības cilne.
- **Faila atrašanās vieta**: `src/components/profile/tabs/tickets/TicketsTab.tsx`
- **Funkcionalitāte**: Parāda lietotāja biļetes un iespēju tās pārvaldīt

### Admin komponentes

#### AdminDashboard
Administrācijas paneļa informācijas panelis.
- **Faila atrašanās vieta**: `src/components/admin/AdminDashboard.tsx`
- **Funkcionalitāte**: Parāda sistēmas statistiku un ātro darbību pogas

#### AdminCategoriesList
Kategoriju saraksts administrācijas panelī.
- **Faila atrašanās vieta**: `src/components/admin/categories/AdminCategoriesList.tsx`
- **Funkcionalitāte**: Ļauj pārvaldīt pasākumu kategorijas

#### AdminUsersList
Lietotāju saraksts administrācijas panelī.
- **Faila atrašanās vieta**: `src/components/admin/users/AdminUsersList.tsx`
- **Funkcionalitāte**: Ļauj pārvaldīt lietotāju kontus

## API integrācija

### Supabase

Projekts izmanto Supabase kā galveno datu glabātuvi un backend risinājumu.

#### Klienta inicializācija
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bljjkzgswgeqswuuryvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsampremdzd2dlcXN3dXVyeXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjQyOTIsImV4cCI6MjA1OTg0MDI5Mn0.YKfesJP85Hhgo0Jmfsm96vnJooM8wO6FcrchZj5wL1Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

### TanStack Query (React Query)

TanStack Query tiek izmantots datu pieprasījumiem un kešošanai.

#### Piemērs: Kategoriju ielāde
```typescript
// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = (includeHidden = false) => {
  return useQuery({
    queryKey: ['categories', includeHidden],
    queryFn: async (): Promise<Category[]> => {
      const query = supabase
        .from('categories')
        .select('*');
      
      if (!includeHidden) {
        query.eq('status', 'active');
      }
      
      query.order('priority', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
```

## Lokalizācija

Projekts atbalsta vairākas valodas, izmantojot pielāgotu lokalizācijas sistēmu.

### Atbalstītās valodas
- Latviešu (lv)
- Angļu (en)
- Krievu (ru) - daļējs atbalsts

### Valodu pārslēgšana
Valodu pārslēgšana tiek īstenota ar `LanguageContext` un `LanguageSelector` komponenti.

```typescript
// src/features/language/LanguageContext.tsx
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Loģika valodas noteikšanai
  });

  // Konteksta vērtība ar tulkojumiem un valodas pārslēgšanas funkcijām
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### Tulkojumu struktūra
Tulkojumi tiek organizēti pa moduļiem un funkcijām, kas ļauj efektīvi pārvaldīt un paplašināt lokalizāciju.

```
/features/language/translations
  /features
    /admin
    /contact
    /events
    /footer
    /hero
    /...
  /lv.ts
  /en.ts
```

## Administrācijas panelis

Administrācijas panelis ļauj pārvaldīt vietnes saturu un lietotājus.

### Galvenās funkcijas
- Lietotāju pārvaldība (pievienošana, rediģēšana, dzēšana)
- Kategoriju pārvaldība (pievienošana, rediģēšana, dzēšana)
- Biļešu pārvaldība
- Abonentu pārvaldība (jaunumu saņēmēji)
- Aktivitāšu žurnāls
- Sistēmas statistika

### Piekļuves kontrole
Piekļuve administrēšanas panelim ir ierobežota tikai administratoriem, kas tiek kontrolēta ar autentifikāciju un autorizāciju.

## Autentifikācija

Projekts izmanto Supabase autentifikāciju ar pielāgotu lietotāja saskarni.

### Autentifikācijas metodes
- E-pasta un paroles autentifikācija
- (Potenciāli nākotnē) Sociālo tīklu autentifikācija

### Autentifikācijas loģika
```typescript
// AuthContext.tsx (vienkāršots piemērs)
const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    setUser(data.user);
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

## Datu bāzes shēma

Projekts izmanto Supabase (PostgreSQL) datu bāzi ar šādām galvenajām tabulām:

### registered_users
Lietotāju pamata dati.
- id (UUID) - primārā atslēga
- auth_user_id (UUID) - saite uz Supabase Auth lietotāju
- email (text) - lietotāja e-pasts
- first_name (text) - vārds
- last_name (text) - uzvārds
- phone (text) - telefona numurs
- status (text) - lietotāja statuss (aktīvs/neaktīvs)
- avatar_url (text) - profila attēla URL

### categories
Pasākumu kategorijas.
- id (UUID) - primārā atslēga
- name (text) - kategorijas nosaukums
- description (text) - kategorijas apraksts
- priority (integer) - kārtošanas prioritāte
- status (text) - statuss (aktīvs/slēpts)

### tickets
Biļešu dati.
- id (UUID) - primārā atslēga
- title (text) - biļetes nosaukums
- description (text) - biļetes apraksts
- price (numeric) - biļetes cena
- status (text) - biļetes statuss (pieejama/pārdota)
- seller_id (UUID) - pārdevēja ID
- buyer_id (UUID) - pircēja ID
- owner_id (UUID) - pašreizējā īpašnieka ID
- category_name (text) - kategorijas nosaukums
- event_id (UUID) - pasākuma ID
- event_date (date) - pasākuma datums
- venue (text) - pasākuma norises vieta
- quantity (integer) - biļešu skaits
- price_per_unit (numeric) - cena par vienu biļeti

### activity_log
Aktivitāšu žurnāls sistēmā.
- id (UUID) - primārā atslēga
- activity_type (text) - aktivitātes veids
- description (text) - aktivitātes apraksts
- user_id (UUID) - lietotāja ID
- email (text) - lietotāja e-pasts
- created_at (timestamp) - izveidošanas laiks
- metadata (jsonb) - papildu metadati

### newsletter_subscribers
Jaunumu vēstuļu abonenti.
- id (bigint) - primārā atslēga
- email (text) - abonenta e-pasts
- created_at (timestamp) - reģistrācijas laiks

## Uzstādīšana un izstrāde

### Prasības
- Node.js 18+ vai Bun
- Git

### Projekta uzstādīšana
```bash
# Klonēt repozitoriju
git clone https://github.com/your-username/netieku.git

# Ieiet projekta mapē
cd netieku

# Instalēt atkarības
npm install
# vai
bun install

# Sākt izstrādes serveri
npm run dev
# vai
bun run dev
```

### Izstrādes komandas
- `npm run dev` - Sākt izstrādes serveri
- `npm run build` - Būvēt produkcijas versiju
- `npm run preview` - Priekšskatīt produkcijas būvējumu lokāli
- `npm run lint` - Pārbaudīt koda kvalitāti

### Izvietošana
Projekts ir konfigurēts izvietošanai Vercel platformā.

## Secinājumi

netieku.es ir moderna web aplikācija, kas izstrādāta, izmantojot jaunākās tehnoloģijas un labākās prakses. Tā piedāvā ērtu un drošu platformu biļešu tirdzniecībai starp lietotājiem, ar plašām administratīvajām iespējām un daudzvalodu atbalstu.

Šī dokumentācija sniedz pārskatu par projekta struktūru, komponentēm un funkcionalitāti, lai atvieglotu turpmāku izstrādi un uzturēšanu.
