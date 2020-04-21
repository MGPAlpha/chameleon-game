const svgNS = "http://www.w3.org/2000/svg";

const marchingSquaresPaths = [
    [],
    [[0,0], [.5,0], [0,.5]],
    [[.5,0], [1,0], [1,.5]],
    [[0,0], [1,0], [1,.5], [0,.5]],
    [[1,.5], [1,1], [.5,1]],
    [[0,0], [.5,0], [1,.5], [1,1], [.5,1], [0,.5]],
    [[.5,0], [1,0], [1,1], [.5,1]],
    [[0,0], [1,0], [1,1], [.5,1], [0,.5]],
    [[0,.5], [.5,1], [0,1]],
    [[0,0], [.5,0], [.5,1], [0,1]],
    [[.5,0], [1,0], [1,.5], [.5,1], [0,1], [0,.5]],
    [[0,0], [1,0], [1,.5], [.5,1], [0,1]],
    [[0,.5], [1,.5], [1,1], [0,1]],
    [[0,0], [.5,0], [1,.5], [1,1], [0,1]],
    [[.5,0], [1,0], [1,1], [0,1], [0,.5]],
    [[0,0], [1,0], [1,1], [0,1]]
];

const playerBodyPath = [
    [0,-.5], [.25,-.25], [.25,.25], [0,.5], [-.25,.25], [-.25,-.25]
];

// DOM References
var leftBox;
var rightBox;
var display;

var controller = {
    up1: 0,
    right1: 0,
    down1: 0,
    left1: 0,
    
    up2: 0,
    right2: 0,
    down2: 0,
    left2: 0
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            // Player 1
            case 65:
                controller.left1 = 1;
                break;
            case 68:
                controller.right1 = 1;
                break;
            case 83:
                controller.down1 = 1;
                break;
            case 87:
                controller.up1 = 1;
                
            // Player 2
            case 37:
                controller.left2 = 1;
                break;
            case 38:
               controller.up2 = 1;
                break;
            case 39:
                controller.right2 = 1;
                break;
            case 40:
                controller.down2 = 1;
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch (e.keyCode) {
            // Player 1
            case 65:
                controller.left1 = 0;
                break;
            case 68:
                controller.right1 = 0;
                break;
            case 83:
                controller.down1 = 0;
                break;
            case 87:
                controller.up1 = 0;
                
            // Player 2
            case 37:
                controller.left2 = 0;
                break;
            case 38:
               controller.up2 = 0;
                break;
            case 39:
                controller.right2 = 0;
                break;
            case 40:
                controller.down2 = 0;
                break;
        }
    });
}

function rotateVector(vector, angle) {
    return {
        x: vector.x * Math.cos(angle) + vector.y * -Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    }
}

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
                var value = (i == 0 || j == 0 || i == height - 1 || j == width - 1 || rand() > .55) ? 1 : 0;
                this.cells[i][j] = new Cell(j, i, value, this);
                this.cells[height - i - 1][width - j - 1] = new Cell(width - j - 1, height - i - 1, value, this);
            }
        }
        for (var i = 0; i < 5; i++) this.update();
        this.clearCenter();
        this.buildPaths();
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
    
    clearCenter() {
        var quarterCircleTemplate = [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 0],
            [1, 1, 0, 0]
        ];
        var centerX = Math.floor(this.width / 2);
        var centerY = Math.floor(this.height / 2);
        for (var i = 0; i < quarterCircleTemplate.length; i++) {
            for (var j = 0; j < quarterCircleTemplate[0].length; j++) {
                if (quarterCircleTemplate[i][j] == 0) continue;
                var targetX = centerX + j;
                var targetY = centerY + i;
                this.cells[targetY][targetX].value = 0;
                this.cells[targetY][this.width - targetX - 1].value = 0;
                this.cells[this.height - targetY - 1][targetX].value = 0;
                this.cells[this.height - targetY - 1][this.width - targetX - 1].value = 0;
            }
        }
    }
    
    buildPaths() {
        var visitedCells = new Set();
        var distanceCompartor = function(a, b) {
            return b.x - a.x;
        }
        var finished = false;
        var firstCheck = this.cells[Math.floor(this.height / 2)][Math.floor(this.width / 2)];
        do {
            // Find best spot to tunnel
            var toCheck = new PriorityQueue({comparator: (a,b) => distanceCompartor(a, b)});
            toCheck.queue(firstCheck);
            var closest = firstCheck;
            while (toCheck.length != 0) {
                var curr = toCheck.dequeue();
                if (visitedCells.has(curr)) continue;
                visitedCells.add(curr);
                if (curr.x > closest.x) closest = curr;
                [[0,1],[1,0],[0,-1],[-1,0]].forEach((item, index) => {
                    var x = curr.x + item[0];
                    var y = curr.y + item[1];
                    if (x > -1 && x < this.width
                               && y > -1 && y < this.height
                               && !visitedCells.has(this.cells[y][x]) && this.cells[y][x].value == 0) {
                        toCheck.queue(this.cells[y][x]);
                    }
                });
            }
            
            // Generate tunnel path
            var visitedToTunnel = new Set();
            var tunnelQueue = new PriorityQueue({comparator: (a, b) => {
                var aDist = Math.abs(a.x - closest.x) + Math.abs(a.y - closest.y);
                var bDist = Math.abs(b.x - closest.x) + Math.abs(b.y - closest.y);
                return aDist - bDist;
            }});
            tunnelQueue.queue(this.cells[closest.y][closest.x + 1]);
            var chosenToTunnel = undefined;
            while (chosenToTunnel == undefined) {
                var currTunnelTarget = tunnelQueue.dequeue();
                if (visitedToTunnel.has(currTunnelTarget)) continue;
                visitedToTunnel.add(currTunnelTarget);
                [[0,1],[1,0],[0,-1]].forEach((item) => {
                    var x = currTunnelTarget.x + item[0];
                    var y = currTunnelTarget.y + item[1];
                    if (y < 0 || y >= this.height) return;
                    if (x == this.width) {
                        chosenToTunnel = currTunnelTarget;
                        finished = true;
                        return;
                    }
                    var checkingForTunnel = this.cells[y][x];
                    if (visitedToTunnel.has(checkingForTunnel)) return;
                    if (checkingForTunnel.value == 0) {
                        chosenToTunnel = currTunnelTarget;
                        firstCheck = currTunnelTarget
                        return;
                    }
                    tunnelQueue.queue(checkingForTunnel);
                });
            }
            
            // Dig tunnel
            for (var i = closest.x + 1; i < chosenToTunnel.x; i++) {
                var curr = this.cells[closest.y][i];
                curr.value = 0;
                visitedCells.add(curr);
                curr = this.cells[this.height - closest.y - 1][this.width - i - 1];
                curr.value = 0;
                visitedCells.add(curr);
            }
            for (var i = (closest.y < chosenToTunnel.y) ? closest.y : chosenToTunnel.y; i <= (closest.y < chosenToTunnel.y ? chosenToTunnel.y : closest.y); i++) {
                var curr = this.cells[i][chosenToTunnel.x];
                curr.value = 0;
                visitedCells.add(curr);
                curr = this.cells[this.height - i - 1][this.width - chosenToTunnel.x - 1];
                curr.value = 0;
                visitedCells.add(curr);
            }
            
        } while (!finished);
    }
    
    cellValueAt(x, y) {
        return x > -1 && x < this.width && y > -1 && y < this.height ? this.cells[y][x].value : 0;
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
        if (this.x != 0 && this.x != this.container.width - 1 && this.y != 0 && this.y != this.container.height - 1 && neighbors < 4) this.preparedValue = 0;
        if (neighbors >= 5) this.preparedValue = 1;
    }
    
    update() {
        this.value = this.preparedValue;
    }
}

class Renderer {
    
    constructor(grid) {
    
        this.standardZoom = 4;
        this.cellWidth = 10;
        
        this.marchingSquaresPathStrings = marchingSquaresPaths.map(o => o.map(b => b.map(j => this.cellWidth * j)));
        
        this.grid = grid;

    }
    
        
    setupRender() {
        var grid = this.grid;
        var marchingSquaresPathStrings = this.marchingSquaresPathStrings;
        
        // Clear SVG
        display.innerHTML = "";

        // Set up definitions
        var defs = document.createElementNS(svgNS, "defs");

        // Prepare patterns
        var wallPattern = document.createElementNS(svgNS, "pattern");
        wallPattern.setAttribute("id", "wall-pattern");
        wallPattern.setAttribute("x", "0");
        wallPattern.setAttribute("y", "0");
        wallPattern.setAttribute("width", "100");
        wallPattern.setAttribute("height", "100");
        wallPattern.setAttribute("patternUnits", "userSpaceOnUse");
        var groundTexture = document.createElementNS(svgNS, "image");
        groundTexture.setAttribute("href", "_assets/wall.png");
        groundTexture.setAttribute("width", "100");
        groundTexture.setAttribute("height", "100");
        wallPattern.appendChild(groundTexture);
        defs.appendChild(wallPattern);

        // Generate defs for marching squares
        for (var i = 1; i < marchingSquaresPathStrings.length; i++) {
            var path = document.createElementNS(svgNS, "polygon");
            path.setAttribute("fill", "white");
            path.setAttribute("id", "marching-square-" + i);
            path.setAttribute("points", marchingSquaresPathStrings[i]);
            defs.appendChild(path);
        }

        var wallGroup = document.createElementNS(svgNS, "g");
        wallGroup.setAttribute("id", "wall-group");
        for (var i = -1; i < grid.height; i++) {
            for (var j = -1; j < grid.width; j++) {
                var value = 1 * grid.cellValueAt(j, i)
                          + 2 * grid.cellValueAt(j+1, i)
                          + 4 * grid.cellValueAt(j+1, i+1)
                          + 8 * grid.cellValueAt(j, i+1);
                if (value == 0) continue;
                var square = document.createElementNS(svgNS, "use");
                square.setAttribute("href", "#marching-square-" + value);
                square.setAttribute("x", (j + .5) * this.cellWidth);
                square.setAttribute("y", (i + .5) * this.cellWidth);
                wallGroup.appendChild(square);
            }
        }
        var wallMask = document.createElementNS(svgNS, "mask");
        wallMask.setAttribute("id", "wall-mask");
        wallMask.appendChild(wallGroup);
        display.appendChild(wallMask);
        display.appendChild(defs);
        var wall = document.createElementNS(svgNS, "rect");
        wall.setAttribute("x", 0);
        wall.setAttribute("y", 0);
        wall.setAttribute("width", grid.width * 10);
        wall.setAttribute("height", grid.height * 10);
        wall.setAttribute("mask", "url(#wall-mask)");
        wall.setAttribute("fill", "url(#wall-pattern)");
        this.wall = wall;
        this.setCamera(grid.width / 2, grid.height / 2);
        display.appendChild(wall);
        
        var tempPlayerSpritePath = playerBodyPath.map(o => o.map(b => b * this.cellWidth));
        // Create player sprite
        var playerSprite = document.createElementNS(svgNS, "polygon");
        playerSprite.setAttribute("transform", `translate(200, 150) scale(${this.standardZoom})`);
        playerSprite.setAttribute("points", tempPlayerSpritePath);
        playerSprite.setAttribute("fill", "black");
        display.appendChild(playerSprite);
        this.playerSprite = playerSprite;
    }
    
    setCamera(x, y) {
        this.wall.setAttribute("transform", `translate(${-this.cellWidth * x * this.standardZoom + 200}, ${-this.cellWidth * y * this.standardZoom + 150}) scale(${this.standardZoom})`);
    }
    
    updatePlayerSprite(angle) {
        this.playerSprite.setAttribute("transform", `translate(200, 150) scale(${this.standardZoom}) rotate(${angle})`);
    }
}

class Game {
    constructor(seed) {
        
        //Constants
        this.tileSize = 100;
        this.playerSize = 25;
        this.mapWidth = 80;
        this.mapHeight = 60;
        
        this.seed = seed;
        this.grid = new Grid(this.mapHeight, this.mapWidth, seed);
        this.renderer = new Renderer(this.grid);
        this.renderer.setupRender();
        
        // Set up engine
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.world.gravity.scale = 0;
        
        var grid = this.grid;
        
        var vertexSets = marchingSquaresPaths.map(o => o.map(b => {
            return {x: b[0] * this.tileSize, y: b[1] * this.tileSize};
        }));
        
        for (var i = -1; i < grid.height; i++) {
            for (var j = -1; j < grid.width; j++) {
                var value = 1 * grid.cellValueAt(j, i)
                          + 2 * grid.cellValueAt(j+1, i)
                          + 4 * grid.cellValueAt(j+1, i+1)
                          + 8 * grid.cellValueAt(j, i+1);
                if (value == 0 || value == 15) continue;
                var verts = Matter.Vertices.create(vertexSets[value]);
                var vertsAvg = Matter.Vertices.centre(verts);
                var wall = Matter.Bodies.fromVertices((j + .5) * this.tileSize, (i + .5) * this.tileSize, verts, {
                    isStatic: true,
                    friction: 0,
                    frictionStatic: 0
                }, false);
                Matter.World.add(this.world, wall);
                Matter.Body.translate(wall, vertsAvg);
            }
        }
        
        this.player = Matter.Bodies.fromVertices(this.mapWidth * this.tileSize / 2, this.mapHeight * this.tileSize / 2, Matter.Vertices.create(playerBodyPath.map(o => {
            return {x: o[0] * this.tileSize, y: o[1] * this.tileSize}
        })), {
            inertia: 5000,
            inverseInertia: 1/5000,
            friction: 0,
            frictionStatic: 0,
            frictionAir: .05
        });
        Matter.World.add(this.world, this.player);
        Matter.Engine.run(this.engine);
        
//        // Physics render for testing
//        var render = Matter.Render.create({
//            canvas: document.getElementById("world-test"),
//            engine: this.engine,
//            options: {
//                width: 400,
//                height: 300,
//                background: 'transparent',
//                wireframes: true,
//                showAngleIndicator: true
//            }
//        });
//        
//        Matter.Render.run(render);
//        Matter.Render.lookAt(render, this.player, {x: 600, y: 600});
    }
    
    update() {
        this.renderer.setCamera(this.player.position.x / this.tileSize, this.player.position.y / this.tileSize);
        this.renderer.updatePlayerSprite(this.player.angle * 180 / Math.PI);
        
        // Physics controls
        var driveForceVector = {x: 0, y: (controller.down1 - controller.up1) / 50};
        var angle = this.player.angle;
        var rotatedDriveVector = rotateVector(driveForceVector, this.player.angle);
        var playerPos = this.player.position;
        var baseTurnVector = {x: (controller.right1 - controller.left1) / 250, y: 0};
        var turnVector1 = rotateVector(baseTurnVector, angle);
        var turnVector2 = rotateVector(baseTurnVector, angle + 180);
        var rotatedRelativeForceOrigin1 = rotateVector({x: 0, y: -.25 * this.tileSize}, angle);
        var forceOrigin1 = {
            x: playerPos.x + rotatedRelativeForceOrigin1.x,
            y: playerPos.y + rotatedRelativeForceOrigin1.y,
        }
        var rotatedRelativeForceOrigin2 = rotateVector({x: 0, y: .25 * this.tileSize}, angle);
        var forceOrigin2 = {
            x: playerPos.x + rotatedRelativeForceOrigin2.x,
            y: playerPos.y + rotatedRelativeForceOrigin2.y,
        }
        Matter.Body.applyForce(this.player, playerPos, rotatedDriveVector);
        Matter.Body.applyForce(this.player, forceOrigin1, turnVector1);
        Matter.Body.applyForce(this.player, forceOrigin2, turnVector2);
        
    }
    
    start() {
        this.updater = setInterval(() => {
            this.update();
        }, 1000 / 30);
    }
}

window.addEventListener('load', () => {
    // Set up DOM references
    leftBox = document.getElementById("left-box");
    rightBox = document.getElementById("right-box");
    display = document.getElementById("display");
    
    setupControls();
    
    var introSkipButton = document.getElementById("intro-skip");
    introSkipButton.addEventListener('click', () => {
        var intro = document.getElementById("intro")
        intro.parentNode.removeChild(intro);
    })
    setTimeout(() => {
        introSkipButton.classList.remove("hide");
    }, 3000);
    
    
    var currGame = new Game(Math.random());
    currGame.start();
});