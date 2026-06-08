import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, CheckCircle, XCircle, ChevronLeft, Code, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

// 10个项目的代码练习数据
const practiceData = {
  '1': {
    id: '1',
    projectId: '1',
    title: '数据加载与探索',
    description: '学习如何使用pandas加载电商数据，进行初步的数据探索和分析。',
    difficulty: 'easy',
    starterCode: `# 项目1：数据加载与探索
import pandas as pd
import numpy as np

# 示例数据 - 电商订单数据
data = {
    'order_id': [1, 2, 3, 4, 5],
    'user_id': [101, 102, 101, 103, 102],
    'product': ['牛奶', '面包', '鸡蛋', '牛奶', '面包'],
    'amount': [25, 15, 12, 25, 15],
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-03', '2024-01-04']
}

# TODO: 创建DataFrame并进行基础探索
df = pd.DataFrame(data)
print("数据形状:", df.shape)
print("\\n前5行数据:")
print(df.head())

print("\\n数据类型:")
print(df.dtypes)

print("\\n统计信息:")
print(df.describe())

print("\\n商品销量统计:")
print(df['product'].value_counts())

print("\\n总销售额:")
total_sales = df['amount'].sum()
print(f"总销售额: {total_sales}元")
`,
    expectedOutput: '总销售额: 92元',
    solution: `# 项目1：数据加载与探索 - 完整答案
import pandas as pd
import numpy as np

# 示例数据 - 电商订单数据
data = {
    'order_id': [1, 2, 3, 4, 5],
    'user_id': [101, 102, 101, 103, 102],
    'product': ['牛奶', '面包', '鸡蛋', '牛奶', '面包'],
    'amount': [25, 15, 12, 25, 15],
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-03', '2024-01-04']
}

df = pd.DataFrame(data)
print("数据形状:", df.shape)
print("\\n前5行数据:")
print(df.head())
print("\\n数据类型:")
print(df.dtypes)
print("\\n统计信息:")
print(df.describe())
print("\\n商品销量统计:")
print(df['product'].value_counts())
print("\\n总销售额:")
total_sales = df['amount'].sum()
print(f"总销售额: {total_sales}元")

print("\\n每个商品的销售额:")
product_sales = df.groupby('product')['amount'].sum()
print(product_sales)

print("\\n每个用户的购买次数:")
user_purchases = df.groupby('user_id').size()
print(user_purchases)
`,
    hint: '使用pd.DataFrame创建数据框，用head()查看数据，用describe()获取统计信息，用groupby进行聚合分析。'
  },
  '2': {
    id: '2',
    projectId: '1',
    title: '数据预处理',
    description: '学习如何清洗和预处理电商数据，为关联规则挖掘做准备。',
    difficulty: 'medium',
    starterCode: `# 数据预处理
import pandas as pd

# 购物车数据
data = {
    'order_id': [1, 1, 1, 2, 2, 3, 3, 3, 4],
    'product': ['牛奶', '面包', '鸡蛋', '面包', '黄油', '牛奶', '面包', '黄油', '牛奶']
}

df = pd.DataFrame(data)

# TODO: 将数据转换为购物篮格式
print("原始数据:")
print(df)

# 按订单ID分组，收集每个订单的商品
baskets = df.groupby('order_id')['product'].apply(list)
print("\\n购物篮数据:")
print(baskets)

print("\\n购物篮数量:", len(baskets))
`,
    expectedOutput: '购物篮数量: 4',
    solution: `# 数据预处理 - 完整答案
import pandas as pd
from collections import defaultdict

data = {
    'order_id': [1, 1, 1, 2, 2, 3, 3, 3, 4],
    'product': ['牛奶', '面包', '鸡蛋', '面包', '黄油', '牛奶', '面包', '黄油', '牛奶']
}

df = pd.DataFrame(data)
print("原始数据:")
print(df)

baskets = df.groupby('order_id')['product'].apply(list)
print("\\n购物篮数据:")
print(baskets)
print("\\n购物篮数量:", len(baskets))

print("\\n所有商品列表:")
all_products = sorted(df['product'].unique())
print(all_products)

print("\\n商品出现频率:")
product_count = df['product'].value_counts()
print(product_count)
`,
    hint: '使用groupby按订单ID分组，用apply(list)将商品收集为列表。'
  },
  '3': {
    id: '3',
    projectId: '1',
    title: '关联规则挖掘',
    description: '实现基础的关联规则挖掘，计算支持度、置信度和提升度。',
    difficulty: 'medium',
    starterCode: `# 关联规则挖掘
from collections import defaultdict, Counter

# 购物篮数据
baskets = [
    ['牛奶', '面包', '鸡蛋'],
    ['面包', '黄油'],
    ['牛奶', '面包', '黄油'],
    ['牛奶']
]

# TODO: 计算单个商品的支持度
print("计算商品支持度...")
total_baskets = len(baskets)
product_count = Counter()

for basket in baskets:
    for product in basket:
        product_count[product] += 1

print("\\n商品出现次数:")
for product, count in product_count.items():
    support = count / total_baskets
    print(f"{product}: {support:.2%}")

print("\\n总订单数:", total_baskets)
`,
    expectedOutput: '总订单数: 4',
    solution: `# 关联规则挖掘 - 完整答案
from collections import defaultdict, Counter
from itertools import combinations

baskets = [
    ['牛奶', '面包', '鸡蛋'],
    ['面包', '黄油'],
    ['牛奶', '面包', '黄油'],
    ['牛奶']
]

total_baskets = len(baskets)
product_count = Counter()

for basket in baskets:
    for product in basket:
        product_count[product] += 1

print("商品出现次数:")
for product, count in product_count.items():
    support = count / total_baskets
    print(f"{product}: {support:.2%}")

print("\\n总订单数:", total_baskets)

print("\\n商品组合的支持度:")
pairs_count = defaultdict(int)
for basket in baskets:
    for pair in combinations(sorted(basket), 2):
        pairs_count[pair] += 1

for pair, count in pairs_count.items():
    support = count / total_baskets
    print(f"{pair}: {support:.2%}")

print("\\n简单推荐规则:")
for (a, b), count in pairs_count.items():
    confidence = count / product_count[a]
    print(f"买了{a}的人，也买了{b}: 置信度{confidence:.2%}")
`,
    hint: '使用itertools.combinations生成商品组合，用Counter统计出现频率。'
  },
  '4': {
    id: '4',
    projectId: '2',
    title: 'RFM特征计算',
    description: '计算用户的RFM特征：最近消费、消费频率、消费金额。',
    difficulty: 'medium',
    starterCode: `# RFM特征计算
import pandas as pd
from datetime import datetime

# 用户订单数据
data = {
    'user_id': [1, 1, 2, 2, 2, 3, 3, 3, 3, 4],
    'order_date': ['2024-01-01', '2024-01-15', '2024-01-05', '2024-01-10', '2024-01-20',
                   '2024-01-02', '2024-01-08', '2024-01-18', '2024-01-25', '2024-01-01'],
    'amount': [100, 150, 80, 120, 200, 50, 75, 180, 90, 60]
}

df = pd.DataFrame(data)
df['order_date'] = pd.to_datetime(df['order_date'])

# TODO: 计算RFM特征
print("原始数据:")
print(df.head())

current_date = df['order_date'].max()
print(f"\\n当前日期: {current_date}")

print("\\n计算RFM特征中...")
`,
    expectedOutput: '计算RFM特征中...',
    solution: `# RFM特征计算 - 完整答案
import pandas as pd
from datetime import datetime

data = {
    'user_id': [1, 1, 2, 2, 2, 3, 3, 3, 3, 4],
    'order_date': ['2024-01-01', '2024-01-15', '2024-01-05', '2024-01-10', '2024-01-20',
                   '2024-01-02', '2024-01-08', '2024-01-18', '2024-01-25', '2024-01-01'],
    'amount': [100, 150, 80, 120, 200, 50, 75, 180, 90, 60]
}

df = pd.DataFrame(data)
df['order_date'] = pd.to_datetime(df['order_date'])

print("原始数据:")
print(df.head())

current_date = df['order_date'].max()
print(f"\\n当前日期: {current_date}")

print("\\n计算RFM特征中...")

rfm = df.groupby('user_id').agg(
    recency=('order_date', lambda x: (current_date - x.max()).days),
    frequency=('order_id', 'count'),
    monetary=('amount', 'sum')
).reset_index()

print("\\nRFM特征:")
print(rfm)

print("\\nRFM统计:")
print(rfm.describe())
`,
    hint: '使用groupby聚合用户数据，用lambda函数计算最近消费天数。'
  },
  '5': {
    id: '5',
    projectId: '2',
    title: 'KMeans用户分群',
    description: '使用KMeans聚类算法对用户进行价值分群。',
    difficulty: 'medium',
    starterCode: `# KMeans用户分群
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# RFM数据
rfm_data = {
    'user_id': [1, 2, 3, 4],
    'recency': [10, 5, 0, 24],
    'frequency': [2, 3, 4, 1],
    'monetary': [250, 400, 395, 60]
}

rfm = pd.DataFrame(rfm_data)
print("原始RFM数据:")
print(rfm)

# TODO: 特征标准化和聚类
features = rfm[['recency', 'frequency', 'monetary']]

print("\\n特征标准化中...")
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)
`,
    expectedOutput: '特征标准化中...',
    solution: `# KMeans用户分群 - 完整答案
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

rfm_data = {
    'user_id': [1, 2, 3, 4],
    'recency': [10, 5, 0, 24],
    'frequency': [2, 3, 4, 1],
    'monetary': [250, 400, 395, 60]
}

rfm = pd.DataFrame(rfm_data)
print("原始RFM数据:")
print(rfm)

features = rfm[['recency', 'frequency', 'monetary']]

print("\\n特征标准化中...")
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

print("\\n标准化后的数据:")
print(pd.DataFrame(scaled_features, columns=features.columns))

print("\\nKMeans聚类中...")
kmeans = KMeans(n_clusters=3, random_state=42)
rfm['cluster'] = kmeans.fit_predict(scaled_features)

print("\\n分群结果:")
print(rfm)

print("\\n各群统计:")
cluster_stats = rfm.groupby('cluster').agg({
    'recency': 'mean',
    'frequency': 'mean',
    'monetary': 'mean',
    'user_id': 'count'
}).round(1)
cluster_stats.columns = ['平均最近天数', '平均消费频率', '平均消费金额', '用户数量']
print(cluster_stats)
`,
    hint: '使用StandardScaler标准化特征，然后用KMeans进行聚类。'
  },
  '6': {
    id: '6',
    projectId: '3',
    title: '数据清洗基础',
    description: '学习处理缺失值、重复值和异常值。',
    difficulty: 'easy',
    starterCode: `# 数据清洗基础
import pandas as pd
import numpy as np

# 包含问题的数据
data = {
    'order_id': [1, 2, 3, 4, 5, 5, 6],
    'amount': [100, -50, 150, np.nan, 80, 80, 1000],
    'user_id': [101, 102, 103, 104, 105, 105, 106]
}

df = pd.DataFrame(data)
print("原始数据:")
print(df)

print("\\n开始数据清洗...")
`,
    expectedOutput: '开始数据清洗...',
    solution: `# 数据清洗基础 - 完整答案
import pandas as pd
import numpy as np

data = {
    'order_id': [1, 2, 3, 4, 5, 5, 6],
    'amount': [100, -50, 150, np.nan, 80, 80, 1000],
    'user_id': [101, 102, 103, 104, 105, 105, 106]
}

df = pd.DataFrame(data)
print("原始数据:")
print(df)

print("\\n开始数据清洗...")

print("\\n1. 检查重复订单:")
duplicates = df.duplicated('order_id', keep='first')
print(f"重复订单数量: {duplicates.sum()}")

df_clean = df.drop_duplicates('order_id', keep='first')
print(f"删除重复后数据形状: {df_clean.shape}")

print("\\n2. 检查缺失值:")
missing = df_clean.isnull().sum()
print(missing)

df_clean = df_clean.dropna(subset=['amount'])
print(f"删除缺失后数据形状: {df_clean.shape}")

print("\\n3. 检查异常金额:")
negative_amounts = (df_clean['amount'] <= 0).sum()
print(f"异常金额数量: {negative_amounts}")

df_clean = df_clean[df_clean['amount'] > 0]
print(f"清洗后最终数据:")
print(df_clean)
`,
    hint: '使用duplicated检查重复，isnull检查缺失，条件筛选处理异常值。'
  },
  '7': {
    id: '7',
    projectId: '4',
    title: '漏斗分析基础',
    description: '计算用户在购物流程各阶段的转化率。',
    difficulty: 'medium',
    starterCode: `# 漏斗分析基础
import pandas as pd

# 用户行为数据
data = {
    'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 4],
    'step': ['浏览', '加购', '支付', '浏览', '加购', '浏览', '加购', '支付', '浏览'],
    'timestamp': pd.date_range('2024-01-01', periods=9, freq='H')
}

df = pd.DataFrame(data)
print("用户行为数据:")
print(df)

print("\\n计算各阶段用户数...")
`,
    expectedOutput: '计算各阶段用户数...',
    solution: `# 漏斗分析基础 - 完整答案
import pandas as pd

data = {
    'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 4],
    'step': ['浏览', '加购', '支付', '浏览', '加购', '浏览', '加购', '支付', '浏览'],
    'timestamp': pd.date_range('2024-01-01', periods=9, freq='H')
}

df = pd.DataFrame(data)
print("用户行为数据:")
print(df)

print("\\n计算各阶段用户数...")

funnel_steps = ['浏览', '加购', '支付']
funnel_data = []

for step in funnel_steps:
    user_count = df[df['step'] == step]['user_id'].nunique()
    funnel_data.append({'步骤': step, '用户数': user_count})

funnel_df = pd.DataFrame(funnel_data)
print("\\n漏斗数据:")
print(funnel_df)

funnel_df['转化率'] = funnel_df['用户数'] / funnel_df['用户数'].iloc[0]
funnel_df['累计留存率'] = funnel_df['转化率']

print("\\n完整漏斗分析:")
for i, row in funnel_df.iterrows():
    if i == 0:
        print(f"{row['步骤']}: {row['用户数']}人")
    else:
        print(f"{row['步骤']}: {row['用户数']}人 (转化率: {row['转化率']:.1%})")
`,
    hint: '用nunique统计每个阶段的独立用户数，计算从上一阶段到当前阶段的转化率。'
  },
  '8': {
    id: '8',
    projectId: '5',
    title: '时间序列分析',
    description: '分析销售趋势和季节性变化。',
    difficulty: 'advanced',
    starterCode: `# 时间序列分析
import pandas as pd
import numpy as np

# 销售数据
dates = pd.date_range('2024-01-01', periods=90, freq='D')
sales = np.random.randint(50, 200, 90) + np.sin(np.linspace(0, 6*np.pi, 90)) * 30

df = pd.DataFrame({'date': dates, 'sales': sales})
df = df.set_index('date')

print("销售数据前5行:")
print(df.head())

print("\\n开始时间序列分析...")
`,
    expectedOutput: '开始时间序列分析...',
    solution: `# 时间序列分析 - 完整答案
import pandas as pd
import numpy as np

dates = pd.date_range('2024-01-01', periods=90, freq='D')
sales = np.random.randint(50, 200, 90) + np.sin(np.linspace(0, 6*np.pi, 90)) * 30

df = pd.DataFrame({'date': dates, 'sales': sales})
df = df.set_index('date')

print("销售数据前5行:")
print(df.head())

print("\\n开始时间序列分析...")

print("\\n1. 按月聚合:")
monthly = df.resample('M')['sales'].sum()
print(monthly)

print("\\n2. 7天移动平均:")
df['ma_7'] = df['sales'].rolling(window=7).mean()
print(df[['sales', 'ma_7']].head(10))

print("\\n3. 统计指标:")
print(f"日均销量: {df['sales'].mean():.1f}")
print(f"最高销量: {df['sales'].max():.0f} (日期: {df['sales'].idxmax().date()})")
print(f"最低销量: {df['sales'].min():.0f} (日期: {df['sales'].idxmin().date()})")

print("\\n4. 周几销量分析:")
df['weekday'] = df.index.weekday
weekday_sales = df.groupby('weekday')['sales'].mean()
weekday_names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
weekday_sales.index = weekday_names
print(weekday_sales.sort_values(ascending=False))
`,
    hint: '使用resample按时间聚合，rolling计算移动平均，weekday提取星期信息。'
  },
  '9': {
    id: '9',
    projectId: '9',
    title: 'A/B测试分析',
    description: '分析促销活动的效果，计算提升度和统计显著性。',
    difficulty: 'medium',
    starterCode: `# A/B测试分析
import pandas as pd
import numpy as np
from scipy import stats

# 实验数据
np.random.seed(42)
data = {
    'user_id': range(1, 1001),
    'group': np.random.choice(['control', 'treatment'], 1000, p=[0.5, 0.5]),
    'purchased': np.random.binomial(1, 0.08, 1000)
}

df = pd.DataFrame(data)
df.loc[df['group'] == 'treatment', 'purchased'] = np.random.binomial(1, 0.12, 
                                                                      len(df[df['group'] == 'treatment']))

print("实验数据前10行:")
print(df.head(10))

print("\\n开始A/B测试分析...")
`,
    expectedOutput: '开始A/B测试分析...',
    solution: `# A/B测试分析 - 完整答案
import pandas as pd
import numpy as np
from scipy import stats

np.random.seed(42)
data = {
    'user_id': range(1, 1001),
    'group': np.random.choice(['control', 'treatment'], 1000, p=[0.5, 0.5]),
    'purchased': np.random.binomial(1, 0.08, 1000)
}

df = pd.DataFrame(data)
df.loc[df['group'] == 'treatment', 'purchased'] = np.random.binomial(1, 0.12, 
                                                                      len(df[df['group'] == 'treatment']))

print("实验数据前10行:")
print(df.head(10))

print("\\n开始A/B测试分析...")

ab_summary = df.groupby('group').agg({
    'user_id': 'count',
    'purchased': ['sum', 'mean']
})

ab_summary.columns = ['用户数', '购买人数', '购买率']
print("\\n两组表现:")
print(ab_summary)

control_rate = ab_summary.loc['control', '购买率']
treatment_rate = ab_summary.loc['treatment', '购买率']
lift = (treatment_rate - control_rate) / control_rate * 100

print(f"\\n对照组购买率: {control_rate:.1%}")
print(f"实验组购买率: {treatment_rate:.1%}")
print(f"提升效果: {lift:.1f}%")

print("\\n统计显著性检验:")
control_purchased = ab_summary.loc['control', '购买人数']
treatment_purchased = ab_summary.loc['treatment', '购买人数']
control_total = ab_summary.loc['control', '用户数']
treatment_total = ab_summary.loc['treatment', '用户数']

contingency_table = [
    [control_purchased, control_total - control_purchased],
    [treatment_purchased, treatment_total - treatment_purchased]
]

chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)

print(f"卡方值: {chi2:.4f}")
print(f"P值: {p_value:.4f}")
print(f"{'实验结果显著' if p_value < 0.05 else '实验结果不显著'}")
`,
    hint: '使用卡方检验比较两组转化率的差异，计算提升度。'
  },
  '10': {
    id: '10',
    projectId: '10',
    title: '综合数据处理',
    description: '综合运用所有技能，完成完整的数据分析流程。',
    difficulty: 'advanced',
    starterCode: `# 综合数据处理项目
import pandas as pd
import numpy as np

print("电商数据分析综合项目")
print("=" * 50)

# TODO: 综合应用所学技能
print("\\n1. 数据加载与合并")
print("2. 数据清洗")
print("3. 特征工程")
print("4. 数据分析")
print("5. 结果导出")

print("\\n项目进行中...")
`,
    expectedOutput: '项目进行中...',
    solution: `# 综合数据处理项目 - 完整答案
import pandas as pd
import numpy as np

print("电商数据分析综合项目")
print("=" * 50)

print("\\n1. 数据加载与合并")

# 创建模拟数据
orders_data = {
    'order_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'user_id': [101, 102, 101, 103, 104, 102, 105, 101],
    'product': ['牛奶', '面包', '鸡蛋', '牛奶', '饼干', '面包', '牛奶', '黄油'],
    'amount': [25, 15, 12, 25, 18, 15, 25, 20],
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-05', 
             '2024-01-06', '2024-01-08', '2024-01-10', '2024-01-15']
}

users_data = {
    'user_id': [101, 102, 103, 104, 105],
    'age': [25, 30, 28, 35, 22],
    'city': ['北京', '上海', '广州', '深圳', '北京']
}

orders = pd.DataFrame(orders_data)
users = pd.DataFrame(users_data)

print("订单数据:")
print(orders.head())
print("\\n用户数据:")
print(users.head())

print("\\n合并数据...")
df = pd.merge(orders, users, on='user_id', how='left')
print(f"合并后数据形状: {df.shape}")

print("\\n2. 数据分析")
print("\\n商品销量排行:")
product_sales = df.groupby('product')['amount'].agg(['sum', 'count'])
product_sales.columns = ['总金额', '销售量']
print(product_sales.sort_values('总金额', ascending=False))

print("\\n城市销售分布:")
city_sales = df.groupby('city')['amount'].sum()
print(city_sales.sort_values(ascending=False))

print("\\n用户RFM分析:")
df['date'] = pd.to_datetime(df['date'])
current_date = df['date'].max()

rfm = df.groupby('user_id').agg(
    recency=('date', lambda x: (current_date - x.max()).days),
    frequency=('order_id', 'count'),
    monetary=('amount', 'sum')
)

print(rfm)

print("\\n项目完成！")
`,
    hint: '综合运用merge、groupby、agg、时间处理等技能完成完整流程。'
  }
};

const Practice: React.FC = () => {
  const { courseId, exerciseId } = useParams<{ courseId: string; exerciseId: string }>();
  const currentExercise = practiceData[exerciseId || '1'] || practiceData['1'];
  
  const [code, setCode] = useState(currentExercise.starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const allExercises = Object.values(practiceData);

  // 简单的Python解析器 - 处理print语句
  const simplePythonRunner = (code: string): string => {
    let output = '';
    const lines = code.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // 跳过注释和空行
      if (trimmed.startsWith('#') || trimmed === '') continue;
      
      // 处理print语句
      if (trimmed.startsWith('print(')) {
        try {
          const contentMatch = trimmed.match(/print\\((.*)\\)/);
          if (contentMatch) {
            let content = contentMatch[1];
            
            if ((content.startsWith('"') && content.endsWith('"')) || 
                (content.startsWith("'") && content.endsWith("'"))) {
              content = content.substring(1, content.length - 1);
            }
            
            output += content + '\n';
          }
        } catch (e) {
          output += `语法错误: ${line}\\n`;
        }
      }
    }
    
    return output || '(无输出，请添加print语句查看结果)';
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('运行中...');
    setIsCorrect(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userOutput = simplePythonRunner(code);
      setOutput(userOutput);
      
      const trimmedOutput = userOutput.trim();
      const expectedOutput = currentExercise.expectedOutput.trim();
      setIsCorrect(trimmedOutput === expectedOutput);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setOutput(`错误: ${errorMessage}`);
      setIsCorrect(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(currentExercise.starterCode);
    setOutput('');
    setIsCorrect(null);
  };

  const handleShowSolution = () => {
    setCode(currentExercise.solution);
  };

  const projectExercises = allExercises.filter(e => e.projectId === courseId);
  const exerciseIndex = projectExercises.findIndex(e => e.id === currentExercise.id);
  const prevExercise = exerciseIndex > 0 ? projectExercises[exerciseIndex - 1] : null;
  const nextExercise = exerciseIndex < projectExercises.length - 1 ? projectExercises[exerciseIndex + 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">首页</Link>
        <ChevronLeft size={16} />
        <Link to="/courses" className="hover:text-blue-600">课程中心</Link>
        <ChevronLeft size={16} />
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600">项目{courseId}</Link>
        <ChevronLeft size={16} />
        <span className="text-gray-700 font-medium">代码练习</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                currentExercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                currentExercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {currentExercise.difficulty === 'easy' ? '简单' : 
                 currentExercise.difficulty === 'medium' ? '中等' : '困难'}
              </span>
              <h1 className="text-2xl font-bold ml-3">{currentExercise.title}</h1>
            </div>
            <p className="text-gray-600 mb-4">{currentExercise.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t">
              {prevExercise ? (
                <Link
                  to={`/practice/${courseId}/${prevExercise.id}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  上一题: {prevExercise.title}
                </Link>
              ) : (
                <div></div>
              )}
              {nextExercise ? (
                <Link
                  to={`/practice/${courseId}/${nextExercise.id}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  下一题: {nextExercise.title}
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm">practice.py</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleResetCode}
                  className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  重置
                </button>
                <button
                  onClick={handleShowSolution}
                  className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  查看答案
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[400px] p-4 font-mono text-sm bg-gray-50 border-t border-gray-200 focus:outline-none"
              spellCheck={false}
            ></textarea>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Play size={16} className="mr-2" />
                {isRunning ? '运行中...' : '运行代码'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gray-800 text-white p-3">
              <span>输出结果</span>
            </div>
            <div className="p-4 min-h-[200px] bg-gray-50 border-t font-mono text-sm">
              {output ? (
                <div className={`p-3 rounded ${
                  isCorrect === true ? 'bg-green-100 text-green-800' : 
                  isCorrect === false ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {output}
                  {isCorrect === true && (
                    <div className="mt-2 flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      太棒了！答案正确！
                    </div>
                  )}
                  {isCorrect === false && (
                    <div className="mt-2 flex items-center">
                      <XCircle size={16} className="mr-2" />
                      还需要改进哦！可以查看提示或答案。
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">运行代码后将显示输出结果</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold">练习信息</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">难度</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  currentExercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                  currentExercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {currentExercise.difficulty === 'easy' ? '简单' : 
                   currentExercise.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">提示</h4>
                <p className="text-sm text-gray-600">{currentExercise.hint}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">本项目练习</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {projectExercises.map((exercise) => (
                    <Link
                      key={exercise.id}
                      to={`/practice/${courseId}/${exercise.id}`}
                      className={`flex items-center p-2 rounded-md transition ${
                        exercise.id === currentExercise.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Code size={16} className="mr-2" />
                      <span className="text-sm">{exercise.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <Link
                  to={`/courses/${courseId}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span>返回项目详情</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
