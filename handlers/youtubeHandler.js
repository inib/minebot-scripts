/**
 * youtubeHandler.js Youtube Hanlder
 *
 * surveillances youtube playlists and announces new videos in chat
 *
 */
(function() {

    var YTAPIKey = ($.inidb.exists('settings', 'ytapi') ? $.inidb.get('settings', 'ytapi') : "");
    var yturl = "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=1&"
    var playlists;
    var eTags = [];
    var updateTime = 10;

    reloadCache();

    /**
    * @function reloadCache
    */
    function reloadCache() {
        playlists = [];
        eTags = [];
        playlists = $.inidb.GetKeyList('youtubeHandler', '');
        for (var i in playlists) {
            eTags[playlists[i]] = "";
        }
    }

    /**
     * @function getAPIValue
     * @param {string} playlist
     * @param {string} eTag
     * @return {string}
     */
    function getAPIValue(playlist, eTag) {
        var HttpResponse = Packages.com.gmt2001.HttpResponse;
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var ETagHeader = new HashMap();
        var buildURL = "";

        buildURL = yturl + "channelId=" + playlist + "&key=" + YTAPIKey;

        if (eTag && eTag != "") {
            ETagHeader.put("If-None-Match", eTag);
        }

        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, buildURL, "", ETagHeader);
        return responseData.content;
    };

    /**
    * @function getPlaylistItem
    * @param {string} playlist
    * @return {string}
    */
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
        else {
            $.logEvent('./handlers/youtubeHandler.js', 58, 'No youtube API key specified.');
        }
        return "";
    };

    /**
    * @function getPlaylistItem
    * @param {JSONObject} jsonObj
    * @return {string}
    */
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

    /**
    * @function runYTAnnounce
    */
    function runYTAnnounce() {
        var outputString = "";
        for (var item in playlists) {
            outputString = getPlaylistItem(playlists[item]);
            if (outputString != "" && outputString != $.inidb.get('youtubeHandler', playlists[item])) {
                $.say(outputString);
                $.logEvent('./handlers/youtubeHandler.js', 83, 'Announced new video for playlist: ' + playlists[item]);
                $.inidb.set('youtubeHandler', playlists[item], outputString);
            }
        }
        return;
    };

    /**
    * @event command
    */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        /**
        * @command ytplaylists
        */
        if (command.equalsIgnoreCase('ytplaylist')) {

            if (!subAction) {

                if (!action) {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.usage'));
                    return;
                }

                /**
                * @subCcommand ytplaylists show
                */
                if (action.equalsIgnoreCase('show')) {
                    var plString = "Playlists: ";
                    plString += playlists.join(' ; ');
                    $.say($.whisperPrefix(sender) + plString);
                    return;
                }
                $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.usage'));
                return;
            }

            /**
            * @subCcommand ytplaylists add
            */
            if (action.equalsIgnoreCase('add')) {
                if ($.inidb.exists('youtubeHandler', subAction)) {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.error.exists'));
                    return;
                }
                else {
                    $.inidb.set('youtubeHandler', subAction, '');
                    reloadCache();
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.add'));
                    $.logEvent('./handlers/youtubeHandler.js', 126, 'Added playlist: ' + subAction);
                    return;
                }
            }

            /**
            * @subCcommand ytplaylists del
            */
            if (action.equalsIgnoreCase('del')) {
                if ($.inidb.exists('youtubeHandler', subAction)) {
                    $.inidb.del('youtubeHandler', subAction);
                    reloadCache();
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.del'));
                    $.logEvent('./handlers/youtubeHandler.js', 136, 'Deleted playlist: ' + subAction);
                    return;
                }
                else {
                    $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.error.404'));
                    return;
                }
            }

            /**
            * @subCcommand ytplaylists api
            */
            if (action.equalsIgnoreCase('api')) {
                $.inidb.set('settings', 'ytapi', subAction);
                YTAPIKey = subAction;
                $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.api'));
                $.logEvent('./handlers/youtubeHandler.js', 149, 'Updated youtube api key.');
                return;
            }

            $.say($.whisperPrefix(sender) + $.lang.get('youtubehandler.usage'));
            return;
        }
    });

    /**
    * @event initReady
    */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/youtubeHandler.js')) {
            $.registerChatCommand('./handlers/youtubeHandler.js', 'ytplaylist', 1);
        }
    });

    /**
    * @timer start the announcement timer
    */
    setInterval(function() {
        if (!$.isOnline($.channelName)) {
            runYTAnnounce();
        }
    }, 60 * 1000 * updateTime);

})();
