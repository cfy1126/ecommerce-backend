# API 文档

## 产品相关接口

### GET /products
获取所有产品信息。返回产品列表,每个产品包含:
- id: 产品唯一标识
- name: 产品名称
- priceCents: 价格(分)
- imageUrl: 产品图片URL
- rating: 产品评分(1-5)
- description: 产品描述

## 购物车相关接口

### GET /cart-items
获取购物车中的所有商品。返回购物车商品列表,每个商品包含:
- productId: 产品ID
- quantity: 数量
- deliveryOptionId: 配送选项ID

查询参数:
- expand=product: 展开产品完整信息

### POST /cart-items
添加商品到购物车
请求体:
- productId: 产品ID
- quantity: 数量(1-10)

### PUT /cart-items/:productId
更新购物车中的商品
请求体:
- quantity: 新数量(可选)
- deliveryOptionId: 新配送选项ID(可选)

### DELETE /cart-items/:productId
从购物车中删除商品

### GET /payment-summary
获取购物车支付摘要信息,包括:
- totalItems: 商品总数
- productCostCents: 商品总价(分)
- shippingCostCents: 运费(分)
- totalCostBeforeTaxCents: 税前总价(分)
- taxCents: 税费(分,按10%计算)
- totalCostCents: 最终总价(分)

## 配送相关接口

### GET /delivery-options
获取所有配送选项。返回配送选项列表,每个选项包含:
- id: 选项ID
- name: 选项名称(如"标准配送")
- priceCents: 配送费用(分)
- deliveryDays: 预计送达天数

查询参数:
- expand=estimatedDeliveryTime: 展开预计送达时间(毫秒时间戳)

## 订单相关接口

### GET /orders
获取所有订单信息。返回订单列表,每个订单包含:
- id: 订单ID
- orderTimeMs: 下单时间(毫秒时间戳)
- totalCostCents: 订单总价(分)
- products: 商品列表
  - productId: 产品ID
  - quantity: 数量
  - estimatedDeliveryTimeMs: 预计送达时间

## 系统相关接口

### GET /reset
重置系统数据到默认状态,包括:
- 清空购物车
- 重置产品数据
- 重置配送选项
- 重置订单数据

## 静态资源

### GET /images/{image_name}
获取产品图片等静态资源。支持的图片格式:
- JPG
- PNG
- WebP
