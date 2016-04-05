(function() {

    var YTAPIKey = ($.inidb.exists('settings', 'ytapi') ? $.inidb.get('settings', 'ytapi') : "");
    var yturl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&"
    var playlists;
    var eTags = [];
    var updateTime = 10;
    
    reloadCache();
    
    function reloadCache() {
        playlists = [];
        eTags = [];
        playlists = $.inidb.GetKeyList('youtubeHandler', '');
        for (var i in playlists) {
            eTags[playlists[i]] = "";
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

        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, buildURL, "", ETagHeader);
        return responseData.content;
    };

    function getPlaylistItem(playlist) {
        var playlistObj;
        var JSONObj;
        var outputString = "";
        var eTag = "";

        if (YTAPIKey != "") {
            eTag = eTags[playlist];
            playlistObj = getAPIValue(playlist, eTag);
            
            if (playlistObj != "") {
                JSONObj = JSON.parse(playlistObj);
                outputString = buildOutputString(JSONObj);
                eTags[playlist] = JSONObj.etag;                
                return outputString;
            }

            return "";
        }
        return "";
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
        for (var item in playlists) {  
            consoleLn(playlists[item]);          
            outputString = getPlaylistItem(playlists[item]);
            consoleLn(outputString);            
            if (outputString != "" && outputString != $.inidb.get('youtubeHandler', playlists[item])) {
                $.say(outputString);
                $.inidb.set('youtubeHandler', playlists[item], outputString);
            }
        }
        return;
    };

    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('ytplaylist')) {

            if (!subAction) {

                if (!action) {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.usage'));
                    return;
                }

                if (action.equalsIgnoreCase('show')) {
                    var plString = "Playlists: ";
                    plString += playlists.join(' ; ');
                    $.say($.whisperPrefix(sender) + plString);
                    return;
                }
                $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.usage'));
                return;
            }

            if (action.equalsIgnoreCase('add')) {
                if ($.inidb.exists('youtubeHandler', subAction)) {                    
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.error.exists'));
                    return;
                }
                else {
                    $.inidb.set('youtubeHandler', subAction, '');
                    reloadCache();
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.add'));
                    return;
                }
            }

            if (action.equalsIgnoreCase('del')) {
                if ($.inidb.exists('youtubeHandler', subAction)) {
                    $.inidb.del('youtubeHandler', subAction);
                    reloadCache();
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.del'));
                    return;
                }
                else {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.error.404'));
                    return;
                }
            }
            
            if (action.equalsIgnoreCase('api')) {
                $.inidb.set('settings', 'ytapi', subAction);
                YTAPIKey = subAction;
                $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.api'));
                return;
            }

            $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.usage'));
            return;
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
    }, 60 * 1000 * updateTime);

})();