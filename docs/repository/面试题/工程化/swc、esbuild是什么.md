# swc、esbuild是什么?

### swc

实现语言：Rust

功能：编译JS/TS，打包JS/TS

优势：比Babel快很多（20倍以上）

能否集成webpack：可以

使用者：`Next.js`、`Parcel`、`Deno`、`Vercel`、`ByteDance`、`Tencent`、`Shopify`...

无法实现：
1. 对TS代码进行类型检查（用tsc可以）
2. 打包CSS、SVG

### esbuild

实现语言：Go

功能：同上

优势：比Babel快很多（10～100倍）

能否集成webpack：可以

使用者：`vite`、`vuepress`、`snowpack`、`umijs`、`blitz.js`...

无法实现：
1. 对TS代码进行类型检查
2. 打包CSS、SVG