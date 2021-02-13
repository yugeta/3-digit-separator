3-Digit-Separator
==

![title-banner](docs/banner.png)

```
Author : Yugeta.Koji
Date   : 2019.09.06
URL    : http://myntinc.com
Organization : MYNT.Inc,
ver 1.0 :
ver 1.1 : 設定済みフラグを設置して重複イベントを発生させない。
```

# Specification
  - 入力された数値に3桁毎にカンマを加える
  - 送信時にカンマを覗いた数値にする
  - 小数点、マイナス対応
  - 整数値は","(カンマ)区切り、少数値は" "(スペース)区切り ex) -1,234,567.123 456 789
  - 全角数値を半角数値に自動変換
  - 連動イベント対応：入力しなくても任意の項目の任意イベントと連動してdigit処理をする。

# Causion
  - 数値以外の文字列を入れると自動削除
  - "-"（マイナス）は、先頭文字列についていないと不要文字列として削除される。


# Options
  - input_selector : 対象の入力フォーム取得（複数対応） ex) "form input[type='text'][data-type='3digit_separator']"
  - hook_selector  : イベント起動の対象になるelement-selector（複数） ex) [{selector: "button[name='btn']", event_key: "event-key"},...]
  - interlocking_selector : "form input[type='text'][data-type='3digit_separator']"
