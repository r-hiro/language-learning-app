# 単語データ

このフォルダには、3言語単語学習アプリで使う単語データを置きます。

- `words.json`: 単語データ本体です。
- `words.js`: ブラウザで直接読み込むためのファイルです。`window.WORD_DATA` として読み込まれます。

`words.json` を更新した場合は、プロジェクトルートで次を実行して `words.js` も更新してください。

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\generate-words.ps1
```
