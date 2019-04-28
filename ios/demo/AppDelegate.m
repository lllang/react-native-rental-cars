/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <React/RCTLinkingManager.h>
#import <./WXApi.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  #ifdef DEBUG
      //开发包
      jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  #else
      //离线包
      jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"bundle/index.ios" withExtension:@"jsbundle"];
  #endif
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"demo"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [AMapServices sharedServices].apiKey = @"9c80c09fa98f3941dd7cd4cf62664d79";
  [self.window makeKeyAndVisible];
  return YES;
}

//支付回调9以后
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary*)options {
 return  [WXApi handleOpenURL:url delegate:self];
}
//支付回调9以前
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
 return  [WXApi handleOpenURL:url delegate:self];
}
//ios9以后的方法
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
 return [WXApi handleOpenURL:url delegate:self];
}

#pragma mark - wx callback

- (void) onReq:(BaseReq*)req
{
 // TODO Something
}

- (void)onResp:(BaseResp *)resp
{
 //判断是否是微信支付回调 (注意是PayResp 而不是PayReq)
 if ([resp isKindOfClass:[PayResp class]])
 {
   //发出通知 从微信回调回来之后,发一个通知,让请求支付的页面接收消息,并且展示出来,或者进行一些自定义的展示或者跳转
   NSNotification * notification = [NSNotification notificationWithName:@"WXPay" object:nil userInfo:@{@"errCode":@(resp.errCode)}];
   [[NSNotificationCenter defaultCenter] postNotification:notification];
 }
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
