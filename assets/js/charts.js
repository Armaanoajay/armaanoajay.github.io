// PIE CHART
new Chart(document.getElementById("publicationPie"), {
  type: "pie",
  data: {
    labels: ["Journal Publications", "Conference Presentations"],
    datasets: [{
      data: [11, 5],
      backgroundColor: ["#1f77b4", "#ff7f0e"]
    }]
  }
});
