
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Mail, 
  Download,
  Trash, 
  MoreHorizontal, 
  AlertCircle,
  Loader
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useLanguage } from "@/features/language";

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export function AdminSubscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { translations, currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching subscribers from Supabase...");
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Subscribers data received:", data);
        setSubscribers(data || []);
        setFilteredSubscribers(data || []);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError(currentLanguage.code === 'lv' 
          ? 'Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.' 
          : 'Failed to load subscribers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscribers();
  }, [currentLanguage.code]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredSubscribers(subscribers);
    } else {
      const filtered = subscribers.filter(subscriber => 
        subscriber.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      setFilteredSubscribers(filteredSubscribers.filter(sub => sub.id !== id));
      
      toast({
        description: currentLanguage.code === 'lv' 
          ? "Abonents veiksmīgi dzēsts" 
          : "Subscriber successfully deleted",
      });
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      toast({
        variant: "destructive",
        description: currentLanguage.code === 'lv'
          ? "Neizdevās dzēst abonentu. Lūdzu, mēģiniet vēlreiz."
          : "Failed to delete subscriber. Please try again.",
      });
    }
  };

  const handleDownloadCSV = () => {
    // Create CSV content
    const csvContent = [
      [
        currentLanguage.code === 'lv' ? 'ID' : 'ID', 
        currentLanguage.code === 'lv' ? 'E-pasts' : 'Email', 
        currentLanguage.code === 'lv' ? 'Pievienošanās datums' : 'Join Date'
      ],
      ...subscribers.map(sub => [
        sub.id, 
        sub.email, 
        new Date(sub.created_at).toLocaleDateString(currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
      ])
    ]
    .map(row => row.join(','))
    .join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentLanguage.code === 'lv' ? 'abonenti' : 'subscribers'}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      description: currentLanguage.code === 'lv'
        ? "Abonentu saraksts lejupielādēts"
        : "Subscribers list downloaded",
    });
  };

  // Translation helper function
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('E-pasta abonenti', 'Email Subscribers')}</h1>
        <p className="text-muted-foreground">{t('Pārvaldiet jūsu jaunumu abonentu sarakstu', 'Manage your newsletter subscriber list')}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('Meklēt e-pasta adreses...', 'Search email addresses...')}
            className="w-full pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            {t('Eksportēt CSV', 'Export CSV')}
          </Button>
          
          <Button size="sm">
            <Mail className="h-4 w-4 mr-2" />
            {t('Sūtīt ziņojumu', 'Send Message')}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-center">
          <div>
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
              {t('Mēģināt vēlreiz', 'Try Again')}
            </Button>
          </div>
        </div>
      ) : (
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
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map(subscriber => (
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
                            onClick={() => handleDeleteSubscriber(subscriber.id)}
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
                    {searchTerm ? 
                      t('Nav atrasts neviens abonents, kas atbilst meklēšanas kritērijiem.', 'No subscribers found matching your search criteria.') : 
                      t('Nav atrasts neviens abonents.', 'No subscribers found.')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
