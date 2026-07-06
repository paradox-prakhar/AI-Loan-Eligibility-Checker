/* =========================================================
   FinWise AI — EMI Calculator
   script.js  |  Logic, Validation, Amortization & PDF Export
   ========================================================= */

'use strict';

/* ── DOM References ────────────────────────────────────── */
const form        = document.getElementById('emiForm');
const calcBtn     = document.getElementById('calcBtn');
const resetBtn    = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadPdfBtn');
const resultPanel = document.getElementById('resultPanel');

const inputType   = document.getElementById('loanType');
const inputAmount = document.getElementById('loanAmount');
const inputRate   = document.getElementById('interestRate');
const inputTenure = document.getElementById('loanTenure');

const errAmount   = document.getElementById('err-amount');
const errRate     = document.getElementById('err-rate');
const errTenure   = document.getElementById('err-tenure');

const wrapAmount  = document.getElementById('wrap-amount');
const wrapRate    = document.getElementById('wrap-rate');
const wrapTenure  = document.getElementById('wrap-tenure');

const emiValue       = document.getElementById('emiValue');
const emiSub         = document.getElementById('emiSub');
const bcPrincipal    = document.getElementById('bcPrincipal');
const bcInterest     = document.getElementById('bcInterest');
const bcTotal        = document.getElementById('bcTotal');
const pctPrincipal   = document.getElementById('pctPrincipal');
const pctInterest    = document.getElementById('pctInterest');

const donutPrincipal    = document.getElementById('donutPrincipal');
const donutInterest     = document.getElementById('donutInterest');
const donutRatioText    = document.getElementById('donutRatioText');
const donutPctPrincipal = document.getElementById('donutPctPrincipal');
const donutPctInterest  = document.getElementById('donutPctInterest');

const scheduleBody     = document.getElementById('scheduleBody');
const paginationControls = document.getElementById('paginationControls');

/* ── Global State for Calculator Results ───────────────── */
let calcData = {
  loanType: '',
  principal: 0,
  annualRate: 0,
  months: 0,
  emi: 0,
  totalInterest: 0,
  totalPayable: 0,
  amortizationSchedule: []
};

let currentPage = 1;
const rowsPerPage = 12; // 1 year per page

/* ── Loan Type Configurations ──────────────────────────── */
const loanConfigs = {
  personal: {
    defaultAmount: 500000,
    defaultRate: 12.0,
    defaultTenure: 60,
    maxAmount: 2500000,
    maxTenure: 72,
    placeholderAmount: "e.g. 500,000 (Max 25L)",
    placeholderTenure: "e.g. 60 (Max 72)"
  },
  home: {
    defaultAmount: 5000000,
    defaultRate: 8.5,
    defaultTenure: 240,
    maxAmount: 100000000,
    maxTenure: 360,
    placeholderAmount: "e.g. 5,000,000 (Max 10Cr)",
    placeholderTenure: "e.g. 240 (Max 360)"
  },
  car: {
    defaultAmount: 1000000,
    defaultRate: 9.5,
    defaultTenure: 84,
    maxAmount: 15000000,
    maxTenure: 84,
    placeholderAmount: "e.g. 1,000,000 (Max 1.5Cr)",
    placeholderTenure: "e.g. 84 (Max 84)"
  },
  education: {
    defaultAmount: 1500000,
    defaultRate: 7.5,
    defaultTenure: 120,
    maxAmount: 8000000,
    maxTenure: 180,
    placeholderAmount: "e.g. 1,500,000 (Max 80L)",
    placeholderTenure: "e.g. 120 (Max 180)"
  }
};

/* ── Helpers ───────────────────────────────────────────── */

/**
 * Format a number as Indian Rupee currency string.
 * e.g. 150000 → "₹1,50,000"
 */
function formatINR(value) {
  return '₹' + Number(value.toFixed(0)).toLocaleString('en-IN');
}

/**
 * Show an error message on a given input group.
 */
function showError(wrapper, errEl, message) {
  wrapper.classList.add('error');
  errEl.textContent = '⚠ ' + message;
  errEl.classList.add('visible');
}

/**
 * Clear the error on a given input group.
 */
function clearError(wrapper, errEl) {
  wrapper.classList.remove('error');
  errEl.textContent = '';
  errEl.classList.remove('visible');
}

/**
 * Prevent typing invalid characters in number input fields
 */
const blockInvalidChars = (e) => {
  if (['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
};

/* ── Apply Config Based on Type ────────────────────────── */
function applyLoanConfig() {
  const type = inputType.value;
  const cfg = loanConfigs[type] || loanConfigs.personal;

  inputAmount.placeholder = cfg.placeholderAmount;
  inputTenure.placeholder = cfg.placeholderTenure;

  // Update validation bounds attributes
  inputAmount.max = cfg.maxAmount;
  inputTenure.max = cfg.maxTenure;

  // Set default interest rate for the selected loan type
  inputRate.value = cfg.defaultRate;

  // Clear existing errors when configurations update
  clearError(wrapAmount, errAmount);
  clearError(wrapTenure, errTenure);
  clearError(wrapRate, errRate);
}

// Initial config binding
inputType.addEventListener('change', applyLoanConfig);
applyLoanConfig();

/* Bind input filters */
[inputAmount, inputRate, inputTenure].forEach(el => {
  el.addEventListener('keydown', blockInvalidChars);
});

/* ── Validation ────────────────────────────────────────── */
function validate() {
  let valid = true;

  const type = inputType.value;
  const cfg  = loanConfigs[type] || loanConfigs.personal;

  const amount = parseFloat(inputAmount.value);
  const rate   = parseFloat(inputRate.value);
  const tenure = parseInt(inputTenure.value, 10);

  /* Loan Amount */
  if (!inputAmount.value.trim() || isNaN(amount)) {
    showError(wrapAmount, errAmount, 'Please enter a valid loan amount.');
    valid = false;
  } else if (amount < 1000) {
    showError(wrapAmount, errAmount, 'Minimum loan amount is ₹1,000.');
    valid = false;
  } else if (amount > cfg.maxAmount) {
    showError(wrapAmount, errAmount, `Maximum loan amount for this type is ${formatINR(cfg.maxAmount)}.`);
    valid = false;
  } else {
    clearError(wrapAmount, errAmount);
  }

  /* Interest Rate */
  if (!inputRate.value.trim() || isNaN(rate)) {
    showError(wrapRate, errRate, 'Please enter an annual interest rate.');
    valid = false;
  } else if (rate < 0) {
    showError(wrapRate, errRate, 'Interest rate cannot be negative.');
    valid = false;
  } else if (rate > 100) {
    showError(wrapRate, errRate, 'Rate cannot exceed 100%.');
    valid = false;
  } else {
    clearError(wrapRate, errRate);
  }

  /* Tenure */
  if (!inputTenure.value.trim() || isNaN(tenure)) {
    showError(wrapTenure, errTenure, 'Please enter a loan tenure in months.');
    valid = false;
  } else if (tenure < 1) {
    showError(wrapTenure, errTenure, 'Minimum tenure is 1 month.');
    valid = false;
  } else if (tenure > cfg.maxTenure) {
    showError(wrapTenure, errTenure, `Maximum tenure for this type is ${cfg.maxTenure} months.`);
    valid = false;
  } else {
    clearError(wrapTenure, errTenure);
  }

  return valid;
}

/* ── Amortization Logic ────────────────────────────────── */
function calculateAmortization(principal, annualRate, months, emi) {
  const schedule = [];
  let remainingBalance = principal;
  const monthlyRate = (annualRate / 12) / 100;

  for (let i = 1; i <= months; i++) {
    let interestPaid = 0;
    let principalPaid = 0;

    if (annualRate > 0) {
      interestPaid = remainingBalance * monthlyRate;
      principalPaid = emi - interestPaid;
    } else {
      interestPaid = 0;
      principalPaid = emi;
    }

    // Edge case for final month rounding errors
    if (i === months || principalPaid > remainingBalance) {
      principalPaid = remainingBalance;
      emi = principalPaid + interestPaid;
      remainingBalance = 0;
    } else {
      remainingBalance -= principalPaid;
    }

    schedule.push({
      month: i,
      emi: emi,
      principalPaid: principalPaid,
      interestPaid: interestPaid,
      balance: Math.max(0, remainingBalance)
    });
  }

  return schedule;
}

/* ── Donut Chart Renderer ──────────────────────────────── */
function renderDonut(principal, totalInterest) {
  const circumference = 2 * Math.PI * 48; // ~301.6
  const total = principal + totalInterest;

  const principalFraction = principal / total;
  const interestFraction  = totalInterest / total;

  const pPct = Math.round(principalFraction * 100);
  const iPct = 100 - pPct;

  const principalDash = principalFraction * circumference;
  const interestDash  = interestFraction  * circumference;

  const gap = total > 0 ? 2 : 0;

  donutPrincipal.style.strokeDasharray  = `${principalDash - gap} ${circumference - (principalDash - gap)}`;
  donutPrincipal.style.strokeDashoffset = '0';

  donutInterest.style.strokeDasharray  = `${interestDash - gap} ${circumference - (interestDash - gap)}`;
  donutInterest.style.strokeDashoffset = `-${principalDash}`;

  donutRatioText.textContent = `${pPct}:${iPct}`;
  donutPctPrincipal.textContent = `${pPct}%`;
  donutPctInterest.textContent = `${iPct}%`;

  // Update card percentages
  pctPrincipal.textContent = `(${pPct}%)`;
  pctInterest.textContent = `(${iPct}%)`;
}

/* ── Amortization Table Pagination ─────────────────────── */
function renderAmortizationTable() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = calcData.amortizationSchedule.slice(startIndex, endIndex);

  scheduleBody.innerHTML = '';
  currentRows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.month}</td>
      <td>${formatINR(row.emi)}</td>
      <td>${formatINR(row.principalPaid)}</td>
      <td>${formatINR(row.interestPaid)}</td>
      <td>${formatINR(row.balance)}</td>
    `;
    scheduleBody.appendChild(tr);
  });

  renderPaginationControls();
}

function renderPaginationControls() {
  const totalPages = Math.ceil(calcData.amortizationSchedule.length / rowsPerPage);
  paginationControls.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.textContent = '◀ Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    currentPage--;
    renderAmortizationTable();
  });

  const pageInfo = document.createElement('span');
  pageInfo.className = 'page-info';
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.textContent = 'Next ▶';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    currentPage++;
    renderAmortizationTable();
  });

  paginationControls.appendChild(prevBtn);
  paginationControls.appendChild(pageInfo);
  paginationControls.appendChild(nextBtn);
}

/* ── Animate EMI Value Counter ─────────────────────────── */
function animateCounter(el, targetValue, prefix, duration = 900) {
  const start     = performance.now();
  const startVal  = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = startVal + (targetValue - startVal) * eased;
    el.textContent = prefix + Math.round(current).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ── Calculate & Display Result ────────────────────────── */
function runCalculation() {
  const principal  = parseFloat(inputAmount.value);
  const annualRate = parseFloat(inputRate.value);
  const months     = parseInt(inputTenure.value, 10);

  // EMI Formula variables
  const r = (annualRate / 12) / 100;
  let emi = 0;
  let totalPayable = 0;
  let totalInterest = 0;

  if (annualRate > 0) {
    const onePlusRtoN = Math.pow(1 + r, months);
    emi = (principal * r * onePlusRtoN) / (onePlusRtoN - 1);
    totalPayable = emi * months;
    totalInterest = totalPayable - principal;
  } else {
    // 0% interest loan
    emi = principal / months;
    totalPayable = principal;
    totalInterest = 0;
  }

  // Populate data struct
  calcData = {
    loanType: inputType.options[inputType.selectedIndex].text,
    principal: principal,
    annualRate: annualRate,
    months: months,
    emi: emi,
    totalInterest: totalInterest,
    totalPayable: totalPayable,
    amortizationSchedule: calculateAmortization(principal, annualRate, months, emi)
  };

  currentPage = 1;

  // Animate highlights
  animateCounter(emiValue, emi, '₹');
  emiSub.textContent = `for ${months} month${months > 1 ? 's' : ''} @ ${annualRate}% p.a.`;

  // Text contents
  bcPrincipal.textContent = formatINR(principal);
  bcInterest.textContent  = formatINR(totalInterest);
  bcTotal.textContent     = formatINR(totalPayable);

  // Render visual segments
  renderDonut(principal, totalInterest);
  renderAmortizationTable();

  // Reveal results smoothly
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Event: Calculate Form Submit ──────────────────────── */
form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validate()) return;

  // Add a slight micro-interaction loading lag for premium experience
  const submitText = calcBtn.querySelector('.btn-text');
  const submitIcon = calcBtn.querySelector('.btn-icon');
  const spinner    = calcBtn.querySelector('.btn-spinner');

  submitText.textContent = "Calculating...";
  submitIcon.style.display = "none";
  spinner.style.display = "inline-block";
  calcBtn.disabled = true;

  setTimeout(() => {
    runCalculation();
    submitText.textContent = "Calculate EMI";
    submitIcon.style.display = "flex";
    spinner.style.display = "none";
    calcBtn.disabled = false;
  }, 450);
});

/* ── Event: Reset Form ─────────────────────────────────── */
resetBtn.addEventListener('click', function () {
  resultPanel.hidden = true;

  form.reset();
  applyLoanConfig();

  // Reset errors
  clearError(wrapAmount,  errAmount);
  clearError(wrapRate,    errRate);
  clearError(wrapTenure,  errTenure);

  // Reset donut segments
  donutPrincipal.style.strokeDasharray = '0 301.6';
  donutInterest.style.strokeDasharray  = '0 301.6';
  donutRatioText.textContent = '–';
  donutPctPrincipal.textContent = '–';
  donutPctInterest.textContent = '–';

  currentPage = 1;
  scheduleBody.innerHTML = '';
  paginationControls.innerHTML = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
  inputAmount.focus();
});

/* ── Live Blur Validation ──────────────────────────────── */
inputAmount.addEventListener('blur', () => {
  const v = parseFloat(inputAmount.value);
  const cfg = loanConfigs[inputType.value] || loanConfigs.personal;
  if (inputAmount.value.trim() === '') return;
  if (isNaN(v) || v < 1000) {
    showError(wrapAmount, errAmount, 'Minimum loan amount is ₹1,000.');
  } else if (v > cfg.maxAmount) {
    showError(wrapAmount, errAmount, `Maximum amount for this type is ${formatINR(cfg.maxAmount)}.`);
  } else {
    clearError(wrapAmount, errAmount);
  }
});

inputRate.addEventListener('blur', () => {
  const v = parseFloat(inputRate.value);
  if (inputRate.value.trim() === '') return;
  if (isNaN(v) || v < 0) {
    showError(wrapRate, errRate, 'Interest rate cannot be negative.');
  } else if (v > 100) {
    showError(wrapRate, errRate, 'Rate cannot exceed 100%.');
  } else {
    clearError(wrapRate, errRate);
  }
});

inputTenure.addEventListener('blur', () => {
  const v = parseInt(inputTenure.value, 10);
  const cfg = loanConfigs[inputType.value] || loanConfigs.personal;
  if (inputTenure.value.trim() === '') return;
  if (isNaN(v) || v < 1) {
    showError(wrapTenure, errTenure, 'Minimum tenure is 1 month.');
  } else if (v > cfg.maxTenure) {
    showError(wrapTenure, errTenure, `Maximum tenure for this type is ${cfg.maxTenure} months.`);
  } else {
    clearError(wrapTenure, errTenure);
  }
});

/* Clear errors live during typing */
[inputAmount, inputRate, inputTenure].forEach(el => {
  el.addEventListener('input', () => {
    const group = el.closest('.input-group');
    const err   = group.querySelector('.input-error');
    clearError(group, err);
  });
});

/* ── PDF Generation Logic ──────────────────────────────── */
downloadBtn.addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const primaryColor = [99, 102, 241]; // Hex #6366f1 Indigo
  const accentColor  = [6, 182, 212];  // Hex #06b6d4 Cyan
  const darkTextColor = [15, 23, 42];  // Slate 900
  const lightTextColor = [100, 116, 139]; // Slate 500

  // 1. Branding Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FinWise AI', 15, 20);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('PREMIUM LOAN EMI REPORT', 15, 28);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(9);
  doc.text(`Generated on: ${dateStr}`, 145, 28);

  // 2. Summary Layout Title
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(14);
  doc.setFont('Helvetica', 'bold');
  doc.text('Loan Breakdown & Summary', 15, 52);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 56, 195, 56);

  // Grid Data
  const summaryLeft = [
    ['Loan Product Type:', calcData.loanType],
    ['Loan Principal Amount:', formatINR(calcData.principal)],
    ['Annual Interest Rate:', `${calcData.annualRate}% p.a.`],
    ['Total Loan Tenure:', `${calcData.months} Months`]
  ];

  const summaryRight = [
    ['Equated Monthly EMI:', formatINR(calcData.emi)],
    ['Total Interest Payable:', formatINR(calcData.totalInterest)],
    ['Total Payable Amount:', formatINR(calcData.totalPayable)],
    ['Principal / Interest %:', `${Math.round(calcData.principal / (calcData.principal + calcData.totalInterest) * 100)}% / ${100 - Math.round(calcData.principal / (calcData.principal + calcData.totalInterest) * 100)}%`]
  ];

  // Draw Summary Content manually for beautiful layout
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...lightTextColor);

  let yOffset = 66;
  summaryLeft.forEach(row => {
    doc.setFont('Helvetica', 'normal');
    doc.text(row[0], 15, yOffset);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(...darkTextColor);
    doc.text(row[1], 60, yOffset);
    doc.setTextColor(...lightTextColor);
    yOffset += 8;
  });

  yOffset = 66;
  summaryRight.forEach(row => {
    doc.setFont('Helvetica', 'normal');
    doc.text(row[0], 110, yOffset);
    doc.setFont('Helvetica', 'bold');
    if (row[0].includes('EMI')) {
      doc.setTextColor(...primaryColor);
    } else {
      doc.setTextColor(...darkTextColor);
    }
    doc.text(row[1], 160, yOffset);
    doc.setTextColor(...lightTextColor);
    yOffset += 8;
  });

  // 3. Amortization Schedule Table Title
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(14);
  doc.setFont('Helvetica', 'bold');
  doc.text('Amortization Repayment Schedule', 15, 110);

  doc.line(15, 114, 195, 114);

  // Format table rows
  const tableRows = calcData.amortizationSchedule.map(row => [
    row.month.toString(),
    formatINR(row.emi),
    formatINR(row.principalPaid),
    formatINR(row.interestPaid),
    formatINR(row.balance)
  ]);

  // Generate Table using autoTable
  doc.autoTable({
    startY: 120,
    head: [['Month', 'EMI', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: darkTextColor
    },
    columnStyles: {
      4: { fontStyle: 'bold', textColor: accentColor } // balance highlighting
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // subtle gray for zebra lines
    },
    margin: { left: 15, right: 15 }
  });

  // Save the PDF
  const filename = `FinWise_EMI_Report_${calcData.loanType.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
});
