// src/components/General.jsx
import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import { SaveIcon, PlusCircle, Trash2, CalendarClock, InfoIcon } from 'lucide-react';
import { parse, isBefore, addMinutes, format } from 'date-fns';
import BASE_URL from '@/pages/config/baseurl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getDurationInMinutes, getColorByType } from './utils/planningUtils';
import PracticeDialog from './dialogs/PracticeDialog';
import TimeInput from './dialogs/TimeInput';
import { Link } from 'react-router-dom';

export class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [
        { name: 'Lundi', selected: false, times: [] },
        { name: 'Mardi', selected: false, times: [] },
        { name: 'Mercredi', selected: false, times: [] },
        { name: 'Jeudi', selected: false, times: [] },
        { name: 'Vendredi', selected: false, times: [] },
        { name: 'Samedi', selected: false, times: [] },
        { name: 'Dimanche', selected: false, times: [] },
      ],
      errorDialog: {
        isOpen: false,
        message: '',
      },
      successDialog: {
        isOpen: false,
        message: '',
      },
      // Etat pour la gestion du dialogue de pratique
      practiceDialog: {
        isOpen: false,
        dayIndex: null,
        timeIndex: null,
        practices: [],
        newPractice: {
          type: 'naturopathie',
          start: '',
          end: '',
          error: '',
        },
      },
    };
  }

  componentDidMount() {
    // Récupérer la planification via l'API
    fetch(`${BASE_URL}/planning`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        return response.json();
      })
      .then(data => {
        // Transformation des données reçues pour correspondre au format de l'application
        const days = data.map(day => ({
          name: day.day_name,
          selected: !!day.selected,
          times: (day.times || []).map(slot => ({
            start: slot.start.slice(0, 5), // Extrait HH:mm de "08:00:00"
            end: slot.end.slice(0, 5),
            errors: { start: false, end: false },
            practices: slot.practices || [],
          })),
        }));
        this.setState({ days });
      })
      .catch(error => {
        console.error('Erreur lors du chargement du planning', error);
        this.setState({
          errorDialog: {
            isOpen: true,
            message: 'Erreur lors du chargement du planning: ' + error.message,
          },
        });
      });
  }
  

  // Convertir une chaîne "HH:mm" en objet Date (avec une date de base fixe)
  getDateFromTime = (timeStr) => parse(timeStr, 'HH:mm', new Date(1970, 0, 1));

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
    } else {
      newDays[index].times = [];
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

    if (
      slot.start &&
      slot.end &&
      slot.start.length === 5 &&
      slot.end.length === 5
    ) {
      const startDate = this.getDateFromTime(slot.start);
      const endDate = this.getDateFromTime(slot.end);
      let errorMessage = '';

      if (!isBefore(startDate, endDate)) {
        errorMessage = "L'heure de début doit être antérieure à l'heure de fin.";
      } else {
        for (let i = 0; i < newDays[dayIndex].times.length; i++) {
          if (i === timeIndex) continue;
          const otherSlot = newDays[dayIndex].times[i];
          if (
            otherSlot.start &&
            otherSlot.end &&
            otherSlot.start.length === 5 &&
            otherSlot.end.length === 5
          ) {
            const otherStart = this.getDateFromTime(otherSlot.start);
            const otherEnd = this.getDateFromTime(otherSlot.end);
            if (isBefore(startDate, otherEnd) && isBefore(otherStart, endDate)) {
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
              errorDialog: {
                isOpen: true,
                message: 'Veuillez remplir tous les champs de plage horaire.',
              },
            });
            isValid = false;
            break;
          }
        }
      }
    }

    return isValid;
  };

  handleSave = () => {
    if (!this.validateData()) return;

    // Sauvegarder la planification via l'API (remplacement du localStorage)
    fetch(`${BASE_URL}/planning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.days),
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
        });
      })
      .catch(error => {
        console.error("Erreur lors de l'enregistrement :", error);
        this.setState({
          errorDialog: {
            isOpen: true,
            message: "Erreur lors de l'enregistrement : " + error.message,
          },
        });
      });
  };

  // Exemple d'utilisation d'un composant TimeInput (optionnel)
  renderTimeInput(dayIndex, timeIndex, field) {
    const slot = this.state.days[dayIndex].times[timeIndex];
    const timeValue = slot[field] || '';
    const hasError = slot.errors && slot.errors[field];
    return (
      <TimeInput
        value={timeValue}
        onChange={(e) =>
          this.handleTimeChange(dayIndex, timeIndex, field, e.target.value)
        }
        onBlur={() => this.validateTimeSlot(dayIndex, timeIndex, field)}
        hasError={hasError}
      />
    );
  }

  // --- Méthodes pour la gestion du dialogue de pratique ---
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
        const endDate = addMinutes(startDate, duration);
        newPractice.end = format(endDate, 'HH:mm');
      }
      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          newPractice,
        },
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
        const endDate = addMinutes(startDate, duration);
        newPractice.end = format(endDate, 'HH:mm');
      } else {
        newPractice.end = '';
      }
      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          newPractice,
        },
      };
    });
  };

  handlePracticeStartBlur = () => {
    this.setState((prevState) => {
      const { dayIndex, timeIndex, newPractice, practices } = prevState.practiceDialog;
      if (!newPractice.start) return {};
      const parentTimeslot = prevState.days[dayIndex].times[timeIndex];
      const parentStart = this.getDateFromTime(parentTimeslot.start);
      const parentEnd = this.getDateFromTime(parentTimeslot.end);
      const newStart = this.getDateFromTime(newPractice.start);
      const duration = getDurationInMinutes(newPractice.type);
      const newEnd = addMinutes(newStart, duration);
      let error = '';
      if (newStart < parentStart || newEnd > parentEnd) {
        error = "La pratique doit être dans la plage horaire sélectionnée.";
      }
      for (let practice of practices) {
        const existingStart = this.getDateFromTime(practice.start);
        const existingEnd = this.getDateFromTime(practice.end);
        if (newStart < existingEnd && newEnd > existingStart) {
          error = "Chevauchement d'horaires détecté.";
          break;
        }
      }
      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          newPractice: { ...newPractice, error },
        },
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
        practiceDialog: { ...prevState.practiceDialog, practices: updatedPractices },
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

  handleTimelineClick = (e) => {
    this.setState((prevState) => {
      const { dayIndex, timeIndex, newPractice } = prevState.practiceDialog;
      if (dayIndex === null || timeIndex === null) return {};
      const parentTimeslot = prevState.days[dayIndex].times[timeIndex];
      const parentStart = this.getDateFromTime(parentTimeslot.start);
      const parentEnd = this.getDateFromTime(parentTimeslot.end);
      const totalDuration = (parentEnd - parentStart) / 60000;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = clickX / rect.width;
      const minutesOffset = Math.round(totalDuration * ratio);
      const newStartDate = addMinutes(parentStart, minutesOffset);
      const newStart = format(newStartDate, 'HH:mm');

      const duration = getDurationInMinutes(newPractice.type);
      const newEndDate = addMinutes(newStartDate, duration);
      const newEnd = format(newEndDate, 'HH:mm');

      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          newPractice: { ...newPractice, start: newStart, end: newEnd },
        },
      };
    });
  };

  renderErrorDialog() {
    const { errorDialog } = this.state;
    return (
      <Dialog
        open={errorDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            this.setState({ errorDialog: { isOpen: false, message: '' } });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription className="text-red-700">
              {errorDialog.message}
            </DialogDescription>
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
          if (!open) {
            this.setState({ successDialog: { isOpen: false, message: '' } });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Succès</DialogTitle>
            <DialogDescription>{successDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link
              to={"/agenda"}
              onClick={() => this.setState({ successDialog: { isOpen: false, message: '' } })}
              className="bg-[#0f2b3d] w-1/4 h-full p-1 flex justify-center items-center rounded-lg"
            >
              <span className="text-white font-bold">Ok</span>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  render() {
    const { days, practiceDialog } = this.state;
    return (
      <div>
        <div className="flex w-full border-b-2 py-3 items-center justify-between">
          <p className="text-[ #0f2b3d] font-bold">Planifier la disponibilité</p>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between w-full px-2 border-b-2 py-3">
            <div className="w-full">
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
                <InfoIcon />
                <p>
                  Les jours et pratiques sélectionnés seront considérés comme vos jours de travail par défaut !
                </p>
              </div>
            </div>
            <Button type="submit" className="flex items-center bg-[#0f2b3d]" onClick={this.handleSave}>
              <SaveIcon /> Enregistrer
            </Button>
          </div>
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
                        <div key={timeIndex} className="flex items-center justify-center gap-2 mb-2">
                          {this.renderTimeInput(index, timeIndex, 'start')}
                          <span>à</span>
                          {this.renderTimeInput(index, timeIndex, 'end')}
                          <Button className="bg-red-500 text-white" onClick={() => this.handleRemoveTimeSlot(index, timeIndex)}>
                            <Trash2 size={16} />
                          </Button>
                          {/* Pour ouvrir la boîte de dialogue pratique, décommentez le bouton suivant :
                          <Button className="bg-[#0f2b3d] text-white" onClick={() => this.openPracticeDialog(index, timeIndex)}>
                            <CalendarClock size={16} /> Pratique ({time.practices ? time.practices.length : 0})
                          </Button> */}
                        </div>
                      ))}
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
        {this.renderErrorDialog()}
        {this.renderSuccessDialog()}
        {/* Insertion du composant PracticeDialog */}
        <PracticeDialog
          isOpen={practiceDialog.isOpen}
          parentTimeslot={
            practiceDialog.dayIndex !== null && practiceDialog.timeIndex !== null
              ? days[practiceDialog.dayIndex].times[practiceDialog.timeIndex]
              : null
          }
          practices={practiceDialog.practices}
          newPractice={practiceDialog.newPractice}
          onPracticeTypeChange={this.handlePracticeTypeChange}
          onPracticeStartChange={this.handlePracticeStartChange}
          onPracticeStartBlur={this.handlePracticeStartBlur}
          onAddPractice={this.handleAddPractice}
          onRemovePractice={this.handleRemovePractice}
          onSavePractices={this.handleSavePractices}
          handleTimelineClick={this.handleTimelineClick}
          getDateFromTime={this.getDateFromTime}
          onOpenChange={(open) => {
            if (!open) this.handleClosePracticeDialog();
          }}
        />
      </div>
    );
  }
}

export default General;
