/* eslint no-unused-expressions: "off" */

const chai = require('chai');
const expect = chai.expect; 
const rev = require('../src/reversi.js');

describe('reversi', function() {

    describe('repeat', function() {
        // don't worry about incorrect range (<= 0, for example)
        // and don't worry about types
        it('creates an array by repeating value, ele, n times', function() {
            const arr = rev.repeat("hello", 3);
            const expected = ["hello", "hello", "hello"];
            expect(arr).to.deep.equal(expected);
        });
    });

    describe('generateBoard', function() {
        // TODO: write test for version with default " " value
        it('generates a board with specified number of rows and columns', function() {
            const board = rev.generateBoard(3, 3, " ");
            const expected = [" ", " ", " ", " ", " ", " ", " ", " ", " ",];
            expect(board).to.deep.equal(expected);
        });
    });

    describe('rowColToIndex', function() {
        it('translates a row and column to an index, assumes board is square', function() {
            const board = rev.generateBoard(3, 3, " ");
            const i = rev.rowColToIndex(board, 1, 1);
            const j = rev.rowColToIndex(board, 0, 2);
            expect(i).to.equal(4);
            expect(j).to.equal(2);
        });
    });

    describe('indexToRowCol', function() {
        it('translates an index to a row and col (as an object)', function() {
            const board = rev.generateBoard(3, 3, " ");
            const rowCol1 = rev.indexToRowCol(board, 4);
            const rowCol2 = rev.indexToRowCol(board, 2);
            expect(rowCol1).to.deep.equal({"row": 1, "col": 1});
            expect(rowCol2).to.deep.equal({"row": 0, "col": 2});
        });
    });

    describe('setBoardCell', function() {
        it('sets the cell to the letter specified by row and col', function() {
            const board = rev.generateBoard(3, 3, " ");
            const b1 = rev.setBoardCell(board, "X", 1, 1);
            const b2 = rev.setBoardCell(b1, "O", 0, 2);
            expect(b1).to.deep.equal([" ", " ", " ", " ", "X", " ", " ", " ", " "]);
            expect(b2).to.deep.equal([" ", " ", "O", " ", "X", " ", " ", " ", " "]);
        });
    });

    describe('algebraicToRowCol', function() {
        it('translates algebraic notation to row and col (as object keys and vals)', function() {
            expect(rev.algebraicToRowCol("B2")).to.deep.equal({"row": 1, "col": 1});
            expect(rev.algebraicToRowCol("A3")).to.deep.equal({"row": 2, "col": 0});
        });

        it('returns undefined if the notation only contains a row', function() {
            expect(rev.algebraicToRowCol("A")).to.be.undefined;
        });

        it('returns undefined if the notation only contains a column', function() {
            expect(rev.algebraicToRowCol("2")).to.be.undefined;
        });

        it('returns undefined if the notation\'s row and column are transposed', function() {
            expect(rev.algebraicToRowCol("2")).to.be.undefined;
        });

        it('returns undefined if the notation contains invalid characters', function() {
            expect(rev.algebraicToRowCol(" ")).to.be.undefined;
            expect(rev.algebraicToRowCol("A 2")).to.be.undefined;
            expect(rev.algebraicToRowCol("A:2")).to.be.undefined;
            expect(rev.algebraicToRowCol("**")).to.be.undefined;
        });
    });

    describe('placeLetter', function() {
        it('places a letter on a board based on algebraic notation move', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "B2");  
            board = rev.placeLetter(board, 'O', "A3");
            expect(board).to.deep.equal([" ", " ", " ", " ", "X", " ", "O", " ", " "]);
        });
    });

    describe('placeLetters', function() {
        it('places a letter in multiples cells based on algebraic notation moves', function() {

            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'X', "B3", "D4");
            expect(board).to.deep.equal([" ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", "X"]);
        });
    });

    describe('boardToString', function() {
        // TODO: change to regex to allow for flexible number of spaces
        it('formats a board', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "B2");
            board = rev.placeLetter(board, 'O', "C1");
			const expected = "     A   B   C  \n   +---+---+---+\n 1 |   |   | O |\n   +---+---+---+\n 2 |   | X |   |\n   +---+---+---+\n 3 |   |   |   |\n   +---+---+---+\n";
            expect(rev.boardToString(board)).to.equal(expected);
        });
    });

    describe('isBoardFull', function() {
        it('returns true if there are no spaces left on the board', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "A1");
            board = rev.placeLetter(board, 'X', "A2");
            board = rev.placeLetter(board, 'X', "A3");
            board = rev.placeLetter(board, 'X', "B1");
            board = rev.placeLetter(board, 'X', "B2");
            board = rev.placeLetter(board, 'X', "B3");
            board = rev.placeLetter(board, 'X', "C1");
            board = rev.placeLetter(board, 'X', "C2");
            board = rev.placeLetter(board, 'X', "C3");
            expect(rev.isBoardFull(board)).to.be.true;
        });

        it('returns false if there are still empty cells left on the board', function() {
            let board = rev.generateBoard(3, 3, " ");
            expect(rev.isBoardFull(board)).to.be.false;

            board = rev.placeLetter(board, 'X', "A2");
            board = rev.placeLetter(board, 'X', "A3");
            board = rev.placeLetter(board, 'X', "B1");
            board = rev.placeLetter(board, 'X', "B2");
            board = rev.placeLetter(board, 'X', "B3");
            board = rev.placeLetter(board, 'X', "C1");
            board = rev.placeLetter(board, 'X', "C2");
            board = rev.placeLetter(board, 'X', "C3");
            expect(rev.isBoardFull(board)).to.be.false;
        });
    });

    describe('flip', function() {
        // TODO: O -> X
        it('changes the piece in the cell specified to the opposite color (X to O or O to X)', function() {
            board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetter(board, 'X', "A1");
            board = rev.flip(board, 0, 0);
            expect(board[0]).to.equal('O');
        });

        it('no operation if letter in cell is not X or O', function() {
            board = rev.generateBoard(4, 4, " ");
            board = rev.flip(board, 0, 0);
            expect(board[0]).to.equal(' ');
        });
    });

    describe('flipCells', function() {
        // TODO: O -> X
        // TODO: empty cell
        it('changes the pieces in the cells specified to the opposite color (X to O or O to X)', function() {
            board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'X', "A1", "B1", "B2");
            board = rev.flipCells(board, [[[0, 0], [0, 1]], [[1, 1]]]);
            expect(board[0]).to.equal('O');
            expect(board[1]).to.equal('O');
            expect(board[5]).to.equal('O');
        });
    });


    describe('isValidMove', function() {
        // TODO: check that move will flip other tiles
        it('returns true if move is played into empty cell that is within the board\'s dimensions and would flip at least one of the other player\'s pieces', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "A1");
            board = rev.placeLetter(board, 'O', "A2");
            expect(rev.isValidMove(board, 'X', 2, 0)).to.be.true;
        });
        it('returns false if move does not flip at least one of the other player\'s pieces', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "B1");
            board = rev.placeLetter(board, 'O', "A2");
            expect(rev.isValidMove(board, 'X', 2, 0)).to.be.false;
        });

        it('returns false if move is out of bounds', function() {
            const board = rev.generateBoard(3, 3, " ");
            expect(rev.isValidMove(board, 'X',3, 3)).to.be.false;
        });

        it('returns false if target square is not empty', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'O', "B2");
            expect(rev.isValidMove(board, 'X',1, 1)).to.be.false;
        });
    });

    describe('isValidMoveAlgebraicNotation', function() {
        // TODO: invalid move because of no straight line
        it('returns true if move is played into empty cell that is within the board\'s dimensions', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "A1");
            board = rev.placeLetter(board, 'O', "A2");
            expect(rev.isValidMoveAlgebraicNotation(board, 'X', 'A3')).to.be.true;
        });

        it('returns false if move is out of bounds', function() {
            const board = rev.generateBoard(3, 3, " ");
            expect(rev.isValidMoveAlgebraicNotation(board, 'X', 'D5')).to.be.false;
        });

        it('returns false if move is played into occupied cell', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "A3");
            expect(rev.isValidMoveAlgebraicNotation(board, 'X', 'A3')).to.be.false;
        });
    });

    //TODO: more tests
    describe('getValidMoves', function() {
        it('returns list of valid moves available for board and letter', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "A1");
            board = rev.placeLetter(board, 'O', "A2");
            const res = rev.getValidMoves(board, 'X');
            // expect(res).to.deep.equal([[2, 0]]);
            expect(res).to.deep.equal([[2, 0]]);
        });
        it('returns an empty list if no valid moves are available for board and letter', function() {
            let board = rev.generateBoard(3, 3, " ");
            board = rev.placeLetter(board, 'X', "A1");
            board = rev.placeLetter(board, 'O', "A3");
            const res = rev.getValidMoves(board, 'X');
            // expect(res).to.deep.equal([[2, 0]]);
            expect(res).to.deep.equal([]);
        });
        it('returns an empty list if no valid moves are available for board and letter', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'O', 'A1', 'C1', 'A2', 'C2');
            board = rev.placeLetters(board, 'X', 'B2', 'C2', 'B3', 'C3', 'C4');
            const res = rev.getValidMoves(board, 'X');
            // expect(res).to.deep.equal([[2, 0]]);
            expect(res).to.deep.equal([]);
        });
        it('returns a move that goes horizontally to the right', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'O', 'B2');
            board = rev.placeLetters(board, 'X', 'A2');
            const res = rev.getValidMoves(board, 'X');
            expect(res).to.deep.equal([[1, 2]]);
        });
        it('returns a moves that goes vertically to the top', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'O', 'B3');
            board = rev.placeLetters(board, 'O', 'B2');
            board = rev.placeLetters(board, 'X', 'B1');
            const res = rev.getValidMoves(board, 'X');
            expect(res).to.deep.equal([[3, 1]]);
        });
        it('returns a move that goes diagonally to lower right', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'X', 'A1');
            board = rev.placeLetters(board, 'O', 'B2');
            board = rev.placeLetters(board, 'O', 'C3');
            const res = rev.getValidMoves(board, 'X');
            expect(res).to.deep.equal([[3, 3]]);
        });

        it('returns multiple valid moves', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'X', 'A1');
            board = rev.placeLetters(board, 'O', 'B2');
            board = rev.placeLetters(board, 'X', 'A2');
            board = rev.placeLetters(board, 'O', 'C3');
            const res = rev.getValidMoves(board, 'X');
            expect(res).to.deep.include.members([[3, 3], [1, 2]]);
        });
    });

    describe('getCellsToFlip', function() {
        // TODO: test diagonals, horizontal, vertical, more than one cell, etc.
        // TODO: the test for this should be flexible enough to handle different orderings
        it('returns an empty list if no cells need to be flipped for this board and last move', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'O', 'A1', 'C1', 'A2', 'C2');
            board = rev.placeLetters(board, 'X', 'B2', 'C2', 'B3', 'C3', 'C4');
            board = rev.placeLetters(board, 'X', 'B1');
            const res = rev.getCellsToFlip(board, 0, 1);
            expect(res).to.deep.equal([]);
        });
        it('returns a list of groups of cells to flip based on last move', function() {
            let board = rev.generateBoard(4, 4, " ");
            board = rev.placeLetters(board, 'O', 'B3', 'C3', 'D2');
            board = rev.placeLetters(board, 'X', 'A3', 'D1', 'D3');
            const res = rev.getCellsToFlip(board, 0, 3);
            // since we don't know what order these groups will be in...
            // we'll just make sure that each inner array is either 1 or 2 
            // elements long, and then test for membership
            res.forEach((line) => {
                expect(line).to.have.length.within(1, 2);
                if(line.length === 1) {
                    expect(line).to.deep.equal([[1, 3]])
                } else if(line.length === 2) {
                    // expect(line).to.deep.include.members([[2, 1], [2, 2]]);
                    expect(line).to.deep.include.members([[2, 1], [3, 1]]);
                }
            });
            });
        });

        describe('getLetterCounts', function() {
            // TODO: zero letters
            it('returns object containing counts of letters', function() {
                let board = rev.generateBoard(3, 3, " ");
                board = rev.placeLetter(board, 'X', "A1");
            board = rev.placeLetter(board, 'X', "A3");
            board = rev.placeLetter(board, 'O', "A2");
            const counts = rev.getLetterCounts(board);
            expect(counts['X']).to.equal(2);
            expect(counts['O']).to.equal(1);
        });

        it('returns false if move is out of bounds', function() {
            const board = rev.generateBoard(3, 3, " ");
            expect(rev.isValidMoveAlgebraicNotation(board, 'X', 'D5')).to.be.false;
        });
    });

});
