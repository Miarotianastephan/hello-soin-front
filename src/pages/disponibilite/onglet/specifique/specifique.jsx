import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SaveIcon, PlusCircle, Trash2, Check, CalendarClock, Ban } from 'lucide-react';
import { parse, isBefore, eachDayOfInterval, format, addMinutes } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

/* Fonctions utilitaires pour la pratique */
const getDurationInMinutes = (type) => {
  switch (type) {
    case 'naturopathie': return 120;
    case 'acuponcture': return 30;
    case 'hypnose': return 90;
    default: return 0;
  }
};

const getColorByType = (type) => {
  switch (type) {
    case 'naturopathie': return '#FF6B6B';
    case 'acuponcture': return '#4ECDC4';
    case 'hypnose': return '#45B7D1';
    default: return '#CCCCCC';
  }
};

export class GeneralEntreDates extends Component {
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
      // Dialogue pour la confirmation d'écrasement sur les dates déjà existantes
      overwriteDialog: {
        isOpen: false,
        overlappingDates: [],
      },
      // Stocke temporairement le nouveau planning en attente de confirmation
      pendingPlanningData: null,
    };
  }

  /**
   * Calcule les jours de la semaine présents entre startDate et endDate.
   * Conserve aussi l'index du jour (0 pour Dimanche, 1 pour Lundi, etc.)
   */
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

  // Sélection/dé-sélection d'un jour
  handleCheckboxChange = (index) => {
    const newDays = [...this.state.days];
    const isSelected = !newDays[index].selected;
    newDays[index].selected = isSelected;
    if (isSelected) {
      // Créneau par défaut et marquage "work" à true
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

  // Marquer un jour comme "ne pas travailler"
  handleNotWorking = (dayIndex) => {
    const newDays = [...this.state.days];
    newDays[dayIndex].times = [];
    newDays[dayIndex].work = false;
    this.setState({ days: newDays });
  };

  // Convertir une chaîne "HH:mm" en objet Date (date de base fixe)
  getDateFromTime = (timeStr) => parse(timeStr, 'HH:mm', new Date(1970, 0, 1));

  handleTimeChange = (dayIndex, timeIndex, field, value) => {
    const newDays = [...this.state.days];
    const slot = newDays[dayIndex].times[timeIndex];
    slot[field] = value;
    if (slot.errors) slot.errors[field] = false;
    this.setState({ days: newDays });
  };

  // Validation lors du onBlur
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

  // Vérification avant sauvegarde
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

  /**
   * Construction du planning sous forme d'un tableau "datesWithSlots".
   * Pour chaque date de l'intervalle, on ajoute soit les créneaux (si le jour est sélectionné)
   * soit, si le jour est marqué comme non travailler, { work: false }.
   */
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

  /**
   * Lors de l'enregistrement, on vérifie si le nouveau planning chevauche des dates déjà existantes.
   * Seules les dates qui se trouvent dans le nouveau planning et dans l'ancien seront proposées pour confirmation.
   */
  handleSave = () => {
    if (!this.validateData()) return;

    const newPlanning = this.buildNewPlanningData();
    const existingStr = localStorage.getItem('planning');
    if (existingStr) {
      try {
        const existingPlanning = JSON.parse(existingStr);
        const overlappingDates = newPlanning.datesWithSlots
          .filter(newItem => 
            existingPlanning.datesWithSlots &&
            existingPlanning.datesWithSlots.some(oldItem => oldItem.date === newItem.date)
          )
          .map(item => item.date);
        if (overlappingDates.length > 0) {
          // Ouvrir le dialogue de confirmation avec la liste des dates qui se chevauchent
          this.setState({
            overwriteDialog: { isOpen: true, overlappingDates },
            pendingPlanningData: newPlanning,
          });
          return; // Attendre la confirmation
        }
      } catch (err) {
        // En cas d'erreur, on procède à la sauvegarde
      }
    }
    // S'il n'y a pas de chevauchement, sauvegarder directement
    this.savePlanningData(newPlanning);
  };

  /**
   * Fusionne le nouveau planning avec l'ancien en écrasant uniquement les dates chevauchantes,
   * et en conservant les dates non concernées.
   */
  savePlanningData = (newPlanning) => {
    const existingStr = localStorage.getItem('planning');
    if (existingStr) {
      try {
        const existingPlanning = JSON.parse(existingStr);
        // Fusionner les dates
        let mergedDates = existingPlanning.datesWithSlots || [];
        newPlanning.datesWithSlots.forEach(newItem => {
          const index = mergedDates.findIndex(item => item.date === newItem.date);
          if (index !== -1) {
            // Écraser la date existante
            mergedDates[index] = newItem;
          } else {
            // Ajouter la nouvelle date
            mergedDates.push(newItem);
          }
        });
        const mergedPlanning = {
          // On peut choisir de conserver l'ancien intervalle ou mettre à jour selon le nouveau planning.
          // Ici, nous utilisons le nouvel intervalle.
          startDate: newPlanning.startDate,
          endDate: newPlanning.endDate,
          days: newPlanning.days,
          datesWithSlots: mergedDates,
        };
        localStorage.setItem('planning', JSON.stringify(mergedPlanning));
        console.log('Données enregistrées :', JSON.stringify(mergedPlanning, null, 2));
        this.setState({
          successDialog: { isOpen: true, message: 'Enregistré avec succès' },
          overwriteDialog: { isOpen: false, overlappingDates: [] },
          pendingPlanningData: null,
        });
        return;
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        this.setState({
          errorDialog: { isOpen: true, message: "Erreur lors de l'enregistrement : " + error.message },
        });
        return;
      }
    }
    // Pas de planning existant : sauvegarde directe
    try {
      localStorage.setItem('planning', JSON.stringify(newPlanning));
      console.log('Données enregistrées :', JSON.stringify(newPlanning, null, 2));
      this.setState({
        successDialog: { isOpen: true, message: 'Enregistré avec succès' },
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      this.setState({
        errorDialog: { isOpen: true, message: "Erreur lors de l'enregistrement : " + error.message },
      });
    }
  };

  // Confirmation d'écrasement : l'utilisateur veut écraser les dates concernées
  handleConfirmOverwrite = () => {
    const { pendingPlanningData } = this.state;
    if (pendingPlanningData) {
      this.savePlanningData(pendingPlanningData);
    }
  };

  // Annulation de l'écrasement
  handleCancelOverwrite = () => {
    this.setState({ 
      overwriteDialog: { isOpen: false, overlappingDates: [] }, 
      pendingPlanningData: null 
    });
  };

  /* ---------- Gestion du Dialog "Pratique" ---------- */

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
      const { dayIndex, timeIndex, practices, newPractice } = prevState.practiceDialog;
      const parentTimeslot = prevState.days[dayIndex].times[timeIndex];
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

  renderPracticeDialog() {
    const { practiceDialog } = this.state;
    if (!practiceDialog.isOpen) return null;
    const { dayIndex, timeIndex, practices, newPractice } = practiceDialog;
    if (dayIndex === null || timeIndex === null) return null;
    const parentTimeslot = this.state.days[dayIndex].times[timeIndex];
    const parentStart = this.getDateFromTime(parentTimeslot.start);
    const parentEnd = this.getDateFromTime(parentTimeslot.end);
    const totalDuration = (parentEnd - parentStart) / 60000; // en minutes

    return (
      <Dialog
        open={practiceDialog.isOpen}
        onOpenChange={(open) => { if (!open) this.handleClosePracticeDialog(); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestion des Pratiques</DialogTitle>
            <DialogDescription>
              Plage horaire : {parentTimeslot.start} - {parentTimeslot.end}
            </DialogDescription>
          </DialogHeader>
          {/* Ligne de temps affinée */}
          <div className="relative" style={{ height: '10px', background: '#e0e0e0' }}>
            {practices.map((practice, idx) => {
              const pStart = this.getDateFromTime(practice.start);
              const pEnd = this.getDateFromTime(practice.end);
              const offset = ((pStart - parentStart) / 60000 / totalDuration) * 100;
              const width = (((pEnd - pStart) / 60000) / totalDuration) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${offset}%`,
                    width: `${width}%`,
                    height: '100%',
                    backgroundColor: getColorByType(practice.type),
                  }}
                  title={`${practice.type} (${practice.start})`}
                />
              );
            })}
          </div>
          {/* Légende */}
          <div className="flex gap-4">
            <div className="flex items-center">
              <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('naturopathie') }} className="mr-1" />
              <span>Naturopathie</span>
            </div>
            <div className="flex items-center">
              <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('acuponcture') }} className="mr-1" />
              <span>Acuponcture</span>
            </div>
            <div className="flex items-center">
              <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('hypnose') }} className="mr-1" />
              <span>Hypnose</span>
            </div>
          </div>
          {/* Liste des pratiques */}
          <div className="mb-4">
            <h4 className="font-bold">Pratiques ajoutées :</h4>
            {practices.length === 0 ? (
              <p>Aucune pratique ajoutée.</p>
            ) : (
              <ul>
                {practices.map((practice, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{practice.type} : {practice.start}</span>
                    <Button className="bg-red-500 text-white" onClick={() => this.handleRemovePractice(idx)}>
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Formulaire d'ajout */}
          <div className="mb-4">
            <h4 className="font-bold">Ajouter une pratique :</h4>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row w-full justify-between items-center px-2">
                <label>
                  Type :
                  <select value={newPractice.type} onChange={this.handlePracticeTypeChange} className="border p-1 rounded ml-2">
                    <option value="naturopathie">Naturopathie</option>
                    <option value="acuponcture">Acuponcture</option>
                    <option value="hypnose">Hypnose</option>
                  </select>
                </label>
                <label>
                  Heure de début :
                  <input type="time" value={newPractice.start} onChange={this.handlePracticeStartChange} className="border p-1 rounded ml-2" />
                </label>
              </div>
              {newPractice.error && <p className="text-red-500">{newPractice.error}</p>}
              <Button className="bg-[#2b7a72] text-white" onClick={this.handleAddPractice}>
                <PlusCircle size={16} /> Ajouter
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={this.handleSavePractices}>Enregistrer</Button>
            <Button onClick={this.handleClosePracticeDialog}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  renderOverwriteDialog() {
    const { overwriteDialog } = this.state;
    if (!overwriteDialog.isOpen) return null;
    return (
      <Dialog
        open={overwriteDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            this.setState({ overwriteDialog: { isOpen: false, overlappingDates: [] } });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de remplacement</DialogTitle>
            <DialogDescription>
              Les dates suivantes existent déjà dans le planning :
              <ul>
                {overwriteDialog.overlappingDates.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
              Voulez-vous les écraser et remplacer uniquement ces dates ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-red-500 text-white" onClick={this.handleConfirmOverwrite}>
              Écraser
            </Button>
            <Button onClick={this.handleCancelOverwrite}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  renderErrorDialog() {
    const { errorDialog } = this.state;
    return (
      <Dialog
        open={errorDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) this.setState({ errorDialog: { isOpen: false, message: '' } });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription className="text-red-700">{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => this.setState({ errorDialog: { isOpen: false, message: '' } })}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  renderSuccessDialog() {
    const { successDialog } = this.state;
    return (
      <Dialog
        open={successDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) this.setState({ successDialog: { isOpen: false, message: '' } });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Succès</DialogTitle>
            <DialogDescription>{successDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => this.setState({ successDialog: { isOpen: false, message: '' } })}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
    const { startDate, endDate, days } = this.state;
    return (
      <div>
        {/* Saisie de la plage de dates */}
        <div className="mb-4">
          <h3>Sélectionnez la plage de dates</h3>
          {days.length === 0 && (
            <div className="mb-5">
              <div className="flex w-full border-b-2 py-3 items-center justify-between">
                <p className="text-gray-500">Définir les dates ...</p>
              </div>
            </div>
          )}
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
            <div className="flex w-full border-b-2 py-3 items-center justify-between">
              <p className="text-gray-500">Planifier la disponibilité</p>
              <Button type="submit" className="flex items-center bg-[#0f2b3d]" onClick={this.handleSave}>
                <SaveIcon /> Enregistrer
              </Button>
            </div>
            <div className="py-4">
              {/* Sélection des jours */}
              <div className="flex flex-wrap gap-4">
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
              {/* Gestion des créneaux pour chaque jour sélectionné */}
              <div className="mt-4">
                {days.map((day, index) => {
                  if (!day.selected) return null;
                  return (
                    <div key={day.name} className="mb-4 border p-4 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="flex text-left items-start justify-start font-bold h-full">
                          {day.name}
                        </div>
                        <div className="flex flex-col h-full items-start justify-center text-center">
                          {day.times.map((time, timeIndex) => (
                            <div key={timeIndex} className="flex flex-col gap-2 mb-2">
                              <div className="flex items-center justify-center gap-2">
                                {this.renderTimeInput(index, timeIndex, 'start')}
                                <span>à</span>
                                {this.renderTimeInput(index, timeIndex, 'end')}
                                <Button className="bg-red-500 text-white" onClick={() => this.handleRemoveTimeSlot(index, timeIndex)}>
                                  <Trash2 size={16} />
                                </Button>
                                <Button className="bg-[#0f2b3d] text-white" onClick={() => this.openPracticeDialog(index, timeIndex)}>
                                  <CalendarClock size={16} /> Pratique ({time.practices ? time.practices.length : 0})
                                </Button>
                              </div>
                            </div>
                          ))}
                          {/* Bouton "Ne pas travailler" */}
                          {day.selected && day.work !== false && (
                            <div className="mt-2">
                              <Button className="bg-gray-500 text-white" onClick={() => this.handleNotWorking(index)}>
                                <Ban /> Ne pas travailler
                              </Button>
                            </div>
                          )}
                          {day.selected && day.work !== true && (
                            <div className="mt-2">
                              <p className="text-gray-500 font-bold">Marqué comme non disponible</p>
                            </div>
                          )}
                        </div>
                        <div className="flex text-right items-start justify-end h-full">
                          <Button className="flex items-center bg-[#2b7a72] text-white" onClick={() => this.handleAddTimeSlot(index)}>
                            <PlusCircle size={16} /> Ajouter une plage horaire
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {this.renderErrorDialog()}
        {this.renderSuccessDialog()}
        {this.renderPracticeDialog()}
        {this.renderOverwriteDialog()}
      </div>
    );
  }
}

export default GeneralEntreDates;
