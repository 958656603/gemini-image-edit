// get-key.js - 获取API密钥的Edge函数

export default async (request, context) => {
  // 允许GET和OPTIONS请求
  if (request.method !== 'GET' && request.method !== 'OPTIONS') {
    return new Response(JSON.stringify({ error: '只允许GET请求' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    });
  }

  // 处理OPTIONS请求(CORS预检)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    // 获取URL查询参数
    const url = new URL(request.url);
    const keyName = url.searchParams.get('keyName');

    if (!keyName) {
      return new Response(JSON.stringify({ error: '缺少keyName参数' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 直接硬编码的API密钥，不再通过数据库存储
    const apiKeys = {
      'gemini_api_key': 'AIzaSyDirHd3nwnsiKx7_1eBdm4RUX8T_6TMfz8',
      'deepseek_api_key': 'sk-9f010cf25e1d4c499c71512a7f1047dd',
      'custom_api_key': 'your-custom-api-key-here'
    };

    // 检查请求的密钥是否存在
    if (!apiKeys.hasOwnProperty(keyName)) {
      return new Response(JSON.stringify({ error: '找不到请求的API密钥' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 返回成功响应
    return new Response(JSON.stringify({ 
      success: true, 
      keyName: keyName,
      keyValue: apiKeys[keyName] 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('获取API密钥时出错:', error);
    
    return new Response(JSON.stringify({ error: '获取API密钥失败', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 