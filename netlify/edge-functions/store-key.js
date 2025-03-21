// store-key.js - 存储API密钥的Edge函数
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

export default async (request, context) => {
  // 仅允许POST请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只允许POST请求' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  // 处理OPTIONS请求(CORS预检)
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

  try {
    // 获取请求体中的数据
    const body = await request.json();
    const { keyName, keyValue } = body;

    if (!keyName || !keyValue) {
      return new Response(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 使用环境变量初始化Supabase客户端
    // 这些值需要在Netlify的环境变量中设置
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

    // 将key存储到Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .upsert(
        { 
          key_name: keyName, 
          key_value: keyValue,
          updated_at: new Date().toISOString()
        }, 
        { onConflict: 'key_name' }
      );

    if (error) {
      throw error;
    }

    // 返回成功响应
    return new Response(JSON.stringify({ success: true, message: 'API密钥已保存' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('存储API密钥时出错:', error);
    
    return new Response(JSON.stringify({ error: '存储API密钥失败', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 