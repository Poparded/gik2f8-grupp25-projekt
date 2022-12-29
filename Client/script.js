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
const api = new Api('http://localhost:5000/tasks');


function validateField(field) {
  const { name, value } = field;
  console.log(field);
  let = validationMessage = "";
  switch (name) {
    case "createdDate": {
      if (value === "") {
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
      if (value.length > 500) {
        ForumPostValid = false;

        validationMessage = "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      }
      else if (value.length === 0) {
        ForumPostValid = false;
        validationMessage = "Du måste specifiera ett datum :(((((((((((( .";

      }
      else {
        ForumPostValid = true;
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
  console.log(e);
  if (e.defaultPrevented) {
    validate()
  }

}
function validate() {
  console.log('Submit');

  saveTask();
}





function saveTask() {
  const task = {
    createdDate: ForumSite.createdDate.value,
    username: ForumSite.username.value,
    ForumPost: ForumSite.forumPost.value,
    image: ForumSite.fileImage.value


  };
  api.create(task).then((task) => {
    /* Task kommer här vara innehållet i promiset. Om vi ska följa objektet hela vägen kommer vi behöva gå hela vägen till servern. Det är nämligen det som skickas med res.send i server/api.js, som api-klassens create-metod tar emot med then, översätter till JSON, översätter igen till ett JavaScript-objekt, och till sist returnerar som ett promise. Nu har äntligen det promiset fångats upp och dess innehåll - uppgiften från backend - finns tillgängligt och har fått namnet "task".  */
    if (task) {
      console.log(task);
      console.log("Success");
    }

  });






}