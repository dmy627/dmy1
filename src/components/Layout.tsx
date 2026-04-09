import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, User, LogIn, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/courses', icon: BookOpen, label: '课程中心' },
    { path: '/profile', icon: User, label: '个人中心' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            数据分析学习平台
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <LogIn size={18} />
              <span>登录</span>
            </Link>
          </nav>
          
          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* 移动端导航 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-3 rounded-md ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/login"
                className="flex items-center space-x-2 px-3 py-3 rounded-md bg-blue-600 text-white mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>登录</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">数据分析学习平台</h3>
              <p className="text-gray-400">专为商务数据分析与应用专业学生设计的在线学习系统</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-gray-400 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <p className="text-gray-400">邮箱：contact@example.com</p>
              <p className="text-gray-400">电话：123-456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 数据分析学习平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;