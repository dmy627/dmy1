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
          { id: '1', title: '项目背景与目标', type: 'video', duration: 15, completed: false },
          { id: '2', title: '数据加载与探索', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: 'Apriori算法实现',
        duration: 90,
        lessons: [
          { id: '4', title: '支持度计算', type: 'video', duration: 20, completed: false },
          { id: '5', title: '置信度与提升度', type: 'video', duration: 25, completed: false },
          { id: '6', title: '手动实现关联规则', type: 'code', duration: 45, completed: false },
        ],
      },
      {
        id: '3',
        title: 'mlxtend库应用',
        duration: 75,
        lessons: [
          { id: '7', title: 'mlxtend入门', type: 'video', duration: 20, completed: false },
          { id: '8', title: 'TransactionEncoder使用', type: 'code', duration: 30, completed: false },
          { id: '9', title: '生成关联规则', type: 'code', duration: 25, completed: false },
        ],
      },
      {
        id: '4',
        title: '推荐系统实现',
        duration: 90,
        lessons: [
          { id: '10', title: '推荐词条生成', type: 'video', duration: 20, completed: false },
          { id: '11', title: '构建推荐函数', type: 'code', duration: 45, completed: false },
          { id: '12', title: '项目总结', type: 'video', duration: 25, completed: false },
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
          { id: '1', title: 'RFM理论讲解', type: 'video', duration: 20, completed: false },
          { id: '2', title: '数据准备', type: 'code', duration: 35, completed: false },
          { id: '3', title: '特征计算', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '用户分群实现',
        duration: 90,
        lessons: [
          { id: '4', title: 'KMeans聚类原理', type: 'video', duration: 25, completed: false },
          { id: '5', title: '特征标准化', type: 'code', duration: 30, completed: false },
          { id: '6', title: '聚类模型训练', type: 'code', duration: 35, completed: false },
        ],
      },
      {
        id: '3',
        title: '群体分析与策略',
        duration: 90,
        lessons: [
          { id: '7', title: '群体特征分析', type: 'video', duration: 25, completed: false },
          { id: '8', title: '可视化展示', type: 'code', duration: 40, completed: false },
          { id: '9', title: '营销策略制定', type: 'video', duration: 25, completed: false },
        ],
      },
    ],
  },
  '3': {
    id: '3',
    title: '项目3：异常订单检测',
    description: '学习数据清洗核心技术，使用Z-score和IQR识别异常订单，对比规则与AI检测效果。掌握isnull/dropna/duplicated、条件筛选、clip截断等技能。',
    category: '数据清洗',
    level: 'beginner',
    duration: 6,
    enrolledCount: 520,
    instructor: '王老师',
    instructorTitle: '数据工程师',
    rating: 4.7,
    reviewCount: 124,
    skills: ['isnull/dropna', 'duplicated', '条件筛选', 'clip截断', 'Z-score', 'IQR', 'Isolation Forest'],
    outcome: '清洗前后对比报告 + 异常原因分类统计',
    chapters: [
      {
        id: '1',
        title: '数据质量检查',
        duration: 60,
        lessons: [
          { id: '1', title: '常见数据问题', type: 'video', duration: 20, completed: false },
          { id: '2', title: '缺失值处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '重复值处理', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '规则检测方法',
        duration: 75,
        lessons: [
          { id: '4', title: 'Z-score原理', type: 'video', duration: 20, completed: false },
          { id: '5', title: 'IQR方法实现', type: 'code', duration: 35, completed: false },
          { id: '6', title: '业务规则校验', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: 'AI检测对比',
        duration: 75,
        lessons: [
          { id: '7', title: 'Isolation Forest', type: 'video', duration: 25, completed: false },
          { id: '8', title: '模型训练与对比', type: 'code', duration: 35, completed: false },
          { id: '9', title: '报告生成', type: 'code', duration: 15, completed: false },
        ],
      },
    ],
  },
  '4': {
    id: '4',
    title: '项目4：购物车转化路径漏斗分析',
    description: '分析用户从浏览到支付的转化漏斗，识别流失点，预测用户付款意愿。学习groupby聚合、shift/lag计算、布尔索引等技能。',
    category: '漏斗分析',
    level: 'intermediate',
    duration: 7,
    enrolledCount: 590,
    instructor: '陈老师',
    instructorTitle: '产品数据分析师',
    rating: 4.8,
    reviewCount: 167,
    skills: ['groupby', 'shift/lag', '布尔索引', '漏斗转化率', '流失分析'],
    outcome: '漏斗图（plotly） + 流失用户的主要特征画像',
    chapters: [
      {
        id: '1',
        title: '用户行为分析',
        duration: 60,
        lessons: [
          { id: '1', title: '漏斗分析概念', type: 'video', duration: 20, completed: false },
          { id: '2', title: '行为数据预处理', type: 'code', duration: 25, completed: false },
          { id: '3', title: '用户路径构建', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '漏斗分析实现',
        duration: 75,
        lessons: [
          { id: '4', title: '转化率计算', type: 'video', duration: 20, completed: false },
          { id: '5', title: '漏斗可视化', type: 'code', duration: 35, completed: false },
          { id: '6', title: '流失点识别', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: '付款预测模型',
        duration: 75,
        lessons: [
          { id: '7', title: '特征工程', type: 'video', duration: 25, completed: false },
          { id: '8', title: '分类模型训练', type: 'code', duration: 35, completed: false },
          { id: '9', title: '用户画像分析', type: 'code', duration: 15, completed: false },
        ],
      },
    ],
  },
  '5': {
    id: '5',
    title: '项目5：商品销售趋势与周期性分析',
    description: '时间序列分析销量趋势，识别季节性，使用Prophet预测未来销量。学习to_datetime、resample、rolling等技能。',
    category: '时间序列',
    level: 'advanced',
    duration: 9,
    enrolledCount: 480,
    instructor: '刘老师',
    instructorTitle: '时间序列专家',
    rating: 4.9,
    reviewCount: 132,
    skills: ['to_datetime', 'resample', 'rolling', '时间序列分解', 'Prophet', '同比环比'],
    outcome: '销量趋势曲线 + 旺季/淡季标注表',
    chapters: [
      {
        id: '1',
        title: '时间序列基础',
        duration: 75,
        lessons: [
          { id: '1', title: '时间序列概念', type: 'video', duration: 25, completed: false },
          { id: '2', title: '时间索引处理', type: 'code', duration: 30, completed: false },
          { id: '3', title: '重采样与滚动窗口', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '趋势与季节性分析',
        duration: 90,
        lessons: [
          { id: '4', title: '时间序列分解', type: 'video', duration: 25, completed: false },
          { id: '5', title: '趋势识别', type: 'code', duration: 35, completed: false },
          { id: '6', title: '季节性分析', type: 'code', duration: 30, completed: false },
        ],
      },
      {
        id: '3',
        title: '销量预测',
        duration: 90,
        lessons: [
          { id: '7', title: 'Prophet入门', type: 'video', duration: 25, completed: false },
          { id: '8', title: '模型训练与预测', type: 'code', duration: 40, completed: false },
          { id: '9', title: '结果可视化', type: 'code', duration: 25, completed: false },
        ],
      },
    ],
  },
  '6': {
    id: '6',
    title: '项目6：用户复购间隔与生命周期聚类',
    description: '分析用户复购行为，构建活跃度衰减模型，识别不同复购模式的用户群组。学习groupby+shift、expanding统计等技能。',
    category: '聚类分析',
    level: 'advanced',
    duration: 8,
    enrolledCount: 410,
    instructor: '赵老师',
    instructorTitle: '用户运营专家',
    rating: 4.7,
    reviewCount: 98,
    skills: ['groupby+shift', 'expanding', '复购分析', '生命周期', '活跃度模型'],
    outcome: '不同复购模式的用户群组（如每月一次、季度回购、一次性）',
    chapters: [
      {
        id: '1',
        title: '复购行为分析',
        duration: 60,
        lessons: [
          { id: '1', title: '复购指标定义', type: 'video', duration: 20, completed: false },
          { id: '2', title: '复购间隔计算', type: 'code', duration: 25, completed: false },
          { id: '3', title: '购买频次统计', type: 'code', duration: 15, completed: false },
        ],
      },
      {
        id: '2',
        title: '生命周期建模',
        duration: 75,
        lessons: [
          { id: '4', title: '活跃度衰减模型', type: 'video', duration: 20, completed: false },
          { id: '5', title: '特征构建', type: 'code', duration: 35, completed: false },
          { id: '6', title: '用户分群', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: '复购模式识别',
        duration: 75,
        lessons: [
          { id: '7', title: '聚类分析', type: 'video', duration: 20, completed: false },
          { id: '8', title: '群组画像', type: 'code', duration: 35, completed: false },
          { id: '9', title: '运营策略建议', type: 'video', duration: 20, completed: false },
        ],
      },
    ],
  },
  '7': {
    id: '7',
    title: '项目7：文本评论情感与评分不一致分析',
    description: '使用SnowNLP或BERT分析评论情感，识别高分差评和低分好评的矛盾样本。学习str.contains/extract、apply自定义情感得分、cut分箱等技能。',
    category: '自然语言处理',
    level: 'advanced',
    duration: 10,
    enrolledCount: 350,
    instructor: '孙老师',
    instructorTitle: 'NLP算法工程师',
    rating: 4.9,
    reviewCount: 89,
    skills: ['str.contains', 'str.extract', 'SnowNLP', 'BERT', '情感分析', 'cut分箱'],
    outcome: '不一致样本列表 + 词云突出常见矛盾原因',
    chapters: [
      {
        id: '1',
        title: '文本分析基础',
        duration: 75,
        lessons: [
          { id: '1', title: '文本处理入门', type: 'video', duration: 20, completed: false },
          { id: '2', title: 'pandas字符串操作', type: 'code', duration: 35, completed: false },
          { id: '3', title: '文本数据预处理', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '情感分析实现',
        duration: 90,
        lessons: [
          { id: '4', title: 'SnowNLP使用', type: 'video', duration: 20, completed: false },
          { id: '5', title: '情感得分计算', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'BERT进阶应用', type: 'video', duration: 30, completed: false },
        ],
      },
      {
        id: '3',
        title: '不一致分析',
        duration: 90,
        lessons: [
          { id: '7', title: '矛盾样本识别', type: 'video', duration: 20, completed: false },
          { id: '8', title: '词云可视化', type: 'code', duration: 45, completed: false },
          { id: '9', title: '分析报告', type: 'code', duration: 25, completed: false },
        ],
      },
    ],
  },
  '8': {
    id: '8',
    title: '项目8：购物篮商品组合推荐',
    description: '基于协同过滤和聚类，为购物车自动推荐补充商品，构建个性化推荐系统。学习pivot_table矩阵、fillna、dot点积相似度等技能。',
    category: '推荐系统',
    level: 'advanced',
    duration: 9,
    enrolledCount: 420,
    instructor: '周老师',
    instructorTitle: '推荐系统工程师',
    rating: 4.8,
    reviewCount: 112,
    skills: ['pivot_table', 'fillna', 'dot点积', '余弦相似度', '协同过滤', 'KNN'],
    outcome: '每个商品的最相似Top 5商品列表',
    chapters: [
      {
        id: '1',
        title: '推荐系统基础',
        duration: 75,
        lessons: [
          { id: '1', title: '推荐系统概述', type: 'video', duration: 25, completed: false },
          { id: '2', title: '用户商品矩阵构建', type: 'code', duration: 30, completed: false },
          { id: '3', title: '数据预处理', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '协同过滤实现',
        duration: 90,
        lessons: [
          { id: '4', title: '基于物品的协同过滤', type: 'video', duration: 25, completed: false },
          { id: '5', title: '余弦相似度计算', type: 'code', duration: 40, completed: false },
          { id: '6', title: 'KNN最近邻', type: 'code', duration: 25, completed: false },
        ],
      },
      {
        id: '3',
        title: '推荐系统集成',
        duration: 90,
        lessons: [
          { id: '7', title: '购物车推荐逻辑', type: 'video', duration: 20, completed: false },
          { id: '8', title: '推荐API实现', type: 'code', duration: 45, completed: false },
          { id: '9', title: '效果评估', type: 'code', duration: 25, completed: false },
        ],
      },
    ],
  },
  '9': {
    id: '9',
    title: '项目9：促销活动效果分析',
    description: 'A/B测试模拟，使用假设检验评估促销效果，量化活动净提升效应。学习merge关联、groupby汇总、apply标准化等技能。',
    category: 'A/B测试',
    level: 'intermediate',
    duration: 7,
    enrolledCount: 550,
    instructor: '吴老师',
    instructorTitle: '数据科学家',
    rating: 4.7,
    reviewCount: 145,
    skills: ['merge', 'groupby', 'apply标准化', 't检验', '卡方检验', '提升度'],
    outcome: '活动净提升效应报告（含显著性结论）',
    chapters: [
      {
        id: '1',
        title: 'A/B测试基础',
        duration: 60,
        lessons: [
          { id: '1', title: 'A/B测试理论', type: 'video', duration: 20, completed: false },
          { id: '2', title: '实验设计', type: 'video', duration: 20, completed: false },
          { id: '3', title: '数据准备', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '统计检验',
        duration: 75,
        lessons: [
          { id: '4', title: '假设检验原理', type: 'video', duration: 25, completed: false },
          { id: '5', title: 't检验实现', type: 'code', duration: 30, completed: false },
          { id: '6', title: '卡方检验', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '3',
        title: '效果分析',
        duration: 75,
        lessons: [
          { id: '7', title: '混杂因素控制', type: 'video', duration: 20, completed: false },
          { id: '8', title: '线性回归调整', type: 'code', duration: 35, completed: false },
          { id: '9', title: '报告生成', type: 'code', duration: 20, completed: false },
        ],
      },
    ],
  },
  '10': {
    id: '10',
    title: '项目10：端到端数据清洗与用户画像报告',
    description: '综合运用所学，从脏数据到完整用户画像，生成可导出的HTML报告。学习merge/concat、fillna/interpolate、rename、drop、query等技能。',
    category: '综合项目',
    level: 'advanced',
    duration: 12,
    enrolledCount: 320,
    instructor: '郑老师',
    instructorTitle: '数据分析总监',
    rating: 5.0,
    reviewCount: 78,
    skills: ['merge/concat', 'fillna/interpolate', 'rename', 'drop', 'query', '决策树', 'HTML报告'],
    outcome: '完整的数据清洗报告 + 用户画像仪表盘（可html导出）',
    chapters: [
      {
        id: '1',
        title: '数据整合',
        duration: 90,
        lessons: [
          { id: '1', title: '多表数据合并', type: 'video', duration: 25, completed: false },
          { id: '2', title: '数据清洗流水线', type: 'code', duration: 45, completed: false },
          { id: '3', title: '质量检查', type: 'code', duration: 20, completed: false },
        ],
      },
      {
        id: '2',
        title: '用户画像构建',
        duration: 120,
        lessons: [
          { id: '4', title: '特征工程综合', type: 'video', duration: 30, completed: false },
          { id: '5', title: 'RFM+聚类+关联', type: 'code', duration: 60, completed: false },
          { id: '6', title: '高潜价值标签', type: 'code', duration: 30, completed: false },
        ],
      },
      {
        id: '3',
        title: '报告生成',
        duration: 90,
        lessons: [
          { id: '7', title: '可视化仪表盘', type: 'video', duration: 25, completed: false },
          { id: '8', title: 'HTML报告导出', type: 'code', duration: 45, completed: false },
          { id: '9', title: '项目总结与展望', type: 'video', duration: 20, completed: false },
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
