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

class ControlTask {
    constructor(size, player) {
        this.player = player;
        this.failPenalty = 2500;
        this.lastFailTime = Date.now();
        this.size = size;
        this.instructions = [];
        for (var i = 0; i < size; i++) {
            this.instructions.push(Math.floor(Math.random() * 4));
        }
        this.progress = 0;
        this.completed = this.size <= 0;
        this.failed = false;
    }
    
    completed() {
        return this.progress >= this.size;
    }
    
    initDisplay() {
        var player = this.player;
        var box = player.outBox;
        box.innerHTML = "";
        this.instructionElements = [];
        for (var i = 0; i < this.instructions.length; i++) {
            var newElement = document.createElement("span");
            newElement.innerHTML = player.controls[this.instructions[i]].character;
            newElement.classList.add("instruction");
            box.appendChild(newElement);
            this.instructionElements[i] = newElement;
        }
        this.instructionElements[0].classList.add("target");
        this.initialized = true;
    }
    
    update() {
        if (!this.initialized) return;
        if (this.failed) {
            if (Date.now() - this.lastFailTime > this.failPenalty) {
                this.failed = false;
                this.instructionElements.forEach(o => {
                    o.classList.remove("fail");
                    o.classList.remove("success");
                    o.classList.remove("target");
                });
                this.instructionElements[0].classList.add("target");
            }
            return false;
        }
        this.player.controls.forEach((control, index) => {
            if (control.pressed && !control.usedPress) {
                control.usedPress = true;
                if (index == this.instructions[this.progress]) {
                    this.instructionElements[this.progress].classList.add("success");
                    this.instructionElements[this.progress].classList.remove("target");
                    this.progress++;
                    if (this.progress < this.size) this.instructionElements[this.progress].classList.add("target");
                } else {
                    this.instructionElements[this.progress].classList.remove("target");
                    this.instructionElements[this.progress].classList.add("fail");
                    this.failed = true;
                    this.progress = 0;
                    this.lastFailTime = Date.now();
                }
            }
        });
        if (this.progress == this.size) {
            this.player.controls.forEach(control => {
                control.usedPress = 1;
            });
            this.player.outBox.innerHTML = "You're in control!";
            return true;
        } else return false;
    }
}

class Control {
    constructor(keyCode, character) {
        this.keyCode = keyCode;
        this.character = character;
        this.pressed = 0;
        this.usedPress = 0;
    }
    
    conditionalPressed() {
        return this.usedPress == 0 ? this.pressed : 0;
    }
}

class Player {
    constructor(id) {
        switch (id) {
            case 0:
                this.up = new Control(87, "W");
                this.left = new Control(65, "A");
                this.down = new Control(83, "S");
                this.right = new Control(68, "D");
                this.outBox = leftBox;
                break;
            case 1:
                this.up = new Control(38, "↑");
                this.left = new Control(37, "←");
                this.down = new Control(40, "↓");
                this.right = new Control(39, "→");
                this.outBox = rightBox;
                break;
        }
        
        this.id = id;
        
        this.controls = [this.up, this.left, this.down, this.right];
        
        this.downListener = document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case this.up.keyCode: 
                    this.up.pressed = 1;
                    this.up.usedPress = 0;
                    break;
                case this.left.keyCode: 
                    this.left.pressed = 1;
                    this.left.usedPress = 0;
                    break;
                case this.down.keyCode: 
                    this.down.pressed = 1;
                    this.down.usedPress = 0;
                    break;
                case this.right.keyCode: 
                    this.right.pressed = 1;
                    this.right.usedPress = 0;
                    break;
            }
        });
        
        this.upListener = document.addEventListener('keyup', e => {
            switch (e.keyCode) {
                case this.up.keyCode: 
                    this.up.pressed = 0;
                    break;
                case this.left.keyCode: 
                    this.left.pressed = 0;
                    break;
                case this.down.keyCode: 
                    this.down.pressed = 0;
                    break;
                case this.right.keyCode: 
                    this.right.pressed = 0;
                    break;
            }
        });
    }
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
        this.groundOffset = 200;
        
        this.marchingSquaresPathStrings = marchingSquaresPaths.map(o => o.map(b => b.map(j => this.cellWidth * j)));
        
        this.grid = grid;
        
        this.chameleonSprites = [
            [
                "_assets/Green Vertical Walk/Green-Vertical-Idle.png",
                "_assets/Green Vertical Walk/Green-Vertical-Walk_1.png",
                "_assets/Green Vertical Walk/Green-Vertical-Walk_2.png",
                "_assets/Green Vertical Walk/Green-Vertical-Walk_3.png",
                "_assets/Green Vertical Walk/Green-Vertical-Walk_4.png"
            ], [
                "_assets/Pink Vertical Walk/Pink-Vertical-Idle.png",
                "_assets/Pink Vertical Walk/Pink-Vertical-Walk_1.png",
                "_assets/Pink Vertical Walk/Pink-Vertical-Walk_2.png",
                "_assets/Pink Vertical Walk/Pink-Vertical-Walk_3.png",
                "_assets/Pink Vertical Walk/Pink-Vertical-Walk_4.png"
                
            ]
        ]
        
        this.spriteWidth = 400;
        this.spriteHeight = 680;
        this.spriteSize = 1/68;

    }
    
        
    setupRender() {
        var grid = this.grid;
        var marchingSquaresPathStrings = this.marchingSquaresPathStrings;
        
        // Clear SVG
        display.innerHTML = "";

        // Set up definitions
        var defs = document.createElementNS(svgNS, "defs");

        // Prepare patterns
        // Wall Pattern
        var wallPattern = document.createElementNS(svgNS, "pattern");
        wallPattern.setAttribute("id", "wall-pattern");
        wallPattern.setAttribute("x", "0");
        wallPattern.setAttribute("y", "0");
        wallPattern.setAttribute("width", "50");
        wallPattern.setAttribute("height", "50");
        wallPattern.setAttribute("patternUnits", "userSpaceOnUse");
        var wallTexture = document.createElementNS(svgNS, "image");
        wallTexture.setAttribute("href", "_assets/wall.png");
        wallTexture.setAttribute("width", "50");
        wallTexture.setAttribute("height", "50");
        wallPattern.appendChild(wallTexture);
        defs.appendChild(wallPattern);
        
        // Ground Pattern
        var groundPattern = document.createElementNS(svgNS, "pattern");
        groundPattern.setAttribute("id", "ground-pattern");
        groundPattern.setAttribute("x", "0");
        groundPattern.setAttribute("y", "0");
        groundPattern.setAttribute("width", "50");
        groundPattern.setAttribute("height", "50");
        groundPattern.setAttribute("patternUnits", "userSpaceOnUse");
        var groundTexture = document.createElementNS(svgNS, "image");
        groundTexture.setAttribute("href", "_assets/ground.png");
        groundTexture.setAttribute("width", "50");
        groundTexture.setAttribute("height", "50");
        groundPattern.appendChild(groundTexture);
        defs.appendChild(groundPattern);

        // Generate defs for marching squares
        for (var i = 1; i < marchingSquaresPathStrings.length; i++) {
            var path = document.createElementNS(svgNS, "polygon");
            path.setAttribute("fill", "white");
            path.setAttribute("id", "marching-square-" + i);
            path.setAttribute("points", marchingSquaresPathStrings[i]);
            defs.appendChild(path);
        }
        
        // Generate defs for chameleon sprites
        this.playerSpriteDefs = this.chameleonSprites.map((o, i) => o.map((path, j) => {
            var sprite = document.createElementNS(svgNS, "image");
            sprite.setAttribute("x", "0")
            sprite.setAttribute("y", "0")
            sprite.setAttribute("href", path);
            sprite.setAttribute("transform", `scale(${this.spriteSize}) translate(${-this.spriteWidth / 2}, ${-this.spriteHeight / 2})`);
            sprite.setAttribute("id", `player-sprite-${i}-${j}`);
            defs.appendChild(sprite);
            return sprite;
        }));
        
        display.appendChild(defs);

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
        
        var wall = document.createElementNS(svgNS, "rect");
        wall.setAttribute("x", 0);
        wall.setAttribute("y", 0);
        wall.setAttribute("width", grid.width * 10);
        wall.setAttribute("height", grid.height * 10);
        wall.setAttribute("mask", "url(#wall-mask)");
        wall.setAttribute("fill", "url(#wall-pattern)");
        this.wall = wall;
        
        var ground = document.createElementNS(svgNS, "rect");
        ground.setAttribute("x", -this.groundOffset);
        ground.setAttribute("y", -this.groundOffset);
        ground.setAttribute("width", grid.width * 10 + 2 * this.groundOffset);
        ground.setAttribute("height", grid.height * 10 + 2 * this.groundOffset);
        ground.setAttribute("fill", "url(#ground-pattern)");
        this.ground = ground;
        
        this.setCamera(grid.width / 2, grid.height / 2);
        display.appendChild(ground);
        display.appendChild(wall);
        
        // Create player sprite
        var playerSprite = document.createElementNS(svgNS, "use");
        playerSprite.setAttribute("transform", `translate(200, 150) scale(${this.standardZoom})`);
        playerSprite.setAttribute("href", "#" + this.playerSpriteDefs[0][0].id);
        display.appendChild(playerSprite);
        this.playerSprite = playerSprite;
    }
    
    setCamera(x, y) {
        this.wall.setAttribute("transform", `translate(${-this.cellWidth * x * this.standardZoom + 200}, ${-this.cellWidth * y * this.standardZoom + 150}) scale(${this.standardZoom})`);
        this.ground.setAttribute("transform", `translate(${-this.cellWidth * x * this.standardZoom + 200}, ${-this.cellWidth * y * this.standardZoom + 150}) scale(${this.standardZoom})`);
    }
    
    updatePlayerSprite(angle, walking, player) {
        this.playerSprite.setAttribute("transform", `translate(200, 150) scale(${this.standardZoom}) rotate(${angle})`);
        if (player == undefined) {
            this.playerSprite.setAttribute("href", "#" + this.playerSpriteDefs[(Date.now() % 500 < 250) ? 0 : 1][0].id);
        } else {
            this.playerSprite.setAttribute("href", "#" + this.playerSpriteDefs[player.id][walking ? Math.floor((Date.now() % 500) / 125) + 1 : 0].id);
        }
    }
}

class Game {
    constructor(seed) {
        
        //Constants
        this.tileSize = 100;
        this.playerSize = 25;
        this.mapWidth = 80;
        this.mapHeight = 60;
        
        this.player1 = new Player(0);
        this.player2 = new Player(1);
        
        this.instrCount = 10;
        
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
        
        this.playerBody = Matter.Bodies.fromVertices(this.mapWidth * this.tileSize / 2, this.mapHeight * this.tileSize / 2, Matter.Vertices.create(playerBodyPath.map(o => {
            return {x: o[0] * this.tileSize, y: o[1] * this.tileSize}
        })), {
            inertia: 5000,
            inverseInertia: 1/5000,
            friction: 0,
            frictionStatic: 0,
            frictionAir: .05
        });
        Matter.World.add(this.world, this.playerBody);
        
        this.physicsStarted = false;
        
        this.playerStartTask1 = new ControlTask(10, this.player1);
        this.playerStartTask2 = new ControlTask(10, this.player2);
        this.playerStartTask1.initDisplay();
        this.playerStartTask2.initDisplay();
        
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
        this.renderer.setCamera(this.playerBody.position.x / this.tileSize, this.playerBody.position.y / this.tileSize);
        this.renderer.updatePlayerSprite(this.playerBody.angle * 180 / Math.PI, this.playerBody.speed > 4, this.activePlayer);
        
        if (!this.physicsStarted) {
            var newControlPlayer;
            var newTaskPlayer;
            if (this.playerStartTask1.update()) {
                console.log("Point to player 1");
                newControlPlayer = this.player1;
                newTaskPlayer = this.player2;
            } else if (this.playerStartTask2.update()) {
                console.log("Point to player 2");
                newControlPlayer = this.player2;
                newTaskPlayer = this.player1;
            }
            if (newControlPlayer != undefined) {
                this.startPhysics();
                console.log("test");
                this.activePlayer = newControlPlayer;
                this.currTask = new ControlTask(this.instrCount, newTaskPlayer);
                this.currTask.initDisplay();
            }
            return;
        }
        
        if (this.currTask.update()) {
            var temp = this.activePlayer;
            this.activePlayer = this.currTask.player;
            this.currTask = new ControlTask(++this.instrCount, temp);
            this.currTask.initDisplay();
        }
        
        var activePlayer = this.activePlayer;
        
        // Physics controls
        var driveForceVector = {x: 0, y: (activePlayer.down.conditionalPressed() - activePlayer.up.conditionalPressed()) / 50};
        var angle = this.playerBody.angle;
        var rotatedDriveVector = rotateVector(driveForceVector, this.playerBody.angle);
        var playerPos = this.playerBody.position;
        var baseTurnVector = {x: (activePlayer.right.conditionalPressed() - activePlayer.left.conditionalPressed()) / 250, y: 0};
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
        Matter.Body.applyForce(this.playerBody, playerPos, rotatedDriveVector);
        Matter.Body.applyForce(this.playerBody, forceOrigin1, turnVector1);
        Matter.Body.applyForce(this.playerBody, forceOrigin2, turnVector2);
        
        // End Condition
        var winner;
        var loser;
        if (this.playerBody.position.x < -3 * this.tileSize) {
            winner = this.player1;
            loser = this.player2;
        } else if (this.playerBody.position.x > this.tileSize * (this.mapWidth + 3)) {
            winner = this.player2;
            loser = this.player1;
        }
        if (winner != undefined) {
            clearInterval(this.updater);
            winner.outBox.innerHTML = "";
            loser.outBox.innerHTML = "";
            var winnerMessage = document.createElement("p");
            var loserMessage = document.createElement("p");
            winnerMessage.innerHTML = "You win!";
            loserMessage.innerHTML = "You lose!";
            winner.outBox.appendChild(winnerMessage);
            loser.outBox.appendChild(loserMessage);
        }
    }
    
    start() {
        this.updater = setInterval(() => {
            this.update();
        }, 1000 / 30);
    }
    
    startPhysics() {
        this.physicsStarted = true;
        Matter.Engine.run(this.engine);
    }
}

var currGame;

function storageExists() {
    return typeof(Storage) !== "undefined";
}

window.addEventListener('load', () => {
    // Set up DOM references
    leftBox = document.getElementById("left-box");
    rightBox = document.getElementById("right-box");
    display = document.getElementById("display");
    
    document.getElementById("start").addEventListener('click', e => {
        currGame = new Game(Math.random());
        currGame.start();
        document.getElementById("start").disabled = true;
        document.getElementById("new-game").disabled = false;
    });
    
    document.getElementById("new-game").addEventListener('click', e => {
        window.location.reload();
    });
    
    document.getElementById("replay-intro").addEventListener('click', e => {
        if (storageExists()) {
            localStorage.setItem("introSeen", 0);
        }
        window.location.reload();
    })
    
    var intro = document.getElementById("intro")
    console.log(localStorage);
    if (storageExists() && localStorage.getItem("introSeen") == 1) {
        intro.parentNode.removeChild(intro);
    } else {
        var introSkipButton = document.getElementById("intro-skip");
        introSkipButton.addEventListener('click', () => {
            intro.parentNode.removeChild(intro);
            if (storageExists()) localStorage.setItem("introSeen", 1);
        })
        setTimeout(() => {
            introSkipButton.classList.remove("hide");
        }, 3000);
    }
});