/**
 * ==============================================================================
 * 都蘭共學堂 ╳ 用 AI 翻轉人生九月活動
 * Google 試算表 (Google Sheets) 自動寫入 Webhook 程式碼 (Google Apps Script)
 * ==============================================================================
 * 
 * 📌 【使用步驟說明】（只需 1 分鐘即可完成串接）：
 * 1. 打開您的 Google 試算表（Google Sheets），或新建一個空白試算表。
 * 2. 在第一列（Row 1）依序建立標題欄位：
 *    A: 報名序號 | B: 提交時間 | C: 姓名 | D: 電話 | E: 電子郵件 | F: LINE ID | G: 報名方案 | H: 學習目標
 * 3. 點擊試算表上方選單：【擴充功能】 > 【Apps Script】。
 * 4. 將編輯器內原本的程式碼清空，完整複製並貼上下方的程式碼。
 * 5. 點擊右上角【部署】 > 【新增部署作業】：
 *    - 種類選取：【網頁應用程式 (Web App)】
 *    - 說明：都蘭九月活動報名接收 API
 *    - 執行身分：【我 (您的 Google 帳號)】
 *    - 誰可以存取：【所有人 (Anyone)】  <-- 務必選擇「所有人」
 * 6. 點擊【部署】並核准權限，複製產生的【網頁應用程式網址 (Web App URL)】。
 * 7. 將該網址貼入 ai-september/index.html 中的 GOOGLE_SHEET_WEBHOOK_URL 即可！
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 避免多人同時提交時衝突

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 解析前端傳來的 JSON 資料
    var data = JSON.parse(e.postData.contents);
    
    // 依序寫入欄位
    var rowData = [
      data.sn || '',
      data.timestamp || new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.line || '',
      data.plan || '',
      data.goal || ''
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '報名資料已成功寫入 Google 試算表！'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput('都蘭共學堂報名 Webhook 正常運作中！');
}
