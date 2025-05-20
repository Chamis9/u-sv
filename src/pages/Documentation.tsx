
import React from 'react';
import { useLanguage } from "@/features/language";
import { Helmet } from 'react-helmet-async';
import { ScrollArea } from '@/components/ui/scroll-area';

const Documentation = () => {
  const { currentLanguage } = useLanguage();
  
  // Function to translate text based on current language
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Helmet>
        <title>
          {t('Dokumentācija | netieku.es', 'Documentation | netieku.es')}
        </title>
        <meta 
          name="description" 
          content={t(
            'Pilna netieku.es platformas dokumentācija', 
            'Complete documentation for the netieku.es platform'
          )} 
        />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">
        {t('netieku.es platformas dokumentācija', 'netieku.es Platform Documentation')}
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold mb-4">
                {t('Saturs', 'Table of Contents')}
              </h2>
              <nav className="space-y-1">
                <a href="#overview" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Projekta pārskats', 'Project Overview')}
                </a>
                <a href="#technology" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Tehnoloģiju steks', 'Technology Stack')}
                </a>
                <a href="#features" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Galvenās funkcijas', 'Key Features')}
                </a>
                <a href="#components" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Komponentes', 'Components')}
                </a>
                <a href="#database" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Datubāzes shēma', 'Database Schema')}
                </a>
                <a href="#user-guide" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Lietotāja ceļvedis', 'User Guide')}
                </a>
                <a href="#developer" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('Izstrādātāja ceļvedis', 'Developer Guide')}
                </a>
                <a href="#api" className="block text-blue-600 hover:underline dark:text-blue-400">
                  {t('API atsauce', 'API Reference')}
                </a>
              </nav>
            </div>
          </div>
          
          {/* Documentation Content */}
          <div className="lg:w-3/4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="pr-6 space-y-8">
                {/* Project Overview */}
                <section id="overview">
                  <h2 className="text-2xl font-bold mb-4">{t('Projekta pārskats', 'Project Overview')}</h2>
                  <p>
                    {t(
                      'netieku.es ir visaptveroša biļešu apmaiņas platforma Latvijai, kas paredzēta biļešu pirkšanai, pārdošanai un apmaiņai dažādiem pasākumiem. Platforma atbalsta vairākas valodas un nodrošina nevainojamu lietotāja pieredzi dažādās ierīcēs.',
                      'netieku.es is a comprehensive ticket exchange platform for Latvia, designed to facilitate buying, selling, and exchanging tickets for various events. The platform supports multiple languages and provides a seamless user experience across different devices.'
                    )}
                  </p>
                </section>
                
                {/* Technology Stack */}
                <section id="technology">
                  <h2 className="text-2xl font-bold mb-4">{t('Tehnoloģiju steks', 'Technology Stack')}</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS, Shadcn UI</li>
                    <li><strong>Backend:</strong> Supabase (Authentication, Database, Storage)</li>
                    <li><strong>State Management:</strong> React Query (@tanstack/react-query)</li>
                    <li><strong>Form Handling:</strong> react-hook-form with zod validation</li>
                    <li><strong>Icons:</strong> Lucide React</li>
                    <li><strong>Charts:</strong> Recharts</li>
                  </ul>
                </section>
                
                {/* Key Features */}
                <section id="features">
                  <h2 className="text-2xl font-bold mb-4">{t('Galvenās funkcijas', 'Key Features')}</h2>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {t('Daudzvalodu atbalsts', 'Multi-Language Support')}
                  </h3>
                  <p>{t('Platforma atbalsta vairākas valodas:', 'The platform supports multiple languages:')}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('Latviešu (LV)', 'Latvian (LV)')}</li>
                    <li>{t('Angļu (EN)', 'English (EN)')}</li>
                    <li>{t('Krievu (RU) [Daļēji]', 'Russian (RU) [Partial]')}</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {t('Lietotāju autentifikācija', 'User Authentication')}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('E-pasta un paroles autentifikācija', 'Email and password authentication')}</li>
                    <li>{t('Lietotāja profila pārvaldība', 'User profile management')}</li>
                    <li>{t('Autentifikācijas stāvokļa pārvaldība', 'Authentication state management')}</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {t('Biļešu pārvaldība', 'Ticket Management')}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('Biļešu pievienošana pārdošanai', 'Adding tickets for sale')}</li>
                    <li>{t('Biļešu iegāde', 'Purchasing tickets')}</li>
                    <li>{t('Iegādāto un pievienoto biļešu skatīšana', 'Viewing purchased and added tickets')}</li>
                    <li>{t('Biļešu kategorizācija', 'Ticket categorization')}</li>
                    <li>{t('Biļešu meklēšana un filtrēšana', 'Ticket search and filtering')}</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {t('Pasākumu pārvaldība', 'Event Management')}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('Pasākumu saraksts pa kategorijām', 'Event listing by category')}</li>
                    <li>{t('Pasākumu detaļu skats', 'Event details view')}</li>
                    <li>{t('Pasākumu meklēšana un filtrēšana', 'Event search and filtering')}</li>
                    <li>{t('Pieejamās biļetes pasākumiem', 'Available tickets for events')}</li>
                  </ul>
                </section>
                
                {/* Components */}
                <section id="components">
                  <h2 className="text-2xl font-bold mb-4">{t('Komponentes', 'Components')}</h2>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {t('Galvenās komponentes', 'Core Components')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{t('Galvene', 'Header')}</h4>
                      <p>{t('Navigācijas josla, kas ietver logo, saites, valodas izvēlni un autentifikācijas pogas.', 'Navigation bar that includes logo, links, language selector, and authentication buttons.')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{t('Kājene', 'Footer')}</h4>
                      <p>{t('Satur vietnes saites, valodu izvēlni un jaunumu abonentu veidlapu.', 'Contains site links, language selector, and newsletter subscription form.')}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {t('Biļešu komponentes', 'Ticket Components')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">TicketsContent</h4>
                      <p>{t('Galvenā komponente biļešu attēlošanai ar rediģēšanas, dzēšanas un priekšskatījuma iespējām.', 'Main component for displaying tickets with editing, deletion, and preview capabilities.')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">VisualTicket</h4>
                      <p>{t('Kartiņas komponente, kas attēlo biļetes informāciju, ieskaitot nosaukumu, detaļas un cenu.', 'Card component that displays ticket information including title, details, and price.')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">AddTicketForm</h4>
                      <p>{t('Veidlapa biļešu pievienošanai un rediģēšanai ar laukiem visiem nepieciešamajiem datiem.', 'Form for adding and editing tickets with fields for all necessary data.')}</p>
                    </div>
                  </div>
                </section>
                
                {/* Database Schema */}
                <section id="database">
                  <h2 className="text-2xl font-bold mb-4">{t('Datubāzes shēma', 'Database Schema')}</h2>
                  <p>{t('Galvenās datubāzes tabulas:', 'Main database tables:')}</p>
                  
                  <div className="mt-4 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold">registered_users</h3>
                      <p>{t('Glabā lietotāju informāciju:', 'Stores user information:')}</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>id: UUID (primary key)</li>
                        <li>auth_user_id: UUID</li>
                        <li>email: Text</li>
                        <li>first_name: Text</li>
                        <li>last_name: Text</li>
                        <li>phone: Text</li>
                        <li>status: Text</li>
                        <li>avatar_url: Text</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold">tickets</h3>
                      <p>{t('Glabā biļešu informāciju:', 'Stores ticket information:')}</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>id: UUID (primary key)</li>
                        <li>title: Text</li>
                        <li>description: Text</li>
                        <li>price: Numeric</li>
                        <li>seller_id: UUID</li>
                        <li>buyer_id: UUID</li>
                        <li>category_name: Text</li>
                        <li>venue: Text</li>
                        <li>event_date: Date</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold">categories</h3>
                      <p>{t('Glabā biļešu kategorijas:', 'Stores ticket categories:')}</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>id: UUID (primary key)</li>
                        <li>name: Text</li>
                        <li>description: Text</li>
                        <li>status: Text</li>
                        <li>priority: Integer</li>
                      </ul>
                    </div>
                  </div>
                </section>
                
                {/* User Guide */}
                <section id="user-guide">
                  <h2 className="text-2xl font-bold mb-4">{t('Lietotāja ceļvedis', 'User Guide')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold">{t('Reģistrācija un pieteikšanās', 'Registration and Login')}</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>{t('Noklikšķiniet uz pogas "Pieslēgties" galvenē', 'Click on the "Login" button in the header')}</li>
                        <li>{t('Izvēlieties "Reģistrēties", ja jums nav konta', 'Choose "Register" if you don\'t have an account')}</li>
                        <li>{t('Aizpildiet savu personīgo informāciju', 'Fill in your personal information')}</li>
                        <li>{t('Piesakieties ar savu e-pastu un paroli', 'Log in with your email and password')}</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold">{t('Biļetes pievienošana pārdošanai', 'Adding a Ticket for Sale')}</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>{t('Dodieties uz savu profila lapu', 'Navigate to your profile page')}</li>
                        <li>{t('Izvēlieties cilni "Biļetes"', 'Select the "Tickets" tab')}</li>
                        <li>{t('Noklikšķiniet uz "Pievienot biļeti"', 'Click "Add Ticket"')}</li>
                        <li>{t('Aizpildiet biļetes detaļas', 'Fill in the ticket details')}</li>
                        <li>{t('Noklikšķiniet uz "Pievienot biļeti", lai pabeigtu', 'Click "Add Ticket" to complete')}</li>
                      </ol>
                    </div>
                  </div>
                </section>
                
                {/* Developer Guide */}
                <section id="developer">
                  <h2 className="text-2xl font-bold mb-4">{t('Izstrādātāja ceļvedis', 'Developer Guide')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold">{t('Izstrādes vides iestatīšana', 'Setting Up the Development Environment')}</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>{t('Klonējiet repozitoriju', 'Clone the repository')}</li>
                        <li>{t('Instalējiet atkarības ar `npm install` vai `bun install`', 'Install dependencies with `npm install` or `bun install`')}</li>
                        <li>{t('Konfigurējiet Supabase vides mainīgos', 'Configure environment variables for Supabase')}</li>
                        <li>{t('Palaidiet izstrādes serveri ar `npm run dev` vai `bun run dev`', 'Run the development server with `npm run dev` or `bun run dev`')}</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold">{t('Jaunu funkciju pievienošana', 'Adding a New Feature')}</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>{t('Izveidojiet komponentes atbilstošajā direktorijā', 'Create components in the appropriate directory')}</li>
                        <li>{t('Izmantojiet esošos hook vai izveidojiet jaunus', 'Use existing hooks or create new ones')}</li>
                        <li>{t('Sekojiet stāvokļa pārvaldības paraugiem', 'Follow the state management patterns')}</li>
                        <li>{t('Implementējiet internacionalizāciju, izmantojot valodas kontekstu', 'Implement internationalization using the language context')}</li>
                      </ol>
                    </div>
                  </div>
                </section>
                
                {/* API Reference */}
                <section id="api" className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">{t('API atsauce', 'API Reference')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold">{t('Hook', 'Hooks')}</h3>
                      
                      <div className="mt-3 space-y-4">
                        <div>
                          <h4 className="font-semibold">useAuth</h4>
                          <p>{t('Nodrošina autentifikācijas kontekstu un funkcijas:', 'Provides authentication context and functions:')}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>isAuthenticated: Boolean</li>
                            <li>user: Object</li>
                            <li>logout: Function</li>
                            <li>refreshSession: Function</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">useUserTickets</h4>
                          <p>{t('Pārvalda lietotāja biļetes:', 'Manages user tickets:')}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>tickets: Array</li>
                            <li>addTicket: Function</li>
                            <li>updateTicket: Function</li>
                            <li>deleteTicket: Function</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">useLanguage</h4>
                          <p>{t('Pārvalda valodas preferences:', 'Manages language preferences:')}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>currentLanguage: Object</li>
                            <li>setLanguage: Function</li>
                            <li>t: Function</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold">{t('Supabase funkcijas', 'Supabase Functions')}</h3>
                      
                      <div className="mt-3 space-y-4">
                        <div>
                          <h4 className="font-semibold">{t('Autentifikācija', 'Authentication')}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>supabase.auth.signUp</li>
                            <li>supabase.auth.signInWithPassword</li>
                            <li>supabase.auth.signOut</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">{t('Datubāze', 'Database')}</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>supabase.from('table').select()</li>
                            <li>supabase.from('table').insert()</li>
                            <li>supabase.from('table').update()</li>
                            <li>supabase.from('table').delete()</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
