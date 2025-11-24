// dataProcessor.js - Traitement et agrégation des données

/**
 * Filtre les données selon les critères
 */
function filterData(data, filters) {
  return data.filter((entry) => {
    // Filtre continent
    if (filters.continent && filters.continent !== "all") {
      if (filters.continent === "europe") {
        const europeanCountries = [
          "Germany",
          "France",
          "United Kingdom",
          "Spain",
          "Italy",
          "Netherlands",
          "Poland",
          "Sweden",
          "Belgium",
          "Switzerland",
          "Austria",
          "Norway",
          "Denmark",
          "Finland",
          "Ireland",
          "Portugal",
          "Czech Republic",
          "Romania",
          "Greece",
          "Hungary",
        ];
        if (!europeanCountries.includes(entry.Country)) return false;
      } else if (filters.continent === "north_america") {
        const northAmericanCountries = [
          "United States of America",
          "Canada",
          "Mexico",
        ];
        if (!northAmericanCountries.includes(entry.Country)) return false;
      }
    }

    // Filtre pays
    if (filters.country && filters.country !== "all") {
      if (entry.Country !== filters.country) return false;
    }

    // Filtre années d'expérience
    if (filters.experience && filters.experience !== "all") {
      const yearsCodePro = entry.YearsCodePro;
      if (!yearsCodePro) return false;

      if (filters.experience === "0-2") {
        if (
          !yearsCodePro.includes("Less than 1") &&
          !yearsCodePro.includes("1") &&
          !yearsCodePro.includes("2")
        ) {
          return false;
        }
      } else if (filters.experience === "3-5") {
        if (
          !yearsCodePro.includes("3") &&
          !yearsCodePro.includes("4") &&
          !yearsCodePro.includes("5")
        ) {
          return false;
        }
      } else if (filters.experience === "6-10") {
        if (
          !yearsCodePro.includes("6") &&
          !yearsCodePro.includes("7") &&
          !yearsCodePro.includes("8") &&
          !yearsCodePro.includes("9") &&
          !yearsCodePro.includes("10")
        ) {
          return false;
        }
      } else if (filters.experience === "11+") {
        if (
          !yearsCodePro.includes("More than") &&
          !yearsCodePro.includes("11") &&
          !yearsCodePro.includes("12") &&
          !yearsCodePro.includes("15") &&
          !yearsCodePro.includes("20")
        ) {
          return false;
        }
      }
    }

    if (filters.devType && filters.devType !== "all") {
      if (!entry.DevType || !entry.DevType.includes(filters.devType)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calcule la moyenne d'un tableau de nombres
 */
function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const validNumbers = numbers.filter((n) => !isNaN(n) && n > 0);
  if (validNumbers.length === 0) return 0;
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / validNumbers.length);
}

/**
 * Convertit un salaire en euros
 */
function convertToEuro(salary, currency) {
  if (!salary || !currency) return 0;

  const rates = {
    USD: 0.92,
    GBP: 1.17,
    CAD: 0.68,
    EUR: 1.0,
    CHF: 1.05,
    SEK: 0.088,
    NOK: 0.087,
    DKK: 0.134,
    PLN: 0.23,
    INR: 0.011,
    MXN: 0.051,
  };

  const rate = rates[currency] || 1.0;
  return Math.round(salary * rate);
}

/**
 * Extrait le salaire en euros d'une entrée
 */
function getSalaryInEuro(entry) {
  if (entry.ConvertedCompYearly) {
    return convertToEuro(parseFloat(entry.ConvertedCompYearly), "USD");
  }

  if (entry.CompTotal && entry.Currency) {
    return convertToEuro(parseFloat(entry.CompTotal), entry.Currency);
  }

  return 0;
}

/**
 * Normalise les années d'expérience
 */
function normalizeExperience(yearsCodePro) {
  if (!yearsCodePro) return null;

  const exp = yearsCodePro.toLowerCase();

  if (exp.includes("less than 1")) return "0-1";
  if (exp.includes("1") && !exp.includes("10")) return "1-2";
  if (exp.includes("2")) return "1-2";
  if (exp.includes("3")) return "3-5";
  if (exp.includes("4")) return "3-5";
  if (exp.includes("5")) return "3-5";
  if (exp.includes("6")) return "6-10";
  if (exp.includes("7")) return "6-10";
  if (exp.includes("8")) return "6-10";
  if (exp.includes("9")) return "6-10";
  if (exp.includes("10")) return "6-10";
  if (exp.includes("11")) return "11-15";
  if (exp.includes("12")) return "11-15";
  if (exp.includes("13")) return "11-15";
  if (exp.includes("14")) return "11-15";
  if (exp.includes("15")) return "11-15";
  if (
    exp.includes("more than") ||
    exp.includes("20") ||
    exp.includes("30") ||
    exp.includes("40") ||
    exp.includes("50")
  ) {
    return "15+";
  }

  return null;
}

/**
 * 1. Calcule le revenu moyen par années d'expérience
 */
function calculateAverageSalaryByExperience(data, filters) {
  const filteredData = filterData(data, filters);

  const experienceGroups = {
    "0-1": [],
    "1-2": [],
    "3-5": [],
    "6-10": [],
    "11-15": [],
    "15+": [],
  };

  filteredData.forEach((entry) => {
    const salary = getSalaryInEuro(entry);
    if (salary <= 0 || salary > 500000) return;

    const expCategory = normalizeExperience(entry.YearsCodePro);
    if (expCategory && experienceGroups[expCategory]) {
      experienceGroups[expCategory].push(salary);
    }
  });

  const result = {
    labels: [],
    values: [],
  };

  Object.keys(experienceGroups).forEach((category) => {
    const salaries = experienceGroups[category];
    if (salaries.length > 0) {
      result.labels.push(`${category} ans`);
      result.values.push(calculateAverage(salaries));
    }
  });

  return result;
}

/**
 * 2. Calcule le revenu moyen par niveau d'études
 */
function calculateAverageSalaryByEducation(data, filters) {
  const filteredData = filterData(data, filters);

  const educationGroups = {};

  filteredData.forEach((entry) => {
    const salary = getSalaryInEuro(entry);
    if (salary <= 0 || salary > 500000) return;

    const education = entry.EdLevel;
    if (!education) return;

    if (!educationGroups[education]) {
      educationGroups[education] = [];
    }
    educationGroups[education].push(salary);
  });

  const result = {
    labels: [],
    values: [],
  };

  Object.entries(educationGroups)
    .sort((a, b) => calculateAverage(b[1]) - calculateAverage(a[1]))
    .forEach(([education, salaries]) => {
      if (salaries.length > 5) {
        result.labels.push(education);
        result.values.push(calculateAverage(salaries));
      }
    });

  return result;
}

/**
 * 3. Calcule le revenu moyen par plateforme cloud
 */
function calculateAverageSalaryByCloudPlatform(data, filters) {
  const filteredData = filterData(data, filters);

  const platformGroups = {};

  filteredData.forEach((entry) => {
    const salary = getSalaryInEuro(entry);
    if (salary <= 0 || salary > 500000) return;

    const platforms = entry.PlatformHaveWorkedWith;
    if (!platforms) return;

    const platformList = parseMultipleValues(platforms);
    platformList.forEach((platform) => {
      if (!platformGroups[platform]) {
        platformGroups[platform] = [];
      }
      platformGroups[platform].push(salary);
    });
  });

  const result = {
    labels: [],
    values: [],
  };

  Object.entries(platformGroups)
    .filter(([_, salaries]) => salaries.length >= 10)
    .sort((a, b) => calculateAverage(b[1]) - calculateAverage(a[1]))
    .slice(0, 10)
    .forEach(([platform, salaries]) => {
      result.labels.push(platform);
      result.values.push(calculateAverage(salaries));
    });

  return result;
}

/**
 * 4. Calcule le revenu moyen par framework web
 */
function calculateAverageSalaryByWebFramework(data, filters) {
  const filteredData = filterData(data, filters);

  const frameworkGroups = {};

  filteredData.forEach((entry) => {
    const salary = getSalaryInEuro(entry);
    if (salary <= 0 || salary > 500000) return;

    const frameworks = entry.WebframeHaveWorkedWith;
    if (!frameworks) return;

    const frameworkList = parseMultipleValues(frameworks);
    frameworkList.forEach((framework) => {
      if (!frameworkGroups[framework]) {
        frameworkGroups[framework] = [];
      }
      frameworkGroups[framework].push(salary);
    });
  });

  const result = {
    labels: [],
    values: [],
  };

  Object.entries(frameworkGroups)
    .filter(([_, salaries]) => salaries.length >= 10)
    .sort((a, b) => calculateAverage(b[1]) - calculateAverage(a[1]))
    .slice(0, 10)
    .forEach(([framework, salaries]) => {
      result.labels.push(framework);
      result.values.push(calculateAverage(salaries));
    });

  return result;
}

/**
 * 5. Calcule le top N des systèmes d'exploitation
 */
function calculateTopOperatingSystems(data, filters, topN = 5) {
  const filteredData = filterData(data, filters);
  const osCounts = {};
  filteredData.forEach((entry) => {
    const os = entry.OpSysProfessionaluse;
    if (!os) return;

    const osList = parseMultipleValues(os);
    osList.forEach((system) => {
      osCounts[system] = (osCounts[system] || 0) + 1;
    });
  });

  const result = {
    labels: [],
    values: [],
  };

  Object.entries(osCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .forEach(([os, count]) => {
      result.labels.push(os);
      result.values.push(count);
    });

  return result;
}

/**
 * 6. Calcule le top N des outils de communication
 */
function calculateTopCommunicationTools(data, filters, topN = 5) {
  const filteredData = filterData(data, filters);

  const toolCounts = {};

  filteredData.forEach((entry) => {
    const tools = entry.OfficeStackAsyncHaveWorkedWith;
    if (!tools) return;

    const toolList = parseMultipleValues(tools);
    toolList.forEach((tool) => {
      toolCounts[tool] = (toolCounts[tool] || 0) + 1;
    });
  });

  const result = {
    labels: [],
    values: [],
  };

  Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .forEach(([tool, count]) => {
      result.labels.push(tool);
      result.values.push(count);
    });

  return result;
}
