/**
 * 【都蘭共學堂】一人開創的理想生活：從零到民宿經營管理實戰營
 * Google 表單與 Google 試算表一鍵自動建立腳本 (Google Apps Script)
 *
 * 【使用步驟】：
 * 1. 使用 Google 帳號前往 https://script.google.com 點擊「新增專案」
 * 2. 清空既有程式碼，將本檔案內容全部複製並貼上
 * 3. 點擊上方的「執行 (Run)」按鈕（函式選擇 createHomestayRegistrationForm）
 * 4. 首次執行依畫面指示「審查權限」->「進階」->「前往 (安全)」予以授權
 * 5. 執行完成後，下方「執行記錄」即會直接印出：
 *    - Google 表單公開填寫網址 (Published Form URL)
 *    - 已自動關聯的 Google 試算表網址 (Spreadsheet URL)
 * 6. 將取得的 Google 表單網址貼回首頁與子頁即可！
 */

function createHomestayRegistrationForm() {
  var formTitle = "【都蘭共學堂】一人開創的理想生活：從零到民宿經營管理實戰營 報名表";
  var form = FormApp.create(formTitle);
  
  form.setTitle(formTitle)
      .setDescription(
        "【活動資訊】\n" +
        "📅 活動日期：2026 年 10 月 9 日（週五）14:00 報到 ～ 10 月 11 日（週日）12:00 圓滿結訓（三天兩夜）\n" +
        "📍 活動地點：台東縣東河鄉都蘭村舊廍 14-2 號（四季八里自然莊園）\n" +
        "🎯 課程導師：都蘭阿中（陳豊鍾 0908853322）\n\n" +
        "【營隊特色】\n" +
        "‧ 東台灣三大名宿案例深度剖析\n" +
        "‧ 水電機具、一人營運心法、AI 助理自動化與房務實務實境演練\n" +
        "‧ 享有獨家「共學堂營運虧損補助」零風險微型創業支持機制\n\n" +
        "請填妥下方預約資訊，送出後我們將有專人與您聯繫確認席位！"
      );

  // 1. 方案選擇
  var planItem = form.addMultipleChoiceItem();
  planItem.setTitle("報名身份與方案")
          .setHelpText("小班制名額有限，依表單登記順序與面談確認為準")
          .setChoiceValues([
            "全方位實戰學員（NT$ 9,999 / 含兩晚住宿、特色餐食、AI講義與零風險實習資格）",
            "深度實作助理（NT$ 4,999 / 限額2名，需提早1天入住、延後1天離開協助莊園）"
          ])
          .setRequired(true);

  // 2. 姓名
  var nameItem = form.addTextItem();
  nameItem.setTitle("學員姓名 / 稱呼")
          .setRequired(true);

  // 3. 行動電話
  var phoneItem = form.addTextItem();
  phoneItem.setTitle("行動電話（手機號碼）")
           .setHelpText("例如：0912345678")
           .setRequired(true);

  // 4. LINE ID
  var lineItem = form.addTextItem();
  lineItem.setTitle("LINE ID")
          .setHelpText("方便助教加入聯絡與邀請進入活動群組")
          .setRequired(true);

  // 5. 電子信箱
  var emailItem = form.addTextItem();
  emailItem.setTitle("電子信箱 Email")
           .setHelpText("用於寄送行前通知與講義資料")
           .setRequired(true);

  // 6. 期待與問題
  var expItem = form.addParagraphTextItem();
  expItem.setTitle("您目前的工作背景與參加期待（選填）")
         .setHelpText("例如：希望在東海岸開一間有生活美學的民宿、想學習一人營運模式...");

  // 7. 自動建立對應的 Google 試算表並綁定為回覆接收表
  var sheetTitle = "【都蘭共學堂】10月民宿經營實戰營_報名名冊(回應)";
  var spreadsheet = SpreadsheetApp.create(sheetTitle);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  var publishedUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();
  var sheetUrl = spreadsheet.getUrl();

  Logger.log("\n========================================================");
  Logger.log("🎉 成功建立 Google 表單與 Google 試算表！");
  Logger.log("--------------------------------------------------------");
  Logger.log("📌 【學員填寫公開網址 (Google Form Published URL)】：\n" + publishedUrl);
  Logger.log("--------------------------------------------------------");
  Logger.log("📊 【自動連動的試算表網址 (Google Sheet URL)】：\n" + sheetUrl);
  Logger.log("--------------------------------------------------------");
  Logger.log("🛠️ 【表單後台編輯網址 (Edit URL)】：\n" + editUrl);
  Logger.log("========================================================\n");
}
