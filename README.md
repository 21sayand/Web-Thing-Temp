# St Thomas College of Engineering and Technology (Kannur)
## CSE Department Portfolio Portal & Continuous Evaluation Hub

This repository contains the central academic directory and 59 student portfolio websites, complete with real-time assignment tracking, filtering, and evaluation tools.

---

### Project Structure

```
├── index.html                   # Central College Portal (Directory & Filters)
├── assignment.html              # Continuous Evaluation Matrix (Binary Bit 0/1 Tracker)
├── students_data.js             # Compiled dataset for all 59 students
├── assignment_store.js          # Shared localStorage submission store & API
├── student_assignment_widget.js # Lightweight floating navigation & upload widget
├── server.js                    # Local test server (Node.js)
├── 01/ ... 59/                  # 59 Individual Student Portfolio Websites
│   ├── index.html
│   ├── style.css
│   └── ...
```

---

### Key Features

1. **Central Student Directory (`index.html`)**:
   - 59 interactive student cards displaying roll numbers, KTU register numbers, CGPA, blood groups, and submission badges.
   - Real-time instant search by Student Name, Roll Number, or Register Number.
   - Filtering by **Blood Group** (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`) and **CGPA brackets**.
   - Direct link to launch each student's portfolio in a new tab.

2. **Assignment Hub & Matrix (`assignment.html`)**:
   - Dynamic assignment management (Assignment 1, Assignment 2, with "+ Add New Assignment" support).
   - Binary evaluation matrix where each cell represents student submission (`0` = Pending, `1` = Submitted).
   - Single-click toggle on any cell to flip the bit.
   - Instant CSV export of the entire batch evaluation roster.

3. **Student Portfolio Integration (`student_assignment_widget.js`)**:
   - Injected into all 59 student sites without modifying or breaking any student's unique design or styling.
   - Provides a floating navigation pill to jump back to the central directory or open the assignment submission modal.
   - Submitting sets the binary bit to `1` across the platform.

---

### How to Host for Free on GitHub Pages

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Deploy 59 student portfolios and central evaluation portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (under Code and automation).
   - Under **Build and deployment > Branch**, select `main` and root `/ (root)`.
   - Click **Save**.

3. **Access Your Live Site**:
   - Portal: `https://<your-username>.github.io/<your-repo-name>/`
   - Assignment Matrix: `https://<your-username>.github.io/<your-repo-name>/assignment.html`
   - Student Sites: `https://<your-username>.github.io/<your-repo-name>/01/`, `/02/`, ..., `/59/`
