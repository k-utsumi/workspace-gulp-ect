# workspace/gulp-ect

gulp-ect を使って作業する用のファイル群。


## Build 手順

1. nodebrew をインストール＋ path を通す
  > brew install nodebrew <br>
    echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bash_profile

1. node.js（バージョン不問）のインストール
  > nodebrew install-binary v0.10.22 <br>
    nodebrew use v0.10.22

1. パッケージファイルのインストール
  > npm install && bower install

1. 実行
  > gulp all

**注意：**
- npm install を実行すると ''node_modules/gulp-ect/index.js'' が上書きされるので git で戻してください。

## 画像圧縮・favicon 等のファイル（HTML, CSS, JS 以外）

### 画像

1. source/img/ 配下に格納し以下を実行する。
  > gulp imagemin

1. 圧縮された画像が htdocs/assets/img にディレクトリ構造にならって格納されます。

## それ以外

1. source/_init に置いて以下を実行

   > gulp init

1. htdocs/ 直下にディレクトリ構造にならってファイルが格納されます。
