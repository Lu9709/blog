import { defineConfig } from 'vitepress'

import sidebarConfig from '../../catalog/sidebar-config.json'

// 判断是否为 GitHub Pages 环境
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = isGitHubPages ? '/blog/' : '/'

export default defineConfig({
  base,
  title: "白褶的博客",
  description: "",
  lang: 'zh-CN',  // 设置整个站点的默认语言
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    },
  },
  themeConfig: {
    // 最后更新时间文本配置
    outline: {
      level: [2, 6],
      label: '大纲'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    // 添加搜索功能配置
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '学习笔记', link: '/repository/StudyNotes/GIT/git-config', activeMatch: '/repository/StudyNotes/' }
    ],
    // 使用从 catalog 目录读取的侧边栏配置
    sidebar: sidebarConfig,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lu9709' }
    ]
  },
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  }
})
