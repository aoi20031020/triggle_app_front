# Triggle
Triggle is a strategic board game that can be played with two to four players.

※https://github.com/iiojun/Triggle からクローンしました（2025/01/18）。

## 変更点
一通りログを取れるようになってます。

consoleから見れます

誰がどのポールを配置したのかログで追うことができます。

また、その時の得点の動きも分かります。

ゲームの結果と棋譜をサーバーに送信してDBに保存できるようにしました。

### コメント
あんまりjsをclassで書かないので大変だったです。

type使えなくて不安でした。

## DEMO
ローカルのみ実装しています

動かす場合はVScodeの拡張機能の「Live Server」を使用してください。

導入方法→https://qiita.com/kaiyo_yume/items/be77f0f35763c556cd46

corsの関係で"localhost:5500"からじゃないと通信失敗します

## バックエンド
https://github.com/aoi20031020/triggle_app_service
