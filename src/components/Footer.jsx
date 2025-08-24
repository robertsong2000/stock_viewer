import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 产品信息 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">A股新闻浏览器</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              为投资者提供最新、最准确的A股市场新闻资讯，
              帮助您及时了解市场动态，做出明智的投资决策。
            </p>
          </div>
          
          {/* 快捷链接 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷导航</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  热门股票
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  市场行情
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  新闻搜索
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                  投资学院
                </a>
              </li>
            </ul>
          </div>
          
          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">关于我们</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>邮箱: contact@stocknews.com</p>
              <p>客服热线: 400-123-4567</p>
              <p>工作时间: 周一至周五 9:00-18:00</p>
            </div>
            
            {/* 社交媒体链接 */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 A股新闻浏览器. 保留所有权利.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
              <a href="#" className="hover:text-primary transition-colors">服务条款</a>
              <a href="#" className="hover:text-primary transition-colors">免责声明</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;