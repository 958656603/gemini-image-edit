// upload-media.js - 处理媒体文件上传的 Edge 函数

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

    // 处理表单数据
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: '未找到文件' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 获取文件相关信息
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;
    const fileBuffer = await file.arrayBuffer();
    
    // 第一步：初始化上传请求
    const initUploadResponse = await fetch(
      `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': fileSize.toString(),
          'X-Goog-Upload-Header-Content-Type': fileType
        },
        body: JSON.stringify({
          file: {
            display_name: fileName
          }
        })
      }
    );
    
    // 检查初始化上传请求的响应
    if (!initUploadResponse.ok) {
      const errorText = await initUploadResponse.text();
      throw new Error(`初始化上传失败: ${errorText}`);
    }
    
    // 获取上传URL
    const uploadUrl = initUploadResponse.headers.get('x-goog-upload-url');
    
    if (!uploadUrl) {
      throw new Error('无法获取上传URL');
    }
    
    // 第二步：上传文件内容
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Length': fileSize.toString(),
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize'
      },
      body: fileBuffer
    });
    
    // 检查上传响应
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`上传文件失败: ${errorText}`);
    }
    
    // 解析上传响应
    const fileInfo = await uploadResponse.json();
    
    // 检查文件状态
    if (fileInfo.file && fileInfo.file.state === 'PROCESSING') {
      // 如果文件正在处理中，轮询获取文件状态直到处理完成
      const fileName = fileInfo.file.name;
      let fileState = 'PROCESSING';
      let attempts = 0;
      
      while (fileState === 'PROCESSING' && attempts < 5) {
        // 等待几秒钟
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 获取文件状态
        const fileStatusResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${apiKey}`
        );
        
        if (fileStatusResponse.ok) {
          const fileStatus = await fileStatusResponse.json();
          fileState = fileStatus.file.state;
          
          if (fileState === 'ACTIVE') {
            // 文件处理完成
            return new Response(JSON.stringify({
              success: true,
              fileUri: fileStatus.file.uri,
              fileName: fileStatus.file.name,
              mimeType: fileType
            }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
          } else if (fileState === 'FAILED') {
            throw new Error('文件处理失败');
          }
        }
        
        attempts++;
      }
      
      if (fileState === 'PROCESSING') {
        return new Response(JSON.stringify({
          success: true,
          fileUri: fileInfo.file.uri,
          fileName: fileInfo.file.name,
          mimeType: fileType,
          message: '文件正在处理中，可能需要一些时间才能完成'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    
    // 返回上传成功的响应
    return new Response(JSON.stringify({
      success: true,
      fileUri: fileInfo.file.uri,
      fileName: fileInfo.file.name,
      mimeType: fileType
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('处理媒体文件上传请求时出错:', error);
    
    return new Response(JSON.stringify({ 
      error: '处理上传请求失败', 
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