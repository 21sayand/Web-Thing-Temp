document.getElementById("studentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let blood = document.getElementById("blood").value;
    let company = document.getElementById("company").value;

    let gender = document.querySelector('input[name="gender"]:checked');

    let message = document.getElementById("message");

    if (name === "") {
        message.innerHTML = "Please enter your name.";
        return;
    }

    if (email === "") {
        message.innerHTML = "Please enter your email.";
        return;
    }

    if (phone === "") {
        message.innerHTML = "Please enter your phone number.";
        return;
    }

    if (gender === null) {
        message.innerHTML = "Please select your gender.";
        return;
    }

    if (blood === "") {
        message.innerHTML = "Please select your blood group.";
        return;
    }

    if (company === "") {
        message.innerHTML = "Please select an interested company.";
        return;
    }

    message.innerHTML = "Student profile submitted successfully!";

});
function changeSemester() {

    let semester = document.getElementById("semester").value;
    let table = document.getElementById("marksTable");
    let sgpa = document.getElementById("sgpa");


    if (semester === "S1") {
        sgpa.innerHTML = "5.97";
        table.innerHTML = `
            <tr>
                <td>Engineering Chemistry</td>
                <td>39/50</td>
            </tr>
            <tr>
                <td>Engineering Mechanics</td>
                <td>42/50</td>
            </tr>
            <tr>
                <td>Civil and Mechanical Workshop</td>
                <td>89/100</td>
            </tr>
            <tr>
                <td>Engineering Chemistry Lab</td>
                <td>90/100</td>
            </tr>
            <tr>
                <td>Linear Algebra and Calculus</td>
                <td>46/50</td>
            </tr>
            <tr>
                <td>Life Skills</td>
                <td>45/50</td>
            </tr>
            <tr>
                <td>Basics of Civil and Mechanical Engineering</td>
                <td>39/50</td>
            </tr>
        `;
    } else if (semester === "S2") {
        sgpa.innerHTML = "6.12";
        table.innerHTML = `
            <tr>
                <td>Engineering Physics</td>
                <td>37/50</td>
            </tr>
            <tr>
                <td>Vector Calculus,Differential Equations and
Transforms</td>
                <td>36/50</td>
            </tr>
            <tr>
                <td>Programming in C</td>
                <td>35/50</td>
            </tr>
            <tr>
                <td>Engineering Graphics</td>
                <td>44/50</td>
            </tr>
             <tr>
                <td>BASICS OF ELECTRICAL AND ELECTRONICS ENGINEERING</td>
                <td>42/50</td>
            </tr>
             <tr>
                <td>PROFESSIONAL COMMUNICATION</td>
                <td>41/50</td>
            </tr>
             <tr>
                <td>ENGINEERING PHYSICS LAB</td>
                <td>84/100</td>
            </tr>
             <tr>
                <td>ELECTRICAL AND ELECTRONICS WORKSHOP</td>
                <td>82/100</td>
            </tr>
        `;
SGPA=6.12
    } else if (semester === "S3"){
         sgpa.innerHTML = "5.73";
        table.innerHTML = `
            <tr>
                <td>OBJECT ORIENTED PROGRAMMING USING JAVA</td>
                <td>37/50</td>
            </tr>
            <tr>
                <td>DESIGN & ENGINEERING</td>
                <td>44/50</td>
            </tr>
            <tr>
                <td>Sustainable Engineering</td>
                <td>41/50</td>
            </tr>
            <tr>
                <td>DISCRETE MATHEMATICAL STRUCTURES</td>
                <td>38/50</td>
            </tr>
            <tr>
                <td>DATA STRUCTURES</td>
                <td>42/50</td>
            </tr>
            <tr>
                <td>LOGIC SYSTEM DESIGN</td>
                <td>38/50</td>
            </tr>
            
            <tr>
                <td>DATA STRUCTURES LAB</td>
                <td>61/100</td>
            </tr>
            <tr>
                <td>OBJECT ORIENTED PROGRAMMING LAB</td>
                <td>60/100</td>
            </tr>
        `;
    } else if (semester === "S4"){
        sgpa.innerHTML = "6.86";
        table.innerHTML = `
            <tr>
                <td>GRAPH THEORY</td>
                <td>43/50</td>
            </tr>
            <tr>
                <td>COMPUTER ORGANIZATION AND ARCHITECTURE</td>
                <td>38/50</td>
            </tr>
            <tr>
                <td>DATABASE MANAGEMENT SYSTEMS	</td>
                <td>39/50</td>
            </tr>
            <tr>
                <td>PROFESSIONAL ETHICS	</td>
                <td>40/50</td>
            </tr><tr>
                <td>CONSTITUTION OF INDIA</td>
                <td>39/50</td>
            </tr><tr>
                <td>DIGITAL LAB</td>
                <td>72/100</td>
            </tr><tr>
                <td>OPERATING SYSTEM LAB</td>
                <td>68/100</td>
            </tr><tr>
                <td>OPERATING SYSTEMS</td>
                <td>36/50</td>
            </tr>
        `;
    } else if (semester === "S5"){
        sgpa.innerHTML = "6.28";
        table.innerHTML = `
            <tr>
                <td>DISASTER MANAGEMENT</td>
                <td>39/50</td>
            </tr>
            <tr>
                <td>FORMAL LANGUAGES AND AUTOMATA THEORY</td>
                <td>40/50</td>
            </tr>
            <tr>
                <td>COMPUTER NETWORKS	</td>
                <td>42/50</td>
            </tr>
            <tr>
                <td>SYSTEM SOFTWARE	</td>
                <td>44/50</td>
            </tr><tr>
                <td>MICROPROCESSORS AND MICROCONTROLLERS	</td>
                <td>38/50</td>
            </tr><tr>
                <td>MANAGEMENT OF SOFTWARE SYSTEMS</td>
                <td>36/50</td>
            </tr><tr>
                <td>SYSTEM SOFTWARE AND MICROPROCESSORS LAB</td>
                <td>67/100</td>
            </tr><tr>
                <td>DATABASE MANAGEMENT SYSTEM LAB</td>
                <td>65/100</td>
            </tr>
        `;
    } else if (semester === "S6"){
        sgpa.innerHTML = "6.61";
        table.innerHTML = `
            <tr>
                <td>COMPILER DESIGN</td>
                <td>41/50</td>
            </tr>
            <tr>
                <td> COMPUTER GRAPHICS AND IMAGE PROCESSING</td>
                <td>42/50</td>
            </tr>
            <tr>
                <td>ALGORITHM ANALYSIS AND DESIGN</td>
                <td>42/50</td>
            </tr>
            <tr>
                <td>INDUSTRIAL ECONOMICS AND FOREIGN TRADE</td>
                <td>40/50</td>
            </tr><tr>
                <td>COMPREHENSIVE COURSE WORK	</td>
                <td>NA</td>
            </tr><tr>
                <td>PROGRAMMING IN PYTHON</td>
                <td>35/50</td>
            </tr><tr>
                <td>NETWORKING LAB</td>
                <td>65/100</td>
            </tr><tr>
                <td>MINIPROJECT</td>
                <td>35/50</td>
            </tr>
        `;
    } 
}