
import { z } from "zod";

export const ticketFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  venue: z.string().optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  pricePerUnit: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Price per unit must be a valid number greater than 0" }
  ),
  quantity: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(parseInt(val)) > 0,
    { message: "Quantity must be a valid number greater than 0" }
  ).default("1"),
  price: z.string().refine(
    (val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0),
    { message: "Price must be a valid number greater than or equal to 0" }
  ),
  file: z.any().optional(),
}).refine(data => {
  // Set price to be pricePerUnit * quantity if both are valid numbers
  if (!isNaN(Number(data.pricePerUnit)) && !isNaN(Number(data.quantity))) {
    data.price = (Number(data.pricePerUnit) * Number(data.quantity)).toString();
    return true;
  }
  return true;
}, {
  message: "Invalid price calculation",
  path: ["price"]
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
