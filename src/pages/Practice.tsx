import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, CheckCircle, XCircle, ChevronLeft, Code, BookOpen, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const practiceData = {
  '1': {
    id: '1',
    projectId: '1',
    title: '数据加载与探索',
    description: '学习如何使用pandas加载电商数据，进行初步的数据探索和分析。',
    difficulty: 'easy',
    starterCode: `import pandas as pd

# 电商订单数据
data = {
    'order_id': [1, 2, 3, 4, 5],
    'user_id': [101, 102, 101, 103, 102],
    'product': ['牛奶', '面包', '鸡蛋', '牛奶', '面包'],
    'amount': [25, 15, 12, 25, 15],
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-03', '2024-01-04']
}

# 创建DataFrame并探索
df = pd.DataFrame(data)
print("数据形状:", df.shape)
print("\\n前5行数据:")
print(df.head())
print("\\n统计信息:")
print(df.describe())
print("\\n商品销量统计:")
print(df['product'].value_counts())
print("\\n总销售额:")
print(f"总销售额: {df['amount'].sum()}元")`,
    expectedOutput: '总销售额: 77元',
    hint: '使用 pd.DataFrame 创建数据框，用 head() 查看数据，用 describe() 获取统计信息。',
  },
  '2': {
    id: '2',
    projectId: '1',
    title: '数据预处理',
    description: '学习如何清洗和预处理电商数据，为关联规则挖掘做准备。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

# 购物车数据
data = {
    'order_id': [1, 1, 1, 2, 2, 3, 3, 3, 4],
    'product': ['牛奶', '面包', '鸡蛋', '面包', '黄油', '牛奶', '面包', '黄油', '牛奶']
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 按订单ID分组，收集每个订单的商品
baskets = df.groupby('order_id')['product'].apply(list)
print("\\n购物篮数据:")
print(baskets)
print("\\n购物篮数量:", len(baskets))

# 看看有哪些商品
print("\\n所有商品:")
print(sorted(df['product'].unique()))`,
    expectedOutput: '购物篮数量: 4',
    hint: '使用 groupby + apply(list) 将同一个订单的商品合并。',
  },
  '3': {
    id: '3',
    projectId: '1',
    title: '关联规则挖掘',
    description: '实现基础的关联规则挖掘，计算支持度、置信度。',
    difficulty: 'medium',
    starterCode: `from collections import Counter
from itertools import combinations

baskets = [
    ['牛奶', '面包', '鸡蛋'],
    ['面包', '黄油'],
    ['牛奶', '面包', '黄油'],
    ['牛奶']
]

total = len(baskets)
product_count = Counter()
for basket in baskets:
    for p in basket:
        product_count[p] += 1

print("商品出现次数 & 支持度:")
for product, count in product_count.items():
    print(f"  {product}: {count}次, 支持度 {count/total:.1%}")

print("\\n商品组合的支持度:")
pair_count = Counter()
for basket in baskets:
    for pair in combinations(sorted(basket), 2):
        pair_count[pair] += 1

for pair, count in pair_count.items():
    print(f"  {pair}: {count}次, 支持度 {count/total:.1%}")`,
    expectedOutput: '商品组合的支持度',
    hint: '使用 itertools.combinations 生成商品组合，用 Counter 统计。',
  },
  '4': {
    id: '4',
    projectId: '2',
    title: 'RFM特征计算',
    description: '计算用户的 RFM 特征：最近消费天数、消费频次、消费金额。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

data = {
    'user_id': [1, 1, 2, 2, 2, 3, 3, 3, 3, 4],
    'order_date': ['2024-01-01', '2024-01-15', '2024-01-05', '2024-01-10', '2024-01-20',
                   '2024-01-02', '2024-01-08', '2024-01-18', '2024-01-25', '2024-01-01'],
    'amount': [100, 150, 80, 120, 200, 50, 75, 180, 90, 60]
}
df = pd.DataFrame(data)
df['order_date'] = pd.to_datetime(df['order_date'])

current_date = df['order_date'].max()
print(f"分析截止日期: {current_date.date()}")

# 计算 RFM
rfm = df.groupby('user_id').agg(
    recency=('order_date', lambda x: (current_date - x.max()).days),
    frequency=('order_date', 'count'),
    monetary=('amount', 'sum'),
).reset_index()

print("\\nRFM 特征表:")
print(rfm)`,
    expectedOutput: 'RFM 特征表',
    hint: 'Recency = 当前日期 - 最近消费日期；Frequency = 订单数；Monetary = 总金额。',
  },
  '5': {
    id: '5',
    projectId: '2',
    title: '用户价值分群',
    description: '根据RFM特征对用户进行价值分群。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

rfm_data = {
    'user_id': [1, 2, 3, 4, 5, 6],
    'recency':   [10,  5,  0, 24,  3, 30],
    'frequency': [2,  3,  4,  1,  5,  1],
    'monetary': [250, 400, 395, 60, 600, 50]
}
rfm = pd.DataFrame(rfm_data)
print("原始 RFM 数据:")
print(rfm)

# 简单分群规则
def assign_cluster(row):
    if row['frequency'] >= 4 and row['monetary'] >= 300:
        return '高价值'
    elif row['recency'] <= 7:
        return '活跃用户'
    elif row['recency'] > 20:
        return '流失预警'
    else:
        return '普通用户'

rfm['cluster'] = rfm.apply(assign_cluster, axis=1)
print("\\n分群结果:")
print(rfm)

print("\\n每群人数:")
print(rfm['cluster'].value_counts())`,
    expectedOutput: '分群结果',
    hint: '用简单规则做分群，高价值 = 高频次+高金额，活跃 = 近期有消费。',
  },
  '6': {
    id: '6',
    projectId: '3',
    title: '数据清洗基础',
    description: '处理缺失值、重复值和异常值。',
    difficulty: 'easy',
    starterCode: `import pandas as pd

data = {
    'order_id': [1, 2, 3, 4, 5, 5, 6],
    'amount':   [100, -50, 150, None, 80, 80, 1000],
    'user_id':  [101, 102, 103, 104, 105, 105, 106]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 1) 去重
dup = df.duplicated('order_id').sum()
print(f"\\n重复订单数: {dup}")
df_clean = df.drop_duplicates('order_id', keep='first')

# 2) 缺失值
missing = df_clean['amount'].isnull().sum()
print(f"缺失金额数: {missing}")
df_clean = df_clean.dropna(subset=['amount'])

# 3) 异常值
print(f"异常金额数: {(df_clean['amount'] <= 0).sum()}")
df_clean = df_clean[df_clean['amount'] > 0]

print("\\n清洗后数据:")
print(df_clean.reset_index(drop=True))`,
    expectedOutput: '清洗后数据',
    hint: 'duplicated → drop_duplicates，isnull → dropna，条件过滤处理异常值。',
  },
  '7': {
    id: '7',
    projectId: '4',
    title: '漏斗分析基础',
    description: '计算用户在购物流程各阶段的转化率。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

data = {
    'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 4, 5],
    'step':    ['浏览', '加购', '支付', '浏览', '加购', '浏览', '加购', '支付', '浏览', '浏览']
}
df = pd.DataFrame(data)
print("用户行为数据:")
print(df)

funnel_steps = ['浏览', '加购', '支付']
rows = []
for step in funnel_steps:
    n = df[df['step'] == step]['user_id'].nunique()
    rows.append({'步骤': step, '用户数': n})
funnel = pd.DataFrame(rows)

print("\\n漏斗数据:")
print(funnel)

print("\\n转化率:")
top = funnel['用户数'].iloc[0]
for i, row in funnel.iterrows():
    rate = row['用户数'] / top * 100
    print(f"{row['步骤']}: {row['用户数']}人 ({rate:.0f}%)")`,
    expectedOutput: '转化率',
    hint: '用 nunique 统计每个阶段独立用户数，逐步计算转化率。',
  },
  '8': {
    id: '8',
    projectId: '5',
    title: '时间序列分析',
    description: '分析销售趋势与周内规律。',
    difficulty: 'advanced',
    starterCode: `import pandas as pd

data = {
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', 
             '2024-01-06', '2024-01-07', '2024-01-08'],
    'sales': [120, 135, 145, 125, 115, 160, 175, 140]
}
df = pd.DataFrame(data)
df['date'] = pd.to_datetime(df['date'])
df['weekday'] = df['date'].dt.day_name()

print("销售数据:")
print(df)

print("\\n日均销量:", df['sales'].mean().round(1))
print("周最高销量:", df['sales'].max())
print("周最低销量:", df['sales'].min())

print("\\n周内销量:")
print(df.groupby('weekday')['sales'].mean().sort_values(ascending=False).round(1))`,
    expectedOutput: '周内销量',
    hint: 'resample / rolling / dt.weekday 是时间序列三大利器。',
  },
  '9': {
    id: '9',
    projectId: '9',
    title: 'A/B测试分析',
    description: '分析 A/B 实验数据。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

data = {
    'group': ['对照组'] * 500 + ['实验组'] * 500,
    'purchased': [1]*40 + [0]*460 + [1]*55 + [0]*445
}
df = pd.DataFrame(data)

summary = df.groupby('group')['purchased'].agg(
    用户数='count', 购买人数='sum', 购买率='mean'
).round(3)
print("实验表现:")
print(summary)

ctrl_rate = summary.loc['对照组', '购买率']
treat_rate = summary.loc['实验组', '购买率']
lift = (treat_rate - ctrl_rate) / ctrl_rate * 100
print(f"\\n提升效果: +{lift:.1f}%")
print(f"结论: {'显著' if abs(lift) > 20 else '不显著'}")`,
    expectedOutput: '提升效果',
    hint: '计算两组转化率差异，差异大且样本足够就显著。',
  },
  '10': {
    id: '10',
    projectId: '10',
    title: '综合数据处理',
    description: '综合运用所学技能，完成一个完整的小型分析项目。',
    difficulty: 'advanced',
    starterCode: `import pandas as pd

orders = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'user_id':  [101, 102, 101, 103, 104, 102, 105, 101],
    'product':  ['牛奶', '面包', '鸡蛋', '牛奶', '饼干', '面包', '牛奶', '黄油'],
    'amount':   [25, 15, 12, 25, 18, 15, 25, 20],
})

print("订单数据:")
print(orders)

print("\\n商品销售排行榜:")
product_sales = orders.groupby('product')['amount'].agg(['sum', 'count']).sort_values('sum', ascending=False)
product_sales.columns = ['总金额', '销量']
print(product_sales)

print("\\n用户消费统计:")
user_stats = orders.groupby('user_id').agg(
    订单数=('order_id', 'count'),
    总消费=('amount', 'sum'),
)
print(user_stats)

print("\\n项目完成！")`,
    expectedOutput: '项目完成',
    hint: 'merge / groupby / agg / to_datetime，这些 pandas 基本技能组合起来就能做完整项目。',
  },
};

class MockDataFrame {
  private data: Record<string, any[]>;
  private columns: string[];

  constructor(data: Record<string, any[]> | any[]) {
    if (Array.isArray(data)) {
      this.data = data.reduce((acc, row, idx) => {
        Object.keys(row).forEach(key => {
          if (!acc[key]) acc[key] = [];
          acc[key][idx] = row[key];
        });
        return acc;
      }, {} as Record<string, any[]>);
    } else {
      this.data = data;
    }
    this.columns = Object.keys(this.data);
  }

  get shape(): [number, number] {
    const rows = this.columns.length > 0 ? this.data[this.columns[0]].length : 0;
    return [rows, this.columns.length];
  }

  head(n: number = 5): MockDataFrame {
    const newData: Record<string, any[]> = {};
    this.columns.forEach(col => {
      newData[col] = this.data[col].slice(0, n);
    });
    return new MockDataFrame(newData);
  }

  describe(): MockDataFrame {
    const stats: Record<string, number[]> = {};
    this.columns.forEach(col => {
      const vals = this.data[col].filter(v => typeof v === 'number');
      if (vals.length > 0) {
        stats['count'] = [...(stats['count'] || []), vals.length];
        stats['mean'] = [...(stats['mean'] || []), vals.reduce((a, b) => a + b, 0) / vals.length];
        stats['std'] = [...(stats['std'] || []), Math.sqrt(vals.reduce((a, b) => a + Math.pow(b - stats['mean']![stats['mean']!.length - 1], 2), 0) / vals.length)];
        stats['min'] = [...(stats['min'] || []), Math.min(...vals)];
        stats['25%'] = [...(stats['25%'] || []), [...vals].sort((a, b) => a - b)[Math.floor(vals.length * 0.25)]];
        stats['50%'] = [...(stats['50%'] || []), [...vals].sort((a, b) => a - b)[Math.floor(vals.length * 0.5)]];
        stats['75%'] = [...(stats['75%'] || []), [...vals].sort((a, b) => a - b)[Math.floor(vals.length * 0.75)]];
        stats['max'] = [...(stats['max'] || []), Math.max(...vals)];
      }
    });
    return new MockDataFrame(stats);
  }

  sum(): number {
    const nums = this.columns.flatMap(col => 
      this.data[col].filter(v => typeof v === 'number')
    );
    return nums.reduce((a, b) => a + b, 0);
  }

  value_counts(): MockDataFrame {
    const counts: Record<string, number> = {};
    this.columns.forEach(col => {
      this.data[col].forEach(v => {
        counts[String(v)] = (counts[String(v)] || 0) + 1;
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const result: Record<string, number[]> = { 'count': [] };
    sorted.forEach(([val, cnt]) => {
      (result as any)[val] = [cnt];
      result['count'].push(cnt);
    });
    return new MockDataFrame(result);
  }

  unique(): any[] {
    const vals = this.columns.flatMap(col => this.data[col]);
    return [...new Set(vals)];
  }

  groupby(col: string): MockGroupBy {
    const groups: Record<string, any[]> = {};
    const idx = this.columns.indexOf(col);
    if (idx === -1) return new MockGroupBy({});
    
    const groupVals = this.data[col];
    this.columns.forEach(c => {
      this.data[c].forEach((val: any, i: number) => {
        const key = String(groupVals[i]);
        if (!groups[key]) groups[key] = [];
        if (!groups[key][i]) groups[key][i] = {};
        groups[key][i][c] = val;
      });
    });
    
    const cleanGroups: Record<string, any[]> = {};
    Object.keys(groups).forEach(key => {
      cleanGroups[key] = Object.values(groups[key]).filter(Boolean);
    });
    
    return new MockGroupBy(cleanGroups);
  }

  drop_duplicates(subset: string, keep: string = 'first'): MockDataFrame {
    const seen = new Set();
    const newData: Record<string, any[]> = {};
    this.columns.forEach(c => newData[c] = []);
    
    const colData = this.data[subset];
    colData.forEach((val: any, i: number) => {
      const key = String(val);
      if (!seen.has(key) || keep === 'last') {
        seen.add(key);
        this.columns.forEach(c => newData[c].push(this.data[c][i]));
      }
    });
    
    return new MockDataFrame(newData);
  }

  duplicated(subset: string): any[] {
    const seen = new Set();
    return this.data[subset].map((val: any) => {
      const key = String(val);
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
  }

  isnull(): any[] {
    return this.columns.map(col => 
      this.data[col].map(v => v === null || v === undefined)
    );
  }

  dropna(subset?: string[]): MockDataFrame {
    const cols = subset || this.columns;
    const validIndices = new Set<number>();
    
    this.data[cols[0]].forEach((_, i) => validIndices.add(i));
    
    cols.forEach(col => {
      this.data[col].forEach((val: any, i: number) => {
        if (val === null || val === undefined) {
          validIndices.delete(i);
        }
      });
    });
    
    const newData: Record<string, any[]> = {};
    this.columns.forEach(col => {
      newData[col] = [...validIndices].map(i => this.data[col][i]);
    });
    
    return new MockDataFrame(newData);
  }

  apply(func: (row: Record<string, any>) => any, axis: number = 0): MockDataFrame {
    const results: any[] = [];
    const rowCount = this.data[this.columns[0]]?.length || 0;
    
    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, any> = {};
      this.columns.forEach(col => {
        row[col] = this.data[col][i];
      });
      results.push(func(row));
    }
    
    return new MockDataFrame({ 'result': results });
  }

  reset_index(drop: boolean = false): MockDataFrame {
    if (drop) return this;
    const newData = { 'index': [...Array(this.shape[0]).keys()] };
    this.columns.forEach(col => {
      newData[col] = this.data[col];
    });
    return new MockDataFrame(newData);
  }

  iloc(index: number): Record<string, any> {
    const row: Record<string, any> = {};
    this.columns.forEach(col => {
      row[col] = this.data[col][index];
    });
    return row;
  }

  iterrows(): Array<[number, Record<string, any>]> {
    const result: Array<[number, Record<string, any>]> = [];
    const rowCount = this.data[this.columns[0]]?.length || 0;
    
    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, any> = {};
      this.columns.forEach(col => {
        row[col] = this.data[col][i];
      });
      result.push([i, row]);
    }
    
    return result;
  }

  nunique(): number {
    const vals = this.columns.flatMap(col => this.data[col]);
    return new Set(vals).size;
  }

  mean(): number {
    const nums = this.columns.flatMap(col => 
      this.data[col].filter(v => typeof v === 'number')
    );
    return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  }

  max(): number {
    const nums = this.columns.flatMap(col => 
      this.data[col].filter(v => typeof v === 'number')
    );
    return nums.length > 0 ? Math.max(...nums) : 0;
  }

  min(): number {
    const nums = this.columns.flatMap(col => 
      this.data[col].filter(v => typeof v === 'number')
    );
    return nums.length > 0 ? Math.min(...nums) : 0;
  }

  round(n: number = 0): MockDataFrame {
    const newData: Record<string, any[]> = {};
    this.columns.forEach(col => {
      newData[col] = this.data[col].map(v => 
        typeof v === 'number' ? Number(v.toFixed(n)) : v
      );
    });
    return new MockDataFrame(newData);
  }

  sort_values(col: string, ascending: boolean = true): MockDataFrame {
    const colData = this.data[col];
    const indices = [...Array(colData.length).keys()];
    indices.sort((a, b) => {
      const va = colData[a], vb = colData[b];
      return ascending ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    
    const newData: Record<string, any[]> = {};
    this.columns.forEach(c => {
      newData[c] = indices.map(i => this.data[c][i]);
    });
    
    return new MockDataFrame(newData);
  }

  get(index: string): MockDataFrame {
    if (this.columns.includes(index)) {
      return new MockDataFrame({ [index]: this.data[index] });
    }
    return new MockDataFrame({});
  }

  set(index: string, values: any[]): void {
    this.data[index] = values;
    if (!this.columns.includes(index)) {
      this.columns.push(index);
    }
  }

  toString(): string {
    const maxLen = this.columns.map(c => Math.max(c.length, ...this.data[c].map(v => String(v).length)));
    let result = '  ' + this.columns.map((c, i) => c.padEnd(maxLen[i])).join(' ') + '\n';
    
    const rowCount = this.data[this.columns[0]]?.length || 0;
    for (let i = 0; i < rowCount; i++) {
      result += `${i} ` + this.columns.map((c, j) => String(this.data[c][i]).padEnd(maxLen[j])).join(' ') + '\n';
    }
    
    return result.trim();
  }
}

class MockGroupBy {
  private groups: Record<string, any[]>;

  constructor(groups: Record<string, any[]>) {
    this.groups = groups;
  }

  agg(spec: Record<string, string | ((x: any[]) => any)>): MockDataFrame {
    const result: Record<string, any[]> = {};
    Object.keys(spec).forEach(name => {
      result[name] = [];
    });
    result['group'] = [];

    Object.entries(this.groups).forEach(([key, rows]) => {
      result['group'].push(key);
      Object.entries(spec).forEach(([name, aggFunc]) => {
        if (typeof aggFunc === 'string') {
          const col = Object.keys(rows[0] || {})[0];
          const vals = rows.map(r => r[col]).filter(v => typeof v === 'number');
          switch (aggFunc) {
            case 'sum': result[name].push(vals.reduce((a, b) => a + b, 0)); break;
            case 'count': result[name].push(vals.length); break;
            case 'mean': result[name].push(vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0); break;
            case 'min': result[name].push(vals.length > 0 ? Math.min(...vals) : 0); break;
            case 'max': result[name].push(vals.length > 0 ? Math.max(...vals) : 0); break;
          }
        } else {
          result[name].push(aggFunc(rows));
        }
      });
    });

    return new MockDataFrame(result);
  }

  apply(func: (x: any[]) => any): MockDataFrame {
    const result: Record<string, any[]> = {};
    result['group'] = [];
    result['result'] = [];

    Object.entries(this.groups).forEach(([key, rows]) => {
      result['group'].push(key);
      result['result'].push(func(rows));
    });

    return new MockDataFrame(result);
  }
}

function runPythonCode(code: string): string {
  const lines = code.split('\n');
  const variables: Record<string, any> = {};
  let output = '';

  const pd = {
    DataFrame: (data: any) => new MockDataFrame(data),
    to_datetime: (arr: string[]) => arr.map(s => ({ date: new Date(s), toString: () => new Date(s).toLocaleDateString() })),
  };

  const Counter = class {
    private counts: Record<string, number> = {};
    
    update(arr: any[]) {
      arr.forEach((v: any) => {
        this.counts[String(v)] = (this.counts[String(v)] || 0) + 1;
      });
    }
    
    get items() {
      return Object.entries(this.counts);
    }
    
    get [Symbol.iterator]() {
      return this.items[Symbol.iterator].bind(this.items);
    }
  };

  const combinations = (arr: any[], n: number): any[][] => {
    const result: any[][] = [];
    const combine = (start: number, path: any[]) => {
      if (path.length === n) {
        result.push([...path]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        path.push(arr[i]);
        combine(i + 1, path);
        path.pop();
      }
    };
    combine(0, []);
    return result;
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (line.startsWith('#') || !line) continue;
    
    if (line.startsWith('import ')) continue;
    if (line.startsWith('from ')) continue;
    
    if (line.startsWith('print(')) {
      const content = line.slice(6, -1).trim();
      let result = '';
      
      if (content.startsWith('"') || content.startsWith("'")) {
        result = content.slice(1, -1);
      } else if (content.includes('f"') || content.includes("f'")) {
        const str = content.slice(2, -1);
        const matches = str.match(/\{([^}]+)\}/g);
        let finalStr = str;
        if (matches) {
          matches.forEach(match => {
            const expr = match.slice(1, -1).trim();
            let val = evaluate(expr);
            finalStr = finalStr.replace(match, String(val));
          });
        }
        result = finalStr;
      } else {
        result = String(evaluate(content));
      }
      
      output += result + '\n';
    } else if (line.includes('=')) {
      const parts = line.split('=').map(p => p.trim());
      const varName = parts[0].trim();
      const expr = parts.slice(1).join('=').trim();
      
      if (expr.startsWith('pd.DataFrame(')) {
        const dataStr = expr.slice(14, -1);
        try {
          const data = new Function('return ' + dataStr)();
          variables[varName] = pd.DataFrame(data);
        } catch {
          variables[varName] = new MockDataFrame({});
        }
      } else if (expr.includes('.groupby(')) {
        const match = expr.match(/(\w+)\.groupby\('([^']+)'\)/);
        if (match) {
          const dfName = match[1];
          const col = match[2];
          const rest = expr.slice(match[0].length);
          
          if (rest.includes('.agg(')) {
            const aggMatch = rest.match(/\.agg\(([^)]+)\)/);
            if (aggMatch) {
              try {
                const aggSpec = new Function('return ' + aggMatch[1])();
                const grouped = variables[dfName].groupby(col);
                variables[varName] = grouped.agg(aggSpec);
              } catch {
                variables[varName] = new MockDataFrame({});
              }
            }
          } else if (rest.includes('.apply(')) {
            const applyMatch = rest.match(/\.apply\(([^)]+)\)/);
            if (applyMatch) {
              try {
                const func = new Function('x', `return ${applyMatch[1]}`);
                const grouped = variables[dfName].groupby(col);
                variables[varName] = grouped.apply(func);
              } catch {
                variables[varName] = new MockDataFrame({});
              }
            }
          }
        }
      } else if (expr.includes('.drop_duplicates(')) {
        const match = expr.match(/(\w+)\.drop_duplicates\(([^)]+)\)/);
        if (match) {
          const dfName = match[1];
          const args = match[2].split(',').map(a => a.trim());
          const subset = args.find(a => a.startsWith('subset=') || !a.includes('='));
          const subsetVal = subset?.startsWith('subset=') ? subset.slice(8).replace(/['"]/g, '') : subset;
          const keep = args.find(a => a.startsWith('keep='));
          const keepVal = keep?.slice(5).replace(/['"]/g, '') || 'first';
          variables[varName] = variables[dfName].drop_duplicates(subsetVal, keepVal);
        }
      } else if (expr.includes('.dropna(')) {
        const match = expr.match(/(\w+)\.dropna\(([^)]+)\)/);
        if (match) {
          const dfName = match[1];
          variables[varName] = variables[dfName].dropna();
        }
      } else if (expr.includes('.reset_index(')) {
        const match = expr.match(/(\w+)\.reset_index\(([^)]+)\)/);
        if (match) {
          const dfName = match[1];
          const drop = match[2].includes('drop=True');
          variables[varName] = variables[dfName].reset_index(drop);
        }
      } else if (expr.includes('.sort_values(')) {
        const match = expr.match(/(\w+)\.sort_values\('([^']+)'\)/);
        if (match) {
          const dfName = match[1];
          const col = match[2];
          const ascending = !expr.includes('ascending=False');
          variables[varName] = variables[dfName].sort_values(col, ascending);
        }
      } else if (expr.includes('.apply(')) {
        const match = expr.match(/(\w+)\.apply\(([^)]+),\s*axis=\d/);
        if (match) {
          const dfName = match[1];
          try {
            const func = new Function('row', `return ${match[2]}`);
            variables[varName] = variables[dfName].apply(func, 1);
          } catch {
            variables[varName] = new MockDataFrame({});
          }
        }
      } else if (expr.includes('Counter(')) {
        const dataStr = expr.slice(8, -1);
        try {
          const data = new Function('return ' + dataStr)();
          const counter = new (Counter as any)();
          counter.update(data);
          variables[varName] = counter;
        } catch {
          variables[varName] = {};
        }
      } else {
        try {
          variables[varName] = evaluate(expr);
        } catch {
          variables[varName] = expr;
        }
      }
    } else if (line.startsWith('for ')) {
      const match = line.match(/for (\w+) in ([^:]+):/);
      if (match) {
        const varName = match[1];
        const iterExpr = match[2].trim();
        let iterable: any[];
        
        if (iterExpr.includes('Counter') || iterExpr.includes('.items')) {
          const objName = iterExpr.split('.')[0];
          iterable = variables[objName]?.items || [];
        } else if (iterExpr.includes('.iterrows()')) {
          const objName = iterExpr.split('.')[0];
          iterable = variables[objName]?.iterrows?.() || [];
        } else {
          iterable = evaluate(iterExpr) || [];
        }
        
        let body = '';
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith('    ')) {
          body += lines[j].slice(4) + '\n';
          j++;
        }
        
        for (const item of iterable) {
          variables[varName] = item;
          const result = runPythonCode(body);
          output += result;
        }
        
        i = j - 1;
      }
    } else if (line.startsWith('def ')) {
      const match = line.match(/def (\w+)\(([^)]+)\):/);
      if (match) {
        const funcName = match[1];
        const params = match[2].split(',').map(p => p.trim());
        
        let body = '';
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith('    ')) {
          body += lines[j].slice(4) + '\n';
          j++;
        }
        
        variables[funcName] = (...args: any[]) => {
          const oldVars = { ...variables };
          params.forEach((p, idx) => {
            variables[p] = args[idx];
          });
          runPythonCode(body);
          const result = variables['_result_'];
          Object.assign(variables, oldVars);
          return result;
        };
        
        i = j - 1;
      }
    }

    function evaluate(expr: string): any {
      if (expr in variables) {
        return variables[expr];
      }
      if (expr.includes('[')) {
        const match = expr.match(/(\w+)\['([^']+)'\]/);
        if (match) {
          const obj = variables[match[1]];
          return obj?.get?.(match[2]) || obj?.[match[2]];
        }
      }
      if (expr.includes('.shape')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.shape || [0, 0];
      }
      if (expr.includes('.head')) {
        const match = expr.match(/(\w+)\.head\((\d+)\)/);
        const obj = variables[match?.[1] || expr.split('.')[0]];
        const n = match ? parseInt(match[2]) : 5;
        return obj?.head?.(n);
      }
      if (expr.includes('.describe')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.describe?.();
      }
      if (expr.includes('.sum')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.sum?.();
      }
      if (expr.includes('.value_counts')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.value_counts?.();
      }
      if (expr.includes('.unique')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.unique?.();
      }
      if (expr.includes('.duplicated')) {
        const match = expr.match(/(\w+)\.duplicated\('([^']+)'\)/);
        const obj = variables[match?.[1] || expr.split('.')[0]];
        const col = match?.[2];
        return obj?.duplicated?.(col) || [];
      }
      if (expr.includes('.isnull')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.isnull?.();
      }
      if (expr.includes('.nunique')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.nunique?.();
      }
      if (expr.includes('.mean')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.mean?.();
      }
      if (expr.includes('.max')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.max?.();
      }
      if (expr.includes('.min')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.min?.();
      }
      if (expr.includes('.round')) {
        const match = expr.match(/(\w+)\.round\((\d+)\)/);
        const obj = variables[match?.[1] || expr.split('.')[0]];
        const n = match ? parseInt(match[2]) : 0;
        return obj?.round?.(n);
      }
      if (expr.includes('.length') || expr.includes('len(')) {
        const match = expr.match(/len\(([^)]+)\)/);
        const obj = variables[match?.[1] || expr.split('.')[0]];
        return obj?.length || obj?.shape?.[0] || 0;
      }
      if (expr.includes('[')) {
        const arrMatch = expr.match(/(\w+)\[(\d+)\]/);
        if (arrMatch) {
          return variables[arrMatch[1]]?.[parseInt(arrMatch[2])];
        }
      }
      if (expr.includes('.index')) {
        const obj = variables[expr.split('.')[0]];
        return obj?.index;
      }
      if (expr.includes('.loc')) {
        const match = expr.match(/(\w+)\.loc\['([^']+)'\]/);
        if (match) {
          const obj = variables[match[1]];
          const idx = match[2];
          return obj?.iloc?.(parseInt(idx)) || obj?.[idx];
        }
      }
      if (expr.includes('sorted(')) {
        const inner = expr.slice(7, -1);
        const arr = evaluate(inner);
        return Array.isArray(arr) ? [...arr].sort() : arr;
      }
      if (expr.includes('Math.')) {
        return new Function('return ' + expr.replace('Math.', ''))();
      }
      if (!isNaN(parseFloat(expr))) {
        return parseFloat(expr);
      }
      return expr;
    }
  }

  return output.trim();
}

const Practice: React.FC = () => {
  const { courseId, exerciseId } = useParams<{ courseId: string; exerciseId: string }>();
  const currentExercise = practiceData[exerciseId || '1'] || practiceData['1'];

  const [code, setCode] = useState(currentExercise.starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setCode(currentExercise.starterCode);
    setOutput('');
    setIsCorrect(null);
  }, [exerciseId, currentExercise.starterCode]);

  const allExercises = Object.values(practiceData);
  const projectExercises = allExercises.filter(e => e.projectId === courseId);
  const exerciseIndex = projectExercises.findIndex(e => e.id === currentExercise.id);
  const prevExercise = exerciseIndex > 0 ? projectExercises[exerciseIndex - 1] : null;
  const nextExercise = exerciseIndex < projectExercises.length - 1 ? projectExercises[exerciseIndex + 1] : null;

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('▶ 代码运行中...\n');
    setIsCorrect(null);

    try {
      const result = runPythonCode(code);
      
      if (!result.trim()) {
        setOutput('(你的代码没有任何 print 输出，请添加 print 语句)');
      } else {
        setOutput(result);
      }

      const expected = (currentExercise.expectedOutput || '').trim();
      if (expected) {
        setIsCorrect(result.includes(expected));
      } else {
        setIsCorrect(result.length > 0);
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      setOutput(`❌ 运行出错:\n${msg}`);
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
  const handleShowSolution = () => setCode(currentExercise.solution || currentExercise.starterCode);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap gap-y-1">
        <Link to="/" className="hover:text-blue-600">首页</Link>
        <span>/</span>
        <Link to="/courses" className="hover:text-blue-600">项目中心</Link>
        <span>/</span>
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600">项目 {courseId}</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">代码练习</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                currentExercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentExercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentExercise.difficulty === 'easy' ? '简单' :
                 currentExercise.difficulty === 'medium' ? '中等' : '困难'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{currentExercise.title}</h1>
            </div>
            <p className="text-gray-600">{currentExercise.description}</p>

            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              {prevExercise ? (
                <Link to={`/practice/${courseId}/${prevExercise.id}`}
                      className="flex items-center text-blue-600 hover:underline text-sm">
                  <ArrowLeft size={16} className="mr-1" /> 上一题
                </Link>
              ) : <span />}
              {nextExercise ? (
                <Link to={`/practice/${courseId}/${nextExercise.id}`}
                      className="flex items-center text-blue-600 hover:underline text-sm">
                  下一题 <ArrowRight size={16} className="ml-1" />
                </Link>
              ) : <span />}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="bg-gray-900 text-gray-200 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-sm font-mono">practice.py</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleResetCode} className="text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">重置</button>
                <button onClick={handleShowSolution} className="text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">查看答案</button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[400px] p-4 font-mono text-sm bg-gray-50 border-t border-gray-200 focus:outline-none text-gray-900 leading-6"
              spellCheck={false}
            />
            <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center px-5 py-2.5 rounded-lg transition font-semibold shadow ${
                  isRunning
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                {isRunning ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                {isRunning ? '运行中...' : '▶ 运行代码'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 text-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm">输出结果</span>
              {isCorrect !== null && (
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {isCorrect ? '✓ 通过' : '✗ 未通过'}
                </span>
              )}
            </div>
            <div className="p-4 min-h-[220px] bg-gray-900 text-gray-100 border-t border-gray-800 font-mono text-sm whitespace-pre-wrap break-all leading-6">
              {output || <span className="text-gray-500">点击右上角"运行代码"查看结果</span>}
              {isCorrect === true && (
                <div className="mt-3 text-green-400 flex items-center"><CheckCircle size={16} className="mr-2" /> 太棒了，答案正确！</div>
              )}
              {isCorrect === false && (
                <div className="mt-3 text-red-400 flex items-center"><XCircle size={16} className="mr-2" /> 结果不符合预期，点击右侧"查看答案"或参考提示修改。</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-900 flex items-center"><Code size={16} className="mr-2 text-blue-600" />练习信息</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">提示</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{currentExercise.hint}</p>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">本项目练习</h4>
                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                  {projectExercises.map((ex) => (
                    <Link key={ex.id} to={`/practice/${courseId}/${ex.id}`}
                          className={`flex items-center p-2 rounded-md text-sm transition ${
                            ex.id === currentExercise.id
                              ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}>
                      <Code size={14} className="mr-2 shrink-0" />
                      <span className="truncate">{ex.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <Link to={`/courses/${courseId}`} className="flex items-center text-blue-600 hover:underline text-sm">
                  <ChevronLeft size={16} className="mr-1" />返回项目详情
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
