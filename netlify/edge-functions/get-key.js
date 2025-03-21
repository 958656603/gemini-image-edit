// get-key.js - 获取API密钥的Edge函数
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

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

    // 使用环境变量初始化Supabase客户端
    const supabaseUrl = Netlify.env.get('SUPABASE_URL');
    const supabaseKey = Netlify.env.get('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: '服务器配置错误' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 从Supabase获取key
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', keyName)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
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
      keyValue: data.key_value 
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