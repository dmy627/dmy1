import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');

  // 课程数据
  const courses = [
    {
      id: '1',
      title: 'Python数据分析入门',
      description: '从基础开始学习Python数据分析，掌握NumPy、Pandas等核心库',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover%20with%20charts%20and%20code&image_size=square_hd',
      category: 'data-analysis',
      level: 'beginner',
      duration: 24,
      enrolledCount: 1200,
    },
    {
      id: '2',
      title: '商业数据分析实战',
      description: '通过真实案例学习商业数据分析方法和技巧',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20data%20analysis%20course%20cover%20with%20business%20charts&image_size=square_hd',
      category: 'business-intelligence',
      level: 'intermediate',
      duration: 36,
      enrolledCount: 850,
    },
    {
      id: '3',
      title: '数据可视化与Tableau',
      description: '学习使用Tableau创建专业的数据可视化仪表盘',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20course%20cover%20with%20Tableau%20dashboards&image_size=square_hd',
      category: 'data-visualization',
      level: 'intermediate',
      duration: 30,
      enrolledCount: 620,
    },
    {
      id: '4',
      title: 'SQL数据库基础',
      description: '学习SQL语言基础，掌握数据库查询和管理技能',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=SQL%20database%20course%20cover%20with%20database%20schemas&image_size=square_hd',
      category: 'database',
      level: 'beginner',
      duration: 18,
      enrolledCount: 980,
    },
    {
      id: '5',
      title: 'Python编程基础',
      description: '从零开始学习Python编程，掌握基本语法和编程思维',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20course%20cover%20with%20code&image_size=square_hd',
      category: 'programming',
      level: 'beginner',
      duration: 20,
      enrolledCount: 1500,
    },
    {
      id: '6',
      title: '电商数据分析项目',
      description: '通过真实电商数据，学习数据分析全流程和实战技巧',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=E-commerce%20data%20analysis%20project%20cover&image_size=square_hd',
      category: 'project',
      level: 'advanced',
      duration: 40,
      enrolledCount: 450,
    },
  ];

  // 分类选项
  const categories = [
    { id: 'all', name: '全部分类' },
    { id: 'data-analysis', name: '数据分析基础' },
    { id: 'business-intelligence', name: '商业智能' },
    { id: 'data-visualization', name: '数据可视化' },
    { id: 'database', name: '数据库' },
    { id: 'programming', name: '编程基础' },
    { id: 'project', name: '项目实战' },
  ];

  // 难度级别选项
  const levels = [
    { id: 'all', name: '全部级别' },
    { id: 'beginner', name: '初级' },
    { id: 'intermediate', name: '中级' },
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
        <h1 className="text-3xl font-bold mb-2">课程中心</h1>
        <p className="text-gray-600">浏览我们的数据分析课程，找到适合您的学习内容</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="搜索课程..."
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

      {/* 课程列表 */}
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
                    {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
                  </span>
                  <span className="ml-auto text-gray-500 text-sm">{course.duration} 小时</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>{course.enrolledCount} 人已学习</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">没有找到匹配的课程</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;