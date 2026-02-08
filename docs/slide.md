---
marp: true
theme: gaia
paginate: true
header: "Intuition"
footer: "Confidential | © 2026"
backgroundColor: "#f8fafc"
---

<style>
/* 
  Style Guide & Design System 
  Inspired by: https://qiita.com/hirokidaichi/items/243bd176b84900f4cc0d
*/
header, footer {
  color: #000000 !important; /* Force black header/footer */
  font-weight: 700 !important;
  opacity: 1 !important;
}

:root {
  /* Colors - Ultra High Contrast */
  --primary: #020817;      /* Slate 950 - Almost Pure Black Blue */
  --secondary: #115e59;    /* Teal 800 - Darker Teal */
  --accent: #9a3412;       /* Orange 800 - Darker Amber */
  --dark: #000000;         /* Pure Black */
  --text-main: #000000;    /* Pure Black */
  --text-muted: #1f2937;   /* Gray 800 - Very Dark Gray */
  --bg-light: #f8fafc;     /* Slate 50 */
  
  /* Spacing */
  --gap-sm: 0.5rem;
  --gap-md: 1rem;
  --gap-lg: 2rem;
  --gap-xl: 4rem;
}

/* Global Reset & Typography */
section {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 26px;
  line-height: 1.5;
  color: var(--text-main);
  padding: 3rem 4rem;
  background-color: var(--bg-light);
  letter-spacing: 0.01em;
  font-weight: 500; /* Medium weight base */
}

h1, h2, h3, h4, h5, h6 {
  color: var(--primary);
  line-height: 1.2;
  margin-bottom: 0.8em;
  font-weight: 900; /* ExtraBold */
}

h1 { font-size: 2.5em; }
h2 { font-size: 1.8em; border-bottom: 5px solid var(--secondary); padding-bottom: 0.2em; margin-bottom: 1em; }
h3 { font-size: 1.3em; color: var(--secondary); font-weight: 800; }

strong { color: var(--primary); font-weight: 900; }
em { color: var(--secondary); font-style: normal; font-weight: 800; }

/* Tailwind-like Utilities */
.text-xs { font-size: 0.75em; }
.text-sm { font-size: 0.875em; }
.text-lg { font-size: 1.125em; }
.text-xl { font-size: 1.25em; }
.text-2xl { font-size: 1.5em; }
.text-3xl { font-size: 1.875em; }
.text-4xl { font-size: 2.25em; }

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-white { color: white !important; }
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-muted { color: var(--text-muted); }

.font-bold { font-weight: 800; }
.font-light { font-weight: 500; } /* Normal weight (was 300/400) - Fixed "too thin" issue */

.w-full { width: 100%; }
.h-full { height: 100%; }

.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }

.m-0 { margin: 0; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }

/* Grid Layouts */
.grid { display: grid; gap: var(--gap-lg); }
.grid-cols-2 { grid-template-columns: 1fr 1fr; }
.grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.items-center { align-items: center; }
.items-start { align-items: start; }

/* Components */
.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #94a3b8; /* Slate 400 - Clearer border */
}

.card-glass {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  color: white;
  padding: 2.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.4);
}

.tag {
  display: inline-block;
  background: var(--secondary);
  color: white;
  padding: 0.4em 1.2em;
  border-radius: 9999px;
  font-size: 0.75em;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th {
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: #e2e8f0; /* Darker header bg */
  color: var(--text-main);
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.85em;
  letter-spacing: 0.05em;
  border-bottom: 3px solid #94a3b8;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #cbd5e1;
}

tr:last-child td {
  border-bottom: none;
}

/* Background Gradients (CSS Implementation) */
/* Title: Blue to Teal */
section.bg-title {
  background-image: linear-gradient(135deg, #1B4565 0%, #3E9BA4 100%) !important;
  color: white;
}

/* Divider 1: Dark Blue to Blue */
section.bg-divider-1 {
  background-image: linear-gradient(135deg, #0f172a 0%, #1B4565 100%) !important;
  color: white;
}

/* Divider 2: Dark Blue to Teal */
section.bg-divider-2 {
  background-image: linear-gradient(135deg, #0f172a 0%, #3E9BA4 100%) !important;
  color: white;
}

/* Divider 3: Blue to Amber */
section.bg-divider-3 {
  background-image: linear-gradient(135deg, #1B4565 0%, #F59E0B 100%) !important;
  color: white;
}

/* Summary: Dark Blue to Darker */
section.bg-summary {
  background-image: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  color: white;
}

/* Marp Class Overrides */
section.lead {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

section.lead h1 {
  font-size: 3.5em;
  margin-bottom: 0.2em;
  border: none;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5); /* Stronger shadow */
}

section.lead p {
  font-size: 1.5em;
  opacity: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

section.invert {
  color: white;
}

section.invert h1, section.invert h2, section.invert h3 {
  color: white;
  border-color: rgba(255, 255, 255, 0.6);
}

section.divider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

section.divider h2 {
  font-size: 3em;
  border: none;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
}
</style>

<!-- Title Slide -->
<!-- _class: lead invert bg-title -->

<div class="card-glass">
  <div class="tag">Decentralized Knowledge Graph</div>
  <h1>Intuition</h1>
  <p class="font-light">分散型ナレッジグラフが実現する<br/>「情報の信頼レイヤー」</p>
</div>

---

<!-- Agenda -->
<div class="grid grid-cols-2 items-center h-full">
  <div>
    <h2 class="m-0">Agenda</h2>
    <p class="text-muted font-bold">本日のアジェンダ</p>
  </div>
  <div class="card bg-white">
    <ol class="text-lg">
      <li class="mb-4"><strong>Intuitionとは</strong><br/><span class="text-muted text-sm">プロジェクトの全体像</span></li>
      <li class="mb-4"><strong>ナレッジグラフとは</strong><br/><span class="text-muted text-sm">基礎知識のおさらい</span></li>
      <li class="mb-4"><strong>重要な概念</strong><br/><span class="text-muted text-sm">Atom / Triple / Signal</span></li>
      <li><strong>期待されるユースケース</strong><br/><span class="text-muted text-sm">実用シナリオ</span></li>
    </ol>
  </div>
</div>

---

<!-- Section Divider 1 -->
<!-- _class: divider invert bg-divider-1 -->

<div class="tag">Section 01</div>

## Intuitionとは

---

## Intuition — プロジェクト概要

<div class="grid grid-cols-2 items-start">
  <div>
    <p class="text-2xl font-bold text-primary italic mb-4">
      “Blockchains have decentralized money.<br/>Intuition decentralizes information.”
    </p>
    <p class="text-muted">
      Intuitionは、情報の信頼、所有権、発見性、そして収益化を分散化するためのプロトコルです。
    </p>
  </div>
  <div class="card">
    <ul class="text-lg">
      <li class="mb-4">世界初の<strong>トークンキュレーテッド・ナレッジグラフ</strong></li>
      <li class="mb-4">ネイティブトークン <strong>$TRUST</strong> によるインセンティブ設計</li>
      <li><strong>Information Finance (InfoFi)</strong> という新領域を提唱</li>
    </ul>
  </div>
</div>

---

## Intuitionのアーキテクチャ

<div class="grid grid-cols-2 gap-8">
  <div class="card">
    <h3 class="text-center">レイヤー構成</h3>
    <table>
      <thead>
        <tr><th>レイヤー</th><th>名称</th></tr>
      </thead>
      <tbody>
        <tr><td>L3 Chain</td><td>Intuition Network</td></tr>
        <tr><td>Protocol</td><td>Intuition Protocol</td></tr>
        <tr><td>Execution</td><td>Rust Subnet</td></tr>
        <tr><td>Dev Tools</td><td>SDK</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <h3 class="text-center">役割と機能</h3>
    <table>
      <thead>
        <tr><th>項目</th><th>内容</th></tr>
      </thead>
      <tbody>
        <tr><td>決済・調整</td><td>Arbitrum Orbit on Base</td></tr>
        <tr><td>経済設計</td><td>Atom / Triple / Signal</td></tr>
        <tr><td>クエリ</td><td>Realtime API / GraphQL</td></tr>
        <tr><td>開発体験</td><td>TypeScript SDK</td></tr>
      </tbody>
    </table>
  </div>
</div>

---

## なぜIntuitionが必要か

<div class="grid grid-cols-2 items-center">
  <div>
    <div class="card mb-4">
      <h3>現状の課題</h3>
      <ul class="text-sm">
        <li>Web情報は断片的で出所不明</li>
        <li>中央集権的なプラットフォームによる管理</li>
        <li>「いいね」や「レビュー」は持ち運べない</li>
      </ul>
    </div>
    <div class="text-center text-2xl text-muted">⬇︎</div>
    <div class="card mt-4 border-l-4 border-l-secondary">
      <h3>Intuitionの解決策</h3>
      <ul class="text-sm">
        <li>情報を<strong>検証可能</strong>に</li>
        <li>データを<strong>所有可能</strong>に</li>
        <li>信頼に<strong>経済的価値</strong>を付与</li>
      </ul>
    </div>
  </div>
  <div class="p-8 text-center">
    <p class="text-xl font-bold text-primary">AIエージェント時代の<br/>信頼基盤</p>
    <p class="text-muted mt-4">
      AIが生成する大量の情報の中で、<br/>
      「何を信じるか」を判断するための<br/>
      分散型インフラが不可欠になる
    </p>
  </div>
</div>

---

<!-- Section Divider 2 -->
<!-- _class: divider invert bg-divider-2 -->

<div class="tag">Section 02</div>

## ナレッジグラフとは

---

## ナレッジグラフの基本

<div class="grid grid-cols-2 items-center">
  <div>
    <p class="text-xl">
      実世界のエンティティとその関係を<br/>
      <strong>グラフ構造（ノードとエッジ）</strong>で<br/>
      表現した知識表現の仕組み
    </p>
    <div class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-sm text-muted">2012年にGoogleが検索改善のために導入し広く普及。RDF (Resource Description Framework) では主語-述語-目的語の三つ組で表現。</p>
    </div>
  </div>
  <div class="card text-center">
    <svg width="300" height="200" viewBox="0 0 300 200">
      <circle cx="50" cy="100" r="30" fill="#1B4565" />
      <text x="50" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Node</text>
      <circle cx="250" cy="100" r="30" fill="#3E9BA4" />
      <text x="250" y="105" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Node</text>
      <line x1="80" y1="100" x2="220" y2="100" stroke="#475569" stroke-width="2" marker-end="url(#arrow)" />
      <text x="150" y="90" text-anchor="middle" fill="#475569" font-size="12" font-weight="bold">Edge (Relationship)</text>
    </svg>
  </div>
</div>

---

## ナレッジグラフの強み

<div class="card">
  <table>
    <thead>
      <tr><th style="width: 25%">特徴</th><th>説明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>知識の統合</strong></td>
        <td>異なるデータソースを統一的なグラフに集約し、サイロ化を防ぐ</td>
      </tr>
      <tr>
        <td><strong>複雑な関係性</strong></td>
        <td>多対多・階層的・循環的な関係も自然にモデル化可能</td>
      </tr>
      <tr>
        <td><strong>推論と発見</strong></td>
        <td>既存の関係から新たな事実を導出（推論）できる</td>
      </tr>
      <tr>
        <td><strong>柔軟な検索</strong></td>
        <td>RDB（SQL）では難しい「友達の友達」のようなグラフ横断クエリが高速</td>
      </tr>
    </tbody>
  </table>
</div>

---

<!-- Section Divider 3 -->
<!-- _class: divider invert bg-divider-3 -->

<div class="tag">Section 03</div>

## 重要な概念

---

## Atom — 知識の最小単位

<div class="grid grid-cols-2 items-center">
  <div class="card bg-gray-50">
    <h3 class="text-primary">定義</h3>
    <ul class="text-lg">
      <li>あらゆるエンティティの一意な識別子 (DID)</li>
      <li>人、組織、契約、概念など何でも表現可能</li>
      <li>誰でもパーミッションレスに作成可能</li>
    </ul>
  </div>
  <div>
    <div class="p-6 border-l-4 border-secondary">
      <h4 class="m-0 text-secondary">レゴブロックのような構成要素</h4>
      <p class="text-muted mt-2">
        Atomは知識を構築するための最小単位です。
        ボンディングカーブと経済的インセンティブにより、
        コミュニティは自然と正規化されたAtomに収束します。
      </p>
    </div>
  </div>
</div>

---

## Triple — 構造化された主張

<div class="grid grid-cols-2 items-start">
  <div>
    <p>3つのAtomを結びつけて意味のある<br/><strong>主張 (Attestation)</strong> を形成します。</p>
    <div class="mt-8 p-4 bg-white rounded-xl shadow-lg text-center">
      <span class="tag bg-primary">Subject</span>
      <span class="mx-2 text-muted">→</span>
      <span class="tag bg-secondary">Predicate</span>
      <span class="mx-2 text-muted">→</span>
      <span class="tag bg-accent">Object</span>
    </div>
    <p class="text-sm text-center mt-2 text-muted">Triple自体も新たなAtomとして扱われます</p>
  </div>
  <div class="card">
    <h3>Examples</h3>
    <ul class="text-sm font-mono bg-gray-50 p-4 rounded-lg">
      <li class="mb-2">[Tiger Research] - [Founded In] - [2021]</li>
      <li class="mb-2">[Alice] - [knows] - [Bob]</li>
      <li>[Agent X] - [hasSkill] - ["translation"]</li>
    </ul>
  </div>
</div>

---

## Signal — 信頼の経済的表現

<div class="grid grid-cols-2 items-center">
  <div>
    <p class="text-lg mb-4">
      AtomやTripleに対して <strong>$TRUST</strong> トークンを<br/>
      ステーキングすることで、情報の質を担保します。
    </p>
    <div class="card bg-gray-50 border-0">
      <h4 class="text-sm text-muted uppercase">Token Curated Registry</h4>
      <p class="text-sm">正しい判断をしたユーザーは報酬を得る仕組みにより、コミュニティ全体で情報の真偽を精査します。</p>
    </div>
  </div>
  <div class="card">
    <h3 class="text-center mb-4">Staking Vaults</h3>
    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="p-4 bg-green-50 rounded-lg border border-green-200">
        <div class="text-2xl mb-2">👍</div>
        <strong class="text-green-700">Positive</strong>
        <p class="text-xs text-muted mt-1">正しい / 有用</p>
      </div>
      <div class="p-4 bg-red-50 rounded-lg border border-red-200">
        <div class="text-2xl mb-2">👎</div>
        <strong class="text-red-700">Negative</strong>
        <p class="text-xs text-muted mt-1">誤り / 不適切</p>
      </div>
    </div>
  </div>
</div>

---

## 3つの概念の関係性

<div class="grid grid-cols-2 items-center">
  <div class="text-lg">
    <ol>
      <li class="mb-6">
        <strong>Atom</strong> で知識を定義<br/>
        <span class="text-sm text-muted">名詞的な存在</span>
      </li>
      <li class="mb-6">
        <strong>Triple</strong> で構造化<br/>
        <span class="text-sm text-muted">文脈と関係性の付与</span>
      </li>
      <li>
        <strong>Signal</strong> で信頼性を付与<br/>
        <span class="text-sm text-muted">経済的裏付けのある評価</span>
      </li>
    </ol>
  </div>
  <div class="card text-center font-mono text-sm">
    <div class="p-2 border border-dashed border-gray-300 rounded mb-2">Atom A (Subject)</div>
    <div class="text-muted">↓</div>
    <div class="p-2 border border-dashed border-gray-300 rounded my-2 bg-gray-50">
      <strong>Triple</strong><br/>
      (Predicate: Atom B)
    </div>
    <div class="text-muted">↓</div>
    <div class="p-2 border border-dashed border-gray-300 rounded mt-2">Atom C (Object)</div>
    
    <div class="mt-4 pt-4 border-t border-gray-200">
      <span class="text-accent font-bold">Signal ($TRUST)</span><br/>
      Positive / Negative
    </div>
  </div>
</div>

---

<!-- Section Divider 4 -->
<!-- _class: divider invert bg-divider-3 -->

<div class="tag">Section 04</div>

## 期待されるユースケース

---

## ユースケース (1) Web3 / DeFi

<div class="grid grid-cols-2 gap-8">
  <div class="card">
    <h3 class="text-primary">🛡️ ウォレットの信頼性評価</h3>
    <p class="text-sm text-muted mb-4">コントラクトやdAppの安全性をコミュニティがAttestation</p>
    <ul class="text-sm">
      <li>フィッシングサイトの検出</li>
      <li>詐欺トークンの警告</li>
      <li>スマートコントラクトの監査履歴</li>
    </ul>
  </div>
  <div class="card">
    <h3 class="text-secondary">⭐ 分散型レピュテーション</h3>
    <p class="text-sm text-muted mb-4">プラットフォームに依存しないポータブルな評判</p>
    <ul class="text-sm">
      <li>DeFiプロトコル間の信用スコア共有</li>
      <li>DAO貢献度の可視化</li>
      <li>アンダーコラテラルローンの実現</li>
    </ul>
  </div>
</div>

---

## ユースケース (2) AIエージェント

<div class="grid grid-cols-2 items-center">
  <div>
    <h3 class="mb-4">エージェントの発見と信頼</h3>
    <p class="mb-4">
      AIエージェントにDIDを付与し、<br/>
      スキルや実績をTripleで記録します。
    </p>
    <div class="p-4 bg-gray-100 rounded-lg text-sm font-mono">
      "Agent X" - "hasCompleted" - "Translation Task #123"<br/>
      <span class="text-green-600">Verified by 50 Signals</span>
    </div>
  </div>
  <div>
    <h3 class="mb-4">信頼できるコンテキスト</h3>
    <ul class="text-lg">
      <li class="mb-2">中央集権的なディレクトリに依存しない</li>
      <li class="mb-2">検証済みデータを共有ナレッジグラフから取得</li>
      <li>エージェント間の自律的な連携を促進</li>
    </ul>
  </div>
</div>

---

## ユースケース (3) Web2 / 一般ユーザー

<div class="grid grid-cols-2 gap-8">
  <div class="card bg-white">
    <h3>🎨 パーソナライズ</h3>
    <p>
      ユーザーの好みや評価がポータブルなアイデンティティになります。<br/>
      アプリを跨いで「自分の直感（Intuition）」を持ち運べる世界。
    </p>
  </div>
  <div class="card bg-white">
    <h3>💡 推薦の革新</h3>
    <p>
      プラットフォームのアルゴリズムではなく、<br/>
      <strong>信頼する人のSignal</strong>に基づくレコメンド。<br/>
      推薦者自身も経済的報酬を受け取れます。
    </p>
  </div>
</div>

---

<!-- Summary -->
<!-- _class: invert bg-summary -->

<div class="grid grid-cols-2 items-center h-full">
  <div>
    <h2 class="text-4xl border-none mb-8">Summary</h2>
    <p class="text-xl opacity-80">
      Intuitionは、Web3, AI, Web2を横断する<br/>
      <strong>「インターネットの信頼レイヤー」</strong>を構築します。
    </p>
  </div>
  <div class="card-glass">
    <ul class="text-lg">
      <li class="mb-4"><strong>Atom</strong>: あらゆるエンティティのID</li>
      <li class="mb-4"><strong>Triple</strong>: 構造化された知識のネットワーク</li>
      <li class="mb-4"><strong>Signal</strong>: 信頼の経済的証明</li>
      <li><strong>InfoFi</strong>: 情報の価値化と流動化</li>
    </ul>
  </div>
</div>

---

<!-- References -->
## 参考文献・リンク

<div class="grid grid-cols-2 gap-8">
  <div class="card text-sm">
    <h3 class="text-base text-primary mb-2">Official Resources</h3>
    <ul class="list-none p-0">
      <li class="mb-2"><a href="https://www.docs.intuition.systems/">Intuition Documentation</a></li>
      <li class="mb-2"><a href="https://github.com/0xIntuition">GitHub (0xIntuition)</a></li>
      <li><a href="https://cdn.prod.website-files.com/65cdf366e68587fd384547f0/66ccda1f1b3bbf2d30c4f522_intuition_whitepaper.pdf">Whitepaper</a></li>
    </ul>
  </div>
  <div class="card text-sm">
    <h3 class="text-base text-primary mb-2">Articles & Analysis</h3>
    <ul class="list-none p-0">
      <li class="mb-2"><a href="https://reports.tiger-research.com/p/intuition-eng">Tiger Research Report</a></li>
      <li class="mb-2"><a href="https://www.mexc.co/learn/article/what-is-intuition-redefining-internet-data-ownership-through-blockchain/1">MEXC Learn</a></li>
      <li><a href="https://caldera.xyz/blog/intuition-mainnet-now-live-on-caldera">Caldera Blog</a></li>
    </ul>
  </div>
</div>
