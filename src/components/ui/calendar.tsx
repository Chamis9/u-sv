
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { lv } from 'date-fns/locale';
import { useLanguage } from "@/features/language";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage.code === 'lv' ? lv : undefined;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      locale={locale}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-ticket-text",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100 border-ticket-accent/50 text-ticket-text"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-ticket-accent font-medium rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium aria-selected:opacity-100 text-ticket-text hover:bg-ticket-accent hover:text-ticket-bg"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-ticket-accent text-ticket-bg hover:bg-ticket-accent hover:text-ticket-bg focus:bg-ticket-accent focus:text-ticket-bg font-bold",
        day_today: "bg-ticket-text/10 text-ticket-accent font-semibold",
        day_outside:
          "day-outside text-ticket-text/50 opacity-50 aria-selected:bg-accent/50 aria-selected:text-ticket-text aria-selected:opacity-40",
        day_disabled: "text-ticket-text/30 opacity-50",
        day_range_middle:
          "aria-selected:bg-accent/20 aria-selected:text-ticket-accent",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-ticket-accent" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-ticket-accent" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
