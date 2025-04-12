
import React, { useState } from "react";
import { SubscriberTable } from "./SubscriberTable";
import { EditSubscriberDialog } from "./EditSubscriberDialog";
import { DeleteSubscriberDialog } from "./DeleteSubscriberDialog";
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
      <SubscriberTable 
        subscribers={subscribers}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        isProcessing={isProcessing}
      />

      <EditSubscriberDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subscriber={editingSubscriber}
        email={editedEmail}
        onEmailChange={setEditedEmail}
        onSave={handleSaveEdit}
        isProcessing={isProcessing}
      />

      <DeleteSubscriberDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        subscriber={subscriberToDelete}
        onConfirm={handleDeleteConfirm}
        isProcessing={isProcessing}
      />
    </>
  );
}
