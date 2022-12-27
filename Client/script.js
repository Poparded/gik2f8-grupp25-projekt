ForumSite.createdDate.addEventListener('input', (e) => validateField(e.target));
ForumSite.createdDate.addEventListener('blur', (e) => validateField(e.target));


ForumSite.Username.addEventListener('input', (e) => validateField(e.target));
ForumSite.Username.addEventListener('blur', (e) => validateField(e.target));


ForumSite.fileImage.addEventListener('input', (e) => validateField(e.target));
ForumSite.fileImage.addEventListener('blur', (e) => validateField(e.target));

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
            if (value === 0) {
                CreatedDateValid = false;
                validationMessage = "Du måste specifera ett datum.";
            }
            else {
                CreatedDateValid = true;
            }
            break;
        }
        case "Username": {

            if (value.length < 5) {
                CreatedDateValid = false;
                validationMessage = "Ditt Användernamn måste vara större än 5 tecken";
            }


            else {
                UsernameValid = true;

            }
            break;
        }



        case 'ForumPost': {
            /* Liknande enkla validering som hos title */
            if (value.length > 800) {
                ForumPost = false;
                validationMessage =
                    "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
            } else {
                ForumPost = true;
            }
            break;

        }
        case "fileImage": {
            if (value.length == "") {
                ImageValid = false;
                validationMessage =
                    "Fältet 'image' kan inte var tom";
            }
            else {
                ImageValid = true;

            }

        }

    }


}

function onSubmit(e) {
    e.preventDefault();

    if (CreatedDateValid && UsernameValid && ForumPostValid && ImageValid) {
        console.log("Submit");

        saveTask();

    }



}

function saveTask() {
    const task = {
        createdDate: ForumSite.createdDate.value,
        Username: ForumSite.Username.value,
        ForumPost: ForumSite.ForumPost.value,

    }

}