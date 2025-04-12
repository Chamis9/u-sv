
import React, { useState } from "react";
import { useLanguage } from "@/features/language";
import { formatDistanceToNow } from "date-fns";
import { lv, enUS, ru } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Mail, Users, Ticket, AlertCircle } from "lucide-react";

// Mock data for activities - in a real application, this would come from an API
export type Activity = {
  id: string;
  type: 'subscriber' | 'user' | 'ticket' | 'system';
  message: string;
  email?: string;
  timestamp: string;
};

// Generate mock data
const generateMockActivities = (count: number): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const activityType = ['subscriber', 'user', 'ticket', 'system'][Math.floor(Math.random() * 4)] as Activity['type'];
    const timestamp = new Date(now.getTime() - i * 3600000 * (Math.random() * 24 + 1)).toISOString();
    
    let activity: Activity = {
      id: `activity-${i}`,
      type: activityType,
      message: '',
      timestamp
    };
    
    switch (activityType) {
      case 'subscriber':
        activity.message = 'New email subscriber';
        activity.email = `user${i}@example.com`;
        break;
      case 'user':
        activity.message = 'New user registered';
        break;
      case 'ticket':
        activity.message = 'New support ticket created';
        break;
      case 'system':
        activity.message = 'System update completed';
        break;
    }
    
    activities.push(activity);
  }
  
  return activities;
};

// Mock activities data - 30 items
const mockActivities = generateMockActivities(30);

type ActivityLogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActivityLogModal({ open, onOpenChange }: ActivityLogModalProps) {
  const { currentLanguage, translations } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Translation helper
  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };
  
  // Get date-fns locale based on current language
  const getLocale = () => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'ru': return ru;
      default: return enUS;
    }
  };
  
  // Format relative time with proper localization
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: getLocale()
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return t('Pirms brīža', 'Recently', 'Недавно');
    }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(mockActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = mockActivities.slice(startIndex, endIndex);
  
  // Render activity icon based on type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'subscriber':
        return <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'user':
        return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'ticket':
        return <Ticket className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const renderPaginationLinks = () => {
    const links = [];
    
    // Add previous page link
    links.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    // Add page number links
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        links.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) || 
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        links.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationLink className="pointer-events-none">
              ...
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Add next page link
    links.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    return links;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('Aktivitāšu žurnāls', 'Activity Log', 'Журнал активности')}</DialogTitle>
          <DialogDescription>
            {t('Platformas lietotāju aktivitātes', 'User activities on the platform', 'Действия пользователей на платформе')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-auto flex-grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>{t('Darbība', 'Activity', 'Действие')}</TableHead>
                <TableHead>{t('Detaļas', 'Details', 'Детали')}</TableHead>
                <TableHead>{t('Laiks', 'Time', 'Время')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                      {getActivityIcon(activity.type)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {t(
                      activity.type === 'subscriber' ? 'Jauns e-pasta abonents' : 
                      activity.type === 'user' ? 'Jauns lietotājs' :
                      activity.type === 'ticket' ? 'Jauna biļete' : 'Sistēmas atjauninājums',
                      activity.message
                    )}
                  </TableCell>
                  <TableCell>
                    {activity.email && (
                      <span className="text-sm text-muted-foreground">{activity.email}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              {renderPaginationLinks()}
            </PaginationContent>
          </Pagination>
        </div>
      </DialogContent>
    </Dialog>
  );
}
