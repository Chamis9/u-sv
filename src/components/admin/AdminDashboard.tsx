
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Mail, Ticket, ArrowUpRight, 
  TrendingUp, AlertCircle, CheckCircle, Clock 
} from "lucide-react";
import { useLanguage } from "@/features/language";

export function AdminDashboard() {
  const { currentLanguage } = useLanguage();
  
  // Translation helper function
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('Administratora panelis', 'Administrator Dashboard')}</h1>
        <p className="text-muted-foreground">{t('Platformas statistika un pārskats', 'Platform statistics and overview')}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Kopējie lietotāji', 'Total Users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+5%</span> {t('kopš pagājušā mēneša', 'since last month')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Jauni e-pasta abonenti', 'New Email Subscribers')}</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span> {t('kopš pagājušās nedēļas', 'since last week')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Aktīvās biļetes', 'Active Tickets')}</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">{t('Nav aktīvu biļešu', 'No active tickets')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Lietotāju aktivitāte', 'User Activity')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+2%</span> {t('kopš pagājušā mēneša', 'since last month')}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('Pēdējās aktivitātes', 'Recent Activities')}</CardTitle>
            <CardDescription>{t('Pēdējās lietotāju darbības platformā', 'Recent user actions on the platform')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('Jauns lietotājs reģistrējies', 'New user registered')}</p>
                <p className="text-xs text-muted-foreground">{t('Pirms 2 stundām', '2 hours ago')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('Jauns e-pasta abonents', 'New email subscriber')}</p>
                <p className="text-xs text-muted-foreground">{t('Pirms 5 stundām', '5 hours ago')}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              {t('Skatīt visas aktivitātes', 'View all activities')}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('Sistēmas statuss', 'System Status')}</CardTitle>
            <CardDescription>{t('Platformas pakalpojumu statuss', 'Status of platform services')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('Mājas lapa', 'Homepage')}</span>
              </div>
              <span className="text-xs font-medium text-green-500">{t('Darbojas', 'Operational')}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('Autentifikācija', 'Authentication')}</span>
              </div>
              <span className="text-xs font-medium text-green-500">{t('Darbojas', 'Operational')}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t('Datubāze', 'Database')}</span>
              </div>
              <span className="text-xs font-medium text-green-500">{t('Darbojas', 'Operational')}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{t('E-pasta pakalpojums', 'Email Service')}</span>
              </div>
              <span className="text-xs font-medium text-yellow-500">{t('Daļēji darbojas', 'Partially Operational')}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              {t('Pārbaudīt visus pakalpojumus', 'Check all services')}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('Ātrās darbības', 'Quick Actions')}</CardTitle>
            <CardDescription>{t('Biežāk izmantotās administratora funkcijas', 'Frequently used administrator functions')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              {t('Pārvaldīt lietotājus', 'Manage Users')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              {t('Sūtīt ziņojumu abonentiem', 'Send Message to Subscribers')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Ticket className="mr-2 h-4 w-4" />
              {t('Pārvaldīt biļetes', 'Manage Tickets')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
