rootview color: #181818
header color: #1b1b1b
footer menu color: #222326

== todo ==

* (!) playback-а спира при заключен екран въпреки wifilock и wakelock
* get only minimal build of lodash
* UI за твърде дълги имена на албуми/артисти
* Да възстановявам playback-a когато някой звънне и затвори. В момента playback-а се възстановява
  само ако разговора е започнал.
* възможност музиката на андроид да се пази на SD картата
* няма нужда да се държи wifi lock за playlists, в които всикчи файлове ги има локално
* soft клавиатурата трябва да скрива footer-а, защото иначе той заема почти целият екран. Да се види
  https://github.com/douglasjunior/react-native-keyboard-manager в тази връзка.
* Error text slider-а отгоре на андроид рисува върху самият taskbar
* status bar-а на 4.4.2 андроид не е съвсем прозрачен
* navigation state-a след първото ниво не се запазва в redux
* theme support
* "Various artists" in search album results
* crash с "json syntax error" в browse albums
* login трябва да рапознае, че това наистина е HTTPMS, а не случаен HTTP адрес. Може би със
  специален /status API call?
* logout трябва да изчиства всички ресурси
* дълги имена в списъците на home страницата разместват картите

== commands ==

Списък с android емулатори:

avdmanager list avd

Пускане на android емулатор:

/Users/iron4o/Library/Android/sdk/tools/emulator -avd <name> # name идва от list-а по - горе

debug menu:

ctrl + d (ios)
ctrl + m (android)

reload js:

ctrl + r (ios)
rr (android)
