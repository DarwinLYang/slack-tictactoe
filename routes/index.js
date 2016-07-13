var express = require('express');
var router = express.Router();
var https = require('https');

var intial_board = ["    ", "    ", "    ", "    ", "    ", "    ", "    ", "    ", "    "], tictactoe = {gameRunning : false, board : intial_board.slice()};
var options = {
	host: 'slack.com',
	path: '/api/users.list?token='
};

router.post('/tictactoe', function(req, res) {
	var text = req.body.text;
	var resBody = { url: req.response_url };

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');

	if (text == 'board') {
		resBody.text = "~~~[0] [1] [2]\n"
					+ "[A]    " + tictactoe.board[0] + " | " + tictactoe.board[1] + " | " + tictactoe.board[2] + "\n"
					+ "           -----------\n"
					+ "[B]    " + tictactoe.board[3] + " | " + tictactoe.board[4] + " | " + tictactoe.board[5] + "\n"
					+ "           -----------\n"
					+ "[C]    " + tictactoe.board[6] + " | " + tictactoe.board[7] + " | " + tictactoe.board[8] + "\n";

		if (tictactoe.gameRunning)
		{
			resBody.text += "It's " + tictactoe.currentPlayer + "'s turn now";
		} else {
			if (!("winner" in tictactoe)) resBody.text += "A game has not been started yet.";
			else if (tictactoe.winner == '') resBody.text += "It was a tie!";
			else resBody.text += "Game over. " + tictactoe.winner + " was the winner!";
		}
		res.write(JSON.stringify(resBody));
		res.end();
	} else if (!tictactoe.gameRunning) {
		if (req.body.user_name == req.body.text)
		{
			resBody.text = "You cannot challenge yourself.";
			res.write(JSON.stringify(resBody));
			res.end();
		} else {
			https.request(options, function(response) {
			var members = [];
			var str = ''
			response.on('data', function (chunk) {
				str += chunk;
			});

			response.on('end', function () {
				JSON.parse(str).members.forEach(function(member) {
					members.push(member.name);
				})

				if (members.indexOf(req.body.text) == -1) {
					resBody.text = req.body.text + " is not in this channel.";
				} else {
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

					resBody.response_type = "in_channel";
					resBody.text = tictactoe.player1 + " has challenged " + tictactoe.player2 + " to a tic-tac-toe game.\n"
					+ "~~~[0] [1] [2]\n"
					+ "[A]    " + tictactoe.board[0] + " | " + tictactoe.board[1] + " | " + tictactoe.board[2] + "\n"
					+ "           -----------\n"
					+ "[B]    " + tictactoe.board[3] + " | " + tictactoe.board[4] + " | " + tictactoe.board[5] + "\n"
					+ "           -----------\n"
					+ "[C]    " + tictactoe.board[6] + " | " + tictactoe.board[7] + " | " + tictactoe.board[8] + "\n"
					+ tictactoe.player1 + " may make the first move!";
				}
				res.write(JSON.stringify(resBody));
				res.end();
				});
			}).end();
		}
	} else {
		if (tictactoe.currentPlayer == req.body.user_name) {
			var row = (text.charCodeAt(0) - 65), col = (text.charCodeAt(1) - 48);
			var arrayLocation = row*3 + col;
			if (row < 0 ||
				row > 2 ||
				col < 0 ||
				col > 2 ||
				tictactoe.player1Moves[arrayLocation] == true ||
				tictactoe.player2Moves[arrayLocation] == true) {
				resBody.text = "Move is not valid.";
			} else {
				var playerMoves;
				if (tictactoe.currentPlayer == tictactoe.player1)
				{
					tictactoe.player1Moves[arrayLocation] = true;
					playerMoves = tictactoe.player1Moves;
					tictactoe.board[arrayLocation] = 'X';
				} else {
					tictactoe.player2Moves[arrayLocation] = true;
					playerMoves = tictactoe.player2Moves;
					tictactoe.board[arrayLocation] = 'O';
				}
				tictactoe.turnNumber++;

				if (tictactoe.turnNumber > 4) {
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

				if (tictactoe.turnNumber > 8)
				{
					tictactoe.gameRunning = false;
				}

				resBody.text = "~~~[0] [1] [2]\n"
							+ "[A]    " + tictactoe.board[0] + " | " + tictactoe.board[1] + " | " + tictactoe.board[2] + "\n"
							+ "           -----------\n"
							+ "[B]    " + tictactoe.board[3] + " | " + tictactoe.board[4] + " | " + tictactoe.board[5] + "\n"
							+ "           -----------\n"
							+ "[C]    " + tictactoe.board[6] + " | " + tictactoe.board[7] + " | " + tictactoe.board[8] + "\n";

				if (tictactoe.gameRunning)
				{
					tictactoe.currentPlayer = (tictactoe.currentPlayer == tictactoe.player1) ? tictactoe.player2 : tictactoe.player1;
					resBody.text += "It's " + tictactoe.currentPlayer + "'s turn now.";

				} else {
					if (tictactoe.winner == '') resBody.text += "Game over. It's a tie!";
					else resBody.text += "Game over. " + tictactoe.winner + " is the winner!";
				}
				resBody.response_type = "in_channel";
			}
		}
		else resBody.text = "Sorry, it is not your turn.";

		res.write(JSON.stringify(resBody));
		res.end();

	}
});

module.exports = router;