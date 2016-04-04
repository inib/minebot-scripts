(function() {

    var YTAPIKey = "AIzaSyCGGEzMA38-SyvpLWvV0Q5-otLL6LQdPeo"; //needs to be checked and added
    var yturl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&"
    var playlists = [];

    if ($.inidb.exists('youtubeHandler', '')) {
        keys = $.inidb.GetKeyList('youtubeHandler', '');
        for (var item in keys) {
            playlists.push(item);
        }
    }

    function getAPIValue(playlist, eTag) {
        var HttpResponse = Packages.com.gmt2001.HttpResponse;
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var ETagHeader = new HashMap();
        var buildURL = "";

        buildURL = yturl + "playlistId=" + playlist + "&key=" + YTAPIKey;

        if (eTag && eTag != "") {
            ETagHeader.put("If-None-Match", eTag);
        }

        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", ETagHeader);
        return responseData.content;
    };

    function getPlaylistItem(playlist) {
        var playlistObj;
        var JSONObj;
        var outputString = "";
        var eTag = "";

        if (YTAPIKey != "") {
            consoleLn(buildURL);
            eTag = $.inidb.get('youtubeHandler', playlist);
            playlistObj = getAPIValue(playlist, eTag);

            consoleLn(playlistObj);

            if (playlistObj != "") {
                JSONObj = JSON.parse(playlistObj);
                outputString = buildOutputString(JSONObj);
                $.inidb.set('youtubeHandler', playlist, JSONObj.eTag);
            }

            return outputString;
        }
    };

    function buildOutputString(jsonObj) {
        var vidTitle = "";
        var vidID = "";
        var outputString = "";

        vidTitle = jsonObj.items[0].snippet.title;

        if (vidTitle.length >= 50) {
            vidTitle = vidTitle.substr(0, 47) + "...";
        }

        vidID = jsonObj.items[0].snippet.resourceId.videoId;
        outputString = "Neues Video online: " + vidTitle + " - http://youtu.be/" + vidID;

        return outputString;
    }

    function runYTAnnounce() {
        var outputString = "";
        for (var i = 0; i < playlists.length; i++) {
            outputString = getPlaylistItem(playlists[i]);
            if (outputString != "") {
                $.say(outputString);
            }
        }
    };

    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0];
        subAction = args[1];

        if (command.equalsIgnoreCase('ytplaylist')) {

            if (!subAction) {

                if (!action) {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.usage'));
                    return;
                }

                if (action.equalsIgnoreCase('show')) {
                    var plString = "Playlists: ";
                    plString += playlists.join(' ; ');
                    $.say($.whisperPrefix(sender) + plString);
                    return;
                }
                $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.usage'));
                return;
            }

            if (action.equalsIgnoreCase('add')) {
                if ($.inidb.exists('youtubeHandler', subAction)) {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.error.exists'));
                    return;
                }
                else {
                    $.inidb.set('youtubeHandler', subAction, '');
                    playlists.push(subAction);
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.add'));
                }
            }

            if (action.equalsIgnoreCase('del')) {
                if ($.inidb.exists('youtubeHandler', subAction)) {
                    $.inidb.del('youtubeHandler, subAction');
                    keys = $.inidb.GetKeyList('youtubeHandler', '');
                    playlists = [];
                    for (var item in keys) {
                        playlists.push(item);
                    }
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.del'));
                    return;
                }
                else {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.error.404'));
                    return;
                }
            }
            
            else {
                $.say($.whisperPrefix(sender) + $.lang.get('youtubeHandler.usage'));
                return;
            }
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/youtubeHandler.js')) {
            $.registerChatCommand('./handlers/youtubeHandler.js', 'ytplaylist', 1);
        }
    });

    setInterval(function() {
        if (!$.isOnline($.channelName)) {
            runYTAnnounce();
        }
    }, 60 * 60 * 1000 * 5);

})();