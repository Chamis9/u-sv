
import { z } from "zod";

export const ticketFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  price: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Price must be a valid number greater than 0" }
  ),
  quantity: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(parseInt(val)) > 0,
    { message: "Quantity must be a valid number greater than 0" }
  ).default("1"),
  pricePerUnit: z.string().refine(
    (val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0),
    { message: "Price per unit must be a valid number greater than or equal to 0" }
  ).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  eventDate: z.date().optional(),
  eventTime: z.string().optional(),
  venue: z.string().optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
