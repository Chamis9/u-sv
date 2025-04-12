
import React, { useState, useEffect } from "react";
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
import { Mail, Users, Ticket, AlertCircle, Settings, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityType } from "@/utils/activityLogger";

export type Activity = {
  id: string;
  activity_type: string; // Changed from ActivityType to string to match database type
  description: string;
  email?: string | null;
  created_at: string;
  metadata?: Record<string, any> | null;
};

type ActivityLogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActivityLogModal({ open, onOpenChange }: ActivityLogModalProps) {
  const { currentLanguage, translations } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
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
  
  // Fetch activities from the database
  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from('activity_log')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw countError;
      }
      
      if (count !== null) {
        setTotalCount(count);
      }
      
      // Get activities for current page
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        throw error;
      }
      
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(t(
        'Neizdevās ielādēt aktivitātes. Lūdzu, mēģiniet vēlreiz.', 
        'Failed to load activities. Please try again.',
        'Не удалось загрузить действия. Пожалуйста, попробуйте еще раз.'
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch activities when modal opens or page changes
  useEffect(() => {
    if (open) {
      fetchActivities();
    }
  }, [open, currentPage]);
  
  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Render activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscriber':
        return <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'user':
        return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'ticket':
        return <Ticket className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case 'login':
        return <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    }
  };
  
  // Translate activity type
  const translateActivityType = (type: string) => {
    switch (type) {
      case 'subscriber':
        return t('Jauns e-pasta abonents', 'New email subscriber');
      case 'user':
        return t('Jauns lietotājs', 'New user registered');
      case 'ticket':
        return t('Jauna biļete', 'New support ticket created');
      case 'system':
        return t('Sistēmas atjauninājums', 'System update completed');
      case 'login':
        return t('Pieteikšanās', 'Login', 'Вход в систему');
      case 'logout':
        return t('Izrakstīšanās', 'Logout', 'Выход из системы');
      case 'settings':
        return t('Iestatījumu izmaiņas', 'Settings changed', 'Изменение настроек');
      default:
        return type;
    }
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
          <DialogTitle>
            {t('Aktivitāšu žurnāls', 'Activity Log', 'Журнал активности')}
          </DialogTitle>
          <DialogDescription>
            {t('Platformas lietotāju aktivitātes', 'User activities on the platform', 'Действия пользователей на платформе')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-auto flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : activities.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              {t('Nav aktivitāšu', 'No activities', 'Нет активностей')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>
                    {t('Darbība', 'Activity', 'Действие')}
                  </TableHead>
                  <TableHead>
                    {t('Detaļas', 'Details', 'Детали')}
                  </TableHead>
                  <TableHead>
                    {t('Laiks', 'Time', 'Время')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {translateActivityType(activity.activity_type)}
                    </TableCell>
                    <TableCell>
                      {activity.description}
                      {activity.email && (
                        <div className="text-sm text-muted-foreground">{activity.email}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(activity.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                {renderPaginationLinks()}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
