# 💰 EMI Calculator — FinWise AI (Production Edition)

A modern, glassmorphism-styled financial calculation module that computes the Equated Monthly Instalment (EMI) for multiple loan categories. Features responsive design, interactive animations, month-by-month repayment schedule lists, dynamic SVG percentage charts, validation boundaries, and a clean client-side PDF export tool.

---

## 🚀 Live Preview

Served locally at:
```
http://localhost:5051/emi-calculator/
```

---

## 📁 File Structure

```
emi-calculator/
├── index.html   → Page structure, input forms, result card components, table layout
├── style.css    → Glassmorphism styling, animated gradients, tables, focus indicators
├── script.js    → Calculation logic, live key modifiers, amortization, PDF download
└── README.md    → This file
```

---

## ✨ Features

- **Multi-Product Configurations**: Education, Home, Car, and Personal loans with automatic bound adjustments.
- **Micro-interactions**: Interactive hover elements, loading spinner indicators, and smooth calculations.
- **Accurate Mathematical Formulas**: Precision calculations supporting standard interest rates as well as 0% interest loans.
- **Donut Chart Percentage Overlay**: SVG donut charts display principal-to-interest ratios with animated arcs and clear markers.
- **Paginated Repayment Table**: Displays month-by-month Principal Paid, Interest Paid, and Remaining Balance. Breaks data into 12-month annual blocks for quick reading.
- **Professional PDF Export**: Generates and downloads a print-ready PDF containing the full repayment schedule, loan information, and computation date.
- **Strict Input Constraints**: Filters out invalid characters like `-`, `+`, or `e` during live typing.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewing.
- **A11y/Accessibility Compliant**: Uses screen-reader attributes (`aria-live`, semantic elements, explicit keyboard focus paths).

---

## 🧮 EMI Formula

$$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$

Where:
- **P** = Principal loan amount
- **r** = Monthly interest rate (Annual interest rate / 12 / 100)
- **n** = Loan tenure in months

*Note: For 0% interest rates, the interest component resolves to 0 and the monthly payment is computed as $P / n$.*

---

## ✅ Input Validation Rules

| Loan Category | Default Principal | Max Principal | Max Tenure | Default Rate |
|---|---|---|---|---|
| **Personal Loan** | ₹5,00,000 | ₹25,00,000 | 72 months | 12.0% |
| **Home Loan** | ₹50,00,000 | ₹10,00,00,000 | 360 months | 8.5% |
| **Car Loan** | ₹10,00,00,000 | ₹1,50,00,000 | 84 months | 9.5% |
| **Education Loan** | ₹15,00,000 | ₹80,00,000 | 180 months | 7.5% |

---

## 🛠️ Tech Stack

- **HTML5** & **CSS3** (Glassmorphism design layout with custom parameters).
- **Vanilla JavaScript** (No external heavy framework overlays).
- **jsPDF** (Standard PDF generator library).
- **jsPDF-AutoTable** (Schedule rendering library).
- **Google Fonts** (Inter font face suite).

---

## 🧩 How to Run

1. Start a local static server from the project root:
   ```bash
   npx serve -l 5051 .
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5051/emi-calculator/
   ```

---

## 🔮 Future Enhancements

- **Dynamic Interactive Sliders**: Draggable range bars to easily select Amount, Rate, and Tenure.
- **Prepayment Adjustments**: Support inputs for one-time extra payments to view updated balance paths.
- **Local Cache Storage**: Save last calculated loan parameters to recover state on reload.
- **Theme Toggles**: Dark/Light mode toggles matching broader user choices.

---

*Part of the **FinWise AI** internship project suite.*
