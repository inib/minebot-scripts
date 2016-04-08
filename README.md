# M1nebot Befehlsreferenz 
(v0.2, 2016/03/25)

## Aktuelles

* (2016/03/25) Update auf neue Version 2.0.6 


## Aktuelle Bot-Rechteübersicht

Broadcaster (Adminrechte): *germandota*  
Adminitrator: *alpinespielt, mineace*  
Moderatoren: *Incardia13, Hopskukkelitar*

<!-- MarkdownTOC -->

- [Eigene Befehle](#eigene-befehle)
- [Chatmoderation](#chatmoderation)
- [Zeitgesteuerte Mitteilungen](#zeitgesteuerte-mitteilungen)
- [Schokisystem](#schokisystem)
- [Wettsystem](#wettsystem)
- [Umfragen](#umfragen)
- [Brawls](#brawls)
- [Allgemeine Hinweise](#allgemeine-hinweise)
- [Anhang](#anhang)

<!-- /MarkdownTOC -->


<a name="eigene-befehle"></a>
## Eigene Befehle
./commands/customCommands.js

* Hinzufügen:  
	!addcom \<Befehl\> \<Text\> *Moderatoren*

* Ändern:  
	!editcom \<Befehl\> \<Text\> *Moderatoren*
    
* Löschen:  
	!delcom \<Befehl\> *Moderatoren*

* Rechte für Befehl ändern (Standardrecht: Viewer (jeder))  
	!permcom \<Befehl\> \<Rechtegruppe\> *Administratoren*

[Rechtegruppen: Viewer (7), Regular (6), Subscriber (3), Moderator (2), Administrator (1), Broadcaster (0)]

Wildcards für \<Text\>:
(sender) = derjenige der den Befehl ausgeführt hat
(@sender) = so. mit @ vor Name
(touser) = eine andere Person (wird durch sender ersetzt, falls nicht angegeben)
(random) = eine zufällige Person im Kanal
(uptime) = Stream Uptime, falls offline: "Stream ist offline".
(game) = Das aktuell auf twitch eingestellte Spiel.
(status) = Streamtitel
(count) = Wie oft dieser Befehl bereits verwendet wurde
(pointname) = Schoki


Beispiel:  
	!addcom slap (sender) haut (touser) eins über die Rübe.  
	Hans: !slap Peter Stahlrohr  
	Bot: Hans haut Peter eins über die Rübe.
    
### Aliase

* Hinzufügen:  
	!aliascom \<Alias\> \<Befehl\> *Moderatoren*
    
* Löschen:  
	!delalias \<Alias\> *Moderatoren*
    
Beispiel:  
	!addcom kappa Kappa 123
	!aliascom keepo kappa
    !keepo 
	Bot: Kappa 123



<a name="chatmoderation"></a>
## Chatmoderation

**Vorsicht:** Der Bot beherrscht einige, mächtige Spambekämpfungsfunktionen, falsch konfiguriert hat er das Potential in Sekunden den Chat leerzuräumen.

* Zeigt Hilfe zu allen Moderationsfunktionen
!moderation 

### QuickMod Befehle

Diese Funktionen erlauben es die Moderation via Bot fernzusteuern, dh. auch Botadmins, die nicht Channel-Mod Status haben, haben hier Zugriff. Deshalb sind die Timeouts begrenzt und die Ban-Funktion deaktiviert.

* Nachrichten eines Users aus dem Chat Löschen [entspr. einem timeout für 1 sek.]
!clr \<User\>
* Löscht alle Chatnachrichten eines Users und bannt ihn **temporär**. (Standardwert: 1 Minute)
!to \<User\> [\<Zeit in Sekunden\>]
* Timeout/Ban aufheben
!unban \<User\>

### Anti-Link Bekämpfung (derzeit aktiv)

Posts eines User mit einem Link/etwas Linkähnliches werden aus dem Chat entfernt. (Timeout 1 Sekunde)

* Linkerkennung (de-)aktivieren  
!moderation links \<on/off\>
* Link zur Whitelist hinzufügen  
!whitelist add \<Link\> [nur die Domain verwenden: zB. *google.de*]
* Link von der Whitelist entfernen  
!whitelist remove \<Link\>
* Links anzeigen
!whitelist show 
* Nachricht des Bots, wenn ein Link gepostet wird
!moderation linksmessage
* Einem User temporär erlauben einen Link zu posten (300 Sekunden)  
!permit \<User\>

### Allgemeine Moderation

Diese Funktionen unterscheiden sich nicht von den herkömmlichen Funktionen eines Chat-Moderators, können allerdings auch von einem Bot-Moderator ausgeführt werden.

* Chatnachrichhten von einem User löschen (Timeout 1 Sekunde)  
!purge \<User\>
* Einen User **permanent!** bannen  
!ban \<User\>
* Löscht alle Chatnachrichten eines Users und bannt ihn **temporär**. (Standardwert: 10 Minuten)
!timeout \<User\> [\<Zeit in Sekunden\>]

### Zeichen/Spamerkennung

Neben der Linkerkennung, können auch Worte, Sätze, Sonderzeichen, Emotes automatisch moderiert werden.
Für kleine Kanäle unter 1.000 User aber kaum sinnvoll.

Details siehe !moderation


### Ausnahmeregelungen

Benutzergruppen können von der Botmoderation ausgenommen werden.
[Derzeit für Subscriber aktiv.]

* Subscribergruppe ausnehmen  
!moderation subscribers  \<true/false\>

<a name="schokisystem"></a>
## Schokisystem

Derzeit bekomt man nur während eines Streams **8** Schoki pro **10** Minuten gutgeschrieben.  
Subscriber, Moderatoren, Administratoren erhalten **16** Schoki pro **10** Minuten.

### Befehle

* Abfrage des eigenen Kontos  
!schoki
* Abfrage anderer Konten  
!schoki \<Benutzer\>
* Schoki Top10 abfragen  
!top5

<a name="wettsystem"></a>
## Wettsystem

Alle Einsätze werden in einem *Pot* gespeichert. Alle Teilnehmer, die richtig getippt haben, bekommen abhängig von ihrem Einsatz ihren Anteil vom Pot ausgezahlt. Es gibt derzeit keine Bonusschoki für einen richtigen Tipp.  

Bei der Auflösung der Wette wird die Auszahlungsquote angezeigt.

#### Beispiel

> Peter wettet **50** auf **1**, Paul wettet **50** auf **1**,  Hans wettet **50** auf **2**  
> Gewinnt **1** bekommen Peter und Paul jeweils **75** ausgezahlt (Quote 1.5)  
> Gewinnt **2** bekommt Hans **150** ausgezahlt (Quote 3)  


### Modfunktionen

* Wette starten  
!bet start \<Option1\> \<Option2\> \<Option3\> ...
* Vorgefertigte Wetten starten
!bet dota
!bet arena
* Wettannahme schliessen
!bet close
* Wette auflösen  
!bet end \<Option\>
* Wette jederzeit abbrechen  
!bet abort

### Plebfunktionen

* Wettfunktionen anzeigen  
!bet

* Wette abgeben  
!bet \<Einsatz\> \<Option\>

* Status/Letzte Wette anzeigen [wird überarbeitet]  
!bet results

<a name="brawls"></a>
## Brawls

Aus allen Brawllteilnehmern wird ein Sieger per Zufall ermittelt.  
Der Sieger bekommt **10** Schoki pro Teilnehmer.

Brawls können nur von Moderatoren *während* eines Streams gestartet werden.  
Brawls haben einen *Cooldown* von 15 Minuten.

### Befehle

* Einen Brawl starten  
!brawl
* Mitbrawlen  
!pileon
* Top10 Brawlsieger anzeigen
!brawl top10

<a name="allgemeine-hinweise"></a>
## Allgemeine Hinweise

Die meisten Funktionen werden mit einer Ausgabe/einem Whisper bestätigt.

<a name="anhang"></a>
## Anhang

### Liste benutzerdefinierter Befehle

(Stand 2016/03/22)

|Befehl | Inhalt |
|:---|:---|
|shop|	Mit Schoki könnt ihr in Martins Online-Shop einkaufen: http://tinyurl.com/b3pnl5j |
|hs|	Martins Spiele (10.03.): Arena: Warlock 2:3, Warrior 1:3 | Tavern Brawl | Arena: Druid 5:1 |
|hstool|	Hier die von Martin genutzte (englischsprachige) Tierliste: http://www.heartharena.com/tierlist sowie das Arena-Tool auf: www.heartharena.com (Registrierung notwendig). Weiterhin nutzt Martin einen Deck-Tracker (Karten-Liste an der rechten Seite). Den Link dazu findet ihr hier: | http://bit.ly/1vQhPkl
|hsarena|	Martins Heartharena-Link: http://bit.ly/1FJJMQC |
|ts|	Ich hab gehöhrt hier gehts ab https://discord.gg/0WvMm8tYOgpgYNao |
|trade|	Martins Steam Trading Link: http://tiny.cc/MartinTrade |
|mopedtobias|	Der Name MopedTobias (wie Martin sich in Steam nennt) stammt aus dem Helge Schneider Sketch "Deutschland sucht den Moped Tobias". (Martin ist großer Helge Schneider Fan.) |
|commgames|	Custom Community Games: Um dem Spiel zu betreten den Modus < < 10 vs 10 >> runter laden und bei den Privaten Lobbies nach germandota suchen. |
|lebingo|	☑ “Das Deck von dem Typen is ne Frechheit!” ☑ “Mit meinem Deck kann ich das nicht gewinnen” ☑ "Natürlich hat er GENAU die 2 Karten" ☑ “Das war GENAU die Karte, die er gebraucht hat” ☑ "AUTSCH" ☑ “Da kann man nix machen” ☑ “Chat ist Schuld” ☑ "Es war klar das die Bomben SO treffen!" |
|keks|	Da hat wohl jemand zu viel After-Eight genascht..... Wenn Martin aber auch immer so spät streamt! Nachdem M1neBot nun schon mehrfach seine gut versteckten Vorräte geleert vorfinden musste, reicht er (sender) lieber einige frisch gebackene Schoko-Minz-Plätzchen, damit er mehr von seinen | Süßigkeiten behalten kann.
|spiele|	Martins Dota-Spiele heute (22.03.): 1. Earthshaker (Sieg), 2. Weaver (Niederlage), 3. Orge () |
|met|	Aus dem Weinkeller des Chats (direkt neben dem Keksbunker) holt der M1neBot eine Flasche Honigwein samt Trinkhorn und schenkt (sender) ein, bevor er selbst den Rest der Flasche runterkippt. *hicks* |
|wetten|	Alle Infos zum Wettsystem findet ihr hier: http://i.imgur.com/uEGYlYP.png |
|social|	Martins Social Media-Infos: YouTube-Kanäle: http://bit.ly/MartinSpielt http://bit.ly/MartinHearthstone  http://bit.ly/MartinDota  Facebook: http://www.facebook.com/GTMartinLe |
|autsch|	(sender) hat sich verletzt! Hier ein Pflaster. |
|heute|	Martins Streamplan für heute (22.03.): 20:00 - 00:00 Dota 2 |
|schokinfo|	Alle wichtigen Informationen zur Chatwährung Schoki findet ihr hier: https://i.imgur.com/xds9X5O.png |
|murloc|	martinTinyfin mrglmrglmrgl martinTinyfin https://www.youtube.com/watch?v=uOpdyytB3OY |
|moremurloc|	Do Murlocs ever get tired of making the sam noise over and over again? martinTinyfin Nope! martinTinyfin Mrglmrglmrgl martinTinyfin |
|summonmartin|	ヽ༼ຈل͜ຈ༽ﾉ schokis geopfert, dazu ein tee - mit diesem spruch beschör ich LE ヽ( ͡͡ ° ͜ ʖ ͡ °)⊃━☆ﾟ. * ･ ｡ﾟ |
|njnia|	Jetzt kommt eine Pause! Manche geh'n nach Hause, manche trinken Brause, das ist der Zweck der Pause! Wie schön ist es, eine Wurst zu verzehren und gleichzeitig Martin zuzuhören! OpieOP |
|morgen|	Martins Streamplan für morgen (23.03.): 14:00 - 18:00 Far Cry Primal |
|ladies|	martinLadies Ladies, Martin Le martinLadies |
|fps|	Um sich FPS/Ping/Loss in Dota anzeigen zu lassen: Einstellungen > Optionen > Netzwerk (Rechts): Display Network Information |
|hstutorial|	Martins Hearthstone Tutorialvideo: https://youtu.be/6HkbXaSliFE |
|dot|	Martins Spiele (18.03.): 1. Mid-Alchemist (lose), 2. Ursa (lose), 3. Enigma (win) |
|mmr|	Solo-MMR: 4572  Gruppen-MMR: 4204  Team-MMR: 4348 |
|team|	Das GermanDota-Team: MopedTobias (Martin) - Offlane  rNy (Simon) - Mitte  ByFos (Dominik) - Carry  Xylenol (Simon) - (Lane)Support  Fewa (Fabian) - (Farm)Support  |
|aufstellung|	Martin/Void  rNy/Invoker  Fewa/Shadow Demon  ByFos/Gyrocopter  Xylenol/Lion |
|fucker|	Immer mit der Ruhe (sender). Kein Grund, gleich zu fluchen. SwiftRage |
|joindota|	Martin und sein Team sind in der joinDota-League angemeldet. Infos zum Team findet ihr hier: http://bit.ly/1LNuDTS und zu ihren Spielen in der jDL hier: http://bit.ly/1Z6t5p7 || Das nächste Spiel (das Relegationsspiel, das entscheiden wird, ob das Team in die 3. oder 4. Division | aufsteigen wird) wird am Samstag, 26.03., 14:00 Uhr ausgetragen. Hier der Link zu den Play-Offs: http://bit.ly/1Ml0irk
|mic|	Oh nein! Martin wurde von einem Silence erwischt. Die Flüche, sobald er es raus findet, könnt ihr euch sicher schon vorstellen. PJSalt |
|le|	M-M-M-M-MonsterLE 4Head |
|pc|	Martins Pc: i7 4790k auf 4,75 Ghz übertaktet; 8GB Ram; Nividia 980 GTX. |
|streamplan|	Der aktuelle Streamingplan: http://tiny.cc/MartinStreamplan |
|achmartin|	(sender) schüttelt den Kopf und murmelt fassungslos "Ach Martin" FailFish |
|stream|	Gestreamt wird mit Open Broadcaster in 1080p, 60 FPS und 3,3 Mbit. |
|speak|	Martin spricht für gewöhnlich erst zu Beginn eines Spiels. In den Pausen ruht er seine Stimme aus bzw. isst oder trinkt etwas. Ausserdem wird in den Pausen bei einigen Viewern Werbung geschaltet (Danke dafür :) ) und es wäre ziemlich unpraktisch, wenn Martin etwas erzählt und einige das | nicht mitbekommen würden.
|wowmartin|	War geil? Sogar supergeil, Martin! BloodTrail|
|allard0802|	"Der Name ist Bond. Le Bond." |
|unrigbrawl|	Der Brawl kann leider derzeit nicht repariert werden. DansGame |
|ping|	Martin hat Osteuropa als Suchoption festgelegt, weil die Server für Osteuropa in Österreich stehen. Dort hat man als Bayer einen besseren Ping. Die Server für Westeuropa stehen in Luxemburg. |
|sanjig|	Sanjig und Yasha best item ever |
|fewa|	Jeder hat einen eigenen Chatbefehl ausser mir BibleThump |
|holy|	Holy Moly! :O Ein GodLEike Martin LE! martinTinyfin |
|debug|	Jetzt geht's Kappa |
|tipps|	Tipp-Spiel - Wie viele Wins schafft Martin? (12.03. Mage): 3x 3-5 (wudi, Dustin, Philipp), 1x 6-8 (Samuel), 2x 9-11 (Inca, Coxalsin), 1x 12 (pit) |
|tinyspam|	martinTinyfin martinTinyfin martinTinyfin martinTinyfin martinTinyfin martinTinyfin martinTinyfin |
|120|	http://imgur.com/3jp3nha Kreygasm |
|rangliste|	Die Schoki-Ränge, die man im Chat erreichen kann, sind (in der Reihenfolge von Wenig bis Viel Schoki): "LEtzter" (0 Schoki), "LEiche" (ab 50), "LEergut" (ab 200), "LEvel-Up" (ab 450), "LEichtgewicht" (ab 800), "LEpragnom" (ab 1250), "LEbendiger" (ab 1800), "LEguan" (ab 2450), "LEopard" | (ab 3200), "LEgionär" (ab 4050), "LEutnant" (ab 5000), "LEader" (ab 6050), "LEthal" (ab 7200), "LEgion Commander" (ab 8450) und "LEgende" (ab 9800).
|patch|	Hier gehts zu den Patch-Notes: http://www.dota2.com/balanceofpower Martin hat den Patch ausgiebig analysiert: Sein erstes Video findet ihr hier: https://www.youtube.com/watch?v=N6QErlsMPo8 |
|dotafail|	Martin hat es in Episode 144 von Dotacinema Dota 2 Fails of the week geschafft. https://youtu.be/wQ2w8VDf7-o?t=116 |
|lol|	A LoL and a DotA player have a conversation: the DotA-player says DotA is better, the LoL-player can't deny. Kappa |
|lethal|	FailFish Und schon wieder ein Lethal verpasst! Da weint selbst der martinTinyfin |
|dota_woche|	Martins Dota-Streams für die Woche 7. - 13.3.: MI 9.3. 14:30 - 18:00  FR 11.3. 20:00 - 00-00  SA 12.3. 13:00 - 16:30  SO 13.3. 17:00 - 00:00 (Teamspiele, vllt. jDL Play-Offs) |
|hs_woche|	Martins HS-Streams für die Woche 7. - 13.3.: DO 10.3. 14:00 - 18:00  SA 12.3. 18:00 - 00:00 |
|battlepass|	Der neue Battle Pass - Winter Season 2016 ist raus und Martin erklärt ihn euch (zusammen mit dem Compendium): http://bit.ly/1Snr21H |
|hskraken|	Alles zum neuen "Standard/Wild" Ranked Format: http://tiny.cc/yn0u8x |
|xcomplay|	Livestream verpasst? Kein Problem, alle XCOM2 Folgen findet ihr hier: http://tiny.cc/xwaz8x Und weitere tolle Spieleprojekte auf dem Let's Play Kanal MartinSpielt http://bit.ly/MartinSpielt |
|geschenk|	(sender) schenkt (1) ein/e/n (2), doch bevor der Empfänger es annehmen kann, wird das Geschenk von (random) geklaut! Die Twitch-Polizei ist bereits auf der Suche nach (count) Dieben. |
|sam|	Von Aliens, Schokthulu und Diabetes bedroht schreit (sender) um Hilfe von ganz oben! Commander LE schickt seine beste Kämpferin um die Community zu unterstützen. Mit Mettkit, Schwert und Waffe ausgerüstet bahnt sich Anführerin Sam "Slayer" Frosch den Weg durch die Massen und sorgt wieder | für Ruhe im Chat.
|farcry|	Wer Martins Meinung und erste Eindrücke sehen möchte, oder einfach die ersten Folgen verpasst hat, findet hier das komplette Let's Play https://www.youtube.com/watch?v=LZij7JuEwkA&list=PLrTIPs_k-YKFa1Yo4j-7A_EYAhPBPJPeD Gespielt wird auf der XBOX One, für PC erscheint das Spiel am 01.03.|
|wolfi|	Erzittert Sterbliche, der Meister der Zitate ist wieder da! Keepo |
|schinken|	Ja, auch der M1neBot ist schlagfertig Kappa https://www.youtube.com/watch?v=j5AFVlxYLPU |
|patreon|	Martin hat sich auf Patreon eingerichtet. Wenn ihr Martin bei einem oder mehreren seiner Projekte unterstützen wollt, könnt ihr das gerne tun: https://www.patreon.com/GermanDota https://www.patreon.com/MartinSpielt https://www.patreon.com/GermanHearthstone |
|factorio|	Martin spielt und streamt das Aufbau-Management-Strategie-Spiel Factorio. Nach den Live-Streams werden die Videos als Lets Play auch auf Martins YouTube Kanal Martin spielt hochgeladen. Hier geht es zur Playlist: http://bit.ly/1V4lpVM |
|hopsi|	Endlich gibt es Fotos von unserer Hops ;) hier http://bit.ly/1nMDXwm |
|schokiseason1|	http://bit.ly/1WvtEJg - RIP März 2016 |
|wasdalos|	Erklärung zur Schoki-Inflation: http://bit.ly/1WvtEJg |
