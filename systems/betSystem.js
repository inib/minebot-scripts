/**
 * TODO LIST:
 * 
 * - advanced DAU control FailFish
 *   - mods
 *   - bet updates
 */

(function() {
    var betMinimum = ($.inidb.exists('betSettings', 'betMinimum') ? parseInt($.inidb.get('betSettings', 'betMinimum')) : 1),
        betMaximum = ($.inidb.exists('betSettings', 'betMaximum') ? parseInt($.inidb.get('betSettings', 'betMaximum')) : 1000),        
        betStatus = false, // {bool} is bet running
        betPot = 0, // {int} current pot size
        betOptions = [], // { string[] } the options to bet on
        betTable = [], // { string[] { amount: {int}, option: {string} } } hold betters and their wager
        betClosed = false; // {bool} is bet closed
        betTimerID = 0;

        if (!$.inidb.FileExists('betScores')) { 
            $.inidb.AddFile('betScores');
        }

        if (!$.inidb.FileExists('betHistory')) { 
            $.inidb.AddFile('betHistory');
        }

     /** 
     * @function hasKey
     * @param {Array} list
     * @param {*} value
     * @param {Number} [subIndex]
     * @returns {boolean}
     */
    function hasKey(list, value, subIndex) {
        var i;

        if (subIndex > -1) {
            for (i in list) {
                if (list[i][subIndex].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        } else {
            for (i in list) {
                if (list[i].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        }
        return false;
    };

    function betOpen(event, betOps, betString) {        
        var sender = event.getSender(),
            args = event.getArgs(),            
            betOp = betOps,
            i;
        if (betString === '') {
            betString = $.lang.get('betsystem.default.opened');
        }

        if (betStatus) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.opened'));
            return;
        }

        if (betOp.length < 2) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.options'));
            return;
        }

        for (i = 0; i < betOp.length; i++) {
            betOptions.push(betOp[i].toLowerCase().trim());
            if (!isNaN(betOp[i])) {
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.open'));
                betOptions = [];
                return;
            }
        }

        betTimerID = setInterval(function() { betShowStatus(); }, 150*1000);

        betStatus = true;       
        
        $.log.file('betSystem', 'Bet started by ' + event.getSender() + ' ' + betOptions.join(', '));

        $.say($.lang.get('betsystem.opened', betString, betOptions.map(function (x){ return x.toUpperCase();}).join(', '), $.pointNameMultiple));
    }

    function resetBet() {
        if (!betClosed) {
            clearInterval(betTimerID);
        }
        betPot = 0;
        betOptions = [];
        betTable = [];
        betClosed = false;
        betStatus = false;
    }
    
    function betClose(sender, event) {
        
        if (betStatus && !betClosed) {
            
            var closedPot = betPot;
            var langString = '' + betPot;
            var quotes = calcQuotes();
            langString += ' ' + getQuoteString(quotes);
            clearInterval(betTimerID);
            betClosed = true;

            $.log.file('betSystem', 'Bet closed by ' + event.getSender() + '.');
            $.say($.lang.get('betsystem.closed', langString));
        }
        else {
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.closed.nobet'));
             }
    }
    
    function betShowStatus() {
        
        var statusString = '';
        
        if (!betStatus) {
            //$.say($.lang.get('betsystem.status.404'));
            return;
        }

        statusString = 'Pot: ' + betPot + ' - ' + getQuoteString(calcQuotes());

        if (betClosed) {
            $.say($.lang.get('betsystem.status.closed', statusString));
        } else {
            $.say($.lang.get('betsystem.status.open', statusString, $.pointNameMultiple));
        }
    }

    function calcQuotes() {

        var response = [];

        if (betStatus && betPot > 0) {

            for (var i = 0; i < betOptions.length; i++) {

                var optionPot = 0;
                var optionQuote = 0;
                var option = betOptions[i];
                var j = 0;

                for (var bet in betTable) {
                    if (betTable[bet].option.equalsIgnoreCase(option)) {
                        optionPot += betTable[bet].amount;
                        j++;
                    }
                }

                if (optionPot > 0) {
                    optionQuote = betPot / optionPot;
                    response.push({ option: option, quote: optionQuote, bets: j});
                }
            }
        }
        return response;
    }

    function getQuoteString(arr) {
        var response = '';

        response += 'Quoten: ';

        for (var i = 0; i < arr.length; i++) {
            var element = arr[i];
            response += element.option.toUpperCase() + ' ' + element.quote.toFixed(2) + ' (' + element.bets + ')';
            if ((i + 1) == arr.length) {
                //response += '.';
            } else {
                response += ' | ';
            }
        }

        return response;
    }

    function betEnd(sender, event, subAction) {
        var args = event.getArgs(),
            betWinning = subAction,
            betWinPercent = 0,
            betPointsWon = 0,
            betTotal = 0,
            bet,
            logString = "Payouts: ",
            i;

        // No bet is running    
        if (!betStatus) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.closed'));
            return;
        }
        
        // No winning option was given
        if (!betWinning) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.win.option'));
            return;
        }

        // before we check for the winning option, we want to check for an abort.
        // sends points back and resets the betSystem        
        if (subAction == 'abort') {
            $.log.file('betSystem', 'Bet ended by ' + event.getSender() + ' Aborted.');
            for (i in betTable) {
            bet = betTable[i];
                $.inidb.incr('points', i, bet.amount);
                $.inidb.incr('betScores', i, bet.amount);
                logString += i + parseInt(bet.amount);
            }
            $.say($.lang.get('betsystem.end.aborted', $.getPointsString(betPot)));
            $.log.file('betSystem', logString);
            resetBet();
            return;
        }

        // Winning option not valid
        if (!hasKey(betOptions, betWinning)) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404', betOptions.join(', ')));
            return;
        }

        // winning option is on the list
        // disable betting, set winning option
        betWinning = subAction.toLowerCase();
        betStatus = false; 

        // calculate the winning part of the pot
        for (i in betTable) {
            bet = betTable[i];
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betTotal += bet.amount;
            }
        }
        
        // if winning pot equals zero, nobody won
        // reset bet system
        if (betTotal <= 0) {
            $.say($.lang.get('betsystem.end.404', betWinning.toUpperCase()));
            $.log.file('betSystem', 'Bet ended by ' + event.getSender() + '. No Winners.');
            resetBet();
            return;
        }
        
        // if pot equals zero something went crazy (obsolete?)
        // sends points back and resets the betSystem
        if (betPot <= 0) {
            $.log.file('betSystem', 'Bet ended by ' + event.getSender() + ' betPot = 0. ?!');
            for (i in betTable) {
                bet = betTable[i];
                $.inidb.incr('points', i, bet.amount);
                $.inidb.incr('betScores', i, bet.amount);
                logString += i + parseInt(bet.amount);
            }
            $.say($.lang.get('betsystem.err.points.refunded'));
            $.log.file('betSystem', logString);
            resetBet();
            return;
        }
        
        // Now it's save to calculate the win multiplier
        betPointsWon = (betPot / betTotal);
        $.log.file('betSystem', 'Bet ended by ' + event.getSender() + ' Pot:' + betPot + 'Win percent: ' + betPointsWon);

        var betWinners = [];
        var betWinString = '';
        var betWinCount = 0;
        var betWinShow = 0;
        
        // payout the winners
        // inform chat
        // reset betSystem

        var betObj = { winOption: ''+betWinning, pot: ''+betPot, betOptions: betOptions, bets: []};        

        for (i in betTable) {
            var betItem = {};
            bet = betTable[i];
            betItem = { username: i, option: ''+bet.option, amount: 1*bet.amount};
            betObj.bets.push(betItem);
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betWinPercent = (bet.amount / betTotal);
                $.inidb.incr('points', i, parseInt(betPot * betWinPercent));
                $.inidb.incr('betScores', i, parseInt(betPot * betWinPercent));
                betWinners[betWinCount] = { nick: i, amount: parseInt(betPot * betWinPercent) };
                betWinCount++;
                logString += i + ': ' + parseInt(betPot * betWinPercent) + ' - ';
            }
        }

        betWinners.sort( function(a, b) { return b.amount-a.amount; } );
        betWinShow = (betWinCount > 8 ? 8 : betWinCount);
        betWinString = 'Wettgewinner: ';

        for (i = 0; i < betWinShow; i++) {
            betWinString += betWinners[i].nick + '(' + betWinners[i].amount + ')';
            betWinString += (i+1 < betWinShow ? ', ' : '');
        }

        betWinString += (betWinCount > betWinShow ? 'und ' + (betWinCount - betWinShow) + ' weitere.' : '.');

        $.log.file('betSystem', logString);
        $.say($.lang.get('betsystem.end', betWinning.toUpperCase(), $.getPointsString(betPot), betPointsWon.toFixed(2)));
        $.say(betWinString);
        var betObjString = '';
        betObjString = JSON.stringify(betObj);
        $.inidb.set('betHistory', $.systemTime(), betObjString);

        resetBet();
    }

    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1],
            bet = args.slice(1);

        /**
         * @commandpath bet - Performs bet operations. - Viewer
         */
        if (command.equalsIgnoreCase('bet')) {
            if (!action) {
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.command.usage'));
                return;
            }

            /**
             * @commandpath bet open [option option option ...] - Opens a bet with options; not allowed to be digits, words only. - Moderator
             */
            if (action.equalsIgnoreCase('open')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }

                betOpen(event, bet, '');
                return;
            /**
            * @commandpath bet status - Shows bet status. - Moderator
            */
            } else if (action.equalsIgnoreCase('status')) {
                if (betStatus) {
                    var i = sender.toLowerCase();
                    var yourBet = betTable[i];
                    var statString = betClosed ? $.lang.get('betsystem.helper.closed') : $.lang.get('betsystem.helper.opened');
                    if (yourBet) {
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.status.ind', yourBet.amount, $.pointNameMultiple, yourBet.option.toUpperCase(), statString));
                    }
                    else {
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.status.ind.404', statString));
                    }
                }
                else {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.status.404'));
                }
 
                if (!$.isModv3(sender, event.getTags())) {               
                    return;
                }                    
                
                betShowStatus();
                return;

            /**
            * @commandpath bet close - Closes the bet. - Moderator
            */
            } else if (action.equalsIgnoreCase('close')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }                    
                
                betClose(sender, event);
                return;
                
            /**
            * @commandpath bet arena - Opens an HS arena bet. - Moderator
            */
            } else if (action.equalsIgnoreCase('arena')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }
                var arenaOptions = ['0-2', '3-5', '6-8', '9-11', '12WINS'],
                    arenaString = $.lang.get('betsystem.arenabet.start');                    
                
                betOpen(event, arenaOptions, arenaString);
                return;
                
            /**
            * @commandpath bet dota - Opens a dota bet. - Moderator
            */
            } else if (action.equalsIgnoreCase('dota')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }
                var dotaOptions = [$.lang.get('betsystem.dotabet.win'), $.lang.get('betsystem.dotabet.lose')],
                    dotaString = $.lang.get('betsystem.dotabet.start');                    
                
                betOpen(event, dotaOptions, dotaString);
                return;

            /**
             * @commandpath bet end [option] - Ends the bet and selects [option] as the winner. - Moderator
             */
            } else if (action.equalsIgnoreCase('end')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }
                
                betEnd(sender, event, subAction);
                return;
                
            /**
            * @commandpath bet abort - aborts bet. - Moderator
            */
            } else if (action.equalsIgnoreCase('abort')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }
                
                subAction = 'abort';                  
                
                betEnd(sender, event, subAction);
                return;

            /**
            * @commandpath bet setminimum [value] - Set the minimum value of a bet. - Administrator
             */
            } else if (action.equalsIgnoreCase('setminimum')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }

                if (!subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.min.usage'));
                    return;
                }

                betMinimum = parseInt(subAction);
                $.inidb.set('betSettings', 'betMinimum', betMinimum);
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.min', betMinimum, $.pointNameMultiple));
                return;

            /**
             * @commandpath bet setmaximum [value] - Set the maximum value of a bet. - Administrator
             */
            } else if (action.equalsIgnoreCase('setmaximum')) {
                if (!$.isModv3(sender, event.getTags())) {                    
                    return;
                }

                if (!subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.max.usage'));
                    return;
                }

                betMaximum = parseInt(subAction);
                $.inidb.set('betSettings', 'betMaximum', betMaximum);
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.set.max', betMaximum, $.pointNameMultiple));
                return;

            /**
             * @commandpath bet [ [option amount] | [amount option] ]- Places a bet on option, betting an amount of points. - Viewer
             */
            } else {
                if (!betStatus) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.end'));
                    return;
                }
                
                if (betClosed) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.closed'));
                    return;
                }

                var betWager,
                    betOption;

                if (!action || !subAction) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404', betOptions.join(', ')));
                    return;
                }

                if (isNaN(action) && isNaN(subAction)) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404', betOptions.join(', ')));
                    return;
                }
                if (isNaN(action) && !isNaN(subAction)) {
                    betWager = parseInt(subAction);
                    betOption = action;
                }
                if (!isNaN(action) && isNaN(subAction)) {
                    betWager = parseInt(action);
                    betOption = subAction;
                }

                if (!hasKey(betOptions, betOption.toLowerCase())) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404', betOptions.join(', ')));
                    return;
                } else if (betWager < 1) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.err.neg', $.pointNameMultiple));
                    return;
                } else if (betWager < betMinimum) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.err.less', $.getPointsString(betMinimum)));
                    return;
                } else if (betWager > betMaximum) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.err.more', $.getPointsString(betMaximum)));
                    return;
                } else if (parseInt($.getUserPoints(sender.toLowerCase())) < betWager) {
                    $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.points', $.pointNameMultiple));
                    return;
                }
                
                // Wette aktualisieren (Njnia is Schuld)
                var i = sender.toLowerCase();
                bet = betTable[i];
                if (bet) {
                    if (bet.amount != betWager || bet.option != betOption) {
                        
                        $.inidb.incr('points', sender, bet.amount);
                        $.inidb.incr('betScores', sender, bet.amount);
                        betPot = betPot - bet.amount;
                                                   
                        betTable[i] = { 
                            amount: betWager,
                            option: betOption
                        };

                        $.inidb.decr('points', sender, betWager);
                        $.inidb.decr('betScores', sender, betWager); 
                        betPot = (betPot + betWager);
                        $.logEvent('betSystem.js', 367, 'Bet updated for: ' + sender + ' wager: ' + betWager + ' option:' + betOption);
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.updated', sender, betWager, betOption, $.getPointsString(betPot)));
                    }
                    else {
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.voted', betWager, betOption));
                    }
                    return;
                }

                $.inidb.decr('points', sender, betWager);
                $.inidb.decr('betScores', sender, betWager); 

                if (betPot == 0) {
                    betPot = betWager;
                } else {
                    betPot = (betPot + betWager);
                }

                betTable[sender.toLowerCase()] = {
                    amount: betWager,
                    option: betOption
                };
                $.logEvent('betSystem.js', 389, 'Bet accepted for: ' + sender + ' wager: ' + betWager + 'option: ' + betOption);    
                $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.accepted', sender, $.getPointsString(betWager), betOption, $.getPointsString(betPot)));
            }
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/betSystem.js')) {
            $.registerChatCommand('./systems/betSystem.js', 'bet', 7);            
            $.registerChatSubcommand('bet', 'end', 2);
            $.registerChatSubcommand('bet', 'arena', 2);
            $.registerChatSubcommand('bet', 'dota', 2);
            $.registerChatSubcommand('bet', 'abort', 2);
            $.registerChatSubcommand('bet', 'close', 2);
            $.registerChatSubcommand('bet', 'open', 2);
            $.registerChatSubcommand('bet', 'status', 7);
            $.registerChatSubcommand('bet', 'setminimum', 1);
            $.registerChatSubcommand('bet', 'setmaximum', 1);
        }
    });
})();
