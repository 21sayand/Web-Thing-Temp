document.getElementById("studentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let gender = document.querySelector('input[name="gender"]:checked');

    let blood = document.getElementById("blood").value;

    let company = document.getElementById("company").value;


    // Gender validation

    if (gender == null) {

        alert("Please select your gender.");

        return;
    }


    // Blood group validation

    if (blood == "") {

        alert("Please select your blood group.");

        return;
    }


    // Company validation

    if (company == "") {

        alert("Please select your interested company.");

        return;
    }


    // Success message

    document.getElementById("message").innerHTML =
        "Student profile submitted successfully!";

    alert("Form submitted successfully!");

});


/* Clear message when Reset is clicked */

document.getElementById("studentForm").addEventListener("reset", function() {

    document.getElementById("message").innerHTML = "";

});