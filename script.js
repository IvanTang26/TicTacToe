var takenPieces = {};

var winningMoves = [
    // Rows 
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
];

var comSayings = ["Prepare to Die", "I'm thinking...", "Not long left for you...", "Watch this...", 
                  "Let me show you how it's done", "You think this is a game?...", "I'll have your bones for breakfast",
                  "I'm confident with this one...", "I hope I don't scare you..."];

var user = '';
var com = '';
var userScore = 0;
var comScore = 0;
var drawScore = 0;
var comTurn = false;
var gameEnd = false;

function setPlayerSymbols(userSymbol, comSymbol) {
    user = userSymbol;
    com = comSymbol;
}

function getWinningMove(player1, player2) {

    // number of position groups
    for (var group = 0; group < winningMoves.length; group++) {
        var taken = 0;

        for (var pos = 0; pos < winningMoves[group].length; pos++) {
            if (winningMoves[group][pos] in takenPieces) {
                if (takenPieces[winningMoves[group][pos]] === player1)
                    taken++;
            } else if (winningMoves[group][pos] === player2) {
                continue;
            }

            if (taken === 3) {
                winningMoves[group].forEach(function(item){
                    $("button.square").eq(item).addClass("highlight");
                });
                return player1;
            } else if (taken === 2) {
                for (var i = 0; i < winningMoves[group].length; i++) {

                    var move = winningMoves[group][i];
                    if (takenPieces[move] !== player1 && takenPieces[move] !== player2)
                        return move;
                }
            }
        }
    }

    return false;
}


function aiRandomMove() {

    var favSquares = [4, 0, 2, 6, 8];
    var foundSquare = false;

    for (var i = 0; i < favSquares.length; i++)
        if (!(favSquares[i] in takenPieces))
            return favSquares[i];

    while (!foundSquare && Object.keys(takenPieces).length < 9) {
        var pos = parseInt(Math.random() * 9);

        if (!(pos in takenPieces))
            return pos;
    }
}

function makeMove(pos, symbol) {
    $('button.square').eq(pos).text(symbol);
    $('button.square').eq(pos).addClass(symbol);
    $('button.square').eq(pos).prop('disabled', true);
    takenPieces[pos] = symbol;
}

function endGame(winner) {
    if (winner) {
        if (winner === 'draw')
        {
            $(".com-message").text("It's a draw!");
        }
        else
            $(".com-message").text(winner + " is the winner");

        $(".com-message").show();
        $("#restartBtn").show();
    }

    gameEnd = true;
}

$("#restartBtn").on("click", function() {
    restartGame();
    getUserPlayingPiece();
    if(comTurn === true) {
        aiMove();
    }
    $(this).hide();
});

function checkWin() {
    if (getWinningMove(user, com) === user) {
        userScore++;
        endGame(user);
    } else if (getWinningMove(com, user) === com) {
        comScore++;
        endGame(com);
    } else if (Object.keys(takenPieces).length === 9) {
        drawScore++;
        endGame("draw");
    }
}

function aiMove() {

    var getComWin = getWinningMove(com, user);
    var getPlayerWin = getWinningMove(user, com);

    checkWin();

    $(".board .square").addClass("disable");

    cheapTalk();
    $(".com-message").show();

    setTimeout(function() {

        if (getComWin) {
            makeMove(getComWin, com);
        } else if (getPlayerWin) {
            makeMove(getPlayerWin, com);
        } else {
            makeMove(aiRandomMove(), com);
        }

        $(".com-message").hide();
        checkWin();
        $(".board .square").removeClass("disable");
    }, 0);
}

function getUserPlayingPiece() {
    $('.modal').modal('show');

    $(".modal .square").on("click", function(){
        if($(this).text() === 'X'){
            setPlayerSymbols('X', 'O');
            $(".scoreboard .player").addClass("X");
        } else {
            setPlayerSymbols('O', 'X');
            $(".scoreboard .com").addClass("X");
        }
        
        $('.modal').modal('hide');
    });
}

function cheapTalk() {
    $(".com-message").text(comSayings[parseInt(Math.random() * 9)]);
}

$("button.square").on("click", function() {
    if (!gameEnd) {
        makeMove($(this).data("pos"), user);
        aiMove();
    }
});

function restartGame() {
    takenPieces = {};
    $("button.square").each(function() {
        $(this).text("");
        $(this).attr("class", '').addClass("square");
        $(this).prop('disabled', false);
    });

    if(comTurn)
        comTurn = false;
    else
        comTurn = true;

    gameEnd = false;

    $(".scoreboard .com").removeClass("X", "O");
    $(".scoreboard .player").removeClass("X", "O");
    $(".scoreboard .square").removeClass("highlight");
    $(".com-message").hide();
    $(".player .score").text(userScore);
    $(".com .score").text(comScore);
    $(".draw .score").text(drawScore);
}

$(".square").addClass("disable");
$("#startBtn").on("click", function(){
  getUserPlayingPiece();
  $(this).hide();
  $(".square").removeClass("disable");
});