"use strict"


class Api {
    url = '';

    constructor(url) {
        this.url = url;
    }

    create(data) {
        const JSONData = JSON.stringify(data);
        console.log('sending ${JSONData} to ${this.url}`);')


        const request = new request(this.url, {
            method: "Post",
            body: JSONData,
            Headers: {
                "content-type": "application/json"
            }
        });



        fetch(request).then(result)
    }






}





