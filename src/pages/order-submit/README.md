# order-submit页面参数说明

- **mch_list**: json字符串 || 必填

    demo:
    
    ```json
    [
      {
        "mch_id": 0,
        "goods_list": [
          {
            "id":34095,
            "attr":[
              {"attr_id":2,"attr_group_id":1}
            ],
            "num":1,
            "cat_id":0,
            "goods_attr_id":56717
          }
        ]
      }
    ]
    ```
    
- **preview_url**: 字符串 || 非必填 || 订单数据预览接口
  
- **submit_url**: 字符串 || 非必填 || 订单数据提交接口
  
- **order_page_url**: 字符串 || 非必填 || 支付完成或失败跳转的订单页面
  
    demo:

    ```
    /pages/order/index/index?status=0
    ```
- **total_title**: 字符串 ｜｜ 非必填 ｜｜ 左下角自定义"合计"的文字

- **theme**: 字符串｜｜非必填｜｜界面主题色
  
- **pay_data_url**: 字符串 || 非必填 || 查询订单队列状态及订单支付获取接口

- **show_pay_result** 字符串 true or false | 非必填 | 是否显示支付成功提示页面，默认显示，不显示的话会直接跳转到order_page_url设定的页面

- **pay_cancel_url** 字符串 | 非必填 | 取消支付跳转的页面，不填的话会直接跳转到order_page_url设定的页面，并附带pay_data参数（支付数据JsonEncode后的数据）
