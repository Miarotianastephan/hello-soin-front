export const isSlotAvailable = (date, slot, requiredDuration) => {
    const slotStart = parseTime(slot.start);
    const slotEnd = parseTime(slot.end);
    const slotDuration = differenceInMinutes(slotEnd, slotStart);
    
    // Vérifier la durée minimale
    if (slotDuration < requiredDuration) return false;
    
    // Vérifier les chevauchements
    const appointmentsForSlot = appointments.filter(app => 
      app.date === date && 
      timeToMinutes(app.start) >= timeToMinutes(slot.start) &&
      timeToMinutes(app.end) <= timeToMinutes(slot.end)
    );
    
    return appointmentsForSlot.length === 0;
  };