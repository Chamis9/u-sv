
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Mail, Ticket, ArrowUpRight, 
  TrendingUp, AlertCircle, CheckCircle, Clock 
} from "lucide-react";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administratora panelis</h1>
        <p className="text-muted-foreground">Platformas statistika un pārskats</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kopējie lietotāji</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+5%</span> kopš pagājušā mēneša
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jauni e-pasta abonenti</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span> kopš pagājušās nedēļas
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktīvās biļetes</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Nav aktīvu biļešu</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lietotāju aktivitāte</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+2%</span> kopš pagājušā mēneša
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pēdējās aktivitātes</CardTitle>
            <CardDescription>Pēdējās lietotāju darbības platformā</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Jauns lietotājs reģistrējies</p>
                <p className="text-xs text-muted-foreground">Pirms 2 stundām</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Jauns e-pasta abonents</p>
                <p className="text-xs text-muted-foreground">Pirms 5 stundām</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              Skatīt visas aktivitātes
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sistēmas statuss</CardTitle>
            <CardDescription>Platformas pakalpojumu statuss</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Mājas lapa</span>
              </div>
              <span className="text-xs font-medium text-green-500">Darbojas</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Autentifikācija</span>
              </div>
              <span className="text-xs font-medium text-green-500">Darbojas</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Datubāze</span>
              </div>
              <span className="text-xs font-medium text-green-500">Darbojas</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">E-pasta pakalpojums</span>
              </div>
              <span className="text-xs font-medium text-yellow-500">Daļēji darbojas</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              Pārbaudīt visus pakalpojumus
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ātrās darbības</CardTitle>
            <CardDescription>Biežāk izmantotās administratora funkcijas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Pārvaldīt lietotājus
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Sūtīt ziņojumu abonentiem
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Ticket className="mr-2 h-4 w-4" />
              Pārvaldīt biļetes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
