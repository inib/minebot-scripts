/**
 * UPDATE TO ARENA/DOTA2
 * 20.03. update wager
 * 
 * TODO LIST:
 * - announce winners
 * - announce bets
 * - advanced DAU control FailFish
 * - announcements during open bet
 * - ALLCAPS bet options
 * 
 */




(function() {
    var betMinimum = ($.inidb.exists('betSettings', 'betMinimum') ? parseInt($.inidb.get('betSettings', 'betMinimum')) : 1),
        betMaximum = ($.inidb.exists('betSettings', 'betMaximum') ? parseInt($.inidb.get('betSettings', 'betMaximum')) : 1000),
        time = 0,
        betStatus = false,
        betPot = 0,
        betOptions = [],
        betTable = [],
        betClosed = false,
        betTotal,
        betWinners;

    function betOpen(event, betOps, betString) {        
        var sender = event.getSender(),
            args = event.getArgs(),            
            betOp = betOps,
            i;
        if (betString === '') {
            betString = $.lang.get('betsystem.default.opened', betOps.join(', '));
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

        betString = betString + betOptions.join(' - ');

        betStatus = true;
        
        $.logEvent('betSystem.js', 49, 'Bet started' + betOptions.join(', ') + 'Pot: ' + betPot);

        $.say($.lang.get('betsystem.opened', betString, $.pointNameMultiple));
    }

    function resetBet() {
        betPot = 0;
        betTotal = 0;
        betWinners = '';
        betOptions = [];
        betTable = [];
        betClosed = false;
        betStatus = false;
    }
    
    function betClose(sender, event) {
        
        if (betStatus && !betClosed) {
            
            var closedPot = 0;
            betClosed = true;
            //calc pot/perc
            for (var i in betTable) {
                var bet = betTable[i];
                closedPot += bet.amount;
            }

            $.logEvent('betSystem.js', 71, 'Bet closed');
            $.say($.lang.get('betsystem.closed', closedPot)); //Njnias Zeile
        }
        else {
                // TODO
             }
    }
    
    function betShowStatus(sender, event) {
        
        var statusString = '';
        
        if (betStatus && !betClosed) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.closed'));
            return;
        }
        
        for (var i in betOptions) {
            for (var j in betTable) {
                var bet = betTable[j];
                if (betOptions[i] == bet.option) {
                    statusString += i + ', ';
                }
            }
            $.say($.lang.get('betsystem.show.status'), statusString);
            statusString = '';           
        }
    }

    function betEnd(sender, event, subAction) {
        var args = event.getArgs(),
            betWinning = subAction,
            betWinPercent = 0,
            betPointsWon = 0,
            betTotal = 0,
            bet,
            i;

        if (!betStatus) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.bet.closed'));
            return;
        }

        if (!betWinning) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.win.option'));
            return;
        }

        if (subAction.toLowerCase() == 'abort') {
            for (i in betTable) {
                bet = betTable[i];
                $.inidb.incr('points', i, bet.amount);
            }
            $.say($.lang.get('betsystem.end.aborted', $.getPointsString(betPot)));
            resetBet();
            return;
        }

        if (!$.list.contains(betOptions, betWinning)) {
            $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.option.404', betOptions.join(', ')));
            return;
        }

        betWinning = subAction.toLowerCase();

        for (i in betTable) {
            bet = betTable[i];
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betTotal += bet.amount;
            }
        }
        
        if (betTotal == 0) {
            $.say($.lang.get('betsystem.end.404', betWinning));
            resetBet();
            return;
        }

        if (betPot <= 0) {
            for (i in betTable) {
                bet = betTable[i];
                $.inidb.incr('points', i, bet.amount);
            }
            $.say($.lang.get('betsystem.err.points.refunded'));
            resetBet();
            return;
        }

        for (i in betTable) {
            bet = betTable[i];
            if (bet.option.equalsIgnoreCase(betWinning)) {
                betWinPercent = (bet.amount / betTotal);
                $.inidb.incr('points', i, (betPot * betWinPercent));
            }
        }
        $.logEvent('betSystem.js', 179, 'Bet ended: Pot:' + betPot + 'Win percent: ' + betPointsWon);
        $.say($.lang.get('betsystem.end', betWinning, $.getPointsString(betPot), betPointsWon.toFixed(2)));
        
        // ToDo
        //Announce Top winner
        
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

                if (!$.list.contains(betOptions, betOption.toLowerCase())) {
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
                        betPot = betPot - bet.amount;
                                                   
                        betTable[i] = { 
                            amount: betWager,
                            option: betOption
                        }

                        $.inidb.decr('points', sender, betWager); 
                        betPot = (betPot + betWager);
                        $.logEvent('betSystem.js', 367, 'Bet updated for: ' + sender + ' wager: ' + betWager + ' option:' + betOption);
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.bet.updated', sender, betWager, betOption));
                    }
                    else {
                        $.say($.whisperPrefix(sender) + $.lang.get('betsystem.err.voted', betWager, betOption));
                    }
                    return;
                }

                $.inidb.decr('points', sender, betWager);

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
            $.registerChatSubcommand('bet', 'setminimum', 1);
            $.registerChatSubcommand('bet', 'setmaximum', 1);
        }
    });
})();
