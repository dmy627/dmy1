import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, BookOpen, Code, FileText, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedSection, setExpandedSection] = useState<string | null>('chapters');

  // 课程详情数据
  const course = {
    id: id || '1',
    title: 'Python数据分析入门',
    description: '从基础开始学习Python数据分析，掌握NumPy、Pandas等核心库。本课程适合商务数据分析专业的学生，通过理论学习和实践练习，帮助学生建立数据分析的基本思维和技能。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover%20with%20charts%20and%20code&image_size=landscape_16_9',
    category: '数据分析基础',
    level: 'beginner',
    duration: 24,
    enrolledCount: 1200,
    instructor: '张教授',
    instructorTitle: '数据分析专家',
    instructorAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20instructor%20avatar&image_size=square',
    rating: 4.8,
    reviewCount: 245,
  };

  // 章节数据
  const chapters = [
    {
      id: '1',
      title: '课程介绍与环境搭建',
      duration: 60,
      lessons: [
        { id: '1', title: '课程介绍', type: 'video', duration: 15, completed: false },
        { id: '2', title: 'Python环境搭建', type: 'video', duration: 25, completed: false },
        { id: '3', title: '第一个Python程序', type: 'code', duration: 20, completed: false },
      ],
    },
    {
      id: '2',
      title: 'NumPy基础',
      duration: 120,
      lessons: [
        { id: '4', title: 'NumPy简介', type: 'video', duration: 20, completed: false },
        { id: '5', title: '数组创建与操作', type: 'video', duration: 30, completed: false },
        { id: '6', title: 'NumPy练习', type: 'code', duration: 40, completed: false },
        { id: '7', title: 'NumPy文档阅读', type: 'document', duration: 30, completed: false },
      ],
    },
    {
      id: '3',
      title: 'Pandas基础',
      duration: 180,
      lessons: [
        { id: '8', title: 'Pandas简介', type: 'video', duration: 20, completed: false },
        { id: '9', title: 'Series与DataFrame', type: 'video', duration: 40, completed: false },
        { id: '10', title: '数据读取与处理', type: 'video', duration: 40, completed: false },
        { id: '11', title: 'Pandas练习', type: 'code', duration: 60, completed: false },
        { id: '12', title: 'Pandas文档阅读', type: 'document', duration: 20, completed: false },
      ],
    },
    {
      id: '4',
      title: '数据可视化',
      duration: 120,
      lessons: [
        { id: '13', title: 'Matplotlib简介', type: 'video', duration: 25, completed: false },
        { id: '14', title: '基本图表绘制', type: 'video', duration: 35, completed: false },
        { id: '15', title: 'Seaborn库介绍', type: 'video', duration: 20, completed: false },
        { id: '16', title: '数据可视化练习', type: 'code', duration: 40, completed: false },
      ],
    },
    {
      id: '5',
      title: '课程测评',
      duration: 90,
      lessons: [
        { id: '17', title: '综合练习', type: 'code', duration: 60, completed: false },
        { id: '18', title: '课程测评', type: 'assessment', duration: 30, completed: false },
      ],
    },
  ];

  // 计算总课程时长
  const totalDuration = chapters.reduce((sum, chapter) => sum + chapter.duration, 0);

  // 计算学习进度
  const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);
  const completedLessons = chapters.reduce((sum, chapter) => sum + chapter.lessons.filter(l => l.completed).length, 0);
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
      {/* 课程封面 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-center mb-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.level === 'beginner' ? 'bg-green-100 text-green-800' : course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {course.level === 'beginner' ? '初级' : course.level === 'intermediate' ? '中级' : '高级'}
              </span>
              <span className="ml-2 text-gray-500 text-sm">{course.category}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Play size={18} className="text-blue-600 mr-2" />
                <span>{totalDuration} 分钟</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={18} className="text-blue-600 mr-2" />
                <span>{chapters.length} 章节</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={18} className="text-blue-600 mr-2" />
                <span>{course.enrolledCount} 人已学习</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-yellow-500">{course.rating}</span>
                <span className="ml-1 text-gray-500">({course.reviewCount} 评价)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to={`/learn/${course.id}/${chapters[0].id}`}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                开始学习
              </Link>
              <Link
                to={`/practice/${course.id}/${chapters[0].lessons.find(l => l.type === 'code')?.id}`}
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
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 课程内容 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div
          className="p-6 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('chapters')}
        >
          <h2 className="text-xl font-semibold">课程内容</h2>
          {expandedSection === 'chapters' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        {expandedSection === 'chapters' && (
          <div className="px-6 pb-6 border-t">
            {chapters.map((chapter) => (
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
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{course.instructor}</h3>
                <p className="text-gray-600">{course.instructorTitle}</p>
                <p className="mt-2 text-gray-600">
                  张教授拥有10年数据分析教学经验，曾在多家知名企业担任数据分析顾问，专注于Python数据分析和商业智能领域。
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