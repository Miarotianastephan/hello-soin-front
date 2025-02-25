import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { useEffect, useState } from "react";

function YearMonthSelector({ month, year, fromYear, toYear, onMonthChange, onYearChange }) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: format(new Date(2000, i, 1), "LLLL", { locale: fr }),
    value: i,
  }));

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => ({
    label: (fromYear + i).toString(),
    value: fromYear + i,
  }));

  return (
    <div className="flex items-center justify-between p-2">
      <Button variant="ghost" size="icon" onClick={() => onMonthChange(month - 1 >= 0 ? month - 1 : 11)}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="flex flex-col gap-1 items-center">
        {/* Sélecteur de Mois */}
        <Select value={month.toString()} onValueChange={(val) => onMonthChange(Number(val))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Sélecteur d'Année */}
        <Select value={year.toString()} onValueChange={(val) => onYearChange(Number(val))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {years.map((y) => (
                <SelectItem key={y.value} value={y.value.toString()}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onMonthChange(month + 1 <= 11 ? month + 1 : 0)}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

function DatePicker({ control, name }) {
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 100;
  const toYear = currentYear + 10;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        if(typeof(value) === "string"){
          value = new Date(value);
        }else{
          value = value ?? new Date();
        }
        // A verifier puisqu'il y a un re render
        const [selectedMonth, setSelectedMonth] = useState(value ? value.getMonth() : new Date().getMonth());
        const [selectedYear, setSelectedYear] = useState(value ? value.getFullYear() : currentYear);
        
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "p-4 w-full flex text-muted-foreground justify-start text-left font-normal border border-gray-400 hover:shadow-none shadow-none bg-white",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "dd/MM/yyyy", { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
              locale={fr}
              captionLayout="dropdown-buttons"
              fromDate={new Date(fromYear, 0, 1)}
              toDate={new Date(toYear, 11, 31)}
              month={new Date(selectedYear, selectedMonth, 1)}
              components={{
                Caption: () => (
                  <YearMonthSelector
                    month={selectedMonth}
                    year={selectedYear}
                    fromYear={fromYear}
                    toYear={toYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                  />
                ),
              }}
            />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}

export default DatePicker;
