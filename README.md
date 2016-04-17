# M1nebot Befehlsreferenz

(v0.2, 2016/04/10)

## Aktuelles

* (2016/03/25) Update auf neue Version 2.0.6
* (2016/04/10) Updated custom commandlist, minor changes


## Aktuelle Bot-Rechteübersicht

Broadcaster (Adminrechte): *germandota*  
Administrator: *alpinespielt, mineace*  
Moderatoren: *Incardia13, Hopskukkelitar, ggfzz, fixu13371337*

* [Eigene Befehle](#eigene-befehle)
* [Chatmoderation](#chatmoderation)
* [Zeitgesteuerte Mitteilungen](#zeitgesteuerte-mitteilungen)
* [Schokisystem](#schokisystem)
* [Wettsystem](#wettsystem)
* [Umfragen](#umfragen)
* [Brawls](#brawls)
* [Allgemeine Hinweise](#allgemeine-hinweise)
* [Anhang](#anhang)

<a name="eigene-befehle"></a>
## Eigene Befehle

*./commands/customCommands.js*

* Hinzufügen: (*Moderatoren*)

        !addcom <Befehl> <Text>

* Ändern: (*Moderatoren*)

        !editcom <Befehl> <Text>

* Löschen: (*Moderatoren*)

        !delcom <Befehl>

* Rechte für Befehl ändern: *Administratoren*

        !permcom <Befehl> <Rechtegruppe>

[*Rechtegruppen*: Viewer (7), Regular (6), Subscriber (3), Moderator (2), Administrator (1), Broadcaster (0)]

### Wildcards für `<Text>`

`(sender)` = derjenige der den Befehl ausgeführt hat  
`(@sender)` = so. mit @ vor Name  
`(touser)` = eine andere Person (wird durch sender ersetzt, falls nicht angegeben)  
`(random)` = eine zufällige Person im Kanal  
`(uptime)` = Stream Uptime, falls offline: "Stream ist offline".  
`(game)` = Das aktuell auf twitch eingestellte Spiel.  
`(status)` = Streamtitel  
`(count)` = Wie oft dieser Befehl bereits verwendet wurde  
`(pointname)` = Schoki

### Beispiel

    !addcom slap (sender) haut (touser) eins über die Rübe.
    Hans: !slap Peter Stahlrohr
    Bot: Hans haut Peter eins über die Rübe.

### Aliase

* Hinzufügen: (*Moderatoren*)

        !aliascom <Alias> <Befehl>

* Löschen: (*Moderatoren*)

        !delalias <Alias>

#### Beispiel

```
!addcom kappa Kappa 123
!aliascom keepo kappa
!keepo
Bot: Kappa 123
```



<a name="chatmoderation"></a>
## Chatmoderation

**Vorsicht:** Der Bot beherrscht einige, mächtige Spambekämpfungsfunktionen, falsch konfiguriert hat er das Potential in Sekunden den Chat leerzuräumen.

* Zeigt Hilfe zu allen Moderationsfunktionen

        !moderation

### QuickMod Befehle

Diese Funktionen erlauben es die Moderation via Bot fernzusteuern, dh. auch Botadmins, die nicht Channel-Mod Status haben, haben hier Zugriff. Deshalb sind die Timeouts begrenzt und die Ban-Funktion deaktiviert.

* Nachrichten eines Users aus dem Chat Löschen [entspr. einem timeout für 1 sek.]

        !clr <User>
* Löscht alle Chatnachrichten eines Users und bannt ihn **temporär**. (Standardwert: 1 Minute)

        !to <User> [Zeit in Sekunden]
* Timeout/Ban aufheben

        !unban <User>

### Anti-Link Bekämpfung (derzeit aktiv)

Posts eines User mit einem Link/etwas Linkähnliches werden aus dem Chat entfernt. (Timeout 1 Sekunde)

* Linkerkennung (de-)aktivieren

        !moderation links <on/off>

* Link zur Whitelist hinzufügen

        !whitelist add <Link> [nur die Domain verwenden: zB. *google.de*]

* Link von der Whitelist entfernen

        !whitelist remove <Link>

* Links anzeigen

        !whitelist show

* Nachricht des Bots, wenn ein Link gepostet wird

        !moderation linksmessage

* Einem User temporär erlauben einen Link zu posten (300 Sekunden) 

        !permit <User>

### Zeichen/Spamerkennung

Neben der Linkerkennung, können auch Worte, Sätze, Sonderzeichen, Emotes automatisch moderiert werden.
Für kleine Kanäle unter 1.000 User aber kaum sinnvoll.

Details siehe `!moderation`


### Ausnahmeregelungen

Benutzergruppen können von der Botmoderation ausgenommen werden.
[Derzeit für Subscriber aktiv.]

* Subscribergruppe ausnehmen

        !moderation subscribers  <true/false>

<a name="schokisystem"></a>
## Schokisystem

Derzeit bekomt man nur während eines Streams **8** Schoki pro **10** Minuten gutgeschrieben.  
Subscriber, Moderatoren, Administratoren erhalten **16** Schoki pro **10** Minuten.

### Befehle

* Abfrage des eigenen Kontos

        !schoki

* Schoki Top10 abfragen

        !top5

<a name="wettsystem"></a>
## Wettsystem

Alle Einsätze werden in einem *Pot* gespeichert. Alle Teilnehmer, die richtig getippt haben, bekommen abhängig von ihrem Einsatz ihren Anteil vom Pot ausgezahlt. Es gibt derzeit keine Bonusschoki für einen richtigen Tipp.  

Bei der Auflösung der Wette wird die Auszahlungsquote angezeigt.

### Beispiel

> Peter wettet **50** auf **1**, Paul wettet **50** auf **1**,  Hans wettet **50** auf **2**  
> Gewinnt **1** bekommen Peter und Paul jeweils **75** ausgezahlt (Quote 1.5)  
> Gewinnt **2** bekommt Hans **150** ausgezahlt (Quote 3)  


### Modfunktionen

* Wette starten (*Moderatoren*)

        !bet start <Option1> <Option2> <Option3> ...

* Vorgefertigte Wetten starten (*Moderatoren*)

        !bet dota
        !bet arena

* Wettannahme schliessen (*Moderatoren*)

        !bet close
* Wette auflösen (*Moderatoren*)

        !bet end <Option>

* Wette jederzeit abbrechen (*Moderatoren*)

        !bet abort

### Plebfunktionen

* Wettfunktionen anzeigen

        !bet

* Wette abgeben

        !bet <Einsatz> <Option>

* Status/Letzte Wette anzeigen [derzeit nicht aktiv]

        !bet results

<a name="brawls"></a>
## Brawls

Aus allen Brawllteilnehmern wird ein Sieger per Zufall ermittelt.  
Der Sieger bekommt **10** Schoki pro Teilnehmer.

Brawls können nur von Moderatoren *während* eines Streams gestartet werden.  
Brawls haben einen *Cooldown* von 15 Minuten.

### Befehle

* Einen Brawl starten (*Moderatoren*)

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

(Stand 2016/04/10)

|Befehl | Inhalt |
|:---|:---|
| !120 | http://imgur.com/3jp3nha Kreygasm |
| !achmartin | (sender) schüttelt den Kopf und murmelt fassungslos "Ach Martin" FailFish |
| !allard0802 | "Der Name ist Bond. Le Bond." |
| !aufstellung | Martin/Tidehunter / rNy/Zeus / Fewa/Undying / ByFos/Sven / YourJayer/Lion |
| !autsch | (sender) hat sich verletzt! Hier ein Pflaster. |
| !battlepass | Der neue Battle Pass - Winter Season 2016 ist raus und Martin erklärt ihn euch (zusammen mit dem Compendium): http://bit.ly/1Snr21H |
| !botreferenz | /w (sender) http://tinyurl.com/m1inebot-ref |
| !commgames | Custom Community Games: Um dem Spiel zu betreten den Modus < < 10 vs 10 >> runter laden und bei den Privaten Lobbies nach germandota suchen. |
| !debug | Jetzt geht's Kappa |
| !dota | Martins Dota-Spiele vom 22.03.: 1. Earthshaker (Sieg), 2. Weaver (Niederlage), 3. Orge (Niederlage), 4. Naga Siren (Niederlage), 5. Wraith King (Sieg) |
| !dota_woche | Dota Streams für die Woche 04.04. - 10.04.: DI 5.4. 14:30 - 20:30 / DO 7.4. 19:00 - 00:00 |
| !dotafail | Martin hat es in Episode 144 von Dotacinema Dota 2 Fails of the week geschafft. https://youtu.be/wQ2w8VDf7-o?t=116 |
| !ds | DS3 jetzt schon auf deutsch auf der XB1? Infos: http://bit.ly/1Sj5S1N |
| !factorio | Factorio Playlist auf Youtube: http://bit.ly/1V4lpVM |
| !farcry | Wer Martins Meinung und erste Eindrücke sehen möchte, oder einfach die ersten Folgen verpasst hat, findet hier das komplette Let's Play https://www.youtube.com/watch?v=LZij7JuEwkA&list=PLrTIPs_k-YKFa1Yo4j-7A_EYAhPBPJPeD / Gespielt wird auf der XBOX One, für PC erscheint das Spiel am 01.03. |
| !fewa | Jeder hat einen eigenen Chatbefehl ausser mir BibleThump |
| !fps | Um sich FPS/Ping/Loss in Dota anzeigen zu lassen: Einstellungen > Optionen > Netzwerk (Rechts): Display Network Information |
| !fucker | Immer mit der Ruhe (sender). Kein Grund, gleich zu fluchen. SwiftRage |
| !heute | Streamplan für Heute (8.4.): Dark Souls 3 14:30-18:00 Uhr |
| !holy | Holy Moly! :O Ein GodLEike Martin LE! martinTinyfin |
| !hopsi | Endlich gibt es Fotos von unserer Hops ;) hier http://bit.ly/1nMDXwm |
| !hs | Martin hört mit Hearthstone auf - dafür konzentriert er sich auf Dota & MartinSpielt! Details: http://bit.ly/1TE39T2 |
| !joindota | Martin und sein Team sind in der joinDota-League angemeldet. Infos zum Team findet ihr hier: http://bit.ly/1LNuDTS und zu ihren Spielen in der jDL hier: http://bit.ly/1Z6t5p7 // Leider haben sie es am Samstag nicht geschafft und sind nicht in die 3. sondern "nur" in die 4. Division aufgestiegen. Hier der Link zu den Play-Offs: http://bit.ly/1Ml0irk |
| !keks | /me gibt (touser) einen Keks. OpieOP |
| !ladies | martinLadies Ladies, Martin Le martinLadies |
| !le | M-M-M-M-MonsterLE 4Head |
| !lethal | FailFish Und schon wieder ein Lethal verpasst! Da weint selbst der martinTinyfin |
| !lol | A LoL and a DotA player have a conversation: the DotA-player says DotA is better, the LoL-player can't deny. Kappa |
| !met | Aus dem Weinkeller des Chats (direkt neben dem Keksbunker) holt der M1neBot eine Flasche Honigwein samt Trinkhorn und schenkt (sender) ein, bevor er selbst den Rest der Flasche runterkippt. *hicks* |
| !mic | Oh nein! Martin wurde von einem Silence erwischt. Die Flüche, sobald er es raus findet, könnt ihr euch sicher schon vorstellen. PJSalt |
| !mmr | Solo-MMR: 4585 / Gruppen-MMR: 4226 / Team-MMR: 4348 |
| !mobile | Klasse: Krieger // Lvl: 77 // Aushöhlung: 99 (Maximum) // Tode: ~62 // Erlegte Bosse: Iudex Gundyr, Vordt vom Nordwindtal, Fluchverderbtes Großholz, Wächter des Abgrundes, Hochfürst Wolnir, Kristallweiser, Diakone des Abgrunds, Alter Dämonenkönig, Hohepriester Sulyvahn |
| !mopedtobias | Der Name MopedTobias (wie Martin sich in Steam nennt) stammt aus dem Helge Schneider Sketch "Deutschland sucht den Moped Tobias". (Martin ist großer Helge Schneider Fan.) |
| !moremurloc | Do Murlocs ever get tired of making the sam noise over and over again? martinTinyfin Nope! martinTinyfin Mrglmrglmrgl martinTinyfin |
| !morgen | Am Wochenende (9./10.04.) sind keine Streams geplant. Allerdings könnte es Spontan-Streams geben. ;) Einfach den Kanal im Auge behalten! Auf !ts wird es sicher bekannt gegeben sollte martin streamen |
| !ms_woche | Die Martin spielt Projekte im Stream für 04.04 - 10.04.: MO 4.4. 18:00 - 20:00 DS3 / DO 7.4. 14:30 - 18:00 Factorio / FR 8.4. 14:30 - 18:00 DS3 |
| !murloc | martinTinyfin mrglmrglmrgl martinTinyfin https://www.youtube.com/watch?v=uOpdyytB3OY |
| !njnia | Jetzt kommt eine Pause! Manche geh'n nach Hause, manche trinken Brause, das ist der Zweck der Pause! Wie schön ist es, eine Wurst zu verzehren und gleichzeitig Martin zuzuhören! OpieOP |
| !patch | Hier gehts zu den Patch-Notes: http://www.dota2.com/balanceofpower Martin hat den Patch ausgiebig analysiert: Sein erstes Video findet ihr hier: https://www.youtube.com/watch?v=N6QErlsMPo8 |
| !patreon | Unterstützt Martins Projekte via Patreon: https://www.patreon.com/GermanDota // https://www.patreon.com/MartinSpielt |
| !pc | Martins Pc: i7 4790k auf 4,75 Ghz übertaktet; 8GB Ram; Nividia 980 GTX. |
| !ping | Martin hat Osteuropa als Suchoption festgelegt, weil die Server für Osteuropa in Österreich stehen. Dort hat man als Bayer einen besseren Ping. Die Server für Westeuropa stehen in Luxemburg. |
| !rangliste | Die Schoki-Ränge, die man im Chat erreichen kann, sind (in der Reihenfolge von Wenig bis Viel Schoki): "LEtzter" (0 Schoki), "LEiche" (ab 50), "LEergut" (ab 200), "LEvel-Up" (ab 450), "LEichtgewicht" (ab 800), "LEpragnom" (ab 1250), "LEbendiger" (ab 1800), "LEguan" (ab 2450), "LEopard" (ab 3200), "LEgionär" (ab 4050), "LEutnant" (ab 5000), "LEader" (ab 6050), "LEthal" (ab 7200), "LEgion Commander" (ab 8450) und "LEgende" (ab 9800). |
| !sam | Von Aliens, Schokthulu und Diabetes bedroht schreit (sender) um Hilfe von ganz oben! Commander LE schickt seine beste Kämpferin um die Community zu unterstützen. Mit Mettkit, Schwert und Waffe ausgerüstet bahnt sich Anführerin Sam "Slayer" Frosch den Weg durch die Massen und sorgt wieder für Ruhe im Chat. |
| !sanjig | Sanjig und Yasha best item ever |
| !schinken | Ja, auch der M1neBot ist schlagfertig Kappa https://www.youtube.com/watch?v=j5AFVlxYLPU |
| !shop | Mit Schoki könnt ihr in Martins Online-Shop einkaufen: http://tinyurl.com/b3pnl5j |
| !social | Martins Social Media-Infos: YouTube-Kanäle: http://bit.ly/MartinSpielt // http://bit.ly/MartinHearthstone // http://bit.ly/MartinDota // Facebook: http://www.facebook.com/GTMartinLe |
| !speak | Martin spricht für gewöhnlich erst zu Beginn eines Spiels. In den Pausen ruht er seine Stimme aus bzw. isst oder trinkt etwas. Ausserdem wird in den Pausen bei einigen Viewern Werbung geschaltet (Danke dafür :) ) und es wäre ziemlich unpraktisch, wenn Martin etwas erzählt und einige das nicht mitbekommen würden. |
| !spiele | Martins Spiele (7.04.): 1. Anti Mage (win), 2. Natures Prophet (win), 3. Silencer-Mid (lose), 4. Enigma (lose), 5. Venomancer (win) |
| !stream | Gestreamt wird mit Open Broadcaster in 1080p, 60 FPS und 3,3 Mbit. |
| !streamplan | Der aktuelle Streamingplan: http://tiny.cc/MartinStreamplan |
| !team | Das GermanDota-Team: MopedTobias (Martin) - Offlane / rNy (Simon) - Mitte / ByFos (Dominik) - Carry / Xylenol (Simon) - (Lane)Support / Fewa (Fabian) - (Farm)Support / |
| !tinyspam | martinTinyfin martinTinyfin martinTinyfin martinTinyfin martinTinyfin martinTinyfin martinTinyfin |
| !trade | Martins Steam Trading Link: http://tiny.cc/MartinTrade |
| !ts | Ich hab gehöhrt hier gehts ab https://discord.gg/0WvMm8tYOgpgYNao |
| !unrigbrawl | Der Brawl kann leider derzeit nicht repariert werden. DansGame |
| !uptime | Online seit: (uptime) |
| !wasdalos | Martin hört mit Hearthstone auf - dafür konzentriert er sich auf Dota & MartinSpielt! Details: http://bit.ly/1TE39T2 |
| !wetten | Alle Infos zum Wettsystem findet ihr hier: http://i.imgur.com/uEGYlYP.png |
| !wolfi | Erzittert Sterbliche, der Meister der Zitate ist wieder da! Keepo |
| !wow | War geil? War sogar supergeil Martin! BloodTrail |
| !wowmartin | War geil? Sogar supergeil, Martin! BloodTrail |