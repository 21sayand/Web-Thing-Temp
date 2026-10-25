# Student Profile Web Page - Assignment Notes

Clean and authentic implementation of the Student Profile Web Page using HTML, CSS, and JavaScript for the Web Programming Lab assignment.

---

## Files
- `index.html`: Contains the form with personal details, file upload for photo, radio buttons for gender, dropdowns for blood group and companies, all 8 semesters with subject-wise internal mark inputs, and checkboxes for skills/activities.
- `style.css`: Clean, standard CSS styling for form fields, collapsible semester cards (`<details>`), marks tables, and submission summary.
- `script.js`: Handles image preview using `FileReader`, validates required fields, phone number (10 digits), marks ranges, loops through all 8 semesters (only validating filled ones), and generates the summary.
- `student_profile_standalone.html`: Single-file all-in-one version containing the complete code.

---

## 8 Semesters & Subjects Included (B.Tech Computer Science & Engineering)

1. **Semester 1:**
   - MAT 101: Linear Algebra and Calculus
   - PHT 100: Engineering Physics
   - EST 100: Engineering Mechanics
   - EST 120: Basics of Civil & Mechanical Engineering
   - HUN 101: Life Skills
2. **Semester 2:**
   - MAT 102: Vector Calculus, Differential Equations & Transforms
   - CYT 100: Engineering Chemistry
   - EST 110: Engineering Graphics
   - EST 130: Basics of Electrical & Electronics Engineering
   - EST 102: Programming in C
   - HUN 102: Professional Communication
3. **Semester 3:**
   - MAT 203: Discrete Mathematical Structures
   - CST 201: Data Structures
   - CST 203: Logic System Design
   - CST 205: Object Oriented Programming Using Java
   - EST 200: Design & Engineering
   - MCN 201: Sustainable Engineering
4. **Semester 4:**
   - MAT 206: Graph Theory
   - CST 202: Computer Organization and Architecture
   - CST 204: Database Management Systems
   - CST 206: Operating Systems
   - HUT 200: Professional Ethics
   - MCN 202: Constitution of India
5. **Semester 5:**
   - CST 301: Formal Languages and Automata Theory
   - CST 303: Computer Networks
   - CST 305: System Software
   - CST 307: Microprocessors and Microcontrollers
   - CST 309: Management of Software Systems
   - MCN 301: Disaster Management
6. **Semester 6:**
   - CST 302: Compiler Design
   - CST 304: Computer Graphics and Image Processing
   - CST 306: Algorithm Analysis and Design
   - CST 312: Foundations of Machine Learning (Elective I)
   - HUT 300: Industrial Economics & Foreign Trade
   - CST 308: Comprehensive Course Work
7. **Semester 7:**
   - CST 401: Artificial Intelligence
   - CST 413: Machine Learning (Elective II)
   - CST 425: Web Programming (Elective III)
   - OET 415: Renewable Energy Systems (Open Elective)
   - MCN 401: Industrial Safety Engineering
8. **Semester 8:**
   - CST 402: Distributed Computing
   - CST 414: Deep Learning (Elective IV)
   - CST 424: Cryptography and Network Security (Elective V)
   - CSD 416: Project Phase II

---

## How It Works:
- Each semester is a collapsible `<details>` section so the page stays compact.
- Students do **not** have to fill all 8 semesters. Only completed semesters need to be filled.
- When submitted, JavaScript loops through semesters 1 to 8, validates any entered SGPA/CGPA (0 to 10) and internal marks (0 to 50), and dynamically displays both the Semester Performance Table and the Subject Internal Marks Table in the summary box.
