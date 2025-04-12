
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Mail, 
  Trash, 
  Edit,
  Save
} from "lucide-react";
import { useLanguage } from "@/features/language";
import { Subscriber } from "@/hooks/useSubscribers";

interface SubscriberListTableProps {
  subscribers: Subscriber[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, email: string) => Promise<void>;
}

export function SubscriberListTable({ subscribers, onDelete, onUpdate }: SubscriberListTableProps) {
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { currentLanguage } = useLanguage();
  
  // Translation helper
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const handleEditClick = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
    setEditedEmail(subscriber.email);
    setDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingSubscriber && editedEmail.trim() !== "") {
      await onUpdate(editingSubscriber.id, editedEmail);
      setDialogOpen(false);
      setEditingSubscriber(null);
    }
  };

  return (
    <>
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
                        <DropdownMenuItem onClick={() => handleEditClick(subscriber)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('Rediģēt', 'Edit')}
                        </DropdownMenuItem>
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
                  {t('Nav atrasts neviens abonents.', 'No subscribers found.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Subscriber Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Rediģēt abonentu', 'Edit Subscriber')}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <label htmlFor="email" className="text-sm font-medium mb-2 block">
              {t('E-pasta adrese', 'Email Address')}
            </label>
            <Input
              id="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="example@example.com"
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('Atcelt', 'Cancel')}</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-2" />
              {t('Saglabāt', 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
