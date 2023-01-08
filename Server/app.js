/* Importrerar nodemodulen express (installerad med npm), som är ett utbrett verktyg för att skapa och arbeta med webbservrar och hantera HTTP-förfrågningar i ett nodejs-backend. */
"use strict"
const bodyParser = require('body-parser');

const express = require('express');
/* Skapar upp ett express-objekt, som i stort representerar en webbserver */
const app = express();

/* Importerar den inbyggda modulen fs */
const fs = require('fs/promises');

const PORT = 5000;
/* Expressobjektet, kallat app, har metoden "use" som används för att sätta inställningar hos vår server */
app
  /* Man kan ange format etc. på de data som servern ska kunna ta emot och skicka. Metoderna json och urlencoded är inbyggda hos express */
  .use(bodyParser.json({ limit: '50mb' }))
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  /* Man kan också ange vad som ska hända övergripande med samtliga förfrågningar. Alla förfrågningar kommer att gå genom nedanstående kod först, innan den behandlas vidare. */
  .use((req, res, next) => {
    /* Det vill säga, alla response-objekt kommer att få nedanstående headers. */
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    /* För att göra så att servern ska kunna behandla förfrågan vidare, använder man funktionen next() som kommer som tredje parameter till denna callbackfunktion.  */
    next();
  });

/* Express (som finns i variabeln app) har metoder för att specificera vad som ska hända vid olika HTTP-metoder. Man anropar metoden get() hos expressobjektet för att fånga upp förfrågningar med metoden GET - alltså en GET-förfrågan -  från en klient.  */

/* .get tar emot
  1. En route, som utgör en del av adressen/URL:en dit man kan skicka förfrågan. Man anger det som ska stå efter domän och port (vår server är konfigurerar som default att köra på localhost:5000), så här metod lyssnar man alltså efter GET-anrop till url:en localhost:5000/task
  
  Notera att route-namnen döps om i lektion 6. De ska heta tasks, inte task, men felet är enligt videorna inte tillrättat i detta skede, så jag lämnar kvar det. 

  2. En callbackfunktion som kommer att köras när en sådan förfrågan görs. Callbackfunktionen tar (minst) två parametrar - ett requestobjekt och ett responseobjekt, som här kallas req och res. Callbackfunktionen är asynkron för att vi använder await inuti. */
app.get('/tasks', async (req, res) => {
  /* För enkel felhantering används try/catch */
  try {
    /* Node har en inbyggd modul som heter fs (importerades i början av denna fil). Den används här för att försöka läsa innehållet i en fil vid namn tasks.json. Anropet är asynkront så man sätter await innan (och async innan callbackfunktionen i app.get().) */
    const tasks = await fs.readFile('./tasks.json');
    /* Innehållet skickas tillbaka till klienten i ett standardresponse. Eftersom allt gick bra kan vi använda defaultinställningarna med statuskod 200 och statustext "ok". Vi kan kalla detta för ett success-response. Efter res.send är förfrågan färdigbehandlad och kopplingen mot servern kommer att stängas ned. */
    res.send(JSON.parse(tasks));
  } catch (error) {
    /* Om någonting i ovanstående kod orsakade en krasch, fångas den här och man skickar istället ett response som har koden 500 (server error) och inkluderar felet, */
    res.status(500).send({ error });
  }
});
/* Express metod för att lyssna efter POST-anrop heter naturligt post(). I övrigt fungerar den likadant som  get */
app.post('/tasks', async (req, res) => {
  try {
    /* Alla data från klienten finns i req-objektet. I req.body finns alla data, alltså själva innehållet i förfrågan. I detta fall den uppgift som ska sparas ned. */
    const task = req.body;
    /* Det befintliga innehållet i filen läses in och sparas till variabeln listBuffer. */
    const listBuffer = await fs.readFile('./tasks.json');
    /* Innehållet i filen är de uppgifter som hittills är sparade. För att kunna behandla listan av uppgifter i filen som JavaScript-objekt behövs JSON.parse. Parse används för att översätta en buffer eller text till JavaScript */
    const currentTasks = JSON.parse(listBuffer);
    /* Skapar en variabel för att kunna sätta id på den nya uppgiften */
    let maxTaskId = 1;
    /* Om det finns några uppgifter sedan tidigare, dvs. currentTasks existerar och är en lista med en längd större än 0 ska ett nytt id räknas ut baserat på de som redan finns i filen */
    if (currentTasks && currentTasks.length > 0) {
      /* Det görs genom array.reduce() som går igenom alla element i listan och tar fram det högsta id:t. Det högsta id:t sparas sedan i variabeln maxTaskId */
      maxTaskId = currentTasks.reduce(
        /* För varje element i currentTasks anropas en callbackfunktion som får två parametrar, maxId och currentElement. maxId kommer att innehålla det id som för närvarande är högst och currentElement representerar det aktuella element i currentTasks som man för närvarande kontrollerar.  */
        (maxId, currentElement) =>
          /* Om id:t för den aktuella uppgiften är större än det i variabeln maxId, sätts maxId om till det id som nu är högst. maxId är från början satt till värdet av maxTaskId (1, enligt rad 53.).  */
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    /* En ny uppgift skapas baserat på den uppgift som skickades in och som hämtades ur req.body, samt egenskapen id som sätts till det högsta id av de uppgifter som redan finns (enligt uträkning med hjälp av reduce ovan) plus ett. Det befintliga objektet och det nya id:t slås ihop till ett nytt objekt med hjälp av spreadoperatorn ... */
    const newTask = { id: maxTaskId + 1, ...task };
    /* Om currentTasks finns - dvs det finns tidigare lagrade uppgifter,  skapas en ny array innehållande tidigare uppgifter (varje befintlig uppgift i currentTasks läggs till i den nya arrayen med hjälp av spreadoperatorn) plus den nya uppgiften. Om det inte tidigare finns några uppgifter, skapas istället en ny array med endast den nya uppgiften.  */
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

    /* Den nya listan görs om till en textsträng med hjälp av JSON.stringify och sparas ner till filen tasks.json med hjälp av fs-modulens writeFile-metod. Anropet är asynkront så await används för att invänta svaret innan koden går vidare. */
    await fs.writeFile('./tasks.json', JSON.stringify(newList));
    /* Det är vanligt att man vid skapande av någon ny resurs returnerar tillbaka den nya sak som skapades. Så den nya uppgiften skickas med som ett success-response. */
    res.send(newTask);
  } catch (error) {
    /* Vid fel skickas istället statuskod 500 och information om felet.  */
    res.status(500).send({ error: error.stack });
  }
});
/* Express metod för att lyssna efter DELETE-anrop heter naturligt delete(). I övrigt fungerar den likadant som get och post */

/* Route-adressen som specificeras i delete har /:id i tillägg till adressen. Det betyder att man i adressen kan skriva task följt av ett / och sedan något som kommer att sparas i en egenskap vid namn id. :id betyder att det som står efter / kommer att heta id i requestobjektet. Hade kunnat vara vad som helst. Så här möjliggörs att lyssna efter DELETE-anrop på exempelvis url:en localhost:5000/task/1 där 1 då skulle motsvara ett id på den uppgift man vill ta bort */
app.delete('/tasks/:id', async (req, res) => {
  console.log(req);
  try {
    /* För att nå egenskaper tagna ur url:en  använder man req.params och sedan namnet som man gett egenskapen, i detta fall id, då vi skrev :id. */
    const id = req.params.id;
    /* På samma sätt som vid post, hämtas filens befintliga innehåll ut med hjälp av fs.readFile, som inväntas med await. */
    const listBuffer = await fs.readFile('./tasks.json');
    /* Innehållet i filen parsas till JavaScript för att kunna behandlas vidare i kod. */
    const currentTasks = JSON.parse(listBuffer);
    /* Först en kontroll om det ens finns något i filen, annars finns ju inget att ta bort */
    if (currentTasks.length > 0) {
      /* Om det finns något i filen görs här en hel del i samma anrop: 
      1. De befintliga uppgifterna (currentTasks), filtreras så att den uppgift med det id som skickades in filtreras bort och endast de uppgifter som inte hade det id:t är kvar.
      2. Arrayen med alla uppgifter utom den med det id som skickades in görs om till en sträng med JSON.stringify
      3. Denna sträng sparas slutgilgingen till filen tasks.json, så att det kommer att finnas en uppdaterad lista som inte längre innehåller uppgiften med det id som skickades in via url:en. */
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      /* När den nya listan har skrivits till fil skickas ett success-response  */
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      /* Om det inte fanns något i filen sedan tidigare skickas statuskod 404. 404 används här för att det betyder "Not found", och det stämmer att den uppgift som man ville ta bort inte kunde hittas om listan är tom. Vi har dock inte kontrollerat inuti en befintlig lista om det en uppgift med det id som man önskar ta bort faktiskt finns. Det hade man också kunnat göra. */
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    /* Om något annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel, tillsammans med information om felet.  */
  }
});


app.patch('/tasks', async (req, res) => {

  try {
    const post = req.body;
    const ListBuffer = await fs.readFile("./tasks.json")
    console.log("In patch");
    const currentPosts = JSON.parse(ListBuffer)
    const i = currentPosts.findIndex(item => item.id === post.id);
    if (!currentPosts[i].restrictedAge) {
      currentPosts[i].restrictedAge = post.restrictedAge;
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentPosts));
    }
    else if (currentPosts[i].restrictedAge)
      currentPosts[i].restrictedAge = !post.restrictedAge;
    await fs.writeFile(
      './tasks.json',
      JSON.stringify(currentPosts));

    res.send(currentPosts);

  }
  catch (error) {
    console.log(error);

  }
}


)






/* Med app.listen säger man åte servern att starta. Första argumentet är port - dvs. det portnummer man vill att servern ska köra på. Det sattes till 5000 på rad 9. Det andra argumentet är en anonym arrow-funktion som körs när servern har lyckats starta. Här skrivs bara ett meddelande ut som berättar att servern kör, så att man får feedback på att allt körts igång som det skulle. */
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));


