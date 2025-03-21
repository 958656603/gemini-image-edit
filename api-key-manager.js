/**
 * API密钥管理工具
 * 已弃用：密钥现在安全地存储在后端，并通过后端代理访问
 */

const ApiKeyManager = {
  /**
   * 此方法已弃用，API密钥现在由后端安全管理
   * @deprecated 请直接调用对应的服务端点
   */
  async getKey(keyName) {
    console.warn('ApiKeyManager.getKey() 已弃用，API密钥现在由后端安全管理');
    return null;
  }
};

// 如果在浏览器环境中，则将ApiKeyManager挂载到全局对象
if (typeof window !== 'undefined') {
  window.ApiKeyManager = ApiKeyManager;
} 