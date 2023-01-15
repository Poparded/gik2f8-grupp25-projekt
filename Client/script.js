
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
// Funktion för att hämta en base64-kodad bild från en fil
function getBase64(file) {
  // Skapar en ny Promise och returnerar den
  return new Promise((resolve, reject) => {
    // Skapar en ny FileReader
    const reader = new FileReader();
    // Läser in filen som en data-URL
    reader.readAsDataURL(file);
    // När läsningen är klar, körs resolve med resultatet
    reader.onload = () => resolve(reader.result);
    // När det uppstår ett fel, körs reject med felet
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
  console.log("Rendrar lista med foruminlägg...");

  api.getAll().then((forumPosts) => {
    //Rensar den inre HTML-koden för forumplatsen för att säkerställa att inget tidigare innehåll visas
    forumSiteElement.innerHTML = '';

    //Sorterar inläggen efter deras skapadedatum
    forumPosts.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
    //Räkning av antalet inlägg och lagring i en variabel
    const count = forumPosts.length;
    console.log("Det finns " + count + " foruminlägg.");
    //Anropar postcount-funktionen och passerar den count-variabeln
    postcount(count);
    //Itererar genom varje inlägg och renderar det på sidan
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

  // Kollar om inlägget har begränsad ålder och om användarens ålder inte är giltig

  if (restrictedAge && !ageValid) {
    // Skapar en variabel för HTML-koden för inlägget

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
    //Returnerar HTML-koden för inlägget

    return html;

  }
  else {
    // Skapar en variabel för HTML-koden för inlägget

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
    //Returnerar HTML-koden för inlägget

    return html;



  }
}

async function restrictAge(id) {
  // Skapar ett objekt för att representera inlägget med begränsad ålder
  const restrictPost = {
    id: id,
    restrictedAge: true
  }
  // Anropar API:et för att uppdatera inlägget med begränsad ålder
  api.update(restrictPost).then((result) => {
    // Renderar listan med inlägg igen för att visa ändringen
    renderList();
  });
}
// Funktion för att radera ett inlägg med hjälp av dess id
function deletePost(id) {
  // Anropar API-metoden för att ta bort ett inlägg och sedan renderar om listan med inlägg igen
  api.remove(id).then((result) => {
    renderList();
  });
}

renderList();


// Verktygsfältet
const toggleButton = document.getElementById('toggle-toolbar');
const toolbar = document.getElementById('toolbar');

toggleButton.addEventListener('click', () => {
  if (toolbar.style.display === 'none') {
    toolbar.style.display = 'flex';
  } else {
    toolbar.style.display = 'none';
  }
});



// Lägger till en lyssnare för "DOMContentLoaded" händelsen på dokumentet. När allt innehåll har laddats klart, så körs funktionen
document.addEventListener("DOMContentLoaded", function () {
  // Hämtar element för knappen och inputfälten för email-ämne och email-innehåll

  const sendEmailButton = document.getElementById('send-email');
  const subjectInput = document.getElementById('email-subject');
  const bodyInput = document.getElementById('email-body');
  // Lägger till en lyssnare för klick på knappen

  sendEmailButton.addEventListener('click', (event) => {
    // Förhindrar att sidan laddar om
    event.preventDefault();
    // Kodar om värdet i inputfältet för ämne och innehåll till en kompatibel format för en mailto-länk
    const subject = encodeURIComponent(subjectInput.value);
    const body = encodeURIComponent(bodyInput.value);
    // Skapar en mailto-länk med mottagarens email, ämne och innehåll

    const emailUrl = `mailto: h21nikcl@du.se?subject=${subject}&body=${body}`;

    window.location.href = emailUrl;
  });
});
// räknare för inlägg
function postcount(count) {
  // Funktionen postcount tar emot en parameter, count, som innehåller antalet inlägg som ska visas.
  // Letar upp den befintliga räknaren för inlägg
  const existingcount = document.querySelector(".count");
  // Kontrollerar om det finns en befintlig räknare och tar bort den om det finns en
  if (existingcount) {
    existingcount.parentNode.removeChild(existingcount);
  }

  // Hämtar elementet för räknaren av inlägg
  const postCounter = document.getElementById("post-counter");
  // Lägger till den nya räknaren för inlägg genom att anropa funktionen generateCount och skicka med count-parametern
  postCounter.insertAdjacentHTML("beforeend", generateCount(count))
}
// Funktionen generateCount tar emot en parameter, count, och returnerar en sträng med en div-tagg som innehåller antalet inlägg
function generateCount(count) {
  let html = `

  <section>
<div class="count">${count}</div>
</section>`
  return html
}