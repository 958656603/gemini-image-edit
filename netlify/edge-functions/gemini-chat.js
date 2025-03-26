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

    // 准备请求数据，如果没有设置安全设置则添加默认的安全设置
    const requestPayload = { ...requestData };
    
    // 如果没有提供安全设置，则添加默认的安全设置（最低过滤级别 - 只屏蔽高风险内容）
    if (!requestPayload.safetySettings) {
      requestPayload.safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
      ];
    }

    // 使用 fetch 调用 Gemini 2.5 API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${apiKey}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
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