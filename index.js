console.log("Hello World!");

let enemyBoatLocation = generateBoatsLocations(5);
let boatHits = [];
let playerBoatLocation = generateBoatsLocations(5);
let enemyHits = [];

// Generates n random boat locations.
function generateBoatsLocations(numberOfBoats = 3) {
	const enemyBoatLocation = [];

	while (enemyBoatLocation.length < numberOfBoats) {
		const boatLocation = Math.floor(Math.random() * 100);
		if (!enemyBoatLocation.includes(boatLocation)) {
			enemyBoatLocation.push(boatLocation);
		}
	}

	enemyBoatLocation.sort();
	console.log(enemyBoatLocation);

	return enemyBoatLocation;
}

function initializeGrid(gridName, clickable = true) {
	const grid = document.getElementById(gridName);
	grid.innerHTML = "";

	for (let i = 0; i < 100; i++) {
		const cell = document.createElement("div");
		cell.classList.add("grid-cell");
		cell.classList.add("border");
		cell.classList.add("border-gray-300");
		cell.classList.add("text-xs");

		cell.id = gridName + "_" + i;

		// Enemy grid
		if (clickable) {
			cell.onclick = () => {
				playerMove(cell.id);
			};
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

function playerMove(cellId) {
	const coordinate = parseInt(cellId.split("_")[1]);
	console.log(coordinate);
	if (boatHits.includes(coordinate)) {
		return;
	}

	// Player Move
	const cell = document.getElementById(cellId);
	if (enemyBoatLocation.includes(coordinate)) {
		boatHits.push(coordinate);
		cell.classList.add("bg-red-500");
		cell.classList.remove("cursor-pointer");
		cell.removeAttribute("onclick");
	} else {
		cell.classList.add("bg-blue-500");
		cell.classList.remove("cursor-pointer");
	}

	// Enemy Move
	const enemyMove = Math.floor(Math.random() * 100);
	const enemyCell = document.getElementById("player-grid_" + enemyMove);
	if (playerBoatLocation.includes(enemyMove)) {
		enemyHits.push(enemyMove);
		enemyCell.classList.add("bg-red-500");
	} else {
		enemyCell.classList.add("bg-blue-500");
	}

	checkWin();
}

function checkWin() {
	console.log(boatHits);
	console.log(enemyBoatLocation);

	if (boatHits.length === enemyBoatLocation.length) {
		alert("You win!");
		restartGame();
	}
}

function restartGame() {
	enemyBoatLocation = generateBoatsLocations(5);
	boatHits = [];
	initializeGrid("enemy-grid");
	initializeGrid("player-grid", false);
}

initializeGrid("enemy-grid");
initializeGrid("player-grid", false);
