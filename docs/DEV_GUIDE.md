
# netieku.es - Izstrādātāja rokasgrāmata

## Saturs

1. [Ievads](#ievads)
2. [Izstrādes vides iestatīšana](#izstrādes-vides-iestatīšana)
3. [Koda organizācija un struktūra](#koda-organizācija-un-struktūra)
4. [Galvenās komponentes un moduļi](#galvenās-komponentes-un-moduļi)
5. [Darbs ar datiem](#darbs-ar-datiem)
6. [Autentifikācija un autorizācija](#autentifikācija-un-autorizācija)
7. [Lokalizācija](#lokalizācija)
8. [Biļešu sistēmas funkcionalitāte](#biļešu-sistēmas-funkcionalitāte)
9. [Administratora panelis](#administratora-panelis)
10. [Testēšana](#testēšana)
11. [Izplatītās problēmas un risinājumi](#izplatītās-problēmas-un-risinājumi)

## Ievads

Šī rokasgrāmata ir paredzēta izstrādātājiem, kas strādā ar netieku.es kodu. Dokumentā ir aprakstīta projekta struktūra, galvenās komponentes, datu plūsma un izstrādes prakses.

### Tehnoloģiju steks

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (autentifikācija, datubāze, storage)
- **Datu pārvaldība**: TanStack Query (React Query)
- **Formām**: React Hook Form ar Zod validāciju
- **Maršrutēšana**: React Router v6
- **Lokalizācija**: Pielāgota valodu sistēma

## Izstrādes vides iestatīšana

### Prasības

- Node.js 18+ vai Bun
- Git
- IDE (ieteicams VS Code)
- Supabase konta piekļuve (lokālai testēšanai)

### Projekta iegūšana

```bash
# Klonēt repozitoriju
git clone https://github.com/your-username/netieku.git

# Ieiet projekta direktorijā
cd netieku

# Instalēt atkarības
npm install
# vai
bun install
```

### Vides mainīgo konfigurācija

Izveidojiet `.env.local` failu projekta saknes direktorijā:

```
VITE_SUPABASE_URL=https://bljjkzgswgeqswuuryvm.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Izstrādes servera palaišana

```bash
npm run dev
# vai
bun run dev
```

Aplikācija būs pieejama adresē: `http://localhost:5173`

### Produkcijas būvējuma veidošana

```bash
npm run build
# vai
bun run build
```

### Produkcijas versijas testēšana lokāli

```bash
npm run preview
# vai
bun run preview
```

## Koda organizācija un struktūra

### Projekta struktūra

```
/src
  /components          # UI komponentes
    /admin             # Admin paneļa komponentes
    /auth              # Autentifikācijas komponentes
    /events            # Pasākumu un biļešu komponentes
    /header            # Galvenes komponentes
    /profile           # Lietotāja profila komponentes
    /ui                # Shadcn UI komponentes
  /contexts            # React konteksti (AuthContext, utt.)
  /features            # Funkcionalitātes moduļi
    /language          # Valodu un tulkojumu sistēma
  /hooks               # Pielāgotie React hooks
    /tickets           # Biļešu pārvaldības hooks
    /user              # Lietotāju pārvaldības hooks
  /integrations        # Ārējo servisu integrācijas
    /supabase          # Supabase konfigurācija
  /pages               # Lapas komponentes
  /types               # TypeScript tipu definīcijas
  /utils               # Utilītfunkcijas
  App.tsx              # Galvenā aplikācijas komponente
  main.tsx             # Aplikācijas sākumpunkts
```

### Koda stils un konvencijas

1. **Failu nosaukšana**
   - React komponentes: PascalCase (piemēram, `EventCard.tsx`)
   - Hooks: camelCase ar "use" prefiksu (piemēram, `useCategories.ts`)
   - Utilītfunkcijas: camelCase (piemēram, `formatDate.ts`)

2. **Komponenšu struktūra**
   ```typescript
   // Imports
   import React from 'react';
   import { useLanguage } from '@/features/language';
   
   // Types
   interface Props {
     title: string;
     description?: string;
   }
   
   // Component
   export function MyComponent({ title, description }: Props) {
     // Hooks
     const { currentLanguage } = useLanguage();
     
     // Event handlers
     const handleClick = () => {
       // ...
     };
     
     // Render
     return (
       <div>
         <h1>{title}</h1>
         {description && <p>{description}</p>}
       </div>
     );
   }
   ```

3. **Importu kārtība**
   - React un bibliotēkas
   - Komponentes
   - Hooks
   - Utilītfunkcijas
   - Tipi un saskarnes
   - Stili

## Galvenās komponentes un moduļi

### Lapas

Katrai URL adresei atbilst lapa `pages` direktorijā:

- `Index.tsx` - Sākumlapa
- `Events.tsx` - Pasākumu saraksts
- `Profile.tsx` - Lietotāja profils
- `AboutUs.tsx` - Par mums
- `Contact.tsx` - Kontakti
- `Admin.tsx` - Administrācijas panelis

### Galvenās komponentes

#### Header

```tsx
// src/components/Header.tsx
export function Header() {
  // Navigācija, valodu izvēle, lietotāja izvēlne
}
```

#### Footer

```tsx
// src/components/Footer.tsx
export function Footer() {
  // Kājene ar saiti un informāciju
}
```

#### EventCard

```tsx
// src/components/events/components/EventCard.tsx
export function EventCard({ event }: { event: Event }) {
  // Pasākuma kartiņa ar informāciju
}
```

### Konteksti

#### AuthContext

```tsx
// src/contexts/AuthContext.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Autentifikācijas stāvoklis un funkcijas
};

export const useAuth = () => {
  // Hook piekļuvei autentifikācijas kontekstam
};
```

#### LanguageContext

```tsx
// src/features/language/LanguageContext.tsx
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Valodas stāvoklis un funkcijas
};

export const useLanguage = () => {
  // Hook piekļuvei valodu kontekstam
};
```

## Darbs ar datiem

### Supabase datu piekļuve

```typescript
// Piemērs: Kategoriju iegūšana
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
  });
};
```

### Datu mutācijas

```typescript
// Piemērs: Biļetes pievienošana
export const useAddTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ticketData: AddTicketData): Promise<UserTicket> => {
      // Biļetes pievienošanas loģika
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          price: ticketData.price,
          // ... citi lauki
        }])
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Atjaunināt kešotos datus
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
```

### Datu kešošana ar React Query

```typescript
// Piemērs: Biļešu iegūšana ar kešošanu
export const useTicketQueries = (userId?: string) => {
  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async (): Promise<UserTicket[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('owner_id', userId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minūtes
  });
  
  // Papildu funkcija datu atjaunināšanai
  const refreshTickets = () => {
    queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
  };
  
  return { tickets, isLoading, error, refreshTickets };
};
```

## Autentifikācija un autorizācija

### Autentifikācijas loģika

```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = async (email: string, password: string) => {
    // Pieteikšanās loģika ar Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data.user;
  };
  
  const logout = async () => {
    // Izrakstīšanās loģika
    await supabase.auth.signOut();
    setUser(null);
  };
  
  // Pašreizējā sesija
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
      
      setIsLoading(false);
      
      // Klausīties auth stāvokļa izmaiņas
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };
    
    getUser();
  }, []);
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      // ... citas autentifikācijas funkcijas
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Autorizācijas pielietošana

```tsx
// Piemērs: Aizsargāta komponente
function ProtectedComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      {/* Aizsargāta satura atainošana */}
    </div>
  );
}
```

## Lokalizācija

### Valodu sistēma

```typescript
// src/features/language/LanguageContext.tsx
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Valodas noteikšanas loģika
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    
    if (savedLang && languages.some(lang => lang.code === savedLang)) {
      return languages.find(lang => lang.code === savedLang) || languages[0];
    }
    
    if (browserLang && languages.some(lang => lang.code === browserLang)) {
      return languages.find(lang => lang.code === browserLang) || languages[0];
    }
    
    return languages[0]; // Noklusējuma valoda (latviešu)
  });
  
  // Valodas maiņas funkcija
  const changeLanguage = (code: string) => {
    const newLang = languages.find(lang => lang.code === code);
    if (newLang) {
      setCurrentLanguage(newLang);
      localStorage.setItem('language', code);
    }
  };
  
  // Tulkojumu iegūšana
  const getTranslation = (key: string, defaultValue?: string) => {
    // Funkcija tulkojumu iegūšanai no translations objekta
  };
  
  // Valodas konteksta vērtība
  const contextValue = {
    currentLanguage,
    languages,
    changeLanguage,
    translations: translationsData[currentLanguage.code],
    getTranslation,
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
```

### Tulkojumu lietošana

```tsx
// Piemērs: Tulkojumu izmantošana komponentē
function WelcomeMessage() {
  const { currentLanguage, translations } = useLanguage();
  
  // Vienkārša helper funkcija tulkojumiem
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  return (
    <div>
      <h1>{t('Sveicināti!', 'Welcome!', 'Добро пожаловать!')}</h1>
      <p>{translations.hero.subtitle}</p>
    </div>
  );
}
```

## Biļešu sistēmas funkcionalitāte

### Biļetes pievienošana

```tsx
// src/components/profile/tabs/tickets/AddTicketForm.tsx
export function AddTicketForm() {
  const { addTicket, loading } = useTicketMutations(user?.id);
  const form = useForm<AddTicketFormData>({
    resolver: zodResolver(addTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category_name: '',
      // ... citi lauki
    }
  });
  
  const onSubmit = async (data: AddTicketFormData) => {
    try {
      await addTicket({
        ...data,
        seller_id: user.id,
        owner_id: user.id,
        status: 'available'
      });
      
      toast({
        title: t('Biļete pievienota', 'Ticket added'),
        description: t('Biļete ir veiksmīgi pievienota', 'The ticket has been successfully added')
      });
      
      form.reset();
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast({
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās pievienot biļeti', 'Failed to add ticket'),
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields */}
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : t('Pievienot biļeti', 'Add ticket')}
        </Button>
      </form>
    </Form>
  );
}
```

### Biļešu meklēšana un filtrēšana

```typescript
// src/hooks/useEventFilters.ts
export const useEventFilters = (events?: Event[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Filtrēt pasākumus pēc meklēšanas vaicājuma un datumiem
  const filteredEvents = events?.filter(event => {
    // Teksta meklēšanas filtrs
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Datumu filtrs
    let matchesDateRange = true;
    if (startDate) {
      const eventDate = new Date(event.start_date);
      matchesDateRange = eventDate >= startDate;
    }
    if (endDate) {
      const eventDate = new Date(event.start_date);
      matchesDateRange = matchesDateRange && eventDate <= endDate;
    }
    
    return matchesSearch && matchesDateRange;
  })
  // Kārtot pasākumus pēc datuma (augoši - agrākie pasākumi pirmie)
  .sort((a, b) => {
    if (!a.start_date) return 1;
    if (!b.start_date) return -1;
    
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateA.getTime() - dateB.getTime();
  }) || [];

  return {
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    filteredEvents
  };
};
```

### Biļešu iegāde

```typescript
// Vienkāršots piemērs biļetes iegādei
export const usePurchaseTicket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ticketId }: { ticketId: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      // 1. Atjaunināt biļetes statusu un īpašnieku
      const { data, error } = await supabase
        .from('tickets')
        .update({
          status: 'sold',
          buyer_id: user.id,
          owner_id: user.id,
        })
        .eq('id', ticketId)
        .eq('status', 'available')  // Tikai ja biļete ir pieejama
        .select();
      
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Ticket not available");
      }
      
      // 2. Reģistrēt darījumu aktivitāšu žurnālā
      await supabase.rpc('log_activity', {
        p_activity_type: 'ticket',
        p_description: `Purchased ticket ${ticketId}`,
        p_user_id: user.id,
        p_email: user.email,
        p_metadata: { ticket_id: ticketId }
      });
      
      return data[0];
    },
    onSuccess: () => {
      // Atjaunināt kešotos datus
      queryClient.invalidateQueries({ queryKey: ['available-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['user-tickets', user?.id] });
      
      // Parādīt paziņojumu par veiksmīgu pirkumu
      toast({
        title: 'Biļete iegādāta!',
        description: 'Biļete ir veiksmīgi iegādāta un pievienota jūsu profilam.',
      });
    },
    onError: (error) => {
      console.error('Failed to purchase ticket:', error);
      toast({
        title: 'Kļūda iegādājoties biļeti',
        description: 'Neizdevās iegādāties biļeti. Lūdzu, mēģiniet vēlreiz.',
        variant: 'destructive'
      });
    }
  });
};
```

## Administratora panelis

### Admin autentifikācija

```typescript
// src/hooks/useAdminAuth.ts
export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsAdminLoading(false);
        return;
      }
      
      try {
        // Pārbaudīt, vai lietotājs ir administrators
        const { data, error } = await supabase
          .from('admin_user')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };
    
    checkAdminRole();
  }, [user]);
  
  return { isAdmin, isAdminLoading };
};
```

### AdminContent komponente

```tsx
// src/components/admin/AdminContent.tsx
export function AdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin, isAdminLoading } = useAdminAuth();
  const { t } = useAdminTranslations();
  
  // Parādīt ielādes indikatoru, kamēr tiek pārbaudīta administratora loma
  if (isAdminLoading) {
    return <div className="p-8"><Spinner size="lg" /></div>;
  }
  
  // Ja lietotājs nav administrators, parādīt pieejas lieguma ziņojumu
  if (!isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">{t('Pieeja liegta', 'Access denied')}</h1>
        <p>{t('Jums nav piekļuves tiesību šim panelim', 'You do not have permission to access this panel')}</p>
      </div>
    );
  }
  
  // Administratora paneļa satura renderēšana
  return (
    <div className="flex min-h-screen">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-grow p-4">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'tickets' && <AdminTicketsList />}
        {activeTab === 'categories' && <AdminCategoriesList />}
        {activeTab === 'subscribers' && <AdminSubscribers />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}
```

## Testēšana

### Komponentu testēšana

```tsx
// Piemērs: Komponentes tests
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketCard } from './TicketCard';

// Mocka dati
const mockTicket = {
  id: '1',
  title: 'Testa biļete',
  description: 'Biļetes apraksts',
  price: 25.99,
  status: 'available',
  // ... citi lauki
};

describe('TicketCard', () => {
  test('renders ticket information correctly', () => {
    render(<TicketCard ticket={mockTicket} />);
    
    expect(screen.getByText('Testa biļete')).toBeInTheDocument();
    expect(screen.getByText('Biļetes apraksts')).toBeInTheDocument();
    expect(screen.getByText('€25.99')).toBeInTheDocument();
  });
  
  test('calls onPurchase when purchase button is clicked', async () => {
    const onPurchaseMock = jest.fn();
    
    render(<TicketCard ticket={mockTicket} onPurchase={onPurchaseMock} />);
    
    await userEvent.click(screen.getByText('Buy Ticket'));
    
    expect(onPurchaseMock).toHaveBeenCalledWith(mockTicket.id);
  });
});
```

### API testēšana

```typescript
// Piemērs: API testa metode
import { supabase } from '@/integrations/supabase/client';

describe('Categories API', () => {
  test('fetches active categories correctly', async () => {
    // Izpildīt zapprosu
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active');
    
    // Pārbaudīt rezultātu
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data?.length).toBeGreaterThan(0);
    
    // Pārbaudīt kategorijas struktūru
    const category = data?.[0];
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('status', 'active');
  });
});
```

## Izplatītās problēmas un risinājumi

### 1. Autentifikācijas problēmas

**Problēma**: Lietotājs tiek izrakstīts vai sesija netiek saglabāta pēc lapas atjaunināšanas.

**Risinājums**: 
```typescript
// Pārbaudiet Supabase sesiju un tās apstrādi
useEffect(() => {
  // Iegūt sākotnējo sesiju
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
    setIsLoading(false);
  });

  // Uzstādīt klausītāju sesijas izmaiņām
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 2. Datu ielādes problēmas

**Problēma**: Dati netiek atjaunināti pēc mutācijām vai sākotnēji neielādējas.

**Risinājums**:
```typescript
// Izmantojiet queryClient.invalidateQueries pēc datu mutācijām
const queryClient = useQueryClient();

// Pēc veiksmīgas mutācijas
queryClient.invalidateQueries({ queryKey: ['tickets'] });

// Vai specificētāk
queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });

// Pārbaudiet, vai useQuery hooks tiek pareizi konfigurēti
const { data, isLoading } = useQuery({
  queryKey: ['key', dependency],
  queryFn: fetchData,
  enabled: !!dependency, // Query izpildīsies tikai, ja dependency ir true/truthy
});
```

### 3. Komponentes pārrenderēšanas optimizācija

**Problēma**: Komponente tiek pārrenderēta pārāk bieži, kas samazina veiktspēju.

**Risinājums**:
```typescript
// Izmantot React.memo lieku pārrenderēšanu novēršanai
const MyComponent = React.memo(function MyComponent(props) {
  // ...
});

// Izmantot useCallback/useMemo funkciju atsaucēm
const memoizedCallback = useCallback(() => {
  doSomethingWith(a, b);
}, [a, b]);

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### 4. Tulkojumu problēmas

**Problēma**: Tulkojumi netiek parādīti vai tiek parādīti nepareizā valodā.

**Risinājums**:
```typescript
// Pārbaudiet, vai pareizais tulkojumu objekts tiek izmantots
const { currentLanguage, translations } = useLanguage();

// Pārbaudiet translations objekta struktūru
console.log('Current language:', currentLanguage.code);
console.log('Translations available:', translations);

// Izmantojiet noturīgu helper funkciju
const t = (lv: string, en: string, ru?: string) => {
  if (!currentLanguage) return en;
  if (currentLanguage.code === 'lv') return lv;
  if (currentLanguage.code === 'ru') return ru || en;
  return en;
};
```

### 5. React Query kešošanas problēmas

**Problēma**: Dati netiek atjaunināti vai kešoti pareizi.

**Risinājums**:
```typescript
// Iestatiet pareizus kešošanas laikus un atjaunināšanas uzvedību
const { data } = useQuery({
  queryKey: ['key', id],
  queryFn: fetchFunction,
  staleTime: 5 * 60 * 1000,      // 5 minūtes līdz dati kļūst "stale"
  gcTime: 10 * 60 * 1000,        // 10 minūtes līdz dati tiek izdzēsti no keša
  refetchOnWindowFocus: true,    // Atjaunināt datus, kad logs iegūst fokusu
  refetchOnMount: true,          // Atjaunināt datus, kad komponente tiek montēta
  refetchOnReconnect: true,      // Atjaunināt datus, kad tīkla savienojums tiek atjaunots
});
```
