const jsonPath = "json/color.json";

const output = document.getElementById("outputHex");


const btnApplyFilters = document.getElementById("applyFilters");
const sortByFilter = document.getElementById("srcTerm");

let orderBy = "default";

function fetchApi(path) {
    output.innerHTML = "";
    fetch(path)
    .then((response) => {
        if (!response.ok) {
            let html = `
                <div class="color-container">
                        <div class="col general-padding">
                            <h1 class="capitalize">Error!</h1>
                            <div class="col jcsb w100">
                                <h3 class="capitalize">Server didn't respond with 200</h3> 
                                <p class="capitalize">HTTP error: Status: ${response.Status}</p> 
                            </div>
                        </div>
                    </div>
                `;
            output.innerHTML += html;
            throw new Error(`HTTP error: Status: ${response.Status}`)
        }
        return response.json();
    })
    .then((data) => {
        if (data.length !== 0) {
            let dataOrder = "empty";
            if (orderBy === "asc" || orderBy === "default") {dataOrder = data}
            else if (orderBy === "desc") {dataOrder = data.toReversed()}
            if (dataOrder !== "empty") {
                for (const len of dataOrder) {
                    let html = `
                    <div class="color-container">
                            <div class="row w100 h100 colors">`
                            
                    for (const hex of len.hex) {
                        html += `
                                <div class="row w100 h100 jcc color-bg" style="background-color:${hex};">
                                    <h1 class="color-header asc">${hex}</h1>
                                </div>
                                `
                    };

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
                    `;
                    output.innerHTML += html;
                }
            } else {
                let html = `
                    <div class="color-container">
                            <div class="col general-padding">
                                <h1 class="capitalize">Error!</h1>
                                <div class="col jcsb w100">
                                    <h3 class="capitalize">invalid filters applied</h3> 
                                    <p class="capitalize">try again or reload the page</p> 
                                </div>
                            </div>
                        </div>
                    `;
                output.innerHTML += html;
            }
        } else {
                let html = `
                    <div class="color-container">
                            <div class="col general-padding">
                                <h1 class="capitalize">Error!</h1>
                                <div class="col jcsb w100">
                                    <h3 class="capitalize">invalid or empty json</h3> 
                                    <p class="capitalize">try again, check your internet or reload the page</p> 
                                </div>
                            </div>
                        </div>
                    `;
                output.innerHTML += html;
        }
    })
    .catch((error) => {
        let html = `
            <div class="color-container">
                    <div class="col general-padding">
                        <h1 class="capitalize">Error!</h1>
                        <div class="col jcsb w100">
                            <h3 class="capitalize">Fetch failed</h3> 
                            <p class="capitalize">JavaScript said: ${error}</p> 
                        </div>
                    </div>
                </div>
            `;
        output.innerHTML += html;
        console.error("Error fetching JSON: ", error)
    })
}
fetchApi(jsonPath);

btnApplyFilters.addEventListener("click", function() {
    orderBy = sortByFilter.options[sortByFilter.selectedIndex].value;
    fetchApi(jsonPath);
})