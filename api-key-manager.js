/**
 * API密钥管理工具
 * 提供获取API密钥的功能，密钥安全地存储在后端
 */

const ApiKeyManager = {
  /**
   * 获取API密钥
   * @param {string} keyName - 要获取的密钥名称
   * @returns {Promise<string>} - 包含密钥值的Promise
   */
  async getKey(keyName) {
    try {
      const response = await fetch(`/api/get-key?keyName=${encodeURIComponent(keyName)}`);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '获取API密钥失败');
      }
      
      return result.keyValue;
    } catch (error) {
      console.error('获取API密钥时出错:', error);
      throw error;
    }
  }
};

// 如果在浏览器环境中，则将ApiKeyManager挂载到全局对象
if (typeof window !== 'undefined') {
  window.ApiKeyManager = ApiKeyManager;
} 