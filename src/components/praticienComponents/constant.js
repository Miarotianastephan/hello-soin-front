
function convertToEuroFormat(tarif){
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tarif)
  }

const UNITE_MINUTE = "minutes";

export {
    convertToEuroFormat,
    UNITE_MINUTE,
}