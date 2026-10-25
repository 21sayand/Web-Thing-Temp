// JavaScript for Athul Raj Student Profile (Clean & Minimal Edition)

// Academic performance records (S1 to S6 averaging to CGPA 2.74)
var academicRecords = {
    "S1": {
        title: "Semester 1 Course Evaluation",
        sgpa: "3.10",
        courses: [
            { code: "MAT 101", title: "Linear Algebra and Calculus", internal: "42.0", attendance: "96.0%", grade: "P" },
            { code: "CYT 100", title: "Engineering Chemistry", internal: "35.0", attendance: "94.0%", grade: "P" },
            { code: "EST 100", title: "Engineering Mechanics", internal: "39.0", attendance: "95.0%", grade: "P" },
            { code: "EST 120", title: "Basics of Civil & Mechanical Engineering", internal: "36.0", attendance: "92.0%", grade: "P" },
            { code: "HUN 101", title: "Life Skills", internal: "45.0", attendance: "100.0%", grade: "B" },
            { code: "CYL 120", title: "Engineering Chemistry Lab", internal: "70.0", attendance: "100.0%", grade: "B" },
            { code: "ESL 120", title: "Civil & Mechanical Workshop", internal: "74.0", attendance: "100.0%", grade: "B" }
        ]
    },
    "S2": {
        title: "Semester 2 Course Evaluation",
        sgpa: "2.60",
        courses: [
            { code: "MAT 102", title: "Vector Calculus & Differential Equations", internal: "38.0", attendance: "95.0%", grade: "P" },
            { code: "PHT 100", title: "Engineering Physics A", internal: "39.0", attendance: "96.0%", grade: "P" },
            { code: "EST 110", title: "Engineering Graphics", internal: "34.0", attendance: "92.0%", grade: "F" },
            { code: "EST 130", title: "Basics of Electrical & Electronics", internal: "37.0", attendance: "94.0%", grade: "P" },
            { code: "EST 102", title: "Programming in C", internal: "31.0", attendance: "90.0%", grade: "F" },
            { code: "HUN 102", title: "Professional Communication", internal: "42.0", attendance: "98.0%", grade: "B" },
            { code: "PHL 120", title: "Engineering Physics Lab", internal: "68.0", attendance: "100.0%", grade: "B" },
            { code: "ESL 130", title: "Electrical & Electronics Workshop", internal: "71.0", attendance: "100.0%", grade: "B" }
        ]
    },
    "S3": {
        title: "Semester 3 Course Evaluation",
        sgpa: "2.85",
        courses: [
            { code: "MAT 203", title: "Discrete Mathematical Structures", internal: "40.0", attendance: "95.0%", grade: "P" },
            { code: "CST 201", title: "Data Structures", internal: "35.0", attendance: "93.0%", grade: "P" },
            { code: "CST 203", title: "Logic System Design", internal: "36.0", attendance: "94.0%", grade: "P" },
            { code: "CST 205", title: "Object Oriented Programming Java", internal: "33.0", attendance: "91.0%", grade: "F" },
            { code: "EST 200", title: "Design & Engineering", internal: "44.0", attendance: "98.0%", grade: "B" },
            { code: "MCN 201", title: "Sustainable Engineering", internal: "39.0", attendance: "96.0%", grade: "Pass" },
            { code: "CSL 201", title: "Data Structures Lab", internal: "72.0", attendance: "100.0%", grade: "B" },
            { code: "CSL 203", title: "Object Oriented Programming Lab", internal: "70.0", attendance: "100.0%", grade: "B" }
        ]
    },
    "S4": {
        title: "Semester 4 Course Evaluation",
        sgpa: "2.40",
        courses: [
            { code: "MAT 206", title: "Graph Theory", internal: "41.0", attendance: "96.0%", grade: "P" },
            { code: "CST 202", title: "Computer Organization and Architecture", internal: "32.0", attendance: "90.0%", grade: "F" },
            { code: "CST 204", title: "Database Management Systems", internal: "35.0", attendance: "93.0%", grade: "P" },
            { code: "CST 206", title: "Operating Systems", internal: "33.0", attendance: "92.0%", grade: "F" },
            { code: "HUT 200", title: "Professional Ethics", internal: "38.0", attendance: "95.0%", grade: "P" },
            { code: "MCN 202", title: "Constitution of India", internal: "37.0", attendance: "94.0%", grade: "Pass" },
            { code: "CSL 202", title: "Digital Lab", internal: "70.0", attendance: "100.0%", grade: "B" },
            { code: "CSL 204", title: "Operating Systems Lab", internal: "72.0", attendance: "100.0%", grade: "B" }
        ]
    },
    "S5": {
        title: "Semester 5 Course Evaluation",
        sgpa: "2.80",
        courses: [
            { code: "CST 301", title: "Formal Languages and Automata Theory", internal: "36.0", attendance: "94.0%", grade: "F" },
            { code: "CST 303", title: "Computer Networks", internal: "30.0", attendance: "90.0%", grade: "P" },
            { code: "CST 305", title: "System Software", internal: "45.0", attendance: "98.0%", grade: "B" },
            { code: "CST 307", title: "Microprocessors and Microcontrollers", internal: "34.0", attendance: "92.0%", grade: "F" },
            { code: "CST 309", title: "Management of Software Systems", internal: "33.0", attendance: "91.0%", grade: "P" },
            { code: "MCN 301", title: "Disaster Management", internal: "39.0", attendance: "96.0%", grade: "Pass" },
            { code: "CSL 331", title: "System Software & Microprocessors Lab", internal: "90.0", attendance: "100.0%", grade: "A" }
        ]
    },
    "S6": {
        title: "Semester 6 Course Evaluation",
        sgpa: "2.70",
        courses: [
            { code: "CST 302", title: "Compiler Design", internal: "41.0", attendance: "95.0%", grade: "P" },
            { code: "CST 304", title: "Computer Graphics and Image Processing", internal: "37.0", attendance: "93.0%", grade: "F" },
            { code: "CST 306", title: "Algorithm Analysis and Design", internal: "36.0", attendance: "92.0%", grade: "P" },
            { code: "HUT 300", title: "Industrial Economics and Foreign Trade", internal: "35.0", attendance: "92.0%", grade: "P" },
            { code: "CST 362", title: "Programming in Python", internal: "31.0", attendance: "90.0%", grade: "F" },
            { code: "CSL 332", title: "Networking Lab", internal: "76.0", attendance: "100.0%", grade: "B" },
            { code: "CST 308", title: "Comprehensive Course Work", internal: "68.0", attendance: "100.0%", grade: "P" }
        ]
    }
};

// Function to switch active semester
function loadSemester(semKey) {
    var record = academicRecords[semKey];
    if (!record) return;

    // Update active tab button
    var tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(function(tab) {
        if (tab.innerText.indexOf(semKey) !== -1 || tab.innerText.indexOf(semKey.replace("S", "Semester ")) !== -1) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    // Update banner details
    document.getElementById("semBannerTitle").innerText = record.title;
    document.getElementById("semSgpaValue").innerText = record.sgpa;

    // Populate table rows
    var tbody = document.getElementById("marksTableBody");
    var htmlContent = "";

    record.courses.forEach(function(course) {
        htmlContent += "<tr>" +
            "<td><strong>" + course.code + "</strong> &bull; " + course.title + "</td>" +
            "<td class='align-center'>" + course.internal + "</td>" +
            "<td class='align-center'>" + course.attendance + "</td>" +
            "<td class='align-center'><span class='result-tag'>" + course.grade + "</span></td>" +
        "</tr>";
    });

    tbody.innerHTML = htmlContent;
}

// Form Submission
function handleFormSubmit(event) {
    event.preventDefault();

    var toast = document.getElementById("toastMessage");
    toast.innerText = "Profile details submitted successfully for Athul Raj.";
    toast.style.display = "block";

    setTimeout(function() {
        toast.style.display = "none";
    }, 3000);

    return true;
}

// Form Reset
function resetForm() {
    loadSemester("S1");
    var toast = document.getElementById("toastMessage");
    toast.innerText = "Profile reset to default.";
    toast.style.display = "block";

    setTimeout(function() {
        toast.style.display = "none";
    }, 2000);
}

// Initial page load
window.onload = function() {
    loadSemester("S1");
};
