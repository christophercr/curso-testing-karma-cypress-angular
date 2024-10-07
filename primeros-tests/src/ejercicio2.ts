/**
 * Devuelve un nuevo array que contiene solo aquellos elementos del `newArray` que no existen ya en el `existingArray`.
 *
 * @param newArray - Array que contiene elementos "nuevos" (posiblemente duplicados con los del `existingArray`)
 * @param existingArray - Array que contiene los elementos originales para comparar duplicados
 * @param uniqueKey - Propiedad que identificará de manera única cada elemento en los arrays
 *
 * @returns El nuevo array que contiene solo aquellos elementos del `newArray` que no existen ya en el `existingArray`
 */
export function removeDuplicatesByKey<T>(newArray: T[] | undefined, existingArray: T[], uniqueKey: keyof T): T[] {
  if (!newArray || newArray.length === 0) {
    return [];
  }

  if (existingArray.length === 0) {
    return [...newArray];
  }

  return newArray.filter((item) => {
    return !existingArray.some((existingItem) => {
      return item[uniqueKey] === existingItem[uniqueKey];
    });
  });
}

/*
const firstArray = [
  { id: 1, name: "primero" },
  { id: 3, name: "tercero" },
  { id: 5, name: "quinto" },
];
const secondArray = [
  { id: 1, name: "primero" },
  { id: 2, name: "segundo" },
  { id: 3, name: "tercero" },
  { id: 4, name: "cuarto" },
  { id: 5, name: "quinto" },
];

const uniqueArray = removeDuplicatesByKey(secondArray, firstArray, "id");
console.log(
  "Elementos de secondArray que no están en firstArray",
  uniqueArray.map((item) => item.id),
);
*/
