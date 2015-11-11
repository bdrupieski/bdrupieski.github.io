var GameOfLife = (function () {
    function GameOfLife() {
        this.directionOffsets = [
            new Offset(-1, -1),
            new Offset(0, -1),
            new Offset(1, -1),
            new Offset(-1, 0),
            new Offset(1, 0),
            new Offset(-1, 1),
            new Offset(0, +1),
            new Offset(1, 1),
        ];
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.boardWidth = this.canvas.width;
        this.boardHeight = this.canvas.height;
        this.board = GameOfLife.initBoard(this.boardWidth, this.boardHeight);
    }
    GameOfLife.prototype.start = function () {
        this.seedBoard();
        this.nextFrame();
    };
    GameOfLife.prototype.update = function () {
        var nextBoard = GameOfLife.initBoard(this.boardWidth, this.boardHeight);
        for (var y = 0; y < this.board.length; y++) {
            for (var x = 0; x < this.board[y].length; x++) {
                var aliveCount = this.getCountOfAliveNeighbors(x, y);
                var cellCurrentState = this.board[y][x];
                var cellFate = false;
                if (cellCurrentState === true && (aliveCount == 2 || aliveCount == 3)) {
                    cellFate = true;
                }
                else if (cellCurrentState === false && aliveCount == 3) {
                    cellFate = true;
                }
                nextBoard[y][x] = cellFate;
            }
        }
        this.board = nextBoard;
    };
    GameOfLife.prototype.getCountOfAliveNeighbors = function (x, y) {
        var aliveCount = 0;
        for (var i = 0; i < this.directionOffsets.length; i++) {
            var offset = this.directionOffsets[i];
            var neighborX = x + offset.x;
            var neighborY = y + offset.y;
            if (neighborX >= 0 && neighborX < this.boardWidth && neighborY >= 0 && neighborY < this.boardHeight && this.board[neighborY][neighborX] === true) {
                aliveCount++;
            }
        }
        return aliveCount;
    };
    GameOfLife.prototype.render = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var y = 0; y < this.canvas.height; y++) {
            for (var x = 0; x < this.canvas.width; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    };
    GameOfLife.prototype.nextFrame = function () {
        this.render();
        this.update();
        requestAnimationFrame(this.nextFrame.bind(this));
    };
    GameOfLife.initBoard = function (width, height) {
        var state = [];
        for (var y = 0; y < height; y++) {
            state.push([]);
            for (var x = 0; x < width; x++) {
                state[y][x] = false;
            }
        }
        return state;
    };
    GameOfLife.prototype.seedBoard = function () {
        var spaceFiller = [
            "0000000000000000000011100011100000000000000000000",
            "0000000000000000000100100010010000000000000000000",
            "1111000000000000000000100010000000000000000001111",
            "1000100000000000000000100010000000000000000010001",
            "1000000001000000000000100010000000000001000000001",
            "0100100110010000000000000000000000000100110010010",
            "0000001000001000000011100011100000001000001000000",
            "0000001000001000000001000001000000001000001000000",
            "0000001000001000000001111111000000001000001000000",
            "0100100110010011000010000000100001100100110010010",
            "1000000001000110000111111111110000110001000000001",
            "1000100000000011000000000000000001100000000010001",
            "1111000000000001111111111111111111000000000001111",
            "0000000000000000101000000000001010000000000000000",
            "0000000000000000000111111111110000000000000000000",
            "0000000000000000000100000000010000000000000000000",
            "0000000000000000000011111111100000000000000000000",
            "0000000000000000000000001000000000000000000000000",
            "0000000000000000000011100011100000000000000000000",
            "0000000000000000000000100010000000000000000000000",
            "0000000000000000000000000000000000000000000000000",
            "0000000000000000000001110111000000000000000000000",
            "0000000000000000000001110111000000000000000000000",
            "0000000000000000000010110110100000000000000000000",
            "0000000000000000000011100011100000000000000000000",
            "0000000000000000000001000001000000000000000000000",
        ];
        var fillerHeight = spaceFiller.length;
        var fillerWidth = spaceFiller[0].length;
        var startingY = Math.floor((this.boardHeight / 2) - (fillerHeight / 2));
        var startingX = Math.floor((this.boardWidth / 2) - (fillerWidth / 2));
        for (var y = 0; y < spaceFiller.length; y++) {
            for (var x = 0; x < spaceFiller[y].length; x++) {
                this.board[startingY + y][startingX + x] = spaceFiller[y][x] == "1";
            }
        }
    };
    return GameOfLife;
})();
var Offset = (function () {
    function Offset(x, y) {
        this.x = x;
        this.y = y;
    }
    return Offset;
})();
var gol = new GameOfLife();
gol.start();