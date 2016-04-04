(function() {

    var YTAPIKey = "AIzaSyCGGEzMA38-SyvpLWvV0Q5-otLL6LQdPeo"; //needs to be checked and added
    var yturl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&"
    var defaultList = "UUcmrbEm4vIwkCDXMG1zx3hQ";
    var playlistETag = [];

    function getAPIValue(url) {
        var HttpResponse = Packages.com.gmt2001.HttpResponse;
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var ETagHeader = new HashMap();
        if (playlistETag[0] != "") {
            ETagHeader.put("If-None-Match", playlistETag[0]);
        }
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", ETagHeader);
        return responseData.content;
    };

    function getPlaylistItem(playlist) {
        var buildURL = "";
        var playlistObj;
        var JSONObj;
        var vidTitle = "";
        var vidID = "";
        var outputString;

        if (YTAPIKey != "") {
            buildURL = yturl + "playlistId=" + playlist + "&key=" + YTAPIKey;
            consoleLn(buildURL);
            playlistObj = getAPIValue(buildURL);
            consoleLn(playlistObj); 
            if (playlistObj != "") {
                JSONObj = JSON.parse(playlistObj);
                vidTitle = JSONObj.items[0].snippet.title;
                if (vidTitle.length >= 25) {
                    vidTitle = vidTitle.substr(0, 22) + "...";
                }                
                vidID = JSONObj.items[0].snippet.resourceId.videoId;
                outputString = "Neues Video online: " + vidTitle + " - http://youtu.be/" + vidID;
                playlistETag[0] = JSONObj.etag;
                playlistETag[1] = outputString;
            }
            else {
                outputString = playlistETag[1];
            }            
            return outputString;
        }
    };

    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            argString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0];

        if (command.equalsIgnoreCase('showlatestvideo')) {
            var video = "";
            video = getPlaylistItem(defaultList);
            $.say(video);
        }
    });

    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/youtubeHandler.js')) {
            $.registerChatCommand('./handlers/youtubeHandler.js', 'showlatestvideo', 1);
        }
    });

})();