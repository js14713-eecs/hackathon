# HANDOFF — Adream Journeys 黑客松原型

> 交接日期：2026-10-30 · 工作目录：`C:\Users\sjs20\Documents\Qoder\2026-10-30\15c745e4`
> 给接手的模型：先读第 1、2、6、7 节，再读第 10 节（坑）和第 11 节（下一步优先级）。

---

## 1. 项目是什么

上海真爱梦想公益基金会的**公益成果展示原型**（对标 charitywater.org/our-work），黑客松参赛作品。

三层叙事：

1. **地图**：每个发光的点 = 发生过研学旅程的地方（省份 + 地点）。
2. **地点页**：该地点的项目 → 每一届的纵向时间线（Stage 1..N）。
3. **故事页**：一届学生"1 个核心问题 → 若干转折 → N 个瞬间"的完整故事线。

服务两类人：**捐赠人**（看见钱变成了什么）和**下一代孩子**（看见"我也能出发"）。

另外有 **Teacher AI Studio**：老师上传零散素材（文字 + 照片）→ agent 生成故事线 → 预览 → 一键发布到地图和 timeline。这是本项目的核心差异化（节省运营成本的杠杆）。

**硬性约束：站点前台所有用户可见文案必须全英文。** 原始素材可以是中文，由 LLM 翻译；离线 fallback 不翻译（已知限制，见第 10 节）。

---

## 2. 当前状态快照

- 分支：`main`，本地 **ahead origin/main 1 个提交**，**未 push**（Gitee，见第 9 节）。
- 已提交：`e338881 Add teacher AI agent: raw materials (text+photos) -> journey storyline -> one-click publish`
- **工作区有未提交改动**（洪崖洞测试那一轮）：

```
 M client/src/api.js
 M client/src/components/Timeline.jsx
 M client/src/pages/TeacherPage.jsx
 M client/src/styles.css
 M server/src/agent.js          # timeline 带 moments；max_tokens 3000 + 可选 enable_thinking=false
 M server/src/data.js           # 新增 Chongqing 站点
 M server/src/index.js          # /api/agent/samples?set=
 M server/.env.example          # 增加 OPENAI_DISABLE_THINKING 说明
?? server/samples/hongyadong/   # 4 个 md + 2 张用户提供的照片
?? HANDOFF.md
```

- 本地数据库 `server/data.db`（gitignored，60KB）当前内容：
  - seed 故事 id 1–4（福建/吉林/甘肃/河南）
  - id 5、6：seed 里两条被 AI 整理过的贵州故事（location=Uncategorized）
  - **id 12：洪崖洞（LLM 产出，全英文，5 阶段）**
  - **id 13：南京梦想队（LLM 产出，全英文，5 阶段）**
  - 旧的离线中文版 id 8、10 与草稿 id 11 已删除
- 地点数据 10 个：Yunnan / Henan / Shandong / Jilin / Xinjiang / Fujian / Gansu / Shanghai / **Nanjing** / **Chongqing**
- 地图 API 当前返回 10 个地点、6 个带坐标的 ready 故事（seed 4 条 + 南京 + 洪崖洞）。
- 生产构建通过（`npm run build`，只有 1.2MB chunk 体积警告）。

---

## 3. 运行方式

要求 **Node 24+**（用了 `node:sqlite` 的 `DatabaseSync` 和 `process.loadEnvFile`，低版本会直接崩）。

```bash
npm install          # workspace 根目录，一次装好 client + server
npm run dev          # server :4000（node --watch）+ client :5173（vite，代理 /api /uploads /samples）
npm run build        # 构建 client/dist，server 会自动托管它
npm start            # 生产模式：只起 server，访问 :4000
```

可选重置数据库（会重新灌 seed 故事）：

```bash
rm server/data.db    # 下次启动自动重建 + seed
```

Windows 常见问题：旧 dev server 占端口时 `EADDRINUSE` / Vite 跳到 5174，导致你改的代码"没生效"。处理：

```bash
netstat -ano | grep -E ":(4000|5173)" | grep LISTEN
taskkill //PID <pid> //F
```

**验证入口**（无自动化测试，全部靠浏览器 + API 实测）：

- `/` 地图（ECharts 实例暴露在 `window.__adreamMap`，方便脚本断言）
- `/location/chongqing`、`/location/nanjing`
- `/teacher` → `Sample · Hongyadong` → `Generate storyline` → `Publish to website`
- `/story/12`（洪崖洞）、`/story/13`（南京）
- `/hot`、`/submit`

---

## 4. 目录结构

```
client/
  src/
    App.jsx                 # 路由 + 顶部 nav + footer（/ /location/:id /story/:id /submit /teacher /hot）
    api.js                  # 所有 fetch 封装 + TYPES + timeAgo
    components/
      ChinaMap.jsx          # ECharts 中国地图：geo + effectScatter(地点) + scatter(故事点)
      Timeline.jsx          # 通用纵向时间线；现在会渲染节点上的 moments
    pages/
      Home.jsx              # hero / 地图 / IMPACTS / Student Stories / Join
      LocationPage.jsx      # 地点页：项目卡片 + 选中的项目 timeline
      StoryPage.jsx         # 故事页：hero + Timeline + stats + attachments + 点赞
      SubmitPage.jsx        # 旧的上传表单（/api/stories，异步 AI 整理）
      TeacherPage.jsx       # ★ Teacher AI Studio（新主流程）
      HotPage.jsx           # 热榜（hotScore）
    styles.css              # 全站唯一样式表（CSS 变量 + 组件类）
  public/
    geo/china.json          # 本地中国地图 GeoJSON（避免外网依赖）
    img/*.png               # 通用插画（hero/sea/snow/classroom/caravan）
  vite.config.js            # 代理 /api /uploads /samples → :4000

server/
  src/
    index.js                # Express 路由 + multer + 静态托管 + SPA fallback
    data.js                 # TYPES / LOCATIONS / PARTICIPATING / FEATURED_GEO / IMPACTS / SEED_STORIES
    db.js                   # node:sqlite，建表 + 迁移 + 所有读写函数
    agent.js                # ★ 故事线生成（视觉 LLM + 离线启发式 fallback）
    llm.js                  # 旧 /api/stories 用的文本整理器（organizeStory）+ coerceLocation
  samples/
    nanjing/                # 6 个中文 md + 4 张 AI 生成插画
    hongyadong/             # 4 个中文 md + 2 张用户实拍夜景
  .env.example              # OpenAI 兼容配置说明（真 .env 已被 gitignore）
  data.db                   # gitignored
  uploads/                  # gitignored，旧上传表单的附件
```

---

## 5. 数据模型

### 5.1 DB（`server/src/db.js`）

`stories` 表（关键列）：

| 列 | 说明 |
|---|---|
| `title/summary/raw` | 标题、摘要、原始素材全文 |
| `location` | 必须是 `LOCATIONS[].name` 之一，否则 `Uncategorized` |
| `lng/lat` | 有坐标才会出现在地图 story 点 |
| `timeline` | JSON 字符串：timeline 节点数组 |
| `stats` | JSON 字符串：`[[value,label],...]` |
| `tags` | JSON 字符串：小写英文数组 |
| `image` | 旧字段，AI 发布的故事目前为 null |
| `status` | `processing`（旧上传流程）/ `draft`（agent 草稿）/ `ready`（前台可见）/ `failed` |
| `storyline` | JSON 字符串：**完整故事线对象**（turns/moments/openQuestions/outcomes） |
| `likes/created_at` | 点赞数、毫秒时间戳 |

`attachments`：旧上传表单的文件记录。

启动时自动迁移 `storyline` 列（`PRAGMA table_info` + `ALTER TABLE`）。

`seedIfEmpty()`：**只有 stories 表完全为空**才灌 seed；删光后重启会重新 seed。

### 5.2 故事线对象（agent 产出）

```json
{
  "title": "英文标题 <100",
  "theme": "一句话主题",
  "summary": "2-3 句英文摘要",
  "question": "驱动整段旅程的核心问题",
  "subQuestions": ["行前的 2-3 个具体问题"],
  "turns": [
    { "lab": "阶段短标签", "t": "阶段标题", "d": "1-2 句描述",
      "ph": ["Preparation|Challenges|Field Work|Collaboration|Creation|Reflection|Outcomes"],
      "moments": [{ "t": "瞬间标题", "d": "一句细节" }] }
  ],
  "openQuestions": [{ "q": "留给下一届的问题", "d": "为什么重要" }],
  "outcomes": ["2-4 条具体产出"],
  "stats": [["6","students"]],
  "tags": ["architecture"],
  "location": "Chongqing",
  "lng": 106.579, "lat": 29.562,
  "timeline": [{ "y":"Phase 1","lab":"...","t":"...","d":"...","ph":[...],"st":[],"moments":[...] }],
  "dataKind": "provided"
}
```

- `timeline` 是 turns 的投影（`y = Phase N`），**发布时写进 stories.timeline**。
- `moments` 同时写入 timeline 节点（2026-10-30 修复），否则发布后的 Phase 卡片没有细节。
- `st`（节点级数字）fallback 不生成，保留为空数组。

---

## 6. Teacher AI 主流程（重点）

### 6.1 前端 `/teacher`（`TeacherPage.jsx`）

1. 左侧 Materials：textarea + 拖拽/选择文件（`image/*` 走视觉，`.txt/.md` 并入文本）+ 缩略图。
2. 两个样例按钮：`Sample · Nanjing` / `Sample · Hongyadong` → `GET /api/agent/samples?set=xxx`，文本填入，图片 fetch 成 `File` 做预览。
3. `Generate storyline`：前端把图片 `resizeImage()`（canvas 最长边 1280，JPEG 0.85）后 `POST /api/agent/generate`。
4. 右侧 DraftPreview：engine 徽标（`AI engine · model` / `Offline organizer · no API key`）、标题、位置、tags、THE QUESTION + 子问题、THE TURNS（含 moments）、LEFT FOR THE NEXT COHORT、OUTCOMES + stats。
5. `Publish to website` → `POST /api/agent/:id/publish` → 成功后给 `/story/:id` 和 `/` 入口。

### 6.2 服务端

`POST /api/agent/generate`（`index.js`）：

- multer 临时文件（≤8 个）→ 文本文件拼进 `raw`；`image/*` 读成 `{mime,b64}`；临时文件立即删除。
- `generateStoryline({ text, images })`（`agent.js`）。
- `createDraftStory()` + `saveDraftStoryline()` → 返回 `{ id, engine, model, data }`。

`POST /api/agent/:id/publish`：`draft → ready`，`publishStory()` 返回 changes。

### 6.3 LLM 与 fallback（`agent.js`）

- OpenAI 兼容 `POST {OPENAI_BASE_URL}/chat/completions`，`Authorization: Bearer`，`temperature 0.3`。
- 图片按标准 `image_url: { url: "data:<mime>;base64,..." }` 发送，最多 4 张，文本截断 8000 字。
- 400 重试链：① 去掉 `response_format` → ② 去掉图片只发文本 → 再把失败抛给 fallback。
- 未配 key / 请求失败 → `fallbackStoryline(rawText)`（纯启发式，**不翻译**）：
  - 标题 = 第一行（去掉 `：` 后内容，截 80）
  - `核心研究问题|研究问题|研究主题` → question；`- ...？` 行 → subQuestions（前 3）
  - `^#{1,4}` 标题切段 → turns（前 6 段，lab 截 30 字）
  - 段内 `-` 开头 → moments；长段落 → `d`
  - `延伸|后续|接力|新问题` 段 → openQuestions
  - `成果|收获|产出` 段（优先有 bullet 的）→ outcomes
  - 统计：`N名 / N天 / N张 / N页 / N本`（支持六/七/八…）
  - tags：建筑→architecture、绘本→picture-book、研学→study-journey、合作→teamwork、民国→heritage、复盘→reflection、探索→exploration
  - location：`CN_CITY_LOC` 命中且该英文名存在于 `LOCATIONS` 才采用（否则 Uncategorized）

### 6.4 LLM 配置现状（重要）

- 配置文件：`server/.env`（**gitignored**，不要提交）。**当前已有一个可用的 DashScope（阿里云百炼）key**，实测 agent 走 LLM 分支。
- 当前配置：

```bash
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_API_KEY=<有效 key，找项目负责人要>
OPENAI_MODEL=qwen3.8-omni-flash   # 支持图片理解，免费额度可用
OPENAI_DISABLE_THINKING=1         # Qwen3/omni：关闭 reasoning，避免吃掉输出预算
```

- 实测：洪崖洞（文本 + 2 图）约 22s，南京（文本 + 4 图）约 33s，输出全英文、5 个 turns、坐标正确。
- 账号处于"仅免费额度"模式：`qwen3-vl-plus` 已返回 `403 AllocationQuota.FreeTierOnly`；`qwen3.8-omni-flash` 目前可用。额度耗尽时同样会 403，代码只对 400 做重试，403 会直接走 fallback（页面仍可用）。
- 关键适配（`agent.js`）：`max_tokens: 3000` 必须保留——Qwen3 的 reasoning token 会挤占输出，默认上限下会出现 `content` 为空、报 "No JSON in LLM response"；`enable_thinking=false` 通过环境变量开关，换到不支持该字段的厂商时删掉 `OPENAI_DISABLE_THINKING` 即可。
- ECNU 平台（`https://chat.ecnu.edu.cn/open/api/v1`）之前试过，token 一直 401，暂不作为默认。
- 备选免费视觉模型：智谱 `https://open.bigmodel.cn/api/paas/v4` + `glm-4.5v-flash`；DashScope `qwen3-vl-plus`（需额度）；SiliconFlow `https://api.siliconflow.cn/v1`。
- `server/.env.example` 是给团队看的模板，不要把真 key 写进去。
- 有 key 时输出**全英文**；删掉 key 会走离线版，标题/阶段保持中文原文。

---

## 7. HTTP API 一览

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/map` | 地点 + 带坐标的 ready 故事（最多 30）+ 层级数据 |
| GET | `/api/locations` | 全部地点详情（含 projects/timeline） |
| GET | `/api/locations/:id` | 单个地点 |
| GET | `/api/impacts` | 首页 6 个影响力数字 |
| GET | `/api/stories?sort=new\|hot` | 故事列表（只返回 ready） |
| GET | `/api/stories/:id` | 故事详情（timeline/stats/tags/storyline/attachments 已解析） |
| POST | `/api/stories/:id/like` | 点赞 +1（无去重，无用户体系） |
| POST | `/api/stories` | 旧流程：上传文字/文件 → 异步 `organizeStory`（`llm.js`） |
| GET | `/api/agent/samples?set=nanjing\|hongyadong` | 读取样例素材（文本 + 图片 URL） |
| POST | `/api/agent/generate` | 生成草稿（multipart：`text` + `files`） |
| POST | `/api/agent/:id/publish` | 草稿发布 |
| GET | `/samples/*` | 样例图片静态服务 |
| GET | `/uploads/*` | 旧上传附件静态服务 |
| GET | `*`（非 api/uploads/samples） | SPA fallback → `client/dist/index.html`（仅当 dist 存在） |

---

## 8. 地图与 UI 约定

- `ChinaMap.jsx`：单 geo 层 + 三类 series：
  - `effectScatter`：LOCATIONS 点（含南京、重庆），点击 → `/location/:id`
  - `scatter`：故事点（`data.id`），点击 → `/story/:id`
  - `geo` 的 `roam` 开启，修复过 zoom 后 highlight 移位的问题（不要改回旧写法）
- 地图 GeoJSON：`/geo/china.json`，本地文件，离线可跑。
- 视觉系统（`styles.css`）：奶油底 `#faf6ee`、深海军蓝 `#0d2438`、琥珀 `#f5a623`、橙 `#ff6b35`；圆角 18–32px；字体 Segoe UI / PingFang SC。
- 页面级组件类：`.map-wrap`、`.tl-*`（timeline）、`.card`、`.story-*`、`.tc-*`（teacher studio）、`.impact-*`、`.join-*`。
- 首页 hero 的 "See the Timelines" 等 CTA、footer 免责声明（数据来源/示意图/AI 整理需人工复核）不要随意删。

---

## 9. 协作与仓库

- Gitee：`https://gitee.com/jonas_shih/hackathon.git`，`main` 分支，协作者上限 5 人。
- 本地领先 1 个提交（`e338881`）**且未 push**；工作区还有洪崖洞那轮未提交改动。**push 前必须向用户确认。**
- 提交规范：一句话英文祈使句 + 正文可选；历史上都是单提交打包一个功能。
- `.gitignore`：`server/.env`、`server/data.db`、`server/uploads/`、`client/dist/`、`node_modules/`、`vibe_images/`（临时脚本/截图）。

---

## 10. 已知问题 / 坑（改之前先看）

1. **LLM 依赖免费额度**：见 6.4。当前 DashScope key 可用，生成走 LLM（约 20–35s）；额度耗尽时接口返 403，代码不重试、直接回退离线版（页面仍可用，但会出中文原文）。演示前先跑一次 `/teacher` 确认 engine 徽标是 `AI engine`。
2. **离线 fallback 不翻译**：中文素材 → 中文标题/摘要/阶段名，前台会出现中文（违反"全英文"目标）。演示时要么配有效 key，要么手工改 `data.js`/DB 里的英文文案。
3. **地图标签拥挤**：窄屏（≈660px）和低 zoom 下省份名互相压住；故事点与地点点也可能重合。可用 label 分级显示/`labelLayout.hideOverlap` 或按 zoom 控制 label。
4. **移动端导航缺失**：`@media(max-width:900px)` 直接 `display:none` 掉 `.nav-links`，没有汉堡菜单，手机只能靠 footer。
5. **前端 bundle 1.2MB**（ECharts 全量）：可改按需引入或 `manualChunks`，不影响功能。
6. **无自动化测试**：验收靠浏览器 + `window.__adreamMap` 断言 + `/api/*`。改动后至少跑：生成→发布→故事页→地图→地点页。
7. **点赞无去重/无账号**：只在前端 `liked` 状态里防连点，刷新可再点。
8. **发布后仍显示 "AI-ORGANIZED DRAFT"**：`StoryPage` 文案写死，没有 editorial review 状态位；若要"已审核"语义需要加字段。
9. **AI 发布故事没有专属配图**：`stories.image` 为 null，首页/热榜会退回到同一张 `/img/hero.png`，多个 AI 故事看起来一模一样。可把上传图片存为封面并写回 `image`（同时补 `/uploads` 或 `/samples` 访问路径）。
10. **旧上传流程 `/submit` 与新 agent 流程并存**：两套整理器（`llm.js` vs `agent.js`），长期应收敛成一套，否则行为不一致。
11. **Windows/Git Bash**：curl `-F "text=中文"` 会因控制台编码变乱码（不是服务端 bug），用浏览器或 Node `FormData` 测。
12. **端口残留**：`node --watch` 改 `.env` 不会重启（只监听 src 文件）；改环境变量后手动重启 server。
13. **数据库是本地单文件**：没有独立迁移工具（只有启动时 `PRAGMA table_info` + `ALTER TABLE` 的极简迁移），多人协作时不要提交 `data.db`，各自 seed。
14. **`GET /api/map` 只取前 30 条故事**，演示数据少时无感，多起来要分页/聚合。

---

## 11. 下一步优先级（用户已认可的路线）

### P0 · 讲故事的"纵深"（评委最看重）

1. **Journey 沉浸页**：`1 个问题 → 3 个转折 → N 个瞬间`。
   - 现在的 `/story/:id` 只是 timeline；需要把 `storyline` 的 question/turns/moments/openQuestions 做成带节奏的滚动叙事（sticky 问题、转折卡片、瞬间墙）。
2. **同地点多年纵向时间线 + 接力**：
   - 地点页把不同届/不同队按年份纵向排；往届在结尾留问题（`openQuestions`），下一届"接力认领"（按钮 + 简单状态即可）。
   - 数据现状：一个地点只有一个 project，需要 `LOCATIONS[].projects` 支持多届（年份/队伍/接力关系）。
3. **影响力闭环**：点赞数 → 影响力分/捐赠人成就墙（如"你支持的第 3 支队伍完成了旅程"）。

### P1 · 演示完成度

4. 再做 **2–3 个打磨过的 demo 项目**（真实素材结构 + 英文产出 + 配图），覆盖不同项目类型（Go Far / Caravan / Sports）。
5. 去掉页面上的 placeholder 感：AI 发布故事补封面图、首页故事卡降级样式、空状态。
6. 教师批注图层（老师可在 timeline 节点上补一句点评，存 DB）。

### P2 · 工程与体验

7. 移动端 nav（汉堡菜单）、地图标签防重叠。
8. 合并两套整理器、统一错误/状态提示。
9. 前端按需引入 ECharts 或代码分割。

---

## 12. 交接验收清单（接手后先跑一遍）

```bash
npm install
rm -f server/data.db        # 可选，重置演示数据
npm run dev
```

浏览器依次确认：

- [ ] `/` 地图渲染、10 个地点高亮、故事点可点
- [ ] `/location/nanjing` 与 `/location/chongqing` 图片全部加载
- [ ] `/teacher` → `Sample · Hongyadong` → 文本 + 2 张缩略图载入
- [ ] `Generate storyline` → 引擎徽标显示 `AI engine · qwen3.8-omni-flash`，约 20–35s 出稿（全英文、5 个 turns、3 个 openQuestions、location=Chongqing）
- [ ] `Publish to website` → `/story/:id` 有 5 段 timeline，每个 Phase 都能看到 moments
- [ ] `/story/12`（洪崖洞）与 `/story/13`（南京）标题/阶段全英文，chips 可跳转
- [ ] `/api/map` 里新故事带 `[106.579, 29.562]`，ECharts `effectScatter` 含 Chongqing
- [ ] `npm run build` 通过
- [ ] 临时删掉 `server/.env` 重启，重跑洪崖洞应回退离线版（中文），确认无 key 也可演示

---

## 13. 给接手模型的协作约定

- 用户用中文沟通；**先给结论和可执行动作，不要长篇分析**（用户明确说过"不要过度思考"）。
- 优先保证**离线可演示**：没有 API key 时全流程必须仍可跑（fallback 是刻意设计，不要删）。
- 前台英文、代码注释极少、不要引入新依赖除非必要（现有依赖：express/multer/vite/react/router/echarts/concurrently）。
- 改数据前先看 `server/src/data.js` 与 `db.js`；改地图/时间线务必回归第 12 节清单。
- 任何 push、删除数据库、重写 seed 内容属于高风险动作，先向用户确认。
