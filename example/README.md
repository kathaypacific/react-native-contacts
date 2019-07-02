# react-native-device-info example project

## Notes

* React Native doesn't seem to like symlinks in node_modules.  So when testing new 
changes in java files in `react-native-contacts` a hacky / dumb way to work around
this is to hard link the files in `node_modules` to the files in the root
`react-native-contacts` directory.

  ```bash
  # yuck
  ln ../android/src/main/java/com/rt2zz/reactnativecontacts/* node_modules/react-native-contacts/android/src/main/java/com/rt2zz/reactnativecontacts/
  ```

## Installation

* `git clone https://github.com/rt2zz/react-native-contacts.git`
* `cd react-native-contacts/example`
* `npm install`

## Running Android

* make sure you have no other packagers running!
* start an emulator (e.g., using Android Studio -> Tools -> AVD Manager -> start one)
* `npx react-native run-android`

## Running iOS

* make sure you have no other packagers running!

### Without CocoaPods

* `npx react-native run-ios`

### With CocoaPods

* `cd ios && pod install && cd ..`
* `npx react-native run-ios`

## Troubleshooting

* if things don't work, clean up all your build and node_modules folders, npm install and rebuild
