// gemini-chat.js - 处理 Gemini 2.5 聊天请求的 Edge 函数

export default async (request, context) => {
  // 处理 CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // 只允许 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只允许 POST 请求' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    // 获取请求体
    const requestData = await request.json();
    
    // 从环境变量获取 API 密钥
    const apiKey = Netlify.env.get('GEMINI_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: '找不到 Gemini API 密钥，请检查环境变量 GEMINI_API_KEY 是否已设置'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 使用 fetch 调用 Gemini 2.5 API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${apiKey}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }
    );

    // 获取 API 响应
    const data = await response.json();

    // 返回 API 响应结果
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('处理 Gemini 2.5 聊天请求时出错:', error);
    
    return new Response(JSON.stringify({ 
      error: '处理请求失败', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 