const START_COLUMNS = 200;
const START_ROWS = 200;
const FRAME_DURATION_MS = 100;

function neighborhood(x, y, world) {
    const naiveNbhd = [
        [x-1, y-1],
        [x,   y-1],
        [x+1, y-1],
        [x-1, y  ],
        [x+1, y  ],
        [x-1, y+1],
        [x,   y+1],
        [x+1, y+1],
    ];
    let nbhd = [];
    for (let i = 0; i < naiveNbhd.length; i++) {
        let x = naiveNbhd[i][0];
        let y = naiveNbhd[i][1];
        if (
            x >= 0
            && x < world.num_columns
            && y >= 0
            && y < world.num_rows
        ) {
            nbhd.push(naiveNbhd[i]);
        }
    }
    return nbhd;
}

function Cell(x, y, world) { // Constructor
    this.x = x;
    this.y = y;
    this.world = world;
    this.element = document.createElement("td");
    this.nextClassName = "dead";
    this.element.className = this.nextClassName;
    this.element.addEventListener("click", function (e) {
        if (e.currentTarget.className === "alive") {
            e.currentTarget.className = "dead";
        } else {
            e.currentTarget.className = "alive";
        }
    });
    this.element.addEventListener("mouseenter", function (e) {
        if (e.buttons === 1) {
            e.currentTarget.className = "alive";
        }
    });
}

function World(num_rows, num_columns) { // Constructor
    this.num_rows = num_rows;
    this.num_columns = num_columns;
    this.cells = [];
    this.element = null;
}

World.prototype.getCell = function (x, y) {
    return this.cells[y][x];
}

World.prototype.generateTable = function () {
    this.element = document.createElement("table");
    const tblBody = document.createElement("tbody");
    for (let i = 0; i < this.num_rows; i++) {
        const row = document.createElement("tr");
        this.cells.push([]);
        for (let j = 0; j < this.num_columns; j++) {
            const c = new Cell(j, i, this);
            this.cells[i].push(c);
            row.appendChild(c.element);
        }
        tblBody.appendChild(row);
    }
    this.element.appendChild(tblBody);
    e = document.querySelector("#theWorldContainer");
    e.appendChild(this.element);
}

World.prototype.starterPack = function () {
    this.getCell(8, 8).neighbors().forEach((i) => i.live());
    // flower
    this.getCell(31, 20).live();
    this.getCell(30, 21).live();
    this.getCell(32, 21).live();
    this.getCell(30, 22).live();
    this.getCell(31, 22).live();
    this.getCell(32, 22).live();
    this.getCell(31, 23).live();
    // faces
    this.getCell(40, 55).live();
    this.getCell(41, 55).live();
    this.getCell(43, 55).live();
    this.getCell(44, 55).live();
    this.getCell(40, 56).live();
    this.getCell(44, 56).live();
    this.getCell(41, 57).live();
    this.getCell(42, 57).live();
    this.getCell(43, 57).live();
    this.getCell(42, 58).live();
}

Cell.prototype.live = function () {
    this.nextClassName = "alive";
}

Cell.prototype.die = function () {
    this.nextClassName = "dead";
}

Cell.prototype.update = function () {
    this.element.className = this.nextClassName;
}

Cell.prototype.neighbors = function () {
    const nbs = neighborhood(this.x, this.y, this.world);
    nb_cells = [];
    for (let i = 0; i < nbs.length; i++) {
        x = nbs[i][0];
        y = nbs[i][1];
        nb_cells.push(this.world.getCell(x, y));
    }
    return nb_cells;
}

Cell.prototype.isAlive = function () {
    return this.element.className === "alive";
}

Cell.prototype.tick = function () {
    const nbs = this.neighbors();
    let nbsAlive = 0;
    for (let i = 0; i < nbs.length; i++) {
        if (nbs[i].isAlive()) {
            nbsAlive++;
        }
    }
    this.nextClassName = this.element.className;
    if (this.isAlive() && (nbsAlive < 2 || nbsAlive > 3)) {
        this.die();
    } else if (! this.isAlive() && nbsAlive === 3) {
        this.live();
    }
}

World.prototype.update = function () {
    for (i = 0; i < this.cells.length; i++) {
        for (j = 0; j < this.cells[i].length; j++) {
            this.cells[i][j].update();
        }
    }
}

World.prototype.tick = function () {
    for (i = 0; i < this.cells.length; i++) {
        for (j = 0; j < this.cells[i].length; j++) {
            this.cells[i][j].tick();
        }
    }
}

World.prototype.frame = function () {
    this.tick();
    this.update();
}

const world = new World(START_ROWS, START_COLUMNS);
world.generateTable();

let intervalId;

document.addEventListener("keydown", function (e) {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    } else {
        intervalId = setInterval(() => world.frame(), FRAME_DURATION_MS);
    }
});

document.querySelector(".modal").addEventListener("click", function (e) {
    e.currentTarget.style.display = "none";
});

document.querySelector("#reset-game-button").addEventListener("click", function (e) {
    world.element.remove();
    world.cells = [];
    world.element = null;
    console.log("Game reset");
    const selected_rows = document.querySelector("#world-height-input").value;
    const selected_columns = document.querySelector("#world-width-input").value;
    console.log(selected_rows);
    console.log(selected_columns);
    world.num_rows = selected_rows;
    world.num_columns = selected_columns;
    world.generateTable();
});

document.querySelector("#add-starter-pack-button").addEventListener("click", function (e) {
    console.log("Add starter pack");
    world.starterPack();
    world.update();
});
