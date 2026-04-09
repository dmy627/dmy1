import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronLeft, Clock } from 'lucide-react';

const Assessment: React.FC = () => {
  const { courseId, assessmentId } = useParams<{ courseId: string; assessmentId: string }>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30分钟
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  // 测评数据
  const assessment = {
    id: assessmentId || '1',
    title: 'Python基础测评',
    description: '本测评包含10道题目，测试你对Python基础知识的掌握程度。请在30分钟内完成所有题目。',
    duration: 30, // 30分钟
    passingScore: 70,
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        content: 'Python中，以下哪种数据类型是不可变的？',
        options: ['列表', '字典', '元组', '集合'],
        correctAnswer: '元组',
        points: 10,
      },
      {
        id: '2',
        type: 'true-false',
        content: 'Python是一种编译型语言。',
        options: ['正确', '错误'],
        correctAnswer: '错误',
        points: 10,
      },
      {
        id: '3',
        type: 'multiple-choice',
        content: '以下哪个不是Python的内置数据类型？',
        options: ['int', 'float', 'string', 'char'],
        correctAnswer: 'char',
        points: 10,
      },
      {
        id: '4',
        type: 'true-false',
        content: 'Python使用缩进来表示代码块。',
        options: ['正确', '错误'],
        correctAnswer: '正确',
        points: 10,
      },
      {
        id: '5',
        type: 'multiple-choice',
        content: '以下哪个函数用于获取用户输入？',
        options: ['input()', 'get()', 'read()', 'scan()'],
        correctAnswer: 'input()',
        points: 10,
      },
      {
        id: '6',
        type: 'true-false',
        content: 'Python中的列表是通过索引访问的，索引从1开始。',
        options: ['正确', '错误'],
        correctAnswer: '错误',
        points: 10,
      },
      {
        id: '7',
        type: 'multiple-choice',
        content: '以下哪个关键字用于定义函数？',
        options: ['func', 'def', 'function', 'define'],
        correctAnswer: 'def',
        points: 10,
      },
      {
        id: '8',
        type: 'true-false',
        content: 'Python支持面向对象编程。',
        options: ['正确', '错误'],
        correctAnswer: '正确',
        points: 10,
      },
      {
        id: '9',
        type: 'multiple-choice',
        content: '以下哪个运算符用于字符串连接？',
        options: ['+', '&', '.', 'concat()'],
        correctAnswer: '+',
        points: 10,
      },
      {
        id: '10',
        type: 'true-false',
        content: 'Python中的注释使用//开头。',
        options: ['正确', '错误'],
        correctAnswer: '错误',
        points: 10,
      },
    ],
  };

  // 课程数据
  const course = {
    id: courseId || '1',
    title: 'Python数据分析入门',
  };

  // 倒计时
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  // 处理答案选择
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // 处理提交
  const handleSubmit = () => {
    let totalScore = 0;
    assessment.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    setScore(totalScore);
    setPassed(totalScore >= assessment.passingScore);
    setIsSubmitted(true);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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
        <span className="text-gray-700 font-medium">在线测评</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧测评内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 测评标题和描述 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{assessment.title}</h1>
              <div className="flex items-center text-yellow-600">
                <Clock size={18} className="mr-1" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{assessment.description}</p>
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-sm font-medium text-gray-500">题目数量：</span>
                <span>{assessment.questions.length} 道</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">满分：</span>
                <span>{assessment.questions.reduce((sum, q) => sum + q.points, 0)} 分</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">及格分数：</span>
                <span>{assessment.passingScore} 分</span>
              </div>
            </div>
          </div>

          {/* 测评结果 */}
          {isSubmitted && (
            <div className={`bg-white rounded-lg shadow-sm p-6 ${passed ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
              <h2 className="text-xl font-bold mb-4">测评结果</h2>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {passed ? <CheckCircle size={24} /> : <XCircle size={24} />}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {passed ? '测评通过！' : '测评未通过'}
                  </h3>
                  <p className="text-gray-600">
                    得分：{score}/{assessment.questions.reduce((sum, q) => sum + q.points, 0)} 分
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {passed 
                  ? '恭喜你通过了本次测评！你已经掌握了Python的基础知识，可以继续学习更高级的内容。' 
                  : '很遗憾，你没有通过本次测评。请复习相关知识后再次尝试。'}
              </p>
              <div className="flex space-x-4">
                <Link
                  to={`/courses/${courseId}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  返回课程
                </Link>
                <button
                  onClick={() => {
                    setAnswers({});
                    setIsSubmitted(false);
                    setTimeLeft(assessment.duration * 60);
                  }}
                  className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  重新测评
                </button>
              </div>
            </div>
          )}

          {/* 题目列表 */}
          {!isSubmitted && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">题目</h2>
              <div className="space-y-8">
                {assessment.questions.map((question, index) => (
                  <div key={question.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">{question.content}</h3>
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`q${question.id}_${optionIndex}`}
                                name={`q${question.id}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={() => handleAnswerChange(question.id, option)}
                                className="mr-2"
                              />
                              <label htmlFor={`q${question.id}_${optionIndex}`} className="cursor-pointer">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  提交答案
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 右侧测评导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold">测评信息</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">时间限制</h4>
                <div className="flex items-center text-yellow-600 font-medium">
                  <Clock size={16} className="mr-1" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">题目数量</h4>
                <span>{assessment.questions.length} 道</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">满分</h4>
                <span>{assessment.questions.reduce((sum, q) => sum + q.points, 0)} 分</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">及格分数</h4>
                <span>{assessment.passingScore} 分</span>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">题目导航</h4>
                <div className="grid grid-cols-5 gap-2">
                  {assessment.questions.map((question, index) => (
                    <button
                      key={question.id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${answers[question.id] ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <Link
                  to={`/courses/${courseId}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span>返回课程</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;