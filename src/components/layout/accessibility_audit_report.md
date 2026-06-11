# CarbWiser Accessibility Audit Report

## Issues Found

During the accessibility audit across all pages and components of the CarbWiser application, the following issues were identified:

1. **Global Keyboard Navigation**: The application lacked visible focus indicators, making it extremely difficult for keyboard-only users to navigate interactively.
2. **"Skip to Content" Link**: There was no mechanism for screen reader or keyboard users to bypass repetitive navigation blocks and jump straight to the main content.
3. **Semantic Landmarks**: Major page sections were not wrapped in semantic HTML5 landmark roles (e.g., `<main id="main-content">`), reducing screen reader navigation efficiency.
4. **Form Controls**:
   - `input[type="range"]` sliders (in What-If Simulator and Assessment) lacked associated keyboard focus styling and connection to their descriptive hint text.
   - Assessment option cards acted as interactive elements but were marked as standard `div/button` combinations without `aria-pressed` state tracking.
   - Filter buttons (Smart Actions) did not convey their active "pressed" state to assistive technologies.
5. **Interactive Controls & Buttons**:
   - Several buttons lacked `type="button"`, which could inadvertently cause form submissions.
   - The Mobile Menu button lacked `aria-expanded` and `aria-controls` to describe its state.
   - "Why this recommendation?" accordion toggles lacked `aria-controls` to link them to their collapsible content.
6. **ARIA Labels and Hidden Content**:
   - Material Symbols icon font glyphs (e.g., `forest`, `bolt`) were read aloud by some screen readers (e.g., "forest CarbWiser").
   - Animated visual elements and SVGs (like the Eco Score circle or background paths) were distracting to screen readers as they lacked `aria-hidden="true"`.
   - Data visualisation components (like category share bars) lacked `role="meter"` and `aria-value*` attributes to convey their meaning non-visually.
   - Dynamic counter components lacked `aria-live` attributes to announce changing values.
7. **Motion Sensitivity**: There was no global support for users who prefer reduced motion (disabling CSS animations/transitions).

---

## Improvements Implemented

I have implemented comprehensive accessibility enhancements across the codebase without changing the visual design aesthetic. 

### 1. Global Setup (`index.css` & `index.html`)
- **Focus Rings**: Added a global `:focus-visible` utility that creates a highly visible, high-contrast dark green (`#003527`) focus ring with an offset for keyboard users, while suppressing mouse-click focus rings via `:focus:not(:focus-visible)`.
- **Skip Navigation**: Added an accessible `.skip-link` utility and implemented the anchor tag in `index.html` pointing to `#main-content`.
- **Reduced Motion**: Added a `@media (prefers-reduced-motion: reduce)` query that globally disables CSS animations, transitions, and smooth scrolling if the user has requested it at the OS level.
- **Icon Hiding**: Globally set `speak: never` and `user-select: none` on `.material-symbols-outlined` to prevent screen readers from reading raw icon ligature text.

### 2. Navigation Components (`Navbar.tsx` & `Footer.tsx`)
- Added `aria-label` to distinguishing `<nav>` elements (e.g., Desktop Navigation, Mobile Navigation, Footer Navigation).
- Implemented `aria-current="page"` on the active navigation links.
- Linked the mobile menu toggle button to the menu container via `aria-controls` and `aria-expanded`.
- Added `aria-label` to icon-only buttons (Notifications, Account).

### 3. Pages (`FootprintOverview`, `SmartActions`, `CarbonRoadmap`, `WhatIfSimulator`, `LifestyleAssessment`)
- **Semantic `<main>`**: Added `id="main-content"` to the `<main>` tag on all pages to support the skip link.
- **Data Visualisations**: Converted all horizontal progress bars, category share bars, and the Eco Score ring into accessible components using `role="meter"` or `role="progressbar"`, complete with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes.
- **Form Controls**: 
  - Connected input fields with their descriptive subtext using `aria-describedby`.
  - Upgraded custom Toggle switches (`WhatIfSimulator.tsx`) with `role="switch"`, `aria-checked`, `aria-labelledby`, and `aria-describedby`.
  - Added `aria-pressed` to the option cards in the `LifestyleAssessment` and filter tags in `SmartActions` to announce selection state.
- **Accordions**: Linked the "Why this recommendation?" toggles to their expanding content panels via dynamically generated `aria-controls` IDs.
- **Dynamic Content**: Added `aria-live="polite"` to animated number components and dynamic metric blocks so screen readers announce the final calculated value.
- **Lists & Timelines**: Converted the Carbon Roadmap timeline from a series of `<div>`s to a semantic `<ol>` and `<li>` structure (`role="list"`).

---

### 6. LifestyleAssessment — Step Focus Management (New)
- **Automatic focus transfer**: Added `useEffect` that watches `currentStep` and moves focus to the step `<h1>` heading on every step change (forward and back navigation).
- **Programmatic focusability**: Each step heading receives `tabIndex={-1}` dynamically, making it focusable via `.focus()` without adding it to the Tab order.
- **Screen reader announcement**: Added a `<span role="status" aria-live="polite" aria-atomic="true" className="sr-only">` that announces the current step number and name (e.g., "Step 2 of 5: Energy") on every step change.
- **Keyboard navigation preserved**: The `tabIndex={-1}` ensures headings never appear in the Tab sequence; keyboard users continue tabbing through OptionCards and inputs naturally.
- **No visual changes**: Focus ring on the heading is the browser default, no layout or style modifications.
- **Tests added**: 4 new tests covering:
  - Focus moves to heading on forward navigation
  - Focus moves to heading on back navigation
  - Step announcement via `role="status"` live region
  - Heading `tabIndex` is `-1` (not in Tab order)

---

## Remaining Recommendations

While the application is now highly accessible, here are some future recommendations to maintain compliance:

1. **Focus Trap on Modals/Menus**: If you add any modal dialogs in the future (or upgrade the mobile menu), ensure focus is "trapped" within the modal while it is open, and restored to the trigger button when closed.
2. **Color Contrast Testing**: The current color palette (Stitch Faithful) performs very well, particularly the dark `#003527` text against `#f9f9ff` or `#ffffff` backgrounds. However, ensure that any future light-colored text (e.g., `#95d3ba` on `#064e3b`) maintains at least a 4.5:1 contrast ratio.
3. **Screen Reader Testing**: It is highly recommended to perform a manual run-through with an actual screen reader (like NVDA on Windows, or VoiceOver on macOS/iOS) to verify the flow and cadence of the newly added `aria-live` announcements and focus management.
