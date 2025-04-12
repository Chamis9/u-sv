
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

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        // Šeit izmantojam newsletter_subscribers tabulu, kas ir definēta Supabase
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setSubscribers(data || []);
        setFilteredSubscribers(data || []);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
        setError('Neizdevās ielādēt abonentus. Lūdzu, mēģiniet vēlreiz.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscribers();
  }, []);

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
        description: "Abonents veiksmīgi dzēsts",
      });
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      toast({
        variant: "destructive",
        description: "Neizdevās dzēst abonentu. Lūdzu, mēģiniet vēlreiz.",
      });
    }
  };

  const handleDownloadCSV = () => {
    // Izveidojam CSV saturu
    const csvContent = [
      ['ID', 'E-pasts', 'Pievienošanās datums'],
      ...subscribers.map(sub => [
        sub.id, 
        sub.email, 
        new Date(sub.created_at).toLocaleDateString('lv-LV')
      ])
    ]
    .map(row => row.join(','))
    .join('\n');
    
    // Izveidojam lejupielādes saiti
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `abonenti_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      description: "Abonentu saraksts lejupielādēts",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">E-pasta abonenti</h1>
        <p className="text-muted-foreground">Pārvaldiet jūsu jaunumu abonentu sarakstu</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Meklēt e-pasta adreses..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            Eksportēt CSV
          </Button>
          
          <Button size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Sūtīt ziņojumu
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
              Mēģināt vēlreiz
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>E-pasts</TableHead>
                <TableHead>Pievienošanās datums</TableHead>
                <TableHead className="text-right">Darbības</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map(subscriber => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.id}</TableCell>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      {new Date(subscriber.created_at).toLocaleDateString("lv-LV")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Izvēlne</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Sūtīt e-pastu
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteSubscriber(subscriber.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Dzēst
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
                      "Nav atrasts neviens abonents, kas atbilst meklēšanas kritērijiem." : 
                      "Nav atrasts neviens abonents."}
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
