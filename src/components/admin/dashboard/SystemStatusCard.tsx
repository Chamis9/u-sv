
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle, AlertCircle } from "lucide-react";
import { useAdminTranslations } from "@/hooks/useAdminTranslations";

export function SystemStatusCard() {
  const { t } = useAdminTranslations();
  
  const services = [
    { 
      name: t('Mājas lapa', 'Homepage'), 
      status: 'operational' 
    },
    { 
      name: t('Autentifikācija', 'Authentication'), 
      status: 'operational' 
    },
    { 
      name: t('Datubāze', 'Database'), 
      status: 'operational' 
    },
    { 
      name: t('E-pasta pakalpojums', 'Email Service'), 
      status: 'partially' 
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Sistēmas statuss', 'System Status')}</CardTitle>
        <CardDescription>{t('Platformas pakalpojumu statuss', 'Status of platform services')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <div className="flex items-center justify-between" key={service.name}>
            <div className="flex items-center gap-2">
              {service.status === 'operational' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-sm">{service.name}</span>
            </div>
            <span className="text-xs font-medium text-green-500">
              {service.status === 'operational' 
                ? t('Darbojas', 'Operational') 
                : t('Daļēji darbojas', 'Partially Operational')}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          {t('Pārbaudīt visus pakalpojumus', 'Check all services')}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
