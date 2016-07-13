var express = require('express');
var router = express.Router();

var tictactoe = {gameRunning : false}, intial_board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("Index has been hit.");
	res.render('index', { title: 'Express' });
});

router.post('/tictactoe', function(req, res) {
	console.log("Post hit");
	var text = req.body.text, resText;
	var resBody = { url: req.response_url };

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	console.log("Action based on: " + text);
	if (text == 'board') {
		console.log("Displaying board");
		resText = " " + tictactoe.board[0] + " | " + tictactoe.board[1] + " | " + tictactoe.board[2] + "\n"
				+ "-----------\n"
				+ " " + tictactoe.board[3] + " | " + tictactoe.board[4] + " | " + tictactoe.board[5] + "\n"
				+ "-----------\n"
				+ " " + tictactoe.board[6] + " | " + tictactoe.board[7] + " | " + tictactoe.board[8] + "\n";

		if (tictactoe.gameRunning)
		{
			console.log("Game is running");
			tictactoe.currentPlayer = (tictactoe.currentPlayer == player1) ? tictactoe.player2 : tictactoe.player1;
			resText += "It's " + tictactoe.currentPlayer + "'s turn now";

		} else {
			console.log("Game is not running");
			if ((tictactoe.winner == null) && tictactoe.turnNumber == 0) resText += "A game has not been started yet.";
			else if ((tictactoe.winner == null) && tictactoe.turnNumber > 0) resText += "It was a tie!";
			else resText += "Game over. " + tictactoe.winner + " was the winner!";
		}
	} else if (!tictactoe.gameRunning) {
		console.log("Game is starting a new game");
		//TODO: Check if player 2 is valid
		

		console.log("Player 2 verified");

		tictactoe = {
			player1 : req.body.user_name,
			player2 : req.body.text,
			currentPlayer : req.body.user_name,
			player1Moves : new Array(9),
			player2Moves : new Array(9),
			board : intial_board.slice(),
			turnNumber : 0,
			gameRunning : true,
			winner : ''
		};

		resText = tictactoe.player1 + " has challenged " + tictactoe.player2 + " to a tic-tac-toe game.\n" + tictactoe.player1 + " may make the first move!";
	} else if (tictactoe.gameRunning) {
		console.log("Game continuing existing game");
		if (tictactoe.currentPlayer == req.body.user_name) {
			console.log("Current player is correct check");

			var arrayLocation = (text.charCodeAt(0) - 65) + (text.charCodeAt(1) - 48);
			
			if (arrayLocation < 0 ||
				arrayLocation > 8 ||
				tictactoe.player1Moves[arrayLocation] == true ||
				tictactoe.player2Moves[arrayLocation] == true) {
				console.log("Move is not valid");
				resText = "Move is not valid.";
			} else {
				console.log("Move is valid");
				var playerMoves;
				if (tictactoe.currentPlayer == player1)
				{
					tictactoe.player1Moves[arrayLocation] = true;
					tictactoe.playerMoves = tictactoe.player1Moves;
					tictactoe.board[arrayLocation] = 'X';
				} else {
					tictactoe.player2Moves[arrayLocation] = true;
					tictactoe.playerMoves = tictactoe.player2Moves;
					tictactoe.board[arrayLocation] = 'O';
				}
				tictactoe.turnNumber++;

				console.log("Checking for wins");
				if (turnNumber > 6) {
					switch(arrayLocation) {
						case 0:
							if ((playerMoves[1] && playerMoves[2]) || (playerMoves[3] && playerMoves[6]) || (playerMoves[4] && playerMoves[8]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 1:
							if ((playerMoves[0] && playerMoves[2]) || (playerMoves[4] && playerMoves[7]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 2:
							if ((playerMoves[0] && playerMoves[1]) || (playerMoves[5] && playerMoves[8]) || (playerMoves[4] && playerMoves[6]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 3:
							if ((playerMoves[4] && playerMoves[5]) || (playerMoves[0] && playerMoves[6]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 4:
							if ((playerMoves[3] && playerMoves[5]) || (playerMoves[1] && playerMoves[7]) || (playerMoves[0] && playerMoves[8]) || (playerMoves[2] && playerMoves[6]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 5:
							if ((playerMoves[3] && playerMoves[4]) || (playerMoves[2] && playerMoves[8]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 6:
							if ((playerMoves[7] && playerMoves[8]) || (playerMoves[0] && playerMoves[3]) || (playerMoves[2] && playerMoves[4]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 7:
							if ((playerMoves[6] && playerMoves[8]) || (playerMoves[1] && playerMoves[4]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
						case 8:
							if ((playerMoves[6] && playerMoves[7]) || (playerMoves[2] && playerMoves[5]) || (playerMoves[0] && playerMoves[4]))
							{
								tictactoe.gameRunning = false;
								tictactoe.winner = tictactoe.currentPlayer;
							}
							break;
					}
				}

				if (turnNumber > 8)
				{
					console.log("Game has too many turns");
					tictactoe.gameRunning = false;
				}

				resText = " " + tictactoe.board[0] + " | " + tictactoe.board[1] + " | " + tictactoe.board[2] + "\n"
						+ "-----------\n"
						+ " " + tictactoe.board[3] + " | " + tictactoe.board[4] + " | " + tictactoe.board[5] + "\n"
						+ "-----------\n"
						+ " " + tictactoe.board[6] + " | " + tictactoe.board[7] + " | " + tictactoe.board[8] + "\n";

				if (tictactoe.gameRunning)
				{
					console.log("Next player's turn");
					tictactoe.currentPlayer = (tictactoe.currentPlayer == player1) ? tictactoe.player2 : tictactoe.player1;
					resText += "It's " + tictactoe.currentPlayer + "'s turn now.";

				} else {
					console.log("Game is over");
					if (tictactoe.winner == null) resText += "Game over. It's a tie!";
					else resText += "Game over. " + tictactoe.winner + " is the winner!";
				}
			}
		}
		else resText = "Sorry, it is not your turn.";
	}

	console.log("Sending response");
	console.log("Tictactoe Object: ");
	console.log("player1: " + tictactoe.player1);
	console.log("player2: " + tictactoe.player2);
	console.log("currentPlayer: " + tictactoe.currentPlayer);
	console.log("board: \n" + tictactoe.board);
	console.log("turnNumber: " + tictactoe.turnNumber);
	console.log("gameRunning: " + tictactoe.gameRunning);
	console.log("winner: " + tictactoe.winner);

	resBody.text = resText;
	res.write(JSON.stringify(resBody));
	res.end();
});

router.post('/test', function(req, res) {
	console.log("Post has been hit.");
	console.log(req);

	res.on('error', function(err) {
		console.error(err);
	});

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	var responseBody = {
		url: req.response_url,
		text: req.body.text
	};

	res.write(JSON.stringify(responseBody));
	res.end();
});

module.exports = router;
