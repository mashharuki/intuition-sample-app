---
marp: true
theme: uncover
paginate: true
header: ""
footer: ""
backgroundColor: "#fefefe"
---

<style>
section {
  padding: 64px 72px;
  font-size: 26px;
  line-height: 1.4;
  letter-spacing: 0.2px;
}
h1 {
  font-size: 56px;
}
h2 {
  font-size: 42px;
}
h3 {
  font-size: 30px;
}
section.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
section.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
section.compact {
  font-size: 22px;
}
.card {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(12px);
}
.card.dark {
  background: rgba(0, 0, 0, 0.45);
}
.diagram {
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 20px;
  line-height: 1.4;
}
ul {
  margin: 0.3em 0 0.2em;
  padding-left: 1.1em;
}
li {
  margin: 0.2em 0;
}
table {
  width: 100%;
  font-size: 22px;
}
</style>

---
class: lead invert

![bg blur:2px brightness:0.7](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%230b1f3a'/><stop offset='1' stop-color='%2300527a'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/></svg>)

<div class="card">
<h1>Intuition</h1>
<p>分散型ナレッジグラフが実現する「情報の信頼レイヤー」</p>
</div>

---

## 今日お話しすること

* Intuitionとは — プロジェクトの全体像
* ナレッジグラフとは — 基礎知識のおさらい
* Intuitionの重要な概念 — Atom / Triple / Signal
* 期待されるユースケース — 実用シナリオ

---
class: invert

![bg blur:2px brightness:0.7](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23111327'/><stop offset='1' stop-color='%233b1d4f'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/></svg>)

<div class="card dark">
<h2>Intuitionとは</h2>
</div>

---

## Intuition — プロジェクト概要

“Blockchains have decentralized money. Intuition decentralizes information.”

* 世界初のトークンキュレーテッド・ナレッジグラフを構築するプロトコル
* 情報の信頼・所有権・発見性・収益化を分散化
* ネイティブトークン $TRUST によるインセンティブ設計
* Information Finance (InfoFi) という新領域を提唱

---
class: split compact

## Intuitionのアーキテクチャ

<div>

### レイヤー / 名称

| レイヤー | 名称 |
| --- | --- |
| L3 ブロックチェーン | Intuition Network |
| プロトコル | Intuition Protocol |
| 実行環境 | Rust Subnet |
| 開発者向け | SDK |

</div>
<div>

### 役割

| 項目 | 内容 |
| --- | --- |
| 決済・調整レイヤー | Base上のArbitrum Orbit |
| 経済設計 | Atom / Triple / Signal の定義 |
| クエリ基盤 | リアルタイムAPI / GraphQL |
| 開発体験 | TypeScript SDK・クライアントライブラリ |

</div>

---

## なぜIntuitionが必要か

* 現在のWeb情報は断片的・出所不明・中央集権的
* AIエージェントが増加する時代に信頼できるデータ基盤が不可欠
* プラットフォームに閉じた「いいね」「レビュー」は持ち運べない
* Intuitionは情報を検証可能・所有可能・経済的価値付きに変換する

---
class: invert

![bg blur:2px brightness:0.7](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%230b2b2f'/><stop offset='1' stop-color='%2300565a'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/></svg>)

<div class="card dark">
<h2>ナレッジグラフとは</h2>
</div>

---

## ナレッジグラフの基本

ナレッジグラフとは、実世界のエンティティとその関係をグラフ構造（ノードとエッジ）で表現した知識表現の仕組み

* ノード（Node）: 人、場所、概念などのエンティティ
* エッジ（Edge）: エンティティ間の関係（「所属する」「位置する」等）
* 2012年にGoogleが検索改善のために導入し広く普及
* RDF (Resource Description Framework) では主語-述語-目的語の三つ組で表現

---

## ナレッジグラフの強み

| 特徴 | 説明 |
| --- | --- |
| 知識の統合 | 異なるデータソースを統一的なグラフに集約 |
| 複雑な関係の表現 | 多対多・階層的・循環的な関係もモデル化可能 |
| 推論と知識発見 | 既存の関係から新たな事実を導出できる |
| 柔軟な検索 | RDBでは難しいグラフ横断クエリが高速 |

---
class: center

## Intuitionの重要な概念

### Atom / Triple / Signal

---

class: split

## Atom — 知識の最小単位

<div>

* あらゆるエンティティや概念に付与される一意の識別子 (DID)
* 人、組織、スマートコントラクト、抽象概念など何でも表現可能
* 誰でもパーミッションレスに新しいAtomを作成できる
* ボンディングカーブと経済的インセンティブにより、コミュニティは自然と正規化されたAtomに収束する

</div>
<div>

### キーポイント

* Atomは「レゴブロック」のように組み合わせて知識を構築していく

</div>

---

class: split

## Triple — 構造化された主張

<div>

* 主語 (Subject) - 述語 (Predicate) - 目的語 (Object) の三つ組
* 3つのAtomを結びつけて意味のある主張 (Attestation) を形成
* Triple自体を新たなAtomとして扱い、高次の主張も構築できる

</div>
<div>

### 例

* [Tiger Research] - [Founded In] - [2021]
* [Alice] - [knows] - [Bob]
* [Agent X] - [hasSkill] - ["translation"]

</div>

---

class: compact

## Signal — 信頼の経済的表現

* Atom や Triple に対して $TRUST トークンをステーキングする行為
* 各Tripleには Positive Vault と Negative Vault の2つが存在

| 操作 | 意味 |
| --- | --- |
| Positive Vaultにステーク | その主張は正しい / 有用と信じる |
| Negative Vaultにステーク | その主張は誤り / 不適切と考える |

* 正しい判断をしたユーザーは報酬を得る (Token Curated Registry)
* 情報の質がコミュニティ全体で経済的に担保される仕組み

---

class: split

## 3つの概念の関係

<div>

* Atomで知識を定義
* Tripleで構造化
* Signalで信頼性を付与

この3層がIntuitionのナレッジグラフの根幹を成す

</div>
<div class="diagram">
[Atom A]  述語(Atom B)  -->  [Atom C]
    |
    = Triple
    |
    +--- Signal (Positive / Negative)
         $TRUST ステーキング
</div>

---
class: invert

![bg blur:2px brightness:0.7](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2310182f'/><stop offset='1' stop-color='%232b4c7e'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/></svg>)

<div class="card dark">
<h2>期待されるユースケース</h2>
</div>

---

class: split

## ユースケース (1) Web3 / DeFi

<div>

* ウォレットの信頼性評価
  * コントラクトやdAppの安全性をコミュニティがAttestation
  * フィッシングサイトや詐欺トークンの検出に活用

</div>
<div>

* 分散型レピュテーション
  * プラットフォームに依存しない、ポータブルな評判システム
  * DeFiプロトコル間で信用情報を共有

</div>
---

class: split

## ユースケース (2) AIエージェント

<div>

* エージェントの発見と信頼
  * AIエージェントにDIDを付与し、スキルや実績をTripleで記録
  * 「Agent Xは翻訳タスクを10件完了した」等の検証可能な履歴

</div>
<div>

* 信頼できるコンテキストとメモリ
  * エージェントが共有ナレッジグラフから検証済みデータを取得
  * 中央集権的なディレクトリに依存しないエージェント間連携

</div>
---

class: split

## ユースケース (3) Web2 / 一般ユーザー

<div>

* パーソナライズドインターネット
  * ユーザーの好み・評価がポータブルなアイデンティティに
  * アプリを跨いで「自分の直感」を持ち運べる世界

</div>
<div>

* コンテンツ推薦の革新
  * プラットフォームのアルゴリズムではなく、信頼する人のSignalに基づくレコメンド
  * 推薦者自身も経済的報酬を受け取れる

</div>
---

class: compact

## まとめ

| 要素 | ポイント |
| --- | --- |
| Intuition | 情報を検証可能・所有可能にする分散型ナレッジグラフ |
| Atom | あらゆるエンティティの一意な識別子 |
| Triple | 主語-述語-目的語による構造化された主張 |
| Signal | $TRUSTステーキングによる信頼の経済的表現 |
| ビジョン | Web3 / AI / Web2を横断する「インターネットの信頼レイヤー」 |

---

class: split compact

## 参考文献

<div>

* Intuition公式ドキュメント  
  https://www.docs.intuition.systems/
* 0xIntuition GitHub  
  https://github.com/0xIntuition
* Intuition Whitepaper  
  https://cdn.prod.website-files.com/65cdf366e68587fd384547f0/66ccda1f1b3bbf2d30c4f522_intuition_whitepaper.pdf
* Tiger Research  
  https://reports.tiger-research.com/p/intuition-eng

</div>
<div>

* MEXC Learn  
  https://www.mexc.co/learn/article/what-is-intuition-redefining-internet-data-ownership-through-blockchain/1
* Phemex Academy  
  https://phemex.com/academy/what-is-intuition-trust
* Caldera Blog  
  https://caldera.xyz/blog/intuition-mainnet-now-live-on-caldera

</div>
