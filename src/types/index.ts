// 股票数据模型
export interface Stock {
  code: string;       // 股票代码，如 "000001"
  name: string;       // 股票名称，如 "平安银行"
  market: string;     // 市场类型，"SZ" 或 "SH"
  price: number;      // 当前价格
  change: number;     // 涨跌幅
}

// 新闻数据模型
export interface News {
  id: string;         // 新闻唯一标识
  title: string;      // 新闻标题
  summary: string;    // 新闻摘要
  publishTime: string; // 发布时间 ISO 8601 格式
  source: string;     // 新闻来源
  url: string;        // 新闻链接
  stockCode: string;  // 相关股票代码
}

// API响应格式
export interface ApiResponse<T> {
  data: T[];
  total: number;
  message?: string;
}

// 搜索响应类型
export type StockSearchResponse = ApiResponse<Stock>;
export type NewsResponse = ApiResponse<News>;

// 组件Props类型
export interface StockSelectorProps {
  onStockSelect: (stock: Stock) => void;
  selectedStock: Stock | null;
}

export interface NewsListProps {
  news: News[];
  loading: boolean;
  error: string | null;
  stockName?: string;
}

export interface NewsItemProps {
  news: News;
}

// 状态管理相关类型
export interface StockState {
  stocks: Stock[];
  selectedStock: Stock | null;
  loading: boolean;
  error: string | null;
}

export interface NewsState {
  newsList: News[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}