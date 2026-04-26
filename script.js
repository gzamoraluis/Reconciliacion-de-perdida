function addLote() {
  let table = document.getElementById("lotesTable");
  let row = table.insertRow();
  let i = table.rows.length - 1;

  row.innerHTML = `
    <td>${i}</td>
    <td><input type="number" value="0"></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  `;
}

function addContainer() {
  let table = document.getElementById("contTable");
  let row = table.insertRow();
  row.innerHTML = `<td><input type="number" value="0"></td>`;
}

function calculate() {

  let gal = parseFloat(galPerBarrel.value);
  let lees = parseFloat(lees.value);
  let target = parseFloat(target.value);

  let rows = lotesTable.rows;

  let totalBr = 0;
  for (let i = 1; i < rows.length; i++) {
    totalBr += parseFloat(rows[i].cells[1].children[0].value) || 0;
  }

  let baseTotal = 0;

  for (let i = 1; i < rows.length; i++) {
    let br = parseFloat(rows[i].cells[1].children[0].value) || 0;

    let base = br * gal;
    let l = totalBr ? -(br / totalBr) * lees : 0;
    let adj = base + l;

    rows[i].cells[2].innerText = base.toFixed(1);
    rows[i].cells[3].innerText = l.toFixed(1);
    rows[i].cells[4].innerText = adj.toFixed(1);

    baseTotal += adj;
  }

  let contTotal = 0;
  let cRows = contTable.rows;
  for (let i = 1; i < cRows.length; i++) {
    contTotal += parseFloat(cRows[i].cells[0].children[0].value) || 0;
  }

  let lossTotal = (baseTotal + contTotal) - target;
  if (lossTotal < 0) lossTotal = 0;

  let acc = 0;

  for (let i = 1; i < rows.length; i++) {
    let adj = parseFloat(rows[i].cells[4].innerText) || 0;

    let loss = baseTotal ? (adj / baseTotal) * lossTotal : 0;
    let total = adj - loss;

    acc += total;

    rows[i].cells[5].innerHTML = `<span class="loss">${loss.toFixed(1)}</span>`;
    rows[i].cells[6].innerText = total.toFixed(1);
  }

  let final = acc + contTotal;
  let check = final - target;

  report.innerHTML = `
    <b>Total Lotes:</b> ${acc.toFixed(1)}<br>
    <b>Contenedores:</b> ${contTotal.toFixed(1)}<br>
    <b>Final:</b> ${final.toFixed(1)}<br>
    <b>Check:</b> 
    <span class="${Math.abs(check) < 0.1 ? 'good' : 'bad'}">
    ${check.toFixed(1)}
    </span>
  `;
}