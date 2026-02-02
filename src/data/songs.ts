// =LOVE 全楽曲データ（1st〜19thシングル + 1stアルバム）
import coverData from "./covers.json";

export interface Song {
  id: string;
  title: string;
  singleNumber: number;
  singleTitle: string;
  type: "title" | "coupling" | "album";
  releaseDate: string;
  coverUrl?: string; // ジャケット画像URL
}

// iTunes APIから取得したジャケット画像URL
export const singleCovers: Record<number, string> = coverData.singles as Record<
  number,
  string
>;
export const albumCovers: Record<string, string> = coverData.albums;

// ジャケット画像URLを取得
export function getCoverUrl(song: Song): string | undefined {
  if (song.type === "album") {
    return albumCovers[song.singleTitle];
  }
  return singleCovers[song.singleNumber];
}

export const songs: Song[] = [
  // 1st Single「=LOVE」(2017.09.06)
  {
    id: "1-1",
    title: "=LOVE",
    singleNumber: 1,
    singleTitle: "=LOVE",
    type: "title",
    releaseDate: "2017-09-06",
  },
  {
    id: "1-2",
    title: "記憶のどこかで",
    singleNumber: 1,
    singleTitle: "=LOVE",
    type: "coupling",
    releaseDate: "2017-09-06",
  },
  {
    id: "1-3",
    title: "スタート!",
    singleNumber: 1,
    singleTitle: "=LOVE",
    type: "coupling",
    releaseDate: "2017-09-06",
  },

  // 2nd Single「僕らの制服クリスマス」(2017.12.06)
  {
    id: "2-1",
    title: "僕らの制服クリスマス",
    singleNumber: 2,
    singleTitle: "僕らの制服クリスマス",
    type: "title",
    releaseDate: "2017-12-06",
  },
  {
    id: "2-2",
    title: "ようこそ！イコラブ沼",
    singleNumber: 2,
    singleTitle: "僕らの制服クリスマス",
    type: "coupling",
    releaseDate: "2017-12-06",
  },
  {
    id: "2-3",
    title: "届いてLOVE YOU♡",
    singleNumber: 2,
    singleTitle: "僕らの制服クリスマス",
    type: "coupling",
    releaseDate: "2017-12-06",
  },

  // 3rd Single「手遅れcaution」(2018.05.16)
  {
    id: "3-1",
    title: "手遅れcaution",
    singleNumber: 3,
    singleTitle: "手遅れcaution",
    type: "title",
    releaseDate: "2018-05-16",
  },
  {
    id: "3-2",
    title: "部活中に目が合うなって思ってたんだ",
    singleNumber: 3,
    singleTitle: "手遅れcaution",
    type: "coupling",
    releaseDate: "2018-05-16",
  },
  {
    id: "3-3",
    title: "樹愛羅、助けに来たぞ",
    singleNumber: 3,
    singleTitle: "手遅れcaution",
    type: "coupling",
    releaseDate: "2018-05-16",
  },

  // 4th Single「Want you! Want you!」(2018.10.17)
  {
    id: "4-1",
    title: "Want you! Want you!",
    singleNumber: 4,
    singleTitle: "Want you! Want you!",
    type: "title",
    releaseDate: "2018-10-17",
  },
  {
    id: "4-2",
    title: "今、この船に乗れ!",
    singleNumber: 4,
    singleTitle: "Want you! Want you!",
    type: "coupling",
    releaseDate: "2018-10-17",
  },
  {
    id: "4-3",
    title: "アイカツハッピーエンド",
    singleNumber: 4,
    singleTitle: "Want you! Want you!",
    type: "coupling",
    releaseDate: "2018-10-17",
  },

  // 5th Single「探せ ダイヤモンドリリー」(2019.04.24)
  {
    id: "5-1",
    title: "探せ ダイヤモンドリリー",
    singleNumber: 5,
    singleTitle: "探せ ダイヤモンドリリー",
    type: "title",
    releaseDate: "2019-04-24",
  },
  {
    id: "5-2",
    title: "いらない ツインテール",
    singleNumber: 5,
    singleTitle: "探せ ダイヤモンドリリー",
    type: "coupling",
    releaseDate: "2019-04-24",
  },
  {
    id: "5-3",
    title: "虹の素",
    singleNumber: 5,
    singleTitle: "探せ ダイヤモンドリリー",
    type: "coupling",
    releaseDate: "2019-04-24",
  },

  // 6th Single「ズルいよ ズルいね」(2019.10.30)
  {
    id: "6-1",
    title: "ズルいよ ズルいね",
    singleNumber: 6,
    singleTitle: "ズルいよ ズルいね",
    type: "title",
    releaseDate: "2019-10-30",
  },
  {
    id: "6-2",
    title: "Sweetest girl",
    singleNumber: 6,
    singleTitle: "ズルいよ ズルいね",
    type: "coupling",
    releaseDate: "2019-10-30",
  },
  {
    id: "6-3",
    title: "推しのいる世界",
    singleNumber: 6,
    singleTitle: "ズルいよ ズルいね",
    type: "coupling",
    releaseDate: "2019-10-30",
  },

  // 7th Single「CAMEO」(2020.07.08)
  {
    id: "7-1",
    title: "CAMEO",
    singleNumber: 7,
    singleTitle: "CAMEO",
    type: "title",
    releaseDate: "2020-07-08",
  },
  {
    id: "7-2",
    title: "君と私の歌",
    singleNumber: 7,
    singleTitle: "CAMEO",
    type: "coupling",
    releaseDate: "2020-07-08",
  },
  {
    id: "7-3",
    title: "My Voice Is For You",
    singleNumber: 7,
    singleTitle: "CAMEO",
    type: "coupling",
    releaseDate: "2020-07-08",
  },

  // 8th Single「青春"サブリミナル"」(2020.11.25)
  {
    id: "8-1",
    title: '青春"サブリミナル"',
    singleNumber: 8,
    singleTitle: '青春"サブリミナル"',
    type: "title",
    releaseDate: "2020-11-25",
  },
  {
    id: "8-2",
    title: "しゅきぴ",
    singleNumber: 8,
    singleTitle: '青春"サブリミナル"',
    type: "coupling",
    releaseDate: "2020-11-25",
  },
  {
    id: "8-3",
    title: "流星群",
    singleNumber: 8,
    singleTitle: '青春"サブリミナル"',
    type: "coupling",
    releaseDate: "2020-11-25",
  },

  // 9th Single「ウィークエンドシトロン」(2021.08.25)
  {
    id: "9-1",
    title: "ウィークエンドシトロン",
    singleNumber: 9,
    singleTitle: "ウィークエンドシトロン",
    type: "title",
    releaseDate: "2021-08-25",
  },
  {
    id: "9-2",
    title: "ズッ友案件",
    singleNumber: 9,
    singleTitle: "ウィークエンドシトロン",
    type: "coupling",
    releaseDate: "2021-08-25",
  },
  {
    id: "9-3",
    title: "夏祭り恋慕う",
    singleNumber: 9,
    singleTitle: "ウィークエンドシトロン",
    type: "coupling",
    releaseDate: "2021-08-25",
  },
  {
    id: "9-4",
    title: "祝祭",
    singleNumber: 9,
    singleTitle: "ウィークエンドシトロン",
    type: "coupling",
    releaseDate: "2021-08-25",
  },

  // 10th Single「The 5th」(2021.12.15)
  {
    id: "10-1",
    title: "The 5th",
    singleNumber: 10,
    singleTitle: "The 5th",
    type: "title",
    releaseDate: "2021-12-15",
  },
  {
    id: "10-2",
    title: "お姫様にしてよ!",
    singleNumber: 10,
    singleTitle: "The 5th",
    type: "coupling",
    releaseDate: "2021-12-15",
  },
  {
    id: "10-3",
    title: "Poison Girl",
    singleNumber: 10,
    singleTitle: "The 5th",
    type: "coupling",
    releaseDate: "2021-12-15",
  },
  {
    id: "10-4",
    title: "BPM170の君へ",
    singleNumber: 10,
    singleTitle: "The 5th",
    type: "coupling",
    releaseDate: "2021-12-15",
  },

  // 11th Single「あの子コンプレックス」(2022.05.25)
  {
    id: "11-1",
    title: "あの子コンプレックス",
    singleNumber: 11,
    singleTitle: "あの子コンプレックス",
    type: "title",
    releaseDate: "2022-05-25",
  },
  {
    id: "11-2",
    title: "笑顔のレシピ",
    singleNumber: 11,
    singleTitle: "あの子コンプレックス",
    type: "coupling",
    releaseDate: "2022-05-25",
  },
  {
    id: "11-3",
    title: "知らんけど",
    singleNumber: 11,
    singleTitle: "あの子コンプレックス",
    type: "coupling",
    releaseDate: "2022-05-25",
  },
  {
    id: "11-4",
    title: "僕のヒロイン",
    singleNumber: 11,
    singleTitle: "あの子コンプレックス",
    type: "coupling",
    releaseDate: "2022-05-25",
  },

  // 12th Single「Be Selfish」(2022.09.28)
  {
    id: "12-1",
    title: "Be Selfish",
    singleNumber: 12,
    singleTitle: "Be Selfish",
    type: "title",
    releaseDate: "2022-09-28",
  },
  {
    id: "12-2",
    title: "好きって、言えなかった",
    singleNumber: 12,
    singleTitle: "Be Selfish",
    type: "coupling",
    releaseDate: "2022-09-28",
  },
  {
    id: "12-3",
    title: "わたし、魔法使い",
    singleNumber: 12,
    singleTitle: "Be Selfish",
    type: "coupling",
    releaseDate: "2022-09-28",
  },
  {
    id: "12-4",
    title: "真夜中マーメイド",
    singleNumber: 12,
    singleTitle: "Be Selfish",
    type: "coupling",
    releaseDate: "2022-09-28",
  },

  // 13th Single「この空がトリガー」(2023.02.22)
  {
    id: "13-1",
    title: "この空がトリガー",
    singleNumber: 13,
    singleTitle: "この空がトリガー",
    type: "title",
    releaseDate: "2023-02-22",
  },
  {
    id: "13-2",
    title: "Junkies",
    singleNumber: 13,
    singleTitle: "この空がトリガー",
    type: "coupling",
    releaseDate: "2023-02-22",
  },
  {
    id: "13-3",
    title: "ラブクリエイト",
    singleNumber: 13,
    singleTitle: "この空がトリガー",
    type: "coupling",
    releaseDate: "2023-02-22",
  },
  {
    id: "13-4",
    title: "Kiara Tiara",
    singleNumber: 13,
    singleTitle: "この空がトリガー",
    type: "coupling",
    releaseDate: "2023-02-22",
  },

  // 14th Single「ナツマトペ」(2023.07.19)
  {
    id: "14-1",
    title: "ナツマトペ",
    singleNumber: 14,
    singleTitle: "ナツマトペ",
    type: "title",
    releaseDate: "2023-07-19",
  },
  {
    id: "14-2",
    title: "だからとて",
    singleNumber: 14,
    singleTitle: "ナツマトペ",
    type: "coupling",
    releaseDate: "2023-07-19",
  },
  {
    id: "14-3",
    title: "ヒロインズ",
    singleNumber: 14,
    singleTitle: "ナツマトペ",
    type: "coupling",
    releaseDate: "2023-07-19",
  },
  {
    id: "14-4",
    title: "ラブロケ",
    singleNumber: 14,
    singleTitle: "ナツマトペ",
    type: "coupling",
    releaseDate: "2023-07-19",
  },

  // 15th Single「ラストノートしか知らない」(2023.11.29)
  {
    id: "15-1",
    title: "ラストノートしか知らない",
    singleNumber: 15,
    singleTitle: "ラストノートしか知らない",
    type: "title",
    releaseDate: "2023-11-29",
  },
  {
    id: "15-2",
    title: "ドライブ デート 都内",
    singleNumber: 15,
    singleTitle: "ラストノートしか知らない",
    type: "coupling",
    releaseDate: "2023-11-29",
  },
  {
    id: "15-3",
    title: "狂想カタストロフィ",
    singleNumber: 15,
    singleTitle: "ラストノートしか知らない",
    type: "coupling",
    releaseDate: "2023-11-29",
  },
  {
    id: "15-4",
    title: "どこが好きか言って",
    singleNumber: 15,
    singleTitle: "ラストノートしか知らない",
    type: "coupling",
    releaseDate: "2023-11-29",
  },

  // 16th Single「呪って呪って」(2024.03.06)
  {
    id: "16-1",
    title: "呪って呪って",
    singleNumber: 16,
    singleTitle: "呪って呪って",
    type: "title",
    releaseDate: "2024-03-06",
  },
  {
    id: "16-2",
    title: "誰にもバレずに",
    singleNumber: 16,
    singleTitle: "呪って呪って",
    type: "coupling",
    releaseDate: "2024-03-06",
  },
  {
    id: "16-3",
    title: "君の第3ボタン",
    singleNumber: 16,
    singleTitle: "呪って呪って",
    type: "coupling",
    releaseDate: "2024-03-06",
  },

  // 17th Single「絶対アイドル辞めないで」(2024.07.31)
  {
    id: "17-1",
    title: "絶対アイドル辞めないで",
    singleNumber: 17,
    singleTitle: "絶対アイドル辞めないで",
    type: "title",
    releaseDate: "2024-07-31",
  },
  {
    id: "17-2",
    title: "仲直りシュークリーム",
    singleNumber: 17,
    singleTitle: "絶対アイドル辞めないで",
    type: "coupling",
    releaseDate: "2024-07-31",
  },
  {
    id: "17-3",
    title: "海とレモンティー",
    singleNumber: 17,
    singleTitle: "絶対アイドル辞めないで",
    type: "coupling",
    releaseDate: "2024-07-31",
  },

  // 18th Single「とくべチュ、して／恋人以上、好き未満」(2025.02.26)
  {
    id: "18-1",
    title: "とくべチュ、して",
    singleNumber: 18,
    singleTitle: "とくべチュ、して／恋人以上、好き未満",
    type: "title",
    releaseDate: "2025-02-26",
  },
  {
    id: "18-2",
    title: "恋人以上、好き未満",
    singleNumber: 18,
    singleTitle: "とくべチュ、して／恋人以上、好き未満",
    type: "title",
    releaseDate: "2025-02-26",
  },
  {
    id: "18-3",
    title: "超特急逃走中",
    singleNumber: 18,
    singleTitle: "とくべチュ、して／恋人以上、好き未満",
    type: "coupling",
    releaseDate: "2025-02-26",
  },

  // 19th Single「ラブソングに襲われる」(2025.10.08)
  {
    id: "19-1",
    title: "ラブソングに襲われる",
    singleNumber: 19,
    singleTitle: "ラブソングに襲われる",
    type: "title",
    releaseDate: "2025-10-08",
  },
  {
    id: "19-2",
    title: "Queens",
    singleNumber: 19,
    singleTitle: "ラブソングに襲われる",
    type: "coupling",
    releaseDate: "2025-10-08",
  },
  {
    id: "19-3",
    title: "木漏れ日メゾフォルテ",
    singleNumber: 19,
    singleTitle: "ラブソングに襲われる",
    type: "coupling",
    releaseDate: "2025-10-08",
  },

  // 配信限定スペシャルソング
  {
    id: "digital-1",
    title: "君だけの花道",
    singleNumber: 0,
    singleTitle: "配信限定シングル",
    type: "coupling",
    releaseDate: "2023-03-22",
  },
  {
    id: "digital-2",
    title: "おかえり、花便り",
    singleNumber: 0,
    singleTitle: "配信限定シングル",
    type: "coupling",
    releaseDate: "2023-03-28",
  },
  {
    id: "digital-3",
    title: "宝物はグリーン",
    singleNumber: 0,
    singleTitle: "配信限定シングル",
    type: "coupling",
    releaseDate: "2023-11-29",
  },
  {
    id: "digital-4",
    title: "内緒バナシ",
    singleNumber: 0,
    singleTitle: "配信限定シングル",
    type: "coupling",
    releaseDate: "2025-08-22",
  },

  // 1st Album「全部、内緒。」(2021.05.12) - アルバム新曲
  {
    id: "album1-1",
    title: "Overture",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-2",
    title: "桜の咲く音がした",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-3",
    title: "Oh! Darling",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-4",
    title: "セノビーインラブ",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-5",
    title: "Cinema",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-6",
    title: "現役アイドルちゅ～",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-7",
    title: "拝啓 貴方様",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-8",
    title: "24/7",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-9",
    title: "お姉さんじゃダメですか？",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
  {
    id: "album1-10",
    title: "866",
    singleNumber: 0,
    singleTitle: "全部、内緒。",
    type: "album",
    releaseDate: "2021-05-12",
  },
];

// 楽曲検索関数
export function searchSongs(query: string): Song[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();

  return songs
    .filter((song) => {
      const titleMatch = song.title.toLowerCase().includes(normalizedQuery);
      const singleMatch = song.singleTitle
        .toLowerCase()
        .includes(normalizedQuery);
      return titleMatch || singleMatch;
    })
    .slice(0, 10); // 最大10件
}

// シングル番号でフィルタ
export function getSongsBySingle(singleNumber: number): Song[] {
  return songs.filter((song) => song.singleNumber === singleNumber);
}

// 表題曲のみ取得
export function getTitleSongs(): Song[] {
  return songs.filter((song) => song.type === "title");
}

// アルバム曲を取得
export function getAlbumSongs(): Song[] {
  return songs.filter((song) => song.type === "album");
}
