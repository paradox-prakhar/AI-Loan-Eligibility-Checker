/**
 * FinWise AI — Credit Score Analyzer
 * script.js  |  Vanilla JavaScript
 *
 * Features:
 *  - Input validation (range 300–900)
 *  - Score categorization (Poor / Good / Excellent)
 *  - Animated SVG arc meter
 *  - Animated score counter
 *  - Dynamic personalized recommendations
 *  - Stats (percentile, risk, loan approval chance)
 *  - Reset / re-analyze flow
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. Constants & Configuration
───────────────────────────────────────────────────────── */

/** Score thresholds */
const SCORE_MIN       = 300;
const SCORE_MAX       = 900;
const THRESHOLD_POOR  = 649;
const THRESHOLD_GOOD  = 749;

/**
 * SVG arc circumference for the semi-circle meter.
 * Arc path goes from ~20,100 to ~180,100 with radius 80.
 * The total semi-circle arc length ≈ π × 80 ≈ 251.2
 */
const ARC_LENGTH = 251.2;

/** Recommendation data keyed by category */
const RECOMMENDATIONS = {
  excellent: [
    { icon: '🏆', text: 'Leverage your stellar score to negotiate the lowest mortgage rates — you qualify for premium tiers.' },
    { icon: '💳', text: 'Apply for top-tier rewards credit cards with exclusive travel and cashback benefits.' },
    { icon: '📈', text: 'Diversify your credit portfolio with a mix of installment loans and revolving credit to maintain this score.' },
    { icon: '🔒', text: 'Enroll in credit monitoring services to protect your excellent standing from fraud or errors.' },
    { icon: '💰', text: 'Consider refinancing existing debt — you qualify for significantly lower interest rates.' },
  ],
  good: [
    { icon: '📊', text: 'Pay down credit card balances to below 30% utilization — this single step can add 20–40 points.' },
    { icon: '📅', text: 'Set up autopay for all bills to eliminate any chance of late payments hurting your score.' },
    { icon: '🔍', text: 'Review your credit report for errors via annualcreditreport.com — disputes often resolve within 30 days.' },
    { icon: '🚫', text: 'Avoid opening multiple new accounts at once; each hard inquiry can temporarily dip your score.' },
    { icon: '⏳', text: 'Keep your oldest credit accounts open — account age is 15% of your credit score calculation.' },
  ],
  poor: [
    { icon: '🆘', text: 'Address any past-due accounts immediately — even a single payment can stop further score decline.' },
    { icon: '📋', text: 'Create a debt repayment plan using the avalanche (highest interest first) or snowball method.' },
    { icon: '🪙', text: 'Open a secured credit card with a small limit and pay it in full monthly to build positive history.' },
    { icon: '🤝', text: 'Ask a trusted family member to add you as an authorized user on their long-standing, low-balance card.' },
    { icon: '🏦', text: 'Consult a non-profit credit counselor (NFCC member agencies) for a free debt management plan.' },
    { icon: '📆', text: 'Set calendar reminders for every payment due date — payment history is 35% of your credit score.' },
  ],
};

/** Stats per category */
const STATS = {
  excellent: { percentile: 'Top 20%', risk: 'Very Low',  loanChance: '~95%' },
  good:      { percentile: 'Top 40%', risk: 'Low',       loanChance: '~75%' },
  poor:      { percentile: 'Bottom 50%', risk: 'High',  loanChance: '~30%' },
};

/** Emoji icons for each category badge */
const BADGE_ICONS = {
  excellent: '⭐',
  good:      '👍',
  poor:      '⚠️',
};


/* ─────────────────────────────────────────────────────────
   2. DOM References
───────────────────────────────────────────────────────── */

const scoreInput    = document.getElementById('creditScoreInput');
const analyzeBtn    = document.getElementById('analyzeBtn');
const resetBtn      = document.getElementById('resetBtn');
const resultPanel   = document.getElementById('resultPanel');
const inputWrapper  = document.getElementById('input-wrapper');
const inputError    = document.getElementById('input-error');

// Result panel elements
const meterArc        = document.getElementById('meterArc');
const meterScoreValue = document.getElementById('meterScoreValue');
const categoryBadge   = document.getElementById('categoryBadge');
const categoryLabel   = document.getElementById('categoryLabel');
const badgeIcon       = document.getElementById('badgeIcon');
const recList         = document.getElementById('recList');
const statPercentile  = document.getElementById('statPercentile');
const statRisk        = document.getElementById('statRisk');
const statLoanChance  = document.getElementById('statLoanChance');


/* ─────────────────────────────────────────────────────────
   3. Utility Functions
───────────────────────────────────────────────────────── */

/**
 * Determine the credit category from a numeric score.
 * @param {number} score
 * @returns {'excellent'|'good'|'poor'}
 */
function getCategory(score) {
  if (score >= 750) return 'excellent';
  if (score >= 650) return 'good';
  return 'poor';
}

/**
 * Map a score to a dash-offset for the SVG arc meter.
 * score=300 → fully dashed (invisible); score=900 → fully drawn.
 * @param {number} score
 * @returns {number} stroke-dashoffset value
 */
function scoreToDashOffset(score) {
  const ratio  = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN); // 0 → 1
  const offset = ARC_LENGTH - ratio * ARC_LENGTH;
  return offset;
}

/**
 * Animate a numeric counter from 0 to target over a given duration.
 * @param {HTMLElement} el    — element whose textContent to update
 * @param {number}      target
 * @param {number}      duration  — ms
 */
function animateCounter(el, target, duration = 1200) {
  const start     = performance.now();
  const startVal  = 0;

  function update(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + eased * (target - startVal));
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Show a validation error message beneath the input.
 * @param {string} message
 */
function showError(message) {
  inputError.textContent   = '⚠ ' + message;
  inputError.classList.add('visible');
  inputWrapper.classList.add('has-error');
  scoreInput.setAttribute('aria-invalid', 'true');
}

/** Clear any existing validation error. */
function clearError() {
  inputError.textContent   = '';
  inputError.classList.remove('visible');
  inputWrapper.classList.remove('has-error');
  scoreInput.removeAttribute('aria-invalid');
}

/**
 * Validate user input.
 * Returns the parsed integer score, or null if invalid.
 * @returns {number|null}
 */
function validateInput() {
  const raw   = scoreInput.value.trim();
  const score = parseInt(raw, 10);

  // Empty check
  if (raw === '' || isNaN(score)) {
    showError('Please enter a credit score to continue.');
    return null;
  }

  // Non-integer / decimal
  if (!Number.isInteger(Number(raw))) {
    showError('Score must be a whole number (no decimals).');
    return null;
  }

  // Range check
  if (score < SCORE_MIN || score > SCORE_MAX) {
    showError(`Score must be between ${SCORE_MIN} and ${SCORE_MAX}.`);
    return null;
  }

  clearError();
  return score;
}


/* ─────────────────────────────────────────────────────────
   4. Core Logic — Render Results
───────────────────────────────────────────────────────── */

/**
 * Populate and reveal the result panel for a given score.
 * @param {number} score
 */
function renderResults(score) {
  const category = getCategory(score);

  /* ── 4a. Arc meter ───────────────────────────────────── */
  meterArc.style.strokeDashoffset = scoreToDashOffset(score);

  /* ── 4b. Score category classes on result panel ──────── */
  resultPanel.classList.remove('category-excellent', 'category-good', 'category-poor');
  resultPanel.classList.add(`category-${category}`);

  /* ── 4c. Animated counter ────────────────────────────── */
  animateCounter(meterScoreValue, score, 1200);

  /* ── 4d. Category badge ──────────────────────────────── */
  categoryBadge.className   = `category-badge ${category}`;   // reset + set
  badgeIcon.textContent     = BADGE_ICONS[category];
  categoryLabel.textContent = category.charAt(0).toUpperCase() + category.slice(1);

  /* ── 4e. Stats row ───────────────────────────────────── */
  const s = STATS[category];
  statPercentile.textContent = s.percentile;
  statRisk.textContent       = s.risk;
  statLoanChance.textContent = s.loanChance;

  /* ── 4f. Recommendations ─────────────────────────────── */
  recList.innerHTML = ''; // clear previous
  RECOMMENDATIONS[category].forEach((rec, index) => {
    const li = document.createElement('li');
    li.className  = 'rec-item';
    li.role       = 'listitem';
    li.innerHTML  = `<span class="rec-icon" aria-hidden="true">${rec.icon}</span><span>${rec.text}</span>`;

    // Stagger animation delay per item
    li.style.animationDelay = `${index * 0.08}s`;

    recList.appendChild(li);
  });

  /* ── 4g. Reveal panel ────────────────────────────────── */
  resultPanel.hidden = false;
  // Smooth scroll to result panel on mobile
  setTimeout(() => {
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}


/* ─────────────────────────────────────────────────────────
   5. Simulate Loading Delay (UX polish)
───────────────────────────────────────────────────────── */

/**
 * Trigger the analyze flow: validate → loading state → render results.
 */
function handleAnalyze() {
  const score = validateInput();
  if (score === null) {
    // Shake animation for error feedback
    scoreInput.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 320, easing: 'ease-in-out' }
    );
    scoreInput.focus();
    return;
  }

  // Set loading state
  analyzeBtn.disabled = true;
  analyzeBtn.classList.add('loading');

  // Simulate processing delay for polish (400ms)
  setTimeout(() => {
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove('loading');
    renderResults(score);
  }, 420);
}


/* ─────────────────────────────────────────────────────────
   6. Reset Flow
───────────────────────────────────────────────────────── */

/** Reset the UI to initial state for a new analysis. */
function handleReset() {
  // Hide results
  resultPanel.hidden = true;
  resultPanel.classList.remove('category-excellent', 'category-good', 'category-poor');

  // Reset arc
  meterArc.style.strokeDashoffset = ARC_LENGTH;
  meterScoreValue.textContent     = '0';

  // Clear input
  scoreInput.value = '';
  clearError();
  scoreInput.focus();

  // Scroll back to top of card
  document.querySelector('.glass-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ─────────────────────────────────────────────────────────
   7. Event Listeners
───────────────────────────────────────────────────────── */

// Analyze button click
analyzeBtn.addEventListener('click', handleAnalyze);

// Reset button click
resetBtn.addEventListener('click', handleReset);

// Allow Enter key to trigger analysis
scoreInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAnalyze();
});

// Clear validation error as user types
scoreInput.addEventListener('input', () => {
  if (inputWrapper.classList.contains('has-error')) {
    clearError();
  }
});

// Clamp input value on blur to valid range
scoreInput.addEventListener('blur', () => {
  const raw   = scoreInput.value.trim();
  const score = parseInt(raw, 10);
  if (!isNaN(score)) {
    if (score < SCORE_MIN) scoreInput.value = SCORE_MIN;
    if (score > SCORE_MAX) scoreInput.value = SCORE_MAX;
  }
});


/* ─────────────────────────────────────────────────────────
   8. Initialise — ensure result panel is hidden on load
───────────────────────────────────────────────────────── */

(function init() {
  resultPanel.hidden = true;
  // Set the meter arc to fully retracted on load
  if (meterArc) meterArc.style.strokeDashoffset = ARC_LENGTH;
  // Focus the input for immediate keyboard entry
  scoreInput.focus();
})();
