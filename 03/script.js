document.addEventListener('DOMContentLoaded', () => {
    // KTU CSE Data updated from University_Result.pdf
    const academicData = {
        s1: {
            sgpa: "7.09",
            subjects: [
                {name: "LINEAR ALGEBRA AND CALCULUS", internal: "48.0", attendance: "100.0%", result: "A"},
                {name: "ENGINEERING CHEMISTRY", internal: "37.0", attendance: "100.0%", result: "P"},
                {name: "ENGINEERING MECHANICS", internal: "43.0", attendance: "100.0%", result: "D"},
                {name: "BASICS OF CIVIL AND MECHANICAL ENGINEERING", internal: "42.0", attendance: "100.0%", result: "C+"},
                {name: "LIFE SKILLS", internal: "43.0", attendance: "100.0%", result: "P"},
                {name: "ENGINEERING CHEMISTRY LAB", internal: "90.0", attendance: "100.0%", result: "S"},
                {name: "CIVIL AND MECHANICAL WORKSHOP", internal: "83.0", attendance: "100.0%", result: "A"}
            ]
        },
        s2: {
            sgpa: "7.10",
            subjects: [
                {name: "VECTOR CALCULUS, DIFFERENTIAL EQUATIONS", internal: "44.0", attendance: "100.0%", result: "C"},
                {name: "ENGINEERING PHYSICS A", internal: "38.0", attendance: "100.0%", result: "P"},
                {name: "ENGINEERING GRAPHICS", internal: "46.0", attendance: "100.0%", result: "S"},
                {name: "BASICS OF ELECTRICAL AND ELECTRONICS ENGG", internal: "39.0", attendance: "100.0%", result: "P"},
                {name: "PROFESSIONAL COMMUNICATION", internal: "40.0", attendance: "100.0%", result: "P"},
                {name: "PROGRAMMING IN C", internal: "43.0", attendance: "100.0%", result: "B+"},
                {name: "ENGINEERING PHYSICS LAB", internal: "81.0", attendance: "100.0%", result: "A"},
                {name: "ELECTRICAL AND ELECTRONICS WORKSHOP", internal: "83.0", attendance: "100.0%", result: "A"}
            ]
        },
        s3: {
            sgpa: "7.00",
            subjects: [
                {name: "DISCRETE MATHEMATICAL STRUCTURES", internal: "46.0", attendance: "100.0%", result: "C"},
                {name: "DATA STRUCTURES", internal: "45.0", attendance: "100.0%", result: "C"},
                {name: "LOGIC SYSTEM DESIGN", internal: "42.0", attendance: "100.0%", result: "C+"},
                {name: "OBJECT ORIENTED PROGRAMMING USING JAVA", internal: "41.0", attendance: "100.0%", result: "C"},
                {name: "DESIGN AND ENGINEERING", internal: "44.0", attendance: "100.0%", result: "B"},
                {name: "SUSTAINABLE ENGINEERING", internal: "39.0", attendance: "100.0%", result: "B"},
                {name: "DATA STRUCTURES LAB", internal: "69.0", attendance: "100.0%", result: "B"},
                {name: "OBJECT ORIENTED PROGRAMMING LAB (IN JAVA)", internal: "61.0", attendance: "100.0%", result: "A+"}
            ]
        },
        s4: {
            sgpa: "7.41",
            subjects: [
                {name: "GRAPH THEORY", internal: "47.0", attendance: "100.0%", result: "S"},
                {name: "COMPUTER ORGANISATION AND ARCHITECTURE", internal: "38.0", attendance: "97.0%", result: "C"},
                {name: "DATABASE MANAGEMENT SYSTEMS", internal: "40.0", attendance: "96.0%", result: "C"},
                {name: "OPERATING SYSTEMS", internal: "39.0", attendance: "100.0%", result: "C"},
                {name: "PROFESSIONAL ETHICS", internal: "39.0", attendance: "100.0%", result: "D"},
                {name: "CONSTITUTION OF INDIA", internal: "40.0", attendance: "97.0%", result: "P"},
                {name: "DIGITAL LAB", internal: "73.0", attendance: "100.0%", result: "B+"},
                {name: "OPERATING SYSTEMS LAB", internal: "71.0", attendance: "100.0%", result: "A"}
            ]
        },
        s5: {
            sgpa: "6.70",
            subjects: [
                {name: "FORMAL LANGUAGES AND AUTOMATA THEORY", internal: "44.0", attendance: "99.0%", result: "C+"},
                {name: "COMPUTER NETWORKS", internal: "42.0", attendance: "100.0%", result: "D"},
                {name: "SYSTEM SOFTWARE", internal: "40.0", attendance: "100.0%", result: "C+"},
                {name: "MICROPROCESSORS AND MICROCONTROLLERS", internal: "37.0", attendance: "97.0%", result: "D"},
                {name: "MANAGEMENT OF SOFTWARE SYSTEMS", internal: "38.0", attendance: "100.0%", result: "D"},
                {name: "DISASTER MANAGEMENT", internal: "42.0", attendance: "100.0%", result: "C+"},
                {name: "SYSTEM SOFTWARE AND MICROPROCESSORS LAB", internal: "72.0", attendance: "100.0%", result: "B"},
                {name: "DATABASE MANAGEMENT SYSTEMS LAB", internal: "69.0", attendance: "100.0%", result: "A"}
            ]
        },
        s6: {
            sgpa: "7.24",
            subjects: [
                {name: "COMPILER DESIGN", internal: "43.0", attendance: "100.0%", result: "D"},
                {name: "COMPUTER GRAPHICS AND IMAGE PROCESSING", internal: "43.0", attendance: "99.0%", result: "C+"},
                {name: "ALGORITHM ANALYSIS AND DESIGN", internal: "46.0", attendance: "100.0%", result: "C+"},
                {name: "PROGRAMMING IN PYTHON", internal: "43.0", attendance: "98.0%", result: "C+"},
                {name: "INDUSTRIAL ECONOMICS AND FOREIGN TRADE", internal: "42.0", attendance: "100.0%", result: "C+"},
                {name: "COMPREHENSIVE COURSE WORK", internal: "NA", attendance: "100.0%", result: "C"},
                {name: "NETWORKING LAB", internal: "71.0", attendance: "100.0%", result: "A+"},
                {name: "MINIPROJECT", internal: "70.0", attendance: "100.0%", result: "S"}
            ]
        }
    };

    const tbody = document.getElementById('table-body');
    const sgpaValue = document.getElementById('sgpa-value');
    const semBtns = document.querySelectorAll('.sem-btn');

    // Function to render table based on semester
    function renderTable(sem) {
        const data = academicData[sem];
        if (!data) return;

        // Update SGPA
        sgpaValue.textContent = data.sgpa;

        // Clear existing rows
        tbody.innerHTML = '';

        // Add new rows
        data.subjects.forEach(sub => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sub.name}</td>
                <td>${sub.internal}</td>
                <td>${sub.attendance}</td>
                <td><strong>${sub.result}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Initial render for S1
    renderTable('s1');

    // Add click listeners to tabs
    semBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            semBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            
            // Render corresponding data
            const sem = e.target.getAttribute('data-sem');
            renderTable(sem);
        });
    });

    // Make gender checkboxes mutually exclusive (simulate radio behavior for checkboxes)
    const genderCbs = document.querySelectorAll('.gender-cb');
    genderCbs.forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked) {
                genderCbs.forEach(otherCb => {
                    if (otherCb !== this) otherCb.checked = false;
                });
            }
        });
    });

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        alert("Information submitted successfully!");
        contactForm.reset();
    });
});
