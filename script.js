var svgNS = "http://www.w3.org/2000/svg";

// DOM References
var leftBox;
var rightBox;
var display;

// Give string a hashCode() function
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

function random(s) {
    return function() {
        s = Math.sin(s) * 10000; return s - Math.floor(s);
    };
}

class Grid {
    constructor(height, width, seed) {
        this.height = height;
        this.width = width;
        this.seed = seed;
        this.cells = [];
        var rand = random(typeof seed === 'string' ? this.seed.hashCode() : this.seed);
        for (var i = 0; i < height / 2; i++) {
            this.cells[i] = [];
            this.cells[this.height - i - 1] = [];
            for (var j = 0; j < width; j++) {
                var value = i == 0 || j == 0 || i == height - 1 || j == width - 1 || rand() > .6 ? 1 : 0;
                this.cells[i][j] = new Cell(j, i, value, this);
                this.cells[height - i - 1][width - j - 1] = new Cell(width - j - 1, height - i - 1, value, this);
            }
        }
    }
    
    update() {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.cells[i][j].prepareUpdate();
            }
        }
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.cells[i][j].update();
            }
        }
    }
    
    cellValueAt(x, y) {
        return x > -1 && x < this.width && y > -1 && y < this.height ? this.cells[y][x].value : 1;
    }
}

class Cell {
    constructor(x, y, value, container) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.preparedValue = value;
        this.container = container;
    }
    
    prepareUpdate() {
        var neighbors = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (this.container.cellValueAt(this.x + j, this.y + i) == 1) neighbors++;
            }
        }
        if (neighbors < 4) this.preparedValue = 0;
        if (neighbors >= 5) this.preparedValue = 1;
    }
    
    update() {
        this.value = this.preparedValue;
    }
}

function renderGrid(grid) {
    display.innerHTML = "";
    for (var i = 0; i < grid.height; i++) {
        for (var j = 0; j < grid.width; j++) {
            var square = document.createElementNS(svgNS, "rect");
            square.setAttribute("x", j * 10);
            square.setAttribute("y", i * 10);
            square.setAttribute("width", 10);
            square.setAttribute("height", 10);
            square.setAttribute("fill", grid.cells[i][j].value == 1 ? "black" : "white");
            display.appendChild(square);
        }
    }
}

window.addEventListener('load', (e) => {
    // Set up DOM references
    leftBox = document.getElementById("left-box");
    rightBox = document.getElementById("right-box");
    display = document.getElementById("display");
    var grid = new Grid(30, 40, Math.random());
    renderGrid(grid);
    for (var i = 0; i < 5; i++) {
        grid.update();
    }
    renderGrid(grid);
});