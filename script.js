/**
 * =LOVE 楽曲ランキング - JavaScript
 * 画像保存機能 & 編集サポート
 */

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadBtn");
  const rankingCard = document.getElementById("rankingCard");

  // ダウンロードボタンのクリックイベント
  downloadBtn.addEventListener("click", async () => {
    try {
      // ボタンを一時的に無効化
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<span class="btn-icon">⏳</span> 生成中...';

      // 編集中のフォーカスを外す
      document.activeElement.blur();

      // 少し待ってから画像生成（レンダリング完了を待つ）
      await new Promise((resolve) => setTimeout(resolve, 100));

      // html2canvasで画像生成
      const canvas = await html2canvas(rankingCard, {
        scale: 2, // 高解像度
        backgroundColor: null,
        useCORS: true,
        logging: false,
        // 装飾が切れないように余白を確保
        x: -5,
        y: -5,
        width: rankingCard.offsetWidth + 10,
        height: rankingCard.offsetHeight + 10,
      });

      // 画像をダウンロード
      const link = document.createElement("a");
      link.download = `イコラブランキング_${getFormattedDate()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // ボタンを復元
      downloadBtn.innerHTML = '<span class="btn-icon">✅</span> 保存完了！';
      setTimeout(() => {
        downloadBtn.innerHTML =
          '<span class="btn-icon">📥</span> 画像として保存';
        downloadBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("画像生成エラー:", error);
      downloadBtn.innerHTML = '<span class="btn-icon">❌</span> エラー発生';
      setTimeout(() => {
        downloadBtn.innerHTML =
          '<span class="btn-icon">📥</span> 画像として保存';
        downloadBtn.disabled = false;
      }, 2000);
    }
  });

  // 日付フォーマット関数
  function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  // Enterキーでフォーカスを次の項目へ移動
  document
    .querySelectorAll(".song-name, .main-title, .footer-text")
    .forEach((element, index, elements) => {
      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const nextElement = elements[index + 1];
          if (nextElement) {
            nextElement.focus();
          } else {
            element.blur();
          }
        }
      });
    });

  // ローカルストレージに保存（ページ離脱時）
  window.addEventListener("beforeunload", saveData);

  // ローカルストレージから復元
  loadData();

  function saveData() {
    const data = {
      title: document.querySelector(".main-title").textContent,
      footer: document.querySelector(".footer-text").textContent,
      songs: Array.from(document.querySelectorAll(".song-name")).map(
        (el) => el.textContent,
      ),
    };
    localStorage.setItem("ikorabu-ranking", JSON.stringify(data));
  }

  function loadData() {
    const saved = localStorage.getItem("ikorabu-ranking");
    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (data.title) {
          document.querySelector(".main-title").textContent = data.title;
        }
        if (data.footer) {
          document.querySelector(".footer-text").textContent = data.footer;
        }
        if (data.songs && Array.isArray(data.songs)) {
          const songElements = document.querySelectorAll(".song-name");
          data.songs.forEach((song, i) => {
            if (songElements[i] && song) {
              songElements[i].textContent = song;
            }
          });
        }
      } catch (e) {
        console.error("データ読み込みエラー:", e);
      }
    }
  }

  // 定期的に保存（30秒ごと）
  setInterval(saveData, 30000);
});
