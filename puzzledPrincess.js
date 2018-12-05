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
        this.inBoard = false;
    }
    playInSquare(row, col) {
        this.x = this.board.x + col * this.board.SquareSize + 50;
        this.y = this.board.y + row * this.board.SquareSize + 50;
        this.board.dataModel[row][col] = this.squareSymbol;
        this.board.debugBoard();
        this.inBoard = true;
    }
}
class PrincessMarker extends Marker {
    constructor(board) {
        super(board, "annFace.png", 'Princess Ann');
        this.dragging = false;
    }
    handleMouseLeftButtonDown() {
        if (this.inBoard) return;
        this.dragging = true;

    }
    handleMouseLeftButtonUp() {
        if (this.inBoard) return;
        this.dragging = false;
        let row = Math.floor((this.y - this.board.y) / 150);
        let col = Math.floor((this.x - this.board.x) / 150);
        if (row < 0 || row > 2 || col < 0 || col > 2 ||
            this.board.dataModel[row][col] !== this.board.emptySquareSymbol) {
            this.x = this.StartX;
            this.y = this.StartY;
            return true;
        }
        this.playInSquare(row, col);
        this.board.takeTurns();
    }
    handleGameLoop() {
        if (this.dragging) {
            this.x = game.getMouseX() - this.width / 2;
            this.y = game.getMouseY() - this.height / 2;
        }
    }
}
class StrangerMarker extends Marker {
    consructor(board) {
        super(board, 'strangerFace.png', 'Stranger');
        this.name = 'Stranger';
        this.setImage('strangerFace.png');
        this.board = board;
    }
    handleGameLoop() {
        if (this.inBoard) return;
        // Mark a random empty square.
        let row, col;
        do {
            row = Math.round(Math.random() * (this.board.size - 1));
            col = Math.round(Math.random() * (this.board.size - 1));
        } while (this.board.dataModel[row][col] !== this.board.emptySquareSymbol);
        this.board.dataModel[row][col] = this.squareSymbol;
        this.playInSquare(row, col);
        this.board.takeTurns();
    }
}
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
    debugBoard() {
        let boardString = '\n';
        let moveCount = 0;
        for (let row = 0; row < this.size; row = row + 1) {
            for (let col = 0; col < this.size; col = col + 1) {
                boardString = boardString + this.dataModel[row][col] + ' ';
                if (this.dataModel[row][col] !== this.emptySquareSymbol) moveCount = moveCount + 1;
            }
            boardString = boardString + '\n';
        }
        console.log('The data model after ' + moveCount + ' move(s):' + boardString);
    }
    takeTurns() {
        if (!this.activeMarker) {
            if (Math.random() > 0.5) this.activeMarker = new PrincessMarker(this);
            else this.activeMarker = new StrangerMarker(this); 
        }
        else if (this.activeMarker instanceof PrincessMarker) {
            // princess has moved; now it's stranger's turn
            this.activeMarker = new StrangerMarker(this);
        }
        else if (this.activeMarker instanceof StrangerMarker) {
            // stranger has moved; now it's princess's turn
            this.activeMarker = new PrincessMarker(this);
        }
    }
    markSquare(row, col, forOpponent) {}
    unmarkSquare(row, col) {}
    getSquareSymbol(row, col) {}
    gameIsWon() {}
    gameIsDrawn() {}
    countWinningMoves(forOpponent) {}
}

let theBoard = new TicTacToe();
theBoard.takeTurns();
