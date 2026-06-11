import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, BookOpen, Code, FileText, CheckCircle, ChevronDown, ChevronRight, Users, Star, Clock } from 'lucide-react';

// 10个项目的详细数据
const projectData = {
  '1': {
    id: '1',
    title: '项目1：电商购物车关联规则挖掘',
    description: '学习购物车分析，使用Apriori算法发现商品关联规则，生成"买了A也买了B"的推荐。掌握数据透视表、groupby聚合、列表转换、apply自定义函数等pandas技能。',
    category: '关联规则',
    level: 'intermediate',
    duration: 8,
    enrolledCount: 680,
    instructor: '张老师',
    instructorTitle: '数据科学家',
    rating: 4.9,
    reviewCount: 156,
    skills: ['数据透视表', 'groupby聚合', '列表转换', 'apply自定义函数', 'Apriori算法'],
    outcome: 'Top 10关联规则表（含支持度、置信度、提升度）',
    chapters: [
      {
        id: '1',
        title: '项目概述与数据准备',
        duration: 60,
        lessons: [
          { id: '1', title: '项目背景与目标', type: 'reading', duration: 15, completed: false },
          { id: '2', title: '数据加载与探索', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '关联规则核心指标',
        duration: 90,
        lessons: [
          { id: '4', title: '支持度/置信度/提升度', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '手动实现关联规则', type: 'code', duration: 35, completed: false },
          { id: '6', title: '结果解读与业务洞察', type: 'reading', duration: 25, completed: false },
        ],
      },
      {
        id: '3',
        title: 'mlxtend 库应用',
        duration: 75,
        lessons: [
          { id: '7', title: 'Apriori 算法介绍', type: 'reading', duration: 20, completed: false },
          { id: '8', title: 'TransactionEncoder 使用', type: 'code', duration: 30, completed: false },
          { id: '9', title: '生成关联规则', type: 'code', duration: 25, completed: false },
        ],
      },
      {
        id: '4',
        title: '推荐系统实现与报告',
        duration: 90,
        lessons: [
          { id: '10', title: '推荐词条生成', type: 'reading', duration: 20, completed: false },
          { id: '11', title: '构建推荐函数', type: 'code', duration: 45, completed: false },
          { id: '12', title: '项目总结与报告', type: 'reading', duration: 25, completed: false },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    title: '项目2：用户消费行为RFM分析与价值聚类',
    description: '使用RFM模型分析用户价值，结合KMeans聚类进行用户分群，制定精准营销策略。学习时间差计算、分位数划分、pivot_table等技能。',
    category: '聚类分析',
    level: 'intermediate',
    duration: 10,
    enrolledCount: 750,
    instructor: '李老师',
    instructorTitle: '用户增长专家',
    rating: 4.8,
    reviewCount: 203,
    skills: ['pd.Timedelta', '分位数划分', 'pivot_table', 'KMeans聚类', 'RFM模型'],
    outcome: '用户分群雷达图 + 每个群体的人数占比与建议动作',
    chapters: [
      {
        id: '1',
        title: 'RFM模型基础',
        duration: 75,
        lessons: [
          { id: '1', title: 'RFM 指标定义', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '数据准备', type: 'code', duration: 35, completed: false },
          { id: '3', title: 'RFM 特征计算', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: 'KMeans 聚类用户分群',
        duration: 90,
        lessons: [
          { id: '4', title: '聚类原理与标准化', type: 'reading', duration: 25, completed: false },
          { id: '5', title: '肘部法则选 K', type: 'code', duration: 30, completed: false },
          { id: '6', title: '聚类模型训练', type: 'code', duration: 35, completed: false },
        ],
      },
      {
        id: '3',
        title: '群体画像与运营策略',
        duration: 90,
        lessons: [
          { id: '7', title: '解读聚类中心', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '雷达图/可视化', type: 'code', duration: 40, completed: false },
          { id: '9', title: '差异化运营动作', type: 'reading', duration: 25, completed: false },
        ],
      },
    ],
  },
  '3': {
    id: '3',
    title: '项目3：异常订单检测',
    description: '学习数据清洗核心技术，使用Z-score、IQR和Isolation Forest识别异常订单，生成清洗前后对比报告。掌握isnull、dropna、duplicated、条件筛选等技能。',
    category: '数据清洗',
    level: 'beginner',
    duration: 6,
    enrolledCount: 520,
    instructor: '王老师',
    instructorTitle: '数据工程师',
    rating: 4.7,
    reviewCount: 124,
    skills: ['isnull/dropna', 'duplicated', '条件筛选', 'Z-score', 'IQR', 'Isolation Forest'],
    outcome: '清洗前后对比报告 + 异常原因分类统计',
    chapters: [
      {
        id: '1',
        title: '数据质量检查',
        duration: 60,
        lessons: [
          { id: '1', title: '常见数据问题', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '缺失值处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '重复值处理', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '规则检测（Z-score / IQR）',
        duration: 75,
        lessons: [
          { id: '4', title: 'Z-score 与 IQR 原理', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '实现异常标记', type: 'code', duration: 35, completed: false },
          { id: '6', title: '分品类的规则阈值', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: 'AI 检测与原因分析',
        duration: 75,
        lessons: [
          { id: '7', title: 'Isolation Forest 介绍', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '三种方法交叉对比', type: 'code', duration: 35, completed: false },
          { id: '9', title: '异常原因标签与报告', type: 'code', duration: 15, completed: false },
        ],
      },
    ],
  },
  '4': {
    id: '4',
    title: '项目4：购物车转化路径漏斗分析',
    description: '分析用户从浏览到支付的转化漏斗，识别流失点，使用分类模型预测用户付款意愿。学习会话化、漏斗转化率、特征工程等技能。',
    category: '漏斗分析',
    level: 'intermediate',
    duration: 7,
    enrolledCount: 590,
    instructor: '陈老师',
    instructorTitle: '产品数据分析师',
    rating: 4.8,
    reviewCount: 167,
    skills: ['session 会话化', 'shift 路径', 'groupby', '漏斗转化率', '随机森林'],
    outcome: '漏斗图 + 流失用户主要特征画像',
    chapters: [
      {
        id: '1',
        title: '用户行为数据预处理',
        duration: 60,
        lessons: [
          { id: '1', title: '漏斗分析思想', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '日志表清洗', type: 'code', duration: 25, completed: false },
          { id: '3', title: '构造会话 session', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '漏斗转化率计算',
        duration: 75,
        lessons: [
          { id: '4', title: '转化率/流失率定义', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '漏斗图（Plotly）', type: 'code', duration: 35, completed: false },
          { id: '6', title: '按渠道/设备分组对比', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: '付款意愿预测模型',
        duration: 75,
        lessons: [
          { id: '7', title: '行为特征工程', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '随机森林分类', type: 'code', duration: 35, completed: false },
          { id: '9', title: '特征重要性解读', type: 'code', duration: 15, completed: false },
        ],
      },
    ],
  },
  '5': {
    id: '5',
    title: '项目5：商品销售趋势与周期性分析',
    description: '时间序列分析销量趋势、季节性，使用Prophet预测未来销量。学习to_datetime、resample、rolling、同比环比等技能。',
    category: '时间序列',
    level: 'advanced',
    duration: 9,
    enrolledCount: 480,
    instructor: '刘老师',
    instructorTitle: '时间序列专家',
    rating: 4.9,
    reviewCount: 132,
    skills: ['to_datetime', 'resample', 'rolling', 'STL分解', 'Prophet', '同比环比'],
    outcome: '销量趋势曲线 + 旺季/淡季标注表 + 预测结果',
    chapters: [
      {
        id: '1',
        title: '时间序列基础',
        duration: 75,
        lessons: [
          { id: '1', title: '时间序列基本概念', type: 'reading', duration: 25, completed: false },
          { id: '2', title: '时间索引与重采样', type: 'code', duration: 30, completed: false },
          { id: '3', title: '滚动均值与同环比', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '趋势与季节性分解',
        duration: 90,
        lessons: [
          { id: '4', title: '加法/乘法模型', type: 'reading', duration: 25, completed: false },
          { id: '5', title: 'STL分解', type: 'code', duration: 35, completed: false },
          { id: '6', title: '旺淡季识别', type: 'code', duration: 30, completed: false },
        ],
      },
      {
        id: '3',
        title: 'Prophet 销量预测',
        duration: 90,
        lessons: [
          { id: '7', title: 'Prophet 原理与优势', type: 'reading', duration: 25, completed: false },
          { id: '8', title: '模型训练与预测', type: 'code', duration: 40, completed: false },
          { id: '9', title: '准确度评估与可视化', type: 'code', duration: 25, completed: false },
        ],
      },
    ],
  },
  '6': {
    id: '6',
    title: '项目6：用户复购间隔与生命周期聚类',
    description: '分析用户复购行为，构建活跃度衰减模型，识别不同复购模式的用户群组。学习groupby+shift、活跃度衰减等技能。',
    category: '聚类分析',
    level: 'advanced',
    duration: 8,
    enrolledCount: 410,
    instructor: '赵老师',
    instructorTitle: '用户运营专家',
    rating: 4.7,
    reviewCount: 98,
    skills: ['groupby+shift', '复购间隔', '活跃度衰减模型', 'KMeans', '群组画像'],
    outcome: '不同复购模式的用户群组（每月一次、季度回购、一次性等）',
    chapters: [
      {
        id: '1',
        title: '复购行为分析',
        duration: 60,
        lessons: [
          { id: '1', title: '复购指标定义', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '复购间隔计算', type: 'code', duration: 25, completed: false },
          { id: '3', title: '购买频次/金额统计', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '用户生命周期建模',
        duration: 75,
        lessons: [
          { id: '4', title: '活跃度衰减模型', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '用户特征宽表构建', type: 'code', duration: 35, completed: false },
          { id: '6', title: '分阶段规则打标', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: '复购模式聚类',
        duration: 75,
        lessons: [
          { id: '7', title: '聚类思路与特征选择', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '群组画像', type: 'code', duration: 35, completed: false },
          { id: '9', title: '运营策略建议', type: 'reading', duration: 20, completed: false },
        ],
      },
    ],
  },
  '7': {
    id: '7',
    title: '项目7：文本评论情感与评分不一致分析',
    description: '使用SnowNLP或BERT分析评论情感，识别高分差评/低分好评的矛盾样本。学习str.contains/extract、cut分箱等技能。',
    category: '自然语言处理',
    level: 'advanced',
    duration: 10,
    enrolledCount: 350,
    instructor: '孙老师',
    instructorTitle: 'NLP 算法工程师',
    rating: 4.9,
    reviewCount: 89,
    skills: ['str.contains', 'str.extract', 'SnowNLP', 'BERT', '情感分析', 'cut分箱'],
    outcome: '不一致样本列表 + 词云突出常见矛盾原因',
    chapters: [
      {
        id: '1',
        title: '文本分析与数据准备',
        duration: 75,
        lessons: [
          { id: '1', title: '文本分析概述', type: 'reading', duration: 20, completed: false },
          { id: '2', title: 'pandas 字符串操作', type: 'code', duration: 35, completed: false },
          { id: '3', title: '关键词/长度统计', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '情感分析实现',
        duration: 90,
        lessons: [
          { id: '4', title: 'SnowNLP 情感计算', type: 'reading', duration: 20, completed: false },
          { id: '5', title: '情感得分与评分对比', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'BERT 进阶（选学）', type: 'reading', duration: 30, completed: false },
        ],
      },
      {
        id: '3',
        title: '不一致样本深度分析',
        duration: 90,
        lessons: [
          { id: '7', title: '矛盾样本定义', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '词云可视化', type: 'code', duration: 45, completed: false },
          { id: '9', title: '原因归因与报告', type: 'code', duration: 25, completed: false },
        ],
      },
    ],
  },
  '8': {
    id: '8',
    title: '项目8：购物篮商品组合推荐',
    description: '基于协同过滤为购物车自动推荐补充商品，构建ItemCF推荐系统。学习pivot_table、fillna、余弦相似度等技能。',
    category: '推荐系统',
    level: 'advanced',
    duration: 9,
    enrolledCount: 420,
    instructor: '周老师',
    instructorTitle: '推荐系统工程师',
    rating: 4.8,
    reviewCount: 112,
    skills: ['pivot_table', 'fillna', '余弦相似度', '协同过滤 ItemCF', 'KNN', 'HitRate 评估'],
    outcome: '每个商品的最相似 Top 5 商品列表 + 购物篮推荐函数',
    chapters: [
      {
        id: '1',
        title: '推荐系统基础与用户商品矩阵',
        duration: 75,
        lessons: [
          { id: '1', title: '推荐系统概述', type: 'reading', duration: 25, completed: false },
          { id: '2', title: '用户商品矩阵构建', type: 'code', duration: 30, completed: false },
          { id: '3', title: '稀疏性与冷启动问题', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '基于物品的协同过滤',
        duration: 90,
        lessons: [
          { id: '4', title: 'ItemCF 与余弦相似度', type: 'reading', duration: 25, completed: false },
          { id: '5', title: '物品相似度矩阵', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'KNN 最近邻推荐', type: 'code', duration: 25, completed: false },
        ],
      },
      {
        id: '3',
        title: '购物车推荐与效果评估',
        duration: 90,
        lessons: [
          { id: '7', title: '购物篮合并打分逻辑', type: 'reading', duration: 20, completed: false },
          { id: '8', title: '推荐 API 函数实现', type: 'code', duration: 45, completed: false },
          { id: '9', title: '留一法 HitRate 评估', type: 'code', duration: 25, completed: false },
        ],
      },
    ],
  },
  '9': {
    id: '9',
    title: '项目9：促销活动效果分析',
    description: 'A/B测试模拟，使用假设检验评估促销效果，控制混杂因素并量化净提升效应。学习t检验、卡方检验、回归控制等技能。',
    category: 'A/B 测试',
    level: 'intermediate',
    duration: 7,
    enrolledCount: 550,
    instructor: '吴老师',
    instructorTitle: '数据科学家',
    rating: 4.7,
    reviewCount: 145,
    skills: ['假设检验', 't 检验', '卡方检验', '回归控制混杂', 'CUPED', '提升度'],
    outcome: '活动净提升效应报告（含显著性结论）',
    chapters: [
      {
        id: '1',
        title: 'A/B 测试基础与实验设计',
        duration: 60,
        lessons: [
          { id: '1', title: 'A/B 测试思想', type: 'reading', duration: 20, completed: false },
          { id: '2', title: '随机分组与护栏指标', type: 'reading', duration: 20, completed: false },
          { id: '3', title: '数据准备与汇总表', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '统计检验',
        duration: 75,
        lessons: [
          { id: '4', title: 'p 值与显著性', type: 'reading', duration: 25, completed: false },
          { id: '5', title: 't 检验实现（人均GMV）', type: 'code', duration: 30, completed: false },
          { id: '6', title: '卡方检验实现（转化率）', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: '混杂控制与效果归因',
        duration: 75,
        lessons: [
          { id: '7', title: '混杂因素与回归控制', type: 'reading', duration: 20, completed: false },
          { id: '8', title: 'CUPED 方差缩减', type: 'code', duration: 35, completed: false },
          { id: '9', title: '撰写实验报告', type: 'code', duration: 20, completed: false },
        ],
      },
    ],
  },
  '10': {
    id: '10',
    title: '项目10：端到端数据清洗与用户画像报告',
    description: '综合运用所学，从脏数据到完整用户画像，生成可导出的HTML仪表盘报告。学习merge/concat、fillna、聚类、Jinja2模板等技能。',
    category: '综合项目',
    level: 'advanced',
    duration: 12,
    enrolledCount: 320,
    instructor: '郑老师',
    instructorTitle: '数据分析总监',
    rating: 5.0,
    reviewCount: 78,
    skills: ['merge/concat', 'fillna', '特征工程', 'RFM+聚类', 'Jinja2 模板', 'HTML 报告'],
    outcome: '完整清洗报告 + 用户画像仪表盘（可 HTML 导出）',
    chapters: [
      {
        id: '1',
        title: '多表整合与清洗流水线',
        duration: 90,
        lessons: [
          { id: '1', title: '多表整合与数据血缘', type: 'reading', duration: 25, completed: false },
          { id: '2', title: '清洗 ETL 函数封装', type: 'code', duration: 45, completed: false },
          { id: '3', title: '质量检查清单', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '用户画像特征宽表',
        duration: 120,
        lessons: [
          { id: '4', title: '特征工程综合', type: 'reading', duration: 30, completed: false },
          { id: '5', title: 'RFM + 聚类 + 复购特征', type: 'code', duration: 60, completed: false },
          { id: '6', title: '高潜价值用户标签', type: 'code', duration: 30, completed: false },
        ],
      },
      {
        id: '3',
        title: 'HTML 报告生成',
        duration: 90,
        lessons: [
          { id: '7', title: '仪表盘可视化设计', type: 'reading', duration: 25, completed: false },
          { id: '8', title: 'Jinja2 + matplotlib 导出 HTML', type: 'code', duration: 45, completed: false },
          { id: '9', title: '项目总结与持续迭代', type: 'reading', duration: 20, completed: false },
        ],
      },
    ],
  },
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedSection, setExpandedSection] = useState<string | null>('chapters');
  
  const course = projectData[id || '1'] || projectData['1'];

  // 计算总课程时长
  const totalDuration = course.chapters.reduce((sum, chapter) => sum + chapter.duration, 0);

  // 计算学习进度
  const totalLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
  const completedLessons = course.chapters.reduce((sum, chapter) => sum + chapter.lessons.filter(l => l.completed).length, 0);
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // 切换展开/折叠章节
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // 获取课程类型图标
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'code':
        return Code;
      case 'document':
        return FileText;
      case 'assessment':
        return BookOpen;
      default:
        return Play;
    }
  };

  return (
    <div className="space-y-8">
      {/* 项目封面 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(course.title)}%20e-commerce%20data%20analysis%20project&image_size=landscape_16_9`}
              alt={course.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-center mb-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.level === 'beginner' ? 'bg-green-100 text-green-800' : course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {course.level === 'beginner' ? '入门级' : course.level === 'intermediate' ? '进阶级' : '高级'}
              </span>
              <span className="ml-2 text-gray-500 text-sm">{course.category}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <Clock size={18} className="text-blue-600 mr-2" />
                <span>{course.duration} 小时</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={18} className="text-blue-600 mr-2" />
                <span>{course.chapters.length} 章节</span>
              </div>
              <div className="flex items-center">
                <Users size={18} className="text-blue-600 mr-2" />
                <span>{course.enrolledCount} 人已学习</span>
              </div>
              <div className="flex items-center">
                <Star size={18} className="text-yellow-500 mr-2" />
                <span>{course.rating} ({course.reviewCount} 评价)</span>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">核心技能：</h4>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium mb-2">项目产出：</h4>
              <p className="text-gray-600">{course.outcome}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/learn/${course.id}/${course.chapters[0]?.id || '1'}`}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                开始学习
              </Link>
              <Link
                to={`/practice/${course.id}/${course.chapters[0]?.lessons.find(l => l.type === 'code')?.id || '1'}`}
                className="px-6 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                代码练习
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 学习进度 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">学习进度</h2>
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium">已完成 {completedLessons}/{totalLessons} 个学习单元</span>
          <span className="ml-auto text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 项目内容 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div
          className="p-6 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('chapters')}
        >
          <h2 className="text-xl font-semibold">项目内容</h2>
          {expandedSection === 'chapters' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        {expandedSection === 'chapters' && (
          <div className="px-6 pb-6 border-t">
            {course.chapters.map((chapter) => (
              <div key={chapter.id} className="py-4 border-b last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{chapter.title}</h3>
                  <span className="text-gray-500 text-sm">{chapter.duration} 分钟</span>
                </div>
                <div className="ml-4 space-y-2">
                  {chapter.lessons.map((lesson) => {
                    const Icon = getLessonIcon(lesson.type);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/${lesson.type === 'code' ? 'practice' : lesson.type === 'assessment' ? 'assessment' : 'learn'}/${course.id}/${lesson.type === 'code' || lesson.type === 'assessment' ? lesson.id : chapter.id}`}
                        className="flex items-center p-2 rounded-md hover:bg-gray-50 transition"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 讲师信息 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div
          className="p-6 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('instructor')}
        >
          <h2 className="text-xl font-semibold">讲师信息</h2>
          {expandedSection === 'instructor' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        {expandedSection === 'instructor' && (
          <div className="px-6 pb-6 border-t">
            <div className="flex items-center space-x-4">
              <img
                src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20data%20analyst%20portrait&image_size=square`}
                alt={course.instructor}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{course.instructor}</h3>
                <p className="text-gray-600">{course.instructorTitle}</p>
                <p className="mt-2 text-gray-600">
                  {course.instructor}拥有丰富的电商数据分析经验，曾主导多个大型电商平台的数据分析项目。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
