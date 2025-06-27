// utils/arrayHelpers.js

/**
 * 🔼 Bewegt ein Element im Array um eine Position nach oben
 * @param {Array} array Ursprüngliches Array
 * @param {number} index Index des zu verschiebenden Elements
 * @returns {Array} Neues Array mit vertauschtem Element
 */
export function moveItemUp(array, index) {
  if (index <= 0) return array;
  const newArray = [...array];
  [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
  return newArray;
}

/**
 * 🔽 Bewegt ein Element im Array um eine Position nach unten
 * @param {Array} array Ursprüngliches Array
 * @param {number} index Index des zu verschiebenden Elements
 * @returns {Array} Neues Array mit vertauschtem Element
 */
export function moveItemDown(array, index) {
  if (index >= array.length - 1) return array;
  const newArray = [...array];
  [newArray[index + 1], newArray[index]] = [newArray[index], newArray[index + 1]];
  return newArray;
}


// 🔁 Element im Array verschieben (Index A zu B)
export function moveItem(array, from, to) {
  const newArray = [...array];
  const item = newArray.splice(from, 1)[0];
  newArray.splice(to, 0, item);
  return newArray;
}
