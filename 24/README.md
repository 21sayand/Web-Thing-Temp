# Student Profile & Academic Dossier Module
**Institution:** St Thomas College Of Engineering and Technology, Kannur  
**Department:** Computer Science and Engineering  
**Student:** Krishna Sajeevan (`STM23CS025`, Roll No: 24)

---

## 1. Project Overview

This is a standalone, dependency-free frontend module built using **pure semantic HTML5, modern CSS3, and vanilla JavaScript**. It serves as an official Student Academic Profile and Placement Dossier page designed to institutional standards (clean, high contrast, responsive, and print-ready).

### Key Features Included:
- **Photo Upload, Crop & Alignment Suite (pre-loaded with `krishna_sajeevan.jpg`):** 
  - Supports image upload (PNG, JPG, WEBP) with an interactive modal crop viewport.
  - Interactive panning (drag with mouse or touch), zooming (slider, `+`/`-`, or scroll wheel), and 90° rotation.
  - Built-in passport/ID card alignment guidelines (rule-of-thirds crosshairs, head alignment oval).
  - Dual real-time previews: **Placement Dossier 1:1 square preview** (96×96) and **Portal circular avatar preview** (68×68).
  - High-resolution 400×400 canvas export with live synchronization across the banner, registration form, and placement dossier.
  - Re-adjust anytime with the dedicated *"Adjust / Crop Photo"* button or reset to default.
- **Demographic Controls (defaults: Female, O+):**
  - Gender selection via styled accessible **radio buttons** (`Male`, `Female`, `Other`).
  - Blood group selection via **dropdown list** (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`).
- **Placement & Industry Preferences:**
  - Primary target company **dropdown list** (pre-configured with **Oracle**, **Infosys**, **TCS**, **Wipro**, **Cognizant**, **Accenture**, **Zoho**, **Capgemini**, **Amazon**, and **LTTS**).
  - Secondary company preference dropdown.
- **Academic Performance Record:**
  - Clean semester-wise table displaying **S1 through S6 SGPA** (`8.18`, `8.57`, `8.59`, `9.00`, `8.43`, `8.85`) and official Cumulative CGPA (`8.63`).
  - **Credit Distribution:** S1: `13`, S2: `21`, S3: `22`, S4: `22`, S5: `23`, S6: `23` (Total: `124 Credits`).
  - Progressive GPA and average calculations removed per user specification.
  - Internal marks cleanly omitted per requirements, keeping the dossier focused on official university credentials.
- **Technical Skills:** Checkbox multi-select (Python, Java, C/C++, Web Development, SQL/DBMS, DSA, Git/GitHub, Cloud Basics).
- **NSS & Extracurriculars:** Checkbox multi-select (NSS Volunteer Unit 248, College Coding Club, IEEE Student Branch, Sports, Cultural Arts).
- **Interactive Form Controls:**
  - Client-side validation (regex for email, 10-digit mobile, alphanumeric register number).
  - Real-time synchronization: Edits in the form immediately reflect on the official bio-data dossier.
  - Reset confirmation dialog with defaults restoration.
  - Slide-in toast notifications.
  - **Print / Save as PDF:** Custom `@media print` stylesheet that transforms the view into an official single-page A4 placement bio-data sheet with student and faculty signature placeholders.

---

## 2. File Structure

```
├── index.html        # Semantic HTML5 layout and academic dossier
├── style.css         # Institutional styling, responsive grid & print rules
├── script.js         # Validation logic, photo file reader & dynamic sync
├── stthomas-logo.png # Official college crest (transparent PNG without white background)
├── krishna_sajeevan.jpg # Student profile photograph (cropped 400x400)
├── stthomaskannur.jpeg # Original college logo source file
└── README.md         # Documentation for importing into target codebase
```

---

## 3. How to Run Directly

No build step, Node.js, or package manager is required.

1. **Option A (Instant in browser):**
   Simply double-click `index.html` or open it with Google Chrome, Firefox, Safari, or Microsoft Edge.

2. **Option B (Using any local HTTP server):**
   ```bash
   # Using Python 3:
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

---

## 4. How to Import into an Existing Codebase

### A. Integrating into Traditional Multi-Page Web Apps (PHP / JSP / Django / Flask / ASP.NET)
1. Copy `style.css` into your project's `static/css/` or `assets/css/` directory.
2. Copy `script.js` into your project's `static/js/` or `assets/js/` directory.
3. Paste the contents of `<main class="page-wrapper">...</main>` inside your target template or view file.
4. Link the CSS in your `<head>` and the JS before `</body>`.

### B. Integrating into Modern SPA Frameworks (React / Next.js / Vue / Angular)
1. **HTML Template:** Copy the markup from `index.html` into your component's template/render method (convert `class=` to `className=` for React JSX).
2. **State Management:** Replace the vanilla JS `input` event listeners with component state (`useState` / reactive refs) bound to `defaultStudentData`.
3. **Styles:** Import `style.css` directly into your component or page (`import './style.css'`).

---

## 5. Customizing Data & Configuration

All default student properties, semester SGPA records, and company lists are declared at the very top of `script.js` in the `defaultStudentData` object:

```javascript
const defaultStudentData = {
  fullName: "Krishna Sajeevan",
  registerNo: "STM23CS025",
  rollNo: "28",
  degree: "BTech in Computer Science and Engineering",
  branch: "CSE",
  cgpa: "8.63",
  sgpaList: [ ... ],
  // ...
};
```

Feel free to modify or connect this object to an API endpoint or backend database.


---

## 6. Pre-filled Profile Data

| Field | Value |
|---|---|
| Name | Krishna Sajeevan |
| Register No | STM23CS025 |
| Date of Birth | 06/07/2005 |
| Phone | 8078726008 |
| Email | krishnasajeevan2005@gmail.com |
| Gender | Female |
| Blood Group | O+ |
| Target Company | Wipro (secondary: Infosys) |
| Skills | Python, Java, C/C++, SQL & DBMS, Data Structures |
| Activities | Sports, Cultural & Arts |
| SGPA S1-S6 | 8.18, 8.57, 8.59, 9.00, 8.43, 8.85 |
| CGPA | 8.63 (credit-weighted average of S1-S6) |

Internal marks are intentionally not included.
