
import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  UserPlus, 
  Filter, 
  Edit, 
  Trash, 
  MoreHorizontal, 
  CheckCircle,
  XCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Piemēra lietotāju dati
const USERS = [
  { 
    id: 1, 
    name: "Jānis Bērziņš", 
    email: "janis.berzins@example.com", 
    role: "admin", 
    status: "active",
    joinDate: "2023-05-12" 
  },
  { 
    id: 2, 
    name: "Anna Liepiņa", 
    email: "anna.liepina@example.com", 
    role: "user", 
    status: "active",
    joinDate: "2023-08-22" 
  },
  { 
    id: 3, 
    name: "Pēteris Ozols", 
    email: "peteris.ozols@example.com", 
    role: "user", 
    status: "inactive",
    joinDate: "2023-09-05" 
  },
];

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(USERS);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredUsers(USERS);
    } else {
      const filtered = USERS.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) || 
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lietotāju pārvaldība</h1>
        <p className="text-muted-foreground">Pārvaldiet platformas lietotājus un to lomas</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Meklēt lietotājus..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrēt
          </Button>
          
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Pievienot lietotāju
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vārds</TableHead>
              <TableHead>E-pasts</TableHead>
              <TableHead>Loma</TableHead>
              <TableHead>Statuss</TableHead>
              <TableHead>Pievienošanās datums</TableHead>
              <TableHead className="text-right">Darbības</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge variant="default">Administrators</Badge>
                    ) : (
                      <Badge variant="outline">Lietotājs</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">Aktīvs</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400">Neaktīvs</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString("lv-LV")}</TableCell>
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
                          <Edit className="h-4 w-4 mr-2" />
                          Rediģēt
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {user.status === "active" ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Deaktivizēt
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aktivizēt
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
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
                <TableCell colSpan={6} className="text-center py-6">
                  Nav atrasts neviens lietotājs, kas atbilst meklēšanas kritērijiem.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
