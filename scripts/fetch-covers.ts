// iTunes APIから=LOVEの全シングルのジャケット画像URLを取得するスクリプト
// 使用方法: npx ts-node scripts/fetch-covers.ts

const SINGLES = [
  { number: 1, title: "=LOVE", artist: "=LOVE" },
  { number: 2, title: "僕らの制服クリスマス", artist: "=LOVE" },
  { number: 3, title: "手遅れcaution", artist: "=LOVE" },
  { number: 4, title: "Want you! Want you!", artist: "=LOVE" },
  { number: 5, title: "探せ ダイヤモンドリリー", artist: "=LOVE" },
  { number: 6, title: "ズルいよ ズルいね", artist: "=LOVE" },
  { number: 7, title: "CAMEO", artist: "=LOVE" },
  { number: 8, title: "青春サブリミナル", artist: "=LOVE" },
  { number: 9, title: "ウィークエンドシトロン", artist: "=LOVE" },
  { number: 10, title: "The 5th", artist: "イコールラブ" },
  { number: 11, title: "あの子コンプレックス", artist: "=LOVE" },
  { number: 12, title: "Be Selfish", artist: "=LOVE" },
  { number: 13, title: "この空がトリガー", artist: "=LOVE" },
  { number: 14, title: "ナツマトペ", artist: "=LOVE" },
  { number: 15, title: "ラストノートしか知らない", artist: "=LOVE" },
  { number: 16, title: "呪って呪って", artist: "=LOVE" },
  { number: 17, title: "絶対アイドル辞めないで", artist: "=LOVE" },
  { number: 18, title: "とくべチュ、して", artist: "=LOVE" },
  { number: 19, title: "ラブソングに襲われる", artist: "=LOVE" },
];

const ALBUMS = [{ title: "全部、内緒。", artist: "=LOVE" }];

interface CoverData {
  singleNumber: number;
  title: string;
  coverUrl: string;
  artworkUrl100: string;
}

interface AlbumCoverData {
  albumTitle: string;
  coverUrl: string;
  artworkUrl100: string;
}

interface iTunesSearchResult {
  results: Array<{
    artistName?: string;
    collectionName?: string;
    artworkUrl100?: string;
    artworkUrl60?: string;
  }>;
}

async function searchItunes(
  term: string,
  entity: string = "album",
): Promise<iTunesSearchResult> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=JP&media=music&entity=${entity}&limit=5`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function fetchSingleCovers(): Promise<CoverData[]> {
  const results: CoverData[] = [];

  for (const single of SINGLES) {
    console.log(`Fetching: ${single.number}th - ${single.title}`);

    try {
      // シングル名とアーティスト名で検索
      const data = await searchItunes(`${single.artist} ${single.title}`);

      if (data.results && data.results.length > 0) {
        // =LOVEの結果を優先
        const match =
          data.results.find(
            (r) =>
              r.artistName?.includes("=LOVE") ||
              r.artistName?.includes("イコールラブ") ||
              r.collectionName?.includes(single.title),
          ) || data.results[0];

        // 高解像度版に変換（100x100 → 600x600）
        const artworkUrl100 = match.artworkUrl100 || match.artworkUrl60;
        const coverUrl = artworkUrl100?.replace("100x100", "600x600") || "";

        results.push({
          singleNumber: single.number,
          title: single.title,
          coverUrl,
          artworkUrl100: artworkUrl100 || "",
        });

        console.log(`  ✓ Found: ${match.collectionName}`);
      } else {
        console.log(`  ✗ Not found`);
        results.push({
          singleNumber: single.number,
          title: single.title,
          coverUrl: "",
          artworkUrl100: "",
        });
      }

      // APIレート制限対策
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error: ${error}`);
      results.push({
        singleNumber: single.number,
        title: single.title,
        coverUrl: "",
        artworkUrl100: "",
      });
    }
  }

  return results;
}

async function fetchAlbumCovers(): Promise<AlbumCoverData[]> {
  const results: AlbumCoverData[] = [];

  for (const album of ALBUMS) {
    console.log(`Fetching Album: ${album.title}`);

    try {
      const data = await searchItunes(`${album.artist} ${album.title}`);

      if (data.results && data.results.length > 0) {
        const match =
          data.results.find((r) =>
            r.collectionName?.includes(album.title),
          ) || data.results[0];

        const artworkUrl100 = match.artworkUrl100 || match.artworkUrl60;
        const coverUrl = artworkUrl100?.replace("100x100", "600x600") || "";

        results.push({
          albumTitle: album.title,
          coverUrl,
          artworkUrl100: artworkUrl100 || "",
        });

        console.log(`  ✓ Found: ${match.collectionName}`);
      } else {
        console.log(`  ✗ Not found`);
        results.push({
          albumTitle: album.title,
          coverUrl: "",
          artworkUrl100: "",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error: ${error}`);
    }
  }

  return results;
}

async function main() {
  console.log("=== iTunes API Cover Fetcher ===\n");

  console.log("Fetching single covers...\n");
  const singles = await fetchSingleCovers();

  console.log("\nFetching album covers...\n");
  const albums = await fetchAlbumCovers();

  const output = {
    fetchedAt: new Date().toISOString(),
    singles: singles.reduce(
      (acc, s) => {
        acc[s.singleNumber] = s.coverUrl;
        return acc;
      },
      {} as Record<number, string>,
    ),
    albums: albums.reduce(
      (acc, a) => {
        acc[a.albumTitle] = a.coverUrl;
        return acc;
      },
      {} as Record<string, string>,
    ),
    raw: { singles, albums },
  };

  // JSONファイルに保存
  const fs = await import("fs");
  const outputPath = "./src/data/covers.json";
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Saved to ${outputPath}`);
  console.log(
    "\nSingles found:",
    singles.filter((s) => s.coverUrl).length,
    "/",
    singles.length,
  );
  console.log(
    "Albums found:",
    albums.filter((a) => a.coverUrl).length,
    "/",
    albums.length,
  );
}

main().catch(console.error);
