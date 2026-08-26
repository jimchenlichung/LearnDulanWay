/**
 * =========================================================================
 * 都蘭共學堂 - 用 AI 翻轉人生九月 30 天線上挑戰營
 * Google 試算表 (Google Sheets) 自動接收線上報名程式碼
 * =========================================================================
 * 
 * 【使用說明：只需 3 步即可完成串接】
 * 1. 打開 Google 雲端硬碟 ➔ 新增「Google 試算表」，命名為「都蘭共學堂_九月活動報名名冊」。
 * 2. 點選頂端選單【擴充功能】➔【Apps Script】。
 * 3. 清空裡面的內容，將本檔案整份程式碼複製貼上，點選【儲存】(磁片圖示)。
 * 4. 點選右上角【部署】➔【新增部署作業】：
 *    - 種類選擇：「網頁應用程式 (Web App)」
 *    - 說明：「九月活動報名接收」
 *    - 執行身分：「我 (你的 Gmail 帳號)」
 *    - 誰可以存取：「所有人 (Anyone)」 (⚠️ 關鍵設定，才能接收公開網頁報名)
 * 5. 點選【部署】並授予權限，複製取得的「網頁應用程式網址 (Web App URL)」。
 *    (格式類似：https://script.google.com/macros/s/AKfycb.../exec)
 * 6. 將該網址填入 index.html 的 GOOGLE_SHEETS_WEBHOOK_URL 即可！
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 如果是全新試算表，自動建立表頭欄位
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "報名序號",
        "提交時間",
        "學員姓名",
        "行動電話",
        "電子郵件",
        "LINE ID",
        "報名方案",
        "學習目標 / 微習慣",
        "備註 / 繳費狀態"
      ]);
      // 表頭美化 (都蘭森林綠底白字、粗體)
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground("#1E3F33");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // 解析前端傳來的 JSON 資料
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    var sn = data.sn || ("DL-" + Utilities.formatDate(new Date(), "Asia/Taipei", "yyyyMMdd-HHmm"));
    var time = data.timestamp || Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");
    var name = data.name || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var line = data.line || "";
    var plan = data.plan || "";
    var goal = data.goal || "";
    var status = (plan && plan.indexOf("NT$") !== -1) ? "待確認劃撥" : "線上免費共學(已確認)";

    // 寫入試算表新的一列
    sheet.appendRow([
      sn,
      time,
      name,
      "'" + phone,
      email,
      line,
      plan,
      goal,
      status
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "報名資料已成功寫入 Google 試算表！",
      "sn": sn
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("都蘭共學堂報名接收 API 正常運作中！");
}
