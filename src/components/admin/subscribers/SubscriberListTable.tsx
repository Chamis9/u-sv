
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Trash } from "lucide-react";
import { useLanguage } from "@/features/language";

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

interface SubscriberListTableProps {
  subscribers: Subscriber[];
  onDelete: (id: number) => Promise<void>;
}

export function SubscriberListTable({ subscribers, onDelete }: SubscriberListTableProps) {
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>{t('E-pasts', 'Email')}</TableHead>
            <TableHead>{t('Pievienošanās datums', 'Join Date')}</TableHead>
            <TableHead className="text-right">{t('Darbības', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.length > 0 ? (
            subscribers.map(subscriber => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.id}</TableCell>
                <TableCell className="font-medium">{subscriber.email}</TableCell>
                <TableCell>
                  {new Date(subscriber.created_at).toLocaleDateString(currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t('Izvēlne', 'Menu')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        {t('Sūtīt e-pastu', 'Send Email')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => onDelete(subscriber.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        {t('Dzēst', 'Delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                {/* The empty state message */}
                {t('Nav atrasts neviens abonents.', 'No subscribers found.')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
