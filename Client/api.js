"use strict"


class Api {
    url = '';

    constructor(url) {
        this.url = url;
    }

    create(data) {
        const JSONData = JSON.stringify(data);
        console.log(`sending ${JSONData} to ${this.url}`);


        const request = new Request(this.url, {
            method: "POST",
            body: JSONData,
            Headers: {
                "content-type": "application/json"
            }
        });

        console.log(request);


        return (
            fetch(request).then((result) => result.json())
                .then((data) => data)
                .catch((err) => console.log(err))

        )

    }



}





