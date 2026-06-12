import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, CheckCircle, XCircle, ChevronLeft, Code, ArrowLeft, ArrowRight } from 'lucide-react';

const practiceData = {
  '1': {
    id: '1', projectId: '1',
    title: '数据加载与探索',
    description: '学习如何使用pandas加载电商数据，进行初步的数据探索和分析。',
    difficulty: 'easy',
    starterCode: `import pandas as pd

data = {
    'order_id': [1, 2, 3, 4, 5],
    'user_id': [101, 102, 101, 103, 102],
    'product': ['牛奶', '面包', '鸡蛋', '牛奶', '面包'],
    'amount': [25, 15, 12, 25, 15]
}

df = pd.DataFrame(data)
print('数据形状:', df.shape)
print('前5行:')
print(df.head())
print('统计:')
print(df.describe())
print('销量排行:')
print(df['product'].value_counts())
print('总销售额:', df['amount'].sum(), '元')`,
    expectedOutput: '总销售额:',
    hint: '用 pd.DataFrame(data) 创建数据框，head() 看前几行，sum() 求和。',
  },
  '2': {
    id: '2', projectId: '1',
    title: '数据预处理',
    description: '学习如何清洗和预处理电商数据，为关联规则挖掘做准备。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

data = {
    'order_id': [1, 1, 1, 2, 2, 3, 3, 3, 4],
    'product': ['牛奶', '面包', '鸡蛋', '面包', '黄油', '牛奶', '面包', '黄油', '牛奶']
}
df = pd.DataFrame(data)
print('原始数据:')
print(df)

baskets = df.groupby('order_id')['product'].apply(list)
print('购物篮数据:')
print(baskets)
print('购物篮数量:', len(baskets))
print('商品种类:', sorted(df['product'].unique()))`,
    expectedOutput: '购物篮数量:',
    hint: 'groupby + apply(list) 把同一订单的商品合并成一个列表。',
  },
  '3': {
    id: '3', projectId: '1',
    title: '关联规则挖掘',
    description: '实现基础的关联规则挖掘，计算支持度。',
    difficulty: 'medium',
    starterCode: `import pandas as pd
from collections import Counter
from itertools import combinations

baskets = [
    ['牛奶', '面包', '鸡蛋'],
    ['面包', '黄油'],
    ['牛奶', '面包', '黄油'],
    ['牛奶']
]

total = len(baskets)
counts = Counter()
for basket in baskets:
    for p in basket:
        counts[p] += 1

print('商品支持度:')
for p, c in counts.items():
    print('  ' + p + ': ' + c + '次, ' + Math.round(c/total*100) + '%')

pairs = Counter()
for basket in baskets:
    for pair in combinations(sorted(basket), 2):
        pairs[pair] += 1

print('商品组合支持度:')
for pair, c in pairs.items():
    print('  ' + pair[0] + '+' + pair[1] + ': ' + c + '次, ' + Math.round(c/total*100) + '%')`,
    expectedOutput: '商品组合支持度',
    hint: 'itertools.combinations 生成商品对，Counter 统计频次。',
  },
  '4': {
    id: '4', projectId: '2',
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

rfm = df.groupby('user_id').agg(
    R=('order_date', lambda x: 30),
    F=('order_id', 'count'),
    M=('amount', 'sum')
)
print('RFM特征表:')
print(rfm)
print('用户数:', rfm.shape[0])`,
    expectedOutput: 'RFM特征表',
    hint: 'groupby + agg 计算每个用户的 RFM 值，R=距今天数，F=频次，M=金额。',
  },
  '5': {
    id: '5', projectId: '2',
    title: '用户价值分群',
    description: '根据RFM特征对用户进行价值分群。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

rfm = pd.DataFrame({
    'user_id': [1, 2, 3, 4, 5, 6],
    'R': [10, 5, 0, 24, 3, 30],
    'F': [2, 3, 4, 1, 5, 1],
    'M': [250, 400, 395, 60, 600, 50]
})

def assign(r, f, m):
    if f >= 4 and m >= 300:
        return '高价值'
    elif r <= 7:
        return '活跃'
    elif r > 20:
        return '流失预警'
    return '普通'

rfm['cluster'] = rfm.apply(lambda row: assign(row['R'], row['F'], row['M']))
print('分群结果:')
print(rfm)
print('各群人数:')
print(rfm['cluster'].value_counts())`,
    expectedOutput: '分群结果',
    hint: '用 apply + lambda 根据 RFM 规则给每个用户打标签。',
  },
  '6': {
    id: '6', projectId: '3',
    title: '数据清洗基础',
    description: '处理缺失值、重复值和异常值。',
    difficulty: 'easy',
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5, 5, 6],
    'amount': [100, -50, 150, None, 80, 80, 1000]
})
print('原始数据:')
print(df)
print('重复订单:', df.duplicated('order_id').sum())

df2 = df.drop_duplicates('order_id')
df2 = df2.dropna(subset=['amount'])
df2 = df2[df2['amount'] > 0]
print('清洗后:')
print(df2)
print('清洗后行数:', df2.shape[0])`,
    expectedOutput: '清洗后行数:',
    hint: 'drop_duplicates 去重，dropna 删缺失行，条件过滤删异常值。',
  },
  '7': {
    id: '7', projectId: '4',
    title: '漏斗分析基础',
    description: '计算用户在购物流程各阶段的转化率。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 4, 5],
    'step': ['浏览', '加购', '支付', '浏览', '加购', '浏览', '加购', '支付', '浏览', '浏览']
})

steps = ['浏览', '加购', '支付']
top = df[df['step']=='浏览']['user_id'].nunique()
print('漏斗转化:')
for s in steps:
    n = df[df['step']==s]['user_id'].nunique()
    print(s + ': ' + n + '人 (' + Math.round(n/top*100) + '%)')`,
    expectedOutput: '漏斗转化',
    hint: 'nunique 统计每步独立用户数，除以第一步得转化率。',
  },
  '8': {
    id: '8', projectId: '5',
    title: '时间序列分析',
    description: '分析销售趋势与周内规律。',
    difficulty: 'advanced',
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'date': ['2024-01-01','2024-01-02','2024-01-03','2024-01-04','2024-01-05',
             '2024-01-06','2024-01-07','2024-01-08','2024-01-09','2024-01-10'],
    'sales': [120, 135, 145, 125, 115, 160, 175, 140, 130, 150]
})
df['weekday'] = ['周一','周二','周三','周四','周五','周六','周日','周一','周二','周三']
print('日均销量:', df['sales'].mean().round(1))
print('最高销量:', df['sales'].max())
print('周内销量排行:')
print(df.groupby('weekday')['sales'].mean().sort_values(ascending=False).round(1))`,
    expectedOutput: '日均销量',
    hint: 'mean() 均值，max() 最大值，groupby + sort_values 排行。',
  },
  '9': {
    id: '9', projectId: '9',
    title: 'A/B测试分析',
    description: '分析 A/B 实验数据。',
    difficulty: 'medium',
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'group': ['对照组']*500 + ['实验组']*500,
    'purchased': [1]*40 + [0]*460 + [1]*55 + [0]*445
})
ctrl = df[df['group']=='对照组']['purchased'].mean()
treat = df[df['group']=='实验组']['purchased'].mean()
lift = (treat - ctrl) / ctrl * 100
print('对照组转化率:', Math.round(ctrl*100*10)/10, '%')
print('实验组转化率:', Math.round(treat*100*10)/10, '%')
print('提升效果: +', Math.round(lift*10)/10, '%')
print('结论:', abs(lift) > 20 ? '显著' : '不显著')`,
    expectedOutput: '提升效果',
    hint: 'mean() 计算转化率，(实验-对照)/对照 = 提升度。',
  },
  '10': {
    id: '10', projectId: '10',
    title: '综合数据处理',
    description: '综合运用所学技能，完成一个完整的小型分析项目。',
    difficulty: 'advanced',
    starterCode: `import pandas as pd

orders = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5, 6, 7, 8],
    'user_id': [101, 102, 101, 103, 104, 102, 105, 101],
    'product': ['牛奶', '面包', '鸡蛋', '牛奶', '饼干', '面包', '牛奶', '黄油'],
    'amount': [25, 15, 12, 25, 18, 15, 25, 20]
})
print('订单数据:')
print(orders)
print('商品销量:')
sales = orders.groupby('product')['amount'].agg(['sum','count']).sort_values('sum', ascending=False)
sales.columns = ['总金额', '销量']
print(sales)
print('用户消费:')
print(orders.groupby('user_id')['amount'].agg(['count','sum']))
print('项目完成！')`,
    expectedOutput: '项目完成',
    hint: 'groupby + agg + sort_values 综合练习，数据分析三板斧。',
  },
};

function execute(code) {
  const lines = code.split('\n');
  const vars = {};
  let out = '';

  const pd = (() => {
    function DF(data) {
      this._data = {};
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        Object.keys(data).forEach(k => { this._data[k] = [...data[k]]; });
      }
      this.columns = Object.keys(this._data);
      this.shape = [this._data[this.columns[0]]?.length || 0, this.columns.length];
    }
    DF.prototype.head = function(n = 5) {
      const d = {}; this.columns.forEach(c => { d[c] = this._data[c].slice(0, n); });
      return new DF(d);
    };
    DF.prototype.describe = function() {
      const d = {};
      this.columns.forEach(c => {
        const vals = this._data[c].filter(v => typeof v === 'number');
        if (!vals.length) return;
        const s = vals.reduce((a,b)=>a+b,0), m = s/vals.length;
        const v2 = vals.map(v=>(v-m)**2);
        d[c] = [vals.length, +m.toFixed(4), +Math.sqrt(v2.reduce((a,b)=>a+b,0)/vals.length).toFixed(4),
                Math.min(...vals), vals[Math.floor(vals.length*.25)],
                vals[Math.floor(vals.length*.5)], vals[Math.floor(vals.length*.75)], Math.max(...vals)];
      });
      return new DF(d);
    };
    DF.prototype.sum = function() {
      return this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number')).reduce((a,b)=>a+b,0);
    };
    DF.prototype.mean = function() {
      const vals = this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number'));
      return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
    };
    DF.prototype.max = function() {
      const vals = this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number'));
      return Math.max(...(vals.length ? vals : [0]));
    };
    DF.prototype.min = function() {
      const vals = this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number'));
      return Math.min(...(vals.length ? vals : [0]));
    };
    DF.prototype.nunique = function() {
      return new Set(this.columns.flatMap(c => this._data[c])).size;
    };
    DF.prototype.duplicated = function(col) {
      const seen = new Set();
      return this._data[col].map(v => { const r = seen.has(String(v)); seen.add(String(v)); return r; });
    };
    DF.prototype.drop_duplicates = function(col, keep = 'first') {
      const seen = new Set(), nd = {};
      this.columns.forEach(c => { nd[c] = []; });
      const colData = this._data[col];
      this._data[col].forEach((v, i) => {
        const k = String(v);
        if (!seen.has(k) || keep === 'last') {
          if (!seen.has(k) || keep !== 'last') seen.add(k);
          this.columns.forEach(c => nd[c].push(this._data[c][i]));
        }
      });
      return new DF(nd);
    };
    DF.prototype.dropna = function() {
      const nd = {}; this.columns.forEach(c => { nd[c] = []; });
      const valid = new Set(this._data[this.columns[0]].map((_, i) => i));
      this.columns.forEach(c => { this._data[c].forEach((v, i) => { if (v === null || v === undefined) valid.delete(i); }); });
      [...valid].sort((a,b)=>a-b).forEach(i => { this.columns.forEach(c => nd[c].push(this._data[c][i])); });
      return new DF(nd);
    };
    DF.prototype.value_counts = function() {
      const cnt = {};
      this.columns.forEach(c => { this._data[c].forEach(v => { cnt[String(v)] = (cnt[String(v)]||0)+1; }); });
      const entries = Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
      const key = entries[0]?.[0]||'value';
      return new DF({ [key]: entries.map(e=>e[1]) });
    };
    DF.prototype.sort_values = function(col, ascending = true) {
      const idx = [...Array(this.shape[0]).keys()];
      idx.sort((a,b) => {
        const va = this._data[col][a], vb = this._data[col][b];
        return ascending ? (va>vb?1:-1) : (va<vb?1:-1);
      });
      const nd = {}; this.columns.forEach(c => { nd[c] = idx.map(i=>this._data[c][i]); });
      return new DF(nd);
    };
    DF.prototype.reset_index = function(drop = false) {
      const nd = drop ? {} : { 'index': [...Array(this.shape[0]).keys()] };
      this.columns.forEach(c => { (nd as any)[c] = this._data[c]; });
      return new DF(nd);
    };
    DF.prototype.round = function(n = 0) {
      const nd = {}; this.columns.forEach(c => {
        nd[c] = this._data[c].map(v => typeof v==='number' ? +v.toFixed(n) : v);
      });
      return new DF(nd);
    };
    DF.prototype.iterrows = function*() {
      for (let i = 0; i < this.shape[0]; i++) {
        const row = {}; this.columns.forEach(c => { row[c] = this._data[c][i]; });
        yield [i, row];
      }
    };
    DF.prototype.get = function(key) { return this._data[key]; };
    DF.prototype.iloc = function(i) {
      const row = {}; this.columns.forEach(c => { row[c] = this._data[c][i]; });
      return row;
    };
    DF.prototype.groupby = function(col) {
      const groups = {}, rows = [];
      for (let i=0; i<this.shape[0]; i++) {
        const row = {}; this.columns.forEach(c => { row[c] = this._data[c][i]; });
        rows.push(row);
        const key = String(this._data[col][i]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      }
      const makeAgg = (spec) => {
        const result = {}, cols = Object.keys(spec);
        cols.forEach(k => { result[k] = []; });
        result['group'] = [];
        Object.entries(groups).forEach(([key, grpRows]) => {
          result['group'].push(key);
          cols.forEach(colName => {
            const fn = spec[colName];
            const vals = grpRows.map(r => r[colName]).filter(v => typeof v === 'number');
            if (typeof fn === 'string') {
              switch(fn) {
                case 'count': result[colName].push(vals.length); break;
                case 'sum': result[colName].push(vals.reduce((a,b)=>a+b,0)); break;
                case 'mean': result[colName].push(vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0); break;
                case 'min': result[colName].push(Math.min(...vals)); break;
                case 'max': result[colName].push(Math.max(...vals)); break;
              }
            } else if (typeof fn === 'function') {
              result[colName].push(fn(vals));
            }
          });
        });
        return new DF(result);
      };
      const makeApply = (fn) => {
        if (fn === 'list' || (typeof fn === 'function' && fn.name === 'list')) {
          return Object.values(groups).map(g => g.map(r => r[selectedCol] || Object.values(r)));
        }
        return new DF({ 'group': Object.keys(groups), 'result': Object.values(groups).map(fn) });
      };
      let selectedCol = null;
      const groupbyObj = { 
        agg: makeAgg, 
        apply: makeApply,
        get: function(col) { selectedCol = col; return groupbyObj; }
      };
      return groupbyObj;
    };
    DF.prototype.apply = function(fn) {
      const results = [];
      for (let i=0; i<this.shape[0]; i++) {
        const row = {}; this.columns.forEach(c => { row[c] = this._data[c][i]; });
        results.push(fn(row));
      }
      return new DF({ 'result': results });
    };
    DF.prototype.toString = function() {
      const ml = this.columns.map(c => Math.max(c.length, ...this._data[c].map(v=>String(v).length)));
      let r = '  ' + this.columns.map((c,i)=>c.padEnd(ml[i])).join(' ') + '\n';
      for (let i=0; i<this.shape[0]; i++) {
        r += String(i) + ' ' + this.columns.map((c,j)=>String(this._data[c][i]).padEnd(ml[j])).join(' ') + '\n';
      }
      return r.trim();
    };
    return { DataFrame: DF };
  })();

  function evalExpr(expr: string, v: Record<string, any>): string {
    let e = expr;
    const dfVars: string[] = [];
    Object.keys(v).forEach(k => {
      if (k !== 'pd' && v[k] instanceof pd.DataFrame) dfVars.push(k);
    });
    dfVars.sort((a, b) => b.length - a.length);

    dfVars.forEach(dfName => {
      // 逐个替换，每个模式只匹配一次，避免 `df['x'].sum()` 之后又匹配 `df`
      // df['col'].sum() -> v['df'].get('col').sum()
      e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]\\.sum\\(\\)`, 'g'),
        (m) => `v['${dfName}'].get('${m.match(/\[([^\]]+)\]/)?.[1] || ''}').sum()`);
      // 先把所有 df['col'].method 形式的全部处理掉
      const colMeth = /(\w+)\['([^']+)'\]\.(sum|mean|max|min|nunique|describe|value_counts)\(\)/g;
      e = e.replace(colMeth, (_m, _obj, col, method) => {
        const obj = _obj || _obj;
        if (v[obj] instanceof pd.DataFrame) {
          return `v['${obj}'].get('${col}').${method}()`;
        }
        return _m;
      });

      // df['col'].head(n)
      e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]\\.head\\((\\d+)\\)`, 'g'),
        (_m, col, n) => `v['${dfName}'].get('${col}').head(${n})`);
      // df['col'].sort_values(...)
      e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]\\.sort_values\\('([^']+)'(?:,\\s*ascending\\s*=\\s*(\\w+))?\\)`, 'g'),
        (_m, col, col2, asc) => `v['${dfName}'].get('${col}').sort_values('${col}', ${asc !== 'False'})`);
      // df['col'] -> v['df'].get('col')
      e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]`, 'g'),
        (_m, col) => `v['${dfName}'].get('${col}')`);
      // df.shape
      e = e.replace(new RegExp(`${dfName}\\.shape`, 'g'), `v['${dfName}'].shape`);
      // df.iloc[i]
      e = e.replace(new RegExp(`${dfName}\\.iloc\\[(\\d+)\\]`, 'g'),
        (_m, i) => `v['${dfName}'].iloc(${i})`);
      // df.head(n)
      e = e.replace(new RegExp(`${dfName}\\.head\\((\\d+)\\)`, 'g'),
        (_m, n) => `v['${dfName}'].head(${n})`);
      // df.round(n)
      e = e.replace(new RegExp(`${dfName}\\.round\\((\\d+)\\)`, 'g'),
        (_m, n) => `v['${dfName}'].round(${n})`);
      // df.drop_duplicates(col, keep='...')
      e = e.replace(new RegExp(`${dfName}\\.drop_duplicates\\('([^']+)'(?:,\\s*keep\\s*=\\s*'([^']+)')?\\)`, 'g'),
        (_m, col, keep) => `v['${dfName}'].drop_duplicates('${col}', '${keep || 'first'}')`);
      // df.dropna()
      e = e.replace(new RegExp(`${dfName}\\.dropna\\(\\)`, 'g'), `v['${dfName}'].dropna()`);
      // df.reset_index(drop=...)
      e = e.replace(new RegExp(`${dfName}\\.reset_index\\(drop\\s*=\\s*(\\w+)\\)`, 'g'),
        (_m, drop) => `v['${dfName}'].reset_index(${drop === 'True'})`);
      // df.sort_values(col, ascending=...)
      e = e.replace(new RegExp(`${dfName}\\.sort_values\\('([^']+)'(?:,\\s*ascending\\s*=\\s*(\\w+))?\\)`, 'g'),
        (_m, col, asc) => `v['${dfName}'].sort_values('${col}', ${asc !== 'False'})`);
      // df.nunique/mean/sum/max/min/describe/head/value_counts
      const plainMeths = ['nunique', 'mean', 'sum', 'max', 'min', 'describe', 'head', 'value_counts', 'unique', 'iterrows'];
      plainMeths.forEach(m => {
        e = e.replace(new RegExp(`${dfName}\\.${m}\\(\\)`, 'g'), `v['${dfName}'].${m}()`);
      });
      // df.drop_duplicates() 无参数 → 忽略
      e = e.replace(new RegExp(`${dfName}\\.drop_duplicates\\(\\)`, 'g'), `v['${dfName}']`);
      // df 作为整体变量（确保不被上面的模式匹配到的地方）
      // 只替换不在引号/括号内的 df
      e = e.replace(new RegExp(`(?<![\\w'\"])${dfName}(?![\\w'\"])`, 'g'), `v['${dfName}']`);
    });
    return e;
  }

  function runLines(codeLines) {
    for (let i = 0; i < codeLines.length; i++) {
      const line = codeLines[i].trim();
      if (!line || line.startsWith('#')) continue;
      if (line.startsWith('import ') || line.startsWith('from ')) continue;

      // 赋值语句
      const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const name = assignMatch[1];
        const expr = assignMatch[2].trim();

        if (expr.startsWith('pd.DataFrame(')) {
          try {
            const data = new Function('return ' + expr.slice(14,-1))();
            vars[name] = new pd.DataFrame(data);
          } catch(e) { vars[name] = new pd.DataFrame({}); }
          continue;
        }

        if (expr.includes('.groupby(')) {
          const m = expr.match(/(\w+)\.groupby\('([^']+)'\)(.+)/);
          if (m) {
            const df = vars[m[1]];
            const grouped = df.groupby(m[2]);
            const rest = m[3].trim();
            if (rest.startsWith('.agg(')) {
              try {
                const spec = new Function('return ' + rest.slice(5,-1))();
                vars[name] = grouped.agg(spec);
              } catch(e) { vars[name] = new pd.DataFrame({}); }
            } else {
              vars[name] = grouped;
            }
            continue;
          }
        }

        if (expr.includes('.apply(lambda')) {
          const m = expr.match(/(\w+)\.apply\(lambda\s+row\s*:\s*(.+)\)/);
          if (m) {
            try {
              const body = m[2].replace(/row\['?(\w+)'?\]/g, (mk, k) => `row['${k}']`);
              const fn = new Function('row', `return ${body}`);
              vars[name] = vars[m[1]].apply(fn);
            } catch(e) { vars[name] = new pd.DataFrame({}); }
            continue;
          }
        }

        // drop_duplicates
        const dupM = expr.match(/(\w+)\.drop_duplicates\('([^']+)'(?:,\s*keep\s*=\s*'([^']+)')?\)/);
        if (dupM) { vars[name] = vars[dupM[1]].drop_duplicates(dupM[2], dupM[3]); continue; }

        // dropna
        if (expr.match(/(\w+)\.dropna\(\)/)) {
          const m = expr.match(/(\w+)\.dropna\(\)/);
          vars[name] = vars[m[1]].dropna(); continue;
        }

        // reset_index
        const riM = expr.match(/(\w+)\.reset_index\(drop\s*=\s*(\w+)\)/);
        if (riM) { vars[name] = vars[riM[1]].reset_index(riM[2]==='True'); continue; }

        // sort_values
        const svM = expr.match(/(\w+)\.sort_values\('([^']+)'(?:,\s*ascending\s*=\s*(\w+))?\)/);
        if (svM) { vars[name] = vars[svM[1]].sort_values(svM[2], svM[3]!=='False'); continue; }

        // round
        const rM = expr.match(/(\w+)\.round\((\d+)\)/);
        if (rM) { vars[name] = vars[rM[1]].round(+rM[2]); continue; }

        // 简单方法
        const simpleMeths = [
          ['head', /(\w+)\.head\((\d+)\)/, (o,n)=>o.head(+n)],
          ['describe', /(\w+)\.describe\(\)/, o=>o.describe()],
          ['sum', /(\w+)\.sum\(\)/, o=>o.sum()],
          ['mean', /(\w+)\.mean\(\)/, o=>o.mean()],
          ['max', /(\w+)\.max\(\)/, o=>o.max()],
          ['min', /(\w+)\.min\(\)/, o=>o.min()],
          ['nunique', /(\w+)\.nunique\(\)/, o=>o.nunique()],
          ['value_counts', /(\w+)\.value_counts\(\)/, o=>o.value_counts()],
        ];
        let handled = false;
        for (const [_, re, fn] of simpleMeths) {
          const m = expr.match(re);
          if (m && vars[m[1]]) { vars[name] = fn(vars[m[1]]); handled = true; break; }
        }
        if (handled) continue;

        // 通用表达式求值
        try {
          const ev = new Function(...Object.keys(vars), `"use strict"; return (${evalExpr(expr, vars)})`);
          vars[name] = ev(...Object.values(vars));
        } catch(e) {
          try { vars[name] = eval(evalExpr(expr, vars)); } catch(e2) { vars[name] = expr; }
        }
        continue;
      }

      // print 语句
      if (line.startsWith('print(')) {
        const content = line.slice(6, -1).trim();
        const parts = parsePrint(content);
        const results = parts.map(p => {
          if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")))
            return p.slice(1,-1);
          try {
            const ev = new Function(...Object.keys(vars), `"use strict"; return (${evalExpr(p, vars)})`);
            const r = ev(...Object.values(vars));
            if (r instanceof pd.DataFrame) return r.toString();
            return String(r);
          } catch(e) {
            return String(p);
          }
        });
        out += results.join(' ') + '\n';
        continue;
      }

      // for 循环
      if (line.startsWith('for ')) {
        const m = line.match(/for\s+(\w+)\s+in\s+(.+?)\s*:/);
        if (!m) continue;
        const varName = m[1];
        const iterExpr = m[2].trim();
        let body = '', j = i + 1;
        while (j < codeLines.length && codeLines[j].startsWith('    ')) {
          body += codeLines[j].slice(4) + '\n';
          j++;
        }

        let iterable;
        if (iterExpr.includes('range(')) {
          const rm = iterExpr.match(/range\((\d+)(?:,\s*(\d+))?\)/);
          if (rm) {
            const s = rm[2] ? +rm[1] : 0, e2 = rm[2] ? +rm[2] : +rm[1];
            iterable = [...Array(e2 - s).keys()].map(x => s + x);
          }
        } else {
          try {
            const ev = new Function(...Object.keys(vars), `"use strict"; return (${evalExpr(iterExpr, vars)})`);
            iterable = ev(...Object.values(vars)) || [];
          } catch(e) { iterable = []; }
        }

        const saved = vars[varName];
        for (const item of iterable) {
          vars[varName] = item;
          runLines(body.split('\n'));
        }
        if (saved !== undefined) vars[varName] = saved;
        else delete vars[varName];
        i = j - 1;
        continue;
      }

      // def 函数
      if (line.startsWith('def ')) {
        const m = line.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
        if (!m) continue;
        const fnName = m[1];
        const params = m[2].split(',').map(p => p.trim()).filter(Boolean);
        let body = '', j = i + 1;
        while (j < codeLines.length && codeLines[j].startsWith('    ')) {
          body += codeLines[j].slice(4) + '\n';
          j++;
        }
        const capturedVars = { ...vars };
        vars[fnName] = function(...args) {
          const localVars = { ...capturedVars };
          params.forEach((p, idx) => { localVars[p] = args[idx]; });
          let localOut = '', prevOut = out;
          const savedVars = { ...vars };
          Object.assign(vars, localVars);
          runLines(body.split('\n'));
          Object.assign(vars, savedVars);
          return localOut || '';
        };
        i = j - 1;
        continue;
      }
    }
  }

  function parsePrint(content) {
    const parts = [];
    let cur = '';
    let inStr = false, strChar = '', depth = 0;
    for (let i = 0; i < content.length; i++) {
      const ch = content[i];
      if (!inStr && (ch === '"' || ch === "'")) { 
        inStr = true; strChar = ch; cur += ch;
      } else if (inStr && ch === strChar) { 
        inStr = false; cur += ch;
      } else if (!inStr && ch === '(') { 
        depth++; cur += ch;
      } else if (!inStr && ch === ')') { 
        depth--; cur += ch;
      } else if (!inStr && depth === 0 && ch === ',') { 
        parts.push(cur.trim()); cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
  }

  runLines(lines);
  return out.trim();
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
  }, [exerciseId]);

  const allExercises = Object.values(practiceData);
  const projectExercises = allExercises.filter(e => e.projectId === courseId);
  const exerciseIndex = projectExercises.findIndex(e => e.id === currentExercise.id);
  const prevExercise = exerciseIndex > 0 ? projectExercises[exerciseIndex - 1] : null;
  const nextExercise = exerciseIndex < projectExercises.length - 1 ? projectExercises[exerciseIndex + 1] : null;

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('▶ 代码运行中...\n');
    setIsCorrect(null);

    setTimeout(() => {
      try {
        const result = execute(code);
        const text = result.trim();
        if (!text) {
          setOutput('(代码运行完成，但没有 print 输出)');
        } else {
          setOutput(text);
        }
        const expected = (currentExercise.expectedOutput || '').trim();
        if (expected) {
          setIsCorrect(text.includes(expected));
        } else {
          setIsCorrect(text.length > 0);
        }
      } catch (err: any) {
        setOutput('❌ 运行出错:\n' + (err?.message || String(err)));
        setIsCorrect(false);
      } finally {
        setIsRunning(false);
      }
    }, 50);
  };

  const handleResetCode = () => {
    setCode(currentExercise.starterCode);
    setOutput('');
    setIsCorrect(null);
  };

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
              <button onClick={handleResetCode} className="text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">重置</button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[400px] p-4 font-mono text-sm bg-gray-50 border-t border-gray-200 focus:outline-none text-gray-900 leading-6"
              spellCheck={false}
            />
            <div className="p-4 border-t flex justify-end bg-gray-50">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center px-5 py-2.5 rounded-lg transition font-semibold shadow ${
                  isRunning ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                <Play size={16} className="mr-2" />
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
              {output || <span className="text-gray-500">点击"运行代码"查看结果</span>}
              {isCorrect === true && (
                <div className="mt-3 text-green-400 flex items-center"><CheckCircle size={16} className="mr-2" /> 太棒了，答案正确！</div>
              )}
              {isCorrect === false && (
                <div className="mt-3 text-red-400 flex items-center"><XCircle size={16} className="mr-2" /> 结果不符合预期，参考提示修改。</div>
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
