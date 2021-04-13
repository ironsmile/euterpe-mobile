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
* logout трябва да изчиства всички ресурси
* да защитя playlist обекта и currentIndex зад lock-ове в android модула


== links ==

* [FlatList Perf improvements](https://github.com/facebook/react-native/issues/15930#issuecomment-373816387)


== required software ==

it seems currently the project only works with Node 10 and no newer for some
reason.

== commands ==

Списък с android емулатори:

avdmanager list avd

Пускане на android емулатор:

/Users/iron4o/Library/Android/sdk/tools/emulator -avd <name> # name идва от list-а по - горе

или алтернативно този по - бърз емулатор:

~/Downloads/emulator/emulator -avd <name> # OS X

~/Android/Sdk/emulator/emulator -avd <name> # Linux

пускане на bundler (комилитор). От root project dir:

EDITOR=true react-native start

пускане на android и ios:

react-native run-nadroid
react-native run-ios

debug menu:

ctrl + d (ios)
ctrl + m (android)

reload js:

ctrl + r (ios)
rr (android)

компилиране на release версия:

react-native run-android --variant=release

инсталиране на истински device на release версия:

adb -s ZX1B23C8SJ install -r android/app/build/outputs/apk/app-release.apk

логовете само на моя арр:

adb logcat --pid $(adb shell ps | grep httpms | awk '{ print $2 }')

== New Name ==

Euterpe or Muzika
