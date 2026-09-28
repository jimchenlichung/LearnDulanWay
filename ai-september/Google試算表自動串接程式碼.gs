/**
 * =========================================================================
 * 都蘭共學堂 - 用 AI 翻轉人生九月 30 天線上挑戰營
 * Google 試算表 (Google Sheets) 自動接收報名 ＆ 一鍵發送開營/打卡提醒郵件
 * =========================================================================
 * 
 * 【使用說明：如何在 Google 試算表內一鍵發函】
 * 1. 打開您的「都蘭共學堂_九月活動報名名冊」Google 試算表。
 * 2. 點選上方選單【擴充功能】➔【Apps Script】。
 * 3. 將本檔案全部程式碼複製貼上並【儲存】(磁片圖示)。
 * 4. 重新整理試算表網頁，上方會出現【🎯 都蘭共學堂營隊工具】自訂選單。
 * 5. 點選【🎯 都蘭共學堂營隊工具】➔【📧 發送明天(9/1)第一天開營打卡提醒信】即可一鍵自動發送！
 *    （第一次執行時 Google 會跳出安全性授權確認，請點選「進階」並允許存取即可）
 */

// ==========================================
// 1. Google 試算表上方自訂選單
// ==========================================
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🎯 都蘭共學堂營隊工具')
    .addItem('📧 發送明天(9/1)第一天開營打卡提醒信', 'sendDay1ReminderEmails')
    .addItem('🧪 測試發送給自己 (當前帳號)', 'testSendSelfReminder')
    .addToUi();
}

// ==========================================
// 2. 核心三大打卡與社群官方網址
// ==========================================
var COMMUNITY_LINKS = {
  youtube: 'https://www.youtube.com/@LearnDulanWay',
  facebook: 'https://www.facebook.com/share/g/1LFxXAVfQ7/',
  line: 'https://line.me/ti/g2/-wQG7m__gxJrrtV59eJYXDmzrJqyyBDYjem91A'
};

// ==========================================
// 3. 批次發送 Day 1 開營提醒通知信
// ==========================================
function sendDay1ReminderEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('試算表內尚無學員報名資料！');
    return;
  }

  // 取得表頭以定位欄位（自動適配不同欄位順序）
  var headers = data[0];
  var nameCol = -1;
  var emailCol = -1;
  var planCol = -1;
  var statusCol = -1;
  var reminderCol = -1;

  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toString().trim();
    if (h.indexOf('姓名') !== -1) nameCol = i;
    else if (h.indexOf('郵件') !== -1 || h.indexOf('Email') !== -1 || h.indexOf('電子郵件') !== -1) emailCol = i;
    else if (h.indexOf('方案') !== -1) planCol = i;
    else if (h.indexOf('備註') !== -1 || h.indexOf('繳費') !== -1) statusCol = i;
    else if (h.indexOf('提醒狀態') !== -1 || h.indexOf('Day1通知') !== -1) reminderCol = i;
  }

  // 預設欄位位置（若未自訂表頭）
  if (nameCol === -1) nameCol = 2;   // 第 3 欄 (C)
  if (emailCol === -1) emailCol = 4; // 第 5 欄 (E)
  if (planCol === -1) planCol = 6;   // 第 7 欄 (G)

  // 若尚未有「Day1通知狀態」欄位，自動在最後新增一欄
  if (reminderCol === -1) {
    reminderCol = headers.length;
    sheet.getRange(1, reminderCol + 1).setValue('Day1開營通知發送紀錄')
         .setBackground('#2D5A47')
         .setFontColor('#FFFFFF')
         .setFontWeight('bold')
         .setHorizontalAlignment('center');
  }

  var sendCount = 0;
  var skipCount = 0;
  var errorList = [];

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var studentName = (row[nameCol] || '學員夥伴').toString().trim();
    var studentEmail = (row[emailCol] || '').toString().trim();
    var studentPlan = (planCol !== -1 && row[planCol]) ? row[planCol].toString().trim() : '線上免費共學';
    var alreadySent = (row[reminderCol] || '').toString().trim();

    // 檢查 Email 格式
    if (!studentEmail || studentEmail.indexOf('@') === -1) {
      continue;
    }

    // 若已經發送過則跳過，避免重複打擾
    if (alreadySent.indexOf('已發送') !== -1) {
      skipCount++;
      continue;
    }

    try {
      var subject = '【都蘭共學堂】明天 9/1 正式起跑！用 AI 翻轉人生 30 天線上打卡營 Day 1 提醒與三大打卡連結';
      var htmlBody = generateEmailHtml(studentName, studentPlan);
      var textBody = generateEmailText(studentName);

      MailApp.sendEmail({
        to: studentEmail,
        subject: subject,
        body: textBody,
        htmlBody: htmlBody,
        name: '都蘭共學堂 - 阿中'
      });

      // 標記發送時間
      var sendTime = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm');
      sheet.getRange(r + 1, reminderCol + 1).setValue('已發送 (' + sendTime + ')');
      sendCount++;

      // 避免觸發 Gmail 發信速率限制，每封微間隔 0.2 秒
      Utilities.sleep(200);

    } catch (err) {
      errorList.push(studentName + ' (' + studentEmail + '): ' + err.toString());
    }
  }

  var summaryMsg = '發送作業完成！\n\n' +
                   '✅ 成功發送：' + sendCount + ' 人\n' +
                   '⏭️ 略過（已發送過）：' + skipCount + ' 人';
  
  if (errorList.length > 0) {
    summaryMsg += '\n\n⚠️ 失敗名單：\n' + errorList.join('\n');
  }

  SpreadsheetApp.getUi().alert(summaryMsg);
}

// ==========================================
// 4. 測試發送給自己
// ==========================================
function testSendSelfReminder() {
  var myEmail = Session.getActiveUser().getEmail();
  if (!myEmail) {
    SpreadsheetApp.getUi().alert('無法取得您的 Gmail 信箱，請確認已登入 Google。');
    return;
  }

  var subject = '【測試預覽】明天 9/1 正式起跑！用 AI 翻轉人生 30 天線上打卡營 Day 1 提醒';
  var htmlBody = generateEmailHtml('測試學員 (您自己)', '線上共學挑戰營');
  var textBody = generateEmailText('測試學員 (您自己)');

  MailApp.sendEmail({
    to: myEmail,
    subject: subject,
    body: textBody,
    htmlBody: htmlBody,
    name: '都蘭共學堂 - 阿中 (測試)'
  });

  SpreadsheetApp.getUi().alert('測試信已發送至：' + myEmail + '\n請前往您的收件匣查看排版效果！');
}

// ==========================================
// 5. 生成精美 HTML 格式信件
// ==========================================
function generateEmailHtml(name, plan) {
  return '<!DOCTYPE html>' +
  '<html>' +
  '<head>' +
  '<meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '</head>' +
  '<body style="margin: 0; padding: 0; background-color: #F4F6F4; font-family: -apple-system, BlinkMacSystemFont, \'Microsoft JhengHei\', \'Segoe UI\', Roboto, sans-serif; color: #2C3E50; line-height: 1.6;">' +
  '  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F6F4; padding: 25px 10px;">' +
  '    <tr>' +
  '      <td align="center">' +
  '        <table width="100%" max-width="640" border="0" cellspacing="0" cellpadding="0" style="max-width: 640px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">' +
  '          <!-- 頂部海浪森林綠 Banner -->' +
  '          <tr>' +
  '            <td style="background: linear-gradient(135deg, #1E3F33 0%, #2D5A47 100%); padding: 35px 30px; text-align: center; color: #FFFFFF;">' +
  '              <div style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #9FD8C4; margin-bottom: 8px; font-weight: bold;">都蘭共學堂 ╳ 2026 九月共學</div>' +
  '              <h1 style="margin: 0; font-size: 24px; font-weight: bold; line-height: 1.4; color: #FFFFFF;">🌊 用 AI 翻轉人生：30天共學打卡營</h1>' +
  '              <div style="margin-top: 10px; font-size: 16px; color: #E0F2E9; font-weight: 500;">🔔 明天（9 月 1 日）正式起跑第一天！</div>' +
  '            </td>' +
  '          </tr>' +
  '          ' +
  '          <!-- 內文主體 -->' +
  '          <tr>' +
  '            <td style="padding: 32px 28px;">' +
  '              <p style="font-size: 18px; font-weight: bold; color: #1E3F33; margin-top: 0;">親愛的 ' + name + ' 夥伴，您好：</p>' +
  '              <p style="font-size: 15px; color: #4A5568; line-height: 1.75;">' +
  '                我是都蘭阿中（陳豊鍾）。非常高興在九月的第一天能與您在「都蘭共學堂」相聚！<br>' +
  '                期待已久的<strong>「用 AI 翻轉人生：九月 30 天線上共學打卡營」將於明天（9/1）早上 07:00 正式展開！</strong>' +
  '              </p>' +
  '              ' +
  '              <!-- 核心心法卡片 -->' +
  '              <div style="background-color: #F0FDF4; border-left: 4px solid #2D5A47; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">' +
  '                <div style="font-weight: bold; color: #1E3F33; font-size: 16px; margin-bottom: 6px;">💡 開營第一心法：50 分及格哲學</div>' +
  '                <p style="margin: 0; font-size: 14px; color: #2D5A47; line-height: 1.6;">' +
  '                  告別 100 分的完美主義執念，擁抱<strong>「完成比完美更重要」</strong>！<br>' +
  '                  哪怕今天只是喝了一杯晨起的水、對 Gemini 說一句話，只要您在隊伍中，您就已經贏過了昨天的自己。' +
  '                </p>' +
  '              </div>' +
  '              ' +
  '              <!-- 明日 Day 1 任務 -->' +
  '              <h3 style="color: #1E3F33; font-size: 17px; margin-top: 26px; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">' +
  '                🚩 Day 1 核心微習慣任務：從「一杯水」開始' +
  '              </h3>' +
  '              <ol style="margin: 0 0 20px 0; padding-left: 22px; font-size: 15px; color: #4A5568; line-height: 1.8;">' +
  '                <li><strong>放下水杯：</strong>晨起喝完第一杯溫開水（觸發習慣錨點）。</li>' +
  '                <li><strong>開啟對話：</strong>打開手機 Google Gemini，對它說：<em>「列出三個我想簡化的人生領域」</em>。</li>' +
  '                <li><strong>完成打卡：</strong>前往下方任一社群平台留言打卡，分享您的小心得！</li>' +
  '              </ol>' +
  '              ' +
  '              <!-- 三大打卡網址按鈕區 -->' +
  '              <h3 style="color: #1E3F33; font-size: 17px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">' +
  '                🎯 三大社群平台打卡網址（請立即加入並收藏）' +
  '              </h3>' +
  '              ' +
  '              <!-- YouTube 卡片 -->' +
  '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; background: #FFF5F5; border-radius: 10px; border: 1px solid #FED7D7; padding: 14px;">' +
  '                <tr>' +
  '                  <td>' +
  '                    <div style="font-weight: bold; color: #C53030; font-size: 15px;">🎥 1. YouTube 每日 07:00 晨間首播教學</div>' +
  '                    <div style="font-size: 13px; color: #742A2A; margin: 4px 0 10px 0;">每天 7 點首播精準教學與播客音訊，請訂閱並開啟小鈴鐺！</div>' +
  '                    <a href="' + COMMUNITY_LINKS.youtube + '" target="_blank" style="display: inline-block; background-color: #E53E3E; color: #FFFFFF; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-size: 14px; font-weight: bold;">進入 YouTube 頻道打卡 ▶</a>' +
  '                  </td>' +
  '                </tr>' +
  '              </table>' +
  '              ' +
  '              <!-- Facebook 卡片 -->' +
  '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; background: #EBF8FF; border-radius: 10px; border: 1px solid #BEE3F8; padding: 14px;">' +
  '                <tr>' +
  '                  <td>' +
  '                    <div style="font-weight: bold; color: #2B6CB0; font-size: 15px;">📘 2. Facebook 專屬共學討論社團</div>' +
  '                    <div style="font-size: 13px; color: #2C5282; margin: 4px 0 10px 0;">每日文字版深度講義、作業繳交與心得交流討論區。</div>' +
  '                    <a href="' + COMMUNITY_LINKS.facebook + '" target="_blank" style="display: inline-block; background-color: #3182CE; color: #FFFFFF; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-size: 14px; font-weight: bold;">加入 Facebook 社團打卡 👥</a>' +
  '                  </td>' +
  '                </tr>' +
  '              </table>' +
  '              ' +
  '              <!-- LINE 社群卡片 -->' +
  '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; background: #F0FFF4; border-radius: 10px; border: 1px solid #C6F6D5; padding: 14px;">' +
  '                <tr>' +
  '                  <td>' +
  '                    <div style="font-weight: bold; color: #22543D; font-size: 15px;">💬 3. LINE 專屬共學即時互動社群</div>' +
  '                    <div style="font-size: 13px; color: #276749; margin: 4px 0 10px 0;">每晚 19:00 重點摘要推送、即時問答、夥伴互助打氣。</div>' +
  '                    <a href="' + COMMUNITY_LINKS.line + '" target="_blank" style="display: inline-block; background-color: #06C755; color: #FFFFFF; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-size: 14px; font-weight: bold;">加入 LINE 共學群組 💬</a>' +
  '                  </td>' +
  '                </tr>' +
  '              </table>' +
  '              ' +
  '              <!-- 每日生活節奏表 -->' +
  '              <div style="background-color: #F7FAFC; border-radius: 10px; padding: 16px; margin-top: 20px; border: 1px solid #E2E8F0;">' +
  '                <div style="font-weight: bold; color: #2D3748; font-size: 14px; margin-bottom: 8px;">⏰ 每日建議學習節奏（輕鬆無痛融入生活）：</div>' +
  '                <div style="font-size: 13px; color: #4A5568; line-height: 1.8;">' +
  '                  ☕ <strong>07:00</strong> YouTube 核心教學首播（晨起邊吃早餐邊看）<br>' +
  '                  🎧 <strong>07:30</strong> AI 播客導讀（散步/開車/做家事用聽的）<br>' +
  '                  📖 <strong>08:00</strong> Facebook 文字講義（空檔快速瀏覽筆記）<br>' +
  '                  🌙 <strong>19:00</strong> LINE 群組互動與打卡（晚間回顧交流）' +
  '                </div>' +
  '              </div>' +
  '              ' +
  '              <p style="font-size: 15px; color: #4A5568; margin-top: 26px; line-height: 1.75;">' +
  '                一個人走得快，一群人走得遠。讓我們在接下來的 30 天裡，放下焦慮，一起用最輕鬆的節奏探索 AI，翻轉人生！' +
  '              </p>' +
  '              ' +
  '              <p style="font-size: 16px; font-weight: bold; color: #1E3F33; margin-bottom: 0;">' +
  '                都蘭共學堂 創辦人 阿中（陳豊鍾） 敬上<br>' +
  '                <span style="font-size: 13px; font-weight: normal; color: #718096;">台東都蘭 ╳ 四季八里 ╳ 舞米山莊 ╳ 沙伯迪奧</span>' +
  '              </p>' +
  '            </td>' +
  '          </tr>' +
  '          ' +
  '          <!-- 頁尾 -->' +
  '          <tr>' +
  '            <td style="background-color: #EDF2F7; padding: 16px 20px; text-align: center; font-size: 12px; color: #718096;">' +
  '              此郵件由【都蘭共學堂】九月活動系統發送，期待與您在明天 9/1 的共學之旅中相見！' +
  '            </td>' +
  '          </tr>' +
  '        </table>' +
  '      </td>' +
  '    </tr>' +
  '  </table>' +
  '</body>' +
  '</html>';
}

// ==========================================
// 6. 生成純文字格式信件 (備援)
// ==========================================
function generateEmailText(name) {
  return '親愛的 ' + name + ' 夥伴，您好：\n\n' +
         '我是都蘭阿中（陳豊鍾）。\n' +
         '期待已久的「用 AI 翻轉人生：九月 30 天線上共學打卡營」將於明天（9 月 1 日）早上 07:00 正式起跑！\n\n' +
         '【開營第一心法：50 分及格哲學】\n' +
         '告別 100 分的完美主義執念，完成比完美更重要！只要每天前進一小步，您就已經走在改變的路上。\n\n' +
         '【Day 1 任務：從一杯水開始的微習慣】\n' +
         '1. 晨起喝完第一杯水。\n' +
         '2. 打開 Google Gemini 對話：「列出三個我想簡化的人生領域」。\n' +
         '3. 前往社群打卡留言！\n\n' +
         '【三大官方打卡與共學網址】\n' +
         '1. YouTube 晨間教學首播： ' + COMMUNITY_LINKS.youtube + '\n' +
         '2. Facebook 專屬共學社團： ' + COMMUNITY_LINKS.facebook + '\n' +
         '3. LINE 即時互動共學群： ' + COMMUNITY_LINKS.line + '\n\n' +
         '【每日學習節奏】\n' +
         '07:00 YouTube 首播 ｜ 07:30 播客導讀 ｜ 08:00 FB文字講義 ｜ 19:00 LINE晚間互動\n\n' +
         '明天見！讓我們一起用 AI 翻轉人生！\n\n' +
         '都蘭共學堂 阿中（陳豊鍾） 敬上';
}

// ==========================================
// 7. 保留原本的 Webhook 接收功能
// ==========================================
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
        "備註 / 繳費狀態",
        "Day1開營通知發送紀錄"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground("#1E3F33");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

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

    sheet.appendRow([
      sn,
      time,
      name,
      "'" + phone,
      email,
      line,
      plan,
      goal,
      status,
      "尚未發送"
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
  return ContentService.createTextOutput("都蘭共學堂報名與發函系統正常運作中！");
}

