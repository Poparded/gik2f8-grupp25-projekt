ForumSite.createdDate.addEventListener('input', (e) => validateField(e.target));
ForumSite.createdDate.addEventListener('blur', (e) => validateField(e.target));


ForumSite.username.addEventListener('input', (e) => validateField(e.target));
ForumSite.username.addEventListener('blur', (e) => validateField(e.target));


ForumSite.forumPost.addEventListener('input', (e) => validateField(e.target));
ForumSite.forumPost.addEventListener('blur', (e) => validateField(e.target));



ForumSite.fileImage.addEventListener('input', (e) => validateField(e.target));
ForumSite.fileImage.addEventListener('blur', (e) => validateField(e.target));

ForumSite.addEventListener('submit', onSubmit);


let createdDateValid = true;
let usernameValid = true
let forumPostValid = true;
let imageValid = true;
const api = new Api('http://localhost:5000/tasks');
const forumSiteElement = document.getElementById("root");

function validateField(field) {
  const { name, value } = field;
  console.log(name);

  let = validationMessage = "";
  switch (name) {
    case "createdDate": {
      if (value === "") {
        createdDateValid = false;
        validationMessage = "Du måste specifera ett datum.";
      }
      else {
        createdDateValid = true;
      }
      break;
    }
    case "username": {

      if (value.length < 5) {
        usernameValid = false;
        validationMessage = "Ditt Användernamn måste vara större än 5 tecken";
      }


      else {
        UsernameValid = true;

      }
      break;
    }



    case 'forumPost': {
      /* Liknande enkla validering som hos title */
      if (value.length > 500) {
        forumPostValid = false;

        validationMessage = "Fältet 'forumPost' får inte innehålla mer än 500 tecken.";
      }
      else if (value.length === 0) {
        forumPostValid = false;
        validationMessage = "Lämna inte fältet forum-post tomt!";

      }
      else {
        forumPostValid = true;
        console.log(value.length);

      }
      break;
    }
    case "fileImage": {
      if (value.length === 0) {
        imageValid = false;
        validationMessage =
          "Fältet 'image' kan inte var tom";
      }
      else {
        imageValid = true;

      }

    }

  }

  field.previousElementSibling.innerText = validationMessage;
  /* Tailwind har en klass som heter "hidden". Om valideringsmeddelandet ska synas vill vi förstås inte att <p>-elementet ska vara hidden, så den klassen tas bort. */
  field.previousElementSibling.classList.remove('hidden');


}


function onSubmit(e) {
  e.preventDefault();
  if (createdDateValid && usernameValid && forumPostValid && imageValid)

    saveTask();
}









function saveTask() {
  const task = {
    createdDate: ForumSite.createdDate.value,
    username: ForumSite.username.value,
    forumPost: ForumSite.forumPost.value,
    image: ForumSite.fileImage.value


  };
  api.create(task).then((task) => {
    /* Task kommer här vara innehållet i promiset. Om vi ska följa objektet hela vägen kommer vi behöva gå hela vägen till servern. Det är nämligen det som skickas med res.send i server/api.js, som api-klassens create-metod tar emot med then, översätter till JSON, översätter igen till ett JavaScript-objekt, och till sist returnerar som ett promise. Nu har äntligen det promiset fångats upp och dess innehåll - uppgiften från backend - finns tillgängligt och har fått namnet "task".  */
    if (task) {
      renderList()
    }
    /*createdDate.value = null;
    username.value = null
    forumPost.value = null;
    imageValid.value = null;
    CreatedDateValid = true;
    usernameValid = true
    ForumPostValid = true;
    ImageValid = true;*/
  });

}



function renderList() {
  console.log('rendering');



  api.getAll().then((forumPosts) => {
    forumPosts.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    forumPosts.forEach(item => forumSiteElement.insertAdjacentHTML("afterend", renderFormPosts(item)));
  });
}

function renderFormPosts({ createdDate, username, forumPost, fileImage }) {
let html = `
  
  <div class="bg-white rounded-lg shadow-lg p-3">
  <div class="flex justify-between items-center mb-2">
    <div class="text-xs text-gray-600">${createdDate}</div>
    <div class="text-xs font-bold text-gray-800">${username}</div>
  </div>
  <div class="mb-2">
    <p class="text-base font-serif text-gray-800">${forumPost}</p>
  </div>
  <div>
    <img class="h-10 w-full object-cover" src="${fileImage}" alt="Attached image">
  </div>
</div>
    
`
  
    

  return html;

}


renderList();
