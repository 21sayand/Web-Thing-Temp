// JavaScript for Mohammed Azeem Sambrath's Student Profile Page
// Handles semester tab switching and contact form submission

document.addEventListener('DOMContentLoaded', () => {
    // KTU CSE Academic Data for Mohammed Azeem Sambrath (STM23CS028)
    const academicData = {
        s1: {
            sgpa: "8.25",
            cgpa: "8.25",
            subjects: [
                { name: "LINEAR ALGEBRA AND CALCULUS", internal: "45", attendance: "98.0%", result: "A+" },
                { name: "ENGINEERING PHYSICS", internal: "42", attendance: "96.0%", result: "A" },
                { name: "ENGINEERING MECHANICS", internal: "40", attendance: "100.0%", result: "B+" },
                { name: "BASICS OF CIVIL & MECHANICAL ENGINEERING", internal: "43", attendance: "97.0%", result: "A" },
                { name: "LIFE SKILLS", internal: "44", attendance: "100.0%", result: "A+" }
            ]
        },
        s2: {
            sgpa: "8.40",
            cgpa: "8.32",
            subjects: [
                { name: "VECTOR CALCULUS, DIFFERENTIAL EQUATIONS & TRANSFORMS", internal: "41", attendance: "98.0%", result: "A" },
                { name: "ENGINEERING CHEMISTRY", internal: "39", attendance: "96.0%", result: "B+" },
                { name: "ENGINEERING GRAPHICS", internal: "46", attendance: "100.0%", result: "S" },
                { name: "BASICS OF ELECTRICAL & ELECTRONICS ENGINEERING", internal: "40", attendance: "97.0%", result: "A" },
                { name: "PROGRAMMING IN C", internal: "44", attendance: "100.0%", result: "A+" },
                { name: "PROFESSIONAL COMMUNICATION", internal: "43", attendance: "99.0%", result: "A" }
            ]
        },
        s3: {
            sgpa: "8.10",
            cgpa: "8.25",
            subjects: [
                { name: "DISCRETE MATHEMATICAL STRUCTURES", internal: "43", attendance: "100.0%", result: "A" },
                { name: "DATA STRUCTURES", internal: "46", attendance: "98.0%", result: "A+" },
                { name: "LOGIC SYSTEM DESIGN", internal: "41", attendance: "97.0%", result: "B+" },
                { name: "OBJECT ORIENTED PROGRAMMING USING JAVA", internal: "44", attendance: "100.0%", result: "A" },
                { name: "DESIGN & ENGINEERING", internal: "40", attendance: "96.0%", result: "B+" },
                { name: "SUSTAINABLE ENGINEERING", internal: "42", attendance: "100.0%", result: "A" }
            ]
        },
        s4: {
            sgpa: "8.60",
            cgpa: "8.34",
            subjects: [
                { name: "GRAPH THEORY", internal: "45", attendance: "99.0%", result: "A+" },
                { name: "COMPUTER ORGANISATION AND ARCHITECTURE", internal: "40", attendance: "97.0%", result: "A" },
                { name: "DATABASE MANAGEMENT SYSTEMS", internal: "44", attendance: "100.0%", result: "A+" },
                { name: "OPERATING SYSTEMS", internal: "43", attendance: "98.0%", result: "A" },
                { name: "PROFESSIONAL ETHICS", internal: "41", attendance: "100.0%", result: "A" },
                { name: "CONSTITUTION OF INDIA", internal: "39", attendance: "96.0%", result: "B+" }
            ]
        },
        s5: {
            sgpa: "8.50",
            cgpa: "8.37",
            subjects: [
                { name: "FORMAL LANGUAGES AND AUTOMATA THEORY", internal: "43", attendance: "100.0%", result: "A" },
                { name: "COMPUTER NETWORKS", internal: "44", attendance: "98.0%", result: "A+" },
                { name: "SYSTEM SOFTWARE", internal: "41", attendance: "97.0%", result: "A" },
                { name: "MICROPROCESSORS AND MICROCONTROLLERS", internal: "39", attendance: "96.0%", result: "B+" },
                { name: "MANAGEMENT OF SOFTWARE SYSTEMS", internal: "42", attendance: "100.0%", result: "A" },
                { name: "DISASTER MANAGEMENT", internal: "40", attendance: "99.0%", result: "A" }
            ]
        },
        s6: {
            sgpa: "8.75",
            cgpa: "8.43",
            subjects: [
                { name: "COMPILER DESIGN", internal: "44", attendance: "100.0%", result: "A+" },
                { name: "COMPUTER GRAPHICS AND IMAGE PROCESSING", internal: "43", attendance: "98.0%", result: "A" },
                { name: "ALGORITHM ANALYSIS AND DESIGN", internal: "46", attendance: "100.0%", result: "A+" },
                { name: "FOUNDATIONS OF MACHINE LEARNING (Elective I)", internal: "45", attendance: "97.0%", result: "A+" },
                { name: "INDUSTRIAL ECONOMICS & FOREIGN TRADE", internal: "41", attendance: "100.0%", result: "A" },
                { name: "COMPREHENSIVE COURSE WORK", internal: "NA", attendance: "100.0%", result: "A" }
            ]
        }
    };

    const tbody = document.getElementById('table-body');
    const sgpaValue = document.getElementById('sgpa-value');
    const cgpaDisplay = document.getElementById('profile-cgpa');
    const semBtns = document.querySelectorAll('.sem-btn');

    // Render table for given semester key
    function renderTable(sem) {
        const data = academicData[sem];
        if (!data) return;

        // Update SGPA display
        sgpaValue.textContent = data.sgpa;

        // Update CGPA in profile badge to show current semester's cumulative CGPA
        if (cgpaDisplay) cgpaDisplay.textContent = data.cgpa;

        // Clear existing rows
        tbody.innerHTML = '';

        // Add subject rows
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

    // Semester tab click handlers
    semBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            semBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTable(e.target.getAttribute('data-sem'));
        });
    });

    // Make gender checkboxes mutually exclusive (simulate radio behavior)
    const genderCbs = document.querySelectorAll('.gender-cb');
    genderCbs.forEach(cb => {
        cb.addEventListener('change', function () {
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
