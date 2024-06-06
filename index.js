const numberOfShips = 5;

let enemyBoatLocation = generateBoatsLocations(numberOfShips); // Enemy boat locations
let boatHits = []; // The player's hits
let playerBoatLocation = generateBoatsLocations(numberOfShips); // Player boat location
let enemyHits = []; // The enemy's hits
let enemyAttempts = []; // The enemy's attempts

/**
 * Generates random boat locations.
 * @param {number} numberOfBoats
 * @returns an array of numbers, indicating the boat locations.
 */
function generateBoatsLocations(numberOfBoats) {
	let boatsLocations = [];
	for (let i = 0; i < numberOfBoats; i++) {
		const boat = generateBoat();
		boat.forEach((coordinate) => {
			if (!boatsLocations.includes(coordinate)) {
				boatsLocations.push(coordinate);
			}
		});
	}

	boatsLocations = boatsLocations.filter((coordinate) => coordinate < 100);
	boatsLocations.sort((a, b) => a - b);
	return boatsLocations;
}

/**
 * Generates a boat.
 */
function generateBoat() {
	let boat = [];
	const type = Math.random() > 0.5 ? "horizontal" : "vertical";
	const length = Math.floor(Math.random() * 4) + 1;
	const start = calculateBoatStartLocation(type, length);

	if (type === "horizontal") {
		for (let i = 0; i < length; i++) {
			boat.push(start + i);
		}
	} else {
		for (let i = 0; i < length; i++) {
			boat.push(start + i * 10);
		}
	}

	return boat;
}

function calculateBoatStartLocation(type, length) {
	if (type === "horizontal") {
		if (length === 1) {
			return Math.floor(Math.random() * 100);
		}
		const tens = Math.floor(Math.random() * 10) * 10;
		return tens + Math.floor(Math.random() * (10 - length));
	}

	return Math.floor(Math.random() * 100);
}

/**
 * Renders the grid in the DOM.
 * @param {String} gridName the name of the container where the grid will be rendered.
 * @param {boolean} clickable if the grid is clickable or not. The enemy grid is clickable, the player grid is not.
 */
function initializeGrid(gridName, clickable = true) {
	const grid = document.getElementById(gridName);
	grid.innerHTML = ""; // Clear the grid.

	for (let i = 0; i < 100; i++) {
		const cell = document.createElement("div");
		cell.classList.add("border");
		cell.classList.add("border-gray-300");
		cell.classList.add("text-xs");

		cell.id = gridName + "_" + i;

		if (clickable) {
			// Enemy grid
			cell.addEventListener("click", handleCellClick);
			if (enemyBoatLocation.includes(i)) {
				cell.classList.add("bg-orange-500");
			}
			cell.classList.add("cursor-pointer");
		} else {
			// Player Grid
			if (playerBoatLocation.includes(i)) {
				cell.classList.add("bg-green-500");
			}
		}

		cell.innerHTML = i;
		grid.appendChild(cell);
	}
}

/**
 * Handles the click event on the cell.
 */
function handleCellClick() {
	playTurn(this.id);
	this.removeEventListener("click", handleCellClick);
}

/**
 * Plays the turn of the player and the enemy.
 * @param {String} cellId The id of the cell that was clicked.
 * @returns Nothing, but updates the state of the game.
 */
function playTurn(cellId) {
	const coordinate = parseInt(cellId.split("_")[1]);
	if (boatHits.includes(coordinate)) {
		return;
	}

	// Player Move
	const cell = document.getElementById(cellId);
	if (checkHit(enemyBoatLocation, coordinate)) {
		console.log("Hit!");
		boatHits.push(coordinate);
		cell.classList.add("bg-red-500");
		cell.classList.remove("cursor-pointer");
	} else {
		cell.classList.add("bg-blue-200");
		cell.classList.remove("cursor-pointer");
	}

	// Enemy Move
	let enemyMove = Math.floor(Math.random() * 100);
	while (enemyAttempts.includes(enemyMove)) {
		enemyMove = Math.floor(Math.random() * 100);
	}

	const enemyCell = document.getElementById("player-grid_" + enemyMove);
	if (checkHit(playerBoatLocation, enemyMove)) {
		enemyHits.push(enemyMove);
		enemyCell.classList.add("bg-red-500");
	} else {
		enemyCell.classList.add("bg-blue-200");
	}
	enemyAttempts.push(enemyMove);

	checkWin();
}

/**
 * Checks if a boat has been hit
 * @param {Array} boatPositions The positions of the boats.
 * @param {number} coordinate The coordinate to check.
 * @returns
 */
function checkHit(boatPositions, coordinate) {
	let hit = false;

	if (boatPositions.includes(coordinate)) {
		hit = true;
	}
	return hit;
}

/**
 * Checks if the game is over.
 */
function checkWin() {
	const dialog = document.querySelector("dialog");
	const winner = document.getElementById("winner");

	console.log(boatHits, enemyBoatLocation);
	if (boatHits.length === enemyBoatLocation.length) {
		dialog.showModal();
		winner.textContent = "You won!";
		restartGame();
	}
	if (enemyHits.length === playerBoatLocation.length) {
		dialog.showModal();
		winner.textContent = "Enemy won!";
		restartGame();
	}
}

/**
 * Restarts the game.
 */
function restartGame() {
	enemyBoatLocation = generateBoatsLocations(numberOfShips);
	playerBoatLocation = generateBoatsLocations(numberOfShips);
	boatHits = [];
	enemyHits = [];
	initializeGrid("enemy-grid");
	initializeGrid("player-grid", false);
}

// Start the game.
initializeGrid("enemy-grid");
initializeGrid("player-grid", false);
