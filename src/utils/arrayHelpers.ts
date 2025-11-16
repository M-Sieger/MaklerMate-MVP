/**
 * @fileoverview Array Helper Functions
 *
 * ZWECK:
 * - Hilfsfunktionen für Array-Manipulation
 * - Immutable Operations
 * - Type-safe
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

/**
 * Bewegt ein Element im Array um eine Position nach oben
 *
 * @param array - Ursprüngliches Array
 * @param index - Index des zu verschiebenden Elements
 * @returns Neues Array mit vertauschtem Element
 *
 * @example
 * moveItemUp([1, 2, 3], 1) // [2, 1, 3]
 */
export function moveItemUp<T>(array: T[], index: number): T[] {
  if (index <= 0) return array;
  const newArray = [...array];
  [newArray[index - 1], newArray[index]] = [
    newArray[index],
    newArray[index - 1],
  ];
  return newArray;
}

/**
 * Bewegt ein Element im Array um eine Position nach unten
 *
 * @param array - Ursprüngliches Array
 * @param index - Index des zu verschiebenden Elements
 * @returns Neues Array mit vertauschtem Element
 *
 * @example
 * moveItemDown([1, 2, 3], 0) // [2, 1, 3]
 */
export function moveItemDown<T>(array: T[], index: number): T[] {
  if (index >= array.length - 1) return array;
  const newArray = [...array];
  [newArray[index], newArray[index + 1]] = [
    newArray[index + 1],
    newArray[index],
  ];
  return newArray;
}

/**
 * Entfernt ein Element an gegebenem Index
 *
 * @param array - Ursprüngliches Array
 * @param index - Index des zu entfernenden Elements
 * @returns Neues Array ohne Element
 *
 * @example
 * removeItem([1, 2, 3], 1) // [1, 3]
 */
export function removeItem<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
}

/**
 * Fügt ein Element an gegebenem Index ein
 *
 * @param array - Ursprüngliches Array
 * @param index - Index für Einfügung
 * @param item - Einzufügendes Element
 * @returns Neues Array mit eingefügtem Element
 *
 * @example
 * insertItem([1, 3], 1, 2) // [1, 2, 3]
 */
export function insertItem<T>(array: T[], index: number, item: T): T[] {
  const newArray = [...array];
  newArray.splice(index, 0, item);
  return newArray;
}
