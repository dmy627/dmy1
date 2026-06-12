// 测试新的 evalExpr - 匹配 Practice.tsx 逻辑
const pd = (() => {
  function DF(data) {
    this._data = {};
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      Object.keys(data).forEach(k => { this._data[k] = [...data[k]]; });
    }
    this.columns = Object.keys(this._data);
    this.shape = [this._data[this.columns[0]]?.length || 0, this.columns.length];
  }
  DF.prototype.sum = function() {
    return this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number')).reduce((a,b)=>a+b,0);
  };
  DF.prototype.head = function(n = 5) {
    const d = {}; this.columns.forEach(c => { d[c] = this._data[c].slice(0, n); });
    return new DF(d);
  };
  DF.prototype.value_counts = function() {
    const cnt = {};
    this.columns.forEach(c => { this._data[c].forEach(v => { cnt[String(v)] = (cnt[String(v)]||0)+1; }); });
    const entries = Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
    return new DF({ [entries[0]?.[0]||'value']: entries.map(e=>e[1]) });
  };
  DF.prototype.toString = function() {
    const ml = this.columns.map(c => Math.max(c.length, ...this._data[c].map(v=>String(v).length)));
    let r = '  ' + this.columns.map((c,i)=>c.padEnd(ml[i])).join(' ') + '\n';
    for (let i=0; i<this.shape[0]; i++) {
      r += String(i) + ' ' + this.columns.map((c,j)=>String(this._data[c][i]).padEnd(ml[j])).join(' ') + '\n';
    }
    return r.trim();
  };
  DF.prototype.get = function(key) { return this._data[key]; };
  DF.prototype.groupby = function(col) {
    const groups = {};
    for (let i=0; i<this.shape[0]; i++) {
      const key = String(this._data[col][i]);
      if (!groups[key]) groups[key] = [];
      const row = {}; this.columns.forEach(c => { row[c] = this._data[c][i]; });
      groups[key].push(row);
    }
    const makeAgg = (spec) => {
      const result = {};
      Object.keys(spec).forEach(k => { result[k] = []; });
      result['group'] = [];
      Object.entries(groups).forEach(([key, grpRows]) => {
        result['group'].push(key);
        Object.keys(spec).forEach(colName => {
          const vals = grpRows.map(r => r[colName]).filter(v => typeof v === 'number');
          const fn = spec[colName];
          if (typeof fn === 'string') {
            switch(fn) {
              case 'count': result[colName].push(vals.length); break;
              case 'sum': result[colName].push(vals.reduce((a,b)=>a+b,0)); break;
              case 'mean': result[colName].push(vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0); break;
            }
          }
        });
      });
      return new DF(result);
    };
    return { agg: makeAgg, apply: () => new DF({}) };
  };
  DF.prototype.apply = function(fn) {
    const results = [];
    for (let i=0; i<this.shape[0]; i++) {
      const row = {}; this.columns.forEach(c => { row[c] = this._data[c][i]; });
      results.push(fn(row));
    }
    return new DF({ 'result': results });
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
  DF.prototype.nunique = function() { return new Set(this.columns.flatMap(c => this._data[c])).size; };
  DF.prototype.mean = function() { const vals = this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number')); return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0; };
  DF.prototype.max = function() { const vals = this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number')); return Math.max(...(vals.length ? vals : [0])); };
  DF.prototype.min = function() { const vals = this.columns.flatMap(c => this._data[c].filter(v => typeof v === 'number')); return Math.min(...(vals.length ? vals : [0])); };
  DF.prototype.round = function(n = 0) { const nd = {}; this.columns.forEach(c => { nd[c] = this._data[c].map(v => typeof v==='number' ? +v.toFixed(n) : v); }); return new DF(nd); };
  return { DataFrame: DF };
})();

// 给 Array 添加 sum/mean/max/min 方法
Array.prototype.sum = function() { return this.filter(v => typeof v === 'number').reduce((a,b)=>a+b,0); };
Array.prototype.mean = function() { const nums = this.filter(v => typeof v === 'number'); return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0; };
Array.prototype.max = function() { const nums = this.filter(v => typeof v === 'number'); return nums.length ? Math.max(...nums) : 0; };
Array.prototype.min = function() { const nums = this.filter(v => typeof v === 'number'); return nums.length ? Math.min(...nums) : 0; };
Array.prototype.nunique = function() { return new Set(this).size; };
Array.prototype.value_counts = function() {
  const cnt = {};
  this.forEach(v => { cnt[String(v)] = (cnt[String(v)]||0)+1; });
  const entries = Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
  return new pd.DataFrame({ [entries[0]?.[0]||'value']: entries.map(e=>e[1]) });
};
Array.prototype.toString = function() { return this.join(', '); };

// evalExpr - 修复版：避免引号内匹配，使用负向断言
function evalExpr(expr, v) {
  let e = expr;
  const dfVars = Object.keys(v).filter(k => k !== 'pd' && v[k] instanceof pd.DataFrame);
  dfVars.sort((a, b) => b.length - a.length);

  dfVars.forEach(dfName => {
    // df['col'].sum() -> v['df'].get('col').sum()
    e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]\\.sum\\(\\)`, 'g'),
      (m) => `v['${dfName}'].get('${m.match(/\[([^\]]+)\]/)?.[1].replace(/'/g, '')}').sum()`);

    // df['col'].method() 通用模式
    e = e.replace(/(\w+)\['([^']+)'\]\.(sum|mean|max|min|nunique|describe|value_counts)\(\)/g,
      (_m, _obj, col, method) => {
        if (v[_obj] instanceof pd.DataFrame) return `v['${_obj}'].get('${col}').${method}()`;
        return _m;
      });

    // df['col'].head(n)
    e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]\\.head\\((\\d+)\\)`, 'g'),
      (_m, col, n) => `v['${dfName}'].get('${col}').head(${n})`);
    // df['col'].sort_values(...)
    e = e.replace(new RegExp(`${dfName}\\['([^']+)'\\]\\.sort_values\\('([^']+)'(?:,\\s*ascending\\s*=\\s*(\\w+))?\\)`, 'g'),
      (_m, col, col2, asc) => `v['${dfName}'].get('${col}').sort_values('${col}', ${asc !== 'False'})`);
    // df['col']
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
    // df.sort_values(col, ascending=...)
    e = e.replace(new RegExp(`${dfName}\\.sort_values\\('([^']+)'(?:,\\s*ascending\\s*=\\s*(\\w+))?\\)`, 'g'),
      (_m, col, asc) => `v['${dfName}'].sort_values('${col}', ${asc !== 'False'})`);
    // df.nunique/mean/sum/max/min/describe/head/value_counts
    const plainMeths = ['nunique', 'mean', 'sum', 'max', 'min', 'describe', 'head', 'value_counts', 'unique', 'iterrows'];
    plainMeths.forEach(m => {
      e = e.replace(new RegExp(`${dfName}\\.${m}\\(\\)`, 'g'), `v['${dfName}'].${m}()`);
    });
    // df.drop_duplicates() 无参数 -> 忽略
    e = e.replace(new RegExp(`${dfName}\\.drop_duplicates\\(\\)`, 'g'), `v['${dfName}']`);
    // df.reset_index(drop=...)
    e = e.replace(new RegExp(`${dfName}\\.reset_index\\(drop\\s*=\\s*(\\w+)\\)`, 'g'),
      (_m, drop) => `v['${dfName}'].reset_index(${drop === 'True'})`);

    // 关键修复：使用负向断言，避免匹配引号或括号内的 df
    e = e.replace(new RegExp(`(?<![\\w'\"])${dfName}(?![\\w'\"])`, 'g'), `v['${dfName}']`);
  });
  return e;
}

// 简单的 print 解析
function parsePrint(content) {
  const parts = [];
  let cur = [];
  let inStr = false, strChar = '', depth = 0;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (!inStr && (ch === '"' || ch === "'")) { inStr = true; strChar = ch; cur.push(ch); }
    else if (inStr && ch === strChar) { inStr = false; cur.push(ch); }
    else if (!inStr && ch === '(') { depth++; cur.push(ch); }
    else if (!inStr && ch === ')') { depth--; cur.push(ch); }
    else if (!inStr && depth === 0 && ch === ',') { parts.push(cur.join('').trim()); cur = []; }
    else { cur.push(ch); }
  }
  if (cur.length > 0) parts.push(cur.join('').trim());
  return parts;
}

// 全局变量，模拟浏览器环境
globalThis.v = { pd };

function test(code) {
  globalThis.v['df'] = new pd.DataFrame({'a': [1,2,3], 'b': [10,20,30], 'name': ['x','y','z']});

  try {
    const ev = evalExpr(code, globalThis.v);
    console.log('  eval:', ev);
    // 传递 v 作为参数，这样 v['df'] 可以工作
    const fn = new Function('v', 'return (' + ev + ')');
    const r = fn(globalThis.v);
    if (r instanceof pd.DataFrame) console.log('  result:\n' + r.toString());
    else console.log('  result:', r);
  } catch(ex) { console.log('  ERROR:', ex.message); }
}

console.log('Test 1: df["b"].sum()'); test("df['b'].sum()");
console.log('Test 2: df.shape'); test("df.shape");
console.log('Test 3: df.head(2)'); test("df.head(2)");
console.log('Test 4: df["a"].value_counts()'); test("df['a'].value_counts()");

console.log('\nTest 5: print mixed');
{
  const v = { pd };
  v['df'] = new pd.DataFrame({'a': [1,2,3], 'b': [10,20,30], 'name': ['x','y','z']});
  const content = "'Total:', df['b'].sum(), '元'";
  const parts = parsePrint(content);
  const results = parts.map(p => {
    if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")))
      return p.slice(1,-1);
    try {
      const ev = evalExpr(p, v);
      const fn = new Function(...Object.keys(v), 'return (' + ev + ')');
      const r = fn(...Object.values(v));
      if (r instanceof pd.DataFrame) return r.toString();
      return String(r);
    } catch(ex) { return '[ERR:' + ex.message + ']'; }
  });
  console.log('  output:', results.join(' '));
}

console.log('\n=== 完整练习题测试 ===');
function runCode(code) {
  const lines = code.split('\n');
  const v = { pd };
  let out = '';

  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith('#') || l.startsWith('import ') || l.startsWith('from ')) continue;

    const am = l.match(/^(\w+)\s*=\s*(.+)$/);
    if (am) {
      const name = am[1], expr = am[2].trim();
      if (expr.startsWith('pd.DataFrame(')) {
        try { v[name] = new pd.DataFrame(new Function('return ' + expr.slice(14,-1))()); } catch(e) { v[name] = new pd.DataFrame({}); }
        continue;
      }
      try {
        const ev = evalExpr(expr, v);
        const fn = new Function(...Object.keys(v), 'return (' + ev + ')');
        v[name] = fn(...Object.values(v));
      } catch(e) { v[name] = expr; }
      continue;
    }

    if (l.startsWith('print(')) {
      const content = l.slice(6, -1).trim();
      const parts = parsePrint(content);
      const r = parts.map(p => {
        if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")))
          return p.slice(1,-1);
        try {
          const ev = evalExpr(p, v);
          const fn = new Function(...Object.keys(v), 'return (' + ev + ')');
          const res = fn(...Object.values(v));
          if (res instanceof pd.DataFrame) return res.toString();
          return String(res);
        } catch(e) { return '[ERR:' + e.message + ']'; }
      });
      out += r.join(' ') + '\n';
    }
  }
  return out.trim();
}

const code1 = `import pandas as pd

data = {
    'order_id': [1, 2, 3, 4, 5],
    'product': ['A', 'B', 'C', 'A', 'B'],
    'amount': [25, 15, 12, 25, 15]
}

df = pd.DataFrame(data)
print('数据形状:', df.shape)
print('前5行:')
print(df.head())
print('销量排行:')
print(df['product'].value_counts())
print('总销售额:', df['amount'].sum(), '元')`;

console.log(runCode(code1));

console.log('\n=== 漏斗分析测试 ===');
const code2 = `import pandas as pd

df = pd.DataFrame({
    'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 4, 5],
    'step': ['浏览', '加购', '支付', '浏览', '加购', '浏览', '加购', '支付', '浏览', '浏览']
})

steps = ['浏览', '加购', '支付']
top = df[df['step']=='浏览']['user_id'].nunique()
print('漏斗转化:')
for s in steps:
    n = df[df['step']==s]['user_id'].nunique()
    print(s + ': ' + n + '人 (' + n/top*100 + '%)')`;

console.log(runCode(code2));
