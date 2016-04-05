(function() {
    
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            username = $.username.resolve(sender, event.getTags()),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            actionArg1 = args[1];

        /**
         * @commandpath cl [user] - Purges a users message
         */
        if (command.equalsIgnoreCase('clr')) {
            if (!$.isMod(sender)) {
                return;
            }
            
            if ($.isMod(action)) {
                return;
            }

            $.logEvent('./commands/quickmodCommands.js', 26, 'Clear: ' + sender + 'req by: ' + sender);
            $.timeoutUser(action, 1);
            return;
        }

        /**
         * @commandpath to [user] [time] - Times a users out
         */
        if (command.equalsIgnoreCase('to')) {
            if (!$.isMod(sender)) {
                return;
            }
            
            if ($.isMod(action)) {
                return;
            }

            if (isNaN(actionArg1)) {
                $.logEvent('./commands/quickmodCommands.js', 44, 'Timeout: ' + action + 'req by: ' + sender);
                $.timeoutUser(action, 60);
                return;
            }
            else {
                $.logEvent('./commands/quickmodCommands.js', 49, 'Timeout: ' + action + 'req by: ' + sender);
                $.timeoutUser(action, Math.min(actionArg1, 60));
                return;
            }
        }
        
        if (command.equalsIgnoreCase('unban')) {
            if (!$.isMod(sender)) {
                return;
            }
            $.logEvent('./commands/quickmodCommands.js', 58, 'Unban: ' + action + 'req by: ' + sender);
            $.say('.unban ' + action);
        }
        
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./commands/quickmodCommands.js')) {
            $.registerChatCommand('./commands/quickmodCommands.js', 'clr', 2);
            $.registerChatCommand('./commands/quickmodCommands.js', 'to', 2);
            $.registerChatCommand('./commands/quickmodCommands.js', 'unban', 2);
        }
    });
})();