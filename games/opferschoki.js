/**
 *  Waste your points for the gods
 */

(function() {

    var schokdown = (5 * 1000);
    var lastOpfer = "";
    var lastOpferTime = 0;
    var lastDoom = 0;
    var lastSummon = 0;
        
    if (!$.inidb.exists('opferschoki', 'opferCount')) {        
        $.inidb.set('opferschoki', 'opferCount', 1);
    }
    var opferC = parseInt($.inidb.get('opferschoki', 'opferCount'));
    
    if (!$.inidb.exists('opferschoki', 'opferSchoki')) {        
        $.inidb.set('opferschoki', 'opferSchoki', 1);
    }
    var opferS = parseInt($.inidb.get('opferschoki', 'opferSchoki'));
    
    function calcSacrifice(user) {
        var sacSchoki = 0;
        var schoki = $.getUserPoints(user);
        
        if (schoki > 0) {
            sacSchoki = parseInt(schoki * 0.05);
            if (sacSchoki > 66) {
                sacSchoki = 66;
            }
        }

        return sacSchoki;
    }

    function startSacrifice(user) {
        var trigger = 0;
        var sac = 0;

        opferC = parseInt($.inidb.get('opfer', 'opferCount'));
        opferS = parseInt($.inidb.get('opfer', 'opferSchoki'));
        sac = calcSacrifice(user);

        if (sac > 0) {            
            $.inidb.incr('opferschoki', 'opferCount', 1);
            opferC++;
            $.inidb.incr('opferschoki', 'opferSchoki', sac);
            opferS += sac;
            $.inidb.decr('points', user, sac);
            $.log('pointSystem', 'operschoki.js : ' + user + 'sacs ' + sac);
            $.say(user + " opfert ein hart verdientes Schoki den Twitchgöttern. Es wurden schon " + opferS + " Schoki geopfert.");
            $.logEvent('./games/opferschoki.js', 45, user + 'sacs. ' + sac + ' . ' + opferS + 'saced. times: ' + opferC);
            trigger = checkTrigger(opferC);
        }

        if (trigger == 1) {
            doomed(user);
            return;
        }

        if (trigger == 666) {
            summon(user);
            return;
        }

        return;
    }

    function checkTrigger(opfer) {
        if (((opfer - 6) % 33) == 0) {
            if (((opfer - 6) % 132) == 0) {
                return 666;
            }
            else {
                return 1;
            }
        }
        return 0;
    }

    function doomed(user) {
        
        $.logEvent('./games/opferschoki.js', 74, user + 'dooms chat. ' + opferS + 'saced. times: ' + opferC);
        
        setTimeout(function() {
            var numb = Math.floor(Math.random() * 4);
            switch (numb) {
                case 0:
                    $.say("t_ WutFace " + user + " hat etwas in der Tiefe geweckt... " + "t_ WutFace ");
                    break;
                case 1:
                    $.say("t_ WutFace " + "...aus den Schatten erhebt sich eine Gestalt... " + "t_ WutFace ");
                    break;
                case 2:
                    $.say("t_ WutFace " + "...ihr Narren wisst nicht was ihr getan habt... " + "t_ WutFace ");
                    break;
                case 3:
                    $.say("t_ WutFace " + "...die Schatten kommen immer Näher... " + "t_ WutFace ");
                    break;
                default:
                    $.say("t_ WutFace " + user + " hat etwas in der Tiefe geweckt... " + "t_ WutFace ");
            }
        }, 5 * 1000);
    }

    function summon(user) {
        $.logEvent('./games/opferschoki.js', 74, user + 'summons doom. ' + opferS + 'saced. times: ' + opferC);
        
        var opferList = [];

        if ($.getUserPoints(user) > 50) {
            opferList.push(user);
            $.inidb.decr('points', user, 50);
        };

        var fehler = 0;

        for (var i = 0; i < 5; i++) {
         
            var newOpfer = $.username.resolve($.randElement($.users)[0]);

            if ($.getUserPoints(newOpfer) > 500 || !opferList.contains(newOpfer)) {
                $.inidb.decr('points', newOpfer.toLowerCase(), 50);
                $.log('pointSystem', 'operschoki.js : ' + user + 'gets 50 robbed.');
                opferList.push(newOpfer);
            }
            else {
                fehler++;
                i--;
            }
            if (fehler >= 25) { break; };
        }        

        setTimeout(function() {
            $.say(user + " hat S C H O K T H U L U beschworen - FLIEHT IHR NARREN!" + " SwiftRage");
        }, 5 * 1000);
        
        setTimeout(function() {
            $.say("S C H O K T H U L U schleicht durch den Chat und klaut " + opferList.join(", ") + "jew. 50 Schoki - WutFace");
        }, 15 * 1000);
        
        setTimeout(function() {
            $.say("S C H O K T H U L U zieht sich in die Schatten zurück - WutFace");
        }, 20 * 1000);
    }

    /**
    * @event command
    */
    $.bind('command', function(event) {

        var sender = event.getSender();
        var username = $.username.resolve(sender, event.getTags());
        var command = event.getCommand();
        var currentTime = $.systemTime();
        var argsString = event.getArguments().trim();
        var args = event.getArgs();

        if (command.equalsIgnoreCase("opferschoki")) {

            if (currentTime < (lastOpferTime + schokdown)) {
                return;
            }

            if (lastOpfer == sender) {
                return;
            }
            
            if (args[0] == 'summon') {
                summon(sender);
                return;
            }
            
            if (args[0] == 'doom') {
                doomed(sender);
                return;
            }
            
            lastOpfer = sender;
            lastOpferTime = currentTime;
            startSacrifice(sender);
            return;
        }
    });

    /**
    * @event initReady
    */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./games/opferschoki.js')) {
            $.registerChatCommand('./games/opferschoki.js', 'opferschoki', 7);
            $.registerChatSubcommand('opferschoki', 'summon', 1);
            $.registerChatSubcommand('opferschoki', 'doom', 1);
        }
    });

})();