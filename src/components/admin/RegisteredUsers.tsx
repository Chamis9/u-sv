
import React, { useEffect } from "react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { EmptyOrErrorState } from "@/components/admin/users/EmptyOrErrorState";
import { UserListHeader } from "@/components/admin/users/UserListHeader";
import { UserListTable } from "@/components/admin/users/UserListTable";
import { User } from "@/types/users";
import { useToast } from "@/components/ui/use-toast";
import { downloadUsersCSV, downloadBlob } from "@/utils/userUtils";

export function RegisteredUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();

  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Funkcija, lai ielādētu lietotājus no registered_users tabulas
  const fetchRegisteredUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Iegūt lietotājus no registered_users tabulas
      const { data, error } = await supabase
        .from('registered_users')
        .select('*');
        
      if (error) {
        console.error("Error fetching registered users:", error);
        setError(t('Neizdevās ielādēt lietotājus. Lūdzu, mēģiniet vēlreiz.', 
                   'Failed to load users. Please try again.'));
        setUsers([]);
        setFilteredUsers([]);
      } else {
        console.log("Received registered user data:", data);
        
        // Pārveidot datus User formātā
        const formattedUsers: User[] = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          updated_at: user.updated_at,
          role: 'user',
          status: user.status || 'active'
        }));
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        
        // Atjaunināt lietotāju skaitu
        const event = new CustomEvent('userCountUpdated', { 
          detail: { count: formattedUsers.length } 
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error("Unexpected error in fetchRegisteredUsers:", err);
      setError(t('Neizdevās ielādēt lietotājus. Lūdzu, mēģiniet vēlreiz.', 
               'Failed to load users. Please try again.'));
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sākotnējā ielāde
  useEffect(() => {
    fetchRegisteredUsers();
  }, []);

  // Meklēšanas apstrāde
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerSearchTerm = term.toLowerCase();
      const filtered = users.filter(user => 
        user.email?.toLowerCase().includes(lowerSearchTerm) ||
        user.id.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  };

  // CSV eksportēšana
  const handleDownloadCSV = () => {
    if (!users || users.length === 0) {
      toast({
        description: t('Nav lietotāju, ko lejupielādēt', 'No users to download'),
      });
      return;
    }

    try {
      const { blob, filename } = downloadUsersCSV(users, currentLanguage);
      downloadBlob(blob, filename);
      
      toast({
        description: t('CSV fails veiksmīgi lejupielādēts', 'CSV file downloaded successfully'),
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast({
        variant: "destructive",
        description: t('Kļūda lejupielādējot failu', 'Error downloading file'),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('Lietotāju pārvaldība', 'User Management')}</h1>
        <p className="text-muted-foreground">{t('Pārvaldiet platformas lietotājus', 'Manage platform users')}</p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={fetchRegisteredUsers}
          variant="outline"
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('Atjaunot datus no datubāzes', 'Refresh Data from Database')}
        </Button>
      </div>
      
      {isLoading ? (
        <EmptyOrErrorState 
          isLoading={true} 
          error=""
        />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 dark:bg-red-900/20 dark:text-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">{t('Datu ielādes kļūda', 'Data Loading Error')}</h3>
          </div>
          <p className="mt-2 text-sm">{error}</p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRegisteredUsers}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('Mēģināt vēlreiz', 'Try Again')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <UserListHeader 
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onDownloadCSV={handleDownloadCSV}
          />
          
          {filteredUsers.length === 0 && searchTerm ? (
            <EmptyOrErrorState 
              isLoading={false} 
              error=""
              searchTerm={searchTerm} 
            />
          ) : filteredUsers.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-center">
              <div>
                <p className="text-muted-foreground">
                  {t('Nav neviena lietotāja. Lietotāji tiks pievienoti, kad tie reģistrēsies platformā.', 
                    'No users yet. Users will be added when they register on the platform.')}
                </p>
                <Button className="mt-4" variant="outline" onClick={fetchRegisteredUsers}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('Atsvaidzināt datus', 'Refresh Data')}
                </Button>
              </div>
            </div>
          ) : (
            <UserListTable users={filteredUsers} />
          )}
        </>
      )}
    </div>
  );
}
