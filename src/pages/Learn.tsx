import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Fullscreen, BookOpen, Code, CheckCircle, ChevronLeft, Clock } from 'lucide-react';

// 10个项目的章节内容数据
const projectData = {
  '1': {
    id: '1',
    title: '项目1：电商购物车关联规则挖掘',
    chapters: {
      '1': {
        id: '1',
        title: '项目概述与数据准备',
        content: `# 项目概述与数据准备

## 项目背景
在电商平台中，了解用户的购物行为模式对于提升销售和用户体验至关重要。通过分析购物车数据，我们可以发现商品之间的关联关系，从而实现个性化推荐。

## 数据结构
我们将使用包含以下字段的订单数据：
- 订单ID
- 商品名称
- 用户ID
- 购买时间

## pandas技能
- 数据透视表 (pivot_table)
- groupby聚合
- 列表转换
- apply自定义函数

## 学习目标
1. 理解关联规则挖掘的基本概念
2. 掌握Apriori算法的原理
3. 学会使用mlxtend库实现关联规则挖掘
4. 能够生成商品推荐词条`,
        lessons: [
          { id: '1', title: '项目背景与目标', type: 'video', duration: 15, completed: false },
          { id: '2', title: '数据加载与探索', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: 'Apriori算法实现',
        content: `# Apriori算法实现

## 支持度计算
支持度是指某个商品组合在所有订单中出现的频率。

\`\`\`python
# 计算支持度示例
def calculate_support(itemset, transactions):
    count = 0
    for transaction in transactions:
        if itemset.issubset(transaction):
            count += 1
    return count / len(transactions)
\`\`\`

## 置信度与提升度
- 置信度：买了A的用户也买了B的概率
- 提升度：A和B一起出现的概率与期望概率的比值

## 手动实现关联规则
通过逐层搜索的方式，发现频繁项集和关联规则。`,
        lessons: [
          { id: '4', title: '支持度计算', type: 'video', duration: 20, completed: false },
          { id: '5', title: '置信度与提升度', type: 'video', duration: 25, completed: false },
          { id: '6', title: '手动实现关联规则', type: 'code', duration: 45, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: 'mlxtend库应用',
        content: `# mlxtend库应用

## mlxtend简介
mlxtend是一个强大的Python库，提供了关联规则挖掘等机器学习扩展功能。

## TransactionEncoder
将交易数据转换为适合Apriori算法的格式。

\`\`\`python
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

# 转换数据
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df = pd.DataFrame(te_ary, columns=te.columns_)
\`\`\`

## 生成关联规则
使用apriori算法发现频繁项集，然后生成关联规则。`,
        lessons: [
          { id: '7', title: 'mlxtend入门', type: 'video', duration: 20, completed: false },
          { id: '8', title: 'TransactionEncoder使用', type: 'code', duration: 30, completed: false },
          { id: '9', title: '生成关联规则', type: 'code', duration: 25, completed: false },
        ],
      },
      '4': {
        id: '4',
        title: '推荐系统实现',
        content: `# 推荐系统实现

## 推荐词条生成
基于发现的关联规则，生成"买了A的用户也买了B"这样的推荐词条。

## 构建推荐函数
\`\`\`python
def recommend_items(item, rules, top_n=5):
    # 找到包含该商品的规则
    relevant_rules = rules[rules['antecedents'].apply(lambda x: item in x)]
    # 按提升度排序
    relevant_rules = relevant_rules.sort_values('lift', ascending=False)
    # 返回推荐结果
    return relevant_rules.head(top_n)
\`\`\`

## 项目总结
通过本项目，我们学习了如何从购物车数据中发现有价值的关联规则，并实现了一个简单的推荐系统。`,
        lessons: [
          { id: '10', title: '推荐词条生成', type: 'video', duration: 20, completed: false },
          { id: '11', title: '构建推荐函数', type: 'code', duration: 45, completed: false },
          { id: '12', title: '项目总结', type: 'video', duration: 25, completed: false },
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
        title: 'RFM模型基础',
        content: `# RFM模型基础

## RFM简介
RFM是一种基于用户消费行为的客户细分方法：
- Recency (最近一次消费)
- Frequency (消费频率)
- Monetary (消费金额)

## pandas技能
- pd.Timedelta时间差计算
- 分位数划分
- pivot_table数据透视

## 特征计算
\`\`\`python
# 计算RFM特征
current_date = data['order_date'].max()
rfm = data.groupby('user_id').agg(
    recency=('order_date', lambda x: (current_date - x.max()).days),
    frequency=('order_id', 'nunique'),
    monetary=('amount', 'sum')
).reset_index()
\`\`\``,
        lessons: [
          { id: '1', title: 'RFM理论讲解', type: 'video', duration: 20, completed: false },
          { id: '2', title: '数据准备', type: 'code', duration: 35, completed: false },
          { id: '3', title: '特征计算', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '用户分群实现',
        content: `# 用户分群实现

## KMeans聚类
使用KMeans算法对用户进行分群。

\`\`\`python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# 特征标准化
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm[['recency', 'frequency', 'monetary']])

# KMeans聚类
kmeans = KMeans(n_clusters=4, random_state=42)
rfm['cluster'] = kmeans.fit_predict(rfm_scaled)
\`\`\``,
        lessons: [
          { id: '4', title: 'KMeans聚类原理', type: 'video', duration: 25, completed: false },
          { id: '5', title: '特征标准化', type: 'code', duration: 30, completed: false },
          { id: '6', title: '聚类模型训练', type: 'code', duration: 35, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '群体分析与策略',
        content: `# 群体分析与策略

## 可视化展示
使用雷达图展示不同用户群体的特征。

## 营销策略制定
- 高价值用户：保持忠诚度
- 潜力用户：提升消费频率
- 流失用户：召回活动`,
        lessons: [
          { id: '7', title: '群体特征分析', type: 'video', duration: 25, completed: false },
          { id: '8', title: '可视化展示', type: 'code', duration: 40, completed: false },
          { id: '9', title: '营销策略制定', type: 'video', duration: 25, completed: false },
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

## 常见数据问题
- 缺失值
- 重复值
- 异常值
- 不合理的数据

## pandas技能
- isnull/dropna处理缺失值
- duplicated检查重复
- 条件筛选
- clip截断`,
        lessons: [
          { id: '1', title: '常见数据问题', type: 'video', duration: 20, completed: false },
          { id: '2', title: '缺失值处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '重复值处理', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '规则检测方法',
        content: `# 规则检测方法

## Z-score原理
Z-score = (x - μ) / σ

## IQR方法
IQR = Q3 - Q1
异常值范围：< Q1 - 1.5*IQR 或 > Q3 + 1.5*IQR`,
        lessons: [
          { id: '4', title: 'Z-score原理', type: 'video', duration: 20, completed: false },
          { id: '5', title: 'IQR方法实现', type: 'code', duration: 35, completed: false },
          { id: '6', title: '业务规则校验', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: 'AI检测对比',
        content: `# AI检测对比

## Isolation Forest
使用Isolation Forest进行异常检测。

\`\`\`python
from sklearn.ensemble import IsolationForest

# 训练模型
iso_forest = IsolationForest(contamination=0.05, random_state=42)
data['anomaly_score'] = iso_forest.fit_predict(data[['amount']])
\`\`\``,
        lessons: [
          { id: '7', title: 'Isolation Forest', type: 'video', duration: 25, completed: false },
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
        title: '用户行为分析',
        content: `# 用户行为分析

## 漏斗分析概念
从浏览到支付的转化过程分析。

## pandas技能
- groupby按用户/会话聚合
- shift/lag计算步骤顺序
- 布尔索引`,
        lessons: [
          { id: '1', title: '漏斗分析概念', type: 'video', duration: 20, completed: false },
          { id: '2', title: '行为数据预处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '用户路径构建', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '漏斗分析实现',
        content: `# 漏斗分析实现

## 转化率计算
\`\`\`python
# 计算每个步骤的用户数
funnel = data.groupby('step')['user_id'].nunique().reset_index()
funnel.columns = ['step', 'users']

# 计算转化率
funnel['conversion'] = funnel['users'] / funnel['users'].iloc[0]
\`\`\``,
        lessons: [
          { id: '4', title: '转化率计算', type: 'video', duration: 20, completed: false },
          { id: '5', title: '漏斗可视化', type: 'code', duration: 35, completed: false },
          { id: '6', title: '流失点识别', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '付款预测模型',
        content: `# 付款预测模型

## 特征工程
从用户行为数据中提取特征。

## 分类模型训练
使用逻辑回归或随机森林预测用户是否会付款。`,
        lessons: [
          { id: '7', title: '特征工程', type: 'video', duration: 25, completed: false },
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

## pandas技能
- to_datetime日期转换
- resample按周/月聚合
- rolling滑动窗口

\`\`\`python
# 时间索引设置
data['date'] = pd.to_datetime(data['date'])
data = data.set_index('date')

# 按月聚合
monthly_sales = data.resample('M')['sales'].sum()

# 7天滑动平均
data['rolling_7d'] = data['sales'].rolling(window=7).mean()
\`\`\``,
        lessons: [
          { id: '1', title: '时间序列概念', type: 'video', duration: 25, completed: false },
          { id: '2', title: '时间索引处理', type: 'code', duration: 30, completed: false },
          { id: '3', title: '重采样与滚动窗口', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '趋势与季节性分析',
        content: `# 趋势与季节性分析

## 时间序列分解
将时间序列分解为趋势、季节、残差三个部分。`,
        lessons: [
          { id: '4', title: '时间序列分解', type: 'video', duration: 25, completed: false },
          { id: '5', title: '趋势识别', type: 'code', duration: 35, completed: false },
          { id: '6', title: '季节性分析', type: 'code', duration: 30, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '销量预测',
        content: `# 销量预测

## Prophet使用
使用Facebook Prophet进行时间序列预测。

\`\`\`python
from prophet import Prophet

# 准备数据
df = data.reset_index()[['date', 'sales']]
df.columns = ['ds', 'y']

# 训练模型
model = Prophet()
model.fit(df)

# 预测未来
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)
\`\`\``,
        lessons: [
          { id: '7', title: 'Prophet入门', type: 'video', duration: 25, completed: false },
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

## pandas技能
- groupby+shift计算间隔天数
- expanding统计

\`\`\`python
# 计算复购间隔
data = data.sort_values(['user_id', 'order_date'])
data['prev_order'] = data.groupby('user_id')['order_date'].shift(1)
data['repurchase_days'] = (data['order_date'] - data['prev_order']).dt.days
\`\`\``,
        lessons: [
          { id: '1', title: '复购指标定义', type: 'video', duration: 20, completed: false },
          { id: '2', title: '复购间隔计算', type: 'code', duration: 25, completed: false },
          { id: '3', title: '购买频次统计', type: 'code', duration: 15, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '生命周期建模',
        content: `# 生命周期建模

## 活跃度衰减模型
模拟用户活跃度随时间衰减的过程。`,
        lessons: [
          { id: '4', title: '活跃度衰减模型', type: 'video', duration: 20, completed: false },
          { id: '5', title: '特征构建', type: 'code', duration: 35, completed: false },
          { id: '6', title: '用户分群', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '复购模式识别',
        content: `# 复购模式识别

## 聚类分析
使用聚类识别不同复购模式的用户群组。

## 运营策略建议
- 每月一次：定期推送
- 季度回购：季节性促销
- 一次性：激活活动`,
        lessons: [
          { id: '7', title: '聚类分析', type: 'video', duration: 20, completed: false },
          { id: '8', title: '群组画像', type: 'code', duration: 35, completed: false },
          { id: '9', title: '运营策略建议', type: 'video', duration: 20, completed: false },
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
        title: '文本分析基础',
        content: `# 文本分析基础

## pandas技能
- str.contains/extract
- apply自定义情感得分
- cut分箱

\`\`\`python
# 文本处理示例
data['has_keyword'] = data['review'].str.contains('好|差|推荐')
data['keyword'] = data['review'].str.extract(r'(好|差|推荐)')
\`\`\``,
        lessons: [
          { id: '1', title: '文本处理入门', type: 'video', duration: 20, completed: false },
          { id: '2', title: 'pandas字符串操作', type: 'code', duration: 35, completed: false },
          { id: '3', title: '文本数据预处理', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '情感分析实现',
        content: `# 情感分析实现

## SnowNLP使用
使用SnowNLP进行中文情感分析。

\`\`\`python
from snownlp import SnowNLP

# 计算情感得分
def get_sentiment(text):
    s = SnowNLP(text)
    return s.sentiments

data['sentiment'] = data['review'].apply(get_sentiment)
\`\`\``,
        lessons: [
          { id: '4', title: 'SnowNLP使用', type: 'video', duration: 20, completed: false },
          { id: '5', title: '情感得分计算', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'BERT进阶应用', type: 'video', duration: 30, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '不一致分析',
        content: `# 不一致分析

## 矛盾样本识别
识别高分差评和低分好评的样本。

\`\`\`python
# 识别不一致样本
data['sentiment_bin'] = pd.cut(data['sentiment'], bins=[0, 0.3, 0.7, 1], labels=['负面', '中性', '正面'])
data['inconsistent'] = (
    ((data['rating'] >= 4) & (data['sentiment_bin'] == '负面')) |
    ((data['rating'] <= 2) & (data['sentiment_bin'] == '正面'))
)
\`\`\``,
        lessons: [
          { id: '7', title: '矛盾样本识别', type: 'video', duration: 20, completed: false },
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

## 推荐系统类型
- 协同过滤
- 基于内容
- 混合推荐

## pandas技能
- pivot_table产生矩阵
- fillna(0)
- dot点积计算相似度`,
        lessons: [
          { id: '1', title: '推荐系统概述', type: 'video', duration: 25, completed: false },
          { id: '2', title: '用户商品矩阵构建', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '协同过滤实现',
        content: `# 协同过滤实现

## 余弦相似度
\`\`\`python
from sklearn.metrics.pairwise import cosine_similarity

# 计算商品相似度
item_matrix = pivot_table.fillna(0)
item_similarity = cosine_similarity(item_matrix.T)
item_similarity_df = pd.DataFrame(item_similarity, index=item_matrix.columns, columns=item_matrix.columns)
\`\`\``,
        lessons: [
          { id: '4', title: '基于物品的协同过滤', type: 'video', duration: 25, completed: false },
          { id: '5', title: '余弦相似度计算', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'KNN最近邻', type: 'code', duration: 25, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '推荐系统集成',
        content: `# 推荐系统集成

## 购物车推荐逻辑
基于用户当前购物车中的商品，推荐补充商品。

## 推荐API实现
构建推荐API函数。`,
        lessons: [
          { id: '7', title: '购物车推荐逻辑', type: 'video', duration: 20, completed: false },
          { id: '8', title: '推荐API实现', type: 'code', duration: 45, completed: false },
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
        title: 'A/B测试基础',
        content: `# A/B测试基础

## A/B测试概念
通过随机分组，对比不同策略的效果。

## pandas技能
- merge关联
- groupby汇总
- apply标准化`,
        lessons: [
          { id: '1', title: 'A/B测试理论', type: 'video', duration: 20, completed: false },
          { id: '2', title: '实验设计', type: 'video', duration: 20, completed: false },
          { id: '3', title: '数据准备', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '统计检验',
        content: `# 统计检验

## t检验
比较两组均值是否有显著差异。

\`\`\`python
from scipy import stats

# t检验
t_stat, p_value = stats.ttest_ind(
    data[data['group'] == 'treatment']['sales'],
    data[data['group'] == 'control']['sales']
)
\`\`\``,
        lessons: [
          { id: '4', title: '假设检验原理', type: 'video', duration: 25, completed: false },
          { id: '5', title: 't检验实现', type: 'code', duration: 30, completed: false },
          { id: '6', title: '卡方检验', type: 'code', duration: 20, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '效果分析',
        content: `# 效果分析

## 混杂因素控制
使用线性回归控制其他因素的影响。

## 提升度计算
量化活动的净提升效应。`,
        lessons: [
          { id: '7', title: '混杂因素控制', type: 'video', duration: 20, completed: false },
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

## pandas技能
- merge/concat
- fillna/interpolate
- rename
- drop
- query

\`\`\`python
# 数据合并
user_data = pd.merge(orders, users, on='user_id', how='left')
behavior_data = pd.concat([browse, add_cart, purchase], keys=['browse', 'add_cart', 'purchase'])
\`\`\``,
        lessons: [
          { id: '1', title: '多表数据合并', type: 'video', duration: 25, completed: false },
          { id: '2', title: '数据清洗流水线', type: 'code', duration: 45, completed: false },
          { id: '3', title: '质量检查', type: 'code', duration: 20, completed: false },
        ],
      },
      '2': {
        id: '2',
        title: '用户画像构建',
        content: `# 用户画像构建

## RFM+聚类+关联
综合运用前面学习的技术。

## 高潜价值标签
使用决策树解释高潜用户特征。`,
        lessons: [
          { id: '4', title: '特征工程综合', type: 'video', duration: 30, completed: false },
          { id: '5', title: 'RFM+聚类+关联', type: 'code', duration: 60, completed: false },
          { id: '6', title: '高潜价值标签', type: 'code', duration: 30, completed: false },
        ],
      },
      '3': {
        id: '3',
        title: '报告生成',
        content: `# 报告生成

## 可视化仪表盘
使用Plotly创建交互式仪表盘。

## HTML报告导出
\`\`\`python
# 导出HTML报告
from jinja2 import Template

# 使用模板生成报告
template = Template(html_template)
report_html = template.render(data=report_data)

with open('user_profile_report.html', 'w') as f:
    f.write(report_html)
\`\`\``,
        lessons: [
          { id: '7', title: '可视化仪表盘', type: 'video', duration: 25, completed: false },
          { id: '8', title: 'HTML报告导出', type: 'code', duration: 45, completed: false },
          { id: '9', title: '项目总结与展望', type: 'video', duration: 20, completed: false },
        ],
      },
    },
  },
};

const Learn: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notes, setNotes] = useState('');

  // 获取当前项目数据
  const project = projectData[courseId || '1'] || projectData['1'];
  const chapter = project.chapters[chapterId || '1'] || Object.values(project.chapters)[0];
  
  // 获取所有章节
  const allChapters = Object.values(project.chapters);

  // 处理播放/暂停
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 处理全屏
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 处理进度条变化
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 获取当前章节的代码练习
  const codeLesson = chapter.lessons.find(l => l.type === 'code');

  return (
    <div className="space-y-8">
      {/* 面包屑导航 */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">首页</Link>
        <ChevronLeft size={16} />
        <Link to="/courses" className="hover:text-blue-600">课程中心</Link>
        <ChevronLeft size={16} />
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600">{project.title}</Link>
        <ChevronLeft size={16} />
        <span className="text-gray-700 font-medium">{chapter.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧视频播放区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 视频播放器 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
              <div className="aspect-video bg-gray-900 relative">
                {/* 视频占位符 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(chapter.title)}%20data%20analysis%20tutorial&image_size=landscape_16_9`}
                    alt={chapter.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </div>
                  </button>
                </div>
                
                {/* 视频控制栏 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white text-sm">{formatTime(currentTime)}</span>
                    <div className="flex items-center space-x-4">
                      <button className="text-white hover:text-gray-300">
                        <SkipBack size={20} />
                      </button>
                      <button className="text-white hover:text-gray-300" onClick={togglePlay}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <SkipForward size={20} />
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <Volume2 size={20} />
                      </button>
                      <button className="text-white hover:text-gray-300" onClick={toggleFullscreen}>
                        <Fullscreen size={20} />
                      </button>
                    </div>
                    <span className="text-white text-sm">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 章节内容 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
            <div className="prose max-w-none">
              {chapter.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('# ', '')}</h3>;
                } else if (paragraph.startsWith('## ')) {
                  return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace('## ', '')}</h4>;
                } else if (paragraph.startsWith('- ')) {
                  return <ul key={index} className="list-disc pl-5 space-y-1">
                    {paragraph.split('- ').filter(p => p).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>;
                } else if (paragraph.startsWith('```')) {
                  return <pre key={index} className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"><code>{paragraph.replace(/```/g, '')}</code></pre>;
                } else {
                  return <p key={index} className="mb-3">{paragraph}</p>;
                }
              })}
            </div>
          </div>

          {/* 笔记功能 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">学习笔记</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="在这里记录你的学习笔记..."
              className="w-full border border-gray-300 rounded-lg p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                保存笔记
              </button>
            </div>
          </div>
        </div>

        {/* 右侧章节导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold">章节内容</h3>
            </div>
            <div className="p-4 space-y-2">
              {chapter.lessons.map((lesson) => {
                const isActive = lesson.type === 'video';
                const Icon = lesson.type === 'video' ? Play : lesson.type === 'code' ? Code : BookOpen;
                return (
                  <Link
                    key={lesson.id}
                    to={`/${lesson.type === 'code' ? 'practice' : 'learn'}/${courseId}/${lesson.type === 'code' ? lesson.id : chapter.id}`}
                    className={`flex items-center p-2 rounded-md transition ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {lesson.completed ? <CheckCircle size={16} /> : <Icon size={16} />}
                    </div>
                    <span className="flex-grow">{lesson.title}</span>
                    <span className="text-gray-500 text-sm">{lesson.duration} 分钟</span>
                  </Link>
                );
              })}
            </div>
            {codeLesson && (
              <div className="p-4 border-t">
                <Link
                  to={`/practice/${courseId}/${codeLesson.id}`}
                  className="block w-full py-2 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition"
                >
                  代码练习
                </Link>
              </div>
            )}
            
            {/* 所有章节列表 */}
            <div className="p-4 border-t">
              <h4 className="font-semibold mb-3 text-sm text-gray-500">所有章节</h4>
              <div className="space-y-2">
                {allChapters.map((ch) => (
                  <Link
                    key={ch.id}
                    to={`/learn/${courseId}/${ch.id}`}
                    className={`flex items-center p-2 rounded-md transition text-sm ${ch.id === chapter.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    <span>{ch.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
