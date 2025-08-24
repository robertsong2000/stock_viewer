// 模拟股票数据
export const mockStocks = [
  {
    code: "000001",
    name: "平安银行",
    market: "SZ",
    price: 12.35,
    change: 0.05
  },
  {
    code: "000002", 
    name: "万科A",
    market: "SZ",
    price: 8.92,
    change: -0.02
  },
  {
    code: "600000",
    name: "浦发银行", 
    market: "SH",
    price: 7.85,
    change: 0.03
  },
  {
    code: "600036",
    name: "招商银行",
    market: "SH", 
    price: 34.56,
    change: 0.08
  },
  {
    code: "000858",
    name: "五粮液",
    market: "SZ",
    price: 128.90,
    change: -0.15
  },
  {
    code: "600519",
    name: "贵州茅台",
    market: "SH",
    price: 1680.50,
    change: 0.25
  },
  {
    code: "000166",
    name: "申万宏源",
    market: "SZ",
    price: 4.12,
    change: 0.01
  },
  {
    code: "600030",
    name: "中信证券",
    market: "SH",
    price: 18.76,
    change: -0.05
  },
  {
    code: "300750",
    name: "宁德时代",
    market: "SZ",
    price: 156.78,
    change: 0.12
  },
  {
    code: "002415",
    name: "海康威视",
    market: "SZ",
    price: 32.45,
    change: -0.08
  }
];

// 模拟新闻数据
export const mockNews = {
  "000001": [
    {
      id: "news_000001_001",
      title: "平安银行发布三季度财报：净利润同比增长15.2%",
      summary: "平安银行公布2024年第三季度业绩报告，实现净利润285.6亿元，同比增长15.2%，营业收入增长8.5%...",
      publishTime: "2024-08-24T09:30:00Z",
      source: "财经网",
      url: "https://finance.sina.com.cn/stock/news/001",
      stockCode: "000001"
    },
    {
      id: "news_000001_002", 
      title: "平安银行零售业务转型成效显著，客户数突破1.2亿",
      summary: "平安银行在零售金融业务转型方面取得重要进展，个人客户数量突破1.2亿户，数字化转型持续深化...",
      publishTime: "2024-08-23T15:20:00Z",
      source: "中国证券报",
      url: "https://finance.sina.com.cn/stock/news/002",
      stockCode: "000001"
    },
    {
      id: "news_000001_003",
      title: "平安银行获批设立理财子公司，资管业务进入新阶段",
      summary: "银保监会正式批准平安银行设立理财子公司，这标志着平安银行资产管理业务将进入全新发展阶段...",
      publishTime: "2024-08-22T11:45:00Z",
      source: "金融时报",
      url: "https://finance.sina.com.cn/stock/news/003",
      stockCode: "000001"
    }
  ],
  "600519": [
    {
      id: "news_600519_001",
      title: "贵州茅台前三季度营收破千亿，同比增长18.7%",
      summary: "贵州茅台酒股份有限公司发布前三季度业绩公告，实现营业收入1024.8亿元，同比增长18.7%...",
      publishTime: "2024-08-24T10:15:00Z",
      source: "证券日报",
      url: "https://finance.sina.com.cn/stock/news/101",
      stockCode: "600519"
    },
    {
      id: "news_600519_002",
      title: "茅台集团与华为达成战略合作，推进数字化转型",
      summary: "中国贵州茅台酒厂(集团)有限责任公司与华为技术有限公司签署战略合作协议，共同推进数字化转型...",
      publishTime: "2024-08-23T14:30:00Z",
      source: "新华财经",
      url: "https://finance.sina.com.cn/stock/news/102",
      stockCode: "600519"
    }
  ]
};

// 为其他股票生成模拟新闻
export const generateMockNews = (stockCode, stockName) => {
  const baseNews = [
    {
      id: `news_${stockCode}_001`,
      title: `${stockName}发布最新业绩公告，业绩表现亮眼`,
      summary: `${stockName}公布最新季度财务报告，各项指标表现良好，营收和利润均实现稳步增长...`,
      publishTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      source: "财经网",
      url: `https://finance.sina.com.cn/stock/news/${stockCode}_001`,
      stockCode
    },
    {
      id: `news_${stockCode}_002`,
      title: `机构看好${stockName}发展前景，给予买入评级`,
      summary: `多家券商研究机构发布研报，对${stockName}未来发展前景表示看好，维持或上调投资评级...`,
      publishTime: new Date(Date.now() - Math.random() * 172800000).toISOString(),
      source: "中国证券报",
      url: `https://finance.sina.com.cn/stock/news/${stockCode}_002`,
      stockCode
    },
    {
      id: `news_${stockCode}_003`,
      title: `${stockName}积极布局新兴业务，抢占市场先机`,
      summary: `${stockName}宣布在新兴业务领域加大投入，通过技术创新和模式创新，抢占市场发展先机...`,
      publishTime: new Date(Date.now() - Math.random() * 259200000).toISOString(),
      source: "上海证券报",
      url: `https://finance.sina.com.cn/stock/news/${stockCode}_003`,
      stockCode
    },
    {
      id: `news_${stockCode}_004`,
      title: `${stockName}与行业领军企业达成战略合作`,
      summary: `${stockName}宣布与行业内知名企业签署战略合作协议，双方将在多个领域开展深度合作...`,
      publishTime: new Date(Date.now() - Math.random() * 345600000).toISOString(),
      source: "经济参考报",
      url: `https://finance.sina.com.cn/stock/news/${stockCode}_004`,
      stockCode
    }
  ];
  
  return baseNews.slice(0, 3 + Math.floor(Math.random() * 8)); // 随机返回3-10条新闻
};