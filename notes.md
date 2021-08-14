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
* Error text slider-а отгоре на андроид рисува върху самият taskbar
* status bar-а на 4.4.2 андроид не е съвсем прозрачен
* navigation state-a след първото ниво не се запазва в redux
* theme support
* "Various artists" in search album results
* crash с "json syntax error" в browse albums
* да защитя playlist обекта и currentIndex зад lock-ове в android модула
* Press the hardware button so many times and at the end the program carshes when
  trying to stop itself.


== links ==

* [FlatList Perf improvements](https://github.com/facebook/react-native/issues/15930#issuecomment-373816387)

== required software ==

it seems currently the project only works with Node 10 and no newer for some
reason.

== commands ==

Списък с android емулатори:

avdmanager list avd

или

~/Android/Sdk/emulator/emulator -list-avds

Пускане на android емулатор:

/Users/iron4o/Library/Android/sdk/tools/emulator -avd <name> # name идва от list-а по - горе

или алтернативно този по - бърз емулатор:

~/Downloads/emulator/emulator -avd <name> # OS X

~/Android/Sdk/emulator/emulator -avd <name> # Linux

пускане на bundler (комилитор). От root project dir:

EDITOR=true npx react-native start

пускане на android и ios:

npx react-native run-android
npx react-native run-ios

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

adb logcat --pid $(adb shell ps | grep -i euterpe | awk '{ print $2 }')

=== Bugs ==

Bugz #1:

* Слушкаш музика
* Пускаш друг звук (youtube или друг плеър) докато работи
* връщаш се на Euterpe и натискаш play
* "media player is not created"
