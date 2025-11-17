// dataLoader.js - Chargement des données

const dataCache = {
  europe: null,
  northAmerica: null,
  allData: null,
};

const DATA_PATHS = {
  europe: "data/survey_results_WE.json",
  northAmerica: "data/survey_results_NA.json",
};

/**
 * Charge un fichier JSON
 */
async function loadJSON(filepath) {
  try {
    console.log(`Chargement de ${filepath}...`);
    const response = await fetch(filepath);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(`${filepath} chargé (${data.length} entrées)`);
    return data;
  } catch (error) {
    console.error(`Impossible de charger ${filepath}`);
    if (error) console.error("Détails:", error);
    throw error;
  }
}

/**
 * Charge les données européennes
 */
async function loadEuropeData(forceReload = false) {
  if (dataCache.europe && !forceReload) {
    return dataCache.europe;
  }
  const data = await loadJSON(DATA_PATHS.europe);
  dataCache.europe = data;
  return data;
}

/**
 * Charge les données nord-américaines
 */
async function loadNorthAmericaData(forceReload = false) {
  if (dataCache.northAmerica && !forceReload) {
    return dataCache.northAmerica;
  }
  const data = await loadJSON(DATA_PATHS.northAmerica);
  dataCache.northAmerica = data;
  return data;
}

/**
 * Charge toutes les données
 */
async function loadAllData(forceReload = false) {
  if (dataCache.allData && !forceReload) {
    return dataCache.allData;
  }

  const [europeData, northAmericaData] = await Promise.all([
    loadEuropeData(forceReload),
    loadNorthAmericaData(forceReload),
  ]);

  const allData = [...europeData, ...northAmericaData];
  dataCache.allData = allData;
  console.log(`Toutes les données chargées: ${allData.length} entrées`);
  return allData;
}

/**
 * Extrait les listes pour les filtres
 */
function getCountriesList(data) {
  return getUniqueValues(data, "Country");
}

function getDevTypesList(data) {
  const allDevTypes = data
    .filter((entry) => entry.DevType)
    .flatMap((entry) => parseMultipleValues(entry.DevType));
  return [...new Set(allDevTypes)].sort();
}

/**
 * Initialise et retourne toutes les données avec métadonnées
 */
async function initializeData() {
  try {
    console.log("Initialisation...");
    const allData = await loadAllData();

    return {
      data: allData,
      countries: getCountriesList(allData),
      devTypes: getDevTypesList(allData),
    };
  } catch (error) {
    console.error("Échec de l'initialisation");
    if (error) console.error("Détails:", error);
    throw error;
  }
}
