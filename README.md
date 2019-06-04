# react-native-rental-cars

## 打包 Android release 包
npm i
react-native link
npm run release
apk 文件在 android/app/build/outputs/apk/release 底下

## 打包 iOS release 包
npm i
react-native link
cd ios
pod install
在 xcode 里面修改 Product => Scheme => Edit Scheme => Build Config 改成 release
然后直接 run
app 文件在 xcode 的 Products 底下
