# 你是跑壘王！Web Game

單檔遊戲原始碼為 [index.html](index.html)。

## 分支與發布流程

- `youth.version`：測試分支。所有遊戲程式修改先提交至此，進行邏輯檢查、固定案例、互動流程與手機版驗收。
- `main`：正式發布分支。測試通過後，將 `youth.version` 的已驗證 commit 快轉至 `main`；GitHub Pages 正式站使用 `main`。
- 正式站：[跑壘王](https://bddgtw-tw.github.io/baserunner.game/)。

每次發版依序執行：

1. 在 `youth.version` 修改並標註版本，維持 `index.html` 單檔架構與既有題型相容性。
2. 驗證 JavaScript 語法、864 題矩陣、固定規則案例、答題到結果的操作，以及桌面與手機畫面。失敗留在測試分支修正。
3. 記錄測試結果與未驗證項目；只有必要驗收通過才快轉 `main`。
4. 讀回確認 `main` 指向通過驗收的 commit，再檢查 GitHub Pages 已更新、正式站可完整遊玩。正式站失敗時回到 `youth.version` 修正後重新發布。

狀態用 `DONE`、`UNVERIFIED`、`BLOCKED` 區分。推送成功不等於正式站驗收成功。

> 2026-10-06 流程切換時，兩分支起點相同；此前 `v20261006-01` 的正式站驗收仍為 UNVERIFIED。
