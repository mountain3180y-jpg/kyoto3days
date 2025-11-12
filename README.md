# 京都 3DAYS 旅程（GitHub Pages 用）

シングルページの React + Vite + Tailwind サイト。  
**地図リンクは外部の Google マップ**（新規タブ）／**Instagram は公式アイコン**／**コンパクト表示はトグル**。

## 使い方（ローカル）
```bash
npm i
npm run dev
# http://localhost:5173 で確認
```

## デプロイ（GitHub Pages / Actions）
1. GitHub で新規リポジトリを作成（例: `kyoto3days`）。
2. このフォルダの中身をそのリポジトリに push（デフォルトブランチは `main` を推奨）。
3. リポジトリの **Settings → Pages** を開き、**Build and deployment → Source** を **GitHub Actions** に。
4. push すると自動でビルド＆デプロイ。完了後、Pages URL が表示されます。

### なぜ Vite の `base: './'` ?
GitHub Pages のサブパス（`https://<user>.github.io/<repo>/`）で**相対パスが安全**なため。  
画像は `public/kyoto_texture_header.png` に置き、`import.meta.env.BASE_URL + 'kyoto_texture_header.png'` で読んでいます。

## よくあるハマりどころ
- 画像が表示されない → `public/kyoto_texture_header.png` のパスを確認（`BASE_URL` 併用で解決）。
- Tailwind が効かない → node_modules を消して `npm ci` し直す、`tailwind.config.cjs` の `content` パスを確認。
- 真っ白になる → DevTools コンソールのエラーを確認。`lucide-react` / `framer-motion` が未インストールの可能性。

