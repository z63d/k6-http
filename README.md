# k6 http

Test for https://test-api.k6.io

## k6 browser recorder

[Using the browser recorder](https://grafana.com/docs/k6/latest/using-k6/test-authoring/create-tests-from-recordings/using-the-browser-recorder/)

## Convert with har-to-k6

browser recorder（or [Chrome DevTools](https://grafana.com/docs/k6/latest/using-k6/test-authoring/create-tests-from-recordings/using-the-har-converter/#1-record-a-har-file)）で生成した HAR ファイルを k6 スクリプトに変換する。

https://grafana.com/docs/k6/latest/using-k6/test-authoring/create-tests-from-recordings/using-the-har-converter/

```sh
npx har-to-k6 example.har -o example.js
```

## Run k6

e.g.

```sh
k6 run example.js --out csv=result.csv
```
