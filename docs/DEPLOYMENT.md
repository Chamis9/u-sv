
# netieku.es - Izvietošanas dokumentācija

## Saturs

1. [Izvietošanas pārskats](#izvietošanas-pārskats)
2. [Prasības](#prasības)
3. [Izstrādes vide](#izstrādes-vide)
4. [Testa vide](#testa-vide)
5. [Produkcijas vide](#produkcijas-vide)
6. [CI/CD process](#cicd-process)
7. [Vides konfigurācija](#vides-konfigurācija)
8. [Monitorings un kļūdu apstrāde](#monitorings-un-kļūdu-apstrāde)
9. [Drošības apsvērumi](#drošības-apsvērumi)
10. [Datu bāzes migrācijas](#datu-bāzes-migrācijas)
11. [Atjaunināšana un atkāpšanās plāns](#atjaunināšana-un-atkāpšanās-plāns)

## Izvietošanas pārskats

netieku.es ir izvietots, izmantojot modernas DevOps prakses ar Vercel kā primāro hostinga platformu un Supabase kā datubāzes un backend pakalpojumu. Šis dokuments apraksta izvietošanas procesu, vides konfigurāciju un saistītās darbības.

### Izvietošanas arhitektūra

```
                           +------------+
                           |            |
                +--------->+   Vercel   +<---------+
                |          |            |          |
                |          +------------+          |
                |                                  |
        +-------+------+                  +-------+------+
        |              |                  |              |
        | GitHub Repo  |                  | Supabase     |
        |              |                  |              |
        +--------------+                  +--------------+
                ^                                 ^
                |                                 |
                |                                 |
        +-------+------+                  +-------+------+
        |              |                  |              |
        | Development  |                  | Local Dev DB |
        | Environment  |                  |              |
        +--------------+                  +--------------+
```

## Prasības

### Minimālās sistēmas prasības (produkcijas serverim)

- Node.js 18+ vai Bun
- Pārlūkprogramma ar moderno JavaScript atbalstu
- Stabilais interneta savienojums

### Ieteicamā izstrādes vide

- Node.js 18+ vai Bun
- VS Code ar šādiem paplašinājumiem:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript
- Git 2.25+

## Izstrādes vide

### Lokālās izstrādes vides iestatīšana

1. **Klonēt repozitoriju**
   ```bash
   git clone https://github.com/your-username/netieku.git
   cd netieku
   ```

2. **Instalēt atkarības**
   ```bash
   npm install
   # vai
   bun install
   ```

3. **Iestatīt vides mainīgos**
   Izveidot `.env.local` failu projekta saknē:
   ```
   VITE_SUPABASE_URL=https://your-supabase-instance.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Sākt izstrādes serveri**
   ```bash
   npm run dev
   # vai
   bun run dev
   ```

5. **Piekļūt izstrādes videi**
   Atveriet pārlūkprogrammu un dodieties uz `http://localhost:5173`

### Izstrādes vides integritātes pārbaudes

1. **Linting**
   ```bash
   npm run lint
   ```

2. **Type checking**
   ```bash
   npm run typecheck
   ```

3. **Būvēšanas process**
   ```bash
   npm run build
   ```

## Testa vide

Testa vide ir pieejama caur Vercel Preview Deployments, kas tiek automātiski izveidoti no Pull Request.

### Testa vides URL struktūra

- `https://netieku-git-feature-branch-name.vercel.app`

### Testa vides Supabase projekts

Testa videi ir pieejams atsevišķs Supabase projekts, lai izvairītos no produkcijas datu izmaiņām:

- Supabase projekts: `netieku-test`
- Datu bāze: Klonēta no produkcijas, bet ar testēšanas datiem

### Testa vides izmantošana

1. Izveidojiet Pull Request GitHub repozitorijā
2. Vercel automātiski veidos Preview Deployment
3. Kad izvietošana ir pabeigta, jums būs pieejama saite uz Preview Deployment

## Produkcijas vide

### Produkcijas URL

- Galvenā vietne: `https://netieku.es`
- Admin panelis: `https://netieku.es/admin`

### Produkcijas izvietošanas process

1. **Koda apvienošana ar `main` zaru**
   Kad kods ir pārbaudīts un apstiprināts, tas tiek apvienots ar `main` zaru.

2. **Automātiskā izvietošana**
   Vercel automātiski izvieto aplikāciju no `main` zara.

3. **Pēc-izvietošanas pārbaudes**
   Pēc izvietošanas tiek veiktas pārbaudes, lai nodrošinātu, ka viss darbojas pareizi.

### Produkcijas konfigurācija

Produkcijas vide izmanto šādus iestatījumus:

- Node.js versija: 20.x
- Būvēšanas komanda: `npm run build`
- Izvades direktorija: `dist`
- Vides mainīgie: konfigurēti Vercel projekta iestatījumos

## CI/CD process

netieku.es izmanto nepārtraukto integrāciju un izvietošanu (CI/CD), izmantojot GitHub Actions un Vercel.

### GitHub Actions darbplūsmas

1. **Pull Request pārbaude**
   Tiek palaista pēc PR izveidošanas vai atjaunināšanas:
   - Lint pārbaudes
   - TypeScript tipu pārbaude
   - Būvēšanas process

2. **Main zara izvietošana**
   Tiek palaista pēc apvienošanas ar `main`:
   - Automātiska izvietošana Vercel

### Vercel integrācija

- **Preview Deployments** tiek veidoti no Pull Request
- **Production Deployment** tiek veikts no `main` zara

## Vides konfigurācija

### Vides mainīgie

Projekts izmanto šādus vides mainīgos:

| Mainīgais | Apraksts | Piemēra vērtība |
|-----------|----------|-----------------|
| VITE_SUPABASE_URL | Supabase instance URL | https://bljjkzgswgeqswuuryvm.supabase.co |
| VITE_SUPABASE_ANON_KEY | Supabase anonīmā pieeja | eyJhbGciOiJIUzI1NiIsInR... |
| VITE_APP_ENV | Aplikācijas vide | production |
| VITE_API_TIMEOUT | API pieprasījumu taimauts (ms) | 30000 |

### Konfigurācija dažādās vidēs

| Iestatījums | Izstrāde | Testēšana | Produkcija |
|------------|----------|-----------|------------|
| Supabase projekts | bljjkzgswgeqswuuryvm (izstrāde) | bljjkzgswgeqswuuryvm-test | bljjkzgswgeqswuuryvm |
| Debugging | Iespējots | Daļēji iespējots | Atspējots |
| Optimizācija | Minimāla | Daļēja | Pilna |
| Kļūdu apstrāde | Detalizēta | Standarta | Minimāla (klientam) |

## Monitorings un kļūdu apstrāde

### Kļūdu uztveršana

netieku.es izmanto pielāgotu kļūdu apstrādes mehānismu:

```javascript
window.addEventListener('error', (event) => {
  // Kļūdas piefiksēšana un nosūtīšana
  logErrorToServer({
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});
```

### Monitoringa rīki

Projekts izmanto šādus monitoringa rīkus:

1. **Vercel Analytics** - lapas ielādes ātruma un apmeklējumu monitoringam
2. **Supabase monitorings** - datubāzes veiktspējas monitoringam
3. **Custom logging** - lietotāju darbību un kļūdu reģistrēšanai

### Paziņojumu sistēma

Kritiskas kļūdas un brīdinājumi tiek nosūtīti uz:
- E-pasta paziņojumus administratoriem
- Slack kanālu #netieku-alerts

## Drošības apsvērumi

### SSL/TLS

Projekts izmanto SSL/TLS šifrēšanu:
- Let's Encrypt sertifikāts, kas automātiski atjaunojas caur Vercel

### Datu aizsardzība

- Lietotāju paroles nekad netiek glabātas kā atklāts teksts
- Supabase RLS politikas aizsargā datus datubāzes līmenī
- JWT token autentifikācija ar ierobežotu derīguma termiņu

### Drošības headersi

HTTP drošības galvenes ir konfigurētas:

```
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Datu bāzes migrācijas

### Migrāciju pārvaldība

Supabase migrācijas tiek pārvaldītas, izmantojot:

1. **Supabase CLI**
   ```bash
   supabase db diff -f add_user_profile
   ```

2. **SQL skripti**
   Migrāciju skriptus saglabā mapē `supabase/migrations/`

### Migrācijas process

1. Izstrādāt un testēt izmaiņas lokālā Supabase instancē
2. Izveidot migrāciju skriptu
3. Pārbaudīt migrācijas skriptu testa vidē
4. Piemērot migrāciju produkcijas vidē

## Atjaunināšana un atkāpšanās plāns

### Versiju kontrole

- Visas izmaiņas tiek izsekots, izmantojot Git
- Versijas numuri seko semantisko versiju numerāciju (SemVer)

### Atkāpšanās (Rollback) process

1. **Frontend atkāpšanās**
   Vercel ļauj ātri atgriezties pie iepriekšēja izvietojuma:
   ```bash
   vercel rollback
   ```

2. **Datubāzes atkāpšanās**
   Datubāzes atkāpšanās balstās uz:
   - Regulāriem automātiskiem Supabase datubāzes dublējumiem
   - Atkāpšanās SQL skriptiem, kas tiek sagatavoti pirms kritiskām migrācijām

### Datubāzes dublēšana

- **Automātiskie dublējumi**: Katru dienu
- **Pieejamība**: 30 dienas (Supabase Pro plāna ietvaros)
- **Atjaunošanas punkti**: Point-in-Time Recovery (PITR) līdz 24h

## Izlaidumu pārvaldība

### Izlaiduma process

1. Versijas numura noteikšana (izmantojot SemVer)
2. Izmaiņu saraksta (changelog) atjaunināšana
3. Zaru apvienošana (`release` -> `main`)
4. Git tagu piešķiršana
5. Automātiska izvietošana no `main` zara

### Pēc-izlaiduma darbības

1. Veiktspējas monitorings
2. Lietotāju atsauksmju apkopošana
3. Kļūdu izsekošana un prioritizēšana
