/**
 * streamCommand.js
 *
 * This module offers commands to view/alter channel information like current game, title and status
 */
(function() {
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            argsString = event.getArguments().trim(),
            args = event.getArgs();

        /**
         * @commandpath online - Tell if the stream is online or not - Viewer
         */
        if (command.equalsIgnoreCase('online')) {
            if ($.isOnline($.channelName)) {
                $.say($.whisperPrefix(sender) + 'Stream ist online!');
            } else {
                $.say($.whisperPrefix(sender) + 'Stream ist offline.');
            }
        }

        /**
         * @commandpath viewers - Announce the current amount of viewers in the chat - Moderator
         */
        if (command.equalsIgnoreCase('viewers')) {
            $.say($.whisperPrefix(sender) + 'Currently ' + $.getViewers($.channelName) + ' viewers are watching ' + $.username.resolve($.channelName) + '!');
        }

        /**
         * @commandpath game [game title] - Announce Twitch game title or set the game title. - Viewer [Administrator]
         */
        if (command.equalsIgnoreCase('game')) {
            if (args.length == 0) {
                $.say('Current Game: ' + $.getGame($.channelName));
            } else {
                if (!$.isAdmin(sender)) {
                    //$.say($.whisperPrefix(sender) + $.casterMsg);
                    return;
                }

                $.updateGame($.channelName, argsString, sender);
            }
        }

        /**
         * @commandpath title [stream title] - Announce Twitch stream title or set the stream title - Viewer [Administrator]
         */
        if (command.equalsIgnoreCase('title')) {
            if (args.length == 0) {
                $.say('Current Status: ' + $.getStatus($.channelName));
            } else {
                if (!$.isAdmin(sender)) {
                    //$.say($.whisperPrefix(sender) + $.casterMsg);
                    return;
                }

                $.updateStatus($.channelName, argsString, sender);
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./commands/streamCommand.js')) {
            $.registerChatCommand('./commands/streamCommand.js', 'online', 7);
            $.registerChatCommand('./commands/streamCommand.js', 'viewers', 2);
            $.registerChatCommand('./commands/streamCommand.js', 'game', 7);
            $.registerChatCommand('./commands/streamCommand.js', 'title', 7);
        }
    });
})();