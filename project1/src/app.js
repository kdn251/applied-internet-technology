var rev = require('./reversi.js');
var readlineSync = require('readline-sync');
fs = require('fs');

//print header
console.log('REVERSI');


//check if a config file exists
if(process.argv[2]) {

	fs.readFile('myconfig.json', 'utf8', function(err, data) {

		if (err) {
  			console.log('uh oh', err);
 		}

 		else {

  			//console.log(data);
			let object = JSON.parse(data);
			//console.log('scriptedMoves: ', object.scriptedMoves);
			//console.log('playerMove: ', object.boardPreset.playerLetter);

			//initialize board
			let board = [];
			const computerLetter = object.boardPreset.playerLetter == 'X' ? 'O' : 'X';


			if(object.boardPreset.board) {

				board = [...object.boardPreset.board];

			}

			let boardSize = Math.sqrt(board.length);

			if(object.scriptedMoves.player) {

				for(let i = 0; i < object.scriptedMoves.player.length; i++) {

					const indices = rev.algebraicToRowCol(object.scriptedMoves.player[i]);

					board = rev.setBoardCell(board, object.boardPreset.playerLetter, indices.row, indices.col);

				}

			}

			if(object.scriptedMoves.computer) {

				for(let i = 0; i < object.scriptedMoves.computer.length; i++) {

					const indices = rev.algebraicToRowCol(object.scriptedMoves.computer[i]);

					board = rev.setBoardCell(board, computerLetter, indices.row, indices.col);

				}

			}


			//play game
			while(!rev.isBoardFull(board)) {

				//display player letter
				console.log('Player is ', object.boardPreset.playerLetter);

				//draw board
				console.log(rev.boardToString(board));

				//get player move and place piece
				let currentPlayerMove = readlineSync.question('Enter your move: ');
				let indices = rev.algebraicToRowCol(currentPlayerMove);

				//check if player move is valid
				// while(!rev.isValidMove(board, object.boardPreset.playerLetter, indices.row, indices.col)) {

				// 	console.log('Invalid move. Your move should: \n * Be in format \n * specify an existing empty cell \n * flip at least one of the oppose piece');
				// 	currentPlayerMove = readlineSync.question('Enter your move: ');
				// 	indices = rev.algebraicToRowCol(currentPlayerMove);
				// 	console.log(indices);

				// }

				board = rev.setBoardCell(board, object.boardPreset.playerLetter, indices.row, indices.col);
				console.log(rev.boardToString(board));

				//check if board is full
				if(rev.isBoardFull(board)) {

					break;

				}

				//generate computer move
				let computerMove;
				for(let i = 0; i < board.length; i++) {

					if(rev.isValidMove(board, computerLetter, Math.floor(i / boardSize), i % boardSize)) {

						board = rev.setBoardCell(board, computerLetter, Math.floor(i / boardSize), i % boardSize);
						break;

					}

				}


			}

			const count = rev.getLetterCounts(board);
			console.log('X Score: ', count.X);
			console.log('O Score: ', count.O);
			if(count.X > count.O) {

				console.log("X wins!");

			}

			else if(count.X === count.O) {

				console.log("Tie!");

			}

			else {

				console.log("O wins!");

			}

 		}
	});



}

else {

	//initialize board
	let board = [];

	//ask player to specify board width
	let boardWidth = readlineSync.question('Please specify the width of the board (4 - 26 inclusive): ');

	//continue asking user to specify the board width while the board width is not valid
	while(boardWidth < 4 || boardWidth > 26 || boardWidth % 2 !== 0) {

		boardWidth = readlineSync.question('Please specify the width of the board: (4 - 26 inclusive): ');

	}

	//ask player to specify their player piece
	let playerPiece = readlineSync.question('Please select your piece X (Black) or O (White): ');

	//continue asking user to specify their player piece while their player piece is not valid
	while(playerPiece !== "X" && playerPiece !== "O") {

		playerPiece = readlineSync.question('Please select your piece X (Black) or O (White): ');

	}

	//print the player piece chosen
	console.log('\nPlayer is ', playerPiece);
	const computerLetter = playerPiece == 'X' ? 'O' : 'X';

	//construct board and initialize pieces
	board = rev.generateBoard(boardWidth, boardWidth);
	board = rev.setBoardCell(board, 'X', boardWidth / 2 - 1, boardWidth / 2);
	board = rev.setBoardCell(board, 'X', boardWidth / 2, boardWidth / 2 - 1);
	board = rev.setBoardCell(board, 'O', boardWidth / 2 - 1, boardWidth / 2 - 1);
	board = rev.setBoardCell(board, 'O', boardWidth / 2, boardWidth / 2);

	//play game
	while(!rev.isBoardFull(board)) {

		//draw board
		console.log(rev.boardToString(board));

		//get player move and place piece
		let currentPlayerMove = readlineSync.question('Enter your move: ');
		let indices = rev.algebraicToRowCol(currentPlayerMove);

		//check if player move is valid
		// while(!rev.isValidMove(board, object.boardPreset.playerLetter, indices.row, indices.col)) {

		// 	console.log('Invalid move. Your move should: \n * Be in format \n * specify an existing empty cell \n * flip at least one of the oppose piece');
		// 	currentPlayerMove = readlineSync.question('Enter your move: ');
		// 	indices = rev.algebraicToRowCol(currentPlayerMove);
		// 	console.log(indices);

		// }

		board = rev.setBoardCell(board, playerPiece, indices.row, indices.col);
		console.log(rev.boardToString(board));

		//check if board is full
		if(rev.isBoardFull(board)) {

			break;

		}

		//generate computer move
		let computerMove;
		for(let i = 0; i < board.length; i++) {

			if(rev.isValidMove(board, computerLetter, Math.floor(i / boardWidth), i % boardWidth)) {

				board = rev.setBoardCell(board, computerLetter, Math.floor(i / boardWidth), i % boardWidth);
				break;

			}

		}


	}


	const count = rev.getLetterCounts(board);
	console.log('X Score: ', count.X);
	console.log('O Score: ', count.O);
	if(count.X > count.O) {

		console.log("X wins!");

	}

	else if(count.X === count.O) {

		console.log("Tie!");

	}

	else {

		console.log("O wins!");

	}

}
