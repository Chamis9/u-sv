
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Mail, 
  Trash, 
  Edit 
} from "lucide-react";
import { useLanguage } from "@/features/language";
import { Subscriber } from "@/hooks/useSubscribers";

interface SubscriberTableProps {
  subscribers: Subscriber[];
  onEditClick: (subscriber: Subscriber) => void;
  onDeleteClick: (subscriber: Subscriber) => void;
  isProcessing: boolean;
}

export function SubscriberTable({ 
  subscribers, 
  onEditClick, 
  onDeleteClick,
  isProcessing 
}: SubscriberTableProps) {
  const { currentLanguage, translations } = useLanguage();
  const t = translations.admin?.subscribers || {};
  
  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>{t.email || 'Email'}</TableHead>
            <TableHead>{t.joinDate || 'Join Date'}</TableHead>
            <TableHead className="text-right">{t.actions || 'Actions'}</TableHead>
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
                      <Button variant="ghost" size="icon" disabled={isProcessing}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t.menu || 'Menu'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditClick(subscriber)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t.edit || 'Edit'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        {t.sendMessage || 'Send Email'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500"
                        onClick={() => onDeleteClick(subscriber)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        {t.delete || 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                {t.noData || 'No subscribers found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
