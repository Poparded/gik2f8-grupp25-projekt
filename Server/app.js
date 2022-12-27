"use strict"

const express = require('express')

const app = express();

const fs = require("fs/promises");
const PORT = 5000;

app
    /* Man kan ange format etc. på de data som servern ska kunna ta emot och skicka. Metoderna json och urlencoded är inbyggda hos express */
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    /* Man kan också ange vad som ska hända övergripande med samtliga förfrågningar. Alla förfrågningar kommer att gå genom nedanstående kod först, innan den behandlas vidare. */
    .use((req, res, next) => {
        /* Det vill säga, alla response-objekt kommer att få nedanstående headers. */
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', '*');
        /* För att göra så att servern ska kunna behandla förfrågan vidare, använder man funktionen next() som kommer som tredje parameter till denna callbackfunktion.  */
        next();
    });





app.get('/tasks', async (req, res) => {

    try {
        const task = await fs.readFile('./task.json');
        res.send(JSON.parse(tasks))
    } catch (error) {
        res.status(500).send({ error });
    }

}
    //ding dong


);

app.post("/tasks", async (req, res) => {
    try {
        const task = req.body;
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

