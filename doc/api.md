# 小程序核心功能文档

## 用户 this.$user

### this.$user.getAccessToken(options)

获取用户Access Token

```javascript
this.$user.getAccessToken({
    cacheOnly: false, // 是否只从缓存读取，是的话即使缓存是空的也会返回空
}).then(accessToken => {
    
}).catch(error => {
    
});
```

### this.$user.getInfo()

获取用户信息

```javascript
this.$user.getInfo().then(info => {
    
}).catch(error => {
    
});
```

## 支付 this.$payment

### this.$payment.pay(id);

调用支付

```javascript
// id: 后台支付接口返回的待支付id
this.$payment.pay(id).then(msg => {
    // 支付成功
}).catch(msg => {
    // 支付失败
    
});
```
