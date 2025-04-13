
import { useState, useCallback, useMemo, useEffect } from "react";
import { User } from "@/types/users";

export interface UserFilters {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin: string;
}

const initialFilters: UserFilters = {
  name: "",
  email: "",
  phone: "",
  role: "",
  status: "",
  joinDate: "",
  lastLogin: ""
};

export function useUserFiltering(users: User[], searchTerm: string) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UserFilters>(initialFilters);

  // Handle opening filter dialog
  const handleOpenFilter = useCallback(() => {
    setIsFilterDialogOpen(true);
  }, []);

  // Handle applying filter
  const handleApplyFilter = useCallback((filters: UserFilters) => {
    setActiveFilters(filters);
    setPage(1);
  }, []);

  // Handle removing a single filter
  const handleRemoveFilter = useCallback((key: keyof UserFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: ""
    }));
    setPage(1);
  }, []);

  // Handle clearing all filters
  const handleClearFilters = useCallback(() => {
    setActiveFilters(initialFilters);
    setPage(1);
  }, []);

  // Filter users based on active filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Check each filter criteria
      if (activeFilters.name && !user.name?.toLowerCase().includes(activeFilters.name.toLowerCase())) {
        return false;
      }
      if (activeFilters.email && !user.email?.toLowerCase().includes(activeFilters.email.toLowerCase())) {
        return false;
      }
      if (activeFilters.phone && !user.phone?.toLowerCase().includes(activeFilters.phone.toLowerCase())) {
        return false;
      }
      if (activeFilters.role && user.role !== activeFilters.role) {
        return false;
      }
      if (activeFilters.status && user.status !== activeFilters.status) {
        return false;
      }
      // More filters can be added as needed
      
      return true;
    });
  }, [users, activeFilters]);
  
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  
  // Get current page of users
  const currentUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredUsers, page, pageSize]);
  
  // Reset to first page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeFilters]);

  return {
    page,
    setPage,
    pageSize,
    totalPages,
    isFilterDialogOpen,
    setIsFilterDialogOpen,
    activeFilters,
    filteredUsers,
    currentUsers,
    handleOpenFilter,
    handleApplyFilter,
    handleRemoveFilter,
    handleClearFilters
  };
}
