class Api {
    url = "";

    constructor(url) {
        this.url;
    }

    create(data) {
        const JSONDatabase = JSON.stringify(data);
        console.log('sending ${JSONData} to ${this.url}`);'

        )
    }

}



async function sendRequest() {
    try {
        const request = new Request(this.url, {
            method: "POST",
            body: JSONData,
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors',
        });
        const response = await fetch(request);
        if (response.ok) {
            const data = await response.json();
            // handle success
        } else {
            // handle error
        }
    } catch (error) {
        // handle error
    }
}



