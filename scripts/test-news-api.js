#!/usr/bin/env node

/**
 * 新闻API测试脚本
 * 用于测试真实新闻数据源的集成效果
 * 
 * 使用方法：
 * node scripts/test-news-api.js
 * node scripts/test-news-api.js --stock=000001
 * node scripts/test-news-api.js --mode=real --api=newsapi
 */

import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// 加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
dotenv.config({ path: join(projectRoot, '.env') });

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  stock: '000001',
  mode: process.env.REACT_APP_NEWS_MODE || 'mock',
  api: 'newsapi',
  limit: 5
};

args.forEach(arg => {
  if (arg.startsWith('--stock=')) {
    options.stock = arg.split('=')[1];
  } else if (arg.startsWith('--mode=')) {
    options.mode = arg.split('=')[1];
  } else if (arg.startsWith('--api=')) {
    options.api = arg.split('=')[1];
  } else if (arg.startsWith('--limit=')) {
    options.limit = parseInt(arg.split('=')[1]);
  }
});

console.log('🧪 新闻API测试工具');
console.log('==================');
console.log(`股票代码: ${options.stock}`);
console.log(`测试模式: ${options.mode}`);
console.log(`API类型: ${options.api}`);
console.log(`新闻数量: ${options.limit}`);
console.log('');

// 股票名称映射
const stockNames = {
  '000001': '平安银行',
  '000002': '万科A',
  '600000': '浦发银行',
  '600036': '招商银行',
  '000858': '五粮液',
  '600519': '贵州茅台',
  '000166': '申万宏源',
  '600030': '中信证券',
  '300750': '宁德时代',
  '002415': '海康威视'
};

// 测试NewsAPI
async function testNewsAPI(stockCode, stockName, limit) {
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;
  
  if (!apiKey) {
    console.log('❌ NewsAPI密钥未配置，请在.env文件中设置REACT_APP_NEWS_API_KEY');
    return null;
  }

  try {
    console.log('🔍 测试NewsAPI...');
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: `${stockName} OR ${stockCode}`,
        language: 'zh',
        sortBy: 'publishedAt',
        pageSize: limit,
        apiKey: apiKey
      },
      timeout: 10000
    });

    if (response.data.status === 'ok') {
      console.log('✅ NewsAPI请求成功');
      console.log(`📰 找到 ${response.data.articles.length} 条新闻`);
      
      response.data.articles.slice(0, 3).forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   来源: ${article.source.name}`);
        console.log(`   时间: ${new Date(article.publishedAt).toLocaleString('zh-CN')}`);
        console.log(`   摘要: ${(article.description || '').substring(0, 100)}...`);
      });
      
      return response.data.articles;
    } else {
      console.log('❌ NewsAPI请求失败:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ NewsAPI请求错误:', error.message);
    if (error.response) {
      console.log('   状态码:', error.response.status);
      console.log('   错误信息:', error.response.data.message);
    }
    return null;
  }
}

// 测试聚合数据API
async function testJuheAPI(stockCode, limit) {
  const apiKey = process.env.REACT_APP_JUHE_API_KEY;
  
  if (!apiKey) {
    console.log('❌ 聚合数据API密钥未配置，请在.env文件中设置REACT_APP_JUHE_API_KEY');
    return null;
  }

  try {
    console.log('🔍 测试聚合数据API...');
    
    const response = await axios.get('http://v.juhe.cn/finance/stock/news', {
      params: {
        gid: stockCode,
        key: apiKey
      },
      timeout: 10000
    });

    if (response.data.error_code === 0) {
      console.log('✅ 聚合数据API请求成功');
      console.log(`📰 找到 ${response.data.result.length} 条新闻`);
      
      response.data.result.slice(0, 3).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title}`);
        console.log(`   来源: ${item.src}`);
        console.log(`   时间: ${new Date(item.time * 1000).toLocaleString('zh-CN')}`);
        console.log(`   摘要: ${item.digest.substring(0, 100)}...`);
      });
      
      return response.data.result;
    } else {
      console.log('❌ 聚合数据API请求失败:', response.data.reason);
      return null;
    }
  } catch (error) {
    console.log('❌ 聚合数据API请求错误:', error.message);
    return null;
  }
}

// 测试东方财富API
async function testEastMoneyAPI(stockCode, limit) {
  try {
    console.log('🔍 测试东方财富API...');
    
    const marketPrefix = stockCode.startsWith('6') ? '1' : '0';
    const fullCode = `${marketPrefix}.${stockCode}`;
    
    const response = await axios.get('http://push2.eastmoney.com/api/qt/stock/news', {
      params: {
        ut: 'f57e1bc0c53e4e7e99e1bef0b7c20800',
        fltt: '2',
        secid: fullCode,
        fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18',
        invt: '2'
      },
      timeout: 10000
    });

    if (response.data && response.data.data && response.data.data.news) {
      console.log('✅ 东方财富API请求成功');
      console.log(`📰 找到 ${response.data.data.news.length} 条新闻`);
      
      response.data.data.news.slice(0, 3).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title}`);
        console.log(`   来源: ${item.media_name}`);
        console.log(`   时间: ${new Date(item.showtime * 1000).toLocaleString('zh-CN')}`);
        console.log(`   摘要: ${item.digest.substring(0, 100)}...`);
      });
      
      return response.data.data.news;
    } else {
      console.log('❌ 东方财富API返回数据格式异常');
      return null;
    }
  } catch (error) {
    console.log('❌ 东方财富API请求错误:', error.message);
    return null;
  }
}

// 测试模拟数据
async function testMockData(stockCode, limit) {
  console.log('🔍 测试模拟数据...');
  
  // 简单的模拟数据生成
  const mockNews = [
    {
      title: `${stockNames[stockCode] || '测试股票'}发布最新财报，业绩超预期`,
      source: '财经网',
      publishTime: new Date().toISOString(),
      summary: '公司第三季度业绩表现亮眼，营收和利润均实现双位数增长...'
    },
    {
      title: `机构上调${stockNames[stockCode] || '测试股票'}目标价`,
      source: '证券日报',
      publishTime: new Date(Date.now() - 3600000).toISOString(),
      summary: '多家券商研究机构发布研报，看好公司未来发展前景...'
    }
  ];

  console.log('✅ 模拟数据生成成功');
  console.log(`📰 生成 ${mockNews.length} 条模拟新闻`);
  
  mockNews.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`);
    console.log(`   来源: ${item.source}`);
    console.log(`   时间: ${new Date(item.publishTime).toLocaleString('zh-CN')}`);
    console.log(`   摘要: ${item.summary.substring(0, 100)}...`);
  });
  
  return mockNews;
}

// 主测试函数
async function runTest() {
  const stockCode = options.stock;
  const stockName = stockNames[stockCode] || `股票${stockCode}`;
  const limit = options.limit;
  
  console.log(`🎯 开始测试股票: ${stockCode} (${stockName})\n`);
  
  let results = {};

  if (options.mode === 'mock' || options.api === 'mock') {
    results.mock = await testMockData(stockCode, limit);
  } else if (options.api === 'newsapi') {
    results.newsapi = await testNewsAPI(stockCode, stockName, limit);
  } else if (options.api === 'juhe') {
    results.juhe = await testJuheAPI(stockCode, limit);
  } else if (options.api === 'eastmoney') {
    results.eastmoney = await testEastMoneyAPI(stockCode, limit);
  } else if (options.api === 'all') {
    console.log('🚀 测试所有API源...\n');
    results.newsapi = await testNewsAPI(stockCode, stockName, limit);
    console.log('\n' + '='.repeat(50) + '\n');
    results.juhe = await testJuheAPI(stockCode, limit);
    console.log('\n' + '='.repeat(50) + '\n');
    results.eastmoney = await testEastMoneyAPI(stockCode, limit);
    console.log('\n' + '='.repeat(50) + '\n');
    results.mock = await testMockData(stockCode, limit);
  }

  // 测试总结
  console.log('\n' + '='.repeat(50));
  console.log('📊 测试总结');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([api, data]) => {
    if (data) {
      console.log(`✅ ${api.toUpperCase()}: 成功获取 ${data.length} 条新闻`);
    } else {
      console.log(`❌ ${api.toUpperCase()}: 获取失败`);
    }
  });

  // 推荐配置
  console.log('\n💡 推荐配置:');
  if (results.newsapi) {
    console.log('   建议使用NewsAPI，数据质量高且稳定');
    console.log('   在.env中设置: REACT_APP_NEWS_MODE=real');
  } else if (results.eastmoney) {
    console.log('   可以使用东方财富API，免费但可能不稳定');
    console.log('   在.env中设置: REACT_APP_NEWS_MODE=hybrid');
  } else {
    console.log('   当前只能使用模拟数据');
    console.log('   在.env中设置: REACT_APP_NEWS_MODE=mock');
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
使用方法:
  node scripts/test-news-api.js [选项]

选项:
  --stock=CODE     指定股票代码 (默认: 000001)
  --mode=MODE      测试模式: mock|real|hybrid (默认: mock)
  --api=TYPE       API类型: newsapi|juhe|eastmoney|mock|all (默认: newsapi)
  --limit=NUMBER   新闻数量限制 (默认: 5)
  --help           显示帮助信息

示例:
  node scripts/test-news-api.js --stock=600519 --api=newsapi --limit=3
  node scripts/test-news-api.js --api=all
  node scripts/test-news-api.js --mode=real --stock=000001

环境变量:
  REACT_APP_NEWS_API_KEY    NewsAPI密钥
  REACT_APP_JUHE_API_KEY    聚合数据API密钥
  REACT_APP_NEWS_MODE       新闻模式 (mock|real|hybrid)
`);
}

// 检查帮助参数
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// 运行测试
runTest().catch(error => {
  console.error('💥 测试过程中发生错误:', error);
  process.exit(1);
});