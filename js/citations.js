// citations.js — loads data/citations_raw.json (written by GitHub Action) or falls back to sample

function extractYearCitations(obj){
  function isYearCiteArray(a){
    return Array.isArray(a) && a.length>0 && typeof a[0] === 'object' && ('year' in a[0] || 'citations' in a[0]);
  }
  const seen = new Set();
  function recurse(o){
    if(!o || typeof o !== 'object' || seen.has(o)) return null;
    seen.add(o);
    if(isYearCiteArray(o)) return o.map(item=>({year:String(item.year||item[0]||''),count:Number(item.citations||item.count||item[1]||0)}));
    if(Array.isArray(o)){
      for(const it of o){ const r=recurse(it); if(r) return r; }
    } else {
      if(('years' in o) && ('citations' in o) && Array.isArray(o.years) && Array.isArray(o.citations)){
        return o.years.map((y,i)=>({year:String(y),count:Number(o.citations[i]||0)}));
      }
      for(const k of Object.keys(o)){
        const r=recurse(o[k]); if(r) return r;
      }
    }
    return null;
  }
  return recurse(obj);
}

async function loadCitationsAndRender(){
  // try raw
  try{
    const resp = await fetch('/data/citations_raw.json',{cache:'no-store'});
    if(resp.ok){
      const json = await resp.json();
      if(json.author && json.author.h_index) document.getElementById('hindex').textContent = json.author.h_index;
      const pairs = extractYearCitations(json);
      if(pairs && pairs.length>0){ renderBarChart(pairs); document.getElementById('updatedAt').textContent = 'Updated: data/citations_raw.json'; return; }
    }
  }catch(e){ console.warn('raw load failed',e); }

  // fallback
  try{
    const resp = await fetch('/data/sample_citations.json');
    const sample = await resp.json();
    const pairs = extractYearCitations(sample) || sample;
    renderBarChart(pairs);
    document.getElementById('updatedAt').textContent = 'Updated: sample data';
  }catch(e){ document.getElementById('updatedAt').textContent = 'No citation data available'; }
}

function renderBarChart(pairs){
  pairs.sort((a,b)=>Number(a.year)-Number(b.year));
  const labels = pairs.map(p=>p.year);
  const counts = pairs.map(p=>p.count);
  const ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx,{type:'bar',data:{labels, datasets:[{label:'Citations',data:counts}]}, options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}});
}

// static pie
function renderPie(){
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  new Chart(pieCtx, {type:'pie', data:{labels:['Journal (11)','Conference (5)'], datasets:[{data:[11,5]}]}, options:{plugins:{legend:{position:'bottom'}}}});
}

// initialize
window.addEventListener('DOMContentLoaded', ()=>{ renderPie(); loadCitationsAndRender(); });
