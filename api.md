18959803705

1. 提交驾驶证日期入参格式，调整为字符串 '2019-04-15' 这种
2. 单个照片的提交接口一直返回数据不合法，服务端是不是有什么校验。
3. 身份认证的类型有哪些，入参是啥，我看接口写的 身份证 这种字符串，感觉不太对
4. 提交认证有没有审核流
5. isAuthentication 登录接口返回的这个字段是表示哪个证件的认证状态，我要判断是否已认证是不是得把该证件底下的所有内容的认证状态都判断一遍，可以的话最好返回一个值来判断是否已认证
6. 获取地图上网点的接口入参，应该是我给一个经纬度和一个类似比例尺的值过去，服务端返回这个范围内的所有网点就好了吧，传省市区的话我还要一个接口去获取当前坐标是哪个省市区，如果跨多个省市区的话也比较麻烦
7. 所有返回有 url 的接口都返回一个完整的 url 吧，我看文档上写的都是没带域名的，后面如果文件服务器有啥迁移的话也不用两边都改得很麻烦
8. 怎么看用户的押金状态是否是退款中，我看文档中好像没有
9. 交押金的入参金额，是不是我这边写死500，要不就加个参数配置一下押金金额，我去服务端获取这个金额再展示



1. 加个接口在进入 app 的时候获取全部数据，返回参数和登录的接口返回一样就可以了，入参我把token 加进去
2. 提交认证的接口图片入参应该是链接
3. 订单接口确实没有数据
4. 没有交押金的时候的界面没有稿子


1. 网点车辆列表 ApiCarNetworkUseController 查不到数据
2. 网点接口的半径逻辑是不是有问题，有时候小一点可以搜索出来，大了却搜索不出来，半径的单位是什么
3. 首页用车部分交互稿和视觉稿不一样，缺少视觉稿
4. 获取取车还车网点和获取所有网点的接口一样但是入参不一样


1. 开始订单接口没有传 password
2. 增加查看当前用户是否有正在使用的车并且返回车辆信息
3. 订单列表接口全部tab获取不到数据
4. 订单详情接口 money 没有返回，油量是不是 endOil 字段，也没有返回


1. 身份证提交的时候服务端需要做身份证校验
2. 图片上传的时候不要直接入库了，等提交之后再入库

curl 'https://www.dschuxing.com/app/dsCarNetworkUse/getNetCar' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) ReactNativeDebugger/0.9.7 Chrome/58.0.3029.110 Electron/1.7.15 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Connection: keep-alive' -H 'X-DevTools-Request-Id: 90078.1173' --data-binary '{"networkId":"065c1b018b3e46c7b0f41e20736df3a4"}' --compressed

/api/dsUserInfo/info 接口没有增加驾驶证附页和驾驶证编号的枚举，增加 key copy_driver_license_url ，copy_driver_license_id

支付接口 /api/dsOrder/orderClosing 404，
身份证认证那个问题是，提交接口调用成功之后，再调用获取用户信息接口 /api/dsUserInfo/info 返回的始终是空数组

1. 点了红点显示用车列表之后将用车列表关掉再点击这个点，不响应点击事件
2. Polygon 不显示
3. 第一次唤起高德地图的时候唤起不了，第二次就好了