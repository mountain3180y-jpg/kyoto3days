import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, Printer, ArrowRight, Home, MapPin, ChevronDown, Instagram } from "lucide-react";

// ------------------------------------------------------------
// 京都3days 旅程サイト / Single-file React Component (Deluxe ver.)
// 仕様: 地図は外部リンクのみ / Instagramはアイコン / カード全体クリックでコンパクト切替
// 初期状態: コンパクト表示=ON、各日セクションは展開状態
// ------------------------------------------------------------

const SECTIONS = [
  { id: "stay", label: "宿・ベース" },
  { id: "day1", label: "11/29(土) Day1" },
  { id: "day2", label: "11/30(日) Day2" },
  { id: "day3", label: "12/1(月) Day3" },
];

// Vite base-aware path
const HERO_IMAGE = import.meta.env.BASE_URL + "kyoto_texture_header.png";
const HERO_FALLBACK = "https://images.unsplash.com/photo-1558980664-10ea2a126444?auto=format&fit=crop&w=1600&q=80";

// 宿情報
const lodging = {
  title: "滞在場所：京蘭-吉祥邸（Airbnb）",
  links: [
    {
      label: "Airbnb",
      href: "https://www.airbnb.jp/rooms/1097509016495134209?guests=1&adults=1&s=67&unique_share_id=b23419fe-1138-41f0-97d6-1cf339ed3369",
    },
    { label: "最寄り駐車場 MAP", href: "https://maps.app.goo.gl/98ni2Rv6KvyKJDVu5" },
  ],
};

// -----------------------------
// 旅程データ（lead と uid を付与）
// -----------------------------
const days = [
  {
    id: "day1",
    dateLabel: "11/29(土) Day1",
    summary:
      "dddで展示→佛光寺D&DEPTで定番道具。北区〈かみ添／ものや／みたて／Elbereth〉を効率回遊し、鷹峯アマンで土産確保。UFO→Graphpaperで街に戻り、夜はCHIRIRIでつゆしゃぶ、締めにBRUN。",
    items: [
      {
        uid: "d1-1000-rentacar",
        time: "10:00–10:45",
        place: "京都駅（レンタカー受取）",
        note: "京都着／所要45分",
        stay: "所要45分",
        move: "🚗約15分",
        lead: "京都駅直結の店舗で手早く受け取り。荷物を積み込んだらナビ設定と同乗者の休憩を済ませ、最初の目的地に余裕をもって向かえるよう準備を整える。改札から動線が短く雨天でも安心。",
        links: [],
      },
      {
        uid: "d1-1100-ddd",
        time: "11:00–11:30",
        place: "京都 dddギャラリー",
        note: "展示／※開館11:00",
        stay: "滞在30分",
        move: "🚗約10–15分",
        lead: "DNPのアーカイブや企画展が中心。タイポグラフィやポスターの原本を落ち着いた空間で鑑賞でき、短時間でも密度の高いインプットに。受付横の物販もチェックしておきたい。",
        links: [
          { label: "公式", href: "https://www.dnpfcp.jp/gallery/ddd/" },
          { label: "Instagram", href: "https://www.instagram.com/kyoto_dddgallery/" },
        ],
      },
      {
        uid: "d1-1150-dandd",
        time: "11:50–12:50",
        place: "D&DEPARTMENT KYOTO",
        note: "昼食",
        stay: "滞在60分",
        move: "🚗約30分",
        lead: "佛光寺の境内に併設されたショップと食。定番で長く使える道具を見た後、素朴な定食で小休止。境内の静けさと一体の雰囲気で、旅のペースを整えるのに最適。",
        links: [
          { label: "公式", href: "https://www.d-department.com/ext/shop/kyoto.html" },
          { label: "Instagram", href: "https://www.instagram.com/d_d_kyoto/" },
        ],
      },
      {
        uid: "d1-1320-kamisoe",
        time: "13:20–13:50",
        place: "かみ添",
        note: "唐紙",
        stay: "滞在30分",
        move: "🚗約10分",
        lead: "手摺りの唐紙や封筒、コースターなど文様の陰影が美しい品が並ぶ。制作の背景を想像しながら、住まいに持ち帰りやすい小物中心にゆっくり選ぶのがおすすめ。",
        links: [
          { label: "公式", href: "https://kamisoe.com/" },
          { label: "Instagram", href: "https://www.instagram.com/kamisoe_kyoto/" },
        ],
      },
      {
        uid: "d1-1400-monoya",
        time: "14:00–14:30",
        place: "ものや",
        note: "古道具",
        stay: "滞在30分",
        move: "🚗約5分",
        lead: "暮らしに馴染む古道具が中心。木の小引き出しや器、鉄のハンドルなど経年の味が程よい。飾り物より“使える道具”を探す目線で、サイズ感をしっかり確認。",
        links: [{ label: "Instagram", href: "https://www.instagram.com/shop_monoya/" }],
      },
      {
        uid: "d1-1435-mitate",
        time: "14:35–15:05",
        place: "みたて",
        note: "花屋",
        stay: "滞在30分",
        move: "🚗約5分",
        lead: "“見立て”の感覚で花材を組む人気店。余白の美しさが際立つ小さな投げ入れや枝物が魅力。宿に飾れる軽い素材や、贈り物に向く束ね方を相談してみたい。",
        links: [
          { label: "公式", href: "https://www.hanaya-mitate.com/" },
          { label: "Instagram", href: "https://www.instagram.com/mitate_hanaya/" },
        ],
      },
      {
        uid: "d1-1510-elbereth",
        time: "15:10–15:40",
        place: "Elbereth",
        note: "ギャラリー",
        stay: "滞在30分",
        move: "🚗約15分",
        lead: "小さな現代美術スペース。企画展と常設がバランス良く、短時間でも作者の視点が伝わる。作品と空間のスケール感を確かめながら、図録やカードもチェック。",
        links: [{ label: "Instagram", href: "https://www.instagram.com/elbereth_stardust/" }],
      },
      {
        uid: "d1-1555-aman",
        time: "15:55–16:25",
        place: "アマン京都",
        note: "ショップ立寄／要予約",
        stay: "滞在30分",
        move: "🚗約35–45分",
        lead: "鷹峯の森に抱かれた静謐なリゾート。ショップでは茶器や菓子など上質な土産が揃う。事前予約で入店がスムーズ。移動の合間に深呼吸して景観の静けさを味わう。",
        links: [
          { label: "公式", href: "https://www.aman.com/resorts/aman-kyoto" },
          { label: "Instagram", href: "https://www.instagram.com/aman_kyoto/" },
          { label: "予約フォーム", href: "https://www.tablecheck.com/ja/shops/aman-kyoto-dining-pickup/reserve" },
        ],
      },
      {
        uid: "d1-1715-ufo",
        time: "17:15–17:45",
        place: "UFO",
        note: "アイスクリームバー",
        stay: "滞在30分",
        move: "🚗約10–15分",
        lead: "手作り感あるアイスバーが人気。季節の果物やスパイスを合わせた味が楽しい。食後の口直しにちょうどよく、テイクアウトで次の移動にも持ち運びやすい。",
        links: [{ label: "Instagram", href: "https://www.instagram.com/ufo_kyoto/" }],
      },
      {
        uid: "d1-1755-graphpaper",
        time: "17:55–18:25",
        place: "Graphpaper KYOTO",
        note: "",
        stay: "滞在30分",
        move: "🚗約10–25分",
        lead: "素材とシルエットで魅せるベーシック。京都店ならではの落ち着いた陳列でサイズ比較もしやすい。旅のワードローブに一着、長く使える定番を探したい。",
        links: [
          { label: "公式", href: "https://graphpaper-kyoto.com/" },
          { label: "Instagram", href: "https://www.instagram.com/graphpaper_kyoto/" },
        ],
      },
      {
        uid: "d1-2000-chiriri",
        time: "20:00–22:00",
        place: "京都つゆしゃぶ CHIRIRI 四条烏丸 別邸",
        note: "夕食／予約済",
        stay: "滞在2時間",
        move: "👟数分〜 or 🚗約5–10分",
        lead: "昆布だしでさっとくぐらせる“つゆしゃぶ”が名物。上品な甘みの割下で後味は軽く、移動疲れの身体にも優しい。予約済みなのでゆったりと席で食事を楽しめる。",
        links: [{ label: "公式", href: "https://chiriri.co.jp/" }],
      },
      {
        uid: "d1-2300-brun",
        time: "23:00–",
        place: "BRUN",
        note: "ワインバー／滞在自由",
        stay: "滞在自由",
        move: "宿へ",
        lead: "自然派中心のワインバー。音量控えめの空間でグラスを数杯。店主の提案で軽いつまみと合わせ、1日の余韻を静かに整える。飲み過ぎないよう時間配分に注意。",
        links: [{ label: "Instagram", href: "https://www.instagram.com/brun_kyoto/" }],
      },
    ],
  },
  {
    id: "day2",
    dateLabel: "11/30(日) Day2",
    summary:
      "朝9時ICCで建築の静けさを浴びて北へ。天橋立は展望台＋松並木サイクリング＋観光船で立体回遊、海の幸で昼。18:30帰京後は19:45 TONAで季節の料理とワイン、移動の疲れを優しくリセット。",
    departHint: "宿出発目安 08:10",
    items: [
      {
        uid: "d2-0900-icc",
        time: "09:00–09:40",
        place: "国立京都国際会館（ICC Kyoto）",
        note: "",
        stay: "滞在40分",
        move: "🚗約1時間50分",
        lead: "前川國男の設計による会議施設。幾何学の連続が生む陰影や回廊の抜けが美しい。短時間でも外構から内部まで動線を歩き、素材感とプロポーションを体で確かめる。",
        links: [
          { label: "公式", href: "https://www.icckyoto.or.jp/en/" },
          { label: "Instagram", href: "https://www.instagram.com/icckyoto/" },
        ],
      },
      {
        uid: "d2-1130-amanohashidate",
        time: "11:30–16:30",
        place: "天橋立",
        note: "観光・昼",
        stay: "滞在5時間",
        move: "🚗約2時間",
        lead: "展望台からの景観、松並木のサイクリング、観光船での海上視点を組み合わせ、地形の魅力を立体的に体験。昼は海の幸でエネルギー補給。時間配分は余裕を持って。",
        links: [
          { label: "公式", href: "https://www.amanohashidate.jp/lang/en/" },
          { label: "Instagram", href: "https://www.instagram.com/amanohashidate.tourism/" },
        ],
      },
      {
        uid: "d2-1945-tona",
        time: "19:45–21:45",
        place: "TONA",
        note: "夕食／予約済",
        stay: "滞在2時間",
        move: "宿へ",
        lead: "季節の素材に寄り添う味付けと相性のよいワイン。過度に重くないコース構成で、長距離移動の後でも負担が少ない。小体な店なので会話も穏やかに楽しめる。",
        links: [{ label: "Instagram", href: "https://www.instagram.com/tona_kyoto/" }],
      },
    ],
  },
  {
    id: "day3",
    dateLabel: "12/1(月) Day3",
    summary:
      "朝はレバノン料理〈汽〉で軽く腹ごしらえ。嵐山で竹林・渡月橋・寺庭を歩き、12:30〈儘〉で季節の昼。新風館は35分に圧縮→東山〈oud.〉15分→祇園〈然美〉16–18時でゆとり確保。返却→京都駅1時間見学→20時新幹線。",
    departHint: "宿出発目安 07:45",
    items: [
      {
        uid: "d3-0800-ki",
        time: "08:00–09:00",
        place: "汽（レバノン料理）",
        note: "要予約",
        stay: "滞在1時間",
        move: "🚗約30–40分",
        lead: "スパイスとハーブが穏やかに香るレバノンの朝食。前日の疲れを整える優しい塩味で、旅の最終日に向けて体温を上げる。予約済みなら入店もスムーズで安心。",
        links: [
          { label: "Instagram", href: "https://www.instagram.com/ki.kyoto/" },
          { label: "予約フォーム", href: "https://www.tablecheck.com/shops/ki-kyoto/reserve?utm_source=google" },
        ],
      },
      {
        uid: "d3-0930-arashiyama",
        time: "09:30–12:00",
        place: "嵐山",
        note: "散策スポットは当日調整",
        stay: "滞在2時間30分",
        move: "🚗約5–10分",
        lead: "竹林の道から渡月橋、寺庭へと緩やかに歩く。混雑を避けたい場合は小道に入って回遊を。天候に応じて休憩を挟み、写真は人流の少ないポイントで落ち着いて撮影。",
        links: [
          { label: "公式（京都市ガイド）", href: "https://kyoto.travel/en/areas/saga-arashiyama/" },
          { label: "Instagram（Kyoto公式）", href: "https://www.instagram.com/visit_kyoto/" },
        ],
      },
      {
        uid: "d3-1230-mama",
        time: "12:30–14:00",
        place: "儘 MAMA（嵐山・昼食）",
        note: "予約済",
        stay: "滞在90分",
        move: "🚗約25–35分",
        lead: "季節の野菜と出汁を中心に、素材の持ち味を引き出す料理構成。ボリュームは過不足なく、午後の移動に響きにくい。予約済みなのでタイムラインも整えやすい。",
        links: [
          { label: "公式", href: "https://mama-arashiyama.jp/" },
          { label: "Instagram", href: "https://www.instagram.com/mama_arashiyama_/" },
        ],
      },
      {
        uid: "d3-1435-shinpuhkan",
        time: "14:35–15:10",
        place: "新風館（ShinPuhKan）",
        note: "",
        stay: "滞在35分",
        move: "🚗約20分",
        lead: "旧京都中央電話局の意匠を活かした再開発施設。中庭の光が心地よく、短時間でも建築とショップを横断して見て回れる。コーヒーで一息つくのに最適。",
        links: [
          { label: "公式", href: "https://shinpuhkan.jp/" },
          { label: "Instagram", href: "https://www.instagram.com/shinpuhkan_official/" },
        ],
      },
      {
        uid: "d3-1530-oud",
        time: "15:30–15:45",
        place: "oud.（東山）",
        note: "※受付含む",
        stay: "滞在15分",
        move: "🚗約10–15分",
        lead: "香りのアトリエ。好みをヒアリングしながら軽いブレンド体験ができる。滞在は短めでも記憶に残る香りが見つかるかも。受付含め15分で切れ目よく動ける。",
        links: [{ label: "Instagram", href: "https://www.instagram.com/oud.kyoto/" }],
      },
      {
        uid: "d3-1600-sabi",
        time: "16:00–18:00",
        place: "立礼茶室「然美（さび）」",
        note: "お茶/ペアリング／予約済",
        stay: "滞在2時間",
        move: "🚗約20–30分",
        lead: "立礼席で茶と酒、菓子を組み合わせる体験。所作のリズムが心身を整え、旅のクライマックスにふさわしい静けさを味わえる。予約時間に余裕を持って到着を。",
        links: [
          { label: "公式", href: "https://rustsabi.com/" },
          { label: "Instagram", href: "https://www.instagram.com/rustsabi/" },
        ],
      },
      {
        uid: "d3-1830-return",
        time: "18:30–18:45",
        place: "レンタカー返却",
        note: "",
        stay: "所要15分",
        move: "👟約5–10分",
        lead: "最後の混雑ポイント。ガソリン精算や車内忘れ物の確認を手短に済ませ、返却窓口では待ち列を想定。徒歩移動に切り替える前に荷物の重量配分を見直す。",
        links: [],
      },
      {
        uid: "d3-1850-stationwalk",
        time: "18:50–19:50",
        place: "京都駅エリア散策",
        note: "駅ビル大階段・空中経路・伊勢丹周辺など",
        stay: "滞在60分",
        move: "👟数分",
        lead: "大階段のイルミネーションと空中経路からの眺望を中心に。伊勢丹の食フロアで土産の最終チェックも可能。新幹線までの残り時間を見ながら無理なく回る。",
        links: [],
      },
      {
        uid: "d3-2000-shinkansen",
        time: "20:00–",
        place: "新幹線（東京へ）",
        note: "",
        stay: "—",
        move: "—",
        lead: "帰路。駅弁や茶菓を選び、座席でデータ整理や写真のバックアップを。疲れを持ち越さないよう軽いストレッチをして、到着後の動線や乗換も事前に確認。",
        links: [],
      },
    ],
  },
];

// -----------------------------
// ユーティリティ：localStorage を使ったチェック管理
// -----------------------------
const VISITED_KEY = "kyoto3days-visited";
function useVisited() {
  const [visited, setVisited] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(VISITED_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(VISITED_KEY, JSON.stringify(visited));
    } catch {}
  }, [visited]);
  const toggle = (uid: string) => setVisited((prev) => ({ ...prev, [uid]: !prev[uid] }));
  const reset = () => setVisited({});
  return { visited, toggle, reset } as const;
}

function SectionNav() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200/70 dark:border-neutral-800/70">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3 overflow-x-auto">
        <Calendar className="h-5 w-5 shrink-0 text-black/80 dark:text-white/90" />
        <nav className="flex gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm rounded-full border border-neutral-300/80 dark:border-neutral-700/80 px-3 py-1 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 whitespace-nowrap transition"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 dark:border-neutral-700/80 px-3 py-1 text-sm hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition"
          >
            <Printer className="h-4 w-4" /> PDF/印刷
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-4">
      <div className="relative h-44 md:h-64 rounded-3xl overflow-hidden shadow">
        <img
          src={HERO_IMAGE}
          alt="Kyoto themed header"
          onError={(e) => (e.currentTarget.src = HERO_FALLBACK)}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-4 left-5 md:left-6 text-white drop-shadow">
            <div className="text-xs tracking-[0.2em] opacity-90">KYOTO / AUTUMN 2025</div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold leading-tight tracking-wide">京都 3DAYS 旅程</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkPill({ href, children }: { href: string; children: React.ReactNode }) {
  const isIG = /instagram\.com/i.test(href);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
      onClick={(e) => e.stopPropagation()}
      className="group inline-flex items-center gap-1 rounded-full border border-neutral-300/80 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-900/70 backdrop-blur px-3 py-2 text-xs hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {isIG ? <Instagram className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
      <span>{children}</span>
    </a>
  );
}

// Googleマップ 検索結果の埋め込み URL（参照用）
function mapSrc(place: string) {
  const q = encodeURIComponent(`${place} 京都`);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}
// Googleマップを新規タブで開くリンク
function mapLink(place: string) {
  const q = encodeURIComponent(`${place} 京都`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// 小さめのトグルスイッチ
function ToggleSwitch({checked, onChange}:{checked:boolean; onChange:(v:boolean)=>void}) {
  const track = checked
    ? "bg-neutral-800 border-neutral-800 dark:bg-neutral-200 dark:border-neutral-200"
    : "bg-neutral-300/60 border-neutral-400/40 dark:bg-neutral-700/60 dark:border-neutral-600/50";
  const knobX = checked ? "translate-x-5" : ""; // 1.25rem shift on 2.5rem track
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="コンパクト表示トグル"
      onClick={(e)=>{ e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex h-5 w-10 items-center rounded-full border transition shadow-sm ${track}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white dark:bg-neutral-950 shadow transition-transform ${knobX}`} />
    </button>
  );
}

function ItemCard({ item, isDone, onToggle, compact, onToggleCompact }: { item: any; isDone: boolean; onToggle: () => void; compact: boolean; onToggleCompact: () => void; }) {
  const ModeToggleBtn = (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggleCompact(); }}
      className="inline-flex items-center rounded-full border border-neutral-300/80 dark:border-neutral-700/80 p-1.5 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition"
      aria-label={compact ? "この工程を通常表示にする" : "この工程をコンパクト表示にする"}
      title={compact ? "個別：通常表示" : "個別：コンパクト表示"}
    >
      <ChevronDown className={`h-4 w-4 transition-transform ${compact ? "rotate-0" : "rotate-180"}`} />
    </button>
  );

  const PlaceInline = () => (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggleCompact(); }}
      className="btn-inline min-w-0 text-left"
      aria-label="この工程の表示サイズを切替"
      title="表示サイズを切替"
    >
      <strong className="font-semibold truncate">{item.place}</strong>
      {item.note && (
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">（{item.note}）</span>
      )}
    </button>
  );

  const TopRow = () => (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <label className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="stamp"
          checked={isDone}
          onChange={onToggle}
          aria-label="このスポットを訪問済みにする"
        />
        <span className="time-roman font-bold text-sm shrink-0">{item.time}</span>
      </label>
      <div className="text-xs text-neutral-500">|</div>
      <PlaceInline />
    </div>
  );

  const Body = (
    <>
      {item.lead && (
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{item.lead}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        {item.stay && (
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{item.stay}</span>
        )}
        {item.move && (
          <span className="inline-flex items-center gap-1 text-neutral-500">
            <ArrowRight className="h-4 w-4" />（移動：{item.move}）
          </span>
        )}
        <a
          href={mapLink(item.place)}
          target="_blank"
          rel="noopener noreferrer external"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-full border border-neutral-300/80 dark:border-neutral-700/80 px-2.5 py-1 text-xs hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition"
          title="Googleマップで開く"
        >
          <MapPin className="h-3.5 w-3.5" /> Googleマップで開く
        </a>
      </div>

      {item.links?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.links.map((l: any, i: number) => (
            <LinkPill key={i} href={l.href}>{l.label}</LinkPill>
          ))}
        </div>
      )}
    </>
  );

  return (
    <motion.li initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
      <div
        onClick={onToggleCompact}
        className={`group rounded-3xl border p-4 shadow-sm transition-shadow duration-300 ${
          isDone
            ? "border-black/40 bg-black/5 dark:border-white/20 dark:bg-white/5"
            : "border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        } hover:shadow-md`}
      >
        {/* ヘッダー行は常に同じ構造＝位置がブレない */}
        <div className="flex items-center justify-between gap-3">
          {TopRow()}
          {ModeToggleBtn}
        </div>

        {/* 本文：通常のみ表示（コンパクト時は非表示） */}
        {!compact && (
          <div className="mt-3">
            {Body}
          </div>
        )}
      </div>
    </motion.li>
  );
}

// ---------------------------------
// DEV: ランタイム簡易テスト（consoleに結果を出力）
// ---------------------------------
function runDevTests() {
  try {
    console.assert(Array.isArray(days) && days.length >= 1, "days が配列であること");
    const uids = new Set<string>();
    days.forEach((d) => {
      console.assert(typeof d.id === "string" && d.id, "day.id 文字列");
      console.assert(Array.isArray(d.items), "day.items 配列");
      d.items.forEach((it) => {
        console.assert(typeof it.uid === "string" && it.uid, "item.uid 文字列");
        console.assert(!uids.has(it.uid), `uid 重複: ${it.uid}`);
        uids.add(it.uid);
        console.assert(typeof it.place === "string" && it.place.length > 0, "item.place 文字列");
        console.assert(typeof it.time === "string" && it.time.length > 0, "item.time 文字列");
        if (Array.isArray(it.links)) {
          it.links.forEach((l: any) => {
            console.assert(/^https?:\\/\\//.test(l.href), `外部リンクURL形式エラー: ${l.href}`);
          });
        }
        if (typeof it.place === "string" && it.place.includes("「")) {
          console.assert(it.place.includes("」"), `place のカギ括弧未閉: ${it.place}`);
        }
        // 紹介文の長さチェック（80-160文字推奨）
        console.assert(typeof it.lead === "string" && it.lead.length >= 80 && it.lead.length <= 160,
          `lead 推奨長(80-160)違反: ${it.uid} (${(it.lead or '').length})`);
      });
    });
    // 追加テスト：lodging の存在とフィールド
    console.assert(typeof lodging.title === "string" && lodging.title.length > 0, "lodging.title 必須");
    lodging.links.forEach((l) => {
      console.assert(/^https?:\\/\\//.test(l.href), `宿リンクURL形式エラー: ${l.href}`);
      console.assert(typeof l.label === "string" && l.label.length > 0, "宿リンクのlabel 必須");
    });
    const m = mapSrc("京都");
    console.assert(typeof m === "string" && m.includes("google.com/maps"), "mapSrc は地図URL文字列を返す");
    const m2 = (function(place){const q=encodeURIComponent(place+' 京都');return 'https://www.google.com/maps/search/?api=1&query='+q})('京都');
    console.assert(typeof m2 === "string" && m2.includes("google.com/maps/search"), "mapLink はGoogle検索リンクを返す");
    console.assert(!m2.includes("output=embed"), "mapLink は埋め込みURLを返さない");
    const igUrl = "https://www.instagram.com/example";
    console.assert(/instagram\\.com/i.test(igUrl), "Instagram URL 判定がtrue");
    console.assert(typeof ToggleSwitch === "function", "ToggleSwitch 定義済み");

    // 優先順位の検証（item > day > global）
    const effective = (globalVal: boolean, dayVal?: boolean, itemVal?: boolean) => (itemVal ?? (dayVal ?? globalVal));
    console.assert(effective(true, undefined, undefined) === true, "global true デフォルト");
    console.assert(effective(true, false, undefined) === false, "day override false 優先");
    console.assert(effective(false, true, undefined) === true, "day override true 優先");
    console.assert(effective(false, undefined, true) === true, "item override true 優先");

    console.info("[DEV] self-tests passed ✅");
  } catch (e) {
    console.error("[DEV] self-tests failed ❌", e);
  }
}

export default function App() {
  const [compactGlobal, setCompactGlobal] = useState(true);
  const [compactByDay, setCompactByDay] = useState<Record<string, boolean | undefined>>({});
  const [compactByItem, setCompactByItem] = useState<Record<string, boolean | undefined>>({});
  const { visited, toggle, reset } = useVisited();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(
    () => Object.fromEntries(days.map((d) => [d.id, false]))
  );

  // 有効値の算出（item > day > global）
  const isCompactEffective = (dayId: string, uid: string) => {
    const itemVal = compactByItem[uid];
    const dayVal = compactByDay[dayId];
    return itemVal ?? (dayVal ?? compactGlobal);
  };

  const toggleDay = (dayId: string) => setCollapsed((prev) => ({ ...prev, [dayId]: !prev[dayId] }));

  // 日単位のコンパクト切替：押した瞬間にその日の全工程を「統一」
  const toggleCompactDay = (dayId: string) => {
    const current = compactByDay[dayId] ?? compactGlobal;
    const next = !current;
    // 1) 日設定を更新
    setCompactByDay((prev) => ({ ...prev, [dayId]: next }));
    // 2) その日の item override を一旦クリア（統一挙動）
    setCompactByItem((prev) => {
      const copy = { ...prev } as Record<string, boolean | undefined>;
      const day = days.find((d) => d.id === dayId);
      if (day) day.items.forEach((it) => { copy[it.uid] = undefined; });
      return copy;
    });
  };

  // 個別のコンパクト切替：現在の有効状態を反転し、item override として保存
  const toggleCompactItem = (dayId: string, uid: string) => {
    const effective = isCompactEffective(dayId, uid);
    setCompactByItem((prev) => ({ ...prev, [uid]: !effective }));
  };

  useEffect(() => {
    runDevTests();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 mincho font-serif">
      <SectionNav />
      <Hero />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 print:pt-0">
        <header className="mb-8">
          {/* h1 はヒーロー内に配置。ここはコントロール群のみ */}
          <div className="mt-2 flex flex-wrap items-center gap-3" onClick={(e)=>e.stopPropagation()}>
            <span className="text-sm">コンパクト=</span>
            <strong className="text-sm">{compactGlobal ? "ON" : "OFF"}</strong>
            <ToggleSwitch checked={compactGlobal} onChange={(v)=>setCompactGlobal(v)} />
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="ml-4 text-sm underline underline-offset-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              チェックをすべてクリア
            </button>
          </div>
        </header>

        <section id="stay" className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Home className="h-5 w-5" />
            <h2 className="text-xl font-bold">宿・ベース</h2>
          </div>
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 bg-white/80 dark:bg-neutral-900/70 backdrop-blur shadow-sm">
            <p className="text-lg font-semibold">
              <strong>{lodging.title}</strong>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lodging.links.map((l, i) => (
                <LinkPill key={i} href={l.href}>
                  {l.label}
                </LinkPill>
              ))}
            </div>
          </div>
        </section>

        {days.map((d) => {
          const doneCount = d.items.filter((it) => visited[it.uid]).length;
          const isCollapsed = !!collapsed[d.id];
          const compactEffectiveDay = compactByDay[d.id] ?? compactGlobal;
          return (
            <section key={d.id} id={d.id} className="mb-16 scroll-mt-20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-black/80 dark:text-white/90" />
                <h2 className="text-xl md:text-2xl font-bold tracking-wide">{d.dateLabel}</h2>
                <span className="text-sm text-neutral-500">（済 {doneCount}/{d.items.length}）</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="inline-flex items-center gap-2" onClick={(e)=>e.stopPropagation()}>
                    <span className="text-sm">コンパクト=</span>
                    <strong className="text-sm">{compactEffectiveDay ? "ON" : "OFF"}</strong>
                    <ToggleSwitch checked={compactEffectiveDay} onChange={()=>toggleCompactDay(d.id)} />
                  </div>
                  <button
                    onClick={() => toggleDay(d.id)}
                    aria-expanded={!isCollapsed}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 dark:border-neutral-700/80 px-3 py-1 text-sm hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 transition"
                  >
                    {isCollapsed ? "ひらく" : "たたむ"}
                  </button>
                </div>
              </div>
              <div className="mt-2 h-px bg-gradient-to-r from-black/20 via-black/10 to-transparent dark:from-white/30 dark:via-white/10 rounded-full"></div>
              {d.summary && (
                <p className="text-neutral-700 dark:text-neutral-300 mb-3 leading-relaxed tracking-[0.02em]">{d.summary}</p>
              )}
              {d.departHint && (
                <p className="text-sm text-neutral-500 mb-4">［ <strong>{d.departHint}</strong> ］</p>
              )}

              {!isCollapsed && (
                <ol className={`relative ${compactEffectiveDay ? "space-y-2" : "space-y-4"}`}>
                  {d.items.map((item, idx) => {
                    const compactEffective = isCompactEffective(d.id, item.uid);
                    return (
                      <ItemCard
                        key={item.uid ?? idx}
                        item={item}
                        isDone={!!visited[item.uid]}
                        onToggle={() => toggle(item.uid)}
                        compact={compactEffective}
                        onToggleCompact={() => toggleCompactItem(d.id, item.uid)}
                      />
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}

        <footer className="mt-20 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-6 text-sm text-neutral-500">
          <p>
            本ページは旅程の視覚化用に作成。リンクは各公式/Instagram/予約ページに接続します。実走時間は混雑や天候で変動します。チェック状態は端末のローカルに保存されます。地図リンクは Google マップを新規タブで開きます。
          </p>
          <p className="mt-3">
            ※（移動：🚗◯分 / 👟◯分）は次の目的地までの目安。場所名はすべて<strong>太字</strong>で表記しています。
          </p>
        </footer>
      </main>

      <style>{`
        .mincho{font-family:"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","Source Han Serif","游明朝","ヒラギノ明朝 ProN W3",serif;letter-spacing:.01em}
        .time-roman{font-family:"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","Source Han Serif","游明朝","ヒラギノ明朝 ProN W3",serif;font-variant-numeric: oldstyle-nums proportional-nums;font-feature-settings:"onum" 1, "pnum" 1;letter-spacing:.02em}
        .btn-inline{background:transparent;border:0;padding:0;margin:0;line-height:1.4}
        .btn-inline[aria-disabled="true"]{pointer-events:none}
        /* 丸型の落款風“済”スタンプ */
        .stamp{appearance:none;-webkit-appearance:none;width:1.15rem;height:1.15rem;border:2px solid #111;border-radius:9999px;display:inline-grid;place-items:center;background:#fff;position:relative;transition:transform .15s ease, background .15s ease, border-color .15s ease, box-shadow .25s ease}
        .dark .stamp{border-color:#e5e5e5;background:#0a0a0a}
        .stamp:checked{
          background:#d62828; /* 朱赤 */
          border-color:#9f1c1c; /* 濃い輪郭 */
          color:#fff;
          transform:rotate(-6deg) scale(1.06);
          border-radius:9999px; /* 丸のまま（丸印）*/
          box-shadow:
            0 0 0 2px rgba(159,28,28,.85) inset, /* 内側の濃い輪郭 */
            0 0 0 3px rgba(214,40,40,.25);       /* 外側にじみ */
          background-image:
            radial-gradient(rgba(255,255,255,.08) 1px, transparent 1.6px),
            radial-gradient(rgba(0,0,0,.05) 1px, transparent 1.6px);
          background-size:3px 3px, 4px 4px; /* 微細なかすれ質感 */
          background-position:0 0, 1px 1px;
        }
        .dark .stamp:checked{
          box-shadow:
            0 0 0 2px rgba(0,0,0,.25) inset,
            0 0 0 3px rgba(214,40,40,.28);
        }
        .stamp::after{content:""}
        .stamp:checked::after{
          content:"済";
          font-weight:900;
          font-family:"印相体","HSSeals","DFSeals","A-OTF Seal Std","A-OTF Ryumin Pr6N","Yuji Boku","Yuji Mai","Yu Mincho","YuMincho","Noto Serif JP","Source Han Serif",serif;
          font-size:.66rem;line-height:1;letter-spacing:.04em;transform:translateY(-.5px);
          text-shadow:0 0 1px rgba(255,255,255,.2),0 0 1px rgba(255,255,255,.2);
        }
        .stamp:active{transform:scale(.98)}
        @media print {
          html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .sticky, nav, button, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; }
          section { break-inside: avoid; }
          input[type="checkbox"] { accent-color: black; }
          .map-frame { display:none !important; }
        }
      `}</style>
    </div>
  );
}
