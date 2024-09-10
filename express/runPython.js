// runPython.js
const { spawn } = require('child_process');
const path = require('path');

// 确保指定正确的 Python 脚本路径
const pythonScriptPath = path.join(__dirname, 'main.py');
console.log(pythonScriptPath);

// 运行 Python 脚本
const pythonProcess = spawn('python', [pythonScriptPath]);
console.log(pythonProcess);

// 处理标准输出
pythonProcess.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter((line) => line.trim());
  lines.forEach((line) => {
    try {
      const jsonData = JSON.parse(line);
      console.log('Received data:', jsonData);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  });
});

// 处理标准错误
pythonProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data.toString()}`);
});

// 处理 Python 脚本的退出
pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
});
