ForumSite.createdDate.addEventListener('input', (e) => validateField(e.target));
ForumSite.createdDate.addEventListener('blur', (e) => validateField(e.target));


ForumSite.Username.addEventListener('input', (e) => validateField(e.target));
ForumSite.Username.addEventListener('blur', (e) => validateField(e.target));


ForumSite.image.addEventListener('input', (e) => validateField(e.target));
ForumSite.image.addEventListener('blur', (e) => validateField(e.target));

ForumSite.addEventListener('submit', onSubmit);


let CreatedDateValid = true;
let UsernameValid = true
let ForumPostValid = true;
let ImageValid = true;


function validateField(field) {
    const { name, value } = field;
    let = validationMessage = "";
    switch (name) {
        case "createdDate": {
            if (value == "") {
                CreatedDateValid = false;
                validationMessage = "Du måste specifera ett datum.";
            }
            else {

                CreatedDateValid = true;
            }
            break;
        }
        case "Username": {

            if (value.length < 6)
  }


        case 'description': {
            /* Liknande enkla validering som hos title */
            if (value.length > 500) {
                descriptionValid = false;
                validationMessage =
                    "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
            } else {
                descriptionValid = true;
            }
            break;

        }
    }