// src/components/GeneralEntreDates.jsx
import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SaveIcon, PlusCircle, Trash2, Check, CalendarClock, Ban, InfoIcon } from 'lucide-react';
import { parse, isBefore, eachDayOfInterval, format, addMinutes } from 'date-fns';
import { Button } from '@/components/ui/button';
import ErrorDialog from './dialogs/ErrorDialog';
import SuccessDialog from './dialogs/SuccessDialog';
import OverwriteDialog from './dialogs/OverwriteDialog';
import PracticeDialog from './dialogs/PracticeDialog';
import { getDurationInMinutes, getColorByType, getDateFromTime } from './utils/scheduleUtils';
import BASE_URL from '@/pages/config/baseurl';

class GeneralEntreDates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      days: [],
      errorDialog: { isOpen: false, message: '' },
      successDialog: { isOpen: false, message: '' },
      practiceDialog: {
        isOpen: false,
        dayIndex: null,
        timeIndex: null,
        practices: [],
        newPractice: { type: 'naturopathie', start: '', end: '', error: '' },
      },
      overwriteDialog: {
        isOpen: false,
        overlappingDates: [],
        appointmentsToOverwrite: []
      },
      pendingPlanningData: null,
    };
  }

  // Calcule les jours disponibles entre deux dates
  computeAvailableDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const interval = eachDayOfInterval({ start, end });
    const availableDayIndices = new Set();
    interval.forEach(date => availableDayIndices.add(date.getDay()));
    const allDays = [
      { name: 'Lundi', index: 1 },
      { name: 'Mardi', index: 2 },
      { name: 'Mercredi', index: 3 },
      { name: 'Jeudi', index: 4 },
      { name: 'Vendredi', index: 5 },
      { name: 'Samedi', index: 6 },
      { name: 'Dimanche', index: 0 },
    ];
    const availableDays = allDays
      .filter(day => availableDayIndices.has(day.index))
      .map(day => ({
        name: day.name,
        index: day.index,
        selected: false,
        times: [],
      }));
    return availableDays;
  };

  handleDateChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleLoadDays = () => {
    const { startDate, endDate } = this.state;
    if (!startDate || !endDate) {
      this.setState({
        errorDialog: { isOpen: true, message: 'Veuillez saisir une date de début et une date de fin.' },
      });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      this.setState({
        errorDialog: { isOpen: true, message: 'La date de début doit être antérieure à la date de fin.' },
      });
      return;
    }
    const days = this.computeAvailableDays(startDate, endDate);
    this.setState({ days });
  };

  handleCheckboxChange = (index) => {
    const newDays = [...this.state.days];
    const isSelected = !newDays[index].selected;
    newDays[index].selected = isSelected;
    if (isSelected) {
      newDays[index].times.push({
        start: '08:00',
        end: '10:00',
        errors: { start: false, end: false },
        practices: [],
      });
      newDays[index].work = true;
    } else {
      newDays[index].times = [];
      delete newDays[index].work;
    }
    this.setState({ days: newDays });
  };

  handleAddTimeSlot = (index) => {
    const newDays = [...this.state.days];
    newDays[index].times.push({
      start: '',
      end: '',
      errors: { start: false, end: false },
      practices: [],
    });
    this.setState({ days: newDays });
  };

  handleRemoveTimeSlot = (dayIndex, timeIndex) => {
    const newDays = [...this.state.days];
    newDays[dayIndex].times.splice(timeIndex, 1);
    this.setState({ days: newDays });
  };

  handleNotWorking = (dayIndex) => {
    const newDays = [...this.state.days];
    newDays[dayIndex].times = [];
    newDays[dayIndex].work = false;
    this.setState({ days: newDays });
  };

  getDateFromTime = (timeStr) => getDateFromTime(timeStr);

  handleTimeChange = (dayIndex, timeIndex, field, value) => {
    const newDays = [...this.state.days];
    const slot = newDays[dayIndex].times[timeIndex];
    slot[field] = value;
    if (slot.errors) slot.errors[field] = false;
    this.setState({ days: newDays });
  };

  validateTimeSlot = (dayIndex, timeIndex, field) => {
    const newDays = [...this.state.days];
    const slot = newDays[dayIndex].times[timeIndex];
    if (slot.start && slot.end && slot.start.length === 5 && slot.end.length === 5) {
      const startTime = this.getDateFromTime(slot.start);
      const endTime = this.getDateFromTime(slot.end);
      let errorMessage = '';
      if (!isBefore(startTime, endTime)) {
        errorMessage = "L'heure de début doit être antérieure à l'heure de fin.";
      } else {
        for (let i = 0; i < newDays[dayIndex].times.length; i++) {
          if (i === timeIndex) continue;
          const otherSlot = newDays[dayIndex].times[i];
          if (otherSlot.start && otherSlot.end && otherSlot.start.length === 5 && otherSlot.end.length === 5) {
            const otherStart = this.getDateFromTime(otherSlot.start);
            const otherEnd = this.getDateFromTime(otherSlot.end);
            if (isBefore(startTime, otherEnd) && isBefore(otherStart, endTime)) {
              errorMessage = 'Chevauchement d’horaires détecté.';
              break;
            }
          }
        }
      }
      if (errorMessage) {
        slot[field] = '';
        slot.errors.start = true;
        slot.errors.end = true;
        this.setState({
          days: newDays,
          errorDialog: { isOpen: true, message: errorMessage },
        });
      }
    }
  };

  validateData = () => {
    const { days } = this.state;
    let isValid = true;
    for (const day of days) {
      if (day.selected) {
        for (const time of day.times) {
          if (!time.start || !time.end) {
            this.setState({
              errorDialog: { isOpen: true, message: 'Veuillez remplir tous les champs de plage horaire.' },
            });
            isValid = false;
            break;
          }
        }
      }
    }
    return isValid;
  };

  buildNewPlanningData = () => {
    const { startDate, endDate, days } = this.state;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const interval = eachDayOfInterval({ start, end });
    const datesWithSlots = [];
    interval.forEach((date) => {
      const matchingDay = days.find(
        (d) => d.index === date.getDay() && d.selected
      );
      if (matchingDay) {
        if (matchingDay.times.length > 0) {
          datesWithSlots.push({
            date: format(date, 'dd-MM-yyyy'),
            dayName: matchingDay.name,
            timeSlots: matchingDay.times,
          });
        } else if (matchingDay.work === false) {
          datesWithSlots.push({
            date: format(date, 'dd-MM-yyyy'),
            dayName: matchingDay.name,
            work: false,
          });
        }
      }
    });
    return {
      startDate,
      endDate,
      days,
      datesWithSlots,
    };
  };

  // La fonction handleSave interroge l'API pour vérifier les dates existantes avant de sauvegarder
  handleSave = () => {
    if (!this.validateData()) return;
    const newPlanning = this.buildNewPlanningData();

    // On interroge l'API pour récupérer la planification existante
    fetch(`${BASE_URL}/specificDates`)
      .then(response => response.json())
      .then(existingDates => {
        // Conversion des dates existantes en format dd-MM-yyyy avec parse()
        const existingDatesFormatted = existingDates.map(entry => {
          const parsedDate = parse(entry.specific_date, 'dd-MM-yyyy', new Date());
          return format(parsedDate, 'dd-MM-yyyy');
        });
        const overlappingDates = newPlanning.datesWithSlots
          .filter(newItem => existingDatesFormatted.includes(newItem.date))
          .map(item => item.date);

        let appointmentsToOverwrite = [];
        const appointmentsStr = localStorage.getItem('appointments');
        if (appointmentsStr) {
          try {
            const appointments = JSON.parse(appointmentsStr);
            appointmentsToOverwrite = appointments
              .filter(app => overlappingDates.includes(app.date))
              .map(app => app.date);
            appointmentsToOverwrite = [...new Set(appointmentsToOverwrite)];
          } catch (err) {
            console.error('Erreur lors du parsing des appointments', err);
          }
        }

        if (overlappingDates.length > 0 || appointmentsToOverwrite.length > 0) {
          this.setState({
            overwriteDialog: {
              isOpen: true,
              overlappingDates,
              appointmentsToOverwrite
            },
            pendingPlanningData: newPlanning,
          });
        } else {
          this.savePlanningData(newPlanning);
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des planning existants:', error);
        this.setState({
          errorDialog: { isOpen: true, message: 'Erreur lors du chargement des planning existants: ' + error.message }
        });
      });
  };

  // Envoi des données vers l'API via POST
  savePlanningData = (newPlanning) => {
    fetch(`${BASE_URL}/specificDates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlanning)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'enregistrement des données');
        }
        return response.json();
      })
      .then(data => {
        console.log('Données enregistrées :', data);
        this.setState({
          successDialog: { isOpen: true, message: 'Enregistré avec succès' },
          overwriteDialog: { isOpen: false, overlappingDates: [] },
          pendingPlanningData: null,
        });
      })
      .catch(error => {
        console.error("Erreur lors de l'enregistrement :", error);
        this.setState({
          errorDialog: { isOpen: true, message: "Erreur lors de l'enregistrement : " + error.message },
        });
      });
  };

  handleConfirmOverwrite = () => {
    const { pendingPlanningData, overwriteDialog: { overlappingDates } } = this.state;
    const appointmentsStr = localStorage.getItem('appointments');
    if (appointmentsStr) {
      try {
        const appointments = JSON.parse(appointmentsStr);
        const filteredAppointments = appointments.filter(app => !overlappingDates.includes(app.date));
        localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
      } catch (err) {
        console.error('Erreur lors de la suppression des appointments', err);
      }
    }
    this.savePlanningData(pendingPlanningData);
  };

  handleCancelOverwrite = () => {
    this.setState({ 
      overwriteDialog: { isOpen: false, overlappingDates: [] }, 
      pendingPlanningData: null 
    });
  };

  openPracticeDialog = (dayIndex, timeIndex) => {
    const timeslot = this.state.days[dayIndex].times[timeIndex];
    const practices = timeslot.practices || [];
    this.setState({
      practiceDialog: {
        isOpen: true,
        dayIndex,
        timeIndex,
        practices,
        newPractice: { type: 'naturopathie', start: '', end: '', error: '' },
      },
    });
  };

  handlePracticeTypeChange = (e) => {
    const type = e.target.value;
    this.setState((prevState) => {
      const newPractice = { ...prevState.practiceDialog.newPractice, type };
      if (newPractice.start) {
        const startDate = this.getDateFromTime(newPractice.start);
        const duration = getDurationInMinutes(type);
        const newEndDate = addMinutes(startDate, duration);
        newPractice.end = format(newEndDate, 'HH:mm');
      }
      return {
        practiceDialog: { ...prevState.practiceDialog, newPractice },
      };
    });
  };

  handlePracticeStartChange = (e) => {
    const start = e.target.value;
    this.setState((prevState) => {
      const newPractice = { ...prevState.practiceDialog.newPractice, start };
      if (start) {
        const startDate = this.getDateFromTime(start);
        const duration = getDurationInMinutes(newPractice.type);
        const newEndDate = addMinutes(startDate, duration);
        newPractice.end = format(newEndDate, 'HH:mm');
      } else {
        newPractice.end = '';
      }
      return {
        practiceDialog: { ...prevState.practiceDialog, newPractice },
      };
    });
  };

  handleAddPractice = () => {
    this.setState((prevState) => {
      const { dayIndex, timeIndex, practices } = prevState.practiceDialog;
      const newPractice = { ...prevState.practiceDialog.newPractice };
      const days = [...prevState.days];
      const parentTimeslot = days[dayIndex].times[timeIndex];
      const parentStart = this.getDateFromTime(parentTimeslot.start);
      const parentEnd = this.getDateFromTime(parentTimeslot.end);

      if (!newPractice.start) {
        newPractice.error = "Veuillez saisir l'heure de début.";
        return { practiceDialog: { ...prevState.practiceDialog, newPractice } };
      }

      const newStart = this.getDateFromTime(newPractice.start);
      const newEnd = this.getDateFromTime(newPractice.end);

      if (newStart < parentStart || newEnd > parentEnd) {
        newPractice.error = "La pratique doit être dans la plage horaire sélectionnée.";
        return { practiceDialog: { ...prevState.practiceDialog, newPractice } };
      }

      for (let practice of practices) {
        const existingStart = this.getDateFromTime(practice.start);
        const existingEnd = this.getDateFromTime(practice.end);
        if (newStart < existingEnd && newEnd > existingStart) {
          newPractice.error = "Chevauchement d'horaires détecté.";
          return { practiceDialog: { ...prevState.practiceDialog, newPractice } };
        }
      }

      newPractice.error = '';
      const updatedPractices = [...practices, { ...newPractice }];
      const resetNewPractice = { type: newPractice.type, start: '', end: '', error: '' };

      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          practices: updatedPractices,
          newPractice: resetNewPractice,
        },
      };
    });
  };

  handleRemovePractice = (index) => {
    this.setState((prevState) => {
      const updatedPractices = prevState.practiceDialog.practices.filter((_, i) => i !== index);
      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          practices: updatedPractices,
        },
      };
    });
  };

  handleSavePractices = () => {
    this.setState((prevState) => {
      const { dayIndex, timeIndex, practices } = prevState.practiceDialog;
      const days = [...prevState.days];
      days[dayIndex].times[timeIndex].practices = practices;
      return {
        days,
        practiceDialog: {
          isOpen: false,
          dayIndex: null,
          timeIndex: null,
          practices: [],
          newPractice: { type: 'naturopathie', start: '', end: '', error: '' },
        },
      };
    });
  };

  handleClosePracticeDialog = () => {
    this.setState({
      practiceDialog: {
        isOpen: false,
        dayIndex: null,
        timeIndex: null,
        practices: [],
        newPractice: { type: 'naturopathie', start: '', end: '', error: '' },
      },
    });
  };

  renderTimeInput(dayIndex, timeIndex, field) {
    const slot = this.state.days[dayIndex].times[timeIndex];
    const timeValue = slot[field] || '';
    const hasError = slot.errors && slot.errors[field];
    return (
      <input
        type="time"
        value={timeValue}
        onChange={(e) => this.handleTimeChange(dayIndex, timeIndex, field, e.target.value)}
        onBlur={() => this.validateTimeSlot(dayIndex, timeIndex, field)}
        className={`border p-2 rounded ${hasError ? 'border-red-500' : 'border-gray-300'}`}
      />
    );
  }

  render() {
    const { startDate, endDate, days, errorDialog, successDialog, practiceDialog, overwriteDialog } = this.state;
    return (
      <div>
        {/* Saisie de la plage de dates */}
        <div className="mb-4">
          <p className='font-bold my-4 text-[#0f2b3d]'>Programmer une date spécifique</p>
          <div className="flex gap-4 items-center justify-start">
            <p>De</p>
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => this.handleDateChange("startDate", date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="jour-mois-année"
                className="border p-2 rounded"
                minDate={new Date()}
                todayButton="Aujourd'hui"
              />
            </div>
            <p>à</p>
            <div>
              <DatePicker
                selected={endDate}
                onChange={(date) => this.handleDateChange("endDate", date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="jour-mois-année"
                className="border p-2 rounded"
                minDate={startDate ? startDate : new Date()}
                todayButton="Aujourd'hui"
              />
            </div>
            <div>
              <Button onClick={this.handleLoadDays} className="bg-[#2b7a72] text-white">
                <Check /> Confirmer
              </Button>
            </div>
          </div>
        </div>

        {/* Affichage du planning */}
        {days.length > 0 && (
          <div>
            <div className="flex w-full border-y-2 py-4 items-center justify-between">
              <div>
                <div className="flex flex-wrap gap-6">
                  {days.map((day, index) => (
                    <label key={day.name} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={day.selected}
                        onChange={() => this.handleCheckboxChange(index)}
                      />
                      <span>{day.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 my-2 items-center text-gray-500 text-sm">
                  <InfoIcon/>
                  <p>Seuls les jours sélectionnés seront modifiés par rapport à l'agenda général.</p>
                </div>
              </div>
              <Button type="submit" className="flex items-center bg-[#0f2b3d]" onClick={this.handleSave}>
                <SaveIcon /> Enregistrer
              </Button>
            </div>
            {/* Gestion des créneaux pour chaque jour sélectionné */}
            <div className="mt-4">
              {days.map((day, index) => {
                if (!day.selected) return null;
                return (
                  <div key={day.name} className="mb-4 border p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 items-start">
                      {/* Colonne 1 : Nom du jour */}
                      <div className="flex text-left items-start justify-start font-bold">
                        {day.name}
                      </div>
                      {/* Colonne 2 : Plages horaires ou message indisponible */}
                      <div className="flex flex-col items-center justify-center">
                        {day.work === false ? (
                          <p className="text-gray-500 font-bold text-center">Marqué comme non disponible</p>
                        ) : (
                          day.times.map((time, timeIndex) => (
                            <div key={timeIndex} className="flex flex-col gap-2 mb-2">
                              <div className="flex items-center justify-center gap-2">
                                {this.renderTimeInput(index, timeIndex, 'start')}
                                <span>à</span>
                                {this.renderTimeInput(index, timeIndex, 'end')}
                                <Button
                                  className="bg-red-500 text-white"
                                  onClick={() => this.handleRemoveTimeSlot(index, timeIndex)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {/* Colonne 3 : Boutons d'action */}
                      <div className="flex flex-col items-end">
                        {day.work !== false && (
                          <Button
                            className="flex items-center bg-[#2b7a72] text-white mb-2"
                            onClick={() => this.handleAddTimeSlot(index)}
                          >
                            <PlusCircle size={16} /> Ajouter une plage horaire
                          </Button>
                        )}
                        <Button
                          className="bg-gray-500 text-white"
                          onClick={() => this.handleNotWorking(index)}
                        >
                          <Ban /> Ne pas travailler
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ErrorDialog 
          isOpen={errorDialog.isOpen} 
          message={errorDialog.message} 
          onClose={() => this.setState({ errorDialog: { isOpen: false, message: '' } })}
        />
        <SuccessDialog 
          isOpen={successDialog.isOpen} 
          message={successDialog.message} 
          onClose={() => this.setState({ successDialog: { isOpen: false, message: '' } })}
        />
        <PracticeDialog
          isOpen={practiceDialog.isOpen}
          parentTimeslot={practiceDialog.dayIndex !== null && practiceDialog.timeIndex !== null ? this.state.days[practiceDialog.dayIndex].times[practiceDialog.timeIndex] : null}
          practices={practiceDialog.practices}
          newPractice={practiceDialog.newPractice}
          onPracticeTypeChange={this.handlePracticeTypeChange}
          onPracticeStartChange={this.handlePracticeStartChange}
          onAddPractice={this.handleAddPractice}
          onRemovePractice={this.handleRemovePractice}
          onSave={this.handleSavePractices}
          onClose={this.handleClosePracticeDialog}
        />
        <OverwriteDialog
          isOpen={overwriteDialog.isOpen}
          overlappingDates={overwriteDialog.overlappingDates}
          appointmentsToOverwrite={overwriteDialog.appointmentsToOverwrite}
          onConfirm={this.handleConfirmOverwrite}
          onCancel={this.handleCancelOverwrite}
        />
      </div>
    );
  }
}

export default GeneralEntreDates;
