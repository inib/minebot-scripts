/**
 * brawl.js
 *
 * Starts a brawl in the chat, selects a random winner and awards points.
 * Winners are tracked and users can show the top10 brawlers.
 */

(function() {

	var brawlMinCount = 5;
	var brawlTime = 120 * 1000;
	var brawlPayout = 10;
	var brawlActive = false;
	var brawlCooldown = 900 * 1000;
	var brawlLastBrawl = 0;
	var brawl_table = [];

    /**
     * @function compareBrawlers
     * @param {string, number} username, brawlwins
     * @param {string, number} username, brawlwins
	 * @returns {number} negative, zero, positive
     */
	function compareBrawlers(a, b) {
		if (a.wins > b.wins) {
			return -1;
		}
		if (b.wins > a.wins) {
			return 1;
		}
		return 0;
	}

	 /** 
     * @function hasKey
     * @param {Array} list
     * @param {*} value
     * @param {Number} [subIndex]
     * @returns {boolean}
     */
    function hasKey(list, value, subIndex) {
        var i;

        if (subIndex > -1) {
            for (i in list) {
                if (list[i][subIndex].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        } else {
            for (i in list) {
                if (list[i].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        }
        return false;
    };

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
		var i = 0;

		 /**
         * @commandpath brawl - Start a brawl. Stream has to run, cooldown 15 min - Moderator
         */
		if (command.equalsIgnoreCase('brawl')) {

			if (args.length == 0) {

				if (!$.isModv3(sender, event.getTags()))
				return;

				if (!$.bot.isModuleEnabled('./systems/pointSystem.js')) {
					if (!$.isModv3(sender, event.getTags()))
						return;
					else {
						$.say($.whisperPrefix(sender) + $.lang.get('brawl.error.points'));
						return;
					}
				}

				if (!$.isOnline($.channelName)) {
					if (!$.isAdmin(sender, event.getTags())) {
						$.say($.whisperPrefix(sender) + $.lang.get('brawl.error.offline'));
						return;
					}
				}

				if (brawlActive) {
					$.say($.whisperPrefix(sender) + $.lang.get('brawl.error.active'));
					return;
				}

				if (currentTime < (brawlLastBrawl + brawlCooldown)) {
					$.say($.whisperPrefix(sender) + $.lang.get('brawl.error.cooldown'));
					return;
				}

				$.logEvent("brawl.js", 82, "Brawl started by: " + username);

				brawl_table = [];				
				brawlLastBrawl = $.systemTime();
				brawlActive = true;
				brawl_table.push(username);
				$.say($.lang.get('brawl.start'));

				setTimeout(function() {

					if (!brawlActive)
						return;
	
					var final_brawlers = [];
					var win = brawl_table.length * brawlPayout;
	
					brawlActive = false;
	
					var brawlers = "";
					for (var i = 0; i < brawl_table.length; i++) {
						brawlers += " "	+ brawl_table[i];
					}
		
					if (brawl_table.length < brawlMinCount) {
						$.say($.lang.get('brawl.end.fail'));
						$.logEvent("brawl.js", 107, "Brawl canceled, not enough brawlers");
						return;
					}
	
					var brawltimer = 15;
	
					if (brawl_table.length > 14) {
						brawltimer = 30 * 1000;
						while (final_brawlers.length < 3)
						{
							var finalist = brawl_table[Math.floor(Math.random() * brawl_table.length)];
							if (!hasKey(final_brawlers, finalist)) {
								final_brawlers.push(finalist);
							}
						}
	
						for (i = 0; i < final_brawlers.length; i++) {
							$.inidb.incr('points', final_brawlers[i].toLowerCase(), 25);
						}
						$.say($.lang.get('brawl.end.top3', final_brawlers.join(", "), $.getPointsString(25)));						
						brawl_table = final_brawlers;
					}
	
					setTimeout(function() {
	
						var numb = Math.floor(Math.random() * (brawl_table.length));
						var winner = brawl_table[numb];

						$.say($.lang.get('brawl.end.winner', $.resolveRank(winner), $.getPointsString(win)));

						$.inidb.incr('points', winner.toLowerCase(), win);
						$.inidb.incr('brawl', winner.toLowerCase(), 1);

						$.logEvent("brawl.js", 140, "Brawl won by " + winner + ". Reward: "  + $.getPointsString(win));

					}, (brawltimer));
	
				}, brawlTime);

			}

			/**
             * @commandpath brawl top10 - Shows top10 brawlers - Viewer
             */
			if (args.length >= 1) {

				if (args[0] == "top10") {

					var top10keys = $.inidb.GetKeyList("brawl", "");
					var top10items = [];
					for (i = 0; i < top10keys.length; i++) {
						top10items[i] = { user:top10keys[i], wins: parseInt($.inidb.get('brawl', top10keys[i])) };
					}

					top10items.sort(compareBrawlers);

					var j = 1;
					var top10string = "Top 10 Brawler:";
					var k = 10;
					
					if (k > top10items.length) { 
						k = top10items.length;
					 }
					 
					for (i = 0; i < k; i++) {
						top10string += " " + j + ". " + top10items[i].user + " (" + top10items[i].wins + ")";
						if (i + 1 >= k) {
							break;
						}
						if (top10items[i].wins > top10items[i+1].wins) {
							j++;
						}
					}
					$.say(top10string);
					return;
				}
			}
		}

		/**
         * @commandpath pileon - Participate in brawl - Viewer
         */

		if (command.equalsIgnoreCase('pileon')) {
			if (!brawlActive)
				return;

			$.logEvent("brawl.js", 190, username + " piled on.");

			if (!hasKey(brawl_table, username)) {

				brawl_table.push(username);

				var brawlers = "";
				for (i = 0; i < brawl_table.length; i++) {
					brawlers += " " + brawl_table[i];
				}
			}

			$.logEvent("brawl.js", 202, "Brawlers:  " + brawl_table.join(", "));
		}
	});

    /**
     * @event initReady
     */
	$.bind('initReady', function() {
	    if ($.bot.isModuleEnabled('./games/brawl.js')) {            
            $.registerChatCommand('./games/brawl.js', 'brawl', 2);
            $.registerChatCommand('./games/brawl.js', 'pileon', 7);
            $.registerChatSubcommand('brawl', 'top10', 7);
        }
    });

})();