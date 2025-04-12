
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Save,
  Loader2
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { currentLanguage, translations } = useLanguage();
  const t = translations.admin?.subscribers || {};
  
  const handleEditClick = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
    setEditedEmail(subscriber.email || "");
    setDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingSubscriber && editedEmail.trim() !== "") {
      setIsProcessing(true);
      try {
        await onUpdate(editingSubscriber.id, editedEmail);
        setDialogOpen(false);
      } finally {
        setIsProcessing(false);
        setEditingSubscriber(null);
      }
    }
  };

  const handleDeleteClick = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (subscriberToDelete) {
      setIsProcessing(true);
      try {
        await onDelete(subscriberToDelete.id);
        setDeleteDialogOpen(false);
      } finally {
        setIsProcessing(false);
        setSubscriberToDelete(null);
      }
    }
  };

  return (
    <>
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
                        <DropdownMenuItem onClick={() => handleEditClick(subscriber)}>
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
                          onClick={() => handleDeleteClick(subscriber)}
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

      {/* Edit Subscriber Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editTitle || 'Edit Subscriber'}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <label htmlFor="email" className="text-sm font-medium mb-2 block">
              {t.emailAddress || 'Email Address'}
            </label>
            <Input
              id="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="example@example.com"
              disabled={isProcessing}
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isProcessing}>{t.cancel || 'Cancel'}</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit} disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.saving || 'Saving...'}
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t.save || 'Save'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDeleteTitle || 'Confirm Deletion'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.confirmDelete || 'Are you sure you want to delete this subscriber?'} 
              {subscriberToDelete && (
                <span className="font-medium block mt-2">
                  {subscriberToDelete.email}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              {t.cancel || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.deleting || 'Deleting...'}
                </span>
              ) : (
                t.delete || 'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
