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

  console.log(`Select "${selectId}" rempli avec ${options.length} options`);
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
    hideLoader();
    console.log("Données disponibles:", globalData);
  } catch (error) {
    hideLoader();
    alert("Erreur lors du chargement des données. Voir la console.");
    console.error("Erreur fatale :", error);
  }
});
