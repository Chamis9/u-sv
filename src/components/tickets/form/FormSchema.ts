
import * as z from "zod";

export const ticketFormSchema = z.object({
  event_id: z.string().min(1, "Event selection is required"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, "Price must be positive")
  ),
  seat_info: z.string().optional(),
  description: z.string().optional(),
  ticketFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size < 5 * 1024 * 1024; // 5MB limit
    }, "File must be less than 5MB"),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
