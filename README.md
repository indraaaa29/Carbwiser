# CarbWiser

**Smarter Choices. Lower Emissions.**

---

## 📖 Project Overview
CarbWiser is a modern, responsive web application designed to empower individuals to understand, track, and actively reduce their personal carbon footprint. By translating complex environmental data into actionable, bite-sized insights, CarbWiser removes the friction from adopting a sustainable lifestyle.

---

## 🎯 Problem Statement
Despite growing climate awareness, individuals often struggle to quantify their personal environmental impact or know where to begin reducing it. Traditional carbon calculators are often overly complex, corporate-focused, or fail to provide actionable, realistic steps for everyday life. There is a critical need for a tool that bridges the gap between raw data and practical, personalized sustainability.

---

## 💡 Solution Overview
CarbWiser solves this by providing a highly personalized, visually engaging, and intuitive platform that tracks individual carbon emissions across key lifestyle areas (Transportation, Home Energy, Food & Lifestyle). It leverages a localized recommendation engine to suggest impactful, manageable changes, allowing users to model potential outcomes, set goals, and track progress over time.

---

## ✨ Key Features

* **Lifestyle Assessment**: A frictionless onboarding flow capturing daily travel, home energy usage, and food choices to establish a baseline footprint.
* **Carbon Footprint Analysis**: High-resolution visualization breaking down emissions by category, providing absolute clarity on individual environmental impact.
* **Carbon Hotspot Detection**: Automated identification of high-emission areas, dynamically reflecting reductions based on real user actions.
* **Smart Action Engine**: Context-aware, tailored recommendations mapped to global emission reduction factors.
* **Action Commitment System**: A data-driven tracking engine where users commit to real actions, persisting securely in `localStorage`.
* **Carbon Roadmap**: A transparent action plan automatically generated and updated strictly from user-committed actions, completely eliminating simulated metrics.
* **What-If Simulator**: An interactive sandbox allowing users to model the impact of hypothetical lifestyle changes before committing.
* **Progress Tracking**: A dynamic dashboard that calculates "Reduced So Far" and "Progress Percentage" purely from the sum of estimated reductions for committed actions.

---

## 🗺️ User Journey
1. **Onboard**: The user completes a streamlined Lifestyle Assessment.
2. **Discover**: The user views their personalized Carbon Footprint Analysis and identifies Hotspots.
3. **Simulate**: The user explores the What-If Simulator to see how different actions reduce their footprint.
4. **Commit**: The user selects achievable goals from the Smart Action Engine and clicks "Commit Action", storing them securely in their local ActionContext.
5. **Track**: The user monitors real, data-driven progress on their dashboard, where metrics and roadmaps are dynamically calculated strictly from their committed actions.

---

## 🧮 Carbon Calculation Methodology
CarbWiser calculates emissions based on standard conversion factors (e.g., EPA, DEFRA) adapted for individual consumer behaviors. 
* **Transportation**: Calculations consider vehicle type, fuel efficiency, mileage, and public transit usage.
* **Home Energy**: Calculations evaluate grid reliance, regional energy mix, and household efficiency.
* **Food & Lifestyle**: Calculations factor in diet type (e.g., vegan, omnivore), local sourcing, and general consumption patterns.
*(Note: Current calculations utilize robust placeholder logic designed for easy integration with live environmental APIs).*

---

## 🧠 Recommendation Engine Logic
The Smart Action Engine prioritizes recommendations based on:
1. **Impact Potential**: Actions that yield the highest CO2e reduction for the specific user's hotspots.
2. **Feasibility**: Balancing high-impact changes with smaller, habit-forming actions to ensure sustained engagement.
3. **User Context**: Filtering out irrelevant actions (e.g., not recommending "install solar" to an apartment renter).

---

## 🛠️ Technology Stack
* **Frontend Framework**: React 18
* **Language**: TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS (with arbitrary value support and custom design tokens)
* **Animations**: Framer Motion & CSS Keyframes
* **Icons**: Google Material Symbols
* **Routing**: React Router DOM

---

## 🏗️ Project Architecture
CarbWiser follows a modular, component-driven architecture:
* `src/components/`: Reusable UI components (e.g., Navbars, Cards, Animated Numbers with strict memory-leak prevention).
* `src/pages/`: Route-level components representing distinct views (Landing, Dashboard, Roadmap, Simulator).
* `src/context/`: Global state management, specifically the `ActionContext` for synchronizing committed actions with `localStorage`.
* `src/tests/`: Comprehensive test suites verifying logic and component rendering.
* `src/lib/` or `src/utils/`: Helper functions, calculation logic, and shared constants.
* `src/index.css`: Global styles, CSS variables, and custom animation keyframes.

The application leverages React Context for global state persistence and intersection observers for scroll-triggered animations.

---

## ♿ Accessibility Features
* **Reduced Motion Support**: Comprehensive integration of `prefers-reduced-motion` to disable continuous or infinite animations (e.g., floating effects, blob animations) for sensitive users, preserving layout and visual quality.
* **Semantic HTML**: Strict adherence to semantic HTML5 elements for proper screen reader parsing.
* **Color Contrast**: Design system optimized for high contrast ratios, particularly in text and data visualization elements.
* **Keyboard Navigation**: Interactive elements (buttons, links, form fields) are fully focusable and operable via keyboard.
* **ARIA Attributes**: Strategic use of ARIA labels and roles to provide context for dynamic content and complex UI components.

---

## 🔒 Security Features
* **Input validation**: All user inputs in assessment forms and simulator are validated for type, range, and format before processing.
* **Defensive programming**: Runtime checks and fallback handling across calculation and recommendation logic prevent unexpected crashes.
* **Type-safe calculations**: Full TypeScript coverage ensures numeric operations and data transformations are type-checked at compile time.
* **Environment variable protection**: Third-party API keys and configuration secrets are managed via Vite's `.env` system, excluded from version control.
* **Local-only data processing**: All footprint calculations, recommendations, and user data processing occur entirely client-side; no data is transmitted to external servers.
* **No sensitive data storage**: The application does not persist personally identifiable information (PII), authentication credentials, or financial data.

---

## ⚡ Performance Optimizations
* **Vite Build System**: Extremely fast HMR during development and highly optimized Rollup builds for production.
* **Asset Optimization**: Use of efficient web formats for images and SVGs.
* **Animation Performance**: Hardware-accelerated CSS animations (`transform`, `opacity`) utilized over computationally expensive property changes.
* **Lazy Loading**: Prepared architecture for route-based code splitting.

---

## 🧪 Testing Strategy
* **Unit & Integration Testing**: Core calculation utilities, state management (`ActionContext`), and React components are heavily tested using `Vitest` and `@testing-library/react`.
* **Coverage Reporting**: Configured with `@vitest/coverage-v8`, enforcing strict thresholds (Statements: 70%, Functions: 70%, Lines: 70%, Branches: 60%) to guarantee robust code quality.
* **Memory & Performance Audits**: Automated and manual verification of requestAnimationFrame cleanups and resource management (e.g., ensuring zero memory leaks in `AnimatedNumber`).
* **Manual QA**: Rigorous cross-browser testing and responsiveness checks across mobile, tablet, and desktop viewports.

---

## 🔮 Assumptions
* Users have a general understanding of their daily habits (e.g., approximate miles driven, general diet type).
* The target demographic has access to modern web browsers supporting ES6+ and CSS Grid/Flexbox.
* The application runs primarily on client-side state for the purpose of this prototype.

---

## 🚀 Future Scope
* **Backend Integration**: Implement a robust Node.js/PostgreSQL backend for persistent user profiles and historical data tracking.
* **Live API Connections**: Integrate with live utility APIs and smart home devices for automated data ingestion.
* **Community Features**: Implement leaderboards, community challenges, and social sharing to boost engagement.
* **Mobile Application**: Wrap the PWA into native iOS and Android applications.

---

## 💻 Installation Guide

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (v9 or higher)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Carbwiser
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🏃 Local Development
To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

To build the project for production:
```bash
npm run build
```

---

## 📁 Project Structure
```text
Carbwiser/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components (UI, layout)
│   ├── context/            # React Contexts (ActionContext)
│   ├── pages/              # Main application views/routes
│   ├── tests/              # Vitest specifications
│   ├── App.tsx             # Root component & Routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles and Tailwind directives
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite bundler configuration
└── README.md               # Project documentation
```

---

## 📸 Screenshots Section
*(Note: Replace with actual screenshot links in production)*
* **Landing Page**: Showcasing the dynamic hero section and core value proposition.
* **Assessment Flow**: Demonstrating the frictionless data entry.
* **Dashboard/Overview**: Highlighting the data visualization and hot-spot detection.
* **What-If Simulator**: Displaying the interactive sliding scales and projected impact.

---

## 🏁 Conclusion
CarbWiser represents a paradigm shift in personal environmental responsibility. By combining enterprise-grade data visualization with intuitive, consumer-friendly design, it transforms the daunting task of carbon reduction into an engaging, manageable, and rewarding journey. Built with performance, accessibility, and scalability in mind, CarbWiser is ready to make a tangible impact.
