import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Code, FileText, CheckCircle, ChevronLeft, ChevronRight, Clock, Lightbulb, Target, AlertTriangle } from 'lucide-react';

// 10个电商数据分析实战项目的详细文字内容
const projectData = {
  '1': {
    id: '1',
    title: '项目1：电商购物车关联规则挖掘',
    chapters: {
      '1': {
        id: '1',
        title: '项目概述与数据准备',
        content: `# 项目概述与数据准备

## 一、项目背景

在电商平台中，了解用户的购物行为模式对于提升销售和用户体验至关重要。关联规则挖掘是一种经典的数据挖掘方法，可以从用户交易数据中发现商品之间的潜在关联关系。

典型的应用场景：
- 当用户将 A 商品加入购物车时，自动推荐常被一起购买的 B 商品
- 在商品详情页展示 "买了该商品的用户还买了"
- 设计商品组合促销套餐

本项目我们将使用一个模拟的购物车交易数据集，通过 Python 进行关联规则挖掘，产出可直接用于推荐的规则表。

## 二、业务目标

1. 识别在订单中经常被一起购买的商品组合
2. 计算关联规则的支持度、置信度、提升度
3. 生成 "购买 A 的用户也倾向于购买 B" 的推荐列表
4. 为运营提供可落地的组合营销建议

## 三、数据准备与理解

我们使用如下结构的订单数据（order_items.csv）：

| 字段 | 含义 | 示例 |
|------|------|------|
| order_id | 订单唯一标识 | O00001 |
| user_id  | 用户ID | U1001 |
| product_name | 商品名称 | 手机壳 |
| quantity | 购买数量 | 2 |
| order_date | 下单日期 | 2024-01-05 |

### 数据形状与基本统计

在 pandas 中可以快速了解数据概况：

\`\`\`python
import pandas as pd

df = pd.read_csv('order_items.csv')
print(df.shape)           # (行数, 列数)
print(df.head())          # 查看前几行
print(df['order_id'].nunique())   # 订单数
print(df['product_name'].nunique()) # 商品种类数
\`\`\`

### 数据预处理

常见需要处理的问题：
- 缺失值：空订单、空商品名 → 使用 dropna() 删除或 fillna() 填充
- 重复记录：同一订单中同一商品可能出现多行 → 使用 groupby 聚合
- 退货/取消订单：数量为负 → 过滤掉 quantity <= 0 的记录
- 大小写/空格不一致："手机壳 " 和 "手机壳" 应视为同一商品 → 使用 str.strip()

\`\`\`python
# 清洗数据
df_clean = (
    df.dropna(subset=['order_id', 'product_name'])
      .assign(product_name=lambda x: x['product_name'].str.strip())
      .query('quantity > 0')
)
\`\`\`

## 四、把订单数据转换为 "购物篮" 格式

关联规则算法的输入是一个 "购物篮列表"：

- 每个购物篮 = 同一个订单中出现的商品集合
- 格式如：\`[['牛奶', '面包'], ['牛奶', '啤酒', '尿布'], ...]\`

在 pandas 中可以通过 groupby + apply 完成：

\`\`\`python
baskets = (
    df_clean.groupby('order_id')['product_name']
            .apply(lambda x: sorted(set(x)))
            .tolist()
)
print('购物篮数量：', len(baskets))
print('前3个篮子：', baskets[:3])
\`\`\`

## 五、高频商品预览

在正式建模前，了解哪些商品 "最常被购买" 很重要：

\`\`\`python
top_products = (
    df_clean['product_name'].value_counts()
                            .head(10)
)
top_products.plot(kind='bar')
\`\`\`

通过观察 Top 商品，可以帮助判断：
- 平台的核心品类是什么
- 关联规则挖掘出的结果是否与业务直觉一致
- 是否有某些 SKU 数量过大导致规则被 "带偏"

## 六、本章小结

- 关联规则挖掘需要以 "购物篮"（订单 → 商品集合）作为输入
- 数据准备阶段要重点关注缺失值、重复值、异常值
- 查看 Top 商品可以帮助校验结果是否合理
- 下一章节将正式介绍支持度、置信度、提升度三个核心指标

## 思考与练习

1. 如果一份订单数据没有 order_id 字段，你怎么构造购物篮？
2. 为什么需要用 \`set(x)\` 去重？同一个人在同一个订单里买两件 "牛奶" 应该计几次？
3. 尝试用自己的语言解释 "支持度" "置信度" 这两个概念（将在下一章正式定义）。`,
        lessons: [
          { id: '1', title: '项目背景与目标', type: 'reading', duration: 15, completed: false },
          { id: '2', title: '数据加载与探索', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '关联规则核心指标（支持度、置信度、提升度）',
        content: `# 关联规则核心指标

## 一、三个核心指标

一条关联规则通常写成：\`A → B\`（购买 A 的用户也购买了 B）。

### 1. 支持度 Support

支持度指 "A 和 B 同时出现在一个篮子里的订单比例"：

    Support(A→B) = 包含{A,B}的订单数 / 总订单数

支持度高的规则意味着该组合出现得足够频繁，是稳定可靠的模式。

### 2. 置信度 Confidence

置信度指 "购买 A 的订单中，同时也购买了 B 的比例"：

    Confidence(A→B) = Support(A,B) / Support(A)

高置信度说明 A 的出现强烈地伴随着 B 的出现。

### 3. 提升度 Lift

提升度衡量 "A 的出现使 B 被购买的概率提升了多少倍"：

    Lift(A→B) = Confidence(A→B) / Support(B)

- Lift > 1：A 对 B 有正向促进作用
- Lift ≈ 1：A 和 B 相互独立
- Lift < 1：A 和 B 互相替代（A 的出现反而减少 B 的购买）

通常运营更感兴趣的是 **Lift > 1 且 Support 不太低** 的规则。

## 二、手动计算示例

假设有 5 个订单：

1. 牛奶, 面包
2. 牛奶, 啤酒, 尿布
3. 面包, 啤酒, 尿布, 鸡蛋
4. 牛奶, 面包, 啤酒
5. 面包, 鸡蛋

计算规则 \`牛奶 → 啤酒\`：

- Support(牛奶) = 3/5 = 0.6
- Support(牛奶, 啤酒) = 2/5 = 0.4
- Confidence = 0.4 / 0.6 = 0.67（买牛奶的订单里 67% 也买了啤酒）
- Support(啤酒) = 3/5 = 0.6
- Lift = 0.67 / 0.6 = 1.11

## 三、Python 手动实现（for 学习理解）

\`\`\`python
from itertools import combinations
from collections import defaultdict

# 统计商品频率
single_count = defaultdict(int)
pair_count = defaultdict(int)
N = len(baskets)

for basket in baskets:
    items = set(basket)
    for item in items:
        single_count[item] += 1
    for a, b in combinations(sorted(items), 2):
        pair_count[(a, b)] += 1

# 生成规则表
rules = []
for (a, b), cnt in pair_count.items():
    support_ab = cnt / N
    conf_ab = cnt / single_count[a]
    conf_ba = cnt / single_count[b]
    lift_ab = conf_ab / (single_count[b] / N)
    rules.append({
        'A': a, 'B': b,
        'support': support_ab,
        'confidence(A→B)': conf_ab,
        'lift': lift_ab,
    })

rules_df = pd.DataFrame(rules).sort_values('lift', ascending=False)
rules_df.head(10)
\`\`\`

## 四、为什么不暴力枚举所有子集？

当商品数 p 很大时，候选项集数量是 2^p - 1，无法穷尽。

**Apriori 原理**：如果一个项集是频繁的（支持度 ≥ 阈值），那么它的所有子集也一定是频繁的。反过来，如果某个项集非频繁，则它的超集一定也非频繁，可以直接剪枝。

这极大减少了需要计算的项集数量，是 Apriori 算法的核心思想。

## 五、本章小结

- 支持度、置信度、提升度是评估关联规则的三维指标
- Lift > 1 才有正向推荐意义
- 手动实现可以帮助你理解每一个指标的真实含义
- 工业级实现会使用 mlxtend 等库，避免自己写的算法性能问题

## 思考与练习

1. 如果某条规则置信度很高（0.95），但支持度只有 0.001，你会使用它做推荐吗？为什么？
2. 举一个生活中的例子，使得 "A → B" 的置信度很高但提升度 ≈ 1。
3. 尝试把上面的手动代码改成可筛选 \`min_support=0.02\` 的版本。`,
        lessons: [
          { id: '4', title: '支持度计算', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '置信度与提升度', type: 'reading', duration: 25, completed: false },
          { id: '6', title: '手动实现关联规则', type: 'code', duration: 45, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: 'mlxtend 库的 Apriori 实现',
        content: `# mlxtend 库的 Apriori 实现

## 一、mlxtend 简介

mlxtend（machine learning extensions）是一个 Python 库，提供了一系列 scikit-learn 风格的工具函数，包括：

- 频繁项集挖掘（Apriori、FP-growth）
- 关联规则生成
- 堆叠集成学习、特征选择等辅助工具

安装：

    pip install mlxtend

## 二、数据格式转换：TransactionEncoder

Apriori 函数要求输入是 "一行一订单、一列一商品" 的布尔型 DataFrame：

| 订单 | 牛奶 | 面包 | 啤酒 | 尿布 |
|------|------|------|------|------|
| 1    | True | True | False| False|
| 2    | True | False| True | True |
| ...  | ...  | ...  | ...  | ...  |

TransactionEncoder 可以帮我们一键完成转换：

\`\`\`python
from mlxtend.preprocessing import TransactionEncoder

te = TransactionEncoder()
te_ary = te.fit(baskets).transform(baskets)
basket_df = pd.DataFrame(te_ary, columns=te.columns_)

print(basket_df.shape)  # (订单数, 商品数)
basket_df.head()
\`\`\`

## 三、调用 apriori 找频繁项集

\`\`\`python
from mlxtend.frequent_patterns import apriori

frequent_itemsets = apriori(
    basket_df,
    min_support=0.02,       # 支持度阈值，可调节
    use_colnames=True,      # 直接用列名，而不是索引
    max_len=3,              # 最多考虑 3 项集
)

# 按支持度降序
frequent_itemsets = frequent_itemsets.sort_values('support', ascending=False)
\`\`\`

\`itemsets\` 列是一个 frozenset，如 \`frozenset({'牛奶', '面包'})\`。

## 四、生成关联规则

\`\`\`python
from mlxtend.frequent_patterns import association_rules

rules = association_rules(
    frequent_itemsets,
    metric='lift',
    min_threshold=1.2,
)

# 按提升度降序
rules = rules.sort_values('lift', ascending=False).reset_index(drop=True)
rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].head(10)
\`\`\`

## 五、结果解读与业务建议

典型输出示例：

| antecedents | consequents | support | confidence | lift |
|-------------|-------------|---------|------------|------|
| {手机壳}    | {钢化膜}    | 0.12    | 0.72       | 3.45 |
| {啤酒}      | {尿布}      | 0.08    | 0.45       | 2.12 |

我们可以据此制定策略：

1. 把 "手机壳 + 钢化膜" 做成组合立减套餐
2. 在商品详情页，买手机壳的用户自动推荐钢化膜
3. 对高置信度、高提升度的组合给予首页推荐位资源

## 六、常见问题

- **min_support 太高**：规则太少，失去挖掘意义
- **min_support 太低**：得到大量噪声规则，Lift 也不可靠
- **商品粒度太细**：如 "红色手机壳6.1寸" 与 "蓝色手机壳6.7寸" 各自稀疏。可先归并到 "手机壳" 再做分析

## 七、本章小结

- mlxtend 的 TransactionEncoder 负责把购物篮列表转为布尔矩阵
- apriori() 得到频繁项集，association_rules() 得到规则表
- 结果要以 support × confidence × lift 三维度联合筛选
- 最终规则需结合业务知识判断其是否可落地

## 思考与练习

1. 为什么我们通常先按 lift 排序，而不是按置信度？
2. 若数据中出现一条规则 \`{热门商品} → {冷门商品}\`，lift 可能很高，但置信度通常会怎样？为什么？
3. 把上面的代码在自己的环境里跑一次，把输出保存为 CSV 交给运营同事。`,
        lessons: [
          { id: '7', title: 'mlxtend 入门', type: 'reading', duration: 20, completed: false },
          { id: '8', title: 'TransactionEncoder 使用', type: 'code', duration: 30, completed: false },
          { id: '9', title: '生成关联规则', type: 'code', duration: 25, completed: false },
        ],
      },
      '4': {
        id: '4',
        title: '推荐系统实现与项目总结',
        content: `# 推荐系统实现与项目总结

## 一、从 "规则表" 到 "推荐函数"

我们已经得到了一张规则表。但业务上需要的是：**给定商品 A，返回推荐商品列表**。

推荐函数的思路：

1. 筛选出规则中 \`antecedents\` 包含 A 的所有规则
2. 按 lift 降序排列（或自定义打分函数）
3. 取前 N 个作为推荐结果

\`\`\`python
def recommend(item, rules, top_n=5):
    # 找到包含 item 的规则
    matched = rules[rules['antecedents'].apply(lambda x: item in x)].copy()
    # 去重（不同项集可能都含 item）
    matched = matched.sort_values('lift', ascending=False)
    matched['rec_item'] = matched['consequents'].apply(lambda x: ', '.join(x))
    return matched[['rec_item', 'support', 'confidence', 'lift']].head(top_n)

# 测试
recommend('手机壳', rules, top_n=5)
\`\`\`

## 二、把 "推荐原因" 展示给用户

只给一个商品名还不够，运营/算法同学需要看到 "为什么推荐它"：

\`\`\`python
def explain(item, rules):
    rec = recommend(item, rules, top_n=5)
    for _, row in rec.iterrows():
        print(f"推荐【{row['rec_item']}】")
        print(f"  原因：同时购买的支持度 {row['support']:.1%}，"
              f"置信度 {row['confidence']:.1%}，提升度 {row['lift']:.2f}")
\`\`\`

## 三、项目完整报告模板

一个好的数据项目必须能 "讲给业务方听"，建议包含如下结构：

1. **项目目标**：发现商品之间的强关联关系，用于推荐与组合营销
2. **数据概况**：订单数、商品数、时间范围
3. **方法**：Apriori + mlxtend
4. **核心发现**：Top 10 规则表
5. **业务建议**：
   - 手机壳 ↔ 钢化膜：捆绑销售
   - 啤酒 ↔ 尿布：陈列位置靠近
   - ...
6. **后续迭代**：
   - 按用户分群做个性化规则
   - 引入时间序列，观察规则在大促/平日的差异
   - A/B 测试上线推荐功能的转化率提升

## 四、可视化：规则散点图

把规则可视化为散点（x=support, y=confidence, 气泡大小=lift），可以一眼看出哪些规则 "又稳又强"：

\`\`\`python
import matplotlib.pyplot as plt

plt.figure(figsize=(10, 6))
plt.scatter(
    rules['support'],
    rules['confidence'],
    c=rules['lift'],
    cmap='viridis',
    alpha=0.7,
    s=rules['lift'] * 40,
)
plt.xlabel('支持度 Support')
plt.ylabel('置信度 Confidence')
plt.title('关联规则散点图（颜色=提升度）')
plt.colorbar(label='Lift')
plt.show()
\`\`\`

## 五、常见踩坑总结

1. **数据量太小**：商品长尾稀疏，结果不稳定
2. **把品类当商品**：商品粒度太细会导致支持度都接近 0
3. **只看 lift**：高 lift 但低 support 的规则业务价值有限
4. **不做时间验证**：用 7 月发现的规则验证 8 月数据，看是否仍成立

## 六、本章小结

- 把算法输出包装成业务可调用的 recommend() 函数
- 报告结构要让没有算法背景的同事也能看懂
- 可视化 + 结论比代码更能推动决策
- 项目结束不等于终点：持续验证、持续迭代

至此，你已经具备用 Python 完成一个 "购物车关联规则挖掘" 完整项目的能力。下一个项目我们将进入用户维度，进行 RFM + 聚类的用户价值分析。`,
        lessons: [
          { id: '10', title: '推荐词条生成', type: 'reading', duration: 20, completed: false },
          { id: '11', title: '构建推荐函数', type: 'code', duration: 45, completed: false },
          { id: '12', title: '项目总结与报告', type: 'reading', duration: 25, completed: false },
        ],
      },
    },
  },
  '2': {
    id: '2',
    title: '项目2：用户消费行为RFM分析与价值聚类',
    chapters: {
      '1': {
        id: '1',
        title: 'RFM 模型基础',
        content: `# RFM 模型基础

## 一、什么是 RFM

RFM 是一种经典的客户价值细分方法，来源于直邮营销行业，后来被广泛用于电商、SaaS 等场景。

它由三个维度的首字母组成：

| 维度 | 含义 | 计算方法 |
|------|------|----------|
| **Recency** （最近度） | 最近一次消费距今天数 | today - max(order_date) |
| **Frequency** （消费频次） | 周期内下单次数 | count(distinct order_id) |
| **Monetary**（消费金额） | 周期内消费金额 | sum(amount) |

核心假设：
- Recency 越小，用户越活跃，流失风险越低
- Frequency 越大，用户越 "忠实"
- Monetary 越大，用户价值越高

## 二、数据准备

典型订单表结构：

| 字段 | 含义 |
|------|------|
| user_id | 用户 ID |
| order_id | 订单 ID |
| order_date | 下单日期 |
| amount | 订单金额 |

### 去重与清洗

\`\`\`python
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['order_date'])

# 只保留已支付订单
orders = orders[orders['status'] == 'paid']

# 删除重复订单（如果有）
orders = orders.drop_duplicates(subset=['order_id'])

# 确定分析截止日（通常取数据中最大日期 + 1 天）
snapshot_date = orders['order_date'].max() + pd.Timedelta(days=1)
print('分析截止日：', snapshot_date)
\`\`\`

## 三、计算 RFM 特征

\`\`\`python
rfm = (
    orders.groupby('user_id').agg(
        recency=('order_date', lambda x: (snapshot_date - x.max()).days),
        frequency=('order_id', 'nunique'),
        monetary=('amount', 'sum'),
    ).reset_index()
)

rfm.describe()
\`\`\`

得到的 rfm DataFrame 形如：

| user_id | recency | frequency | monetary |
|---------|---------|-----------|----------|
| U001    | 5       | 12        | 2380.5   |
| U002    | 42      | 3         | 288.0    |
| ...     | ...     | ...       | ...      |

## 四、RFM 打分（等频分箱）

经典做法是把每个维度分成 1-5 分：

- Recency：**越小越好** → Recency ∈ 最小 20% 的用户给 5 分
- Frequency、Monetary：**越大越好** → 属于最大 20% 的用户给 5 分

\`\`\`python
rfm['R_score'] = pd.qcut(rfm['recency'], 5, labels=[5,4,3,2,1])
rfm['F_score'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
rfm['M_score'] = pd.qcut(rfm['monetary'].rank(method='first'), 5, labels=[1,2,3,4,5])

# 转为整数以便运算
for col in ['R_score','F_score','M_score']:
    rfm[col] = rfm[col].astype(int)

rfm['RFM_score'] = rfm['R_score'] + rfm['F_score'] + rfm['M_score']
\`\`\`

## 五、经典的用户分群（基于规则）

| 群体 | R | F | M | 运营策略 |
|------|---|---|---|---------|
| **重要价值用户** | 高 | 高 | 高 | VIP 维护、专属客服 |
| **重要发展用户** | 高 | 低 | 高 | 提升复购 |
| **重要挽留用户** | 低 | 高 | 高 | 召回活动 |
| **一般价值用户** | 中 | 中 | 中 | 一般运营 |
| **流失用户** | 低 | 低 | 低 | 可放弃/低成本召回 |

\`\`\`python
def segment(row):
    if row['R_score'] >= 4 and row['F_score'] >= 4 and row['M_score'] >= 4:
        return '重要价值用户'
    if row['R_score'] >= 4 and row['F_score'] <= 2 and row['M_score'] >= 4:
        return '重要发展用户'
    if row['R_score'] <= 2 and row['F_score'] >= 4 and row['M_score'] >= 4:
        return '重要挽留用户'
    if row['R_score'] <= 2 and row['F_score'] <= 2 and row['M_score'] <= 2:
        return '流失用户'
    return '一般价值用户'

rfm['segment_rule'] = rfm.apply(segment, axis=1)
\`\`\`

## 六、本章小结

- RFM 是一套非常实用的客户价值分层方法，概念简单、可解释强
- 计算重点在于正确理解每个维度的业务含义与 "好/坏" 的方向
- 分箱常用 qcut（等频），也可结合业务经验用固定阈值
- 基于规则即可得到初步分群，结果可直接用于运营

## 思考与练习

1. 如果你的平台是按月订阅的 SaaS，Recency 仍然是 "最后一次登录天数" 吗？Frequency 该怎么定义？
2. 某些用户整个生命周期只有 1 单但金额巨大（B 端大客），他的 F_score 会很低，怎么平衡？
3. 用自己的数据跑一遍 RFM，观察 segment 分布。`,
        lessons: [
          { id: '1', title: 'RFM 理论讲解', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '数据准备', type: 'code', duration: 35, completed: false },
          { id: '3', title: '特征计算', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: 'KMeans 聚类实现用户分群',
        content: `# KMeans 聚类实现用户分群

## 一、为什么要用聚类？

上一章我们用 "规则" 对 RFM 进行了分群。但规则有两个问题：

1. **分群数量是人为定的**（重要价值 / 重要发展 / ...），不一定贴合真实数据结构
2. **边界太硬**：R=4.1 与 R=3.9 在规则下可能是两个完全不同的人群，但事实上他们很接近

聚类是一种无监督学习方法，可以让数据 "自己说话"，自然地把相似用户聚在一起。

## 二、KMeans 原理简述

KMeans 的核心思想：

1. 随机选 K 个点作为 "聚类中心"
2. 把每个点分配给最近的中心
3. 每个中心更新为它所管辖点的均值
4. 重复 2-3 直到中心不再大幅移动

目标函数是让 "每个点到其所属中心的距离平方和最小"。

## 三、特征标准化

KMeans 基于欧氏距离，各维度量纲要一致。R、F、M 的数值范围通常差异很大，必须先标准化：

\`\`\`python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

X = rfm[['recency', 'frequency', 'monetary']]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
\`\`\`

## 四、肘部法则：选 K

\`\`\`python
inertias = []
for k in range(2, 10):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

plt.plot(range(2, 10), inertias, 'o-')
plt.xlabel('K')
plt.ylabel('组内平方和 Inertia')
plt.title('肘部法则');
\`\`\`

找到 "拐点" 位置（如 K=4），就是相对合理的聚类数。

## 五、训练模型

\`\`\`python
k = 4
km = KMeans(n_clusters=k, random_state=42, n_init=10)
rfm['cluster'] = km.fit_predict(X_scaled)

# 查看每群的人数
rfm['cluster'].value_counts()
\`\`\`

## 六、给每个聚类 "起名字"

聚类只给了 0/1/2/3 的标签，我们需要结合每个簇的 RFM 均值来解释：

\`\`\`python
cluster_profile = (
    rfm.groupby('cluster')[['recency','frequency','monetary']]
       .mean()
       .round(2)
)
print(cluster_profile)
\`\`\`

根据结果命名：

| cluster | recency | frequency | monetary | 命名 |
|---------|---------|-----------|----------|------|
| 0       | 低      | 高        | 高       | 重要价值 |
| 1       | 低      | 低        | 中       | 新用户/潜力 |
| 2       | 高      | 低        | 低       | 流失边缘 |
| 3       | 中      | 中        | 中       | 一般 |

\`\`\`python
names = {0: '重要价值', 1: '新用户', 2: '流失边缘', 3: '一般'}
rfm['cluster_name'] = rfm['cluster'].map(names)
\`\`\`

## 七、本章小结

- KMeans 比规则分群更贴合真实数据结构
- 标准化是 KMeans 的必要前置步骤
- 肘部法则帮你选一个合理的 K
- 聚类结果一定要结合业务含义 "命名"，否则算法结果无法被业务使用

## 思考与练习

1. 为什么聚类前要做标准化？如果跳过会发生什么？
2. 肘部法则得到的是 3，业务方却希望 5 个群体方便分层运营，你怎么处理？
3. 如何用轮廓系数 silhouette_score 辅助选 K？尝试搜索并实现。`,
        lessons: [
          { id: '4', title: 'KMeans 聚类原理', type: 'reading', duration: 25, completed: false },
          { id: '5', title: '特征标准化', type: 'code', duration: 30, completed: false },
          { id: '6', title: '聚类模型训练', type: 'code', duration: 35, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '群体分析与运营策略',
        content: `# 群体分析与运营策略

## 一、雷达图：一眼看懂各群体特征

雷达图在 RFM 分析中非常直观。做法是把每个群体的 R/F/M 分数（或标准化值）映射到 0-100 的刻度上，再画多边形。

\`\`\`python
import numpy as np

profile = rfm.groupby('cluster_name')[['recency','frequency','monetary']].mean()
# 做一个简单的归一化（0-1）
for col in profile.columns:
    profile[col] = (profile[col] - profile[col].min()) / (profile[col].max() - profile[col].min() + 1e-9)

categories = ['Recency', 'Frequency', 'Monetary']
N = len(categories)

angles = [n / float(N) * 2 * np.pi for n in range(N)]
angles += angles[:1]

plt.figure(figsize=(8, 8))
ax = plt.subplot(111, polar=True)

for cluster_name, row in profile.iterrows():
    values = row.values.tolist()
    values += values[:1]
    ax.plot(angles, values, 'o-', linewidth=2, label=cluster_name)
    ax.fill(angles, values, alpha=0.2)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories)
plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
plt.title('用户群体雷达图');
\`\`\`

## 二、每个群体的规模与价值

\`\`\`python
summary = (
    rfm.groupby('cluster_name')
       .agg(人数=('user_id', 'count'),
            总金额=('monetary', 'sum'))
       .reset_index()
)
summary['人数占比'] = summary['人数'] / summary['人数'].sum()
summary['金额占比'] = summary['总金额'] / summary['总金额'].sum()
summary.sort_values('金额占比', ascending=False)
\`\`\`

常见结论是：**20% 的用户贡献 80% 的销售额（帕累托法则）**。确认你的平台是否符合。

## 三、制定差异化运营策略

| 群体 | 策略 | 关键 KPI |
|------|------|---------|
| 重要价值 | VIP 专属权益、生日礼遇、高客单新品推送 | 保持月活、客单价稳定 |
| 新用户/潜力 | 新人首单优惠、引导完成 3 单 → 进入高价值圈层 | 30 天复购率 |
| 流失边缘 | 大额优惠券、短信/邮件召回、关注流失原因 | 召回率 |
| 一般 | 常规促活、不消耗高成本资源 | 活跃度 |

## 四、案例解读

假设你得到的数据：

- 重要价值用户占比 8%，贡献销售额 52% → 典型二八结构
- 流失边缘用户占比 35%，贡献销售额仅 9% → 该群体需要重点干预，否则占比会越来越大

## 五、本章小结

- 雷达图是给 RFM 结果 "讲故事" 的好工具
- 不仅要看 "多少人"，更要看 "多少钱"，判断资源投入优先级
- 分群的终极意义是：**不同人群用不同的运营动作**
- 策略上线后务必 A/B 测试，用数据验证假设（见项目 9）

## 思考与练习

1. 如果平台的 VIP 客服人力只有 20 人/天，你怎么分配给 "重要价值用户"？
2. 设计一个给 "流失边缘用户" 的召回策略，并给出你衡量该策略成功与否的指标。
3. 把上述 radar 图改成 3D 散点图（x=R, y=F, z=M, color=cluster），可视化群体分布。`,
        lessons: [
          { id: '7', title: '群体特征分析', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '可视化展示', type: 'code', duration: 40, completed: false },
          { id: '9', title: '营销策略制定', type: 'reading', duration: 25, completed: false },
        ],
      },
    },
  },
  '3': {
    id: '3',
    title: '项目3：异常订单检测',
    chapters: {
      '1': {
        id: '1',
        title: '数据质量检查',
        content: `# 数据质量检查

## 一、为什么要做异常检测

脏数据会导致脏分析。数据分析圈流行一句话："Garbage in, garbage out."（垃圾进，垃圾出）。

一份订单数据里的典型异常：

| 类型 | 例子 | 对下游影响 |
|------|------|-----------|
| 缺失值 | order_amount 为空 | 聚合时被排除，GMV 被低估 |
| 重复值 | 同一订单出现多行 | 订单金额被重复计算 |
| 异常值 | 订单金额 = 999999 | 均值/总和被严重拉偏 |
| 不合理业务值 | 订单日期 "2099-01-01" | 时序分析出错 |
| 格式不一致 | 金额既有 "￥100" 又有 "100.0" | 类型转换失败 |

## 二、总体诊断流程（Data Quality Report）

\`\`\`python
import pandas as pd

df = pd.read_csv('orders.csv')

# 1. 基本形状
print('Shape:', df.shape)

# 2. 每列缺失值数
print('\nMissing values:')
print(df.isnull().sum())

# 3. 每列数据类型
print('\nDtypes:')
print(df.dtypes)

# 4. 数值列统计
print('\nDescribe:')
print(df.describe(include='all'))
\`\`\`

## 三、重复值处理

\`\`\`python
# 查看整行重复
dup_rows = df.duplicated().sum()
print(f'整行重复：{dup_rows} 行')

# 按业务主键去重（订单号）
dup_orders = df['order_id'].duplicated(keep=False).sum()
print(f'重复订单号：{dup_orders}')

# 保留第一次出现
df = df.drop_duplicates(subset=['order_id'], keep='first')
\`\`\`

## 四、缺失值策略

- **数值列**：均值 / 中位数 / 0 / 删除
- **文本列**：空字符串 / '未知' / 删除
- **时间列**：用订单创建时间回填 / 用众数日期

选择策略取决于：缺失原因是什么？是 "该字段真的没有" 还是 "数据采集失败"？

\`\`\`python
# 例：amount 缺失用同品类当日均值填充
df['amount'] = df['amount'].fillna(
    df.groupby(['category', 'order_date'])['amount'].transform('mean')
)
\`\`\`

## 五、业务不合理值

\`\`\`python
# 订单金额为负或 0
print('异常金额（<=0）订单数：', (df['amount'] <= 0).sum())

# 未来日期
print('未来日期订单数：', (df['order_date'] > pd.Timestamp('today')).sum())

# 购买数量过大（如 > 1000 件的订单）
print('数量>1000 订单数：', (df['quantity'] > 1000).sum())
\`\`\`

## 六、本章小结

- 数据质量检查 = "看整体 → 找缺失 → 去重复 → 挑不合理"
- 每一步都要问 "为什么会这样"，而不是 "直接替换"
- 清洗后的数据要再跑一次 describe 以确认

## 思考与练习

1. 描述一种缺失值场景，你会选择 "删除" 而不是 "填充"，为什么？
2. 描述一种你在实际项目中遇到过的数据质量问题，如何解决？
3. 用上面的代码在你自己的数据上跑一次，把问题清单整理给数据工程同事。`,
        lessons: [
          { id: '1', title: '常见数据问题', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '缺失值处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '重复值处理', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '规则检测方法（Z-Score 与 IQR）',
        content: `# 规则检测方法

## 一、Z-Score 方法

Z-Score 告诉我们一个数据点距离均值有多少个标准差：

    z = (x - μ) / σ

常用阈值：|z| > 3 视为异常（正态分布中此概率约 0.3%）。

\`\`\`python
import numpy as np

mu = df['amount'].mean()
sigma = df['amount'].std(ddof=0)

df['z_score'] = (df['amount'] - mu) / sigma
outliers_z = df[df['z_score'].abs() > 3]
print('Z-Score 识别的异常订单数：', len(outliers_z))
\`\`\`

**优点**：简单、快速；**缺点**：对偏态分布效果差（均值和标准差本身就被极值污染）。

## 二、IQR（四分位距）方法

IQR = Q3 - Q1。异常判定：

- 下边界 = Q1 - 1.5 × IQR
- 上边界 = Q3 + 1.5 × IQR

箱线图 (boxplot) 正是基于这个原理。

\`\`\`python
Q1 = df['amount'].quantile(0.25)
Q3 = df['amount'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers_iqr = df[(df['amount'] < lower) | (df['amount'] > upper)]
print('IQR 识别的异常订单数：', len(outliers_iqr))
print(f'正常金额范围：[{lower:.1f}, {upper:.1f}]')
\`\`\`

**优点**：对偏态稳健；**缺点**：当数据本身就 "肥尾"，1.5 × IQR 的经验值过于保守或激进。

## 三、分品类处理更合理

"金额 1000" 对电子产品可能很正常，对零食就可能是异常。建议分品类计算：

\`\`\`python
def flag_outlier(group):
    q1, q3 = group['amount'].quantile([0.25, 0.75])
    iqr = q3 - q1
    return (group['amount'] < q1 - 1.5*iqr) | (group['amount'] > q3 + 1.5*iqr)

df['is_outlier'] = df.groupby('category', group_keys=False).apply(flag_outlier)
\`\`\`

## 四、可视化辅助

\`\`\`python
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
df.boxplot(column='amount', ax=ax1)
ax1.set_title('金额箱线图')

df['amount'].hist(bins=50, ax=ax2)
ax2.set_title('金额分布')
plt.yscale('log');
\`\`\`

## 五、本章小结

- Z-Score 适合 "近正态" 数据
- IQR 更稳健，在电商金额这种右偏数据上更常见
- 建议 "分品类" 做异常判定
- 可视化一定要看，光看指标容易遗漏分布形态

## 思考与练习

1. 举例一种 Z-Score 会误判、IQR 能正确识别的场景。
2. 当你用 IQR=1.5 × 识别出 15% 的订单为 "异常"，你会怎么做？
3. 实现一个函数：对任意数值列返回 DataFrame（含 is_outlier + 上下边界）。`,
        lessons: [
          { id: '4', title: 'Z-Score 原理', type: 'reading', duration: 20, completed: false },
          { id: '5', title: 'IQR 方法实现', type: 'code', duration: 35, completed: false },
          { id: '6', title: '业务规则校验', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: 'AI 检测对比（Isolation Forest）',
        content: `# AI 检测对比

## 一、Isolation Forest 简介

Isolation Forest（孤立森林）是一种基于 "随机切分 + 树结构" 的异常检测算法。

**核心直觉**：异常点因为 "与众不同"，更容易被随机切分孤立出来（路径长度短）；正常点则需要多次切分才能被孤立（路径长度长）。

优势：
- 无需假设分布
- 对高维数据友好
- 训练速度快

## 二、sklearn 实现

\`\`\`python
from sklearn.ensemble import IsolationForest

# 选取用于异常检测的特征
features = df[['amount', 'quantity']].fillna(0)

# 训练模型
iso = IsolationForest(
    n_estimators=200,
    contamination=0.05,   # 期望异常比例 5%
    random_state=42,
)
df['if_score'] = iso.fit_predict(features)    # 1=正常，-1=异常
df['if_anomaly'] = (df['if_score'] == -1)

print('Isolation Forest 识别异常数：', df['if_anomaly'].sum())
\`\`\`

## 三、三种方法交叉对比

\`\`\`python
# 先用前面定义的 IQR 标志
df['iqr_anomaly'] = (df['amount'] < lower) | (df['amount'] > upper)
df['z_anomaly']   = df['z_score'].abs() > 3

# 交叉表
print(pd.crosstab(df['iqr_anomaly'], df['if_anomaly'], rownames=['IQR'], colnames=['IForest']))
\`\`\`

通常你会观察到：
- IQR 更 "严格"，只抓极端大值
- Isolation Forest 更 "敏感"，能发现一些金额不大但数量异常的组合

## 四、给异常打 "原因标签"

发现异常只是第一步。运营同学关心 "为什么异常"：

\`\`\`python
def reason(row):
    if row['amount'] <= 0: return '金额异常'
    if row['quantity'] > 1000: return '数量异常'
    if row['order_date'] > pd.Timestamp('2025-01-01'): return '日期异常'
    if row['if_anomaly'] and row['iqr_anomaly']: return '多方法一致判定'
    if row['if_anomaly']: return '模型检测异常'
    return '正常'

df['anomaly_reason'] = df.apply(reason, axis=1)
df['anomaly_reason'].value_counts()
\`\`\`

## 五、本章小结

- Isolation Forest 是一种无监督、高维友好的异常检测算法
- 在规则方法之外增加 AI 方法，可以相互印证
- 异常检测不是终点，给异常贴 "原因标签" 才能推动数据工程修复源头

## 思考与练习

1. Isolation Forest 的 contamination 参数选大/选小有什么影响？
2. 除了 amount、quantity，你还会把哪些字段作为特征喂给 IForest？
3. 自己实现一次三种方法对比，用 Venn Diagram 画出异常订单的重叠关系。`,
        lessons: [
          { id: '7', title: 'Isolation Forest', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '模型训练与对比', type: 'code', duration: 35, completed: false },
          { id: '9', title: '报告生成', type: 'code', duration: 15, completed: false },
        ],
      },
    },
  },
  '4': {
    id: '4',
    title: '项目4：购物车转化路径漏斗分析',
    chapters: {
      '1': {
        id: '1',
        title: '用户行为分析基础',
        content: `# 用户行为分析基础

## 一、什么是漏斗分析

漏斗分析是一种追踪用户在关键路径上 "每一步流失多少" 的分析方法。电商典型路径：

    浏览商品 → 加入购物车 → 提交订单 → 完成支付

每一步都会有用户流失，最后完成支付的人就像漏斗里剩下的液体。

## 二、为什么要做漏斗

1. **衡量产品健康度**：支付/浏览 = 全站转化率
2. **定位问题环节**：哪一步流失最严重 → 哪一步需要优化
3. **衡量优化效果**：版本更新后重新跑漏斗，看转化率是否提升

## 三、原始数据结构

行为日志表 event_log：

| user_id | session_id | event     | product_id | event_time          |
|---------|------------|-----------|------------|---------------------|
| U001    | S01        | view      | P100       | 2024-03-01 09:12:00 |
| U001    | S01        | add_cart  | P100       | 2024-03-01 09:12:45 |
| U001    | S01        | purchase  | P100       | 2024-03-01 09:15:30 |

关键定义：

- **session**：用户一次访问，通常用超时阈值（如 30 分钟无新事件则切分）
- **event**：事件名，建议标准化成 view / add_cart / checkout / purchase

## 四、会话化（Sessionization）

\`\`\`python
log = pd.read_csv('event_log.csv', parse_dates=['event_time'])
log = log.sort_values(['user_id', 'event_time'])

# 计算与上一事件的间隔
log['gap'] = log.groupby('user_id')['event_time'].diff().dt.total_seconds()

# 间隔 > 30 分钟 = 新会话
log['is_new_session'] = (log['gap'].isna()) | (log['gap'] > 30*60)
log['session_id'] = log['is_new_session'].cumsum()

# 每个会话第一次出现的事件路径
def get_path(group):
    return tuple(group['event'].drop_duplicates().tolist())

paths = log.groupby('session_id').apply(get_path).rename('path').reset_index()
\`\`\`

## 五、本章小结

- 漏斗就是 "路径 + 计数"
- 关键在于把原始事件日志先整理成 "会话" 粒度
- 路径是否包含某些关键事件决定了用户在漏斗哪一层

## 思考与练习

1. 若你的产品日志中没有 session_id，如何从 user_id + timestamp 构造？
2. 如果一个用户在会话中 "浏览 → 加购 → 浏览 → 加购 → 购买"，你会在路径里把 view / add_cart 各去重保留一次吗？为什么？
3. 你认为漏斗分析最需要注意的数据质量问题是什么？`,
        lessons: [
          { id: '1', title: '漏斗分析概念', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '行为数据预处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '用户路径构建', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '漏斗转化率计算',
        content: `# 漏斗转化率计算

## 一、定义漏斗步骤

假设我们关心的步骤：

    1. view       浏览
    2. add_cart   加入购物车
    3. checkout   进入结算页
    4. purchase   完成支付

## 二、会话级漏斗

思路：对每个 session 判断是否包含各步骤，再做聚合。

\`\`\`python
steps = ['view', 'add_cart', 'checkout', 'purchase']

# 对每个 session 打标志
session_flags = (
    log.groupby('session_id')['event']
       .apply(lambda x: pd.Series([s in x.values for s in steps], index=steps))
       .reset_index()
)

# 统计每个漏斗层的会话数
funnel = session_flags[steps].sum().reset_index()
funnel.columns = ['step', 'sessions']
funnel
\`\`\`

## 三、转化率与流失率

\`\`\`python
funnel['conversion_from_top'] = funnel['sessions'] / funnel['sessions'].iloc[0]
funnel['conversion_from_prev'] = funnel['sessions'] / funnel['sessions'].shift(1)
funnel['drop_off'] = 1 - funnel['conversion_from_prev']
print(funnel.round(3))
\`\`\`

## 四、用 Plotly 画漏斗图

\`\`\`python
import plotly.express as px

fig = px.funnel(funnel, x='sessions', y='step',
                title='购物车转化漏斗')
fig.update_layout(yaxis={'categoryorder':'array', 'categoryarray': steps})
fig.show()
\`\`\`

## 五、分群对比漏斗

按渠道、按用户等级、按新老客分别画漏斗，定位 "问题人群"：

\`\`\`python
# 把渠道带回到 session 级别
channel = log.groupby('session_id')['channel'].first().reset_index()
session_flags = session_flags.merge(channel, on='session_id')

for ch in session_flags['channel'].unique():
    sub = session_flags[session_flags['channel'] == ch]
    print(f'渠道 {ch}:')
    print(sub[steps].sum() / len(sub))
    print('---')
\`\`\`

## 六、本章小结

- 漏斗的真正价值在于 **对比**（按渠道/人群/版本）
- 找到 "流失率异常高" 的那一步，再去深挖流失原因
- Plotly 漏斗图是给业务方展示的利器

## 思考与练习

1. 当你发现 checkout → purchase 流失率特别高时，你会从哪些角度进一步排查？
2. 某渠道的漏斗转化率远低于大盘，但购买金额很高，这说明什么？
3. 实现一个函数：给定 event_log 和 steps，自动返回漏斗 DataFrame + 漏斗图。`,
        lessons: [
          { id: '4', title: '转化率计算', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '漏斗可视化', type: 'code', duration: 35, completed: false },
          { id: '6', title: '流失点识别', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '付款预测模型',
        content: `# 付款预测模型

## 一、问题定义

漏斗只告诉我们 "有多少人流失了"，但不能回答 "**谁** 会流失？"。如果我们能在用户 "加购但未支付" 时预测他是否会支付，就能对预测不支付的用户自动发 "优惠券 + 催付短信"。

## 二、特征工程

从历史行为日志中，对每个会话构造特征：

| 特征 | 含义 |
|------|------|
| session_duration | 会话时长（秒） |
| n_view | 浏览次数 |
| n_add_cart | 加购次数 |
| n_remove | 移除购物车次数 |
| avg_view_sec_per_item | 每个商品的平均浏览秒数 |
| channel | 渠道（App/H5/PC） |
| device | 设备类型 |
| day_of_week | 星期几 |
| hour | 小时 |

\`\`\`python
sessions = log.groupby('session_id').agg(
    duration=('event_time', lambda x: (x.max() - x.min()).total_seconds()),
    n_view=('event', lambda x: (x == 'view').sum()),
    n_add_cart=('event', lambda x: (x == 'add_cart').sum()),
    n_remove=('event', lambda x: (x == 'remove_cart').sum()),
    channel=('channel', 'first'),
    device=('device', 'first'),
    hour=('event_time', lambda x: x.dt.hour.iloc[0]),
    dow=('event_time', lambda x: x.dt.dayofweek.iloc[0]),
    has_purchase=('event', lambda x: (x == 'purchase').any()),
).reset_index()

sessions['has_purchase'] = sessions['has_purchase'].astype(int)
\`\`\`

## 三、建模

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

X = pd.get_dummies(sessions.drop(['session_id','has_purchase'], axis=1), drop_first=True)
y = sessions['has_purchase']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

clf = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_score = clf.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print('AUC:', roc_auc_score(y_test, y_score))
\`\`\`

## 四、特征重要性

\`\`\`python
importances = pd.Series(clf.feature_importances_, index=X.columns)
importances.sort_values().tail(10).plot(kind='barh', title='特征重要性 Top 10');
\`\`\`

通常 "会话时长、加购次数、浏览次数" 是强特征。

## 五、本章小结

- 漏斗 = "发生了什么"；模型 = "谁会发生"
- 行为特征一定要对 "会话" 粒度来做
- 有了模型之后，就可以对高风险用户做针对性的召回

## 思考与练习

1. 你会怎么验证 "给预测不支付的用户发优惠券" 策略是否有效？
2. 如果数据非常不平衡（支付用户只占 5%），除了 class_weight='balanced' 还有哪些做法？
3. 把会话时长做一个分箱（<1min, 1-5min, 5-30min, >30min），画每个分箱的购买率，观察是否单调。`,
        lessons: [
          { id: '7', title: '特征工程', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '分类模型训练', type: 'code', duration: 35, completed: false },
          { id: '9', title: '用户画像分析', type: 'code', duration: 15, completed: false },
        ],
      },
    },
  },
  '5': {
    id: '5',
    title: '项目5：商品销售趋势与周期性分析',
    chapters: {
      '1': {
        id: '1',
        title: '时间序列基础',
        content: `# 时间序列基础

## 一、时间序列的三个组成部分

任何时间序列都可以粗略拆成：

1. **趋势 (Trend)**：长期上升/下降
2. **季节性 (Seasonality)**：周期性波动（周、月、年）
3. **残差 (Residual)**：不可解释的噪声或偶发事件

## 二、把数据变成时间索引

\`\`\`python
import pandas as pd

sales = pd.read_csv('daily_sales.csv')
sales['date'] = pd.to_datetime(sales['date'])
sales = sales.set_index('date').sort_index()
print(sales.head())
\`\`\`

## 三、按时间重采样

日销售噪声大，我们常按周或月聚合：

\`\`\`python
weekly = sales['amount'].resample('W').sum()
monthly = sales['amount'].resample('ME').sum()
\`\`\`

常用频率字符串：
- \`'D'\` 日、\`'W'\` 周、\`'ME'\` 月末、\`'QE'\` 季末、\`'YE'\` 年末
- \`'MS'\` 月初、\`'QS'\` 季初

## 四、滑动窗口（Moving Average）

用滚动均值平滑噪声：

\`\`\`python
sales['ma_7d'] = sales['amount'].rolling(window=7).mean()
sales['ma_30d'] = sales['amount'].rolling(window=30).mean()

sales[['amount', 'ma_7d', 'ma_30d']].plot(figsize=(12, 4));
\`\`\`

## 五、同比与环比

- **环比**：和上一个周期比（月 vs 上月）
- **同比**：和去年同周期比（2024-03 vs 2023-03）

\`\`\`python
monthly = sales['amount'].resample('ME').sum().to_frame('amount')
monthly['mom'] = monthly['amount'].pct_change()
monthly['yoy'] = monthly['amount'].pct_change(12)
print(monthly.tail())
\`\`\`

## 六、本章小结

- 让 pandas 帮你 "理解时间"：一定要把日期列变成 index + datetime
- 重采样、滚动窗口、同环比是日常监控的三件套
- 下一章进入分解，把趋势/季节性分开看

## 思考与练习

1. 月度同环比用 resample('ME') 还是 resample('MS')？为什么？
2. 用你所在业务的销售数据跑一遍 "MA-7/MA-30"，感受平滑效果。
3. 同环比对新业务（历史不足 1 年）不适用，如何替代？`,
        lessons: [
          { id: '1', title: '时间序列概念', type: 'reading', duration: 25, completed: false },
          { id: '2', title: '时间索引处理', type: 'code', duration: 30, completed: false },
          { id: '3', title: '重采样与滚动窗口', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '趋势与季节性分解',
        content: `# 趋势与季节性分析

## 一、季节性分解 (STL / seasonal_decompose)

statsmodels 提供了经典加法/乘法分解：

    加法：y_t = Trend_t + Seasonal_t + Residual_t    → 适用于振幅稳定
    乘法：y_t = Trend_t × Seasonal_t × Residual_t    → 适用于振幅随趋势放大

\`\`\`python
from statsmodels.tsa.seasonal import seasonal_decompose

result = seasonal_decompose(monthly['amount'], model='additive', period=12)
result.plot();
\`\`\`

## 二、判断是否有季节性

看 seasonal 图是否有明显周期。也可用 ACF/PACF 辅助：

\`\`\`python
from statsmodels.graphics.tsaplots import plot_acf

plot_acf(monthly['amount'].dropna(), lags=24);
\`\`\`

若 lag=12 的自相关显著高，就是年周期；lag=7 显著高就是周周期。

## 三、提取 "旺季/淡季"

\`\`\`python
monthly['month'] = monthly.index.month
seasonal_profile = monthly.groupby('month')['amount'].mean()
seasonal_profile.plot(kind='bar');
\`\`\`

业务上可以据此提前备货/排期大促。

## 四、本章小结

- 加法 vs 乘法取决于振幅是否随趋势放大
- 季节性分解帮你把 "大促波峰" 与 "趋势增长" 区分开
- 提取每月/每周平均画像，便于运营排期

## 思考与练习

1. 你的业务是日度销售还是周度销售？选 period=? 才合理？
2. 如果你的序列只有 12 个数据点（一年月数据），还能做 seasonal_decompose(period=12) 吗？为什么？
3. 尝试把 seasonal_profile 做一个 0-1 归一化，找出 Top 3 旺季月份。`,
        lessons: [
          { id: '4', title: '时间序列分解', type: 'reading', duration: 25, completed: false },
          { id: '5', title: '趋势识别', type: 'code', duration: 35, completed: false },
          { id: '6', title: '季节性分析', type: 'code', duration: 30, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '销量预测（Prophet）',
        content: `# 销量预测

## 一、Prophet 简介

Prophet 是 Meta 开源的时间序列预测库，API 非常简单，且对节假日、缺失点友好。

安装：

    pip install prophet

## 二、准备数据

Prophet 要求输入是两列：\`ds\`（日期）、\`y\`（目标值）。

\`\`\`python
from prophet import Prophet

df_train = monthly['amount'].reset_index()
df_train.columns = ['ds', 'y']
\`\`\`

## 三、训练与预测

\`\`\`python
model = Prophet(seasonality_mode='additive', yearly_seasonality=True, weekly_seasonality=False)
model.fit(df_train)

# 生成未来 90 天
future = model.make_future_dataframe(periods=3, freq='ME')
forecast = model.predict(future)

# 预测结果可视化
fig = model.plot(forecast)
\`\`\`

## 四、分解图

\`\`\`python
fig2 = model.plot_components(forecast)
\`\`\`

## 五、评估预测准确度

\`\`\`python
# 留最后 3 个月作为测试集
train_idx = df_train.index[:-3]
test_idx = df_train.index[-3:]

model2 = Prophet(seasonality_mode='additive').fit(df_train.loc[train_idx])
future2 = model2.make_future_dataframe(periods=3, freq='ME')
forecast2 = model2.predict(future2)

pred = forecast2.set_index('ds').loc[df_train.loc[test_idx, 'ds'], 'yhat'].values
actual = df_train.loc[test_idx, 'y'].values

# 常用指标：MAPE / MAE / RMSE
import numpy as np
mape = np.mean(np.abs((actual - pred) / actual)) * 100
mae = np.mean(np.abs(actual - pred))
rmse = np.sqrt(np.mean((actual - pred) ** 2))
print(f'MAPE={mape:.1f}%  MAE={mae:.1f}  RMSE={rmse:.1f}')
\`\`\`

## 六、本章小结

- Prophet 适合有明显趋势与季节性的序列，建模门槛低
- 用 "留出法"（最后几个月当测试集）来验证预测准确度
- MAPE / MAE / RMSE 三个指标从不同角度评估预测质量

## 思考与练习

1. 为什么要把最后一段数据当作测试集，而不是随机切分？
2. 电商大促往往偏离趋势很多，你知道 Prophet 里如何处理节假日吗？
3. 尝试把 prophet 换成 ARIMA / HoltWinters，对比结果。`,
        lessons: [
          { id: '7', title: 'Prophet 入门', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '模型训练与预测', type: 'code', duration: 40, completed: false },
          { id: '9', title: '结果可视化', type: 'code', duration: 25, completed: false },
        ],
      },
    },
  },
  '6': {
    id: '6',
    title: '项目6：用户复购间隔与生命周期聚类',
    chapters: {
      '1': {
        id: '1',
        title: '复购行为分析',
        content: `# 复购行为分析

## 一、为什么要分析复购

新客获取成本越来越高，老客/复购用户往往贡献更大的利润（LTV更高）。复购分析可以回答：

- 用户平均多久回来买一次？
- 哪些品类/商品是 "复购钩子"？
- 复购用户与一次性用户在消费能力上有何差异？

## 二、数据准备

订单表至少需要：user_id, order_date, amount

## 三、计算复购间隔

\`\`\`python
orders = pd.read_csv('orders.csv', parse_dates=['order_date'])
orders = orders.sort_values(['user_id', 'order_date'])

# 每个用户的上一次下单日期
orders['prev_date'] = orders.groupby('user_id')['order_date'].shift(1)

# 复购间隔（天）
orders['days_since_prev'] = (orders['order_date'] - orders['prev_date']).dt.days

# 订单序号
orders['order_seq'] = orders.groupby('user_id').cumcount() + 1
\`\`\`

## 四、复购指标汇总

\`\`\`python
user_summary = (
    orders.groupby('user_id').agg(
        total_orders=('order_id', 'nunique'),
        total_amount=('amount', 'sum'),
        first_order=('order_date', 'min'),
        last_order=('order_date', 'max'),
        avg_interval=('days_since_prev', 'mean'),
        median_interval=('days_since_prev', 'median'),
    ).reset_index()
)

# 复购用户（订单数 >= 2 的用户）占比
repeat_ratio = (user_summary['total_orders'] >= 2).mean()
print(f'复购用户占比：{repeat_ratio:.1%}')
\`\`\`

## 五、复购间隔分布

\`\`\`python
import matplotlib.pyplot as plt

intervals = orders['days_since_prev'].dropna()
intervals.hist(bins=50, range=(0, 180))
plt.xlabel('复购间隔（天）')
plt.ylabel('订单数')
plt.title('复购间隔分布');
\`\`\`

典型电商会有一个"波峰"在 30 天左右（月度促销）或 7 天（周度促销）。

## 六、本章小结

- 复购是衡量用户粘性/业务健康度的核心指标
- 使用 shift(1) 即可快速计算复购间隔
- 分布形态往往能反映业务的促销节奏

## 思考与练习

1. 若平台每周五都有大促，你会观察到复购间隔分布有什么特征？
2. 用数据验证一下 "首单金额高的用户复购率也高" 这个假设。
3. 计算你所在业务的 30 天/60 天/90 天复购率，并按首单品类分组看差异。`,
        lessons: [
          { id: '1', title: '复购指标定义', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '复购间隔计算', type: 'code', duration: 25, completed: false },
          { id: '3', title: '购买频次统计', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '用户生命周期建模',
        content: `# 用户生命周期建模

## 一、什么是用户生命周期

业务上常把用户分为：**潜在 → 新客 → 活跃 → 沉默 → 流失**。给每一位用户打上当前阶段标签，是精细化运营的基础。

## 二、基于规则的分阶段

一种常用定义（可结合业务调整）：

| 阶段 | 条件 |
|------|------|
| 新客 | 首单 0-30 天内 |
| 活跃 | 最近 30 天有下单，且历史订单 >= 2 |
| 沉默 | 30-90 天未下单 |
| 流失 | 超过 90 天未下单 |

\`\`\`python
from datetime import timedelta

TODAY = orders['order_date'].max()
user_summary['recency'] = (TODAY - user_summary['last_order']).dt.days

def lifecycle(row):
    if (TODAY - row['first_order']).days <= 30 and row['total_orders'] == 1:
        return '新客'
    if row['recency'] <= 30 and row['total_orders'] >= 2:
        return '活跃'
    if 30 < row['recency'] <= 90:
        return '沉默'
    if row['recency'] > 90:
        return '流失'
    return '其他'

user_summary['lifecycle'] = user_summary.apply(lifecycle, axis=1)
user_summary['lifecycle'].value_counts(normalize=True).round(3) * 100
\`\`\`

## 三、活跃度衰减模型（更精细的度量）

与其硬切 30/90 天，不如用一个连续的 "活跃度" 分数：

    活跃度 = Σ 1 / (1 + α × 距今天数)   对用户每次下单求和

α 控制衰减速度。活跃度能比 "是否活跃" 保留更多信息。

\`\`\`python
ALPHA = 0.02

def activity_score(user_id):
    user_orders = orders[orders['user_id'] == user_id]['order_date']
    days = (TODAY - user_orders).dt.days.values
    return float(np.sum(1.0 / (1 + ALPHA * days)))

user_summary['activity'] = user_summary['user_id'].apply(activity_score)
\`\`\`

## 四、本章小结

- 分阶段标签让运营能说清楚 "我们的用户结构健康不健康"
- 连续的活跃度分数能避免规则边界的生硬判断
- 两者组合使用效果最佳

## 思考与练习

1. 调整 α 参数，观察活跃度分数分布的变化。
2. 把活跃度分数和 RFM 的 recency 做一张散点图，看是否线性相关。
3. 思考如何把 "浏览/加购" 等行为也纳入活跃度计算。`,
        lessons: [
          { id: '4', title: '活跃度衰减模型', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '特征构建', type: 'code', duration: 35, completed: false },
          { id: '6', title: '用户分群', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '复购模式识别',
        content: `# 复购模式识别

## 一、再用一次聚类：把用户按复购行为分组

这一次我们把 "复购行为" 当作特征来聚类：

| 特征 | 含义 |
|------|------|
| total_orders | 历史订单数 |
| total_amount | 历史消费金额 |
| avg_interval | 平均复购间隔 |
| recency | 距今天数 |
| activity | 活跃度分数 |

## 二、聚类代码

\`\`\`python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

features = ['total_orders', 'total_amount', 'avg_interval', 'recency', 'activity']
X = user_summary[features].fillna(0)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

km = KMeans(n_clusters=4, random_state=42, n_init=10)
user_summary['cluster'] = km.fit_predict(X_scaled)

# 每个簇的特征画像
print(user_summary.groupby('cluster')[features].mean().round(1))
\`\`\`

## 三、给群组命名并制定动作

典型画像：

| 群组 | 特征 | 建议动作 |
|------|------|---------|
| 高频高价值 | 订单多、金额高、间隔短、最近活跃 | VIP 计划、专属权益 |
| 低频稳健 | 订单不多但间隔稳定、金额中等 | 定期个性化推送 |
| 一次性高客单 | 只有一单，金额高但距今天数长 | 专属召回券 |
| 低价值流失 | 订单少、金额低、久未活跃 | 低成本召回或休眠 |

## 四、本章小结

- 复购模式聚类本质是 "把 RFM 扩展到更多行为特征"
- 结果结合业务经验命名并转化为运营动作
- 每隔一段时间要重新训练（用户结构会变化）

## 思考与练习

1. 你怎么判断聚类结果是不是稳定的？尝试多次换 random_state 看群组成员变化是否大。
2. 设计一个月度监控看板：每个群组人数 / 占比 / 贡献金额。
3. 向运营同学写一份 1 页的简报，解释你做了什么、他们要做什么。`,
        lessons: [
          { id: '7', title: '聚类分析', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '群组画像', type: 'code', duration: 35, completed: false },
          { id: '9', title: '运营策略建议', type: 'reading', duration: 20, completed: false },
        ],
      },
    },
  },
  '7': {
    id: '7',
    title: '项目7：文本评论情感与评分不一致分析',
    chapters: {
      '1': {
        id: '1',
        title: '文本数据预处理',
        content: `# 文本分析基础

## 一、评论数据长什么样

| review_id | user_id | rating | text | review_date |
|-----------|---------|--------|------|-------------|
| R001 | U100 | 5 | 东西很好，物流也快，下次还买 | 2024-03-01 |
| R002 | U101 | 1 | 假货，质量差，再也不来了 | 2024-03-02 |

## 二、基本文本统计

\`\`\`python
reviews = pd.read_csv('reviews.csv')

# 文本长度
reviews['char_len'] = reviews['text'].str.len()

# 关键词计数
keywords = ['好', '差', '推荐', '垃圾', '喜欢', '失望']
for kw in keywords:
    reviews[f'kw_{kw}'] = reviews['text'].str.contains(kw).astype(int)

# 评分分布
print(reviews['rating'].value_counts().sort_index())
\`\`\`

## 三、简单的规则型情感

在没有模型时，我们也能用 "情感词典" 打一个粗略分：

- 正向词：好、棒、喜欢、满意、推荐、五星……
- 负向词：差、烂、垃圾、失望、退货、骗、投诉……

\`\`\`python
pos_words = ['好', '棒', '喜欢', '满意', '推荐', '不错', '五星', '值得']
neg_words = ['差', '烂', '垃圾', '失望', '退货', '骗', '投诉', '慢', '假货']

def rule_sentiment(text):
    p = sum(text.count(w) for w in pos_words)
    n = sum(text.count(w) for w in neg_words)
    if p > n: return 1
    if p < n: return -1
    return 0

reviews['rule_sent'] = reviews['text'].apply(rule_sentiment)
\`\`\`

## 四、本章小结

- 文本分析的第一步永远是 "看数据"
- 关键词/词典方法简单可解释，是项目的 baseline
- 下一章节会介绍更准的方法（SnowNLP）

## 思考与练习

1. 评论里经常出现 "这个东西不好用"，你的关键词法会误判吗？为什么？
2. 扩展你自己业务常用的正/负向词典。
3. 把 rule_sentiment 与真实 rating 画交叉表，看一致性。`,
        lessons: [
          { id: '1', title: '文本处理入门', type: 'reading', duration: 20, completed: false },
          { id: '2', title: 'pandas 字符串操作', type: 'code', duration: 35, completed: false },
          { id: '3', title: '文本数据预处理', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '情感分析实现（SnowNLP）',
        content: `# 情感分析实现

## 一、SnowNLP 简介

SnowNLP 是一个中文 NLP 库，内置了情感、分词、摘要等功能，适合轻量级任务。

    pip install snownlp

## 二、获取情感得分

\`\`\`python
from snownlp import SnowNLP

def get_sentiment(text):
    try:
        return SnowNLP(text).sentiments
    except:
        return 0.5

reviews['sentiment'] = reviews['text'].apply(get_sentiment)

# 查看分布
reviews['sentiment'].hist(bins=20);
\`\`\`

## 三、按评分看情感

\`\`\`python
print(reviews.groupby('rating')['sentiment'].mean().round(3))
\`\`\`

通常 rating 越高 sentiment 越高。若不满足这个规律，要么词典不准，要么评论里真的存在 "评分-文本不一致"。

## 四、进阶：用 transformers 库跑 BERT

如果你有 GPU 或足够耐心，可以用预训练 BERT 得到更好的情感分：

\`\`\`python
from transformers import pipeline

classifier = pipeline('sentiment-analysis',
                      model='uer/roberta-base-finetuned-dianping-chinese',
                      device=-1)  # -1 使用 CPU

def bert_sentiment(text):
    # 过长文本截断
    out = classifier(text[:510])[0]
    if out['label'] == 'positive (stars 4 and 5)':
        return out['score']
    return 1 - out['score']

# reviews['bert_sentiment'] = reviews['text'].apply(bert_sentiment)
\`\`\`

## 五、本章小结

- SnowNLP 简单，适合快速做 baseline
- BERT 系列更准，但运行成本更高
- 选择哪种方法取决于你的数据量与推理速度需求

## 思考与练习

1. 把 1-star 评论里 sentiment 分数最高的几条打印出来，看看是误判还是真的不一致。
2. 用你自己实现的词典法分数、SnowNLP 分数、BERT 分数做两两对比图，看它们的相关性。
3. 你能想到什么理由让一条评论的文本与评分不一致？（至少 3 条）`,
        lessons: [
          { id: '4', title: 'SnowNLP 使用', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '情感得分计算', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'BERT 进阶应用', type: 'reading', duration: 30, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '不一致样本分析',
        content: `# 不一致分析

## 一、定义不一致

把评分和情感得分都映射到 "正/中性/负" 三层，然后看对应关系：

| rating | 真实 | sentiment_bin | 文本 | 判定 |
|--------|------|---------------|------|------|
| 5 星 | 正面 | 负面 | "东西非常差" | **不一致（高分差评）** |
| 1 星 | 负面 | 正面 | "很棒的产品" | **不一致（低分好评）** |
| 3 星 | 中性 | 任何 | — | 一般忽略 |

\`\`\`python
def rating_bin(r):
    if r >= 4: return '正面'
    if r <= 2: return '负面'
    return '中性'

def sent_bin(s):
    if s >= 0.6: return '正面'
    if s <= 0.4: return '负面'
    return '中性'

reviews['rating_bin'] = reviews['rating'].apply(rating_bin)
reviews['sent_bin'] = reviews['sentiment'].apply(sent_bin)

# 找出不一致
inconsistent = reviews[
    ((reviews['rating_bin'] == '正面') & (reviews['sent_bin'] == '负面')) |
    ((reviews['rating_bin'] == '负面') & (reviews['sent_bin'] == '正面'))
]
print(f'不一致样本：{len(inconsistent)} / {len(reviews)} = {len(inconsistent)/len(reviews):.1%}')
\`\`\`

## 二、不一致样本的典型原因

业务上通常会发现：

1. **误点评分**：用户想打 1 星但点错 5 星
2. **反讽与反语**："真的棒哦，买了三天就坏了 😄"
3. **评价维度错位**：物流很好但商品本身很差 → 用户只给整体打分时会混乱
4. **刷分/控评行为**

## 三、词云看高频词

\`\`\`python
# pip install wordcloud
from wordcloud import WordCloud

text_merged = ' '.join(inconsistent['text'].astype(str).tolist())
wc = WordCloud(font_path='/path/to/chinese.ttf', width=800, height=400, background_color='white').generate(text_merged)

import matplotlib.pyplot as plt
plt.figure(figsize=(12, 6))
plt.imshow(wc, interpolation='bilinear')
plt.axis('off');
\`\`\`

## 四、本章小结

- 不一致样本是产品/运营的重要线索
- 自动化识别能大大降低人工审阅成本
- 词云 + 人工抽样阅读能让你快速形成业务洞察

## 思考与练习

1. 从你数据里随机抽样 20 条不一致样本人工阅读，看看你的判断和模型判断是否一致。
2. 设计一个表格，把不一致样本按 "推测原因" 手工打标签，并统计各原因占比。
3. 把分析报告（图表 + 结论）发给产品或客服团队。`,
        lessons: [
          { id: '7', title: '矛盾样本识别', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '词云可视化', type: 'code', duration: 45, completed: false },
          { id: '9', title: '分析报告', type: 'code', duration: 25, completed: false },
        ],
      },
    },
  },
  '8': {
    id: '8',
    title: '项目8：购物篮商品组合推荐',
    chapters: {
      '1': {
        id: '1',
        title: '推荐系统基础',
        content: `# 推荐系统基础

## 一、常见推荐方法

| 方法 | 用途 | 数据 |
|------|------|------|
| 基于规则 | 热销榜单、新品榜 | 订单时间 |
| 协同过滤（CF） | 个性化推荐 | 用户×商品 交互矩阵 |
| 基于内容 | 相似商品推荐 | 商品属性（品类/价格/标签） |
| 混合 | 综合多种信号 | 多种 |

## 二、构建用户-商品矩阵

\`\`\`python
orders = pd.read_csv('order_items.csv')

# 每个用户-每个商品的购买次数（或 0/1 是否购买）
user_item = (
    orders.groupby(['user_id', 'product_name'])['quantity']
          .sum()
          .unstack(fill_value=0)
)
print('矩阵形状：', user_item.shape)
\`\`\`

## 三、冷启动与稀疏性

电商场景下 user_item 通常非常稀疏（> 99% 是 0），这是推荐系统的核心挑战。常用缓解手段：

- 只保留有 3 次以上购买记录的用户
- 只保留销量 Top N 的商品
- 使用矩阵分解 / 基于物品的 CF（更稳健）

## 四、本章小结

- 推荐系统的本质是 "在海量商品中挑几个用户可能喜欢的"
- 矩阵形态是推荐算法的标准输入
- 下一节我们就用余弦相似度来计算商品相似矩阵

## 思考与练习

1. 你的数据取 Top 多少商品，才能让矩阵稀疏度降到可接受范围？
2. 思考 "用户A只买过一次 iPhone 充电器"，你会怎么给这个用户推荐？
3. 画出你能想到的 "推荐系统线上架构" 示意图，包括离线训练部分与线上服务部分。`,
        lessons: [
          { id: '1', title: '推荐系统概述', type: 'reading', duration: 25, completed: false },
          { id: '2', title: '用户商品矩阵构建', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '基于物品的协同过滤',
        content: `# 基于物品的协同过滤

## 一、余弦相似度

两个向量 x, y 的余弦相似度：

    cos(θ) = x · y / (||x|| × ||y||)

把每个商品看作 "购买该商品的用户向量"，相似度越高说明两件商品常被一起买。

## 二、计算商品相似度矩阵

\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity

# 转置：行为商品
item_vec = user_item.T  # shape: (商品数, 用户数)
sim_matrix = cosine_similarity(item_vec)

# 转为 DataFrame 便于查询
items = item_vec.index.tolist()
sim_df = pd.DataFrame(sim_matrix, index=items, columns=items)

# 给定商品：返回最相似的 Top 5
def recommend_for(item, topn=5):
    return sim_df[item].sort_values(ascending=False).head(topn+1).iloc[1:].round(3)

print(recommend_for('手机壳'))
\`\`\`

## 三、"购物篮推荐"：把当前篮子里的商品信号合并

用户的篮子里可能有多个商品。对候选商品 c 的打分：

    score(c) = Σ  sim(篮子里的商品, c)

再把篮子里已有的商品排除，取 Top N 推荐。

\`\`\`python
def basket_recommend(basket, topn=5):
    # 只保留相似度矩阵中篮子里的列
    cols = [b for b in basket if b in sim_df.columns]
    if not cols: return []
    # 对每个候选商品求和相似度
    scores = sim_df[cols].sum(axis=1).sort_values(ascending=False)
    # 排除篮子里已有商品
    scores = scores[~scores.index.isin(basket)]
    return scores.head(topn).round(3)

print(basket_recommend(['手机壳', '钢化膜']))
\`\`\`

## 四、本章小结

- 基于物品的协同过滤 = 算一次矩阵，在线上只要查表
- 购物篮推荐就是把篮子里每件商品的相似度向量相加
- 本方法可解释、工程实现简单，是电商常见 "购物车推荐" 方案

## 思考与练习

1. 如果某件商品非常热门（所有人都买），它会经常被推荐。这合理吗？怎么缓解？
2. 把上面的推荐函数封装成一个 Flask/FastAPI 接口，输入 JSON 篮子、输出推荐列表。
3. 你如何离线评估这套推荐的 "准不准"？（Hint：用测试集里真实发生的下一单购买来验证）`,
        lessons: [
          { id: '4', title: '基于物品的协同过滤', type: 'reading', duration: 25, completed: false },
          { id: '5', title: '余弦相似度计算', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'KNN 最近邻', type: 'code', duration: 25, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '推荐系统集成与评估',
        content: `# 推荐系统集成

## 一、一个简单的推荐函数

把 "热销 + 相似度" 融合为一个可调用对象：

\`\`\`python
HOT = orders['product_name'].value_counts().head(20).index.tolist()

def hybrid_recommend(user_id=None, basket=None, topn=5):
    # 1) 购物篮推荐
    if basket:
        return basket_recommend(basket, topn=topn)
    # 2) 个性化推荐（若已有用户行为）
    if user_id and user_id in user_item.index:
        user_bought = user_item.loc[user_id][user_item.loc[user_id] > 0].index.tolist()
        if user_bought:
            return basket_recommend(user_bought, topn=topn)
    # 3) 冷启动：热销榜
    return pd.Series({it: 1.0 for it in HOT[:topn]})
\`\`\`

## 二、离线评估思路（留一法）

对测试集中每个用户，**隐藏他的最后一次购买**，用剩下的数据推荐 Top N，
看真正购买的商品是否出现在推荐列表里：

    Hit Rate = 命中次数 / 测试用户数

\`\`\`python
# 构造测试集：每个用户最后一笔订单
last_order = (
    orders.sort_values('order_date')
          .groupby('user_id')
          .tail(1)
          [['user_id', 'product_name']]
)

hits = 0
for _, row in last_order.iterrows():
    # 去掉最后一笔，再推荐
    recs = hybrid_recommend(user_id=row['user_id'])
    if isinstance(recs, pd.Series) and row['product_name'] in recs.index:
        hits += 1

print(f'Hit Rate @{topn} = {hits/len(last_order):.2%}')
\`\`\`

## 三、线上 A/B 测试

- A 组（对照组）：旧的热销榜推荐
- B 组（实验组）：新的协同过滤推荐
- 观测指标：**推荐位点击率、推荐位购买率、人均 GMV**

## 四、本章小结

- 推荐系统分 "离线召回 / 在线排序" 两阶段，本节是最简化的召回层
- 离线指标 + 线上 A/B 缺一不可
- 一个好的推荐系统需要不断迭代特征、模型与评估方法

## 思考与练习

1. 你会怎么设计线上 A/B 测试的分组 key？用户 ID 还是会话 ID？为什么？
2. 记录每次推荐被点击/购买的情况，构造一张 "推荐商品日志表"，并写 SQL 统计各指标。
3. 阅读一篇你感兴趣的电商推荐相关的文章，与本项目方法做对比。`,
        lessons: [
          { id: '7', title: '购物车推荐逻辑', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '推荐 API 实现', type: 'code', duration: 45, completed: false },
          { id: '9', title: '效果评估', type: 'code', duration: 25, completed: false },
        ],
      },
    },
  },
  '9': {
    id: '9',
    title: '项目9：促销活动效果分析',
    chapters: {
      '1': {
        id: '1',
        title: 'A/B 测试基础',
        content: `# A/B 测试基础

## 一、A/B 测试是什么

把流量随机分成两组：
- **对照组 (A)**：沿用旧方案
- **实验组 (B)**：使用新方案（新促销、新推荐、新页面）

一段时间后，比较两组的核心指标差异，判断新方案是否更好。

## 二、一个促销例子

| 组 | 活动策略 | 用户数 | 购买用户数 | 购买率 |
|----|---------|--------|-----------|--------|
| 对照组 | 不发券 | 10,000 | 800 | 8.0% |
| 实验组 | 满 199 减 20 | 10,000 | 1,050 | 10.5% |

看起来实验组更好。但 "波动" 有多大？我们需要用统计检验回答。

## 三、数据准备

\`\`\`python
import pandas as pd

ab = pd.DataFrame({
    'group': ['control']*10000 + ['treatment']*10000,
    'convert': [1]*800 + [0]*9200 + [1]*1050 + [0]*8950,
    'amount':  [1]*800 + [0]*9200 + [1]*1050 + [0]*8950,  # 模拟
})

# 汇总表
summary = (
    ab.groupby('group')
      .agg(users=('convert', 'size'),
           buyers=('convert', 'sum'),
           rate=('convert', 'mean'))
      .reset_index()
)
print(summary)
\`\`\`

## 四、本章小结

- A/B 测试是数据驱动决策的核心工具
- 关键是 "流量随机、分组可比"
- 下一节会介绍如何用卡方/正态检验判断差异是否显著

## 思考与练习

1. 你如何保证 "流量随机" 是真的随机？有什么常见陷阱？
2. 为什么不能只看 "购买率" 一个指标？通常还会看什么？
3. 举一个你日常业务中遇到的 "想做 A/B 测试" 的例子。`,
        lessons: [
          { id: '1', title: 'A/B 测试理论', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '实验设计', type: 'reading', duration: 20, completed: false },
          { id: '3', title: '数据准备', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '统计检验',
        content: `# 统计检验

## 一、比例类指标的检验（卡方 / Z 检验）

购买率是 "比例" 类指标，适合用卡方检验或两比例 Z 检验。

\`\`\`python
from scipy import stats

# 构造列联表
table = [[800, 9200],  # 对照组：转化 / 未转化
         [1050, 8950]] # 实验组

chi2, p_value, dof, expected = stats.chi2_contingency(table)
print(f'卡方={chi2:.2f}, p={p_value:.4f}')
\`\`\`

p < 0.05 常被视为 "统计显著"，意味着两组差异不大可能是随机波动。

## 二、数值类指标的检验（t 检验）

如果你的指标是 "人均 GMV" 这样的数值，用 t 检验：

\`\`\`python
import numpy as np

# 模拟：对照组人均 GMV
np.random.seed(42)
control_amount = np.random.exponential(scale=120, size=10000)
treat_amount   = np.random.exponential(scale=135, size=10000)

t_stat, p_value_t = stats.ttest_ind(control_amount, treat_amount, equal_var=False)
print(f't={t_stat:.3f}, p={p_value_t:.4f}')
\`\`\`

## 三、效应量：差异到底有多大

显著不等于 "大"。我们还关心差异大小：

    Δ = 实验组均值 - 对照组均值
    Lift% = Δ / 对照组均值

对购买率例子：Δ = 10.5% - 8.0% = 2.5pp，Lift = 2.5% / 8.0% = 31.25%。

## 四、本章小结

- 卡方检验用于比例，t 检验用于数值
- p 值回答 "是否显著"，效应量回答 "有多大"
- 两者都要看

## 思考与练习

1. 如果实验样本量很小（比如每组 50 人），p 值会很大，这意味着什么？
2. 如果你同时看 20 个指标，其中有 1 个 p<0.05，你会怎么判断？（提示：多重比较）
3. 实现一个函数：输入两组数据，自动输出包含均值、Δ、p、是否显著的表格。`,
        lessons: [
          { id: '4', title: '假设检验原理', type: 'reading', duration: 25, completed: false },
          { id: '5', title: 't 检验实现', type: 'code', duration: 30, completed: false },
          { id: '6', title: '卡方检验', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '混杂因素与效果归因',
        content: `# 效果分析

## 一、什么是混杂因素

A/B 测试虽然能平均掉大部分混杂，但当样本量不够或抽样偏倚时，仍可能出现：
- 实验组用户本身更活跃（历史 GMV 更高）
- 实验在周末进行，实验组赶上了大促

## 二、用回归控制混杂

把 "组" 当作特征，再把你担心的混杂项（历史 GMV、用户等级、设备类型）也放进来：

\`\`\`python
import statsmodels.api as sm

data = pd.DataFrame({
    'treat': [0]*10000 + [1]*10000,
    'hist_gmv': np.concatenate([
        np.random.exponential(200, 10000),
        np.random.exponential(210, 10000)
    ]),
    'y': np.concatenate([
        np.random.binomial(1, 0.08, 10000),
        np.random.binomial(1, 0.105, 10000),
    ])
})

X = sm.add_constant(data[['treat', 'hist_gmv']])
model = sm.Logit(data['y'], X).fit()
print(model.summary())
\`\`\`

看 \`treat\` 的系数和 p 值，如果仍然显著 → 效果不依赖历史差异，更可信。

## 三、CUPED（方差缩减技巧）

对数值指标 y，可以用历史指标 \`y_pre\` 做线性回归，残差再做检验，能大幅提升统计功效：

    y_adj = y - θ × (y_pre - mean(y_pre))

其中 \`θ = cov(y, y_pre) / var(y_pre)\`。

\`\`\`python
# 计算 θ
theta = np.cov(data['y'], data['hist_gmv'])[0,1] / np.var(data['hist_gmv'], ddof=1)
data['y_adj'] = data['y'] - theta * (data['hist_gmv'] - data['hist_gmv'].mean())

# 再做 t 检验
t2, p2 = stats.ttest_ind(
    data[data['treat']==0]['y_adj'],
    data[data['treat']==1]['y_adj']
)
print(f'CUPED t={t2:.3f}, p={p2:.4f}')
\`\`\`

## 四、向业务方汇报

报告结构建议：

1. **问题**：这次实验想回答什么问题？
2. **设计**：怎么分组、样本量、实验周期
3. **指标**：核心指标 + 护栏指标
4. **结果**：Δ、p、是否显著
5. **结论**：是否全量、下一步计划

## 五、本章小结

- 真实世界的实验总有混杂，回归 / CUPED 能帮你更稳健地归因
- 不要只看一个 p 值，要组合使用：效应量 + 业务含义 + 护栏指标
- 你的最终目标是让业务方相信（或不相信）实验结果

## 思考与练习

1. 举一个你所在业务里 "明显有混杂" 的场景，并说明如何控制。
2. CUPED 对哪类指标特别有效？为什么？
3. 用你自己的 A/B 测试数据写一份 1 页的实验报告。`,
        lessons: [
          { id: '7', title: '混杂因素控制', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '线性回归调整', type: 'code', duration: 35, completed: false },
          { id: '9', title: '报告生成', type: 'code', duration: 20, completed: false },
        ],
      },
    },
  },
  '10': {
    id: '10',
    title: '项目10：端到端数据清洗与用户画像报告',
    chapters: {
      '1': {
        id: '1',
        title: '数据整合',
        content: `# 数据整合

## 一、项目目标

把前面 9 个项目学到的技能（RFM、漏斗、聚类、关联、文本、A/B……）综合起来，产出一份可给管理层汇报的 **用户画像仪表盘 + HTML 报告**。

## 二、典型需要整合的数据表

| 表 | 关键字段 |
|----|---------|
| users | user_id, register_date, channel, level, city |
| orders | order_id, user_id, order_date, amount, status |
| order_items | order_id, product_id, product_name, qty, price |
| events | user_id, session_id, event, event_time |
| reviews | user_id, rating, text, review_date |

## 三、统一清洗流水线（ETL 思路）

\`\`\`python
def clean_users(df):
    return (df.dropna(subset=['user_id'])
              .assign(register_date=pd.to_datetime(df['register_date'])))

def clean_orders(df):
    return (df[(df['status'] == 'paid') & (df['amount'] > 0)]
              .assign(order_date=pd.to_datetime(df['order_date'])))

# 统一调用
users = clean_users(pd.read_csv('users.csv'))
orders = clean_orders(pd.read_csv('orders.csv'))
items = pd.read_csv('order_items.csv')
events = pd.read_csv('events.csv', parse_dates=['event_time'])
\`\`\`

## 四、质量检查清单

- [ ] 每个表主键唯一
- [ ] 日期可解析、范围合理
- [ ] 订单金额 > 0
- [ ] 用户与订单可关联（存在 referential integrity）
- [ ] 无明显重复行

## 五、本章小结

- 画像项目的成败一半在数据
- 写清楚每一步清洗规则，便于审计
- 自动化检查清单能让你放心继续下一步

## 思考与练习

1. 为你自己的数据写一份 "清洗前 vs 清洗后" 对比表（行数、缺失值、异常订单数）。
2. 如果一个订单在 orders 表中但 user_id 不在 users 表里，你选择保留还是删除？为什么？
3. 把上面的 clean_* 函数封装成一个 etl.py 模块。`,
        lessons: [
          { id: '1', title: '多表数据合并', type: 'reading', duration: 25, completed: false },
          { id: '2', title: '数据清洗流水线', type: 'code', duration: 45, completed: false },
          { id: '3', title: '质量检查', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '用户画像构建',
        content: `# 用户画像构建

## 一、统一的 user_profile 大宽表

把项目 2（RFM + 聚类）、项目 6（复购/生命周期）、项目 7（评论情感）等结果合并到一张表，每行一个用户。

\`\`\`python
# 1) RFM 特征
rfm = orders.groupby('user_id').agg(
    recency=('order_date', lambda x: (orders['order_date'].max() - x.max()).days),
    frequency=('order_id', 'nunique'),
    monetary=('amount', 'sum'),
).reset_index()

# 2) 复购特征
orders_sorted = orders.sort_values(['user_id','order_date']).copy()
orders_sorted['prev'] = orders_sorted.groupby('user_id')['order_date'].shift(1)
orders_sorted['interval'] = (orders_sorted['order_date'] - orders_sorted['prev']).dt.days
rep = orders_sorted.groupby('user_id')['interval'].mean().reset_index()
rep.columns = ['user_id', 'avg_interval']

# 3) 用户基础属性
base = users[['user_id', 'channel', 'city', 'level']].copy()

# 4) 合并
profile = (base.merge(rfm, on='user_id', how='left')
               .merge(rep, on='user_id', how='left')
               .fillna(0))

# 聚类
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

X = profile[['recency','frequency','monetary','avg_interval']]
X_sc = StandardScaler().fit_transform(X)
profile['cluster'] = KMeans(n_clusters=5, random_state=42, n_init=10).fit_predict(X_sc)
\`\`\`

## 二、解读每个聚类画像

\`\`\`python
summary = profile.groupby('cluster').agg(
    人数=('user_id', 'count'),
    平均Recency=('recency', 'mean'),
    平均Frequency=('frequency', 'mean'),
    平均Monetary=('monetary', 'mean'),
    平均复购间隔=('avg_interval', 'mean'),
).round(1)

summary['占比'] = (summary['人数'] / summary['人数'].sum() * 100).round(1)
print(summary)
\`\`\`

## 三、给聚类命名

结合经验命名为："高价值VIP / 新客潜力 / 价格敏感 / 流失边缘 / 一次性"。

## 四、本章小结

- 画像 = 把 "用户 × 特征" 做成一张大宽表
- 聚类给用户分组，让运营可以 "以群为单位制定策略"
- 画像结果要输出为 HTML 报告，便于分享与汇报（下一章）

## 思考与练习

1. 如果让你再加 3 个特征，你会选择哪 3 个？为什么？
2. 以你自己的数据跑一遍聚类，再手动给每个聚类命名。
3. 想一个 "把用户画像用在业务上" 的具体场景（活动投放、商品推荐、客服优先级……）。`,
        lessons: [
          { id: '4', title: '特征工程综合', type: 'reading', duration: 30, completed: false },
          { id: '5', title: 'RFM+聚类+关联', type: 'code', duration: 60, completed: false },
          { id: '6', title: '高潜价值标签', type: 'code', duration: 30, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '报告生成（HTML Dashboard）',
        content: `# 报告生成

## 一、为什么要生成 HTML

- **可分享**：任何设备只要有浏览器就能打开
- **可交互**（可选）：结合 Plotly，图形可以缩放、悬停显示数值
- **可定制**：企业 logo、配色、章节结构都可以自己控制

## 二、用 Jinja2 渲染 HTML

    pip install jinja2

\`\`\`python
from jinja2 import Template
import base64, io
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt

# 生成一张 PNG 图（base64 内嵌）
def fig_to_png_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=120)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

# 图 1：各聚类人数占比
fig1, ax1 = plt.subplots(figsize=(6,4))
summary['人数'].plot(kind='bar', ax=ax1, color='#4C78A8')
ax1.set_title('各聚类用户数'); ax1.set_xlabel('聚类')
png1 = fig_to_png_base64(fig1); plt.close(fig1)

# 图 2：各聚类平均金额
fig2, ax2 = plt.subplots(figsize=(6,4))
summary['平均Monetary'].plot(kind='bar', ax=ax2, color='#F58518')
ax2.set_title('各聚类人均消费金额'); ax2.set_xlabel('聚类')
png2 = fig_to_png_base64(fig2); plt.close(fig2)

# Jinja2 模板
html_template = '''
<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>用户画像报告</title>
<style>
body{font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:960px;margin:40px auto;color:#333}
h1{border-bottom:3px solid #4C78A8;padding-bottom:8px}
h2{margin-top:40px;color:#4C78A8}
table{border-collapse:collapse;width:100%;margin:20px 0}
th,td{border:1px solid #ddd;padding:8px;text-align:center}
th{background:#f5f5f5}
</style></head>
<body>
<h1>用户画像分析报告</h1>
<p>生成时间：{{today}}。总用户数：{{total_users}}</p>

<h2>一、聚类画像表</h2>
{{table_html}}

<h2>二、各聚类用户数</h2>
<img src="data:image/png;base64,{{png1}}" />

<h2>三、各聚类人均消费</h2>
<img src="data:image/png;base64,{{png2}}" />

<h2>四、业务建议</h2>
<ul>
<li>对 Top 1 聚类（高价值VIP）：保持专属权益，年度 VIP 活动优先邀约</li>
<li>对 流失边缘 聚类：推送个性化召回券，设置 "回归礼包" 钩子</li>
<li>对 新客潜力 聚类：引导完成第 2、3 单，培养复购习惯</li>
</ul>

<p style="color:#888;margin-top:40px">—— 数据分析团队 · 自动化报告 ——</p>
</body></html>
'''

tpl = Template(html_template)
html = tpl.render(
    today=pd.Timestamp.now().strftime('%Y-%m-%d'),
    total_users=len(profile),
    table_html=summary.to_html(),
    png1=png1, png2=png2,
)

with open('user_profile_report.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('报告已生成：user_profile_report.html')
\`\`\`

## 三、把整个流程做成 "一键运行"

把上面所有步骤放进一个 \`run_pipeline.py\`，在命令行：

    python run_pipeline.py

每天/每周自动跑一次，就构成了最简单的自动化 BI。

## 四、本章小结

- 项目最终产出 = 代码 + 报告 + 结论
- 用 Jinja2 + Matplotlib/Plotly 可以生成可分享的 HTML 报告
- 把流程封装好，一键运行 → 可持续

## 思考与练习

1. 把第 9 项目的 A/B 测试结果也并入这份报告。
2. 给报告增加一张 "渠道 × 聚类" 的热力图。
3. 把生成的 HTML 报告通过邮件/企业微信自动发送给业务方（可选进阶）。`,
        lessons: [
          { id: '7', title: '可视化仪表盘', type: 'reading', duration: 25, completed: false },
          { id: '8', title: 'HTML 报告导出', type: 'code', duration: 45, completed: false },
          { id: '9', title: '项目总结与展望', type: 'reading', duration: 20, completed: false },
        ],
      },
    },
  },
};

const Learn: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const [notes, setNotes] = useState('');

  // 获取当前项目 & 章节
  const project = projectData[(courseId as keyof typeof projectData) || '1'] || projectData['1'];
  const chapters = (project as any).chapters;
  const chapter = chapters[chapterId || '1'] || Object.values(chapters)[0];

  // 章节列表（用于导航）
  const chapterIds = Object.keys(chapters);
  const currentIdx = Math.max(0, chapterIds.indexOf(chapterId || '1'));
  const prevChapterId = currentIdx > 0 ? chapterIds[currentIdx - 1] : null;
  const nextChapterId = currentIdx < chapterIds.length - 1 ? chapterIds[currentIdx + 1] : null;

  return (
    <div className="space-y-8">
      {/* 面包屑 */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">首页</Link>
        <ChevronRight size={14} />
        <Link to="/courses" className="hover:text-blue-600">项目中心</Link>
        <ChevronRight size={14} />
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600">{(project as any).title}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 font-medium">{chapter.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧章节导航 */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <BookOpen size={18} className="mr-2 text-blue-600" />
              项目章节
            </h3>
            <ul className="space-y-1">
              {chapterIds.map((cid) => (
                <li key={cid}>
                  <Link
                    to={`/learn/${courseId}/${cid}`}
                    className={`block px-3 py-2 rounded-md text-sm transition ${
                      cid === chapter.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {chapters[cid].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
              <Target size={16} className="mr-2 text-blue-600" />
              学习目标
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              通过本章节学习，理解核心业务问题、掌握关键 pandas / sklearn 代码写法，并能在自己的业务数据上复现分析。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
              <AlertTriangle size={16} className="mr-2 text-yellow-500" />
              小贴士
            </h3>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 list-disc pl-4">
              <li>建议按顺序阅读，章节之间有依赖关系</li>
              <li>看到代码块可以复制到你的 Jupyter 里运行</li>
              <li>读完后去右侧 "代码练习" 动手敲一遍</li>
            </ul>
          </div>
        </aside>

        {/* 正文 */}
        <main className="lg:col-span-3 space-y-6">
          <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <header className="border-b pb-4 mb-6">
              <p className="text-sm text-blue-600 font-medium mb-1">
                项目 {(project as any).title.split('：')[0]} · 第 {currentIdx + 1} 节
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{chapter.title}</h1>
            </header>

            <div className="prose prose-blue max-w-none text-gray-800 leading-7">
              {chapter.content.split('\n\n').map((paragraph: string, index: number) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="text-xl font-bold mt-8 mb-3 text-gray-900">{paragraph.replace('# ', '')}</h2>;
                } else if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="text-lg font-semibold mt-6 mb-2 text-gray-900">{paragraph.replace('## ', '')}</h3>;
                } else if (paragraph.startsWith('    ')) {
                  // 普通缩进文本不处理，按段落渲染
                  return <p key={index} className="my-3 whitespace-pre-wrap">{paragraph}</p>;
                } else if (paragraph.startsWith('|')) {
                  // markdown 表格
                  const lines = paragraph.trim().split('\n');
                  const header = lines[0].split('|').slice(1, -1).map((c) => c.trim());
                  const rows = lines.slice(2).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
                  return (
                    <div key={index} className="my-5 overflow-x-auto">
                      <table className="min-w-full border text-sm">
                        <thead className="bg-gray-50">
                          <tr>{header.map((h, i) => <th key={i} className="border px-3 py-2 text-left">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {rows.map((r, i) => (
                            <tr key={i}>{r.map((c, j) => <td key={j} className="border px-3 py-2">{c}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                } else if (paragraph.startsWith('```')) {
                  const cleaned = paragraph.replace(/^\s*```(python)?\s*/, '').replace(/```\s*$/, '');
                  return (
                    <pre key={index} className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm my-5">
                      <code>{cleaned}</code>
                    </pre>
                  );
                } else {
                  return <p key={index} className="my-3 text-gray-700 whitespace-pre-wrap">{paragraph}</p>;
                }
              })}
            </div>
          </article>

          {/* 上一章/下一章 */}
          <nav className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
            {prevChapterId ? (
              <Link to={`/learn/${courseId}/${prevChapterId}`} className="text-blue-600 hover:underline flex items-center text-sm">
                <ChevronLeft size={16} className="mr-1" />上一节：{chapters[prevChapterId].title}
              </Link>
            ) : <span />}
            {nextChapterId ? (
              <Link to={`/learn/${courseId}/${nextChapterId}`} className="text-blue-600 hover:underline flex items-center text-sm">
                下一节：{chapters[nextChapterId].title}<ChevronRight size={16} className="ml-1" />
              </Link>
            ) : <span />}
          </nav>

          {/* 笔记 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
              <FileText size={18} className="mr-2 text-blue-600" />学习笔记
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="在这里记录你的疑问、灵感、或代码运行结果……"
              className="w-full border border-gray-200 rounded-lg p-4 min-h-[140px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
            <div className="mt-3 text-right">
              <button onClick={() => alert('笔记已保存到本地会话（演示）')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                保存笔记
              </button>
            </div>
          </section>

          {/* 去代码练习 */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">学得差不多了？去代码练习！</h3>
              <p className="text-sm text-gray-600">用真实数据和 Python 环境把本节学到的内容亲手敲一遍。</p>
            </div>
            <Link to={`/practice/${courseId}/${chapter.id}`}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow">
              进入代码练习 →
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Learn;