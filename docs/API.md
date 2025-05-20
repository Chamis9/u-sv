
# netieku.es API dokumentācija

## Saturs

1. [Supabase API](#supabase-api)
2. [Autentifikācija](#autentifikācija)
3. [Datu tabulas](#datu-tabulas)
4. [Storage](#storage)
5. [Realtime](#realtime)
6. [RPC funkcijas](#rpc-funkcijas)
7. [Drošība un pieejamība](#drošība-un-pieejamība)

## Supabase API

netieku.es izmanto Supabase kā galveno API nodrošinātāju. Supabase ir atvērtā koda Firebase alternatīva, kas balstās uz PostgreSQL.

### Konfigurācija

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bljjkzgswgeqswuuryvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsampremdzd2dlcXN3dXVyeXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjQyOTIsImV4cCI6MjA1OTg0MDI5Mn0.YKfesJP85Hhgo0Jmfsm96vnJooM8wO6FcrchZj5wL1Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

## Autentifikācija

### Pieejamās metodes

1. **E-pasta un paroles autentifikācija**

```typescript
// Pieteikšanās
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Reģistrācija
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// Izrakstīšanās
const signOut = async () => {
  await supabase.auth.signOut();
};
```

### Sesijas pārvaldība

```typescript
// Pašreizējā lietotāja iegūšana
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Sesijas pārvaldība
const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
```

## Datu tabulas

### Galvenās datu tabulas un to struktūra

#### registered_users
```typescript
interface RegisteredUser {
  id: string;
  auth_user_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  status: 'active' | 'inactive';
  avatar_url: string | null;
}
```

#### categories
```typescript
interface Category {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  status: 'active' | 'hidden';
  created_at: string;
}
```

#### tickets
```typescript
interface Ticket {
  id: string;
  title: string;
  description: string | null;
  price: number;
  event_id: string | null;
  seller_id: string;
  buyer_id: string | null;
  owner_id: string;
  status: 'available' | 'sold' | 'reserved' | 'deleted';
  file_path: string | null;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  category_name: string | null;
  event_date: string | null;
  venue: string | null;
  quantity: number;
  price_per_unit: number | null;
  event_time: string | null;
  seat_info: Record<string, any> | null;
}
```

#### activity_log
```typescript
interface ActivityLog {
  id: string;
  activity_type: 'subscriber' | 'user' | 'ticket' | 'system' | 'login' | 'logout' | 'settings';
  description: string;
  user_id: string | null;
  email: string | null;
  created_at: string;
  metadata: Record<string, any> | null;
}
```

#### newsletter_subscribers
```typescript
interface NewsletterSubscriber {
  id: number;
  email: string;
  created_at: string;
}
```

### Datu piekļuves metodes

#### Datu iegūšana

```typescript
// Kategoriju iegūšana
const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .order('priority', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Biļešu iegūšana pēc kategorijas
const getTicketsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('status', 'available')
    .eq('category_name', category);
  
  if (error) throw error;
  return data;
};

// Lietotāja biļešu iegūšana
const getUserTickets = async (userId: string) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('owner_id', userId);
  
  if (error) throw error;
  return data;
};
```

#### Datu pievienošana

```typescript
// Biļetes pievienošana
const addTicket = async (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticket])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Aktivitātes žurnāla ieraksta pievienošana
const logActivity = async (activity: Omit<ActivityLog, 'id' | 'created_at'>) => {
  const { error } = await supabase
    .from('activity_log')
    .insert([activity]);
  
  if (error) throw error;
};
```

#### Datu atjaunināšana

```typescript
// Lietotāja profila atjaunināšana
const updateUserProfile = async (userId: string, updates: Partial<RegisteredUser>) => {
  const { data, error } = await supabase
    .from('registered_users')
    .update(updates)
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Biļetes statusa atjaunināšana
const updateTicketStatus = async (ticketId: string, status: Ticket['status'], buyerId?: string) => {
  const updates: Partial<Ticket> = { status };
  if (buyerId && status === 'sold') {
    updates.buyer_id = buyerId;
  }
  
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', ticketId)
    .select();
  
  if (error) throw error;
  return data[0];
};
```

#### Datu dzēšana

```typescript
// Biļetes dzēšana
const deleteTicket = async (ticketId: string) => {
  // Praktiski biļetes netiek dzēstas, bet to statuss tiek mainīts uz 'deleted'
  const { error } = await supabase
    .from('tickets')
    .update({ status: 'deleted' })
    .eq('id', ticketId);
  
  if (error) throw error;
  return true;
};

// Abonenta dzēšana
const deleteSubscriber = async (email: string) => {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('email', email);
  
  if (error) throw error;
  return true;
};
```

## Storage

Supabase Storage tiek izmantots failu glabāšanai, piemēram, biļešu failiem un lietotāju avatāriem.

### Failu augšupielāde

```typescript
// Biļetes faila augšupielāde
const uploadTicketFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('tickets')
    .upload(path, file);
  
  if (error) throw error;
  return data.path;
};

// Avatāra augšupielāde
const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true
    });
  
  if (error) throw error;
  
  // Publiskā URL iegūšana
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
    
  return publicUrl;
};
```

### Failu dzēšana

```typescript
// Biļetes faila dzēšana
const deleteTicketFile = async (path: string) => {
  const { error } = await supabase.storage
    .from('tickets')
    .remove([path]);
  
  if (error) throw error;
  return true;
};
```

## Realtime

Supabase Realtime ļauj saņemt reāllaika atjauninājumus par datubāzes izmaiņām.

```typescript
// Lietotāju skaita atjauninājumu klausīšanās
const subscribeToUsersCount = (callback: (count: number) => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'registered_users'
      },
      async () => {
        // Iegūt jauno lietotāju skaitu
        const { count } = await supabase
          .from('registered_users')
          .select('*', { count: 'exact', head: true });
          
        if (count !== null) {
          callback(count);
        }
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};

// Biļešu izmaiņu klausīšanās
const subscribeToTicketChanges = (ticketId: string, callback: (ticket: Ticket) => void) => {
  const channel = supabase
    .channel(`ticket-${ticketId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'tickets',
        filter: `id=eq.${ticketId}`
      },
      (payload) => {
        callback(payload.new as Ticket);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
```

## RPC funkcijas

Supabase ļauj definēt un izsaukt attālas procedūras (RPC) funkcijas.

```typescript
// Lietotāja profila atjaunināšana ar RPC
const updateUserProfileRPC = async (params: UpdateUserProfileParams) => {
  const { data, error } = await supabase.rpc(
    'update_user_profile',
    params
  );
  
  if (error) throw error;
  return data;
};

// Aktivitātes žurnāla ieraksta pievienošana ar RPC
const logActivityRPC = async (params: LogActivityParams) => {
  const { error } = await supabase.rpc(
    'log_activity',
    params
  );
  
  if (error) throw error;
};

// Lietotāja iegūšana pēc e-pasta
const getUserByEmail = async (email: string): Promise<GetUserByEmailResult> => {
  const { data, error } = await supabase.rpc(
    'get_user_by_email',
    { p_email: email }
  );
  
  if (error) throw error;
  return data;
};
```

## Drošība un pieejamība

### Row Level Security (RLS)

Supabase izmanto PostgreSQL Row Level Security (RLS), lai aizsargātu datus.

#### Piemēri RLS politikām

- **categories** tabula: Publiska lasīšanas piekļuve aktīvajām kategorijām, rakstīšanas piekļuve tikai autentificētiem lietotājiem ar administratora lomu.

- **tickets** tabula: Lasīšanas piekļuve visiem pieejamajām biļetēm, rakstīšanas piekļuve tikai biļetes īpašniekam.

- **registered_users** tabula: Katrs lietotājs var lasīt un modificēt tikai savus datus, administratori var piekļūt visiem ierakstiem.

### API pieejamība

- Supabase API ir pieejams caur HTTPS ar CORS atbalstu.
- API limiti ir atkarīgi no Supabase plāna (bezmaksas plānam ir ierobežojumi).
- Produkcijas videi ieteicams izmantot maksas Supabase plānu, lai nodrošinātu labāku veiktspēju un uzticamību.

### Drošības ieteikumi

1. **Klienta pusē:**
   - Nekad neglabāt jutīgus datus lokālajā krātuvē.
   - Vienmēr validēt lietotāja ievadi pirms nosūtīšanas uz serveri.
   - Izmantot HTTPS savienojumus.

2. **Datu aizsardzība:**
   - Izmantot Row Level Security politikas.
   - Ierobežot piekļuvi datiem, balstoties uz lietotāja lomu un īpašumtiesībām.
   - Regulāri pārskatīt un atjaunināt drošības politikas.

3. **Autentifikācija:**
   - Izmantot drošas paroles politikas.
   - Ierobežot neveiksmīgus pieteikšanās mēģinājumus.
   - Apsvērt divu faktoru autentifikācijas ieviešanu.
