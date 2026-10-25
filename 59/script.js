function validateForm() {

    var name = document.getElementById("name").value;

    var gender =
        document.querySelector('input[name="gender"]:checked');

    var blood =
        document.getElementById("blood").value;

    var company =
        document.getElementById("company").value;

    var message =
        document.getElementById("message");


    if (name == "") {

        message.innerHTML =
            "Please enter your name.";

        message.style.color = "red";

        return;
    }


    if (gender == null) {

        message.innerHTML =
            "Please select your gender.";

        message.style.color = "red";

        return;
    }


    if (blood == "") {

        message.innerHTML =
            "Please select your blood group.";

        message.style.color = "red";

        return;
    }


    if (company == "") {

        message.innerHTML =
            "Please select an interested company.";

        message.style.color = "red";

        return;
    }


    message.innerHTML =
        "Student profile submitted successfully!";

    message.style.color = "green";
}


function resetMessage() {

    document.getElementById("message").innerHTML = "";

}