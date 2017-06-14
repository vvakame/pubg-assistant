# PUBG Assistant [![CircleCI](https://circleci.com/gh/vvakame/pubg-assistant.svg?style=svg)](https://circleci.com/gh/vvakame/pubg-assistant)

## What is PUBG?

Game. [PLAYERUNKNOWN'S BATTLEGROUNDS](https://www.playbattlegrounds.com/). It's very fun!

## How to use?

Try [Web Demo](https://bot.api.ai/1e1b6371-3e1e-42ee-bbfe-23de753c916e)

## How is it works?

ユーザからの会話 → [api.ai](https://api.ai/)が頑張って会話をパラメータ化する → Cloud Functionsでパラメータ毎に適当に応答を返す。

今のところ存在するIntentは object-guide だけで、エリア名と対象（車 or 武器）を指定すると、ざっくりしたアドバイスをくれるだけです。

## How to improvement?

会話の強化方法はざっくりと2種類です。

1. api.aiが判別できる語彙を増やす [ここを編集するとmerge後自動的に反映](https://github.com/vvakame/pubg-assistant/blob/master/resources/api-ai/entities.yml)
2. 応答サーバが判定できる情報を増やす [ここを編集するとmerge後自動的に反映](https://github.com/vvakame/pubg-assistant/blob/master/resources/knowledge/object-guide.ja.yml)

### 語彙を増やす？

1. Sosnovka Military Base は基地とかミリタリーベースとか色々な言い方があるので言い換え（synonym）を増やす [ここから](https://github.com/vvakame/pubg-assistant/blob/master/resources/api-ai/entities.yml)
2. そもそも、ほしい地名がなかった！その場合もデータを増やせばOK！ [ここから](https://github.com/vvakame/pubg-assistant/blob/master/resources/api-ai/entities.yml)

### 語彙を増やしたけど期待した応答にならない

api.ai上でIntentのUser sayに追加するとうまくいく場合が多くあります。 
具体的にどういう文章を投げ込んだ時に上手くいかなかったか、どういう応答があることを期待したかをIssueに報告してみてください。

### アドバイスの内容を登録したり改良したりしたい

1. 基本的にはデータを編集するだけでOK [ここから](https://github.com/vvakame/pubg-assistant/blob/master/resources/knowledge/object-guide.ja.yml)
2. 地名のデータがapi.ai側に存在しない場合そもそも応答サーバにデータが来ないので [こっちもチェック](https://github.com/vvakame/pubg-assistant/blob/master/resources/api-ai/entities.yml)

## TODO

* 武器の性能とか弾の規格とか教えてくれる機能
  * 2丁を比べて性能上どっちが遠距離戦に向いてるかとかも知りたい
* Tipsを教えてくれる機能
  * いろいろ
  * 場所Orientedな情報

## Contributions

適当にymlとかを改良してもらってpull requestをくれると嬉しいです。 
masterにmergeされたら自動的にapi.aiのアップデートとCloud Functionsへのデプロイを行います。

## Disclaimer

みなさんが投げ込んだ会話内容はシステム管理者（この場合vvakame）が閲覧し、みんながどういった回答を求めているかなどに役立てます。 
個人の識別は基本的にできないですが、特徴的な事を書くと普通に分かってしまう場合もあると思うので気をつけてください。
