/**
 * subhypeCommand.js
 *
 * Spams random subhype messages 
 */

(function() {

	var hypeArray = ["PogChamp martinTinyfin S U B H Y P E martinTinyfin PogChamp", "SwiftRage SUB martinTinyfin HYPE SwiftRage", "【ツ】 SUB martinTinyfin SUB martinTinyfin SUB 【ツ】", 
				 "✿◕ ‿ ◕✿ SUBHYPE ❀ martinTinyfin ❀ SUBHYPE ❁◕ ‿ ◕❁ ", "twitchRaid Kreygasm martinTinyfin SUB bleedPurple twitchRaid martinTinyfin twitchRaid"];

	 /**
     * @event command
     */     
	$.bind('command', function(event) {

		var command = event.getCommand();

		/**
         * @commandpath subhype - subhype message
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