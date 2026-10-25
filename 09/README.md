# Student Profile Web Page - Anjitha V

A formal, minimal, and interactive Student Academic Profile web application built using **HTML5**, **CSS3**, and **JavaScript**.

---

## Features

- **Personal Details**: Full Name (Anjitha V), Email, Phone, Gender (Radio buttons), Blood Group (Dropdown list).
- **Target Companies**: Multi-select dropdown featuring Companies like **Infosys, TCS, Wipro, Cognizant, Accenture, Google, Microsoft**.
- **Photo & Upload Guide**: Clean formal avatar placeholder with built-in modal guide and instant local image file chooser via JavaScript `FileReader`.
- **Extracurricular & NSS Activities**: Checkbox controls with **NSS Volunteer** pre-checked, Coding Club Lead, Tech Symposium, etc.
- **Skills Section**: Interactive skill checkboxes (JavaScript, HTML/CSS, Python, DSA, SQL, Git).
- **SGPA & CGPA Table**:
  - Semester 1 (S1): **9.76**
  - Semester 2 (S2): **9.33**
  - Semester 3 (S3): **9.64**
  - Semester 4 (S4): **9.18**
  - Semester 5 (S5): **8.93**
  - Semester 6 (S6): **9.24**
  - Dynamic Overall CGPA: **9.33** (recalculates live when SGPA scores are modified)
- **Semester 7 Series Exam & Internal Marks**:
  - **CST401 Artificial Intelligence**: Series 1: 47/50 (94%), Series 2: 44/50 (88%) -> Total Internal: **55.5 / 60** (Grade O)
  - **MCN401 Industrial Safety Engineering**: Series 1: 49/50 (98%), Series 2: 48/50 (96%) -> Total Internal: **58.5 / 60** (Grade O)
  - **BTT435 Sustainable Energy Process**: Series 1: 47/50 (94%), Series 2: 49.5/50 (99%) -> Total Internal: **58.25 / 60** (Grade O)
  - **CST463 Web Programming**: Series 1: 49/50 (98%), Series 2: 49.5/50 (99%) -> Total Internal: **59.25 / 60** (Grade O)
  - **Series Exam 1 Total**: **192 / 200 (96%)** | **Series Exam 2 Total**: **191 / 200 (95.5%)**
- **Interactivity & Validation**:
  - Live form validation (email format, phone number, required fields).
  - Custom toast notification alerts.
  - Read-Only vs. Editable Mode toggle button.
  - Form Reset functionality.
  - **Print / PDF Export**: Clean `@media print` stylesheet formatted for 1-page profile PDF generation.

---

## Project Structure

```
assignment/
├── index.html              # Main HTML5 Profile Structure
├── css/
│   └── styles.css          # Slate & Navy Minimal Design System & Print Styles
├── js/
│   └── script.js           # Form Validation, CGPA Math, Marks Modal, Image Upload
├── assets/
│   ├── profile_avatar.png  # High-resolution generated avatar icon
│   └── PHOTO_GUIDE.md      # Detailed photo replacement guide
└── README.md               # Project documentation
```

---

## How to Run locally

1. Double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. Or use a local server like Live Server extension in VS Code.
