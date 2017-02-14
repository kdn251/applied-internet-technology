// reversi.js

const rev = {

	repeat: function(value, n) {

		const array = [];

		for(let i = 0; i < n; i++) {

			array.push(value);

		}

		return array;

	},


	generateBoard: function(rows, columns, initialCellValue) {

		if(initialCellValue) {

			return rev.repeat(initialCellValue, rows * columns);


		}

		else {

			return rev.repeat(" ", rows * columns);

		}

	},


	rowColToIndex: function(board, rowNumber, columnNumber) {

		const boardSize = Math.sqrt(board.length);
		const index = (boardSize * rowNumber) + columnNumber;

		return index;

	},


	indexToRowCol: function(board, i) {

		const boardSize = Math.sqrt(board.length);
		const rowColumn = {};
		rowColumn.row = Math.floor(i / boardSize);
		rowColumn.col = i % boardSize;

		return rowColumn;

	},

	setBoardCell: function(board, letter, row, col) {

		const newBoard = [...board];
		const boardSize = Math.sqrt(board.length);
		const indexToSet = (boardSize * row) + col;
		newBoard[indexToSet] = letter;

		return newBoard;

	},

	algebraicToRowCol: function(algebraicNotation) {

		if(algebraicNotation.length < 2 || algebraicNotation.length > 3) {

			return undefined;

		}

			const indices = {};
			let col;
			let rowString = "";

			if(algebraicNotation.includes(" ")) {

				return undefined;

			}
			if(algebraicNotation.includes("/^[a-z0-9]+$/i")) {

				return undefined;

			}

			for(let i = 0; i < algebraicNotation.length; i++) {

				if(i === 0) {

					col = algebraicNotation.charCodeAt(i) - 65;

					if(col < 0 || col > 26) {

						return undefined;

					}

				}

				else {

					if(isNaN(algebraicNotation.charAt(i))) {

						return undefined;

					}

					rowString += algebraicNotation.charAt(i);

				}

			}

			const row = Number(rowString) - 1;

			if(row > 26 || row < 0) {

				return undefined;

			}

			indices.col = col;
			indices.row = row;

			return indices;

	},

	placeLetter: function(board, letter, algebraicNotation) {

		const indices = rev.algebraicToRowCol(algebraicNotation);

		const newBoard = rev.setBoardCell(board, letter, indices.row, indices.col);

		return newBoard;

	},


	placeLetters: function(board, letter, algebraicNotation) {

		let newBoard = [...board];

		for(let i = 2; i < arguments.length; i++) {

			const currentIndices = rev.algebraicToRowCol(arguments[i]);
			newBoard = rev.setBoardCell(newBoard, letter, currentIndices.row, currentIndices.col);

		}

		return newBoard;

	},

	boardToString: function(board) {

		const boardSize = Math.sqrt(board.length);
		let fullBoard = "";
		let header = " ";
		let cells = "  ";
		let count = 1;

		for(let i = 0; i < boardSize; i++) {

			header += "  " + String.fromCodePoint(65 + i) + " ";

		}

		fullBoard += " " + header + "\n";

		for(let i = 0; i < boardSize; i++) {

			cells += "+---";

			if(i === boardSize - 1) {

				cells += "+";

			}

		}

		fullBoard += cells + "\n";

		for(let i = 0; i < boardSize; i++) {

			fullBoard += count;

			for(let j = 0; j < boardSize; j++) {

				fullBoard += " | " + board[boardSize * i + j];

				if(j === boardSize - 1) {

					fullBoard += " |";

				}

			}

			fullBoard += "\n";
			fullBoard += cells + "\n";
			count++;

		}


		return fullBoard;

	},

	isBoardFull: function(board) {

		for(let i = 0; i < board.length; i++) {

			if(board[i] === ' ') {

				return false;

			}

		}

		return true;

	},

	flip: function(board, row, col) {

		const boardSize = Math.sqrt(board.length);
		const newBoard = [...board];

		if(board[boardSize * row + col] === ' ') {

			return board;

		}

		if(board[boardSize * row + col] === 'X') {

			newBoard[boardSize * row + col] = 'O';

		}

		else {

			newBoard[boardSize * row + col] = 'X';

		}

		return newBoard;

	},

	flipCells: function(board, cellsToFlip) {

		const boardSize = Math.sqrt(board.length);
		const newBoard = [...board];

		for(let i = 0; i < cellsToFlip.length; i++) {

			const first = cellsToFlip[i];

			for(let j = 0; j < first.length; j++) {

				const second = first[j];
				const index = second[0] * boardSize + second[1];

				if(board[index] === ' ') {

					continue;

				}

				if(board[index] === 'X') {

					newBoard[index] = 'O';

				}

				if(board[index] === 'O') {

					newBoard[index] = 'X';

				}

			}

		}

		return newBoard;

	},

	getCellsToFlip: function(board, lastRow, lastCol) {

		const toFlip = [];
		const boardSize = Math.sqrt(board.length);
		let currentIndex = lastRow * boardSize + lastCol;
		const piece = board[currentIndex];
		let count = 0;

		//check right
		while((currentIndex % boardSize !== 0) && board[currentIndex] !== piece && board[currentIndex] !== ' ') {

			count++;
			currentIndex++;

		}

		count = 0;

		//check left
		while((currentIndex % boardSize !== 0) && board[currentIndex] !== piece && board[currentIndex] !== ' ') {

			count++;
			currentIndex--;
			toFlip.push([lastRow, lastCol - count]);

		}

		count = 0;

		//check up
		while((currentIndex > 0) && board[currentIndex] !== piece && board[currentIndex] !== ' ') {

			count++;
			currentIndex -= boardSize;
			toFlip.push([lastRow, lastCol - (count * boardSize)]);

		}

		count = 0;

		//check up
		while((currentIndex < boardSize) && board[currentIndex] !== piece && board[currentIndex] !== ' ') {

			count++;
			currentIndex -= boardSize;
			toFlip.push([lastRow, lastCol - (count * boardSize)]);

		}

		count = 0;

		console.log(toFlip);

		return toFlip;

	},


	isValidMove: function(board, letter, rowPlaced, colPlaced) {

		const boardSize = Math.sqrt(board.length);
		const matrix = [];
		let count = 0;
		let row = rowPlaced;
		let col = colPlaced;
		const opponentPiece = letter === 'X' ? 'O' : 'X';
		let seenOpponentPiece = false;

		for(let i = 0; i < boardSize; i++) {

			const current = [];

			for(let j = 0; j < boardSize; j++) {

				current.push(board[count]);
				count++;

			}

			matrix.push(current);

		}

		if(row < 0 || row > matrix.length || col < 0 || col > matrix[0].length) {

			return false;

		}

		if(row * boardSize + col > board.length) {

			return false;

		}

		if(matrix[row][col] !== ' ') {

			return false;

		}


		//check right
		while(col < matrix[0].length) {

			col++;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check left
		while(col > 0) {

			col--;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check up
		while(row > 0) {

			row--;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check down
		while(row < matrix.length - 1) {

			row++;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check top right diagonal
		while(col < matrix[0].length && row > 0) {

			col++;
			row--;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check bottom right diagonal
		while(col < matrix[0].length && row < matrix.length - 1) {

			col++;
			row++;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check bottom left diagonal
		while(col > 0 && row < matrix.length - 1) {

			col--;
			row++;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		row = rowPlaced;
		col = colPlaced;
		seenOpponentPiece = false;

		//check top left diagonal
		while(col > 0 && row > 0) {

			col--;
			row--;

			if(matrix[row][col] === letter && seenOpponentPiece) {

				board[row * boardSize + col] = letter;
				return true;

			}

			if(matrix[row][col] === opponentPiece) {

				seenOpponentPiece = true;

			}

			if((matrix[row][col] === letter) && (!seenOpponentPiece)) {

				break;

			}

		}

		//otherwise return false;
		return false;

	},


	isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation) {

		const boardSize = Math.sqrt(board.length);
		const indices = rev.algebraicToRowCol(algebraicNotation);

		if(rev.isValidMove(board, letter, indices.row, indices.col)) {

			board[boardSize * indices.row + indices.col] = letter;
			return true;

		}

		if((indices.row * boardSize + indices.col) > board.length) {

			return false;

		}

		if(board[indices.row * boardSize + indices.col] !== " ") {

			return false;

		}

	},

	getLetterCounts: function(board) {

		let xCount = 0;
		let oCount = 0;

		for(let i = 0; i < board.length; i++) {

			if(board[i] === 'X') {

				xCount++;

			}

			if(board[i] === 'O') {

				oCount++;

			}

		}

		const counts = {

			X: xCount,
			O: oCount

		};

		return counts;

	},


	getValidMoves: function(board, letter) {

		const validMoves = [];
		const boardSize = Math.sqrt(board.length);


		for(let i = 0; i < board.length; i++) {

			if(rev.isValidMove(board, letter, Math.floor(i / boardSize), i % boardSize)) {

				const current = [Math.floor(i / boardSize), i % boardSize];
				validMoves.push(current);

			}

		}

		return validMoves;

	}



};

module.exports = rev;
