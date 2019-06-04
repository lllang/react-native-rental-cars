# react-native-rental-cars

## 打包 Android release 包
1. npm i
2. react-native link
3. npm run release
4. apk 文件在 android/app/build/outputs/apk/release 底下

## 打包 iOS release 包
1. npm i
2. react-native link
3. cd ios
4. pod install
5. 在 xcode 里面修改 Product => Scheme => Edit Scheme => Build Config 改成 release
6. run
7. app 文件在 xcode 的 Products 底下
