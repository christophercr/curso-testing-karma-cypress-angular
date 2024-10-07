/**
 * Redondea el tiempo dado al minuto más cercano.
 *
 * @param time - El tiempo a redondear
 * @param roundUp - Si redondear hacia arriba o hacia abajo
 *
 * @returns El tiempo redondeado al minuto más cercano según la resolución dada
 */
export function roundToMinuteRange(time: number, roundUp = false): number {
  const minuteInMillis = 60_000; // = 60 * 1000

  // Redondear hacia arriba o hacia abajo al minuto más cercano
  if (roundUp) {
    return Math.ceil(time / minuteInMillis) * minuteInMillis;
  } else {
    return Math.floor(time / minuteInMillis) * minuteInMillis;
  }
}

/*
const currentTimestamp = Date.now();
const nextMinute = roundToMinuteRange(currentTimestamp, true);
const currentMinute = roundToMinuteRange(currentTimestamp);
console.log(`Minuto siguiente de la hora actual: ${new Date(nextMinute).getMinutes()}`);
console.log(`Minuto de la hora actual: ${new Date(currentMinute).getMinutes()}`);
*/
