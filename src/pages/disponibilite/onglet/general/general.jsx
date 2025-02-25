import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import { SaveIcon, PlusCircle, Trash2, CalendarClock } from 'lucide-react';
import { parse, isBefore, addMinutes, format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Fonctions utilitaires pour la pratique
export const getDurationInMinutes = (type) => {
  switch (type) {
    case 'naturopathie':
      return 120;
    case 'acuponcture':
      return 30;
    case 'hypnose':
      return 90;
    default:
      return 0;
  }
};

export const getColorByType = (type) => {
  switch (type) {
    case 'naturopathie':
      return '#FF6B6B';
    case 'acuponcture':
      return '#4ECDC4';
    case 'hypnose':
      return '#45B7D1';
    default:
      return '#CCCCCC';
  }
};

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
      // Etat pour la gestion de la boîte de dialogue des pratiques
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
    const savedPlanning = localStorage.getItem('general');
    if (savedPlanning) {
      try {
        let days = JSON.parse(savedPlanning);
        if (Array.isArray(days)) {
          // Normalisation des données enregistrées
          days = days.map((day) => ({
            ...day,
            selected: day.selected || (day.times && day.times.length > 0),
            times: (day.times || []).map((slot) => ({
              ...slot,
              errors: slot.errors || { start: false, end: false },
              practices: slot.practices || [],
            })),
          }));
          this.setState({ days });
        }
      } catch (e) {
        console.error('Erreur lors du chargement du planning', e);
      }
    }
  }

  // Convertir une chaîne "HH:mm" en objet Date (avec une date de base fixe)
  getDateFromTime = (timeStr) => parse(timeStr, 'HH:mm', new Date(1970, 0, 1));

  handleCheckboxChange = (index) => {
    const newDays = [...this.state.days];
    const isSelected = !newDays[index].selected;
    newDays[index].selected = isSelected;

    if (isSelected) {
      // Ajoute une plage horaire par défaut avec un tableau de pratiques vide
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
        // Vérifier le chevauchement avec les autres créneaux du même jour
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

    try {
      localStorage.setItem('general', JSON.stringify(this.state.days));
      console.log(
        'Données enregistrées :',
        JSON.stringify(this.state.days, null, 2)
      );
      this.setState({
        successDialog: { isOpen: true, message: 'Enregistré avec succès' },
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement :', error);
      this.setState({
        errorDialog: {
          isOpen: true,
          message: "Erreur lors de l'enregistrement : " + error.message,
        },
      });
    }
  };

  renderTimeInput(dayIndex, timeIndex, field) {
    const slot = this.state.days[dayIndex].times[timeIndex];
    const timeValue = slot[field] || '';
    const hasError = slot.errors && slot.errors[field];
    return (
      <input
        type="time"
        value={timeValue}
        onChange={(e) =>
          this.handleTimeChange(dayIndex, timeIndex, field, e.target.value)
        }
        onBlur={() => this.validateTimeSlot(dayIndex, timeIndex, field)}
        className={`border p-2 rounded ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    );
  }

  // --- Gestion de la boîte de dialogue "Pratique" ---

  // Ouvre le dialog de pratique pour une plage horaire donnée
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

  // Gestion du changement du type de pratique
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

  // Gestion du changement de l'heure de début de la pratique
  handlePracticeStartChange = (e) => {
    const start = e.target.value;
    this.setState((prevState) => {
      const newPractice = {
        ...prevState.practiceDialog.newPractice,
        start,
      };
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

  // Ajoute une pratique après vérification (pas de chevauchement et dans la plage)
  handleAddPractice = () => {
    this.setState((prevState) => {
      const { dayIndex, timeIndex, practices, newPractice } =
        prevState.practiceDialog;
      const parentTimeslot =
        prevState.days[dayIndex].times[timeIndex];
      const parentStart = this.getDateFromTime(parentTimeslot.start);
      const parentEnd = this.getDateFromTime(parentTimeslot.end);

      if (!newPractice.start) {
        newPractice.error = "Veuillez saisir l'heure de début.";
        return {
          practiceDialog: { ...prevState.practiceDialog, newPractice },
        };
      }

      const newStart = this.getDateFromTime(newPractice.start);
      const newEnd = this.getDateFromTime(newPractice.end);

      // Vérifier que la pratique se situe dans la plage de disponibilité
      if (newStart < parentStart || newEnd > parentEnd) {
        newPractice.error =
          "La pratique doit être dans la plage horaire sélectionnée.";
        return {
          practiceDialog: { ...prevState.practiceDialog, newPractice },
        };
      }

      // Vérifier les chevauchements avec les pratiques existantes
      for (let practice of practices) {
        const existingStart = this.getDateFromTime(practice.start);
        const existingEnd = this.getDateFromTime(practice.end);
        if (newStart < existingEnd && newEnd > existingStart) {
          newPractice.error = "Chevauchement d'horaires détecté.";
          return {
            practiceDialog: { ...prevState.practiceDialog, newPractice },
          };
        }
      }

      // Pas d'erreur : on ajoute la pratique et on réinitialise le formulaire
      newPractice.error = '';
      const updatedPractices = [...practices, { ...newPractice }];
      const resetNewPractice = {
        type: newPractice.type,
        start: '',
        end: '',
        error: '',
      };
      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          practices: updatedPractices,
          newPractice: resetNewPractice,
        },
      };
    });
  };

  // Supprime une pratique de la liste
  handleRemovePractice = (index) => {
    this.setState((prevState) => {
      const updatedPractices = prevState.practiceDialog.practices.filter(
        (_, i) => i !== index
      );
      return {
        practiceDialog: {
          ...prevState.practiceDialog,
          practices: updatedPractices,
        },
      };
    });
  };

  // Sauvegarde les pratiques dans la plage horaire correspondante
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

  // Ferme la boîte de dialogue pratique sans sauvegarder
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

  // Ajout de la fonction pour sélectionner l'heure de début sur la timeline
handleTimelineClick = (e) => {
  this.setState((prevState) => {
    const { dayIndex, timeIndex, newPractice } = prevState.practiceDialog;
    if (dayIndex === null || timeIndex === null) return {};
    const parentTimeslot = prevState.days[dayIndex].times[timeIndex];
    const parentStart = this.getDateFromTime(parentTimeslot.start);
    const parentEnd = this.getDateFromTime(parentTimeslot.end);
    const totalDuration = (parentEnd - parentStart) / 60000; // en minutes

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const minutesOffset = Math.round(totalDuration * ratio);
    const newStartDate = addMinutes(parentStart, minutesOffset);
    const newStart = format(newStartDate, 'HH:mm');

    // Calcul automatique de l'heure de fin en fonction du type de pratique
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
        onOpenChange={(open) => {
          if (!open) this.handleClosePracticeDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestion des Pratiques</DialogTitle>
            <DialogDescription>
              Plage horaire : {parentTimeslot.start} - {parentTimeslot.end}
            </DialogDescription>
          </DialogHeader>
  
          {/* Ligne de temps affinée */}
          <div
            className="relative "
            style={{ height: '10px', background: '#e0e0e0' }}
          >
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
  
          {/* Légende des couleurs */}
          <div className="flex gap-4 ">
            <div className="flex items-center">
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: getColorByType('naturopathie'),
                }}
                className="mr-1"
              />
              <span>Naturopathie</span>
            </div>
            <div className="flex items-center">
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: getColorByType('acuponcture'),
                }}
                className="mr-1"
              />
              <span>Acuponcture</span>
            </div>
            <div className="flex items-center">
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: getColorByType('hypnose'),
                }}
                className="mr-1"
              />
              <span>Hypnose</span>
            </div>
          </div>
  
          {/* Liste des pratiques ajoutées (sans afficher l'heure de fin) */}
          <div className="mb-4">
            <h4 className="font-bold">Pratiques ajoutées :</h4>
            {practices.length === 0 ? (
              <p>Aucune pratique ajoutée.</p>
            ) : (
              <ul>
                {practices.map((practice, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>
                      {practice.type} : {practice.start}
                    </span>
                    <Button
                      className="bg-red-500 text-white"
                      onClick={() => this.handleRemovePractice(idx)}
                    >
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
              <div className="flex flex-row w-full justify-between item-center px-2">
                <label>
                  Type :
                  <select
                    value={newPractice.type}
                    onChange={this.handlePracticeTypeChange}
                    className="border p-1 rounded ml-2"
                  >
                    <option value="naturopathie">Naturopathie</option>
                    <option value="acuponcture">Acuponcture</option>
                    <option value="hypnose">Hypnose</option>
                  </select>
                </label>
                <label>
                  Heure de début :
                  <input
                    type="time"
                    value={newPractice.start}
                    onChange={this.handlePracticeStartChange}
                    className="border p-1 rounded ml-2"
                  />
                </label>
              </div>
              {newPractice.error && (
                <p className="text-red-500">{newPractice.error}</p>
              )}
              <Button
                className="bg-[#2b7a72] text-white"
                onClick={this.handleAddPractice}
              >
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
            <DialogDescription className="text-red-700">{errorDialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() =>
                this.setState({ errorDialog: { isOpen: false, message: '' } })
              }
            >
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
            <Button
              onClick={() =>
                this.setState({
                  successDialog: { isOpen: false, message: '' },
                })
              }
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  render() {
    const { days } = this.state;
    return (
      <div>
        <div className="flex w-full border-b-2 py-3 items-center justify-between">
          <p className="text-gray-500">Planifier la disponibilité</p>
          <Button
            type="submit"
            className="flex items-center bg-[#0f2b3d]"
            onClick={this.handleSave}
          >
            <SaveIcon /> Enregistrer
          </Button>
        </div>

        <div className="py-4">
          {/* Sélecteur de jours */}
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

          {/* Affichage des plages horaires pour les jours sélectionnés */}
          <div className="mt-4">
            {days.map((day, index) => {
              if (!day.selected) return null;
              return (
                <div key={day.name} className="mb-4 border p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Nom du jour */}
                    <div className="flex text-left items-start justify-start font-bold h-full">
                      {day.name}
                    </div>

                    {/* Plages horaires */}
                    <div className="flex flex-col h-full items-start justify-center text-center">
                      {day.times.map((time, timeIndex) => (
                        <div
                          key={timeIndex}
                          className="flex items-center justify-center gap-2 mb-2"
                        >
                          {this.renderTimeInput(index, timeIndex, 'start')}
                          <span>à</span>
                          {this.renderTimeInput(index, timeIndex, 'end')}
                          <Button
                            className="bg-red-500 text-white"
                            onClick={() =>
                              this.handleRemoveTimeSlot(index, timeIndex)
                            }
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button
                            className="bg-[#0f2b3d] text-white"
                            onClick={() =>
                              this.openPracticeDialog(index, timeIndex)
                            }
                          >
                            <CalendarClock size={16} /> Pratique (
                            {time.practices ? time.practices.length : 0})
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Bouton d'ajout */}
                    <div className="flex text-right items-start justify-end h-full">
                      <Button
                        className="flex items-center bg-[#2b7a72] text-white"
                        onClick={() => this.handleAddTimeSlot(index)}
                      >
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
        {this.renderPracticeDialog()}
      </div>
    );
  }
}

export default General;
