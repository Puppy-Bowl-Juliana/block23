const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const puppyDetailsContainer = document.getElementById("puppy-details");


// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-FTB-ET-WEB-PT";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
let playerList = [];
/**
* It fetches all players from the API and returns them
* @returns An array of objects.
*/
const fetchAllPlayers = async () => {
    try {
        const res = await fetch(`${APIURL}/players`);
        const playersData = await res.json();
        console.log("API Response:", playersData);
        return playersData.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};
console.log(fetchAllPlayers);//Call function Here
//Call function in init
const fetchSinglePlayer = async (playerId) => {
    try {
        const res = await fetch(`${APIURL}/players/${playerId}`);
        const info = await res.json();
        console.log("info", info);
        return info.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};
const addNewPlayer = async () => {
    const addNewPlayerButton = document.querySelector(".addNewPlayerButton");
    addNewPlayerButton.addEventListener("click", addNewPlayer);
    try {
        const res = await fetch(`${APIURL}/players`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newPlayerName.value,
                breed: newPlayerBreed.value,
            }),
        });
        if(res.ok) {
            const result = await res.json();
            console.log(result);
               // fetch all players after adding new player
        const updatedPlayers = await fetchAllPlayers();
        renderAllPlayers(updatedPlayers);
        } else {
        console.error('Oops, something went wrong with adding that player!', res.statusText);
    }
} catch (err) {
    console.error('Oops, something went wrong with adding that player!', err);
}
};
const removePlayer = async (playerId) => {
    fetch(`${APIURL}/api/${cohortName}/players` , {
        method: 'DELETE',
    });
    try {
        const res = await fetch(`${APIURL}/players/${playerId}` ,
        {
            method: 'DELETE',
         }
        );
        const result = await res.json();
        console.log(result);
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        )};
};
/**
* It takes an array of player objects, loops through them, and creates a string of HTML for each
* player, then adds that string to a larger string of HTML that represents all the players.
*
* Then it takes that larger string of HTML and adds it to the DOM.
*
* It also adds event listeners to the buttons in each player card.
* See Details Button
* The event listeners are for the "See details" and "Remove from roster" buttons.
*
* The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
* API to get the details for a single player.
*
* The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
* the API to remove a player from the roster.
*
* The `fetchSinglePlayer` and `removePlayer` functions are defined in the
* @param playerList - an array of player objects
* @returns the playerContainerHTML variable.
*/
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML= "";
        playerList.forEach((player) => {
            const playerContainerHTML = document.createElement("div");
            playerContainerHTML.classList.add("player");
            playerContainerHTML.innerHTML = `
            <h2>${player.name}</h2>
            <img src="${player.imageUrl}" alt="${player.name}">
            <p>Breed: ${player.breed}</p>
            <button class="details-button" data-id="${player.id}">See Details</button>
            <button class="delete-button" data-id="${player.id}">Remove Player</button>`;
            
            playerContainer.appendChild(playerContainerHTML);
            
            const detailsButton = playerContainerHTML.querySelector(".details-button");
            detailsButton.addEventListener("click",async (event) => {
                const playerDetails = await fetchSinglePlayer(player.id);
                // console.log(players);
                renderSinglePlayer(playerDetails);
            });
            
            const deleteButton = playerContainerHTML.querySelector(".delete-button");
            deleteButton.addEventListener('click', async (event) => {
                await removePlayer(player.id);
                init();
            });
                });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};
function renderSinglePlayer(player){
    try {
        console.log("Rendering single player:", player); //Log player data
        const playerContainerHTML = document.createElement("div");
        playerContainerHTML.classList.add("player");
         playerContainerHTML.innerHTML = `
            <h2>${player.name}</h2>
            <p>Breed: ${player.breed}</p>
            `;
            puppyDetailsContainer.appendChild(playerContainerHTML);
    } catch (err) {
        console.error(err);
    }
}
/**
* It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
* fetches all players from the database, and renders them to the DOM.
*/

/**
 * AFTER CREATED REF BUTTON ADD
 * youButton.addEventListener("click", function(){
 * Call addPlayer function here , use console.log();
 * })
 */



const renderNewPlayerForm = () => {
    try {
        const newPlayer = document.body;
        newPlayerFormContainer.innerHTML = "";


        const newPlayerFormElement = document.createElement("div");
        newPlayerFormElement.classList.add("newPlayersFormElement")
        newPlayerFormElement.innerHTML = `
        <h2 class="newPlayerForm">Enter New Player</h2>
        <label type="text" for="newPlayerName" id="newPlayerNameLabel">Name: </label>
        <input type="text" name="newPlayerName" id="newPlayerName">
        <label type="text" for="newPlayerBreed" id="newPlayerBreedLabel">Breed: </label>
        <input type="text" name="newPlayerBreed" id="newPlayerBreed">
        <button class="addNewPlayerButton">Add New Player</button>
        `;
        let newPlayerName = document.getElementById("newPlayerName");
        let newPlayerBreed = document.getElementById("newPlayerBreed");
        newPlayerFormContainer.appendChild(newPlayerFormElement);

        const addNewPlayerButton =  document.querySelector(".addNewPlayerButton");

        addNewPlayerButton.addEventListener("click", function() {
            addNewPlayer();
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    body.classList.add('body-background');
});

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
     renderNewPlayerForm();
}
init();