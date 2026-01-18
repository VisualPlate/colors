const jsonPath = "json/color.json";

const output = document.getElementById("outputHex");


function fetchApi(path) {
    fetch(path)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: Status: ${response.Status}`)
        }
        return response.json();
    })
    .then((data) => {
        console.log(data.hex);
        for (const len of data) {
            let html = `
            <div class="color-container">
                    <div class="row w100 h100 colors">`
                    
            for (const hex of len.hex) {
                html += `
                        <div class="row w100 h100 jcc" style="background-color:${hex};">
                            <h1 class="color-header asc">${hex}</h1>
                        </div>
                        `
            }

            html += `
                    </div>
                    <div class="col general-padding">
                        <h1 class="capitalize">${len.name}</h1>
                        <div class="row jcsb w100">
                            <h3 class="capitalize">type: ${len.type}</h3>
                            <h3 class="capitalize">ID: ${len.colorId}</h3>    
                        </div>
                    </div>
                </div>
            `
            output.innerHTML += html
        }
    })
    .catch((error) => {
        console.error("Error fetching JSON: ", error)
    })
}
fetchApi(jsonPath);