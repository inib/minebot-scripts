/**
 * gameManager.js
 *
 * Keeps the chat clean from running multiple games at once
 * 
 */

(function() {
    var gameIsRunning = false,
        gameName = "";
        coolDown = 0,
        lastPlayed = 0;

    function startGame(game, time) {

    }

    function endGame(game, time) {
        
    }

    function tryStartGame(game, time) {
        var success = false;

        if ((time - (lastPlayed + coolDown)) > 0 ) {
            lastPlayed = time;
            success = true;
        }

        return success;
    }

    function getCooldown(time) {
        if ((time - (lastPlayed + coolDown)) > 0) {
            return 0;
        }
        else {
            return ((lastPlayed + coolDown) - time);
        }
    }
    
    $.game = {
        isRunning: gameIsRunning,
        coolDown: coolDown,        
        tryStartGame: tryStartGame,
        getCooldown: getCooldown
    };

})();