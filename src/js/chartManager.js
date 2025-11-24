const chartInstances = {};

/**
 * Détruit un graphique existant
 */
function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
    delete chartInstances[chartId];
  }
}

/**
 * Génère une palette de couleurs
 */
function generateColors(count) {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF6384",
    "#C9CBCF",
    "#4BC0C0",
    "#FF8C00",
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
}

/**
 * 1. Graphique du revenu moyen par expérience (LINE CHART)
 */
function createExperienceChart(data, filters) {
  const chartId = "chart-experience";
  const ctx = document.getElementById(chartId);
  if (!ctx) return;

  const chartData = calculateAverageSalaryByExperience(data, filters);
  destroyChart(chartId);

  chartInstances[chartId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Revenu moyen (€)",
          data: chartData.values,
          borderColor: "#36A2EB",
          backgroundColor: "rgba(54, 162, 235, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: "Évolution du revenu selon l'expérience",
          font: { size: 16 },
        },
        legend: { display: true, position: "top" },
        tooltip: {
          callbacks: {
            label: (context) =>
              `Revenu moyen: ${context.parsed.y.toLocaleString("fr-FR")} €`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value.toLocaleString("fr-FR") + " €",
          },
          title: { display: true, text: "Revenu annuel (€)" },
        },
        x: {
          title: { display: true, text: "Années d'expérience" },
        },
      },
    },
  });
}

/**
 * 2. Graphique du revenu moyen par niveau d'études (BAR CHART VERTICAL)
 */
function createEducationChart(data, filters) {
  const chartId = "chart-education";
  const ctx = document.getElementById(chartId);
  if (!ctx) return;

  const chartData = calculateAverageSalaryByEducation(data, filters);
  destroyChart(chartId);

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Revenu moyen (€)",
          data: chartData.values,
          backgroundColor: generateColors(chartData.labels.length),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: "Revenu moyen par niveau d'études",
          font: { size: 16 },
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `Revenu moyen: ${context.parsed.y.toLocaleString("fr-FR")} €`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value.toLocaleString("fr-FR") + " €",
          },
          title: { display: true, text: "Revenu annuel (€)" },
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    },
  });
}

/**
 * 3. Graphique du revenu moyen par plateforme cloud (BAR CHART VERTICAL)
 */
function createCloudChart(data, filters) {
  const chartId = "chart-cloud";
  const ctx = document.getElementById(chartId);
  if (!ctx) return;

  const chartData = calculateAverageSalaryByCloudPlatform(data, filters);
  destroyChart(chartId);

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Revenu moyen (€)",
          data: chartData.values,
          backgroundColor: "#4BC0C0",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: "Revenu moyen par plateforme cloud",
          font: { size: 16 },
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `Revenu moyen: ${context.parsed.y.toLocaleString("fr-FR")} €`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value.toLocaleString("fr-FR") + " €",
          },
          title: { display: true, text: "Revenu annuel (€)" },
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    },
  });
}

/**
 * 4. Graphique du revenu moyen par framework web (BAR CHART HORIZONTAL)
 */
function createFrameworksChart(data, filters) {
  const chartId = "chart-frameworks";
  const ctx = document.getElementById(chartId);
  if (!ctx) return;

  const chartData = calculateAverageSalaryByWebFramework(data, filters);
  destroyChart(chartId);

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Revenu moyen (€)",
          data: chartData.values,
          backgroundColor: "#FF9F40",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y", // Horizontal
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: "Revenu moyen par framework web",
          font: { size: 16 },
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `Revenu moyen: ${context.parsed.x.toLocaleString("fr-FR")} €`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value.toLocaleString("fr-FR") + " €",
          },
          title: { display: true, text: "Revenu annuel (€)" },
        },
      },
    },
  });
}

/**
 * 5. Graphique des systèmes d'exploitation (DOUGHNUT CHART)
 */
function createOSChart(data, filters, topN = 5) {
  const chartId = "chart-os";
  const ctx = document.getElementById(chartId);
  if (!ctx) return;

  const chartData = calculateTopOperatingSystems(data, filters, topN);
  destroyChart(chartId);

  chartInstances[chartId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Nombre d'utilisateurs",
          data: chartData.values,
          backgroundColor: generateColors(chartData.labels.length),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: `Top ${topN} des systèmes d'exploitation`,
          font: { size: 16 },
        },
        legend: { display: true, position: "right" },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.label}: ${context.parsed} utilisateurs`,
          },
        },
      },
    },
  });
}

/**
 * 6. Graphique des outils de communication (RADAR CHART)
 */
function createCommunicationChart(data, filters, topN = 5) {
  const chartId = "chart-communication";
  const ctx = document.getElementById(chartId);
  if (!ctx) return;

  const chartData = calculateTopCommunicationTools(data, filters, topN);
  destroyChart(chartId);

  chartInstances[chartId] = new Chart(ctx, {
    type: "radar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Nombre d'utilisateurs",
          data: chartData.values,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "#9966FF",
          borderWidth: 2,
          pointBackgroundColor: "#9966FF",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#9966FF",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: `Top ${topN} des outils de communication`,
          font: { size: 16 },
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.label}: ${context.parsed.r} utilisateurs`,
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize: 500,
          },
        },
      },
    },
  });
}

/**
 * Fonctions de mise à jour
 */
function updateExperienceChart(data, filters) {
  createExperienceChart(data, filters);
}

function updateEducationChart(data, filters) {
  createEducationChart(data, filters);
}

function updateCloudChart(data, filters) {
  createCloudChart(data, filters);
}

function updateFrameworksChart(data, filters) {
  createFrameworksChart(data, filters);
}

function updateOSChart(data, filters, topN) {
  createOSChart(data, filters, topN);
}

function updateCommunicationChart(data, filters, topN) {
  createCommunicationChart(data, filters, topN);
}
