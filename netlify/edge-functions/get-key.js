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

    // 从环境变量获取API密钥
    // 直接使用 GEMINI_API_KEY 和 DEEPSEEK_API_KEY 环境变量
    let envKeyName;
    
    if (keyName === 'gemini_api_key') {
      envKeyName = 'GEMINI_API_KEY';
    } else if (keyName === 'deepseek_api_key') {
      envKeyName = 'DEEPSEEK_API_KEY';
    } else {
      // 其他密钥名称，保持原来的处理方式
      envKeyName = `API_KEY_${keyName.toUpperCase()}`;
    }
    
    // 使用Netlify.env.get()获取环境变量
    const keyValue = Netlify.env.get(envKeyName);

    // 添加调试信息(仅在开发环境)
    console.log(`尝试获取环境变量: ${envKeyName}`);
    console.log(`获取结果: ${keyValue ? '成功' : '失败'}`);
    
    // 检查环境变量中是否存在该密钥
    if (!keyValue) {
      return new Response(JSON.stringify({ 
        error: `找不到API密钥: ${keyName}，请检查环境变量 ${envKeyName} 是否已设置`,
        available_keys: Object.keys(Netlify.env.toObject())
      }), {
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
      keyValue: keyValue 
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