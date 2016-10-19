/**
 * subhypeCommand.js
 *
 * Spams random subhype messages 
 */

(function() {

	var hypeArray = ["PogChamp martinTinyfin S U B H Y P E martinTinyfin PogChamp",
					 "SwiftRage SUB martinTinyfin martinDagon HYPE SwiftRage",
					 "【ツ】 SUB martinTinyfin martinDagon SUB martinDagon martinTinyfin SUB 【ツ】",
					 "✿◕ ‿ ◕✿ martinDagon SUBHYPE ❀ martinLadies ❀ SUBHYPE martinDagon ❁◕ ‿ ◕❁ ",
					 "twitchRaid Kreygasm martinDagon martinLadies SUB bleedPurple twitchRaid martinDagon martinLadies twitchRaid"];

	 /**
     * @event command
     */     
	$.bind('command', function(event) {

		var command = event.getCommand();

		/**
         * @commandpath subhype - Puts a subhype message in the chat - Viewer
         */
		if (command.equalsIgnoreCase("subhype")) {
			var rand = Math.floor(Math.random() * 5);
			var hype = hypeArray[rand];
			$.say(hype);
		}
	});

	/**
     * @event initReady
     */
	$.bind('initReady', function() {
	    if ($.bot.isModuleEnabled('./commands/subhypeCommand.js')) {            
            $.registerChatCommand('./commands/subhypeCommand.js', 'subhype', 7);
        }
    });

})();