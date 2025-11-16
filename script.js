/* script.js
 - renders publications (with IF + DOI),
 - computes cumulative IF,
 - fetches citations.json and draws Chart.js bar chart
*/

const publicationsData = [
  { title: "QDeepColonNet: A Quantum-Based Deep Learning Network for Colorectal Cancer Classification", venue: "Springer (Artificial Intelligence Review)", if: 13.9, doi: "10.1007/s10462-025-11295-7" },
  { title: "LeafVisionNet: Classification of Black Gram Leaf Disease", venue: "Elsevier (Smart Agricultural Technology)", if: 5.7, doi: "10.1016/j.atech.2025.101245" },
  { title: "An Explainable DFU Model Using Swin Transformer", venue: "Scientific Reports (Springer Nature)", if: 3.9, doi: "10.1038/s41598-025-87519-1" },
  { title: "Explainable Sorghum Weed Classification (MS-FE DenseNet)", venue: "IEEE Access", if: 3.6, doi: "10.1109/ACCESS.2025.3538937" },
  { title: "Dense-ShuffleGCANet: DFU Classification", venue: "IEEE Access", if: 3.6, doi: "10.1109/ACCESS.2024.3524549" },
  { title: "Crop Disease & Pest Classification (Swin + Fusion)", venue: "IEEE Access", if: 3.6, doi: "10.1109/ACCESS.2024.3481675" },
  { title: "Environmental Microorganism Classification", venue: "IEEE Access", if: 3.6, doi: "10.1109/ACCESS.2024.3462592" },
  { title: "DeepCRC-Net: Colorectal Cancer Classification", venue: "IEEE Access", if: 3.6, doi: "10.1109/ACCESS.2025.3550004" },
  { title: "FishFusionNet: Fish Species Identification", venue: "Springer (Signal, Image and Video Processing)", if: 2.0, doi: "10.1007/s11760-025-04250-0" },
  { title: "Virus-FusionNet: Virus Classification from TEM", venue: "IOP (Engineering Research Express)", if: 1.6, doi: "10.1088/2631-8695/adf411" }
];

function renderPublications() {
  const pubContainer = document.getElementById('publications');
  pubContainer.innerHTML = '';
  let cumulative = 0;
  publicationsData.forEach(pub => {
    cumulative += (parseFloat(pub.if) || 0);
    const div = document.createElement('div');
    div.className = 'pub-item';
    div.innerHTML = `
      <div class="pub-title">${escapeHtml(pub.title)}</div>
      <div class="pub-meta">
        <div>${escapeHtml(pub.venue)}</div>
        <div class="badge">IF: ${pub.if}</div>
        <div><a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener">${pub.doi}</a></div>
      </div>
    `;
    pubContainer.appendChild(div);
  });
  const cumEl = document.getElementById('cumulativeIF');
  cumEl.textContent = cumulative.toFixed(1);
}

// simple HTML escape helper
function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

async function renderCitationsChart() {
  const chartEl = document.getElementById('citationsChart').getContext('2d');
  try {
    const resp = await fetch('citations.json', {cache: "no-store"});
    if (!resp.ok) throw new Error('No citations.json (yet)');
    const data = await resp.json();
    // data might be { "cited_by_year": {...} } or direct year->count map; handle both
    const yearsMap = data.cited_by_year || data;
    const years = Object.keys(yearsMap).sort();
    const counts = years.map(y => Number(yearsMap[y] || 0));

    // If no data, show placeholder
    if (years.length === 0) {
      chartEl.canvas.parentNode.innerHTML = '<p class="note">Citations data not found yet. Run the GitHub Action or wait for the scheduled run.</p>';
      return;
    }

    // create chart
    new Chart(chartEl, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Citations per year',
          data: counts,
          backgroundColor: 'rgba(11,99,213,0.8)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { precision:0 } }
        }
      }
    });

  } catch (err) {
    // show friendly message
    chartEl.canvas.parentNode.innerHTML = `<p class="note">Unable to load citations.json yet. ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderPublications();
  renderCitationsChart();
  document.getElementById('generatedYear').textContent = new Date().getFullYear();
});
