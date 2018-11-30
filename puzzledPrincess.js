import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("floor.png");

class Marker extends Sprite {
    constructor(board, image, name) {
        super();
        this.board = board;
        this.name = 'name';
        this.squareSymbol = this.name.substring(0, 1);
        this.setImage(image);
        this.x = this.StartX = 150;
        this.y = this.StartY = 275;
    }
    playInSquare(row, col) {
        this.x = this.board.x + col * this.board.SquareSize + 50;
        this.y = this.board.y + row * this.board.SquareSize + 50;
        this.board.dataModel[row][col] = this.squareSymbol;
        this.board.debugBoard();
    }
}
class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", 'Princess Ann');
        this.dragging = false;
    }
    handleMouseLeftButtonDown() {
        this.dragging = true;
    }
    handleMouseLeftButtonUp() {
        this.dragging = false;
        let row = Math.floor((this.y - this.board.y) / this.board.SquareSize);
        let col = Math.floor((this.x - this.board.x) / this.board.SquareSize);
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            this.x = this.StartX;
            this.y = this.StartY;
            return true;
        }
        this.playInSquare(row, col);
    }
    handleGameLoop() {
        if (this.dragging === true) {
            this.x = game.getMouseX() - this.width / 2;
            this.y = game.getMouseY() - this.height / 2;
        }
    }
}
class StrangerMarker extends Marker {}
class TicTacToe extends Sprite {
    constructor() {
        super();
        this.name = 'A board';
        this.setImage("board.png");
        this.x = 300;
        this.y = 85;
        this.SquareSize = 150;
        this.size = 3;
        this.activeMarker; // variable exists, but value is undefined
        this.emptySquareSymbol = '-';
        this.dataModel = [];
        for (let row = 0; row < this.size; row = row + 1) {
            this.dataModel[row] = [];
            for (let col = 0; col < this.size; col = col + 1) {
                this.dataModel[row][col] = this.emptySquareSymbol;
            }
        }
    }
    takeTurns() {
        this.activeMarker = new PrincessMarker(this);
    }
    debugBoard() {
        let boardString = '\n';
        for (let row = 0; row < this.size; row = row + 1) {
            for (let col = 0; col < this.size; col = col + 1) {
                boardString = boardString + this.dataModel[row][col] + ' ';
            }
            boardString = boardString + '\n';
        }
        console.log('The current state of the board is ' + boardString);
    }
}

let theBoard = new TicTacToe();
theBoard.takeTurns();
