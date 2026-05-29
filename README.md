# KoinX Tax-Loss Harvesting Optimizer

A responsive, high-fidelity React application built with TypeScript, Vite, and Tailwind CSS (v4) to simulate and calculate **Tax-Loss Harvesting** benefits for cryptocurrency portfolios.

## 🚀 Live Demo & Deployment
- Deployed URL: **[Provide your deployment link here, e.g., Vercel or Netlify]**
- GitHub Repository: **[Provide your GitHub link here]**

---

## ✨ Features
1. **Interactive Simulated Calculator**: Compare **Pre-Harvesting** (Current) and **After Harvesting** (Simulated) capital gains side-by-side.
2. **Dynamic Tax Savings Estimation**: Displays real-time estimated savings based on selected holdings, using a flat **30% tax rate** model.
3. **Asset Holdings Table**: Fully interactive table rendering holding logos, current price, total quantity, and STCG/LTCG gains.
4. **Rich Table Interactions**:
   - **Selection Control**: Checkbox selection for individual assets, plus a master "Select/Deselect All" in the header.
   - **Search Filter**: Instantly search assets by coin ticker (e.g., USDC, WETH) or coin name.
   - **Sorting Header**: Sort holdings alphabetically (Name) or numerically (Price, Total Value, STCG, LTCG).
   - **View All Toggle**: Keeps the interface clean by showing 6 records initially, expanding to show all 24 records smoothly.
5. **Auto-Optimizer**: One-click "Harvest All Losses" button to immediately identify and select all underwater (loss-making) assets for maximum tax savings.
6. **Premium Visual Aesthetics**:
   - Deep slate/navy background with glowing blue and emerald accents.
   - Smooth transition animations powered by **Framer Motion**.
   - Shimmer skeleton loaders representing network request latency.
   - Confetti blast simulation when locking in savings.
7. **Production Grade Resilience**: Integrated custom React `ErrorBoundary` wrapper that intercepts runtime crashes and provides reload triggers.

---

## 🛠️ Tech Stack & Libraries
- **Core Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Celebration Effect**: Canvas Confetti

---

## 📐 Business Logic & Assumptions
- **Gains Classification**:
  - **STCG (Short-Term Capital Gains)**: Applies to assets held $\le$ 1 year.
  - **LTCG (Long-Term Capital Gains)**: Applies to assets held $>$ 1 year.
- **Harvesting Rules**:
  - For each selected asset:
    - If `stcg.gain > 0` $\rightarrow$ increases short-term profits.
    - If `stcg.gain < 0` $\rightarrow$ increases short-term losses (as absolute value).
    - If `ltcg.gain > 0` $\rightarrow$ increases long-term profits.
    - If `ltcg.gain < 0` $\rightarrow$ increases long-term losses (as absolute value).
- **Tax Savings Estimation**:
  - Tax Rate used: **30% flat tax** (applicable under Indian crypto tax rules).
  - Tax Paid = $\max(0, \text{Realised Capital Gains}) \times 30\%$.
  - Tax Savings = $\max(0, \text{Pre-Harvest Tax} - \text{Post-Harvest Tax})$.

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd koinx-tax-loss-harvesting
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Development Server
Launch the local server with hot module reloading (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
Validate compile stability and generate the optimized build bundle:
```bash
npm run build
```
The output assets will be generated in the `dist/` directory.

### Preview Production Build
Locally spin up the built production package for verification:
```bash
npm run preview
```
