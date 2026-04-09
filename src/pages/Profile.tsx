import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Award, User, Settings, ChevronDown, ChevronRight, CheckCircle, Star } from 'lucide-react';

const Profile: React.FC = () => {
  const { tab = 'progress' } = useParams<{ tab: string }>();
  const [expandedSection, setExpandedSection] = useState<string | null>(tab);

  // 用户数据
  const user = {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=User%20avatar%20portrait&image_size=square',
    level: 3,
    experience: 1250,
    totalCourses: 5,
    completedCourses: 2,
    totalAssessments: 3,
    passedAssessments: 2,
  };

  // 学习进度数据
  const learningProgress = [
    {
      id: '1',
      courseId: '1',
      courseTitle: 'Python数据分析入门',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20course%20cover&image_size=square',
      progress: 75,
      completed: false,
      lastAccessed: '2026-04-08',
    },
    {
      id: '2',
      courseId: '2',
      courseTitle: '商业数据分析实战',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20data%20analysis%20course%20cover&image_size=square',
      progress: 100,
      completed: true,
      lastAccessed: '2026-04-05',
    },
    {
      id: '3',
      courseId: '3',
      courseTitle: '数据可视化与Tableau',
      coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20course%20cover&image_size=square',
      progress: 40,
      completed: false,
      lastAccessed: '2026-04-01',
    },
  ];

  // 成就数据
  const achievements = [
    {
      id: '1',
      name: '初学者',
      description: '完成第一个课程',
      icon: '🎯',
      rarity: 'common',
      unlockedAt: '2026-03-15',
    },
    {
      id: '2',
      name: '代码高手',
      description: '完成10个代码练习',
      icon: '💻',
      rarity: 'uncommon',
      unlockedAt: '2026-03-20',
    },
    {
      id: '3',
      name: '测评达人',
      description: '通过5个测评',
      icon: '🏆',
      rarity: 'rare',
      unlockedAt: '2026-03-25',
    },
    {
      id: '4',
      name: '学习先锋',
      description: '连续学习7天',
      icon: '🔥',
      rarity: 'epic',
      unlockedAt: '2026-03-30',
    },
  ];

  // 切换展开/折叠章节
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 font-semibold rounded-full">
                等级 {user.level}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500">学习课程</span>
                <p className="font-semibold">{user.completedCourses}/{user.totalCourses}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">通过测评</span>
                <p className="font-semibold">{user.passedAssessments}/{user.totalAssessments}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">经验值</span>
                <p className="font-semibold">{user.experience}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(user.experience % 1000) / 10}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              距离下一级还需 {1000 - (user.experience % 1000)} 经验值
            </p>
          </div>
        </div>
      </div>

      {/* 导航标签 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => toggleSection('progress')}
            className={`flex-1 py-4 px-6 text-center transition ${expandedSection === 'progress' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          >
            学习进度
          </button>
          <button
            onClick={() => toggleSection('achievements')}
            className={`flex-1 py-4 px-6 text-center transition ${expandedSection === 'achievements' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          >
            成就系统
          </button>
          <button
            onClick={() => toggleSection('settings')}
            className={`flex-1 py-4 px-6 text-center transition ${expandedSection === 'settings' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          >
            个人设置
          </button>
        </div>

        {/* 学习进度内容 */}
        {expandedSection === 'progress' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">我的学习进度</h2>
            <div className="space-y-6">
              {learningProgress.map((course) => (
                <div key={course.id} className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4">
                      <img
                        src={course.coverImage}
                        alt={course.courseTitle}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <div className="md:w-3/4 p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{course.courseTitle}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${course.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {course.completed ? '已完成' : '进行中'}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500">进度：</span>
                        <span className="ml-2 font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">最后学习：{course.lastAccessed}</span>
                        <Link
                          to={`/courses/${course.courseId}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          继续学习
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 成就系统内容 */}
        {expandedSection === 'achievements' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">我的成就</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 ${achievement.rarity === 'common' ? 'border-gray-200' : achievement.rarity === 'uncommon' ? 'border-green-200' : achievement.rarity === 'rare' ? 'border-purple-200' : 'border-yellow-200'}`}
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${achievement.rarity === 'common' ? 'bg-gray-100 text-gray-800' : achievement.rarity === 'uncommon' ? 'bg-green-100 text-green-800' : achievement.rarity === 'rare' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {achievement.rarity === 'common' ? '普通' : achievement.rarity === 'uncommon' ? '优秀' : achievement.rarity === 'rare' ? '稀有' : '史诗'}
                    </span>
                    <span className="text-xs text-gray-500">{achievement.unlockedAt}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="font-semibold mb-4">成就统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{achievements.length}</p>
                  <p className="text-sm text-gray-600">已解锁成就</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{achievements.filter(a => a.rarity === 'common').length}</p>
                  <p className="text-sm text-gray-600">普通成就</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.rarity === 'rare' || a.rarity === 'epic').length}</p>
                  <p className="text-sm text-gray-600">稀有成就</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{user.level}</p>
                  <p className="text-sm text-gray-600">当前等级</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 个人设置内容 */}
        {expandedSection === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">个人设置</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={user.name}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  placeholder="输入新密码"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  placeholder="确认新密码"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">头像</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input type="file" className="text-sm text-gray-500" />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  保存设置
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;