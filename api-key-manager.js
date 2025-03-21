/**
 * API密钥管理工具
 * 提供存储和获取API密钥的功能
 */

const ApiKeyManager = {
  /**
   * 保存API密钥
   * @param {string} keyName - 密钥名称
   * @param {string} keyValue - 密钥值
   * @returns {Promise<Object>} - 包含操作结果的Promise
   */
  async storeKey(keyName, keyValue) {
    try {
      const response = await fetch('/api/store-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyName, keyValue })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '保存API密钥失败');
      }
      
      return result;
    } catch (error) {
      console.error('保存API密钥时出错:', error);
      throw error;
    }
  },

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
  },

  /**
   * 初始化API密钥UI组件
   * @param {Object} options - 配置选项
   * @param {string} options.containerId - 容器元素ID
   * @param {Array<string>} options.keyNames - 要管理的密钥名称列表
   */
  initKeyManagerUI(options = {}) {
    const { containerId = 'api-key-manager', keyNames = [] } = options;
    
    // 确保容器存在
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`找不到ID为"${containerId}"的容器元素`);
      return;
    }
    
    // 创建UI
    const managerHTML = `
      <div class="api-key-form">
        <h3>API密钥管理器</h3>
        <div class="key-input-group">
          <select id="key-name-select">
            ${keyNames.map(name => `<option value="${name}">${name}</option>`).join('')}
          </select>
          <input type="password" id="key-value-input" placeholder="输入API密钥...">
          <button id="save-key-btn">保存</button>
          <button id="load-key-btn">加载</button>
        </div>
        <div class="key-status" id="key-status"></div>
      </div>
    `;
    
    container.innerHTML = managerHTML;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .api-key-form {
        border: 1px solid #e1e1e1;
        padding: 15px;
        border-radius: 8px;
        background-color: #f9f9f9;
        margin-bottom: 20px;
      }
      .key-input-group {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }
      .key-input-group select,
      .key-input-group input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .key-input-group select {
        min-width: 120px;
      }
      .key-input-group input {
        flex-grow: 1;
      }
      .key-input-group button {
        padding: 8px 16px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .key-input-group button:hover {
        background-color: #3b7dd8;
      }
      .key-status {
        font-size: 14px;
        min-height: 20px;
      }
      .key-status.success {
        color: green;
      }
      .key-status.error {
        color: red;
      }
    `;
    document.head.appendChild(style);
    
    // 添加事件监听器
    const saveButton = document.getElementById('save-key-btn');
    const loadButton = document.getElementById('load-key-btn');
    const keyNameSelect = document.getElementById('key-name-select');
    const keyValueInput = document.getElementById('key-value-input');
    const keyStatus = document.getElementById('key-status');
    
    saveButton.addEventListener('click', async () => {
      const keyName = keyNameSelect.value;
      const keyValue = keyValueInput.value;
      
      if (!keyName || !keyValue) {
        keyStatus.textContent = '错误: 密钥名称和值不能为空';
        keyStatus.className = 'key-status error';
        return;
      }
      
      try {
        keyStatus.textContent = '正在保存...';
        keyStatus.className = 'key-status';
        
        await this.storeKey(keyName, keyValue);
        
        keyStatus.textContent = '✅ API密钥已成功保存';
        keyStatus.className = 'key-status success';
        
        // 清空输入框
        keyValueInput.value = '';
      } catch (error) {
        keyStatus.textContent = `❌ 错误: ${error.message}`;
        keyStatus.className = 'key-status error';
      }
    });
    
    loadButton.addEventListener('click', async () => {
      const keyName = keyNameSelect.value;
      
      if (!keyName) {
        keyStatus.textContent = '错误: 请选择要加载的密钥名称';
        keyStatus.className = 'key-status error';
        return;
      }
      
      try {
        keyStatus.textContent = '正在加载...';
        keyStatus.className = 'key-status';
        
        const keyValue = await this.getKey(keyName);
        
        keyValueInput.value = keyValue;
        keyStatus.textContent = '✅ API密钥已成功加载';
        keyStatus.className = 'key-status success';
      } catch (error) {
        keyStatus.textContent = `❌ 错误: ${error.message}`;
        keyStatus.className = 'key-status error';
      }
    });
  }
};

// 如果在浏览器环境中，则将ApiKeyManager挂载到全局对象
if (typeof window !== 'undefined') {
  window.ApiKeyManager = ApiKeyManager;
} 