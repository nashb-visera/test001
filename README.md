# Full-stack Login 範例

此專案示範如何使用 **React 18 + React Bootstrap** 建立前端登入頁，並以 **Spring Boot + Druid Connection Pool + Oracle + MyBatis Plus + Log4j2** 建立後端 API。

## 專案結構

```
backend/   # Spring Boot 專案
frontend/  # React (Vite) 專案
```

原有 `Test001.java`、`Test002.java` 仍保留，僅做範例用途。

## 後端 (Spring Boot)

### 主要功能
- `/api/auth/login`：接受帳號與密碼並檢查資料庫使用者。
- 使用 Druid connection pool 連線到 Oracle，並透過 MyBatis Plus 的 `UserMapper` 查詢 `APP_USER` 資料表。
- 密碼採 BCrypt 雜湊比對，並利用簡單的 `TokenService` 產生登入 token。
- 以 Log4j2 記錄登入成功與失敗訊息。

### 設定檔
`backend/src/main/resources/application.yml` 內可調整 Oracle 連線字串、Druid pool 與 Log4j2 等設定。

### 建置與啟動
```bash
cd backend
./mvnw spring-boot:run   # 若沒有 mvnw，可使用已安裝的 Maven: mvn spring-boot:run
```

啟動後後端服務預設為 `http://localhost:8080`。

## 前端 (React 18 + React Bootstrap)

### 主要功能
- `LoginForm` 元件提供帳號、密碼輸入欄位與送出按鈕。
- 透過 `useLogin` hook 呼叫後端 `/api/auth/login` API，並顯示登入成功或錯誤訊息。
- 以 React Bootstrap 的 Card、Form、Button 等元件快速打造 UI。

### 開發與預覽
```bash
cd frontend
npm install
npm run dev
```

Vite 會在 `http://localhost:5173` 提供開發伺服器，並已設定 proxy 轉發 `/api` 到後端 `8080` port。

### 打包
```bash
npm run build
```

會輸出在 `frontend/dist`。

## 資料庫範例 (Oracle)

`APP_USER` 資料表可包含以下欄位：

| 欄位 | 型別 | 說明 |
| ---- | ---- | ---- |
| ID | NUMBER | 主鍵 |
| USERNAME | VARCHAR2 | 帳號 (唯一) |
| PASSWORD_HASH | VARCHAR2 | BCrypt 雜湊密碼 |
| DISPLAY_NAME | VARCHAR2 | 顯示名稱 |
| ACTIVE | NUMBER(1) | 是否啟用 |
| LAST_LOGIN_AT | TIMESTAMP | 最近登入時間 |

可利用 `BCryptPasswordEncoder` 產生密碼雜湊後寫入。

## 測試登入流程
1. 啟動 Oracle 與建立 `APP_USER` 資料。
2. 啟動 Spring Boot 後端。
3. 啟動 React 前端並開啟 `http://localhost:5173`。
4. 輸入帳號、密碼後送出即可完成登入流程並看到成功訊息。
