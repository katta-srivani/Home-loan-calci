const form = document.querySelector("#loanForm");
const resetBtn = document.querySelector("#resetBtn");
const errorMessage = document.querySelector("#errorMessage");

const fields = [
  "principal",
  "interestRate",
  "years",
  "currentLandCost",
  "futureLandValue",
  "homeValue",
  "homeDepreciationRate",
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function numberValue(id) {
  const rawValue = document.querySelector(`#${id}`).value;
  const value = Number(rawValue.replace(/,/g, "").trim());
  return Number.isFinite(value) ? value : 0;
}

function hasValue(id) {
  return document.querySelector(`#${id}`).value.trim() !== "";
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function buildPayload() {
  return fields.reduce((payload, field) => {
    if (hasValue(field)) {
      payload[field] = numberValue(field);
    }
    return payload;
  }, {});
}

function buildSchedule({ principal, interestRate, years, monthlyPayment }) {
  const monthlyRate = interestRate / 100 / 12;
  const months = Math.min(years * 12, 12);
  let balance = principal;

  return Array.from({ length: months }, (_, index) => {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(balance - principalPaid, 0);

    return {
      month: index + 1,
      principal: principalPaid,
      interest,
      balance,
    };
  });
}

function renderSchedule(schedule) {
  const body = document.querySelector("#scheduleBody");
  body.innerHTML = schedule
    .map(
      (row) => `
        <tr>
          <td>Month ${row.month}</td>
          <td>${formatCurrency(row.principal)}</td>
          <td>${formatCurrency(row.interest)}</td>
          <td>${formatCurrency(row.balance)}</td>
        </tr>
      `
    )
    .join("");
}

function renderResults(payload, result) {
  const loan = result.loanDetails || {};
  const property = result.propertyDetails || {};
  const monthlyPayment = Number(loan.monthlyPayment || 0);
  const totalPayment = Number(loan.totalPayment || 0);
  const totalInterest = Number(loan.totalInterest || 0);
  const principalShare = totalPayment ? Math.max((payload.principal / totalPayment) * 100, 0) : 0;
  const interestShare = totalPayment ? Math.max((totalInterest / totalPayment) * 100, 0) : 0;

  setText("heroEmi", formatCurrency(monthlyPayment));
  setText("monthlyPayment", formatCurrency(monthlyPayment));
  setText("totalPayment", formatCurrency(totalPayment));
  setText("totalInterest", formatCurrency(totalInterest));
  setText("landAppreciationRate", property.landAppreciationRate ? `${property.landAppreciationRate}%` : "--");
  setText("homeDepreciation", property.homeDepreciation ? formatCurrency(property.homeDepreciation) : "--");
  setText("homeDepreciationRateResult", property.homeDepreciationRate ? `${property.homeDepreciationRate}%` : "--");

  document.querySelector("#principalBar").style.width = `${principalShare}%`;
  document.querySelector("#interestBar").style.width = `${interestShare}%`;

  renderSchedule(buildSchedule({ ...payload, monthlyPayment }));
}

async function calculate() {
  const payload = buildPayload();
  errorMessage.textContent = "";

  if (!payload.principal || !payload.interestRate && payload.interestRate !== 0 || !payload.years) {
    errorMessage.textContent = "Please enter loan amount, interest rate, and tenure.";
    return;
  }

  try {
    const response = await fetch("/api/loans/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to calculate loan details.");
    }

    renderResults(payload, result);
  } catch (error) {
    errorMessage.textContent = error.message;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  errorMessage.textContent = "";
  setText("heroEmi", "--");
  setText("monthlyPayment", "--");
  setText("totalPayment", "--");
  setText("totalInterest", "--");
  setText("landAppreciationRate", "--");
  setText("homeDepreciation", "--");
  setText("homeDepreciationRateResult", "--");
  document.querySelector("#principalBar").style.width = "0%";
  document.querySelector("#interestBar").style.width = "0%";
  document.querySelector("#scheduleBody").innerHTML = "";
});
