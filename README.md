[TOC]

# 盈享会商城小程序端

##前置条件

###开发者需要掌握的

- Html

- Javascript(ES6)

- CSS(Sass)

- 小程序开发(微信为主、支付宝、百度、字节跳动)

- <a href="https://cn.vuejs.org/index.html" target="_blank">Vue</a>

- <a href="https://uniapp.dcloud.io/" target="_blank">Uni-app</a>

### 运行环境

Node.js + 小程序开发者工具

## 安装、运行

1. 命令行切换到代码目录下，执行以下命令安装依赖

    ```shell script
    npm install
    ```

2. 创建配置下面两个文件

    /src/siteInfo.js文件
	小程序配置如下：
    ```javascript
    module.exports = {
        'acid': -1,
        'version': '1.0.0',
        'siteroot': 'http://localhost/app/index.php',
        'apiroot': 'https://localhost/web/index.php?_mall_id=1',
    };
    ```
	h5配置如下：
	```javascript
	let siteInfo = {
	    'acid': -1,
	    'version': '1.0.0',
	    'apiroot': 'https://localhost/web/index.php?_mall_id=1',
		'id': '1',
		'platform': 'wechat'
	};
	```
   
   修改`apiroot`成自己的服务器路径，`_mall_id`可从后台的`小程序商城`列表获取到ID，id为后台的`小程序商城`列表获取到ID

    /src/manifest.json文件

    ```json
    {
      "name": "zjhj_bd_app",
      "appid": "",
      "description": "",
      "versionName": "1.0.0",
      "versionCode": "100",
      "transformPx": false,
      "uniStatistics": {
        "enable": false
      },
      "app-plus": {
      },
      "quickapp": {
      },
      "mp-weixin": {
        "appid": "",
        "setting": {
          "urlCheck": false
        },
        "usingComponents": true,
        "permission": {
          "scope.userLocation": {
            "desc": "请求获取您的位置信息"
          }
        }
      },
      "mp-alipay": {
        "usingComponents": true
      },
      "mp-baidu": {
        "appid": "",
        "usingComponents": true
      },
      "mp-toutiao": {
        "appid": "",
        "usingComponents": true,
        "urlCheck": false
      },
      "mp-qq": {
        "usingComponents": true
      },
	  "h5": {
	    "async": {
	      "loading": "AsyncLoading",
	      "error": "AsyncError",
	      "delay": 2000,
	      "timeout": 10000
	    },
	    "uniStatistics" : {
	      "enable" : true
	    },
        "publicPath" : "/addons/zjhj_bd/h5/",
        "router" : {
            "base" : "/addons/zjhj_bd/h5/",
            "mode" : "hash"
        },
	    "sdkConfigs": {
	      "maps": {
	        "qqmap": {
	          // 腾讯地图秘钥（key）https://lbs.qq.com/dev/console/key/manage
	          "key": ""
	        }
	      }
	    }
	  },
    }
    ```
   
   `mp-weixin/appid`填写上微信小程序的appid
   
   h5编译时需要注意文件路径问题：目前需要将h5编译后的文件解压到`域名根目录/addons/zjhj_bd/h5/`路径下；
   注：[本地开发跨域问题解决方案](https://www.cnblogs.com/PYiP/p/11244134.html)

3. 编译代码
  
    编译微信小程序
    
    ```shell script
    npm run dev:mp-weixin
    ```

    会在dist/dev下生成mp-weixin文件夹，用微信开发者工具打开即可预览小程序

    各个平台编译命令：
    ```
    // 微信
    npm run dev:mp-weixin
    
    // 支付宝
    npm run dev:mp-alipay
    
    // 百度
    npm run dev:mp-baidu
    
    // 字节跳动
    npm run dev:mp-toutiao
    ```

## 规范

### Git规范

- dev为公共开发分支，开发提交的内容请提交至dev；

- git提交尽量以每一项修改提交一次，尽量不要多项修改一次提交，备注信息请勿提交“111”，“aaaa”这样不明意思的内容；

- 项目发布后，涉及到比较大的改动或新功能开发，建议自己创建分支进行开发；

- 自己创建的分支需要经常把dev合并到自己的分支，以面差异过多产生冲突；

- 自己分支开发的内容确认开发完成需要测试时，合并到dev分支；

### 代码基础规范

- 必须以4个空格缩进，并保持代码缩进整齐；

- 代码结尾必须以分号结尾；

- Html代码标签属性使用双引号，示例

    ```html
    <view msg="hello"></view><!--正确示范-->
    <view msg='hello'></view><!--错误示范-->
    ```

- JavaScript代码字符串优先使用''或``，示例

    ```javascript
    const str = 'hello'; // 正确示范
    const str = `hello`; // 正确示范
    
    const str = "hello"; // 错误示范
    ```

- 组件命名使用app-xxx-xxx的格式；

### 开发基础组件

请给写的公共组件写一个使用文档，在doc/components.md。

### FormId记录

尽可能的使用app-form-id组件套可点击的位置，以记录formid发送模板消息用。

### 样式

- 全局scss 变量定义 ./uni.scss;

- 主题颜色 ./static/css/themeColor.scss;

- 弹性布局 ./static/css/flex.scss;

### 静态图片

- 通用图片 ./static/image/

- 单独图片 组件下或页面下 ./image/

### 层级(z-index)

- 普通悬浮组件(低于底部导航):<1500

- 底部导航:1500

- 悬浮组件(高于底部导航):>1500

## 代码说明

### 目录结构

/src目录

    ```
    components      // 公共组件
    core            // 小程序核心代码
    └──  apiUrl.js      // 服务器端API接口配置
    pages           // 页面代码
    plugins         // 插件代码
    static          // 图片、样式
    store           // vuex
    App.vue         // 小程序生命周期控制
    main.js         // 入口文件
    manifest.json   // 小程序配置
    pages.json      // 页面路由配置
    siteinfo.js     // 服务器路径配置
    uni.scss        // 全局样式
    ```

### 生命周期

页面的生命周期使用页面的生命周期，参见

[https://uniapp.dcloud.io/frame?id=页面生命周期]

组件生命周期使用vue组件的生命周期，参见

[https://cn.vuejs.org/v2/guide/instance.html#实例生命周期钩子]

### 主题色
  ```html
    <!--   组件形式-->
    <component :theme="theme"></component>
    <!--  标签形式-->
    <view :class="[`${theme}-background`, `${theme}-color`]"></view>
  ```

````javascript
    export default {
        props: {
            theme: {
                default: 'classic-red', // 统一整个颜色为默认主题色
                type: String,
            }
        }
    }
````
### 公共代码 - app-layout
- 每一个page页面请用,如下代码书写：
````html
<template>
    <app-layout>
    </app-layout>
</template>
````

### 组件使用规范

#### 样式 穿透
- 在vue文件中的style标签上，有一个特殊的属性：scoped。
当一个style标签拥有scoped属性时，
它的CSS样式就只能作用于当前的组件，
也就是说，该样式只能适用于当前组件元素。
通过该属性，可以使得组件之间的样式不互相污染。
如果一个项目中的所有style标签全部加上了scoped，相当于实现了样式的模块化。
````html
<style>
    /* global styles */
</style>
````

````html
<style scoped>
    /* local styles */
</style>
````

- 编译前

````html
<style scoped>
    .example {
      color: red;
    }
</style>

<template>
    <div class="example">hi</div>
</template>

````

- 编译后

````html
<style>
    .example.data-v-5558831a. {
      color: red;
    }
</style>

<template>
  <div class="example" data-v-5558831a>hi</div>
</template>
````

穿透方法
````
<style scoped>
    外层 /deep/ 第三方组件 {
        样式
    }
</style>
````
### 组件使用方法
- 开发是在组件外部套上 view 标签 目的: 平台样式兼容处理

````html
    <template>
        <app-layout>
            <view>
                <app-component></app-component>
            </view>
        </app-layout>
    </template>
````

````javascript
import appComponent from "../component/app-component.vue";
export default {
    components: {
        'app-component': appComponent,
    }
}
````
### 全局组件挂载
- uni-app 支持配置全局组件，需在 main.js 里进行全局注册，注册后就可在所有页面里使用该组件。

 main.js 里进行全局导入和注册
 ````javascript
 import Vue from 'vue';
 import pageHead from './components/page-head.vue';
 Vue.component('page-head',pageHead);
 ````
 index.vue 里可直接使用组件
 ````html
 <template>
   <view>
     <page-head></page-head>
     </view>
 </template>
 ````

### 网络请求
- api request 已挂载在全局
````javascript
Vue.use({
    install(Vue, options) {
        // 接口 路径
        Vue.prototype.$api = Api;
        // 请求
        Vue.prototype.$request = request;
    },
});
````

- 使用方法
````javascript
    this.$request({
        url: this.$api.index.config,
    });
````

### vuex

- modules 模块化 以及 组件中引入 mapGetters、mapActions 和 mapStates的使用
index.js
````javascript
    import Vue from 'vue';
    import Vuex from 'vuex';
    // 模块引入
    import user from './modules/user.js';
    import mallConfig from './modules/mallConfig.js';
    
    Vue.use(Vuex);
    
    export default new Vuex.Store({
        modules:{
             user: user,
             mallConfig: mallConfig,
        }
    });
````

````javascript
    // user.js
    const state={
        userName: '',  //初始化数据
    };
    const getters={
          getUserName(state){ // 获取数据
            return state.userName;
          }
    };
    const mutations={// 只能做同步操作
         setUserName(state,data){ //如何变化collects,插入items
            state.userName = data
         }
     };
    const actions={// 可以做异步操作
        actionsUserName(context,item){ // 调用setUserName ,传入数据形参item 对应到items
            return new Promise((resolve, reject) => {
                context.commit('setUserName',item);
            });
        }
    };
    export default {
         namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
         state,
         getters,
         mutations,
         actions
    }
````
````javascript
import { mapState,mapGetters,mapActions } from 'vuex';
export default {
    computed: {
        ...mapState({ //ES6的语法，意思是state里有多少属性值我可以在这里放多少属性值
            userName: state=> state.user.userName
        }),
        ...mapGetters('user',{ //用mapGetters来获取user.js里面的getters
          userName: 'getUserName'
        })
    },
    mounted() {
        this.$store.dispatch('user/actionsUserName'); // 执行 user.js里的 actions里的方法
    },
    methods: {
        ...mapActions('user',[ //user是指modules文件夹下的user.js
          'actionsUserName'  //user.js文件中的actions里的方法，在上面的@click中执行并传入实参
        ])
    }
}
````

### 条件编译

不同平台下编译出不同代码

[https://uniapp.dcloud.io/platform](https://uniapp.dcloud.io/platform)