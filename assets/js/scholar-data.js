fetch("assets/data/scholar.json")
  .then(res => res.json())
  .then(data => {
    new Chart(document.getElementById("citationsBar"), {
      type: "bar",
      data: {
        labels: data.years,
        datasets: [{
          label: "Citations",
          data: data.citations,
          backgroundColor: "#2ca02c"
        }]
      }
    });
  });
