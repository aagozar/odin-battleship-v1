console.log("Hello World!");

let boatLocations = generateBoatLocations(5);
let boatHits = [];

// Generates n random boat locations.
function generateBoatLocations(numberOfBoats = 3) {
	const boatLocations = [];
	for (let i = 0; i < numberOfBoats; i++) {
		const boatLocation = Math.floor(Math.random() * 100);
		boatLocations.push(boatLocation);
	}

	boatLocations.sort();
	console.log(boatLocations);

	return boatLocations;
}

/**
 * Initializes a grid with 100 cells.
 * @param {*} gridName
 * @param {*} clickable
 */
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

		if (clickable) {
			cell.onclick = () => {
				cellLogic(cell.id);
			};
			cell.classList.add("cursor-pointer");
		}

		cell.innerHTML = i;
		grid.appendChild(cell);
	}
}

function cellLogic(cellId) {
	const coordinate = parseInt(cellId.split("_")[1]);
	console.log(coordinate);
	if (boatHits.includes(coordinate)) {
		return;
	}
	const cell = document.getElementById(cellId);
	if (boatLocations.includes(coordinate)) {
		boatHits.push(coordinate);
		cell.classList.add("bg-red-500");
		cell.classList.remove("cursor-pointer");
		cell.removeAttribute("onclick");
	} else {
		cell.classList.add("bg-blue-500");
		cell.classList.remove("cursor-pointer");
	}

	checkWin();
}

function checkWin() {
	console.log(boatHits);
	console.log(boatLocations);

	if (boatHits.length === boatLocations.length) {
		alert("You win!");
		restartGame();
	}
}

function restartGame() {
	boatLocations = generateBoatLocations(5);
	boatHits = [];
	initializeGrid("enemy-grid");
	initializeGrid("player-grid", false);
}

initializeGrid("enemy-grid");
initializeGrid("player-grid", false);
