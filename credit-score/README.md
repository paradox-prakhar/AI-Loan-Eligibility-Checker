# 📊 Credit Score Analyzer — FinWise AI

A modern, glassmorphism-styled web module that allows users to input their credit score and instantly receive a financial health assessment along with personalized recommendations.

---

## 🚀 Live Preview

Served locally at:
```
http://localhost:5051/credit-score/
```

---

## 📁 File Structure

```
credit-score/
├── index.html   → Page structure, form, result panel, score meter
├── style.css    → Glassmorphism UI, animated background, responsive styles
├── script.js    → Score analysis logic, gauge animation, recommendations
└── README.md    → This file
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Score Input** | Accepts scores in the range 300 – 900 |
| **Input Validation** | Live error messages with accessible ARIA roles |
| **Score Meter** | Animated SVG semicircle gauge that fills based on score |
| **Category Badge** | Displays Poor / Good / Excellent with colour-coded badge |
| **Stats Row** | Shows Percentile, Risk Level, and Loan Approval chance |
| **Recommendations** | Tailored bullet-point tips based on the score range |
| **Glassmorphism UI** | `backdrop-filter` glass card with floating animated orbs |
| **Animated Background** | 18s looping gradient shift with mesh-noise overlay |
| **Responsive** | Mobile-friendly layout (≤ 480 px breakpoint) |
| **Accessible** | ARIA labels, `role="alert"`, `aria-live` regions throughout |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary colour | `#6366f1` (Indigo) |
| Accent colour | `#06b6d4` (Cyan) |
| Background start | `#0a0a1a` |
| Glass background | `rgba(255,255,255,0.06)` |
| Font | Inter (Google Fonts) |
| Card border radius | `30px` |
| Backdrop blur | `blur(24px) saturate(160%)` |

---

## 🧮 Score Categories

| Range | Category | Risk Level | Loan Approval |
|---|---|---|---|
| 300 – 549 | Poor | High | Low |
| 550 – 649 | Fair | Medium-High | Moderate |
| 650 – 749 | Good | Medium | Good |
| 750 – 849 | Very Good | Low | High |
| 850 – 900 | Excellent | Very Low | Very High |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup with ARIA accessibility
- **CSS3** — Custom properties, glassmorphism, keyframe animations
- **Vanilla JavaScript** — No libraries or frameworks
- **Google Fonts** — Inter (300–800 weight range)

---

## 🧩 How to Run

1. Start a local static server from the project root:
   ```bash
   npx serve -l 5051 .
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5051/credit-score/
   ```

> You can also open `index.html` directly in a browser via the file system, though some backdrop-filter effects may behave differently without a server.

---

## 📝 Notes

- Credit data displayed is **illustrative only** and not connected to any real credit bureau.
- The score meter uses an SVG `<path>` arc with animated `stroke-dashoffset` for smooth fill animation.
- Recommendations are generated client-side based on static score-range logic in `script.js`.

---

*Part of the **FinWise AI** internship project suite.*
