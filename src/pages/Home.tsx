import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Database, TrendingUp, Code, Award, ShoppingCart, Users, CheckCircle, BarChart2, MessageSquare, Package, Megaphone, FolderKanban, MousePointerClick, LineChart, UserCheck, Star, GitMerge, ChevronRight, Sparkles
} from 'lucide-react';

const Home: React.FC = () => {
  // 10 个电商数据分析实战项目 —— 同时用于"项目速览"和"推荐项目"卡片
  const projects = [
    {
      id: '1',
      title: '购物车关联规则挖掘',
      summary: '发现商品间的强关联关系，优化跨类目推荐与捆绑销售',
      tags: ['Apriori', '购物篮分析', '商品推荐'],
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
    },
    {
      id: '2',
      title: '用户 RFM 分析与价值聚类',
      summary: '用 RFM 模型分层用户价值，结合 KMeans 聚类给出差异化运营策略',
      tags: ['RFM', 'KMeans', '用户分层'],
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-50',
    },
    {
      id: '3',
      title: '异常订单检测',
      summary: '基于 IQR / Z-Score / IsolationForest 识别异常订单，保障数据质量',
      tags: ['异常检测', 'IQR', 'IsolationForest'],
      icon: CheckCircle,
      color: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50',
    },
    {
      id: '4',
      title: '购物车转化漏斗分析',
      summary: '拆解浏览 → 加购 → 下单 → 付款的每一步流失，定位问题环节',
      tags: ['漏斗分析', '转化优化', '会话识别'],
      icon: MousePointerClick,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
    },
    {
      id: '5',
      title: '商品销售趋势与周期性分析',
      summary: '用 Prophet 模型做销量预测，识别旺淡季与节假日效应',
      tags: ['Prophet', '时间序列', '趋势预测'],
      icon: LineChart,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
    {
      id: '6',
      title: '用户复购间隔与生命周期聚类',
      summary: '分析首复购 / 二次复购 / 休眠召回，构建用户生命周期画像',
      tags: ['复购分析', '用户生命周期', '活跃度'],
      icon: UserCheck,
      color: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
    },
    {
      id: '7',
      title: '文本评论情感与评分不一致分析',
      summary: '用 SnowNLP / BERT 对评论做情感打分，找出"五星差评 / 一星好评"样本',
      tags: ['文本分析', '情感分析', 'BERT'],
      icon: MessageSquare,
      color: 'from-sky-500 to-blue-500',
      bg: 'bg-sky-50',
    },
    {
      id: '8',
      title: '购物篮商品组合推荐',
      summary: '基于 ItemCF 与余弦相似度，为购物车自动推荐补充商品',
      tags: ['ItemCF', '推荐系统', '协同过滤'],
      icon: Package,
      color: 'from-fuchsia-500 to-pink-500',
      bg: 'bg-fuchsia-50',
    },
    {
      id: '9',
      title: '促销活动效果分析（A/B 测试）',
      summary: '用 t 检验 / 卡方检验量化促销净提升效应，评估 ROI',
      tags: ['A/B 测试', '假设检验', '效果归因'],
      icon: Megaphone,
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
    },
    {
      id: '10',
      title: '端到端数据清洗与用户画像报告',
      summary: '整合多表数据、统一清洗规则、输出用户画像仪表盘 + HTML 报告',
      tags: ['ETL', '用户画像', '仪表盘'],
      icon: FolderKanban,
      color: 'from-indigo-500 to-blue-500',
      bg: 'bg-indigo-50',
    },
  ];

  // 六大能力分类（用于分类卡片区）
  const categories = [
    { name: '用户分析', items: ['RFM 分层', '用户聚类', '复购/生命周期', '活跃度衰减'], icon: Users },
    { name: '商品分析', items: ['关联规则', '销售趋势', '季节性', '预测补货'], icon: BarChart2 },
    { name: '行为分析', items: ['漏斗转化', '购物篮', '浏览-付款链路', '付款预测'], icon: MousePointerClick },
    { name: '文本分析', items: ['评论情感', '评分-文本不一致', '词云', 'BERT 情感'], icon: MessageSquare },
    { name: '推荐与算法', items: ['ItemCF 协同过滤', '组合推荐', 'HitRate 评估'], icon: GitMerge },
    { name: '实验与报告', items: ['A/B 测试', 't/卡方检验', 'CUPED', 'HTML 自动化报告'], icon: BookOpen },
  ];

  // 平台特色
  const features = [
    {
      title: '10 个电商实战项目',
      desc: '覆盖用户、商品、交易、评论、促销等电商全场景，从数据清洗到业务洞察完整打通',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '文字化深度学习',
      desc: '每个项目配套 3 节详细文字讲义（业务背景 + Python 代码 + 业务洞察），而非录屏视频',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      title: '真实 Python 代码可运行',
      desc: '浏览器内置 Pyodide，练习代码可直接在网页执行、查看输出，无需本地环境',
      icon: Code,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: '项目驱动学习',
      desc: '以解决真实业务问题为出发点，从一个项目到下一个项目，逐步搭建完整数据分析师能力栈',
      icon: Database,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: '学练测评闭环',
      desc: '阅读讲义 → 敲代码练习 → 实战项目 → 提交 HTML 报告，每步都有明确产出',
      icon: CheckCircle,
      color: 'from-rose-500 to-pink-500',
    },
    {
      title: '成就激励系统',
      desc: '徽章、等级、学习进度，记录你的成长路径，让坚持更有成就感',
      icon: Award,
      color: 'from-violet-500 to-purple-500',
    },
  ];

  // 学习路径
  const learningPath = [
    { step: '01', title: '选择项目', desc: '从 10 个电商项目中选一个感兴趣的，点击进入学习' },
    { step: '02', title: '阅读讲义', desc: '先通读书写版讲义，理解业务背景、方法与关键代码' },
    { step: '03', title: '动手练习', desc: '在代码练习页直接运行 Python，体验数据从清洗到结果的完整流程' },
    { step: '04', title: '产出报告', desc: '用所学生成 HTML 报告或业务洞察，完成项目闭环' },
  ];

  return (
    <div className="space-y-20 pb-10">
      {/* 英雄区 */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-2xl overflow-hidden relative">
        {/* 背景装饰 */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-10 md:mb-0">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              <span>10 个电商数据分析实战项目 · Python 驱动</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              用 <span className="text-yellow-300">10 个电商项目</span><br />
              练出真 · 数据分析能力
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              从购物车关联规则到用户 RFM 分层，从评论情感到 A/B 测试效果归因。
              每一个项目都是一个可以直接用在面试/工作中的完整案例。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <Link
                to="/courses"
                className="px-8 py-3.5 bg-yellow-300 text-slate-900 font-semibold rounded-lg hover:bg-yellow-200 transition shadow-lg shadow-yellow-500/10 text-center"
              >
                查看 10 个项目
              </Link>
              <Link
                to="/practice/1/1"
                className="px-8 py-3.5 bg-transparent border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition text-center"
              >
                试做第一个项目 →
              </Link>
            </div>

            {/* 数据亮点 */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
              <div>
                <div className="text-3xl font-bold text-yellow-300">10</div>
                <div className="text-sm text-blue-200 mt-1">完整实战项目</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">30+</div>
                <div className="text-sm text-blue-200 mt-1">配套代码练习</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">100%</div>
                <div className="text-sm text-blue-200 mt-1">Python 真实运行</div>
              </div>
            </div>
          </div>

          {/* 右侧：项目卡片堆叠 */}
          <div className="md:w-2/5 w-full">
            <div className="space-y-3">
              {projects.slice(0, 5).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/courses/${p.id}`}
                  className="flex items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition transform hover:-translate-y-0.5 backdrop-blur"
                  style={{ marginLeft: `${i * 12}px`, marginRight: `${(4 - i) * 8}px` }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center mr-3 shadow-lg`}>
                    <p.icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">项目 {p.id} · {p.title}</div>
                    <div className="text-xs text-blue-200 truncate">{p.summary}</div>
                  </div>
                  <ChevronRight size={16} className="text-blue-200 flex-shrink-0" />
                </Link>
              ))}
              <Link to="/courses" className="block text-center text-sm text-blue-200 hover:text-white py-2">
                查看完整 10 个项目 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 六大能力地图 */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="inline-block text-sm font-semibold text-blue-600 mb-2">CAPABILITY MAP</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            10 个项目，帮你搭建 <span className="text-blue-600">6 大数据分析能力</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            不是零散的课程知识点，而是一套可以直接上手解决业务问题的分析方法论
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <div key={c.name} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-blue-100 transition group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                  <c.icon size={22} />
                </div>
                <Star size={14} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{c.name}</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 10 个项目全览 */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-block text-sm font-semibold text-purple-600 mb-2">ALL 10 PROJECTS</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">10 个电商数据分析实战项目</h2>
            <p className="text-gray-600 mt-2">从简单到综合，按顺序学习效果更好</p>
          </div>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
            进入项目中心 <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/courses/${p.id}`}
              className={`group flex items-stretch rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition ${p.bg}`}
            >
              {/* 左侧：项目编号 + 图标 */}
              <div className="w-20 flex flex-col items-center justify-center p-4 text-white bg-gradient-to-br shrink-0 shadow-inner"
                   style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
                  <p.icon size={24} className="text-white" />
                </div>
                <div className="text-xs font-semibold text-gray-700 mt-2">项目 {p.id}</div>
              </div>

              {/* 右侧：标题、简介、标签 */}
              <div className="flex-1 p-5 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition">{p.title}</h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{p.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 bg-white text-gray-700 rounded-full border border-gray-200 shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center pr-5 text-gray-400 group-hover:text-blue-600">
                <ChevronRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 学习路径 */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="inline-block text-sm font-semibold text-emerald-600 mb-2">HOW TO LEARN</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">4 步学习法，把每个项目做深</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            一个项目 = 一次完整的"业务理解 → 数据清洗 → 分析建模 → 产出报告"练习
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {learningPath.map((step, i) => (
            <div key={step.step} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition">
              <div className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-3">
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              {i < learningPath.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 z-10">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 平台特色 */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-14">
          <div className="text-center mb-10">
            <div className="inline-block text-sm font-semibold text-blue-600 mb-2">WHY US</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">为什么从这里开始</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              不做"知识点罗列"，只做"能落地的项目"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-md mb-4`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-10 md:p-14 text-center text-white shadow-xl shadow-blue-900/20">
          <TrendingUp size={40} className="mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始你的第一个电商数据分析项目了吗？</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            从"购物车关联规则挖掘"开始，一步步解锁你的数据分析实战能力
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/courses"
              className="px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              浏览全部 10 个项目
            </Link>
            <Link
              to="/courses/1"
              className="px-8 py-3.5 bg-blue-900/30 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              从项目 1 开始 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
