let globalData = null;

/**
 * Remplit un select avec des options
 */
function populateSelect(selectId, options, defaultText = "Tous") {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = `<option value="all">${defaultText}</option>`;

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}

/**
 * Filtre les pays selon le continent sélectionné
 */
function getCountriesByContinent(continent) {
  if (continent === "all") {
    return globalData.countries;
  }

  const europeanCountries = [
    "Germany",
    "France",
    "United Kingdom of Great Britain and Northern Ireland",
    "Spain",
    "Italy",
    "Netherlands",
    "Poland",
    "Belgium",
    "Switzerland",
    "Ireland",
    "Portugal",
  ];

  const northAmericanCountries = ["United States of America", "Canada"];

  if (continent === "europe") {
    return globalData.countries.filter((country) =>
      europeanCountries.includes(country)
    );
  } else if (continent === "north_america") {
    return globalData.countries.filter((country) =>
      northAmericanCountries.includes(country)
    );
  }

  return globalData.countries;
}

/**
 * Met à jour les options de pays selon le continent
 */
function updateCountryOptions(continentSelectId, countrySelectId) {
  const continentSelect = document.getElementById(continentSelectId);
  const continent = continentSelect?.value || "all";

  const countries = getCountriesByContinent(continent);
  populateSelect(countrySelectId, countries, "Tous les pays");
}

/**
 * Remplit tous les filtres
 */
function populateFilters(dataContext) {
  populateSelect("country-exp", dataContext.countries, "Tous les pays");
  populateSelect("country-tech", dataContext.countries, "Tous les pays");
  populateSelect("devtype", dataContext.devTypes, "Tous les métiers");
}

/**
 * Récupère les filtres de la section expérience
 */
function getExperienceFilters() {
  return {
    continent: document.getElementById("continent-exp")?.value || "all",
    country: document.getElementById("country-exp")?.value || "all",
  };
}

/**
 * Récupère les filtres de la section compétences techniques
 */
function getTechFilters() {
  return {
    experience: document.getElementById("experience-tech")?.value || "all",
    continent: document.getElementById("continent-tech")?.value || "all",
    country: document.getElementById("country-tech")?.value || "all",
  };
}

/**
 * Récupère les filtres de la section technologies utilisées
 */
function getTechUsageFilters() {
  return {
    devType: document.getElementById("devtype")?.value || "all",
    continent: document.getElementById("continent-tech-usage")?.value || "all",
    topN: parseInt(document.getElementById("top-n")?.value || "5"),
  };
}

/**
 * Met à jour les graphiques de la section expérience
 */
function updateExperienceSection() {
  const filters = getExperienceFilters();
  updateExperienceChart(globalData.data, filters);
  updateEducationChart(globalData.data, filters);
}

/**
 * Met à jour les graphiques de la section compétences techniques
 */
function updateTechSection() {
  const filters = getTechFilters();
  updateCloudChart(globalData.data, filters);
  updateFrameworksChart(globalData.data, filters);
}

/**
 * Met à jour les graphiques de la section technologies utilisées
 */
function updateTechUsageSection() {
  const filters = getTechUsageFilters();
  updateOSChart(globalData.data, filters, filters.topN);
  updateCommunicationChart(globalData.data, filters, filters.topN);
}

/**
 * Attache les event listeners sur les filtres
 */
function attachFilterListeners() {
  // Section expérience - Continent change
  const continentExp = document.getElementById("continent-exp");
  if (continentExp) {
    continentExp.addEventListener("change", () => {
      updateCountryOptions("continent-exp", "country-exp");
      updateExperienceSection();
    });
  }

  // Section expérience - Country change
  const countryExp = document.getElementById("country-exp");
  if (countryExp) {
    countryExp.addEventListener("change", updateExperienceSection);
  }

  // Section compétences techniques - Continent change
  const continentTech = document.getElementById("continent-tech");
  if (continentTech) {
    continentTech.addEventListener("change", () => {
      updateCountryOptions("continent-tech", "country-tech");
      updateTechSection();
    });
  }

  // Section compétences techniques - autres filtres
  ["experience-tech", "country-tech"].forEach((filterId) => {
    const filter = document.getElementById(filterId);
    if (filter) {
      filter.addEventListener("change", updateTechSection);
    }
  });

  // Section technologies utilisées
  ["devtype", "continent-tech-usage", "top-n"].forEach((filterId) => {
    const filter = document.getElementById(filterId);
    if (filter) {
      filter.addEventListener("change", updateTechUsageSection);
    }
  });
}

/**
 * Crée tous les graphiques initiaux
 */
function initializeAllCharts() {
  // Section expérience
  const expFilters = getExperienceFilters();
  createExperienceChart(globalData.data, expFilters);
  createEducationChart(globalData.data, expFilters);

  // Section compétences techniques
  const techFilters = getTechFilters();
  createCloudChart(globalData.data, techFilters);
  createFrameworksChart(globalData.data, techFilters);

  // Section technologies utilisées
  const techUsageFilters = getTechUsageFilters();
  createOSChart(globalData.data, techUsageFilters, techUsageFilters.topN);
  createCommunicationChart(
    globalData.data,
    techUsageFilters,
    techUsageFilters.topN
  );
}

/**
 * Affiche un loader
 */
function showLoader() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    '<div id="loader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;"><div style="background: white; padding: 30px; border-radius: 10px;"><h3>Chargement des données...</h3></div></div>'
  );
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    showLoader();

    globalData = await initializeData();

    populateFilters(globalData);

    initializeAllCharts();
    attachFilterListeners();

    hideLoader();
  } catch (error) {
    hideLoader();
    alert("Erreur lors du chargement des données. Voir la console.");
    console.error("Erreur fatale:", error);
  }
});
