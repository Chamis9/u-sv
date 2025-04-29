
import React from "react";
import { useLanguage } from "@/features/language";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface PurchasedTicket {
  id: string;
  tickets: {
    event_id: string;
    price: number;
  };
  purchase_date: string;
}

interface PurchasedTicketsTableProps {
  purchases: PurchasedTicket[];
}

export const PurchasedTicketsTable: React.FC<PurchasedTicketsTableProps> = ({ purchases }) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Notikums", "Event")}</TableHead>
          <TableHead>{t("Cena", "Price")}</TableHead>
          <TableHead>{t("Iegādes datums", "Purchase date")}</TableHead>
          <TableHead>{t("Statuss", "Status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell className="font-medium">
              Event ID: {purchase.tickets.event_id.substring(0, 8)}...
            </TableCell>
            <TableCell>€{purchase.tickets.price.toFixed(2)}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(purchase.purchase_date), { addSuffix: true })}</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {t("Iegādāta", "Purchased")}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
