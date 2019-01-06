(function() {
    var whisperMode = $.getSetIniDbBoolean('settings', 'whisperMode', false);

    /** 
     * @function hasKey
     *
     * @param {array} list
     * @param {string} value
     * @param {int} subIndex
     * @returns {boolean}
     */
    function hasKey(list, value, subIndex) {
        var i;

        for (i in list) {
            if (list[i][subIndex].equalsIgnoreCase(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @function whisperPrefix
     *
     * @export $
     * @param {string} username
     * @param {boolean} force
     * @returns {string}
     */
    function whisperPrefix(username, force) {
        if (whisperMode || force) {
            return '/w ' + username + ' ';
        }
        return '@' + $.username.resolve(username) + ', ';
    }

    /**
     * @function getBotWhisperMode
     *
     * @export $
     * @returns {boolean}
     */
    function getBotWhisperMode() {
        return whisperMode;
    }

    /**
     * @event ircPrivateMessage
     */
    $.bind('ircPrivateMessage', function(event) {
        var sender = event.getSender(),
            message = event.getMessage().toString(),
            split = 0,
            args = '',
            command = '';

        var EventBus = Packages.me.mast3rplan.phantombot.event.EventBus,
            CommandEvent = Packages.me.mast3rplan.phantombot.event.command.CommandEvent;

        if (!sender.equalsIgnoreCase('jtv') && !sender.equalsIgnoreCase('twitchnotify')) {
            if (message.startsWith('!') && $.isMod(sender) && hasKey($.users, sender, 0)) {

                message = message.substring(1);

                if (message.includes(' ')) {
                    split = message.indexOf(' ');
                    command = message.substring(0, split);
                    args = message.substring(split + 1);
                }
                else
                {
                    command = message;
                }

                EventBus.instance().post(new CommandEvent(event.getSender(), command, args));
                //$.command.post(sender, command, args);
                $.log.file('whispers', '' + sender + ': !' + message);
            }
        }
    });

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand();

        /**
         * @commandpath togglewhispermode - Toggle whisper mode
         */
        if (command.equalsIgnoreCase('togglewhispermode')) {
            if (whisperMode) {
                $.inidb.set('settings', 'whisperMode', 'false');
                whisperMode = false;
                $.say($.whisperPrefix(sender) + $.lang.get('whisper.whispers.disabled'));
            } else {
                $.inidb.set('settings', 'whisperMode', 'true');
                whisperMode = true;
                $.say($.whisperPrefix(sender) + $.lang.get('whisper.whispers.enabled'));
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./core/whisper.js', 'togglewhispermode', 1);
    });

    /** Export functions to API */
    $.whisperPrefix = whisperPrefix;
    $.getBotWhisperMode = getBotWhisperMode;
})();
