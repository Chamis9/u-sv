
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Drama, Music, Film, Trophy, PartyPopper, Baby, Gift, MoreHorizontal, Plane } from "lucide-react";
import { GlobalThemeToggle } from "@/components/theme/GlobalThemeToggle";
import { useCategories } from '@/hooks/useCategories';
import { EventFilters } from '@/components/events/EventFilters';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';

const categoryIcons = {
  "Teātris": Drama,
  "Koncerti": Music,
  "Festivāli": PartyPopper,
  "Sports": Trophy,
  "Kino": Film,
  "Bērniem": Baby,
  "Ceļojumi": Plane,
  "Dāvanu kartes": Gift,
  "Citi": MoreHorizontal
};

const Events = () => {
  const { translations, currentLanguage } = useLanguage();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: events, isLoading: eventsLoading } = useFilteredEvents({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    startDate,
    endDate,
    searchQuery
  });

  const isLoading = categoriesLoading || eventsLoading;

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
          <SEO />
          <Header />
          <main className="flex-grow pt-24 pb-12">
            <div className="container mx-auto px-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
          <GlobalThemeToggle />
        </div>
      </ThemeProvider>
    );
  }

  if (events && (selectedCategory !== 'all' || searchQuery || startDate)) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
          <SEO />
          <Header />
          <main className="flex-grow pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-orange-500">
                    {translations.events?.title || "Pasākumi"}
                  </span>
                </h1>
                
                <EventFilters
                  onSearchChange={setSearchQuery}
                  onCategoryChange={setSelectedCategory}
                  onDateChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  selectedCategory={selectedCategory}
                  selectedStartDate={startDate}
                  selectedEndDate={endDate}
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Link to={`/events/${event.category.toLowerCase()}/${event.id}`} key={event.id}>
                      <Card className="h-full transition-transform hover:scale-105 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>
                            {new Date(event.start_date).toLocaleDateString()}
                            {event.description && (
                              <p className="mt-2 text-sm">{event.description}</p>
                            )}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
                
                {events.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {currentLanguage.code === 'lv' 
                        ? "Nav atrasti pasākumi ar norādītajiem kritērijiem" 
                        : "No events found matching your criteria"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
          <Footer />
          <GlobalThemeToggle />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <SEO />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-500">
                  {translations.events?.title || "Pasākumi"}
                </span>
              </h1>

              <EventFilters
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                selectedCategory={selectedCategory}
                selectedStartDate={startDate}
                selectedEndDate={endDate}
              />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category) => {
                  const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || MoreHorizontal;
                  const route = category.name.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <Link to={`/events/${route}`} key={category.id}>
                      <Card className="h-full transition-transform hover:scale-105 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconComponent className="h-6 w-6 text-orange-500" />
                            {category.name}
                          </CardTitle>
                          <CardDescription>
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <GlobalThemeToggle />
      </div>
    </ThemeProvider>
  );
};

export default Events;
