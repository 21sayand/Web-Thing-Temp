document.getElementById("studentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let gender = document.querySelector('input[name="gender"]:checked');

    let blood = document.getElementById("blood").value;

    let company = document.getElementById("company").value;


    if (gender == null) {

        alert("Please select your gender.");

        return;
    }


    if (blood == "") {

        alert("Please select your blood group.");

        return;
    }


    if (company == "") {

        alert("Please select your interested company.");

        return;
    }


    document.getElementById("message").innerHTML =
        "Student profile submitted successfully!";

    alert("Form submitted successfully!");

});


document.getElementById("studentForm").addEventListener("reset", function() {

    document.getElementById("message").innerHTML = "";

});