
window.addEventListener("load", checkAge);

ForumSite.createdDate.addEventListener("input", (e) => validateField(e.target));
ForumSite.createdDate.addEventListener("blur", (e) => validateField(e.target));

ForumSite.username.addEventListener("input", (e) => validateField(e.target));
ForumSite.username.addEventListener("blur", (e) => validateField(e.target));

ForumSite.forumPost.addEventListener("input", (e) => validateField(e.target));
ForumSite.forumPost.addEventListener("blur", (e) => validateField(e.target));

ForumSite.fileImage.addEventListener("input", (e) => validateField(e.target));
ForumSite.fileImage.addEventListener("blur", (e) => validateField(e.target));

ForumSite.addEventListener("submit", onSubmit);
let count;
let ageValid;
let createdDateValid = true;
let usernameValid = true;
let forumPostValid = true;
let imageValid = true;
const api = new Api("http://localhost:5000/tasks");
const forumSiteElement = document.getElementById("forumList")
console.log(forumSiteElement);
function validateField(field) {
  const { name, value } = field;
  console.log(name);

  let = validationMessage = "";
  switch (name) {
    case "createdDate": {
      if (value === "") {
        createdDateValid = false;
        validationMessage = "Du måste specifera ett datum.";
      } else {
        createdDateValid = true;
      }
      break;
    }
    case "username": {
      if (value.length < 5) {
        usernameValid = false;
        validationMessage = "Ditt Användernamn måste vara större än 5 tecken";
      } else {
        UsernameValid = true;
      }
      break;
    }

    case "forumPost": {
      /* Liknande enkla validering som hos title */
      if (value.length > 500) {
        forumPostValid = false;

        validationMessage =
          "Fältet 'forumPost' får inte innehålla mer än 500 tecken.";
      } else if (value.length === 0) {
        forumPostValid = false;
        validationMessage = "Lämna inte fältet forum-post tomt!";
      } else {
        forumPostValid = true;
        console.log(value.length);
      }
      break;
    }
    case "fileImage":
      {
        if (value.length === 0) {
          imageValid = false;
          validationMessage = "Fältet 'image' kan inte var tom";
        } else {
          imageValid = true;
        }
      }
      break;
  }

  field.previousElementSibling.innerText = validationMessage;
  /* Tailwind har en klass som heter "hidden". Om valideringsmeddelandet ska synas vill vi förstås inte att <p>-elementet ska vara hidden, så den klassen tas bort. */
  field.previousElementSibling.classList.remove("hidden");
}

function onSubmit(e) {
  e.preventDefault();
  console.log(createdDateValid && usernameValid && forumPostValid && imageValid);
  if (createdDateValid && usernameValid && forumPostValid && imageValid) {
    savePost()
  }
}
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

async function savePost() {
  // Convert the image to base64
  const file = ForumSite.fileImage.files[0];
  const image = await getBase64(file);
  console.log(image);
  // Create the post object
  const post = {
    createdDate: ForumSite.createdDate.value,
    username: ForumSite.username.value,
    forumPost: ForumSite.forumPost.value,
    inappropriateLanguage: false,
    restrictedAge: false,
    image: image
  };

  // Send the JSON object to the server
  api.create(post).then((post) => {
    if (post) {
      renderList();
    }
  });
}


function renderList() {
  console.log("rendering");

  api.getAll().then((forumPosts) => {
    forumSiteElement.innerHTML = '';

    forumPosts.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
    count = forumPosts.length;
    console.log("Det finns:" + count);
    postcount(count);
    forumPosts.forEach((formPost) => {
      console.log(formPost);
      forumSiteElement.insertAdjacentHTML("beforeend", renderFormPosts(formPost));
    });
  });
}
function checkAge() {
  console.log("checking age");
  const age = prompt("Please enter your age:");
  console.log(age);
  if (age > 18) {
    ageValid = true;
    console.log("Agevalid");
  } else if (age < 18) {
    console.log("Agevalid not valid");
    ageValid = false;


  }

}

function renderFormPosts({ id, createdDate, username, forumPost, image, restrictedAge }) {


  if (restrictedAge && !ageValid) {
    let html = `

  

    
    <li class=" blur-sm list select-none mt-2 py-2 border-b border-amber-300">
    <div class="bg-white rounded-lg shadow-lg p-3">
    <div class="flex justify-between items-center mb-2">
    <div class="text-xs text-gray-600">${id}</div>
      <div class="text-xs text-gray-600">${createdDate}</div>
      <div class="text-xs font-bold text-gray-800">${username}</div>
      
      <label for="Delete"> Radera
      <input type="checkbox" onclick="deletePost(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2"></input>
      </label>
      <label for="Patch"> Restriktera ålder

      <input id="restricted-age-button" type="checkbox" onclick="restrictAge(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2"></input>
      </label>

      </div>
    <div class="mb-2 ">
      <p class="text-base font-serif decoration-lime-500 text-center my-20 text-x3">${forumPost}</p>
    </div>
    
 `

      ;

    html += `
        <div class"">
        <img class="object-cover h-70 w-96" src="${image}" alt="Attached image">
      </div>`;


    html += `
      </li>   
      `;

    return html;

  }
  else {

    let html = `

  


    <li class="  list select-none mt-2 py-2 border-b border-amber-300">
    <div class="bg-white rounded-lg shadow-lg p-3">
    <div class="flex justify-between items-center mb-2">
    <div class="text-xs text-gray-600">${id}</div>
      <div class="text-xs text-gray-600">${createdDate}</div>
      <div class="text-xs font-bold text-gray-800">${username}</div>
      <label for="Delete"> Radera

      <input type="checkbox" onclick="deletePost(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2"></input>
      </label>
      <label for="Patch"> Restriktera ålder

      <input id="restricted-age-button" type="checkbox" onclick="restrictAge(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2"></input>
      </label>
      </div>
    <div class="mb-2 ">
      <p class="text-base font-serif decoration-lime-500 text-center my-20 text-x3">${forumPost}</p>
    </div>
    
 `

      ;

    html += `
        <div class"">
        <img class="object-cover h-70 w-96" src="${image}" alt="Attached image">
      </div>`;


    html += `
      </li>   
      `;

    return html;



  }
}







async function restrictAge(id) {
  const restrictPost = {
    id: id,
    restrictedAge: true

  }
  api.update(restrictPost).then((result) => {
    renderList();


  })

}


function deletePost(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

renderList();


//toolbar
const toggleButton = document.getElementById('toggle-toolbar');
const toolbar = document.getElementById('toolbar');

toggleButton.addEventListener('click', () => {
  if (toolbar.style.display === 'none') {
    toolbar.style.display = 'flex';
  } else {
    toolbar.style.display = 'none';
  }
});


// Decrement the user count when the user leaves the page
window.addEventListener('unload', () => {
  userCount--;
});
// mailto function 
document.addEventListener("DOMContentLoaded", function () {
  const sendEmailButton = document.getElementById('send-email');
  const subjectInput = document.getElementById('email-subject');
  const bodyInput = document.getElementById('email-body');

  sendEmailButton.addEventListener('click', (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(subjectInput.value);
    const body = encodeURIComponent(bodyInput.value);
    const emailUrl = `mailto: h21nikcl@du.se?subject=${subject}&body=${body}`;

    window.location.href = emailUrl;
  });
});
// posts counter



function postcount(count) {
  const existingcount = document.querySelector("count");
  console.log(existingcount);
  existingcount && root.removeChild(existingcount);

  postCounter = document.getElementById("post-counter");
  postCounter.insertAdjacentHTML("beforeend", generateCount(count))
}
function generateCount(count) {
  let html = `

  <section class="count">

<div class="count">${count}</div>
 
</section>`
  return html
}