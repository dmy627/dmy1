import React from 'react';
import { Link } from 'react-router-dom';
import { Book, BarChart3, Database, Code, TrendingUp, Award } from 'lucide-react';

const Home: React.FC = () => {
  // 课程分类数据
  const categories = [
    { id: 'data-analysis', name: '数据分析基础', icon: Book, color: 'bg-blue-100 text-blue-600' },
    { id: 'business-intelligence', name: '商业智能', icon: BarChart3, color: 'bg-green-100 text-green-600' },
    { id: 'data-visualization', name: '数据可视化', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    { id: 'database', name: '数据库', icon: Database, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'programming', name: '编程基础', icon: Code, color: 'bg-red-100 text-red-600' },
    { id: 'project', name: '项目实战', icon: Award, color: 'bg-indigo-100 text-indigo-600' },
  ];

  // 推荐课程数据
  const courses = [
    {
      id: '1',
      title: 'Python数据分析入门',
      description: '从基础开始学习Python数据分析，掌握NumPy、Pandas等核心库',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover%20with%20charts%20and%20code&image_size=square_hd',
      level: 'beginner',
      duration: 24,
      enrolledCount: 1200,
    },
    {
      id: '2',
      title: '商业数据分析实战',
      description: '通过真实案例学习商业数据分析方法和技巧',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20data%20analysis%20course%20cover%20with%20business%20charts&image_size=square_hd',
      level: 'intermediate',
      duration: 36,
      enrolledCount: 850,
    },
    {
      id: '3',
      title: '数据可视化与Tableau',
      description: '学习使用Tableau创建专业的数据可视化仪表盘',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20course%20cover%20with%20Tableau%20dashboards&image_size=square_hd',
      level: 'intermediate',
      duration: 30,
      enrolledCount: 620,
    },
  ];

  return (
    <div className="space-y-16">
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              掌握数据分析技能，开启职业新篇章
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              专为商务数据分析与应用专业学生设计的在线学习系统，提供完整的课程体系和互动式学习体验
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/courses"
                className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                浏览课程
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition"
              >
                立即注册
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20education%20platform%20hero%20image%20with%20students%20learning%20and%20data%20visualizations&image_size=landscape_16_9"
              alt="数据分析学习平台"
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* 课程分类 */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">课程分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/courses?category=${category.id}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                <category.icon size={24} />
              </div>
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 推荐课程 */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">推荐课程</h2>
          <Link to="/courses" className="text-blue-600 font-semibold hover:underline">
            查看全部
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
          ))}
        </div>
      </section>

      {/* 平台特色 */}
      <section className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-12 text-center">平台特色</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Book size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">完整的课程体系</h3>
            <p className="text-gray-600">从基础到进阶的数据分析课程，覆盖商务数据分析全领域</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">互动式学习</h3>
            <p className="text-gray-600">在线代码编辑器，实时运行，自动评测，提升实践能力</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">学练测评一体</h3>
            <p className="text-gray-600">视频学习、代码练习、在线测评，形成完整学习闭环</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">成就激励系统</h3>
            <p className="text-gray-600">徽章、等级、排行榜，激发学习动力，记录学习成果</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;