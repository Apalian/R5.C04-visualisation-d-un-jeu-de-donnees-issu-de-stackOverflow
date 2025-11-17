/**
 * Extrait les valeurs uniques d'un tableau
 */
function getUniqueValues(array, key = null) {
  if (!array || array.length === 0) {
    return [];
  }

  let values;
  if (key) {
    values = array.map((item) => item[key]).filter((v) => v);
  } else {
    values = array.filter((v) => v);
  }

  return [...new Set(values)].sort();
}

/**
 * Parse une chaîne contenant plusieurs valeurs séparées
 */
function parseMultipleValues(str, delimiter = ";") {
  if (!str) return [];
  return str
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function logError(message, error = null) {
  console.error(`${message}`);
  if (error) console.error("Détails:", error);
}
