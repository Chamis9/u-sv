
import { z } from "zod";

export const ticketFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  price: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Price must be a valid number greater than 0" }
  ),
  description: z.string().optional(),
  category: z.string().optional(),
  eventDate: z.date().optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
