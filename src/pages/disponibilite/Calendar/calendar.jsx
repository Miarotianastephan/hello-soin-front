import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import clsx from "clsx";

dayjs.locale("fr");

const today = dayjs().startOf("day");

const Calendar = ({ selectedDates, setSelectedDates, availability = {} }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1300); // Mobile et tablette en dessous de 768px
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleDateClick = (date) => {
    if (date.isBefore(today, "day")) return;
    const dateKey = date.format("YYYY-MM-DD");
    setSelectedDates((prev) =>
      prev.includes(dateKey) ? prev.filter((d) => d !== dateKey) : [...prev, dateKey]
    );
  };

  const handleNextMonth = () => setCurrentMonthIndex((prev) => prev + 1);
  const handlePrevMonth = () => setCurrentMonthIndex((prev) => Math.max(prev - 1, 0));

  const renderMonth = useMemo(() => {
    const startOfMonth = dayjs().add(currentMonthIndex, "month").startOf("month");
    const daysInMonth = startOfMonth.daysInMonth();
    const firstDayOfWeek = (startOfMonth.day() + 6) % 7;

    const days = Array(firstDayOfWeek).fill(null).map((_, i) => (
      <div key={`empty-${i}`} className="w-10 h-10" />
    ));

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = startOfMonth.date(i);
      const dateKey = currentDate.format("YYYY-MM-DD");
      const isSelected = selectedDates.includes(dateKey);
      const hasAvailability = (availability?.[dateKey] || []).length > 0;
      const isPast = currentDate.isBefore(today, "day");

      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(currentDate)}
          disabled={isPast}
          className={clsx(
            "w-10 h-10 flex items-center justify-center rounded-md",
            isSelected ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200",
            hasAvailability && "border border-green-500",
            isPast ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
          )}
          aria-label={`Sélectionner le ${currentDate.format("DD MMMM YYYY")}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="mr-4 md:mr-20 mb-4 md:mb-20">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handlePrevMonth} disabled={currentMonthIndex === 0} aria-label="Mois précédent">
            <ChevronLeft size={20} />
          </Button>
          <h2 className="text-lg font-bold">{startOfMonth.format("MMMM YYYY")}</h2>
          <Button variant="ghost" onClick={handleNextMonth} aria-label="Mois suivant">
            <ChevronRight size={20} />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
            <div key={index} className="text-gray-700 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">{days}</div>
      </div>
    );
  }, [currentMonthIndex, selectedDates, availability]);

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 mb-5">
            <CalendarIcon size={20} />
            Ouvrir le calendrier
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-4">Sélectionnez vos dates</h2>
          {renderMonth}
        </DialogContent>
      </Dialog>
    );
  }

  return <div className="flex justify-center mt-4">{renderMonth}</div>;
};

export default Calendar;
