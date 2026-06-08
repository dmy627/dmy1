import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');

  // 课程数据 - 10个电商数据分析项目
  const courses = [
    {
      id: '1',
      title: '项目1：电商购物车关联规则挖掘',
      description: '学习购物车分析，使用Apriori算法发现商品关联规则，生成"买了A也买了B"的推荐',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=E-commerce%20shopping%20cart%20analysis%20with%20association%20rules%20and%20product%20recommendations&image_size=square_hd',
      category: 'association',
      level: 'intermediate',
      duration: 8,
      enrolledCount: 680,
    },
    {
      id: '2',
      title: '项目2：用户消费行为RFM分析与价值聚类',
      description: '使用RFM模型分析用户价值，结合KMeans聚类进行用户分群，制定精准营销策略',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Customer%20RFM%20analysis%20and%20value%20clustering%20with%20radar%20chart&image_size=square_hd',
      category: 'clustering',
      level: 'intermediate',
      duration: 10,
      enrolledCount: 750,
    },
    {
      id: '3',
      title: '项目3：异常订单检测',
      description: '学习数据清洗核心技术，使用Z-score和IQR识别异常订单，对比规则与AI检测效果',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Anomaly%20detection%20for%20e-commerce%20orders%20with%20data%20cleaning&image_size=square_hd',
      category: 'data-cleaning',
      level: 'beginner',
      duration: 6,
      enrolledCount: 520,
    },
    {
      id: '4',
      title: '项目4：购物车转化路径漏斗分析',
      description: '分析用户从浏览到支付的转化漏斗，识别流失点，预测用户付款意愿',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Funnel%20analysis%20for%20e-commerce%20conversion%20path%20from%20browse%20to%20payment&image_size=square_hd',
      category: 'funnel',
      level: 'intermediate',
      duration: 7,
      enrolledCount: 590,
    },
    {
      id: '5',
      title: '项目5：商品销售趋势与周期性分析',
      description: '时间序列分析销量趋势，识别季节性，使用Prophet预测未来销量',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sales%20trend%20analysis%20and%20time%20series%20forecasting%20with%20charts&image_size=square_hd',
      category: 'time-series',
      level: 'advanced',
      duration: 9,
      enrolledCount: 480,
    },
    {
      id: '6',
      title: '项目6：用户复购间隔与生命周期聚类',
      description: '分析用户复购行为，构建活跃度衰减模型，识别不同复购模式的用户群组',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Customer%20repurchase%20interval%20and%20lifecycle%20clustering%20analysis&image_size=square_hd',
      category: 'clustering',
      level: 'advanced',
      duration: 8,
      enrolledCount: 410,
    },
    {
      id: '7',
      title: '项目7：文本评论情感与评分不一致分析',
      description: '使用SnowNLP或BERT分析评论情感，识别高分差评和低分好评的矛盾样本',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sentiment%20analysis%20for%20product%20reviews%20with%20word%20cloud&image_size=square_hd',
      category: 'nlp',
      level: 'advanced',
      duration: 10,
      enrolledCount: 350,
    },
    {
      id: '8',
      title: '项目8：购物篮商品组合推荐',
      description: '基于协同过滤和聚类，为购物车自动推荐补充商品，构建个性化推荐系统',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Collaborative%20filtering%20recommendation%20system%20for%20shopping%20cart&image_size=square_hd',
      category: 'recommendation',
      level: 'advanced',
      duration: 9,
      enrolledCount: 420,
    },
    {
      id: '9',
      title: '项目9：促销活动效果分析',
      description: 'A/B测试模拟，使用假设检验评估促销效果，量化活动净提升效应',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A-B%20testing%20and%20promotion%20effect%20analysis%20with%20statistics&image_size=square_hd',
      category: 'ab-test',
      level: 'intermediate',
      duration: 7,
      enrolledCount: 550,
    },
    {
      id: '10',
      title: '项目10：端到端数据清洗与用户画像报告',
      description: '综合运用所学，从脏数据到完整用户画像，生成可导出的HTML报告',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=End-to-end%20data%20pipeline%20and%20customer%20profile%20dashboard&image_size=square_hd',
      category: 'project',
      level: 'advanced',
      duration: 12,
      enrolledCount: 320,
    },
  ];

  // 分类选项
  const categories = [
    { id: 'all', name: '全部项目' },
    { id: 'association', name: '关联规则' },
    { id: 'clustering', name: '聚类分析' },
    { id: 'data-cleaning', name: '数据清洗' },
    { id: 'funnel', name: '漏斗分析' },
    { id: 'time-series', name: '时间序列' },
    { id: 'nlp', name: '自然语言处理' },
    { id: 'recommendation', name: '推荐系统' },
    { id: 'ab-test', name: 'A/B测试' },
    { id: 'project', name: '综合项目' },
  ];

  // 难度级别选项
  const levels = [
    { id: 'all', name: '全部级别' },
    { id: 'beginner', name: '入门级' },
    { id: 'intermediate', name: '进阶级' },
    { id: 'advanced', name: '高级' },
  ];

  // 筛选课程
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      search: searchTerm,
      category: selectedCategory,
      level: selectedLevel,
    });
  };

  // 处理分类和级别变化
  const handleFilterChange = (type: 'category' | 'level', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value);
    } else {
      setSelectedLevel(value);
    }
    setSearchParams({
      search: searchTerm,
      category: type === 'category' ? value : selectedCategory,
      level: type === 'level' ? value : selectedLevel,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">电商数据分析实战项目</h1>
        <p className="text-gray-600">10个真实电商数据分析项目，从入门到精通</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="搜索项目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
              <select
                value={selectedLevel}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="self-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                筛选
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.level === 'beginner' ? 'bg-green-100 text-green-800' : course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {course.level === 'beginner' ? '入门级' : course.level === 'intermediate' ? '进阶级' : '高级'}
                  </span>
                  <span className="ml-auto text-gray-500 text-sm">{course.duration} 小时</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>{course.enrolledCount} 人已学习</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">没有找到匹配的项目</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
