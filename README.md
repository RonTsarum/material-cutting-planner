# Material Cutting Planner

A cutting stock optimization system built with React and TypeScript that minimizes material waste for factory saw departments. It supports both Job and Stock work orders and handles constraints like max cuts per bar, bar length, and machine capacity.

## ✂️ Features

- Accepts multiple work orders with type, length, material, and quantity
- Prioritizes Job orders over Stock orders
- Groups cuts by material (e.g., stainless steel, carbon steel)
- Uses Linear Programming to optimize cut patterns
- Limits to 6 bars per round (machine batch)
- Shows waste per bar for every round

## 📦 Technologies

- React + TypeScript (UI)
- `javascript-lp-solver` (LP algorithm)
- Jest (unit testing)

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone git@github.com:RonTsarum/material-cutting-planner.git
cd material-cutting-planner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the app
```bash
npm run dev
```

### 4. Run tests with coverage
```bash
npm test
```

## 📊 Example Work Order Input
```
Work Order | Type  | Cuts | Length (in) | Material
-----------|-------|------|-------------|-----------
123456     | Job   | 12   | 18.375      | Stainless Steel
789012     | Stock | 30   | 42.25       | Carbon Steel
```

## 🧠 Problem Domain
This project solves a variant of the **Cutting Stock Problem** using **Linear Programming (LP)**, where the objective is to fulfill cut requirements using the fewest number of bars possible, while respecting size and grouping constraints.

## 🛠 Development
- `src/Algorithm.tsx` – core optimization logic
- `src/App.tsx` – user interface for adding and visualizing work orders
- `src/optimizeCuts.test.ts` – test suite for validation

## 📜 License
MIT License
