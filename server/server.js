const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'submissions.csv');

app.use(cors());
app.use(express.json());

app.post('/api/submit', (req, res) => {
  const submission = req.body;

  if (!submission || Object.keys(submission).length === 0) {
    return res.status(400).json({ error: 'Empty submission data' });
  }

  // 目前這筆資料的欄位
  const currentKeys = Object.keys(submission);

  let headers = [];
  let needRewriteHeader = false;

  if (!fs.existsSync(filePath)) {
    // 檔案不存在 → 第一次，直接用這筆的欄位當表頭
    headers = [...currentKeys];
    needRewriteHeader = true;
  } else {
    // 讀取現有第一行表頭
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
      // 檔案存在但空 → 當作第一次
      headers = [...currentKeys];
      needRewriteHeader = true;
    } else {
      // 解析現有表頭（去掉雙引號）
      headers = lines[0]
        .split(',')
        .map(h => h.trim().replace(/^"|"$/g, ''));

      // 找出新增加的欄位
      const newKeys = currentKeys.filter(key => !headers.includes(key));

      if (newKeys.length > 0) {
        // 有新欄位 → 追加到表頭最後，並標記需要重寫表頭
        headers = [...headers, ...newKeys];
        needRewriteHeader = true;
      }
    }
  }

  // 依照目前 headers 順序產生這一行的值（沒有的欄位填空）
  const rowValues = headers.map(key => {
    const value = submission[key];
    const strValue = value == null ? '' : String(value);
    // CSV 逃逸：把 " 變成 ""
    const escaped = strValue.replace(/"/g, '""');
    return `"${escaped}"`;
  });

  const row = rowValues.join(',') + '\n';

  try {
    if (needRewriteHeader) {
      // 需要重寫表頭 → 讀取原有內容（去掉舊表頭），然後寫新表頭 + 舊資料 + 新資料
      let existingData = '';
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        // 跳過第一行（舊表頭）
        existingData = lines.slice(1).join('\n');
      }

      const newHeaderRow = headers.map(h => `"${h}"`).join(',') + '\n';
      fs.writeFileSync(filePath, newHeaderRow + existingData + row);
      return res.json({ message: 'Submission saved (headers updated)' });
    } else {
      // 正常追加
      fs.appendFileSync(filePath, row);
      return res.json({ message: 'Submission saved' });
    }
  } catch (err) {
    console.error('Error writing to CSV:', err);
    return res.status(500).json({ error: 'Failed to save submission' });
  }
});

app.post('/webhook', (req, res) => {
  exec('git pull --force origin main', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Git pull error: ${error}`);
      return res.status(500).send('Pull failed');
    }
    console.log(`Git pull output: ${stdout}`);
    res.send('Pull successful');
  });
});


// ... 其他程式碼不變 ...

// 新增這個路由，用來下載 submissions.csv
app.get('/api/download', (req, res) => {
  // 檢查檔案是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'No submissions yet',
      message: 'CSV file has not been created because no data has been submitted'
    });
  }

  // 設定下載時的檔名（客戶端看到的檔名）
  const downloadFilename = 'submissions.csv';

  res.download(filePath, downloadFilename, (err) => {
    if (err) {
      console.error('Download error:', err);
      // 如果發生錯誤，嘗試回應 JSON 錯誤（因為下載已經開始，res 可能已部分送出）
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    }
    // 成功下載時，express 會自動處理結束
  });
});

// ... app.listen 保持不變 ...


app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});