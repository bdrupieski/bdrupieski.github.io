/// <reference path="obelisk.d.ts"/>
var GameOfLifeObelisk = (function () {
    function GameOfLifeObelisk() {
        this.gridSize = 12;
        this.boardWidth = 240;
        this.boardHeight = 200;
        this.boardState = new Uint8Array(this.boardWidth * this.boardHeight);
        this.cubeSide = this.gridSize;
        this.cubeHeight = this.gridSize;
        this.colorSeed = 20;
        this.brick = new obelisk.Brick(new obelisk.BrickDimension(this.gridSize, this.gridSize), undefined, false);
        this.cubeDimension = new obelisk.CubeDimension(this.cubeSide, this.cubeSide, this.cubeHeight);
        this.pixelView = new obelisk.PixelView(document.getElementById('board'), new obelisk.Point(0, -1000));
        this.pixelView.context.canvas.width = window.innerWidth - 20;
        this.pixelView.context.canvas.height = window.innerHeight - 20;
    }
    GameOfLifeObelisk.prototype.start = function () {
        this.seedBoard();
        this.nextFrame();
    };
    GameOfLifeObelisk.prototype.nextFrame = function () {
        this.render();
        this.updateBoard();
        requestAnimationFrame(this.nextFrame.bind(this));
    };
    GameOfLifeObelisk.prototype.seedBoard = function () {
        for (var i = 0; i < this.boardState.length; i++) {
            if (Math.random() > 0.78) {
                this.boardState[i] = 1;
            }
        }
    };
    GameOfLifeObelisk.prototype.generateColor = function () {
        var red = Math.sin(0.05 * this.colorSeed) * 127 + 128;
        var grn = Math.sin(0.10 * this.colorSeed) * 127 + 128;
        var blu = Math.sin(0.15 * this.colorSeed) * 127 + 128;
        return (Math.floor(red) << 16) + (Math.floor(grn) << 8) + (Math.floor(blu));
    };
    GameOfLifeObelisk.prototype.generateCubeWithColor = function () {
        var newColor = this.generateColor();
        var newCubeColor = new obelisk.CubeColor().getByHorizontalColor(newColor);
        return new obelisk.Cube(this.cubeDimension, newCubeColor, false);
    };
    GameOfLifeObelisk.prototype.cellAliveAt = function (x, y) {
        if (x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight) {
            return this.boardState[(y * this.boardWidth) + x];
        }
        else {
            return 0;
        }
    };
    GameOfLifeObelisk.prototype.getCountOfAliveNeighbors = function (x, y) {
        var count = this.cellAliveAt(x - 1, y - 1) + this.cellAliveAt(x, y - 1) + this.cellAliveAt(x + 1, y - 1) + this.cellAliveAt(x - 1, y) + this.cellAliveAt(x + 1, y) + this.cellAliveAt(x - 1, y + 1) + this.cellAliveAt(x, y + 1) + this.cellAliveAt(x + 1, y + 1);
        return count;
    };
    GameOfLifeObelisk.prototype.updateBoard = function () {
        var nextBoard = new Uint8Array(this.boardWidth * this.boardHeight);
        for (var x = 0; x < this.boardWidth; x++) {
            for (var y = 0; y < this.boardHeight; y++) {
                var prevState = this.boardState[(y * this.boardWidth) + x];
                var nextState = 0;
                var aliveNeighbors = this.getCountOfAliveNeighbors(x, y);
                if (prevState === 1 && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
                    nextState = 1;
                }
                else if (prevState === 0 && aliveNeighbors === 3) {
                    nextState = 1;
                }
                nextBoard[(y * this.boardWidth) + x] = nextState;
            }
        }
        this.boardState = nextBoard;
    };
    GameOfLifeObelisk.prototype.render = function () {
        this.colorSeed++;
        var cube = this.generateCubeWithColor();
        this.pixelView.clear();
        for (var x = 0; x < this.boardWidth; x++) {
            for (var y = 0; y < this.boardHeight; y++) {
                var point3d = new obelisk.Point3D(x * this.gridSize, y * this.gridSize, 0);
                if (this.boardState[(y * this.boardWidth) + x] === 1) {
                    this.pixelView.renderObject(cube, new obelisk.Point3D(x * this.gridSize, y * this.gridSize, 0));
                }
                else {
                    this.pixelView.renderObject(this.brick, point3d);
                }
            }
        }
    };
    return GameOfLifeObelisk;
})();
var game = new GameOfLifeObelisk();
game.start();
//# sourceMappingURL=GameOfLifeObelisk.js.map