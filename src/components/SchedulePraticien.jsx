import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const SchedulePraticien = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    backgroundColor: 'bg-blue-500',
    textColor: 'text-white',
  });

  const backgroundColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
  ];

  const textColors = [
    'text-white',
    'text-black',
    'text-blue-500',
    'text-green-500',
    'text-red-500',
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setIsAddEventOpen(true);
    }
  };

  const handleAddEvent = () => {
    if (selectedDate && newEvent.title) {
      const event = {
        ...newEvent,
        date: selectedDate,
      };
      setEvents([...events, event]);
      setIsAddEventOpen(false);
      setNewEvent({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        backgroundColor: 'bg-blue-500',
        textColor: 'text-white',
      });
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Calendrier des rendez-vous</CardTitle>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setIsAddEventOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center font-medium bg-gray-50">
              {day}
            </div>
          ))}
          {days.map((date, index) => (
            <div
              key={index}
              className={`min-h-24 p-1 border ${
                date ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-100'
              }`}
              onClick={() => handleDateClick(date)}
            >
              {date && (
                <>
                  <div className="text-sm font-medium">{date.getDate()}</div>
                  <div className="space-y-1">
                    {events
                      .filter(
                        (event) =>
                          event.date.toDateString() === date.toDateString()
                      )
                      .map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`${event.backgroundColor} ${event.textColor} p-1 rounded text-xs`}
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heure de début</Label>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Couleur de fond</Label>
              <RadioGroup
                value={newEvent.backgroundColor}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, backgroundColor: value })
                }
                className="flex flex-wrap gap-2"
              >
                {backgroundColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={color}
                      id={color}
                      className={color}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddEvent}>Ajouter</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SchedulePraticien;