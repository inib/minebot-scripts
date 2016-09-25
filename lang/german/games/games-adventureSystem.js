$.lang.register('adventuresystem.adventure.cooldown', 'Die nächste Mission kann erst wieder in $1 gestartet werden.');
$.lang.register('adventuresystem.adventure.usage', 'Hinweis: !mission [$1].');
$.lang.register('adventuresystem.alreadyjoined', 'Du bist bereits Teil der Heldentruppe.');
$.lang.register('adventuresystem.completed', 'Mission erfolgreich! PogChamp // Unsere Helden: $1.');
$.lang.register('adventuresystem.completed.no.win', 'Mission gescheitert! FailFish Gruss in die ewigen Jagdgründe.');
$.lang.register('adventuresystem.completed.win.total', 'Mission erfolgreich! PogChamp // $1 Helden haben überlebt, $2 habens leider nicht geschafft.');
$.lang.register('adventuresystem.join.bettoohigh', 'Mit $1 kannst du nicht beitreten, du kannst maximal $2 ausgeben.');
$.lang.register('adventuresystem.join.bettoolow', 'Mit $1 kannst du nicht beitreten, du musst mindestens $2 aufbringen.');
$.lang.register('adventuresystem.join.needpoints', 'Mit $1 kannst du nicht beitreten, du hast nur $2.');
$.lang.register('adventuresystem.join.notpossible', 'Derzeit kannst du keiner Heldengruppe beitreten.');
$.lang.register('adventuresystem.join.success', 'Du bist der Heldentruppe mit $1 beigetreten!');
$.lang.register('adventuresystem.loaded', 'Missionen erfolgreich geladen (found $1).');
$.lang.register('adventuresystem.payoutwhisper', 'Mission erfolgreich, $1 + $2 werden dir für deine Heldentaten ausbezahlt.');
$.lang.register('adventuresystem.runstory', 'Unsere Mission: "$1" mit $2 Helden.');
$.lang.register('adventuresystem.set.success', 'Set $1 to $2.');
$.lang.register('adventuresystem.set.usage', 'Hinweis: !adventure set [Option] [Wert].');
$.lang.register('adventuresystem.start.success', '$1 versucht eine furchtlose Heldentruppe mit genügend Ausrüstung zusammen zu trommeln! "!mission [$2]" um Ausrüstung zu kaufen und beizutreten');
$.lang.register('adventuresystem.tamagotchijoined', '$1 is also joining the adventure.');
$.lang.register('adventuresystem.top5', 'Unsere Top 5 Helden sind: $1.');
$.lang.register('adventuresystem.top5.empty', 'Derzeit haben wir noch keine Helden.');

$.lang.register('adventuresystem.stories.1.title', 'Roshan Raubzug');
$.lang.register('adventuresystem.stories.1.chapter.1', 'Ein lautes Gebrüll ertönt im Chat und die schweren Schritte des Untiers sorgen für Erdbeben! Roshan legt den Chat in Schutt und Asche. Jetzt sind unsere Helden gefragt, das Monster zu vernichten!"');
$.lang.register('adventuresystem.stories.1.chapter.2', 'Verluste?! In einem epischen Kampf gegen Roshan wurden (caught) getötet. WutFace');
$.lang.register('adventuresystem.stories.1.chapter.3', 'Das Untier ist tot! (survivors) haben überlebt und konnten sich das Aegis of the Immortal sichern!');

$.lang.register('adventuresystem.stories.2.title', 'Rettet Tinyfin martinTinyfin');
$.lang.register('adventuresystem.stories.2.chapter.1', 'martinTinyfin : Mrglgl Zu Hilfe Chat! Der grosse, böse FrankerZ ist hinter mir her, mrglgl!');
$.lang.register('adventuresystem.stories.2.chapter.2', 'FrankerZ : Komm her, kleiner Murloc! Dich gibts heute als Hauptgericht!');
$.lang.register('adventuresystem.stories.2.chapter.3', '(caught) ist das egal und schauen lieber weiter Martin zu. OSsloth');
$.lang.register('adventuresystem.stories.2.chapter.3', 'Bis an die Zähne bewaffnet stellen sich (survivors) FrankerZ entgegen und können martinTinyfin befreien!');

$.lang.register('adventuresystem.stories.3.title', 'Spinnen?!');
$.lang.register('adventuresystem.stories.3.chapter.1', '/╲/╭༼ * ಠ 益 ಠ * ༽╮/╱\\! WutFace Wer hat das Fenster wieder offen gelassen? Eine dicke, fette Spinne kriecht durch den Chat.');
$.lang.register('adventuresystem.stories.3.chapter.2', '(caught) haben versucht die Spinne in ein Glas zu locken und lebend zu fangen FailFish und wurden dabei tödlich gebissen.');
$.lang.register('adventuresystem.stories.3.chapter.3', 'Doch (survivors) kennen sich mit Spinnen aus, da gibts nur eins: Drauftreten! *matsch*');

/*
 * Rules on writing your own adventure story:
 *
 * - Stories are automatically loaded from this file by their sequence number (adventuresystem.stories.[This number]).
 * - Keep the format of your story as shown above.
 * - There can be an unlimited number of stories, IF you keep their subsequence numbers 1, 2, 3, 4, 5...
 * - A story must have a title.
 * - A story can have an unlimited number of chapters, IF you keep their subsequence numbers 1, 2, 3, 4, 5...
 * - Stories are picked at random.
 *
 ** Game specific story how-to.
 * - Add $.lang.register('adventuresystem.stories.NUMBER.game', 'GAME NAME IN LOWER CASE'); on top of the story chapter.
 * Example >
 * $.lang.register('adventuresystem.stories.5.game', 'gaming talk shows');
 * $.lang.register('adventuresystem.stories.5.title', 'Talk Shows');
 * $.lang.register('adventuresystem.stories.5.chapter.1', 'random story...');
 *
 * Underneath is a template for your first custom story, just remove the preceding slashes.
 */

//$.lang.register('adventuresystem.stories.5.title', '');
//$.lang.register('adventuresystem.stories.5.chapter.1', '');
//$.lang.register('adventuresystem.stories.5.chapter.2', '');
//$.lang.register('adventuresystem.stories.5.chapter.3', '');
