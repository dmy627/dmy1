import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

const Practice: React.FC = () => {
  const { courseId, exerciseId } = useParams<{ courseId: string; exerciseId: string }>();
  const [code, setCode] = useState(`# 第一个Python程序
# 请在下面编写代码，打印出"Hello, Data Analysis!"

# 示例代码：
# print("Hello, World!")

# 你的代码：
`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 练习数据
  const exercise = {
    id: exerciseId || '1',
    title: '第一个Python程序',
    description: '编写一个Python程序，打印出"Hello, Data Analysis!"。这是你的第一个Python程序，通过这个练习你将学会如何使用print函数输出文本。',
    difficulty: 'easy',
    starterCode: `# 第一个Python程序
# 请在下面编写代码，打印出"Hello, Data Analysis!"

# 示例代码：
# print("Hello, World!")

# 你的代码：
`,
    testCases: [`print("Hello, Data Analysis!")`],
    solution: `# 正确的代码
print("Hello, Data Analysis!")`,
  };

  // 课程数据
  const course = {
    id: courseId || '1',
    title: 'Python数据分析入门',
  };

  // 处理代码运行
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('运行中...');
    
    // 模拟代码运行
    setTimeout(() => {
      const expectedOutput = 'Hello, Data Analysis!';
      const userOutput = code.includes('print("Hello, Data Analysis!")') ? expectedOutput : '输出不匹配';
      
      setOutput(userOutput);
      setIsCorrect(userOutput === expectedOutput);
      setIsRunning(false);
    }, 1000);
  };

  // 重置代码
  const handleResetCode = () => {
    setCode(exercise.starterCode);
    setOutput('');
    setIsCorrect(null);
  };

  // 显示解决方案
  const handleShowSolution = () => {
    setCode(exercise.solution);
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
        <span className="text-gray-700 font-medium">代码练习</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧代码编辑器 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 练习标题和描述 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' : exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
              </span>
              <h1 className="text-2xl font-bold ml-3">{exercise.title}</h1>
            </div>
            <p className="text-gray-600">{exercise.description}</p>
          </div>

          {/* 代码编辑器 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm">main.py</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleResetCode}
                  className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  重置
                </button>
                <button
                  onClick={handleShowSolution}
                  className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                >
                  查看答案
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[400px] p-4 font-mono text-sm bg-gray-50 border-t border-gray-200 focus:outline-none"
              spellCheck={false}
            ></textarea>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center px-4 py-2 rounded-lg transition ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <Play size={16} className="mr-2" />
                {isRunning ? '运行中...' : '运行代码'}
              </button>
            </div>
          </div>

          {/* 输出结果 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gray-800 text-white p-3">
              <span>输出结果</span>
            </div>
            <div className="p-4 min-h-[200px] bg-gray-50 border-t font-mono text-sm">
              {output ? (
                <div className={`p-3 rounded ${isCorrect === true ? 'bg-green-100 text-green-800' : isCorrect === false ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {output}
                </div>
              ) : (
                <div className="text-gray-400">运行代码后将显示输出结果</div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧练习导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold">练习信息</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">难度</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' : exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">练习目标</h4>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">提示</h4>
                <p className="text-sm text-gray-600">使用print()函数来输出文本，记得使用双引号包围字符串。</p>
              </div>
              <div className="border-t pt-4">
                <Link
                  to={`/learn/${courseId}/${exerciseId}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span>返回视频学习</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;