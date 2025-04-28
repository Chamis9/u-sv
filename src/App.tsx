
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Events from './pages/Events';
import { CategoryEventList } from './components/events/CategoryEventList';
import { EventTickets } from './components/events/EventTickets';
import { AddNewEvent } from './pages/AddNewEvent';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import Tickets from './pages/Tickets';
import Registration from './pages/Registration';
import Admin from './pages/Admin';

// Context providers
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from "./features/language";
import { AuthProvider } from './contexts/AuthContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/add" element={<AddNewEvent />} />
                <Route path="/events/:categoryId" element={<CategoryEventList />} />
                <Route path="/events/:categoryId/:eventId" element={<EventTickets />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/profile/*" element={<Profile />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster position="top-center" />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
