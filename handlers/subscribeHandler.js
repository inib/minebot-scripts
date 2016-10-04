/**
 * subscribehandler.js
 *
 * Register new subscribers and unsubscribers in the channel
 */
(function() {
    var subMessage = $.getSetIniDbString('subscribeHandler', 'subscribeMessage', '(name) just subscribed!'),
        reSubMessage = $.getSetIniDbString('subscribeHandler', 'reSubscribeMessage', '(name) just subscribed for (months) months in a row!'),
        subWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'subscriberWelcomeToggle', true),
        reSubWelcomeToggle = $.getSetIniDbBoolean('subscribeHandler', 'reSubscriberWelcomeToggle', true),
        subReward = $.getSetIniDbNumber('subscribeHandler', 'subscribeReward', 0),
        notifyStreamerToggle = $.getSetIniDbBoolean('subscribeHandler', 'notifyStreamerToggle', true),
        subList = [],
        subListTime = $.systemTime(),
        announce = false;
    /**
     * @function updateSubscribeConfig
     */
    function updateSubscribeConfig() {
        subMessage = $.getIniDbString('subscribeHandler', 'subscribeMessage');
        reSubMessage = $.getIniDbString('subscribeHandler', 'reSubscribeMessage');
        subWelcomeToggle = $.getIniDbBoolean('subscribeHandler', 'subscriberWelcomeToggle');
        reSubWelcomeToggle = $.getIniDbBoolean('subscribeHandler', 'reSubscriberWelcomeToggle');
        subReward = $.getIniDbNumber('subscribeHandler', 'subscribeReward');
        notifyStreamerToggle = $.getIniDbBoolean('subscribeHandler', 'notifyStreamerToggle');
    }

    function getTimeDif(time)
    {
        var diffDays = Math.round(time / 86400000); // days
        var diffHrs = Math.round(time / 3600000); // hours
        var diffMins = Math.round(time / 60000); // minutes
        
        if (diffDays > 0) {
            if (diffDays == 1) {
                return diffDays + ' Tag';
            }
            return diffDays + ' Tagen';
        }
        if (diffHrs > 0) {
            if (diffHrs == 1) {
                return diffHrs + ' Std';
            }
            return diffHrs + ' Std';
        }
        if (diffMins > 0) {
            if (diffMins == 1) {
                return diffMins + ' Min';
            }
            return diffMins + ' Mins';
        }
    }

    /**
     * @event twitchSubscribeInitialized
     */
    $.bind('twitchSubscribesInitialized', function() {
        if (!$.bot.isModuleEnabled('./handlers/subscribeHandler.js')) {
            return;
        }

        $.consoleLn('>> Enabling subscriber announcements');
        $.log.event('Subscriber announcements enabled');
    });

    /**
     * @event twitchSubscribe
     */
    $.bind('twitchSubscribe', function(event) { // from twitch api
        if (!$.bot.isModuleEnabled('./handlers/subscribeHandler.js')) {
            return;
        }

        var subscriber = event.getSubscriber();

        if (!$.inidb.exists('subscribed', subscriber)) {
            $.addSubUsersList(subscriber);
            $.restoreSubscriberStatus(subscriber, true);
        } else if (subReward > 0 && $.bot.isModuleEnabled('./systems/pointSystem.js')) {
            $.inidb.incr('points', subscriber, subReward);
        }
    });

    /**
     * @event twitchUnSubscribe
     */
    $.bind('twitchUnsubscribe', function(event) { // from twitch api
        if (!$.bot.isModuleEnabled('./handlers/subscribeHandler.js')) {
            return;
        }

        var subscriber = event.getSubscriber();

        if ($.inidb.exists('subscribed', subscriber)) {
            $.delSubUsersList(subscriber);
            $.restoreSubscriberStatus(subscriber, true);
        }
    });

    $.bind('NewSubscriber', function(event) { // From twitchnotify
        var subscriber = event.getSub(),
            currentTime = $.systemTime(),
            message = subMessage;

        subList.push({
            username: subscriber,
            time: currentTime,
            months: 0,
        });

        if (subWelcomeToggle && announce) {
            if (message.match(/\(name\)/g)) {
                message = $.replace(message, '(name)', $.username.resolve(subscriber));
            }
            if (message.match(/\(reward\)/g)) {
                message = $.replace(message, '(reward)', String(subReward));
            }
            $.say(message);
            $.addSubUsersList(subscriber);
            $.inidb.set('streamInfo', 'lastSub', $.username.resolve(subscriber));
        }
        if (notifyStreamerToggle && $.isOnline($.channelName) ) {
            $.say($.whisperPrefix($.channelName) + 'Neuer Sub: ' + subscriber);
        }
    });

    $.bind('NewReSubscriber', function(event) { // From notice event
        var resubscriber = event.getReSub(),
            months = event.getReSubMonths(),
            currentTime = $.systemTime(),
            message = reSubMessage;
        
        subList.push({
            username: resubscriber,
            time: currentTime,
            months: months,
        });

        if (reSubWelcomeToggle && announce) {
            if (message.match(/\(name\)/g)) {
                message = $.replace(reSubMessage, '(name)', $.username.resolve(resubscriber));
            }
            if (message.match(/\(months\)/g)) {
                message = $.replace(message, '(months)', months);
            }
            if (message.match(/\(reward\)/g)) {
                message = $.replace(message, '(reward)', String(subReward));
            }
            $.say(message);         
            $.restoreSubscriberStatus(resubscriber, true);
            $.inidb.set('streamInfo', 'lastReSub', $.username.resolve(resubscriber));
        }
        if (notifyStreamerToggle && $.isOnline($.channelName)) {
            $.say($.whisperPrefix($.channelName) + 'ReSub: ' + resubscriber + ' für ' + months + ' Monate am Stück.');
        }
    });

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argsString = event.getArguments().trim(),
            currentTime = $.systemTime(),
            args = event.getArgs()
            i = 0;

        if (command.equalsIgnoreCase('getnewsubs')) {

            var timeElapsed = Math.round(currentTime - subListTime);
            var answer = '';

            if (subList.length > 0) {
                answer = 'Neue Subs in den letzten ' + getTimeDif(timeElapsed) + ': ';
                for (i in subList) {
                    var subElapsed = Math.round(currentTime - subList[i].time);
                    if (subList[i].months === 0) {
                        answer += subList[i].username + ' (Neu, vor ' + getTimeDif(subElapsed) + '), ';
                    }
                    else {
                        answer += subList[i].username + ' (' + subList[i].months + ' Monate, vor ' + getTimeDif(subElapsed) +'), ';
                    }
                }
            }
            else {
                answer = 'Keine neuen Subs in den letzten ' + timeElapsed + ' Minuten.';
            }

            if (sender.equalsIgnoreCase($.channelName)) {
                subList = [];
                subListTime = currentTime;
            }
            $.say($.whisperPrefix(sender) + answer);
        }

        /* Do not show command in command list, for the panel only. */
        if (command.equalsIgnoreCase('subscribepanelupdate')) {
            updateSubscribeConfig();
        }

         /**
         * @commandpath subwelcometoggle - Enable or disable subscription alerts - Moderator
         */
        if (command.equalsIgnoreCase('notifytoggle')) {
            if (notifyStreamerToggle) {
                $.inidb.set('subscribeHandler', 'notifyStreamerToggle', false);
                notifyStreamerToggle = false;
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.new.sub.toggle.off'));
                $.log.event(sender + ' disabled streamer notifications');
                return;
            } else {
                $.inidb.set('subscribeHandler', 'notifyStreamerToggle', true);
                notifyStreamerToggle = true;
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.new.sub.toggle.on'));
                $.log.event(sender + ' enabled streamer notifications');
                return;
            }
        }
    
        /**
         * @commandpath subwelcometoggle - Enable or disable subscription alerts - Moderator
         */
        if (command.equalsIgnoreCase('subwelcometoggle')) {
            if (subWelcomeToggle) {
                $.inidb.set('subscribeHandler', 'subscriberWelcomeToggle', false);
                subWelcomeToggle = false;
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.new.sub.toggle.off'));
                $.log.event(sender + ' disabled subscriber announcements');
                return;
            } else {
                $.inidb.set('subscribeHandler', 'subscriberWelcomeToggle', true);
                subWelcomeToggle = true;
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.new.sub.toggle.on'));
                $.log.event(sender + ' enabled subscriber announcements');
                return;
            }
        }

        /**
         * @commandpath resubwelcometoggle - Eenable or disable resubsciption alerts - Moderator
         */
        if (command.equalsIgnoreCase('resubwelcometoggle')) {
            if (subWelcomeToggle) {
                $.inidb.set('subscribeHandler', 'reSubscriberWelcomeToggle', false);
                subWelcomeToggle = false;
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.resub.toggle.off'));
                $.log.event(sender + ' disabled re-subscriber announcements');
                return;
            } else {
                $.inidb.set('subscribeHandler', 'reSubscriberWelcomeToggle', true);
                subWelcomeToggle = true;
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.resub.toggle.on'));
                $.log.event(sender + ' enabled re-subscriber announcements');
                return;
            }
        }

        /**
         * @commandpath submessage [message] - Set a welcome message for new subscribers when a reward is given - Moderator
         */
        if (command.equalsIgnoreCase('submessage')) {
            if (args.length == 0) {
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.sub.msg.usage'));
                return;
            }
            $.inidb.set('subscribeHandler', 'subscribeMessage', argsString);
            subMessage = argsString + '';
            $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.sub.msg.set'));
            $.log.event(sender + ' changed the subscriber message to "' + subMessage + '"');
            return;
        }

        /**
         * @commandpath resubmessage [message] - Set a message for resubscribers when a reward is given - Moderator
         */
        if (command.equalsIgnoreCase('resubmessage')) {
            if (args.length == 0) {
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.resub.msg.usage'));
                return;
            }
            $.inidb.set('subscribeHandler', 'reSubscribeMessage', argsString);
            reSubMessage = argsString + '';
            $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.resub.msg.set'));
            $.log.event(sender + ' changed the re-subscriber message to "' + reSubMessage + '"');
            return;
        }

        /**
         * @commandpath subscribereward [points] - Set an award for subscribers - Moderator
         */
        if (command.equalsIgnoreCase('subscribereward')) {
            if (args.length == 0) {
                $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.reward.usage'));
                return;
            }
            $.inidb.set('subscribeHandler', 'subscribeReward', parseInt(args[0]));
            subReward = parseInt(args[0]);
            $.say($.whisperPrefix(sender) + $.lang.get('subscribehandler.reward.set'));
            $.log.event(sender + ' changed the subscriber reward to ' + subReward);
            return;
        }


        /**
         * @commandpath subscribers - Enables subscription only chat mode - Moderator
         */
        if (command.equalsIgnoreCase('subscribers')) {
            $.say('.subscribers');
            $.log.event(sender + ' enabled subscriber only mode');
        }

        /**
         * @commandpath subscribersoff - Disables subscription only chat mode - Moderator
         */
        if (command.equalsIgnoreCase('subscribersoff')) {
            $.say('.subscribersoff');
            $.log.event(sender + ' disabled subscriber only mode');
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/subscribehandler.js')) {
            $.registerChatCommand('./handlers/subscribehandler.js', 'subwelcometoggle', 2);            
            $.registerChatCommand('./handlers/subscribehandler.js', 'resubwelcometoggle', 2);
            $.registerChatCommand('./handlers/subscribehandler.js', 'subscribereward', 2);
            $.registerChatCommand('./handlers/subscribehandler.js', 'submessage', 2);
            $.registerChatCommand('./handlers/subscribehandler.js', 'resubmessage', 2);
            $.registerChatCommand('./handlers/subscribehandler.js', 'subscribers', 2);
            $.registerChatCommand('./handlers/subscribehandler.js', 'subscribersoff', 2);
            $.registerChatCommand('./handlers/subscribehandler.js', 'subscribepanelupdate', 1);
            $.registerChatCommand('./handlers/subscribehandler.js', 'getnewsubs', 1);
            $.registerChatCommand('./handlers/subscribehandler.js', 'notifytoggle', 1);
            announce = true;
        }
    });
})();
