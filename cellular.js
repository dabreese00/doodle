const NUM_COLUMNS = 100;
const NUM_ROWS = 100;
const FRAME_DURATION_MS = 1000;

function getPosition(x, y) {
    table = document.querySelector("table");
    row = table.rows[y];
    return row.children[x];
}

function lightUp(box) {
    getPosition(box.x, box.y).className = "light";
}

function neighborhood(x, y) {
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
            && x < NUM_COLUMNS
            && y >= 0
            && y < NUM_ROWS
        ) {
            nbhd.push(naiveNbhd[i]);
        }
    }
    return nbhd;
}

function Cell(x, y, className) {
    this.x = x;
    this.y = y;
    this.nextClassName = className;
    physical_cell = getPosition(this.x, this.y);
    physical_cell.className = this.nextClassName;
    physical_cell.addEventListener("click", function (e) {
        e.currentTarget.className = "alive";
    });
    physical_cell.addEventListener("mouseenter", function (e) {
        if (e.buttons === 1) {
            e.currentTarget.className = "alive";
        }
    });
}

Cell.prototype.neighbors = function () {
    return neighborhood(this.x, this.y)
}

const theWorld = [];

for (i = 0; i < NUM_COLUMNS; i++) {
    theWorld.push([]);
    for (let j = 0; j < NUM_ROWS; j++) {
        const c = new Cell(i, j, "dead");
        theWorld[i].push(c);
    }
}

Cell.prototype.lightNeighbors = function () {
    const nbs = this.neighbors();
    for (let i = 0; i < nbs.length; i++) {
        x = nbs[i][0];
        y = nbs[i][1];
        lightUp(theWorld[x][y]);
    }
}

Cell.prototype.live = function () {
    this.nextClassName = "alive";
}

Cell.prototype.die = function () {
    this.nextClassName = "dead";
}

Cell.prototype.update = function () {
    getPosition(this.x, this.y).className = this.nextClassName;
}

Cell.prototype.neighbors = function () {
    const nbs = neighborhood(this.x, this.y);
    nb_cells = [];
    for (let i = 0; i < nbs.length; i++) {
        x = nbs[i][0];
        y = nbs[i][1];
        nb_cells.push(theWorld[x][y]);
    }
    return nb_cells;
}

Cell.prototype.isAlive = function () {
    return getPosition(this.x, this.y).className === "alive";
}

Cell.prototype.tick = function () {
    const nbs = this.neighbors();
    let nbsAlive = 0;
    for (let i = 0; i < nbs.length; i++) {
        if (nbs[i].isAlive()) {
            nbsAlive++;
        }
    }
    this.nextClassName = getPosition(this.x, this.y).className;
    if (this.isAlive() && (nbsAlive < 2 || nbsAlive > 3)) {
        this.die();
    } else if (! this.isAlive() && nbsAlive === 3) {
        this.live();
    }
}


theWorld[8][8].neighbors().forEach((i) => i.live());
// flower
theWorld[31][20].live();
theWorld[30][21].live();
theWorld[32][21].live();
theWorld[30][22].live();
theWorld[31][22].live();
theWorld[32][22].live();
theWorld[31][23].live();
// faces
theWorld[40][55].live();
theWorld[41][55].live();
theWorld[43][55].live();
theWorld[44][55].live();
theWorld[40][56].live();
theWorld[44][56].live();
theWorld[41][57].live();
theWorld[42][57].live();
theWorld[43][57].live();
theWorld[42][58].live();

function update() {
    for (i = 0; i < theWorld.length; i++) {
        for (j = 0; j < theWorld[i].length; j++) {
            theWorld[i][j].update();
        }
    }
}

function tick() {
    for (i = 0; i < theWorld.length; i++) {
        for (j = 0; j < theWorld[i].length; j++) {
            theWorld[i][j].tick();
        }
    }
}

function frame() {
    tick();
    update();
}

update();

let intervalId;

document.addEventListener("keydown", function (e) {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    } else {
        intervalId = setInterval(frame, FRAME_DURATION_MS);
    }
});

document.querySelector(".modal").addEventListener("click", function (e) {
    e.currentTarget.style.display = "none";
});
