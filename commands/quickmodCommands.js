(function() {
    
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            username = $.username.resolve(sender, event.getTags()),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            actionArg1 = args[1];

        /**
         * @commandpath cl [user] - Purges a users message
         */
        if (command.equalsIgnoreCase("cl")) {
            if (!$.isModv3(sender, event.getTags())) {
                return;
            }
            
            if ($.isMod(args)) {
                return;
            }

            $.logEvent('./commands/quickmodCommand.js', 17, 'Clear: ' + sender + 'req by: ' + sender);
            $.timeoutUser(action, 1);
            return;
        }

        /**
         * @commandpath to [user] [time] - Times a users out
         */
        if (command.equalsIgnoreCase("to")) {
            if (!$.isModv3(sender, event.getTags())) {
                return;
            }
            
            if ($.isMod(args)) {
                return;
            }

            if (isNan(actionArg1)) {
                $.logEvent('./commands/quickmodCommand.js', 30, 'Timeout: ' + sender + 'req by: ' + sender);
                $.timeoutUser(action, 60);
                return;
            }
            else {
                $.logEvent('./commands/quickmodCommand.js', 35, 'Timeout: ' + sender + 'req by: ' + sender);
                $.timeoutUser(action, actionArg1);
                return;
            }
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./commands/quickmodCommand.js')) {
            $.registerChatCommand('./commands/quickmodCommand.js', 'cl', 2);
            $.registerChatCommand('./commands/quickmodCommand.js', 'to', 2);
        }
    });
})();