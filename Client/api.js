/* I denna fil finns en klass för att hantera API-förfrågningar mot server (servern är det backend som skapades i lektion 5).

Om ni vill starta precis denna kod måste ni först installera om node-paket och starta upp servern. Servern, såsom den ser ut i slutet av Lektion 6, finns i denna samma zip-fil. Om ni skulle köra denna kod mot backend såsom det såg ut efter Lektion 5, skulle det inte fungera, eftersom detta är koden såsom den ser ut efter Lektion 6 och några små förändringar gjordes även i servern under Lektion 6. 

Gör då följande här i VS Code: 
1. Öppna en terminal
2. Skriv "cd 02-todo/server" (ut  an citattecken) och sedan enter
3. Skriv "npm install" (utan citattecken) och sedan enter
3. Skriv "node app.js" (utan citattecken) och enter. 

Om servern startats korrekt syns nu texten "Server running on http://localhost:5000".

*/
"use strict";

/* För att skapa en klass används nyckelordet class följt av klassens namn. Klasser bör ha stor inledande bokstav och döpas enligt det som kallas PascalCase. Inga parenteser används vid skapande av en klass. */
class Api {
  /* Medlemsvariabel url, för att lagra en grund-url till servern. */
  url = "";

  /* När en instans av klassen skapas skickas url in som parametern */
  constructor(url) {
    /* Medlemsvariabeln url sätts till den sträng som man skickar in när man skapar en instans av klassen (det görs i script.js). Detta upplägg är för att göra denna klass generell. Tanken är att det ska gå att använda vår api-klass till olika HTTP-anrop, inte bara sådana för våran todo-applikation.   */
    this.url = url;
  }

  /* Metod för att hatera att skapa resurser (Create i CRUD). Motsvarar ett anrop med metoden POST.   
  
  Create = POST
  */
  create(data) {
    /* Konverterar inskickat JavaScriptobjekt, i detta fall är det en uppgift, till en sträng så att den kan skickas över HTTP. */
    const JSONData = JSON.stringify(data);
    /* Utskrift till logg för att se vad som ska skickas och vart det ska skickas */
    console.log(`Sending ${JSONData} to ${this.url}`);

    /* Nedan skapas ett requestobjekt. Requestobjekt finns inbyggda i JavaScript tack vare JavaScripts fetch API. 

    Till request-objektets konstruktor skickas
    1. URL:en dit man vill göra förfrågan. I vårt fall det som man skickade in när klassen skapades och som lagrades i medlemsvariabeln this.url. 
    2. Ett objekt med konfiguration rörande förfrågan. 

    Objektet har följande egenskaper:
    
    method, som har satts till "POST". Eftersom vi här ska skapa något så är POST den metod man vill ha. 

    body, som har satts till den sträng som skapades utifrån det objekt som skickades in så att innehållet - body - i förfrågan kommer att innehålla en strängrepresentation av det som vi vill skapa. I fallet med vår todo-applikaiton kommer det att vara den uppgift som vi vill spara till servern. 

    headers, som är metadata som beskriver olika saker om själva förfrågan. Headers skickas in i form av ett JavaScript-objekt det också och här sätts egenskapen content-type för att beskriva på vilket sätt data är formaterat så att servern vet hur det ska avkodas när det packas upp på serversidan. 
      
    */
    const request = new Request(this.url, {
      method: "POST",
      body: JSONData,
      headers: {
        "content-type": "application/json",
      },
    });

    /* JavaScripts inbyggda funktion fetch är det som används för att göra HTTP-anrop. Fetch tar ett requestobjekt som parameter. Här skickar vi in det requestobjekt som vi skapade direkt ovanför.  */
    console.log(request);
    /* Fetch är inbyggt i JavaScript och används för HTTP-kommunikation till andra servrar, för att t.ex. hämta data. Här använder vi */
    return (
      /* Fetch är asynkron och vi bearbetar förfrågan och svar i flera olika steg med hjälp av then. Slutligen, när hela "then"-kedjan är färdig, kommer resultatet av det hela att returneras ur denna create-metod. Det är därför hela fetch och alla dess then är omslutna av parenteser och står efter return. Man returnerar alltså hela det uttrycket ut ur metoden.  */
      fetch(request)
        /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result, så det avkodas med hjälp av metoden json som finns på result-objektet. result.json() är också asynkrion */
        .then((result) => result.json())
        /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, där data då alltså är resultatet av den asynkrona metoden result.json(). */
        .then((data) => data)
        /* Om något i förfrågan eller svaret går fel, fångas det upp här i catch, där information om felet skrivs ut till loggen.  */
        .catch((err) => console.log(err))
    );
  }

  getAll() {
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  remove(id) {
    console.log(`Removing post with ${id}`);

    return fetch(`${this.url}/${id}`, {
      method: "DELETE",
    })
      .then((result) => result)
      .catch((err) => err);
  }
}
