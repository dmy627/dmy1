import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Fullscreen, BookOpen, Code, CheckCircle, ChevronLeft } from 'lucide-react';

const Learn: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5分钟示例
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notes, setNotes] = useState('');

  // 课程和章节数据
  const course = {
    id: courseId || '1',
    title: 'Python数据分析入门',
  };

  const chapter = {
    id: chapterId || '1',
    title: '课程介绍与环境搭建',
    content: `# 课程介绍与环境搭建

## 课程目标
本课程旨在帮助商务数据分析专业的学生掌握Python数据分析的基础知识和技能，包括：

- Python环境搭建
- 基本语法和数据类型
- NumPy和Pandas库的使用
- 数据可视化基础
- 数据分析实战案例

## 环境搭建步骤
1. 下载并安装Python最新版本
2. 安装pip包管理器
3. 安装必要的库：NumPy、Pandas、Matplotlib、Seaborn
4. 配置开发环境（VS Code或Jupyter Notebook）

## 学习建议
- 跟随视频教程完成每个章节的练习
- 尝试修改代码，观察结果变化
- 完成章节后的测评，检验学习成果
- 参与讨论区，与其他同学交流学习心得`,
    videoUrl: 'https://example.com/video.mp4', // 示例视频URL
    lessons: [
      { id: '1', title: '课程介绍', type: 'video', duration: 15, completed: false },
      { id: '2', title: 'Python环境搭建', type: 'video', duration: 25, completed: false },
      { id: '3', title: '第一个Python程序', type: 'code', duration: 20, completed: false },
    ],
  };

  // 处理播放/暂停
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 处理全屏
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 处理进度条变化
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">首页</Link>
        <ChevronLeft size={16} />
        <Link to="/courses" className="hover:text-blue-600">课程中心</Link>
        <ChevronLeft size={16} />
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600">{course.title}</Link>
        <ChevronLeft size={16} />
        <span className="text-gray-700 font-medium">{chapter.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧视频播放区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 视频播放器 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
              <div className="aspect-video bg-gray-900 relative">
                {/* 视频占位符 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20tutorial%20video%20placeholder&image_size=landscape_16_9"
                    alt="视频教程"
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition"
                    onClick={togglePlay}
                  >
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </div>
                  </button>
                </div>
                
                {/* 视频控制栏 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white text-sm">{formatTime(currentTime)}</span>
                    <div className="flex items-center space-x-4">
                      <button className="text-white hover:text-gray-300">
                        <SkipBack size={20} />
                      </button>
                      <button className="text-white hover:text-gray-300" onClick={togglePlay}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <SkipForward size={20} />
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <Volume2 size={20} />
                      </button>
                      <button className="text-white hover:text-gray-300" onClick={toggleFullscreen}>
                        <Fullscreen size={20} />
                      </button>
                    </div>
                    <span className="text-white text-sm">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 章节内容 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
            <div className="prose max-w-none">
              {chapter.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('# ', '')}</h3>;
                } else if (paragraph.startsWith('## ')) {
                  return <h4 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace('## ', '')}</h4>;
                } else if (paragraph.startsWith('- ')) {
                  return <ul key={index} className="list-disc pl-5 space-y-1">
                    {paragraph.split('- ').filter(p => p).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>;
                } else {
                  return <p key={index} className="mb-3">{paragraph}</p>;
                }
              })}
            </div>
          </div>

          {/* 笔记功能 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">学习笔记</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="在这里记录你的学习笔记..."
              className="w-full border border-gray-300 rounded-lg p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                保存笔记
              </button>
            </div>
          </div>
        </div>

        {/* 右侧章节导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold">章节内容</h3>
            </div>
            <div className="p-4 space-y-2">
              {chapter.lessons.map((lesson) => {
                const isActive = lesson.type === 'video'; // 假设当前是视频学习
                return (
                  <Link
                    key={lesson.id}
                    to={`/${lesson.type === 'code' ? 'practice' : lesson.type === 'assessment' ? 'assessment' : 'learn'}/${courseId}/${lesson.type === 'code' || lesson.type === 'assessment' ? lesson.id : chapterId}`}
                    className={`flex items-center p-3 rounded-md transition ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {lesson.completed ? <CheckCircle size={16} /> : lesson.type === 'video' ? <Play size={16} /> : lesson.type === 'code' ? <Code size={16} /> : <BookOpen size={16} />}
                    </div>
                    <span className="flex-grow">{lesson.title}</span>
                    <span className="text-gray-500 text-sm">{lesson.duration} 分钟</span>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t">
              <Link
                to={`/practice/${courseId}/${chapter.lessons.find(l => l.type === 'code')?.id}`}
                className="block w-full py-2 bg-blue-600 text-white font-semibold rounded-lg text-center hover:bg-blue-700 transition"
              >
                进入代码练习
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;