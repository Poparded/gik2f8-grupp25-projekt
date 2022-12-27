const api = new Api("http://localhost:5000/tasks")
ForumSite.createdDate.addEventListener('input', (e) => validateField(e.target));
ForumSite.createdDate.addEventListener('blur', (e) => validateField(e.target));


ForumSite.username.addEventListener('input', (e) => validateField(e.target));
ForumSite.username.addEventListener('blur', (e) => validateField(e.target));


ForumSite.fileImage.addEventListener('input', (e) => validateField(e.target));
ForumSite.fileImage.addEventListener('blur', (e) => validateField(e.target));

ForumSite.addEventListener('submit', onSubmit);


let CreatedDateValid = true;
let usernameValid = true
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
        case "username": {

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
            if (value.length === 0) {
                ForumPost = false;
                validationMessage =
                    "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
            }
            else if (value.length > 100) {
                ForumPost = false;
                validationMessage =
                    "Du måste ha en beskrivning";
            }
            else {
                ForumPost = true;
            }
            break;

        }
        case "fileImage": {
            if (value.length === 0) {
                ImageValid = false;
                validationMessage =
                    "Fältet 'image' kan inte var tom";
            }
            else {
                ImageValid = true;

            }

        }

    }

    field.previousElementSibling.innerText = validationMessage;
    /* Tailwind har en klass som heter "hidden". Om valideringsmeddelandet ska synas vill vi förstås inte att <p>-elementet ska vara hidden, så den klassen tas bort. */
    field.previousElementSibling.classList.remove('hidden');


}

function onSubmit(e) {
    e.preventDefault();

    if (CreatedDateValid && usernameValid && ForumPostValid && ImageValid) {
        console.log("Submit");

        saveTask();

    }



}

function saveTask() {
    const task = {
        createdDate: ForumSite.createdDate.value,
        username: ForumSite.username.value,
        ForumPost: ForumSite.forumPost.value,
        image: ForumSite.fileImage.value


    }
    Api.create(task)




    createdDate.value = '';
    username.value = '';
    forumPost.value = "";
    fileImage.value = '';
    createdDateValid = false;
    usernameValid = false;
    forumPostValid = false;
    imagePostValid = false;

}