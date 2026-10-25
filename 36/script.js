document.addEventListener('DOMContentLoaded', () => {
    // Riya's Academic Data from University_Result.pdf
    const academicData = {
        s1: {
            sgpa: "6.76",
            subjects: [
                {name: "BASICS OF CIVIL AND MECHANICAL ENGINEERING", internal: "37.0", result: "C"},
                {name: "CIVIL AND MECHANICAL WORKSHOP", internal: "83.0", result: "A"},
                {name: "ENGINEERING CHEMISTRY", internal: "39.0", result: "D"},
                {name: "ENGINEERING CHEMISTRY LAB", internal: "91.0", result: "S"},
                {name: "ENGINEERING MECHANICS", internal: "39.0", result: "P"},
                {name: "LIFE SKILLS", internal: "43.0", result: "P"},
                {name: "LINEAR ALGEBRA AND CALCULUS", internal: "47.0", result: "B"}
            ]
        },
        s2: {
            sgpa: "7.33",
            subjects: [
                {name: "BASICS OF ELECTRICAL AND ELECTRONICS ENGINEERING", internal: "46.0", result: "B+"},
                {name: "ELECTRICAL AND ELECTRONICS WORKSHOP", internal: "80.0", result: "A"},
                {name: "ENGINEERING GRAPHICS", internal: "35.0", result: "B"},
                {name: "ENGINEERING PHYSICS A", internal: "42.0", result: "B"},
                {name: "ENGINEERING PHYSICS LAB", internal: "86.0", result: "A+"},
                {name: "PROFESSIONAL COMMUNICATION", internal: "38.0", result: "P"},
                {name: "PROGRAMMING IN C", internal: "40.0", result: "C+"},
                {name: "VECTOR CALCULUS, DIFFERENTIAL EQUATIONS", internal: "45.0", result: "D"}
            ]
        },
        s3: {
            sgpa: "6.77",
            subjects: [
                {name: "DATA STRUCTURES", internal: "41.0", result: "D"},
                {name: "DATA STRUCTURES LAB", internal: "62.0", result: "C"},
                {name: "DESIGN AND ENGINEERING", internal: "49.0", result: "C+"},
                {name: "DISCRETE MATHEMATICAL STRUCTURES", internal: "43.0", result: "C+"},
                {name: "LOGIC SYSTEM DESIGN", internal: "40.0", result: "C+"},
                {name: "OBJECT ORIENTED PROGRAMMING LAB (IN JAVA)", internal: "60.0", result: "D"},
                {name: "OBJECT ORIENTED PROGRAMMING USING JAVA", internal: "39.0", result: "B"},
                {name: "SUSTAINABLE ENGINEERING", internal: "44.0", result: "B+"}
            ]
        },
        s4: {
            sgpa: "7.77",
            subjects: [
                {name: "COMPUTER ORGANISATION AND ARCHITECTURE", internal: "44.0", result: "B+"},
                {name: "CONSTITUTION OF INDIA", internal: "42.0", result: "B+"},
                {name: "DATABASE MANAGEMENT SYSTEMS", internal: "44.0", result: "C+"},
                {name: "DIGITAL LAB", internal: "72.0", result: "S"},
                {name: "GRAPH THEORY", internal: "44.0", result: "B+"},
                {name: "OPERATING SYSTEMS", internal: "41.0", result: "B"},
                {name: "OPERATING SYSTEMS LAB", internal: "62.0", result: "B"},
                {name: "PROFESSIONAL ETHICS", internal: "45.0", result: "C+"}
            ]
        },
        s5: {
            sgpa: "6.98",
            subjects: [
                {name: "COMPUTER NETWORKS", internal: "43.0", result: "C"},
                {name: "DATABASE MANAGEMENT SYSTEMS LAB", internal: "64.0", result: "A+"},
                {name: "DISASTER MANAGEMENT", internal: "41.0", result: "C+"},
                {name: "FORMAL LANGUAGES AND AUTOMATA THEORY", internal: "44.0", result: "P"},
                {name: "MANAGEMENT OF SOFTWARE SYSTEMS", internal: "37.0", result: "P"},
                {name: "MICROPROCESSORS AND MICROCONTROLLERS", internal: "42.0", result: "B"},
                {name: "SYSTEM SOFTWARE", internal: "46.0", result: "B+"},
                {name: "SYSTEM SOFTWARE AND MICROPROCESSORS LAB", internal: "69.0", result: "B+"}
            ]
        },
        s6: {
            sgpa: "8.13",
            subjects: [
                {name: "ALGORITHM ANALYSIS AND DESIGN", internal: "45.0", result: "B"},
                {name: "COMPILER DESIGN", internal: "47.0", result: "B+"},
                {name: "COMPREHENSIVE COURSE WORK", internal: "NA", result: "P"},
                {name: "COMPUTER GRAPHICS AND IMAGE PROCESSING", internal: "46.0", result: "A+"},
                {name: "INDUSTRIAL ECONOMICS AND FOREIGN TRADE", internal: "40.0", result: "C"},
                {name: "MINIPROJECT", internal: "67.0", result: "S"},
                {name: "NETWORKING LAB", internal: "72.0", result: "S"},
                {name: "PROGRAMMING IN PYTHON", internal: "45.0", result: "B+"}
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

        // Add new rows with Internal columns
        data.subjects.forEach(sub => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sub.name}</td>
                <td>${sub.internal}</td>
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

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Information submitted successfully!");
        contactForm.reset();
    });
});
