import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, CheckCircle, XCircle, ChevronLeft, Code, BookOpen, ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

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
print("\n前5行数据:")
print(df.head())
print("\n统计信息:")
print(df.describe())
print("\n商品销量统计:")
print(df['product'].value_counts())
print("\n总销售额:")
print(f"总销售额: {df['amount'].sum()}元")`,
    expectedOutput: '总销售额: 77元',
    hint: '使用 pd.DataFrame 创建数据框，用 head() 查看数据，用 describe() 获取统计信息。',
    packages: ['pandas'],
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
print("\n购物篮数据:")
print(baskets)
print("\n购物篮数量:", len(baskets))

# 看看有哪些商品
print("\n所有商品:")
print(sorted(df['product'].unique()))`,
    expectedOutput: '购物篮数量: 4',
    hint: '使用 groupby + apply(list) 将同一个订单的商品合并。',
    packages: ['pandas'],
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

print("\n商品组合的支持度:")
pair_count = Counter()
for basket in baskets:
    for pair in combinations(sorted(basket), 2):
        pair_count[pair] += 1

for pair, count in pair_count.items():
    print(f"  {pair}: {count}次, 支持度 {count/total:.1%}")

print("\n简单推荐规则:")
for (a, b), count in pair_count.items():
    confidence = count / product_count[a]
    print(f"  买了 '{a}' 的人，也买了 '{b}': 置信度 {confidence:.1%}")`,
    expectedOutput: '也买了',
    hint: '使用 itertools.combinations 生成商品组合，用 Counter 统计。',
    packages: [],
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

print("\nRFM 特征表:")
print(rfm)
print("\n统计摘要:")
print(rfm.describe().round(1))`,
    expectedOutput: 'RFM 特征表',
    hint: 'Recency = 当前日期 - 最近消费日期；Frequency = 订单数；Monetary = 总金额。',
    packages: ['pandas'],
  },
  '5': {
    id: '5',
    projectId: '2',
    title: 'KMeans用户分群',
    description: '用 KMeans 聚类算法对用户进行价值分群。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

# 模拟 KMeans 简单实现
rfm_data = {
    'user_id': [1, 2, 3, 4, 5, 6],
    'recency':   [10,  5,  0, 24,  3, 30],
    'frequency': [2,  3,  4,  1,  5,  1],
    'monetary': [250, 400, 395, 60, 600, 50]
}
rfm = pd.DataFrame(rfm_data)
print("原始 RFM 数据:")
print(rfm)

# 标准化（手动实现）
rfm_norm = (rfm[['recency', 'frequency', 'monetary']] - rfm[['recency', 'frequency', 'monetary']].mean()) / rfm[['recency', 'frequency', 'monetary']].std()
print("\n标准化后:")
print(rfm_norm.round(2))

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
print("\n分群结果:")
print(rfm)

print("\n每群人数:")
print(rfm['cluster'].value_counts())`,
    expectedOutput: '分群结果',
    hint: '用简单规则做分群，高价值 = 高频次+高金额，活跃 = 近期有消费。',
    packages: ['pandas'],
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
print(f"\n重复订单数: {dup}")
df_clean = df.drop_duplicates('order_id', keep='first')
print(f"去重后形状: {df_clean.shape}")

# 2) 缺失值
missing = df_clean['amount'].isnull().sum()
print(f"\n缺失金额数: {missing}")
df_clean = df_clean.dropna(subset=['amount'])

# 3) 异常值（负数 / 超大值）
print(f"\n异常(<=0)金额数: {(df_clean['amount'] <= 0).sum()}")
df_clean = df_clean[df_clean['amount'] > 0]

print("\n清洗后数据:")
print(df_clean.reset_index(drop=True))`,
    expectedOutput: '清洗后数据',
    hint: 'duplicated → drop_duplicates，isnull → dropna，条件过滤处理异常值。',
    packages: ['pandas'],
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

print("\n漏斗数据:")
print(funnel)

print("\n转化率:")
top = funnel['用户数'].iloc[0]
for i, row in funnel.iterrows():
    rate = row['用户数'] / top
    prev_rate = row['用户数'] / (funnel['用户数'].iloc[i-1] if i > 0 else top)
    if i == 0:
        print(f"{row['步骤']}: {row['用户数']}人 (100%)")
    else:
        print(f"{row['步骤']}: {row['用户数']}人 (总体{rate:.1%}, 相对上一步{prev_rate:.1%})")`,
    expectedOutput: '转化率',
    hint: '用 nunique 统计每个阶段独立用户数，逐步计算转化率。',
    packages: ['pandas'],
  },
  '8': {
    id: '8',
    projectId: '5',
    title: '时间序列分析',
    description: '分析销售趋势与周内规律。',
    difficulty: 'advanced',
    starterCode: `import pandas as pd

# 简单销售数据
data = {
    'date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', 
             '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10',
             '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14'],
    'sales': [120, 135, 145, 125, 115, 160, 175, 140, 130, 150, 145, 135, 180, 190]
}
df = pd.DataFrame(data)
df['date'] = pd.to_datetime(df['date'])
df['weekday'] = df['date'].dt.day_name()

print("销售数据:")
print(df)

print("\n日均销量:", df['sales'].mean().round(1))
print("周最高销量:", df['sales'].max())
print("周最低销量:", df['sales'].min())

print("\n7日移动平均:")
df['ma7'] = df['sales'].rolling(window=7).mean()
print(df[['date', 'sales', 'ma7']].round(1))

print("\n周内销量:")
print(df.groupby('weekday')['sales'].mean().sort_values(ascending=False).round(1))`,
    expectedOutput: '周内销量',
    hint: 'resample / rolling / dt.weekday 是时间序列三大利器。',
    packages: ['pandas'],
  },
  '9': {
    id: '9',
    projectId: '9',
    title: 'A/B测试分析',
    description: '分析 A/B 实验数据。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

# 实验数据
data = {
    'group': ['对照组'] * 500 + ['实验组'] * 500,
    'purchased': [1]*40 + [0]*460 + [1]*55 + [0]*445
}
df = pd.DataFrame(data)

# 汇总
summary = df.groupby('group')['purchased'].agg(
    用户数='count', 购买人数='sum', 购买率='mean'
).round(3)
print("实验表现:")
print(summary)

ctrl_rate = summary.loc['对照组', '购买率']
treat_rate = summary.loc['实验组', '购买率']
lift = (treat_rate - ctrl_rate) / ctrl_rate * 100
print(f"\n提升效果: +{lift:.1f}%")

# 简单显著性判断
print(f"\n结论: {'显著' if abs(lift) > 20 else '不显著'}")`,
    expectedOutput: '提升效果',
    hint: '计算两组转化率差异，差异大且样本足够就显著。',
    packages: ['pandas'],
  },
  '10': {
    id: '10',
    projectId: '10',
    title: '综合数据处理',
    description: '综合运用所学技能，完成一个完整的小型分析项目。',
    difficulty: 'advanced',
    starterCode: `import pandas as pd

# 订单数据
orders = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'user_id':  [101, 102, 101, 103, 104, 102, 105, 101],
    'product':  ['牛奶', '面包', '鸡蛋', '牛奶', '饼干', '面包', '牛奶', '黄油'],
    'amount':   [25, 15, 12, 25, 18, 15, 25, 20],
    'date': pd.to_datetime(['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-05',
                            '2024-01-06', '2024-01-08', '2024-01-10', '2024-01-15'])
})

print("订单数据:")
print(orders)

# 商品销量
print("\n商品销售排行榜:")
product_sales = orders.groupby('product')['amount'].agg(['sum', 'count']).sort_values('sum', ascending=False)
product_sales.columns = ['总金额', '销量']
print(product_sales)

# 用户消费统计
print("\n用户消费统计:")
user_stats = orders.groupby('user_id').agg(
    订单数=('order_id', 'count'),
    总消费=('amount', 'sum'),
    首单日期=('date', 'min'),
    最近消费=('date', 'max')
)
print(user_stats)

print("\n项目完成！")`,
    expectedOutput: '项目完成',
    hint: 'merge / groupby / agg / to_datetime，这些 pandas 基本技能组合起来就能做完整项目。',
    packages: ['pandas'],
  },
};

declare global {
  interface Window {
    loadPyodide: (opts?: { indexURL: string }) => Promise<any>;
    pyodide: any;
  }
}

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/';

const usePyodide = () => {
  const pyodideRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        setLoadError(null);
        
        if (!(window as any).loadPyodide) {
          setLoadStatus('加载 Python 运行环境...');
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement('script');
            s.src = `${PYODIDE_CDN}pyodide.js`;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('加载失败，请检查网络'));
            document.head.appendChild(s);
          });
        }

        setLoadStatus('初始化 Python...');
        const py = await (window as any).loadPyodide({ 
          indexURL: PYODIDE_CDN,
          fullStdLib: false
        });
        pyodideRef.current = py;

        setLoadStatus('加载 pandas...');
        await py.loadPackage(['pandas']);

        if (!cancelled) {
          setLoadStatus('');
          setLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        if (!cancelled) {
          setLoadError(err?.message || String(err));
          setLoadStatus('');
          setLoading(false);
        }
      }
    };

    bootstrap();
    return () => { cancelled = true; };
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setLoadStatus('');
    setLoadError(null);
    pyodideRef.current = null;
    document.querySelectorAll('script[src*="pyodide"]').forEach(s => s.remove());
    
    const bootstrap = async () => {
      try {
        setLoadStatus('重新加载 Python...');
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = `${PYODIDE_CDN}pyodide.js`;
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('加载失败'));
          document.head.appendChild(s);
        });

        const py = await (window as any).loadPyodide({ indexURL: PYODIDE_CDN, fullStdLib: false });
        pyodideRef.current = py;
        await py.loadPackage(['pandas']);
        setLoadStatus('');
        setLoading(false);
        setLoadError(null);
      } catch (err: any) {
        setLoadError(err?.message || String(err));
        setLoadStatus('');
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  return { pyodide: pyodideRef.current, loading, loadStatus, loadError, reload };
};

const Practice: React.FC = () => {
  const { courseId, exerciseId } = useParams<{ courseId: string; exerciseId: string }>();
  const currentExercise = practiceData[exerciseId || '1'] || practiceData['1'];

  const { pyodide, loading, loadStatus, loadError, reload } = usePyodide();

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
    if (loading || !pyodide) {
      setOutput('⏳ Python 环境还在加载中，请稍候...');
      return;
    }
    setIsRunning(true);
    setOutput('▶ 代码运行中...\n');
    setIsCorrect(null);

    try {
      const py = pyodide;

      await py.runPythonAsync(`
import sys
from io import StringIO

sys.stdout = StringIO()
sys.stderr = sys.stdout
`);

      await py.runPythonAsync(code);
      
      const result: string = await py.runPythonAsync('sys.stdout.getvalue()');
      
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

            {(loading || loadError) && (
              <div className={`mt-4 flex items-center text-sm border rounded-lg px-4 py-3 ${
                loadError ? 'bg-red-50 border-red-100 text-red-700' : 'bg-blue-50 border-blue-100 text-blue-700'
              }`}>
                {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : null}
                {loadError ? (
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span>加载失败</span>
                      <button onClick={reload} className="p-1 hover:bg-red-100 rounded">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                    <span className="text-xs opacity-80">{loadError}</span>
                  </div>
                ) : (
                  <span>{loadStatus || '正在准备 Python 环境...'}</span>
                )}
              </div>
            )}

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
                disabled={isRunning || loading}
                className={`flex items-center px-5 py-2.5 rounded-lg transition font-semibold shadow ${
                  isRunning || loading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                {isRunning ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                {isRunning ? '运行中...' : loading ? '环境加载中...' : '▶ 运行代码'}
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
