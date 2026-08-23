/**
 * 四季八里都蘭共學堂 - 官方網站互動控制腳本 (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. 導覽列滾動效果與手機版選單
  // ==========================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  // 監聽滾動以添加陰影
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }
  });

  // 手機版選單開關
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    // 切換按鈕圖示
    const isOpen = navMenu.classList.contains('open');
    mobileToggle.innerHTML = isOpen 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
  });

  // 點擊選單項目後自動關閉選單 (RWD 手機端體驗)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
      }
    });
  });


  // ==========================================
  // 2. 深淺色模式切換 (Theme Switcher)
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  // 讀取本地儲存的主題 preference，若無則預設為深色
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlEl.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (htmlEl.classList.contains('dark')) {
      htmlEl.className = 'light';
      localStorage.setItem('theme', 'light');
    } else {
      htmlEl.className = 'dark';
      localStorage.setItem('theme', 'dark');
    }
  });


  // ==========================================
  // 3. 都蘭實戰故事卡片輪播 (Carousel)
  // ==========================================
  const slides = document.querySelectorAll('.story-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlideIndex = 0;
  let carouselInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlideIndex = index;
  }

  // 監聽導航點點擊
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetAutoPlay();
    });
  });

  // 自動播放
  function startAutoPlay() {
    carouselInterval = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(nextIndex);
    }, 8000); // 8 秒切換一次
  }

  function resetAutoPlay() {
    clearInterval(carouselInterval);
    startAutoPlay();
  }

  // 啟動自動播放
  startAutoPlay();


  // ==========================================
  // 4. 自訂 Podcast 真實播放器控制 (Audio Player)
  // ==========================================
  const tracks = [
    {
      title: "當老師的價值只剩下「陪伴」",
      subtitle: "都蘭 AI 補課筆記與學習的終極轉型",
      file: "assets/teacher_companionship.mp3",
      lyrics: [
        { time: 0, text: "想像一下這個畫面：你今天準備去報名一堂最尖端的人工智慧科技課程..." },
        { time: 8, text: "但你手上拿去繳學費的不是信用卡，也不是一疊千元鈔票，而是..." },
        { time: 15, text: "一袋你自己辛苦種出來的有機稻米，或者是早上剛出爐的手作麵包對吧？" },
        { time: 22, text: "沒錯，這聽起來就像科幻小說裡才會出現的烏托邦情節。" },
        { time: 30, text: "但這卻是此時此刻正在台灣台東都蘭真實發生的事。" },
        { time: 35, text: "歡迎來到都蘭共學堂！在這裡，我們不講複雜的代碼，我們學 AI、也學生活。" },
        { time: 42, text: "在一個大雨滂沱的午後，學員阿芬無法親自來到莊園上課..." },
        { time: 49, text: "我們開啟了線上補課。阿芬問：『 NotebookLM 是什麼？』" },
        { time: 55, text: "我們把它比喻為五星級廚房：文獻是食材，提示詞是點餐，AI 是主廚！" },
        { time: 65, text: "這堂課沒有傳統的考題，只有『精通的壓縮』與溫慢的陪伴。" }
      ]
    },
    {
      title: "用 Gemini 救回鎖死的三星手機",
      subtitle: "都蘭共學堂的長輩數位賦能實戰",
      file: "assets/rescue_phone.mp3",
      lyrics: [
        { time: 0, text: "你玩過密室逃脫嗎？就是那種不小心觸發陷阱，然後聽到大門卡拉一聲鎖死的那種窒息感..." },
        { time: 8, text: "今天的故事主角不是探險家，而是一位溫暖的貴美阿嬤。" },
        { time: 14, text: "阿嬤在共學營第二堂課時，意外為自己的三星手機設定了開機密碼，下一秒卻忘得精光！" },
        { time: 22, text: "這支手機是美版二手貨，沒有發票，官方客服因防盜 FRP 機制拒絕協助重置。" },
        { time: 31, text: "阿中教練沒有放棄，也沒有去查死板的 Google 搜尋，而是請出 Google Gemini AI。" },
        { time: 39, text: "我們把 AI 當作『數位雪巴嚮導』。第一招三星遠端解鎖失敗了，定位沒開。" },
        { time: 47, text: "Gemini 指引我們進入 Android 的工程模式強制重置。" },
        { time: 54, text: "核心關鍵：『必須先接上傳輸線連接電腦，再長按音量減少與電源鍵 7-10 秒。』" },
        { time: 64, text: "跟著 AI 的指令，阿嬤的手機終於跳進了黑底藍字的 Recovery 介面！" },
        { time: 70, text: "重置成功！阿嬤的手機復活了，這就是 AI 在偏鄉發揮的實質溫度與人情味。" }
      ]
    },
    {
      title: "學 AI 先開除老師",
      subtitle: "從廚房隱喻看 AI 時代終身學習",
      file: "assets/fire_teacher.mp3",
      lyrics: [
        { time: 0, text: "今天我們要來探討一個非常顛覆的觀點：『學 AI，要先學會開除老師？』" },
        { time: 7, text: "這並不是說老師不重要了，而是傳統『傳授硬資訊』的老師功能正被 AI 徹底取代。" },
        { time: 15, text: "當你向 Gemini 發問，它給出的答案比大部分的老師更完整、更有邏輯、而且 24 小時隨時在線。" },
        { time: 24, text: "在這樣的新時代，學習不再是班級排名與攀比，而是一場『私有化』的成長。" },
        { time: 32, text: "我們提出『五星級廚房』隱喻，將 NotebookLM 視為一個高度自動化的加工中心。" },
        { time: 40, text: "學生才是廚房的主廚，而 AI 是幫你切菜、調味、極速出餐的頂級廚具。" },
        { time: 48, text: "只要懂得將自己收集的精選食材（資料庫）投入，就能一鍵做出一道好菜。" },
        { time: 56, text: "因此，老師的終極價值只剩下『陪伴』——提供情緒安全網，引導如何跟 AI 高品質對話。" }
      ]
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let isDraggingSlider = false;

  // 建立 HTML5 Audio 物件
  const audio = new Audio();

  const vinylDisc = document.getElementById('vinylDisc');
  const playerTrackTitle = document.getElementById('playerTrackTitle');
  const playerTrackSubtitle = document.getElementById('playerTrackSubtitle');
  const currentTimeText = document.getElementById('currentTime');
  const totalDurationText = document.getElementById('totalDuration');
  const timeSlider = document.getElementById('timeSlider');
  const btnPlay = document.getElementById('btnPlay');
  const iconPlay = btnPlay.querySelector('.icon-play');
  const iconPause = btnPlay.querySelector('.icon-pause');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const playlistItems = document.querySelectorAll('.playlist-item');
  const transcriptContent = document.getElementById('transcriptContent');
  const toggleTranscriptBtn = document.getElementById('toggleTranscriptBtn');

  // 格式化時間 (秒 -> mm:ss)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // 更新播放/暫停按鈕的 UI 狀態
  function updatePlayStateUI() {
    if (isPlaying) {
      vinylDisc.style.animationPlayState = 'running';
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
    } else {
      vinylDisc.style.animationPlayState = 'paused';
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
    }
  }

  // 載入曲目
  function loadTrack(index) {
    const track = tracks[index];
    currentTrackIndex = index;
    playerTrackTitle.textContent = track.title;
    playerTrackSubtitle.textContent = track.subtitle;
    
    // 更新音軌檔案
    audio.src = track.file;
    audio.load();
    
    // 重設進度與時間顯示
    timeSlider.value = 0;
    currentTimeText.textContent = "00:00";
    totalDurationText.textContent = "--:--";
    
    // 更新播放清單 Active 狀態
    playlistItems.forEach(item => item.classList.remove('active'));
    playlistItems[index].classList.add('active');

    // 重新載入並渲染逐字稿
    renderTranscript(track.lyrics);
    
    // 如果之前處於播放狀態，則直接開始播放新歌
    if (isPlaying) {
      audio.play().catch(e => console.log("Play failed: ", e));
    }
    updatePlayStateUI();
  }

  // 渲染逐字稿 HTML
  function renderTranscript(lyrics) {
    transcriptContent.innerHTML = lyrics.map((line) => `
      <p class="lyric-line" data-time="${line.time}">
        <strong>[${formatTime(line.time)}]</strong> ${line.text}
      </p>
    `).join('');
    transcriptContent.scrollTop = 0;
  }

  // 更新逐字稿當前高亮行
  function updateLyricHighlight(seconds) {
    const lines = transcriptContent.querySelectorAll('.lyric-line');
    let activeLine = null;
    
    lines.forEach(line => {
      const lineTime = parseInt(line.getAttribute('data-time'), 10);
      if (seconds >= lineTime) {
        activeLine = line;
      }
    });

    if (activeLine) {
      lines.forEach(line => line.classList.remove('active'));
      activeLine.classList.add('active');
      
      // 平滑捲動至該行
      const containerHeight = transcriptContent.clientHeight;
      const lineOffsetTop = activeLine.offsetTop;
      const lineHeight = activeLine.clientHeight;
      
      transcriptContent.scrollTo({
        top: lineOffsetTop - (containerHeight / 2) + (lineHeight / 2),
        behavior: 'smooth'
      });
    }
  }

  // 監聽音訊加載完畢事件取得實際總時長
  audio.addEventListener('loadedmetadata', () => {
    totalDurationText.textContent = formatTime(audio.duration);
  });

  // 監聽播放進度更新
  audio.addEventListener('timeupdate', () => {
    if (!isDraggingSlider) {
      const current = audio.currentTime;
      const duration = audio.duration || 1;
      timeSlider.value = (current / duration) * 100;
      currentTimeText.textContent = formatTime(current);
      updateLyricHighlight(current);
    }
  });

  // 監聽播放完畢，自動下一首
  audio.addEventListener('ended', () => {
    let nextIdx = (currentTrackIndex + 1) % tracks.length;
    isPlaying = true;
    loadTrack(nextIdx);
  });

  // 監聽音訊實際播放/暫停事件以確保 UI 同步
  audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayStateUI();
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayStateUI();
  });

  audio.addEventListener('error', () => {
    console.error("Audio error: ", audio.error);
    const code = audio.error ? audio.error.code : 0;
    let msg = "音訊讀取失敗！";
    if (code === 4) {
      msg += "\n\n[錯誤 404] 找不到檔案。\n請確認您已上傳以下檔案到 github 專案的 assets/ 目錄：\n" + tracks[currentTrackIndex].file;
    } else {
      msg += "\n\n錯誤碼：" + code + "\n請檢查網路連線。";
    }
    alert(msg);
  });

  // 監聽播放/暫停按鈕點擊
  btnPlay.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayStateUI();
      }).catch(err => {
        console.log("Audio play blocked by browser. User interaction required first.", err);
      });
    } else {
      audio.pause();
      isPlaying = false;
      updatePlayStateUI();
    }
  });

  // 上一首
  btnPrev.addEventListener('click', () => {
    let prevIdx = currentTrackIndex - 1;
    if (prevIdx < 0) prevIdx = tracks.length - 1;
    loadTrack(prevIdx);
  });

  // 下一首
  btnNext.addEventListener('click', () => {
    let nextIdx = (currentTrackIndex + 1) % tracks.length;
    loadTrack(nextIdx);
  });

  // 監聽播放清單項目點擊
  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      isPlaying = true;
      loadTrack(index);
    });
  });

  // 監聽進度條手動拖曳事件
  timeSlider.addEventListener('mousedown', () => { isDraggingSlider = true; });
  timeSlider.addEventListener('touchstart', () => { isDraggingSlider = true; });

  timeSlider.addEventListener('input', () => {
    const duration = audio.duration || 1;
    const progressPercent = parseFloat(timeSlider.value);
    const targetSeconds = (progressPercent / 100) * duration;
    currentTimeText.textContent = formatTime(targetSeconds);
  });

  timeSlider.addEventListener('change', () => {
    const duration = audio.duration || 1;
    const progressPercent = parseFloat(timeSlider.value);
    audio.currentTime = (progressPercent / 100) * duration;
    isDraggingSlider = false;
  });

  // 逐字稿展開/收合
  toggleTranscriptBtn.addEventListener('click', () => {
    const isExpanded = transcriptContent.classList.contains('expanded');
    if (isExpanded) {
      transcriptContent.classList.remove('expanded');
      toggleTranscriptBtn.textContent = "顯示全文";
    } else {
      transcriptContent.classList.add('expanded');
      toggleTranscriptBtn.textContent = "收合內容";
    }
  });

  // 初始化載入第一首歌
  loadTrack(0);

  // ==========================================
  // 4.5. 共生商店 Tabs 切換邏輯
  // ==========================================
  const storeTabBtns = document.querySelectorAll('.store-tab-btn');
  const storePanels = document.querySelectorAll('.store-panel');

  storeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      // 切換按鈕的 active 狀態
      storeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 切換對應面板的 active 狀態
      storePanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `store-panel-${tabTarget}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // 5. 互動表單提交與成功彈窗 (Success Modal)
  // ==========================================
  const enrollmentForm = document.getElementById('enrollmentForm');
  const successModal = document.getElementById('successModal');
  const modalSummary = document.getElementById('modalSummary');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const btnExportCSV = document.getElementById('btnExportCSV');

  if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 取得表單數值
      const name = document.getElementById('studentName').value.trim();
      const phone = document.getElementById('studentPhone').value.trim();
      const line = document.getElementById('studentLine').value.trim() || "未提供";
      const courseSelect = document.getElementById('courseSelect').value || "哈爸 AI 慢活共創營";
      const expectation = document.getElementById('expectations').value.trim() || "無特別描述";
      const timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
      const sn = 'DL-HP-' + String(Math.floor(1000 + Math.random() * 9000));

      // 儲存於本地 localStorage（方便隨時匯出試算表）
      const newRecord = { sn, time: timestamp, name, phone, line, course: courseSelect, expectation };
      const existing = JSON.parse(localStorage.getItem('dulan_homepage_registrations') || '[]');
      existing.push(newRecord);
      localStorage.setItem('dulan_homepage_registrations', JSON.stringify(existing));

      // 建立成功的摘要 HTML
      let summaryHtml = `
        <div style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem;">
          <p style="margin: 0.25rem 0;"><strong>報名序號：</strong><span style="color: #6EE7B7; font-family: monospace; font-weight: bold;">${sn}</span></p>
          <p style="margin: 0.25rem 0;"><strong>學員姓名：</strong>${name}</p>
          <p style="margin: 0.25rem 0;"><strong>聯絡電話：</strong>${phone} ｜ <strong>LINE ID：</strong>${line}</p>
          <p style="margin: 0.25rem 0;"><strong>預約課程：</strong><span style="color: #FCD34D; font-weight: 600;">${courseSelect}</span></p>
          <p style="margin: 0.25rem 0;"><strong>學習期待：</strong>${expectation}</p>
        </div>
        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin: 0.25rem 0 0;">
          💡 系統已為您登記預約。您可點擊下方按鈕前往 Google 試算表/官方表單查看，或直接下載備份名單！
        </p>
      `;

      // 塞入彈出視窗並顯示
      modalSummary.innerHTML = summaryHtml;
      successModal.classList.remove('hidden');
      
      // 暫時停止 Podcast 播放以防打擾
      if (typeof isPlaying !== 'undefined' && isPlaying) {
        isPlaying = false;
        audio.pause();
        updatePlayStateUI();
      }
    });
  }

  // 匯出報名試算表 CSV
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', () => {
      const records = JSON.parse(localStorage.getItem('dulan_homepage_registrations') || '[]');
      if (records.length === 0) {
        alert('目前尚未有已登記的報名紀錄。\n您也可以直接點擊「前往 Google 試算表」查看雲端表單！');
        return;
      }

      let csv = "\uFEFF報名序號,登記時間,姓名,電話,LINE ID,預約課程,學習期待\n";
      records.forEach(r => {
        csv += `"${r.sn}","${r.time}","${r.name}","${r.phone}","${r.line}","${r.course}","${r.expectation}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `都蘭共學堂_預約報名名單_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // 關閉彈出視窗並重置表單
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      if (enrollmentForm) enrollmentForm.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 點擊 Modal 背景也可關閉
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.add('hidden');
        if (enrollmentForm) enrollmentForm.reset();
      }
    });
  }

});
