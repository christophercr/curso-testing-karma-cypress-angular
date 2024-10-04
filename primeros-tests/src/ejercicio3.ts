/**
 * Convierte los segundos dados a una fecha formateada en HMS (horas, minutos y segundos)
 *
 * @param seconds - el número de segundos a formatear
 * @param twoDigitsHMS - si la fecha debe formatearse usando 2 dígitos para horas, minutos y segundos
 *
 * @returns La cadena formateada con horas, minutos y segundos
 */
function secondsToHMS(seconds: number, twoDigitsHMS = false): string {
  const numericSeconds = Number(seconds);
  const h = Math.floor(numericSeconds / 3_600);
  const m = Math.floor((numericSeconds % 3_600) / 60);
  const s = Math.floor((numericSeconds % 3_600) % 60);

  let hDisplay = "";
  let mDisplay = "";
  let sDisplay = "";

  if (twoDigitsHMS) {
    hDisplay = h > 0 ? `00${h}`.slice(-2) + " h " : "";
    mDisplay = m > 0 ? `00${m}`.slice(-2) + " m " : "";
    sDisplay = s > 0 ? `00${s}`.slice(-2) + " s" : "";
  } else {
    hDisplay = h > 0 ? `${h} h ` : "";
    mDisplay = m > 0 ? `${m} m ` : "";
    sDisplay = s > 0 ? `${s} s` : "";
  }

  return hDisplay + mDisplay + sDisplay;
}

const seconds = 3_600;
const time = secondsToHMS(seconds);
console.log(`${seconds} segundos equivalen a "${time}"`);
