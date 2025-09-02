/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)
let selected = GAMES_JSON;

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
        // create a new div element, which will become the game card

            const newDiv = document.createElement("div");
                // add the class game-card to the list
                newDiv.classList.add("game-card");

                // set the inner HTML using a template literal to display some info about each game
                newDiv.innerHTML = `
                    <img class="game-img" src="${game.img}" alt="${game.name}" />
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    <p>Pledged: $${game.pledged.toLocaleString()}</p>
                    <p>Goal: $${game.goal.toLocaleString()}</p>
                    <p>Backers: ${game.backers.toLocaleString()}</p>`;

                // append the game to the games-container
                document.getElementById("games-container").appendChild(newDiv);
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        }

}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, game) => acc + game.backers, 0);
// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString('en-US')}`;


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce( (acc, game) => acc + game.pledged, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString('en-US')}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
    selected = unfundedGames;

    const sortOption = document.getElementById("sort-options").value;
    const sortedList = sortBy(selected, sortOption);

    deleteChildElements(gamesContainer);
    addGamesToPage(sortedList);
}

// show only games that are fully funded
function filterFundedOnly() {
    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);
    selected = fundedGames;

    const sortOption = document.getElementById("sort-options").value;
    const sortedList = sortBy(selected, sortOption);

    deleteChildElements(gamesContainer);
    addGamesToPage(sortedList);
}

// show all games
function showAllGames() {
    selected = GAMES_JSON;

    const sortOption = document.getElementById("sort-options").value;
    const sortedList = sortBy(selected, sortOption);

    deleteChildElements(gamesContainer);
    addGamesToPage(sortedList);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfunded = GAMES_JSON.filter( (game) => {
    return game.pledged < game.goal;
}).length;

// create a string that explains the number of unfunded games using the ternary operator
let unfundedStr = `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} games. Currently, ${unfunded} ${unfunded === 1 ? "game remains" : "games remain"} unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
let newElement = document.createElement("p");
newElement.innerHTML = unfundedStr;
const parentElement = document.getElementById("description-container");
parentElement.appendChild(newElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = [...GAMES_JSON].sort((item1, item2) => item2.pledged - item1.pledged);

// use destructuring and the spread operator to grab the first and second games
const firstTwo = [sortedGames[0], sortedGames[1]];
let firstTwoSpread = [...firstTwo];
// create a new element to hold the name of the top pledge game, then append it to the correct element
    const newP = document.createElement("p");
    newP.innerHTML = `
        <p>${firstTwoSpread[0].name}</p>`;
    const parentContainer = document.getElementById("first-game");
    parentContainer.appendChild(newP);

// do the same for the runner up item
    const newP2 = document.createElement("p");
    newP2.innerHTML = `${firstTwoSpread[1].name}`;
    const parentContainer2 = document.getElementById("second-game");
    parentContainer2.appendChild(newP2);

/************************************************************************************
 * Extra feature: Add a drop-down to sort by different criteria
    */
function sortBy(games, selectedOption) {
    let sortedList = [...games];
    if (selectedOption === "name") {
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedOption === "backers") {
        sortedList.sort((a, b) => b.backers - a.backers);
    } else if (selectedOption === "goal") {
        sortedList.sort((a, b) => b.goal - a.goal);
    } else if (selectedOption === "pledged") {
        sortedList.sort((a, b) => b.pledged - a.pledged);
    } else if (selectedOption === "default") {
        sortedList = [...games];
    }
    return sortedList;
}

// Add event listener for sort-options to re-sort and display games when changed
const sortSelect = document.getElementById("sort-options");
sortSelect.addEventListener("change", (event) => {
    const sortOption = event.target.value;
    const sortedList = sortBy(selected, sortOption);
    console.log(selected);
    deleteChildElements(gamesContainer);
    addGamesToPage(sortedList);
});