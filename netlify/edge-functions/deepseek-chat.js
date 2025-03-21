// deepseek-chat.js - 处理 DeepSeek 聊天请求的 Edge 函数

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
    const apiKey = Netlify.env.get('DEEPSEEK_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: '找不到 DeepSeek API 密钥，请检查环境变量 DEEPSEEK_API_KEY 是否已设置'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 检查是否为流式请求
    const isStream = requestData.stream === true;

    // 处理 DeepSeek 聊天请求
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    // 如果是流式请求，直接传递流
    if (isStream) {
      // 确保我们传递正确的响应头，特别是保持数据是流式的
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': 'text/event-stream',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Transfer-Encoding': 'chunked'
        }
      });
    }

    // 非流式请求，返回 JSON 格式响应
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('处理 DeepSeek 聊天请求时出错:', error);
    
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