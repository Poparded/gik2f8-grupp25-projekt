var string = 'Hello World!';
// Encode the String
var encodedString = window.btoa(string);
console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

// Decode the String
var decodedString = window.atob(encodedString);
console.log(decodedString); // Outputs: "Hello World!"
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
    console.log(forumPosts);
    forumPosts.forEach((formPost) => {
      console.log(formPost);
      forumSiteElement.insertAdjacentHTML("beforeend", renderFormPosts(formPost));
    });
  });
}

function renderFormPosts({ id, createdDate, username, forumPost, image, inappropriateLanguage }) {
  if (!inappropriateLanguage) {
    let html = `

  


  <li class=" list select-none mt-2 py-2 border-b border-amber-300">
  <div class="bg-white rounded-lg shadow-lg p-3">
  <div class="flex justify-between items-center mb-2">
  <div class="text-xs text-gray-600">${id}</div>
    <div class="text-xs text-gray-600">${createdDate}</div>
    <div class="text-xs font-bold text-gray-800">${username}</div>
    <input type="checkbox" onclick="deletePost(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2"></input>
    <input id="restricted-age-button" type="checkbox" onclick="restrictAge(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2"></input>

    </div>
  <div class="mb-2 ">
    <p class="text-base font-serif decoration-lime-500 text-center my-20 text-x3">${forumPost}</p>
  </div>`

      ;

    // First, decode the base64-encoded image string
    //const encodedImage = window.btoa(image) 
    /* console.log(image);
   
     const decodedImage = window.atob(image)
     console.log(decodedImage);
   
   
     // Create a new image file from the binary data
     const imageUrl = URL.createObjectURL(new Blob([decodedImage], { type: 'image/jpg' }));
     console.log(imageUrl);*/
    // Set the src attribute of the img element to the image data
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





  }
}





function checkAge() {
  let ageValid;
  console.log("checking age");
  const age = prompt("Please enter your age:");
  if (age < 18) {
    alert("Sorry, you must be 21 or older to view this content.");
    ageValid = false;
  } else {
    ageValid = true;
  }
}

async function restrictAge(id) {
  const restrictPost = {
    id: id,
    restrictAge: true

  }
  api.update(restrictPost)

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

//NUMBER COUNTING
let userCount = 0;

// Increment the user count when the page loads
window.addEventListener('load', () => {
  userCount++;

  // Update the user count every 1000 milliseconds (1 second)
  setInterval(() => {
    document.getElementById('user-count').innerHTML = userCount;
  }, 1000);
});

// Decrement the user count when the user leaves the page
window.addEventListener('unload', () => {
  userCount--;
});
