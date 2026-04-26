// Add lote row
function addLote() {
  const table = document.getElementById("lotesTable");
  const row = table.insertRow();
  const index = table.rows.length - 1;

  row.innerHTML = `
    <td>${index}</td>
    <td><input type="number" value="0"></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  `;
}

// Add container row
function addContainer() {
  const table = document.getElementById("contTable");
  const row = table.insertRow();

  row.innerHTML = `<td><input type="number" value="0"></td>`;
}

// Main calculation (LOSS ONLY)
function calculate() {

  // Inputs (FIXED)
  const gal = parseFloat(document.getElementById("galPerBarrel").value) || 0;
  const lees = parseFloat(document.getElementById("lees").value) || 0;
  const targetVal = parseFloat(document.getElementById("target").value) || 0;

  const table = document.getElementById("lotesTable");
  const rows = table.rows;

  // Total barrels
  let totalBarrels = 0;
  for (let i = 1; i < rows.length; i++) {
    const val = parseFloat(rows[i].cells[1].children[0].value) || 0;
    totalBarrels += val;
  }

  let baseTotal = 0;

  // First pass (Base + Lees)
  for (let i = 1; i < rows.length; i++) {

    const barrels = parseFloat(rows[i].cells[1].children[0].value) || 0;

    const base = barrels * gal;
    const leesShare = totalBarrels ? -(barrels / totalBarrels) * lees : 0;
    const adjusted = base + leesShare;

    rows[i].cells[2].innerText = base.toFixed(1);
    rows[i].cells[3].innerText = leesShare.toFixed(1);
    rows[i].cells[4].innerText = adjusted.toFixed(1);

    baseTotal += adjusted;
  }

  // Containers total
  const contRows = document.getElementById("contTable").rows;
  let contTotal = 0;

  for (let i = 1; i < contRows.length; i++) {
    const val = parseFloat(contRows[i].cells[0].children[0].value) || 0;
    contTotal += val;
  }

  // LOSS ONLY logic
  let lossTotal = (baseTotal + contTotal) - targetVal;

  if (lossTotal < 0) {
    lossTotal = 0; // no gain allowed
  }

  let accumulated = 0;

  // Second pass (apply loss)
  for (let i = 1; i < rows.length; i++) {

    const adjusted = parseFloat(rows[i].cells[4].innerText) || 0;

    const loss = baseTotal ? (adjusted / baseTotal) * lossTotal : 0;
    const total = adjusted - loss;

    accumulated += total;

    rows[i].cells[5].innerHTML =
      loss > 0 ? `<span class="loss">${loss.toFixed(1)}</span>` : "0.0";

    rows[i].cells[6].innerText = total.toFixed(1);
  }

  const finalTotal = accumulated + contTotal;
  const check = finalTotal - targetVal;

  // Report
  document.getElementById("report").innerHTML = `
    <h3>Resumen</h3>
    <p>Total Lotes: <b>${accumulated.toFixed(1)}</b></p>
    <p>Contenedores: <b>${contTotal.toFixed(1)}</b></p>
    <p>Final: <b>${finalTotal.toFixed(1)}</b></p>
    <p>Target: <b>${targetVal}</b></p>
    <p>Status: 
      <span class="${Math.abs(check) < 0.1 ? 'good' : 'bad'}">
        ${check.toFixed(1)}
      </span>
    </p>
  `;
}