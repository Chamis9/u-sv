import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { Ticket } from "@/components/ui/ticket";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: string;
}

const categoryEvents: Record<string, Event[]> = {
  theatre: [
    { id: 1, title: "Ragana", date: "2025-05-15", time: "19:00", location: "Latvijas Nacionālais teātris", description: "Mistiska izrāde pēc latviešu tautas teikām", price: "20-45" },
    { id: 2, title: "Skroderdienas Silmačos", date: "2025-05-20", time: "18:00", location: "Dailes teātris", description: "Klasiskā latviešu komēdija", price: "15-40" },
    { id: 3, title: "Hamlets", date: "2025-05-25", time: "19:00", location: "JRT", description: "Šekspīra nemirstīgā traģēdija", price: "25-50" },
    { id: 4, title: "Revidents", date: "2025-06-01", time: "19:00", location: "Latvijas Nacionālais teātris", description: "Gogola satīriskā komēdija", price: "20-45" },
    { id: 5, title: "Antigone", date: "2025-06-05", time: "18:30", location: "Dailes teātris", description: "Sengrieķu traģēdija", price: "20-40" },
    { id: 6, title: "Kaija", date: "2025-06-10", time: "19:00", location: "JRT", description: "Čehova klasiskā drāma", price: "25-45" },
    { id: 7, title: "Māsa Kerija", date: "2025-06-15", time: "18:00", location: "Latvijas Nacionālais teātris", description: "Amerikāņu klasikas iestudējums", price: "15-35" },
    { id: 8, title: "Peer Gynt", date: "2025-06-20", time: "19:00", location: "Dailes teātris", description: "Ibsena dramatiskā poēma", price: "20-50" },
    { id: 9, title: "Zelta Zirgs", date: "2025-06-25", time: "17:00", location: "JRT", description: "Raiņa pasaku luga", price: "15-30" },
    { id: 10, title: "Spēlmanis", date: "2025-06-30", time: "19:00", location: "Latvijas Nacionālais teātris", description: "Dostojevska romāna dramatizējums", price: "25-45" }
  ],
  concerts: [
    { id: 1, title: "Latvijas Radio bigbends", date: "2025-05-15", time: "19:00", location: "Lielā Ģilde", description: "Džeza mūzikas vakars", price: "20-40" },
    { id: 2, title: "Simfoniskais orķestris", date: "2025-05-22", time: "19:00", location: "Dzintaru koncertzāle", description: "Klasiskās mūzikas koncerts", price: "25-50" },
    { id: 3, title: "Prāta Vētra", date: "2025-05-29", time: "20:00", location: "Arēna Rīga", description: "Jubilejas koncerts", price: "30-60" },
    { id: 4, title: "Klasiskā mūzika parkā", date: "2025-06-05", time: "18:00", location: "Vērmanes dārzs", description: "Brīvdabas koncerts", price: "15" },
    { id: 5, title: "Instrumentālā grupa Rīga", date: "2025-06-12", time: "19:00", location: "VEF Kultūras pils", description: "Retro mūzikas vakars", price: "20-35" },
    { id: 6, title: "Dzimuši Rīgā", date: "2025-06-19", time: "20:00", location: "Arēna Rīga", description: "Populārās mūzikas koncerts", price: "25-55" },
    { id: 7, title: "Liepājas Simfoniskais orķestris", date: "2025-06-26", time: "19:00", location: "Lielais Dzintars", description: "Klasiskās mūzikas koncerts", price: "20-45" },
    { id: 8, title: "Latvijas Nacionālā opera", date: "2025-07-03", time: "19:00", location: "LNO", description: "Operdziedātāju koncerts", price: "30-70" },
    { id: 9, title: "Rīgas Doma zēnu koris", date: "2025-07-10", time: "18:00", location: "Rīgas Doms", description: "Garīgās mūzikas koncerts", price: "15-35" },
    { id: 10, title: "Latvijas Radio koris", date: "2025-07-17", time: "19:00", location: "Sv. Pētera baznīca", description: "A cappella koncerts", price: "20-40" }
  ],
  festivals: [
    { id: 1, title: "Positivus", date: "2025-07-15", time: "12:00", location: "Lucavsala", description: "Lielākais Baltijas mūzikas festivāls", price: "60-120" },
    { id: 2, title: "Latvijas Jaunās Mūzikas dienas", date: "2025-07-20", time: "15:00", location: "Dažādas vietas Rīgā", description: "Laikmetīgās mūzikas festivāls", price: "20-40" },
    { id: 3, title: "Rīgas Ritmi", date: "2025-07-25", time: "19:00", location: "Vērmanes dārzs", description: "Starptautiskais džeza festivāls", price: "30-50" },
    { id: 4, title: "Saulkrasti Jazz", date: "2025-08-01", time: "17:00", location: "Saulkrasti", description: "Džeza mūzikas festivāls", price: "25-45" },
    { id: 5, title: "Laba Daba", date: "2025-08-05", time: "14:00", location: "Ratnieki", description: "Dabas un mūzikas festivāls", price: "40-80" },
    { id: 6, title: "Summer Sound", date: "2025-08-10", time: "12:00", location: "Liepāja", description: "Vasaras mūzikas festivāls", price: "45-90" },
    { id: 7, title: "Baltijas Baleta festivāls", date: "2025-08-15", time: "19:00", location: "Dažādas vietas", description: "Starptautiskais dejas festivāls", price: "25-55" },
    { id: 8, title: "Cēsu Mākslas festivāls", date: "2025-08-20", time: "11:00", location: "Cēsis", description: "Mākslas un mūzikas festivāls", price: "20-50" },
    { id: 9, title: "Komētas festivāls", date: "2025-08-25", time: "16:00", location: "Turaida", description: "Alternatīvās mūzikas festivāls", price: "30-60" },
    { id: 10, title: "Operetes festivāls", date: "2025-08-30", time: "18:00", location: "Ikšķile", description: "Klasiskās operetes festivāls", price: "35-75" }
  ],
  sports: [
    { id: 1, title: "VEF vs Kalev", date: "2025-09-05", time: "19:00", location: "Arēna Rīga", description: "BBL basketbola spēle", price: "15-45" },
    { id: 2, title: "Dinamo Rīga hokeja spēle", date: "2025-09-10", time: "18:30", location: "Arēna Rīga", description: "KHL čempionāta spēle", price: "20-60" },
    { id: 3, title: "Latvija vs Lietuva", date: "2025-09-15", time: "20:00", location: "Daugavas stadions", description: "UEFA kvalifikācijas spēle", price: "25-70" },
    { id: 4, title: "TTT Rīga basketbols", date: "2025-09-20", time: "19:00", location: "Olympic Center", description: "Eirolīgas sieviešu basketbola spēle", price: "10-30" },
    { id: 5, title: "Rīgas Maratons", date: "2025-09-25", time: "09:00", location: "Rīgas centrs", description: "Starptautiskais maratons", price: "30-50" },
    { id: 6, title: "Tenisa turnīrs", date: "2025-09-30", time: "10:00", location: "Lielupe", description: "ITF series turnīrs", price: "15-40" },
    { id: 7, title: "Florbola finālspēle", date: "2025-10-05", time: "18:00", location: "Arēna Rīga", description: "Latvijas čempionāta fināls", price: "10-25" },
    { id: 8, title: "Boksa vakars", date: "2025-10-10", time: "19:00", location: "Olympic Center", description: "Profesionālā boksa turnīrs", price: "30-100" },
    { id: 9, title: "Volejbola spēle", date: "2025-10-15", time: "18:30", location: "Daugavas sporta nams", description: "CEV Challenge Cup", price: "15-35" },
    { id: 10, title: "BMX sacensības", date: "2025-10-20", time: "12:00", location: "Mārupes trase", description: "Latvijas kausa izcīņa", price: "10-20" }
  ],
  cinema: [
    { id: 1, title: "Rīgas Starptautiskais kinofestivāls", date: "2025-10-25", time: "19:00", location: "Splendid Palace", description: "Festivāla atklāšanas filma", price: "15-30" },
    { id: 2, title: "Latvijas filmu maratons", date: "2025-10-30", time: "12:00", location: "K.Suns", description: "Jauno latviešu filmu skate", price: "10-20" },
    { id: 3, title: "Eiropas kino dienas", date: "2025-11-05", time: "18:00", location: "Kino Citadele", description: "Eiropas filmu programma", price: "12-25" },
    { id: 4, title: "Dokumentālo filmu festivāls", date: "2025-11-10", time: "17:00", location: "Splendid Palace", description: "Starptautiska dokumentālo filmu programma", price: "10-20" },
    { id: 5, title: "Animācijas filmu vakars", date: "2025-11-15", time: "16:00", location: "K.Suns", description: "Pieaugušo animācijas filmu programma", price: "12-22" },
    { id: 6, title: "2ANNAS", date: "2025-11-20", time: "19:00", location: "Splendid Palace", description: "Starptautiskais īsfilmu festivāls", price: "8-15" },
    { id: 7, title: "Scandinavia kino dienas", date: "2025-11-25", time: "18:00", location: "Kino Citadele", description: "Ziemeļvalstu filmu programma", price: "12-25" },
    { id: 8, title: "Manhattan Short", date: "2025-11-30", time: "19:00", location: "K.Suns", description: "Īsfilmu festivāls", price: "10-20" },
    { id: 9, title: "Francijas kino nedēļa", date: "2025-12-05", time: "18:30", location: "Splendid Palace", description: "Franču filmu programma", price: "12-25" },
    { id: 10, title: "Berlināles laureāti", date: "2025-12-10", time: "19:00", location: "Kino Citadele", description: "Berlīnes kinofestivāla labākās filmas", price: "15-30" }
  ],
  children: [
    { id: 1, title: "Peppa pig", date: "2025-09-15", time: "11:00", location: "Latvijas Leļļu teātris", description: "Interaktīva izrāde bērniem", price: "10-25" },
    { id: 2, title: "Karlsons", date: "2025-09-20", time: "12:00", location: "VEF Kultūras pils", description: "Muzikāla izrāde", price: "12-28" },
    { id: 3, title: "Cirks uz ledus", date: "2025-09-25", time: "14:00", location: "Rīgas Cirks", description: "Ledus izrāde visai ģimenei", price: "15-35" },
    { id: 4, title: "Maša un Lācis", date: "2025-09-30", time: "11:00", location: "Latvijas Leļļu teātris", description: "Muzikāla pasaka", price: "10-25" },
    { id: 5, title: "Burunduku piedzīvojumi", date: "2025-10-05", time: "12:00", location: "VEF Kultūras pils", description: "Lielā burunduku šovprogramma", price: "15-30" }
  ],
  "gift-cards": [
    { id: 1, title: "Universālā dāvanu karte", date: "2025-12-31", time: "23:59", location: "Biļešu serviss", description: "Derīga visiem pasākumiem", price: "25-100" },
    { id: 2, title: "Teātra dāvanu karte", date: "2025-12-31", time: "23:59", location: "Biļešu paradīze", description: "Derīga teātra izrādēm", price: "20-80" },
    { id: 3, title: "Koncertu dāvanu karte", date: "2025-12-31", time: "23:59", location: "Biļešu serviss", description: "Derīga koncertiem", price: "30-150" },
    { id: 4, title: "Festivālu dāvanu karte", date: "2025-12-31", time: "23:59", location: "Biļešu paradīze", description: "Derīga festivāliem", price: "50-200" },
    { id: 5, title: "VIP dāvanu karte", date: "2025-12-31", time: "23:59", location: "Biļešu serviss", description: "VIP pieredze pasākumos", price: "100-500" }
  ],
  other: [
    { id: 1, title: "Kulinārijas meistarklase", date: "2025-10-10", time: "18:00", location: "Restorāns 3", description: "Ēdienu gatavošanas meistarklase", price: "45" },
    { id: 2, title: "Vīna degustācija", date: "2025-10-15", time: "19:00", location: "Vīna studija", description: "Iepazīsti pasaules vīnus", price: "35" },
    { id: 3, title: "Gleznošanas vakars", date: "2025-10-20", time: "18:30", location: "Mākslas telpa", description: "Radošā gleznošanas nodarbība", price: "30" },
    { id: 4, title: "Jogas nometne", date: "2025-10-25", time: "10:00", location: "Jūrmala", description: "Veselīga dzīvesveida pasākums", price: "50" },
    { id: 5, title: "Astroloģijas lekcija", date: "2025-10-30", time: "19:00", location: "Zinātnes centrs", description: "Ievads astroloģijā", price: "25" }
  ]
};

const categoryTitles: Record<string, { lv: string, en: string }> = {
  theatre: {
    lv: "Teātris",
    en: "Theatre"
  },
  concerts: {
    lv: "Koncerti",
    en: "Concerts"
  },
  festivals: {
    lv: "Festivāli",
    en: "Festivals"
  },
  sports: {
    lv: "Sports",
    en: "Sports"
  },
  cinema: {
    lv: "Kino",
    en: "Cinema"
  },
  children: {
    lv: "Bērniem",
    en: "For Children"
  },
  "gift-cards": {
    lv: "Dāvanu kartes",
    en: "Gift Cards"
  },
  other: {
    lv: "Citi pasākumi",
    en: "Other Events"
  }
};

const backButtonText = {
  lv: "Atpakaļ uz pasākumiem",
  en: "Back to events"
};

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const events = category ? categoryEvents[category] : [];
  const { currentLanguage } = useLanguage();
  const categoryTitle = category ? categoryTitles[category][currentLanguage.code] : "";

  if (!events) {
    const notFoundText = {
      lv: "Kategorija nav atrasta",
      en: "Category not found"
    };
    return <div className="text-center p-8">{notFoundText[currentLanguage.code as keyof typeof notFoundText]}</div>;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <Link to="/events">
                  <Button variant="ghost" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {backButtonText[currentLanguage.code as keyof typeof backButtonText]}
                  </Button>
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="text-orange-500">{categoryTitle}</span>
                </h1>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 text-orange-500">
                          <Calendar className="h-4 w-4" />
                          {event.date} | {event.time}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400">
                        {event.description}
                      </p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-lg font-semibold">
                          {event.price} €
                        </span>
                        <Link to={`/events/${category}/${event.id}`}>
                          <Button variant="outline">
                            <Ticket className="mr-2 h-4 w-4" />
                            {currentLanguage.code === 'lv' ? 'Biļetes' : 'Tickets'}
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
}
