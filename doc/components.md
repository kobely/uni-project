# 小程序公共组件文档

**注意：调用任何组件需要在外部套一个标签<view></view>，避免意料之外的样式产生。**

## app-radio

- 代码

    ````html
    <app-radio></app-radio>
    ````
- 属性 
  
    - v-model: 开启关闭数据(boolean)
    
    ````html
    <app-radio v-model="isShow"></app-radio>
    ````
    
    - theme: 主题色（字符串，变量）--- 变量需在props中定义
    ````html
    <app-radio :theme="theme"></app-radio>
    ````
    
    - type: 类型（String）圆形---round, 默认情况方形
    
    ````html
    <app-radio type="round"></app-radio>
    <app-radio></app-radio>
    ````

## app-input

- 代码

    ````html
    <app-input ></app-input>
    ````

- 属性

    - type: 键盘类型(String)
    
    ````html
    文本输入键盘
    <app-input type="text"></app-input>
    数字输入键盘
    <app-input type="number"></app-input>
    身份证输入键盘
    <app-input type="idcard"></app-input>
    带小数点的数字键盘
    <app-input type="digit"></app-input>
    输入框
    <app-input type="textarea"></app-input>
    ````

    - disabled ：禁用(Boolean)
    
    ````html
    <app-input disabled></app-input>
    ````

    - password： 密码(Boolean)
    
    ````html
    <app-input password></app-input>
    ````

    - placeholder： 占位符(String)
    
    ````html
    <app-input placeholder="请输入字符"></app-input>
    ````

    - autoHeight： 自动高度(Boolean) type = 'textarea'
    
    ````html
    <app-input autoHeight></app-input>
    ````

    - showConfirmBar： 显示完成按钮(Boolean) type = 'textarea'
    
    ````html
    <app-input showConfirmBar></app-input>
    ````

    - placeholderStyle： 占位符文字样式(String) 指定 placeholder 的样式，目前仅支持color,font-size和font-weight type = 'textarea'
    
    ````html
    <app-input placeholderStyle="color:red;"></app-input>
    ````


## app-form-id

- 代码

    ```html
    <view>
        <app-form-id @click="自定义事件触发>
           <app-button>按钮</app-button>
        </app-form-id>
    </view>
    ```

- 在外部嵌套一个标签，内部通过click时间，触发自定义事件，抛出获取到的formid，formid已经保存到缓存中，组件无样式
自定义样式

## app-button

- 代码

    ````html
    <app-button>按钮</app-button>
    ````
  
- 回调
  
    ````html
    <app-button @click="自定义方法">按钮</app-button>
    ````
  
- 属性

    - disabled: 禁止点击（boolean）
    
    ```html
    <app-button disabled>按钮</app-button>
    <app-button :disabled="disabled">按钮</app-button>
    ```

    - type: 按钮类型，（字符串）分为三种: 重要-important,一般-general，普通-（不传参）

    ```html
    <app-button type="important">按钮</app-button>
    ```

    - round：圆角按钮，50rpx（boolean）（统一）

    ```html
    <app-button round>按钮</app-button>
    ```

    - theme: 主题色，（字符串，变量）--- 变量需在props中定义
    
    ```html
    <app-button :theme="theme">按钮</app-button>
    ```

    - height：高度，（字符串）--- 单位为rpx，不需要传
    
    ```html
    <app-button height="100">按钮</app-button>
    ```

    - fontSize: 字体大小，不传，默认为32rpx（字符串）--- 单位为rpx，不需要传
    
    ```html
    <app-button fontSize="10">按钮</app-button>
    ```

    - width: 宽度，不传默认为100%，（字符串）--- 单位为rpx.不需要传
    
    ```html
    <app-button width="10">按钮</app-button>
    ```

    - color：文字颜色（字符串）
    
    ```html
    <app-button color="#000000">按钮</app-button>
    ```

    - size: 规定的三种按钮高度,(字符串)分为三种:大---large(100),小---small(60)，中---medium(80)
    
    ```html
    <app-button size="large">按钮</app-button>
    ```
  
    - background: 背景颜色，不用主题色的情况下使用
    
    ```html
    <app-button background="red">按钮</app-button>
    <app-button background="#ffffff">按钮</app-button>
    ```

## app-form-id app-button

- 两者结合使用
  
    ````html
    <app-form-id @click="自定义方法">
       <app-button >按钮</app-button>
    </app-form-id>
    ````

## app-jump-button

- 代码

    ````html
     <view>
        <app-jump-button></app-jump-button>
     </view>
    ````
  
- 属性

    - arrangement: 插槽内部排列方式(字符串) column --- 竖排居中对齐,row --- 横排居中对齐
    
    ````html
     <view>
        <app-jump-button arrangement="column"></app-jump-button>
     </view>
    ````

    - backgroundColor: 背景颜色
    
    ````html
     <view>
        <app-jump-button backgroundColor="red"></app-jump-button>
     </view>
     <view>
         <app-jump-button backgroundColor="#ffffff"></app-jump-button>
      </view>
    ````
    
    - item: 对象
    
    ```
    {
        open_type: "contact", //(redirect, contact, navigate, tel, web, app...)
        url: "pages/index/index", //(跳转路径， 可有可无, 与link_url二选一)
        link_url: "pages/index/index"//（跳转路径， 可有可无, 与link_url二选一）
    }
    
    //redirect: 重定向,
    
    //contact: 客服消息回调,
    
    //navigate: 跳转,
    
    //tel： 电话,
    
    //web： 网页，
    
    //app： 跳转其他小程序
    ```

## app-report-error

- 代码

    ```javascript
    // 服务端报错弹框, 在全局app-layout中使用
    
    //开启：
    this.$store.dispatch('gConfig/reportAndErrorB', true);
    //关闭：
    this.$store.dispatch('gConfig/reportAndErrorB', false);
    
    //传递报错信息
    //开启：
    this.$store.dispatch('gConfig/reportAndErrorObj', {
    boolean: true,
    content: '网络开了会儿小差， 请刷新重试下哦~'});
    
    //关闭：
    this.$store.dispatch('gConfig/reportAndErrorObj', {
    boolean: false,
    content: '网络开了会儿小差， 请刷新重试下哦~'});
    ```

## app-tab-bar

- 代码

    ```javascript
    // 底部导航,放在全局app-layout 中, 再次展现页面时，判断当前页面是否有tabbar
    // 在每一个可能存在tabbar的页面中 写上
    
        import { mapGetters } from "vuex";
        export default {
            computed: {
                ...mapGetters('mallConfig',{
                   tabBarNavs: 'getNavBar',
                })
            },
            onShow() {
                this.$store.dispatch('gConfig/setTabBarBoolean', this.tabBarNavs.navs);
            }
        }
    ```

## app-loading

- 代码

    ```html
    <app-loading></app-loading>
    ```

- 属性

    - type: loading 类型（字符串） 全局---global，小框--- toast
    
    ```html
    <app-loading type="toast"></app-loading>
    <app-loading type="global"></app-loading>
    ```
    
    - text: 显示文字 （字符串）
    
    ```html
    <app-loading text="加载中..."></app-loading>
    ```
    
    - backgroundImage: 背景图片(字符串)
    
    ````html
    <app-loading backgroundImage="图片地址"></app-loading>
    ````

## app-text

主题文字

- 代码

    ````html
    <app-text></app-text>
    ````

- 属性

    - theme: 主题色（字符串，变量）--- 变量需在props中定义
    ````html
    <app-text :theme="theme"></app-text>
    ````
    
    - fontSize: 文字大小
    
    ````html
    <app-text fontSize="23"></app-text>
    ````
    
    - color: 文字颜色
    
    ````html
    <app-text color="red"></app-text>
    ````

## app-map

注：字节跳动小程序不支持

- 代码

    ````html
     <!--#ifndef MP-TOUTIAO -->
        <app-map></app-map>
    <!-- #endif-->
    ````
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                      backgroundColor: '#ffffff',
                      backgroundPicUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                      height: 400,
                      latitude: '30.747440',
                      location: '30.747440,120.784830',
                      longitude: '120.784830',
                      marginTop: 20,
                      marginTopColor: "#ffffff",
                      paddingX: 40,
                      paddingY: 40,
                      }
            }
        }
    }
    ````

## app-copyright

- 代码

    ````html
    <app-copyright :data="data"></app-copyright>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                        backgroundColor: 'red',
                        link: {
                          data: {},
                          openType: '',
                          url: '',
                        },
                        picUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                        text: '盈享会科技',
                    }
            }
        }
    }
    ````

## app-video

- 代码

    ````html
    <app-video :newScrollTop="scrollTop"></app-video>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                scrollTop: 0
            }
        },
         onPageScroll: function(e) {
            this.$nextTick().then(() => {
                this.scrollTop = e.scrollTop;
            });
        },
    }
    ````

## app-search-for

- 代码

    ````html
    <app-search-for :data="data"></app-search-for>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                      background: `#968B8B`,
                      color: '#DECACA',
                      placeholder: '搜索',
                      radius: 10,
                      textColor: '#E8E3E3',
                      textPosition: `left`,
                }
            }
        }
    }
    ````

## app-quick-navigation

- 代码

    ````html
    <app-quick-navigation :data="data"></app-quick-navigation>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                  closedPicUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                  customerService: {
                      opened: true,
                      picUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                  },
                  home: {
                      opened: true,
                      picUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                  },
                  mApp: {
                      appId: '',
                      opened: false,
                      page: '',
                      picUrl: '',
                  },
                  mapNav: {
                      address: '南湖',
                      latitude: '30.762457',
                      location: '',
                      longitude: '120.763779',
                      opened: true,
                      picUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg'
                  },
                  navStyle: 1,
                  navSwitch: 1,
                  openedPicUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                  tel: {
                      number: '1885813481',
                      opened: true,
                      picUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                  },
                  useMallConfig: false,
                  web: {
                      opened: true,
                      picUrl: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                      url: 'www.baidu.com',
                  },
              }
            }
        }
    }
    ````

## app-navigation-icon

- 代码

    ```html
    <app-navigation-icon :data="data"></app-navigation-icon>
    ```
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                     background: "#C42929",
                     color: "#1358EE",
                     columns: 3,
                     navs: [
                           {
                               icon: "http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg",
                               icon_url: "http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg",
                               link_url: "/pages/index/index",
                               name: "导航13",
                               openType: "navigate",
                               open_type: "navigate",
                               url: "/pages/index/index",
                           },
                     ],
                     rows: 4,
                     scroll: true,
                    }
            }
        }
    }
    ````

## app-announcement

- 代码

    ````html
    <app-announcement :data="data"></app-announcement>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                    background: '#f67f79',
                    btnColor: '#ff4544',
                    btnHeight: 80,
                    btnRadius: 40,
                    btnText: '我知道了',
                    btnTextColor: '#ffffff',
                    btnWidth: 500,
                    content: 'sdfsdfsdfwerr2323232323232323232323232323232323232323232323232323232323232323232323',
                    headerUrl: 'https://www.bangdian.net/plugins/diy/assets/images/icon-notice-title.png',
                    icon: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                    name: '公告',
                    textColor: "#ffffff",
                }
            }
        }
    }
    ````

## app-special-topic-normal

- 代码

    ````html
    <template v-if="data.style === 'normal'">
        <app-special-topic-normal :data="data"></app-special-topic-normal>
    </template>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                data: {
                    cat_show: false,
                    count: 2,
                    icon: "https://www.bangdian.net/web/statics/img/app/topic/icon-topic-r.png",
                    list: [],
                    logo_1: "https://www.bangdian.net/web/statics/img/app/topic/icon-topic-1.png",
                    logo_2: "https://www.bangdian.net/web/statics/img/app/topic/icon-topic-2.png",
                    style: "normal",
                    topic_list: [
                        {
                            cover_pic: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                            id: 14,
                            layout: 0,
                            read_count: '0人浏览',
                            title: '专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一专题一',
                        }
                    ],
                }
            }
        }
    }
    ````

## app-special-topic-list

- 代码

    ````html
    <template v-if="data.style === 'list'">
        <app-special-topic-normal :topic_list="topic_list" :list="list" :cat_show="cat_show"></app-special-topic-normal>
    </template>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                 cat_show: {
                    type: Boolean,
                    default: function() {
                        return false;
                    }
                 },
                list: {
                    type: Array,
                    default: function() {
                        return [
                            {
                                cat_id: '18',
                                cat_name: '123',
                                children: [
                                ],
                                custom: false,
                                name: '附页',
                                number: 30,
                            },
                            {
                                cat_id: '18',
                                cat_name: '123',
                                children: [
                                    {
                                        cover_pic: 'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                                        id: 14,
                                        layout: 0,
                                        read_count: '0人浏览',
                                        title: '专题一',
                                    }
                                ],
                                custom: false,
                                name: '首页',
                                number: 30,
                            }
                        ];
                    }
                },
                topic_list: {
                    type: Array,
                    default: function() {
                        return [
                            {
                                cover_pic:'http://www.bangdian.net/web/uploads/mall51/20190724/3d3abd2944d5d32b9a9780fd3525bb50.jpg',
                                id: 15,
                                layout:1,
                                read_count: '0人浏览',
                                title: '专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二专题二',
                            }
                        ]
                    }
                }
            }
        }
    }
    ````

## app-tab-nav

- 代码

````html
<app-tab-nav setHeight="90" fontSize="32" :tabList="tabList" :activeItem="activeTab" @click="tabStatus" :theme="theme"></app-tab-nav>
````

- 属性

    - setHeight: 组件高度，不传，默认为90rpx（字符串）--- 单位为rpx，不需要传
    
    - fontSize: 字体大小，不传，默认为28rpx（字符串）--- 单位为rpx，不需要传
    
    - tabList: 数组，需要显示的tab栏，需name和id字段
    
    - activeItem: 当前激活的tab的id
    
    - theme: 主题色
    
    - tabStatus: 字体大小，不传，默认为32rpx（字符串）--- 单位为rpx，不需要传
    
    - click: 点击事件，事件名称可自定义
    
    ````javascript
    export default {
        data() {
            return {
                tabList: [
                    {id:1, name: '商品'},
                    {id:2, name: '专题'}
                ],
                activeTab: 1,
            }
        },
        methods: {
            tabStatus(e) {
                console.log(e)
            },
        }
    }
    ````

## app-reservation

- 代码

    ````html
      <app-reservation></app-reservation>
    ````
    
    ````javascript
    export default {
        props: {
            buttonColor: {
                type: String,
                default: function() {
                    return "blue";
                }
            },
            buyBtnStyle: {
                type: Number,
                default: function() {
                    return 4;
                }
            },
            buyBtnText: {
                type: String,
                default: function() {
                    return "预约";
                }
            },
            customizeGoodsTag: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            fill: {
                type: Number,
                default: function() {
                    return 0;
                }
            },
            goodsCoverProportion: {
                type: String,
                default: function() {
                    return "3-2";
                }
            },
            goodsStyle: {
                type: Number,
                default: function() {
                    return 3;
                }
            },
            goodsTagPicUrl: {
                type: String,
                default: function() {
                    return "http://v4test2.zjhejiang.com/plugins/diy/assets/images/goods-tag-xp.png";
                }
            },
            list: {
                type: Array,
                default: function() {
                    return [
                        {
                            cover_pic: "http://matianxia.oss-cn-qingdao.aliyuncs.com/uploads/20190426/ba493adde2ed99593821c1b5816e6775.png?x-oss-process=style/q90",
                            id: 13,
                            name: "TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST1",
                            page_url: "/plugins/book/goods/goods?goods_id=13",
                            price: "0.00",
                            price_content: "￥0.00",
                        },
                        {
                            cover_pic: "http://matianxia.oss-cn-qingdao.aliyuncs.com/uploads/20190428/3609e08f1dfa8c9c8449808b93331a36.png?x-oss-process=style/q90",
                            id: 47,
                            name: "预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】预约商品【免费】",
                            page_url: "/plugins/book/goods/goods?goods_id=47",
                            price: "10.00",
                            price_content: "￥10.00",
                        },
                    ];
                }
            },
            listStyle: {
                type: Number,
                default: function() {
                    return 1;
                }
            },
            showBuyBtn: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            showGoodsName: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            showGoodsTag: {
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            scrollTop: {
                type: Number,
                default: function() {
                    return 0;
                }
            },
            value: {
                type: Boolean,
                default: function() {
                    return true;
                }
            }
        }
    }
    ````

## app-model

- 代码

    ````html
    <app-model v-model="input">
        <view slot="title"></view>
        <view slot="content"></view>
    </app-model>
    ````
    
    ````javascript
    export default {
        data() {
            return {
                input: false,
            }
        },
        methods: {
            openHidden() {
                this.input = !this.input;
            }
        }
    }
    ````

## app-image-ad

- 代码

    ````html
    <app-image-ad></app-image-ad>
    ````
    
    ``````javascript
    export default {
        props: {
            h: {
                type: Number,
                default: function() {
                    return 1;
                }
            },
            height: {
                default: function() {
                    return 750;
                }
            },
            hotspot: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            list: {
                type: Array,
                default: function() {
                    return [
                    ];
                }
            },
            space: {
                type: Number,
                default: function() {
                    return 0;
                }
            },
            style: {
                type: Number,
                default: function() {
                    return 1;
                }
            },
            w: {
                type: Number,
                default: function() {
                    return 25;
                }
            }
        },
    }
    ``````

## app-diy-form

自定义表单

- 代码

    ```vue
    <app-diy-form
        :list="formList"
        :sign="anyValue"
        @input="handleInput"
        @validate="handleValidate"></app-diy-form>
        
    <script>
    export default {
        methods: {
            handleInput(result, sign) {
            },
            handleValidate(result, sign) {
            },
        }
    }
    </script>    
    ```
    
- 属性

    - title: String,表单标题

    - list: Object,传入的表单数据,实例值:
    
    ```
       [
           {
               key: 'text', // 类型（text,textarea,date,time,radio,checkbox,img_upload）
               name: '姓名', // 名称
               default: null, // 默认值
           },
           {
               key: 'radio',
               name: '性别',
               default: null,
               list: [
                   {label: '男', value: false},
                   {label: '女', value: true},
                   {label: '隐私', value: false}
               ],
           },
           {
               key: 'checkbox',
               name: '其他',
               default: null,
               list: [
                   {label: '不要辣', value: false},
                   {label: '不加葱', value: true},
                   {label: '多加盐', value: true}
               ],
           },
           {
               key: 'img_upload',
               name: '头像',
               default: null,
           },
           ... 
       ]
    ```
  
    - sign: Any,自定义传入参数,@input|@validate时将返回
  
- 事件

    - @input: 表单值有更新时触发,返回值:
    
        - data: 表单内容,示例: 
        
        ```
          [
            {
                key: 'text', // 类型（text,textarea,date,time,radio,checkbox,img_upload）
                name: '姓名', // 名称
                default: null, // 默认值
                value: '张三', // 表单值
            },
            {
                key: 'radio',
                name: '性别',
                default: null,
                list: [
                    {label: '男', value: false},
                    {label: '女', value: true},
                    {label: '隐私', value: false}
                ],
                value: '女',
            },
            {
                key: 'checkbox',
                name: '其他',
                default: null,
                list: [
                    {label: '不要辣', value: false},
                    {label: '不加葱', value: true},
                    {label: '多加盐', value: true}
                ],
                value: ['不加葱', '多加盐'],
            },
            {
                key: 'img_upload',
                name: '头像',
                default: null,
                value: 'http://xxx.xxx/abc.jpg',
            },
            ... 
          ]
        ```
    
        - sign: 自定义传入的值
    
    - @validate: 表单验证返回结果,返回值
    
        - result: 验证结果,示例:
          
        ```
          {
            hasError: false, // 表单填写内容是否有错误
            errors: [
              {
                index: 0, // 第几个表单
                msg: '"姓名不能为空"', // 错误信息
              },
            ]
          }
        ```
    
        - sign: 自定义传入的值
