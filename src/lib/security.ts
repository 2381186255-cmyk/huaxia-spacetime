// 安全工具函数

/**
 * 验证外部API URL是否在允许的域名白名单内
 * 防止SSRF攻击：只允许请求预定义的学术API域名
 */
const ALLOWED_DOMAINS = [
  'chgis.fas.harvard.edu',
  'cbdb.fas.harvard.edu',
  'ctext.org',
  'gis.sinica.edu.tw',
];

export function isAllowedExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * 验证数字ID参数，防止注入
 * 只允许正整数
 */
export function sanitizeId(id: string): number | null {
  const num = parseInt(id, 10);
  if (isNaN(num) || num < 1 || !/^\d+$/.test(id.trim())) {
    return null;
  }
  return num;
}

/**
 * 验证搜索查询参数，防止注入
 * 限制长度和字符范围
 */
export function sanitizeSearchQuery(q: string, maxLength = 100): string | null {
  if (!q || q.length === 0 || q.length > maxLength) {
    return null;
  }
  // 只允许中文、英文、数字、常见标点
  if (!/^[\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9\s\-_.·（）()]+$/.test(q)) {
    return null;
  }
  return q.trim();
}

/**
 * 验证年份参数
 */
export function sanitizeYear(year: string): number | null {
  const num = parseFloat(year);
  if (isNaN(num) || num < -3000 || num > 2100) {
    return null;
  }
  return num;
}

/**
 * 验证月份参数
 */
export function sanitizeMonth(month: string): number | null {
  const num = parseInt(month, 10);
  if (isNaN(num) || num < 1 || num > 12) {
    return null;
  }
  return num;
}

/**
 * 验证日期参数
 */
export function sanitizeDay(day: string): number | null {
  const num = parseInt(day, 10);
  if (isNaN(num) || num < 1 || num > 31) {
    return null;
  }
  return num;
}

/**
 * 安全的JSON解析，防止原型链污染
 */
export function safeJsonParse(str: string): unknown {
  const obj = JSON.parse(str);
  if (obj && typeof obj === 'object') {
    // 检查__proto__和constructor属性
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        delete (obj as Record<string, unknown>)[key];
      }
    }
  }
  return obj;
}

/**
 * 清理错误信息，移除敏感路径和内部细节
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // 移除文件路径、堆栈信息
    const msg = error.message
      .replace(/[A-Z]:\\[^\s]+/gi, '[path]')  // Windows路径
      .replace(/\/[a-zA-Z0-9_/.-]+/g, '[path]')  // Unix路径
      .replace(/password=\S+/gi, '[redacted]')
      .replace(/token=\S+/gi, '[redacted]')
      .replace(/key=\S+/gi, '[redacted]');
    return msg.slice(0, 200); // 限制长度
  }
  return 'An unexpected error occurred';
}
