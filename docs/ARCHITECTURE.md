
# netieku.es - Arhitektūras dokumentācija

## Saturs

1. [Projekta pārskats](#projekta-pārskats)
2. [Arhitektūras principi](#arhitektūras-principi)
3. [Frontend arhitektūra](#frontend-arhitektūra)
4. [Backend arhitektūra](#backend-arhitektūra)
5. [Datu plūsma](#datu-plūsma)
6. [Komponenšu attiecības](#komponenšu-attiecības)
7. [Izstrādes standarti](#izstrādes-standarti)
8. [Mērogojamība](#mērogojamība)

## Projekta pārskats

netieku.es ir biļešu apmaiņas platforma, kas ļauj lietotājiem pārdot un iegādāties biļetes uz dažādiem pasākumiem. Projekts ir veidots kā moderne vienas lapas lietotne (SPA), kas izmanto React un TypeScript frontend pusē un Supabase pilna steka pakalpojumu backend funkcionalitātei.

## Arhitektūras principi

### Galvenie principi

1. **Komponentes bāzēta arhitektūra** - Sistēma ir veidota no neatkarīgām, atkārtoti izmantojamām komponentēm.

2. **Atdalītie interešu līmeņi (Separation of Concerns)** - Kods ir organizēts tā, lai skaidri atdalītu dažādus lietotnes aspektus (UI, loģika, datu piekļuve).

3. **Deklaratīvs UI** - Lietotāja saskarne ir veidota deklaratīvā veidā, izmantojot React.

4. **Tipo-drošība** - TypeScript tiek izmantots visā kodā, lai nodrošinātu tipus un atklātu kļūdas izstrādes laikā.

5. **Servera-puses drošība** - Datu piekļuves drošība tiek kontrolēta servera pusē, izmantojot Supabase Row Level Security (RLS).

## Frontend arhitektūra

### Komponenšu struktūra

netieku.es izmanto hierarhisku komponenšu struktūru:

1. **Lapas (Pages)** - Augstākā līmeņa komponentes, kas atbilst konkrētam URL maršrutam.
   - Piemēram: `Index.tsx`, `Profile.tsx`, `Events.tsx`

2. **Konteinerkomponentes** - Pārvalda stāvokli un datu plūsmu konkrētai funkcionalitātei.
   - Piemēram: `ProfileContainer.tsx`, `EventTickets.tsx`

3. **Prezentācijas komponentes** - Atbild par UI attēlošanu, bet parasti nesatur sarežģītu loģiku.
   - Piemēram: `EventCard.tsx`, `TicketCard.tsx`

4. **UI komponentes** - Pamata UI elementi, kas tiek izmantoti visā lietotnē.
   - Piemēram: Shadcn/UI komponentes kā `Button`, `Card`, `Dialog`

### Stāvokļa pārvaldība

1. **React Hooks** - Stāvoklis galvenokārt tiek pārvaldīts, izmantojot React hooks.
   - `useState` vienkāršam lokālam stāvoklim
   - `useReducer` sarežģītākam stāvoklim

2. **Konteksti** - Globālā stāvokļa pārvaldībai.
   - `AuthContext` - Autentifikācijas stāvokļa pārvaldībai
   - `LanguageContext` - Valodu un tulkojumu pārvaldībai

3. **TanStack Query** - Serverā esošo datu stāvokļa pārvaldībai un kešošanai.
   - Piemēram: `useCategories`, `useEvents`, `useUserTickets`

### Maršrutēšana

Projekts izmanto React Router v6 maršrutēšanai:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:category" element={<CategoryEventList />} />
    <Route path="/events/:category/:eventId" element={<EventTickets />} />
    <Route path="/tickets" element={<Tickets />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/admin/*" element={<Admin />} />
    <Route path="/profile/*" element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Stilizēšana

1. **Tailwind CSS** - Utility-first CSS framework, kas ļauj ātri veidot UI.
2. **Shadcn UI** - Gatavu komponenšu bibliotēka, kas veidota uz Radix UI un stilizēta ar Tailwind CSS.
3. **Tēmu atbalsts** - Gaismas un tumšā režīma atbalsts, izmantojot `ThemeProvider`.

## Backend arhitektūra

netieku.es izmanto Supabase kā backend servisu, kas nodrošina:

1. **Autentifikāciju un autorizāciju**
   - E-pasta/paroles autentifikācija
   - Sesiju pārvaldība
   - Row Level Security (RLS) autorizācijai

2. **Datu bāzi**
   - PostgreSQL datu bāze ar relāciju shēmu
   - Row Level Security politikas datu aizsardzībai
   - Datu validācija servera pusē

3. **Storage**
   - Failu glabāšana (biļešu faili, avatāri)
   - Piekļuves kontrole failiem

4. **Realtime**
   - Reāllaika datu atjauninājumi, izmantojot WebSocket

### Datu modelis

![Database Schema](https://mermaid.ink/img/pako:eNqdks9PwjAUx_-VpmeW6GDjRCFeyMaDFzX-6DEjL6NFWMPW8S4-8H93XQdjGtUT3d6P7_f7NPEEJZcIGdQVESH3Bx3VJmI164mD4DASnhAq5jX9cuLRUSqHO5OOhpYp9UdYvh2in_mKdTGRyYt2wtKRnL-BXdU53awluc-31KZfEnfhl5IrqVdC92OpbEu1jYPvoupJhQAoHg-4JniHo7rXnecHc-XMUM0_9Po8FNoYuuDOcFK3bBXWjUGNR3TRv6205Vo5f84xt-OkK1-jyd72nQJv1G-3e6JvuF5TrrnbDJlZsNiZ5VxUdMaFxdam8LZzLy-c0BpdufuvMpzSeKMwzUQYfiPr9A3MUIMwEEUkG24t-tPolZToJTcIWR9YM4PFiXVAPVBD1lqWmwiJ1bxhHqYJlaV5WdEhS4JDfj-kCRDmxsDyXZlnW7CL_Li8GekmLhz7Bo74uQM)

```
erDiagram
    registered_users ||--o{ tickets : "owns_sells_buys"
    categories ||--o{ tickets : "categorizes"
    registered_users ||--o{ activity_log : "generates"
    newsletter_subscribers {
        bigint id PK
        text email
        timestamp created_at
    }
    registered_users {
        uuid id PK
        uuid auth_user_id FK
        text email
        text first_name
        text last_name
        text phone
        timestamp created_at
        timestamp updated_at
        timestamp last_sign_in_at
        text status
        text avatar_url
    }
    categories {
        uuid id PK
        text name
        text description
        integer priority
        text status
        timestamp created_at
    }
    tickets {
        uuid id PK
        text title
        text description
        numeric price
        uuid event_id
        uuid seller_id FK
        uuid buyer_id FK
        uuid owner_id FK
        text status
        text file_path
        timestamp created_at
        timestamp updated_at
        uuid category_id FK
        text category_name
        date event_date
        text venue
        integer quantity
        numeric price_per_unit
        text event_time
        jsonb seat_info
    }
    activity_log {
        uuid id PK
        text activity_type
        text description
        uuid user_id FK
        text email
        timestamp created_at
        jsonb metadata
    }
```

## Datu plūsma

Tipisks datu plūsmas piemērs netieku.es lietotnē:

1. **Lietotāja darbība** - Lietotājs veic darbību UI (piemēram, noklikšķina uz pogas "Pievienot biļeti").

2. **Notikuma apstrādātājs** - React komponente izpilda notikuma apstrādātāju (event handler).

3. **Datu validācija** - Dati tiek validēti, izmantojot Zod vai React Hook Form validācijas shēmas.

4. **API pieprasījums** - Tiek veikts pieprasījums uz Supabase API.
   ```typescript
   const addTicket = async (ticketData) => {
     const { data, error } = await supabase
       .from('tickets')
       .insert([ticketData])
       .select();
     
     // Apstrādāt atbildi...
   };
   ```

5. **Servera validācija** - Supabase veic papildu validāciju un pārbauda RLS politikas.

6. **Datu saglabāšana** - Dati tiek saglabāti PostgreSQL datubāzē.

7. **Atbilde klientam** - Rezultāts tiek nosūtīts atpakaļ klientam.

8. **Stāvokļa atjaunināšana** - Lietotnes stāvoklis tiek atjaunināts, izmantojot React Query vai tiešu stāvokļa atjaunināšanu.

9. **UI atjaunināšana** - Komponentes tiek pārrenderētas ar jaunajiem datiem.

## Komponenšu attiecības

Tālāk ir aprakstītas galveno komponenšu attiecības:

### Autentifikācijas plūsma

- `LoginForm` -> `AuthContext` -> Supabase Auth -> `AuthContext` -> `ProfileContainer` / `AdminContent`

### Biļešu pārvaldības plūsma

- `TicketsTab` -> `AddTicketForm` -> `useTicketMutations` -> Supabase DB -> `useTicketQueries` -> `TicketsTable` / `TicketsGrid`

### Administratora panelis

- `AdminSidebar` -> `AdminContent` -> (`AdminUsersList` / `AdminCategoriesList` / `AdminTicketsList`) -> atbilstošie hooks -> Supabase DB

## Izstrādes standarti

### Koda organizācija

1. **Failu struktūra** - Kods organizēts pēc funkcionalitātes un veida:
   - `/components` - UI komponentes
   - `/hooks` - Pielāgotie React hooks
   - `/contexts` - React konteksti
   - `/utils` - Utilītfunkcijas
   - `/features` - Funkcionalitātes moduļi

2. **Komponenšu sadalījums** - Komponentes sadalītas mazākās, specializētās daļās (viena faila izmērs parasti ≤ 300 rindas).

3. **Imports** - Absolute imports, izmantojot aliasus:
   ```typescript
   import { Button } from "@/components/ui/button";
   import { useAuth } from "@/contexts/AuthContext";
   ```

### Koda stils

1. **TypeScript** - Stingra tipu izmantošana:
   ```typescript
   interface UserTicket {
     id: string;
     title: string;
     price: number;
     status: 'available' | 'sold' | 'reserved';
   }
   
   const tickets: UserTicket[] = []; // Nepieciešams definēt tipu
   ```

2. **React patterns**:
   - Funkcionālās komponentes ar hooks
   - Composition over inheritance
   - Custom hooks datu loģikai

3. **Konsekvence**:
   - Vienots nosaukumu veidošanas stils (camelCase, PascalCase)
   - JSDoc komentāri sarežģītām funkcijām

## Mērogojamība

### Frontend mērogošana

1. **Koda sadalīšana (Code splitting)** - Izmantojot React.lazy un Suspense:
   ```jsx
   const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));
   
   // Izmantošana
   <Suspense fallback={<Loader />}>
     <AdminPanel />
   </Suspense>
   ```

2. **Komponenšu optimizācija** - React.memo un useCallback/useMemo efektīvai pārrenderēšanai.

3. **Progresīvā ielāde** - Attēlu un satura progresīva ielāde.

### Backend mērogošana

1. **Supabase infrastruktūra** - Dažādi plāni atkarībā no lietotāju apjoma un resursu prasībām.

2. **Indeksēšana** - Datubāzes tabulu indeksi biežākajiem vaicājumiem.

3. **Kešošana** - React Query kešošana, lai samazinātu tīkla pieprasījumus:
   ```typescript
   const { data } = useQuery({
     queryKey: ['categories'],
     queryFn: fetchCategories,
     staleTime: 5 * 60 * 1000, // 5 minūtes
   });
   ```

4. **Lapu kešošana** - CDN priekšā Vercel infrastruktūrā.

## Drošība

### Frontend drošība

1. **Ievades validācija** - Visas lietotāja ievades tiek validētas gan klienta, gan servera pusē.

2. **XSS aizsardzība** - React pēc noklusējuma aizsargā pret XSS uzbrukumiem.

3. **CSRF aizsardzība** - Supabase JWT token izmantošana.

### Backend drošība

1. **Row Level Security (RLS)** - Detalizēta piekļuves kontrole datu līmenī:
   ```sql
   -- Piemērs: Tikai biļetes īpašnieks var to rediģēt
   CREATE POLICY "Users can update their own tickets" ON tickets
     FOR UPDATE
     USING (auth.uid() = owner_id);
   ```

2. **Datu validācija** - Servera puses validācija ar PostgreSQL ierobežojumiem un triggeriem.

3. **Autentifikācija** - Drošs JWT token autentifikācijas process.
