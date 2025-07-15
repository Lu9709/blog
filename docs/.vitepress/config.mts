import { defineConfig } from 'vitepress'
import { MermaidPlugin, MermaidMarkdown } from 'vitepress-plugin-mermaid'

import sidebarConfig from '../../catalog/sidebar-config.json'

// 判断是否为 GitHub Pages 环境
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const base = isGitHubPages ? '/blog/' : '/'

export default defineConfig({
  base,
  title: "白褶的博客",
  description: "个人学习笔记和技术博客",
  lang: 'zh-CN',  // 设置整个站点的默认语言
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    },
  },
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.ico` }]
  ],
  themeConfig: {
    logo: '/logo.svg',
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
      { text: '学习笔记', link: '/repository/StudyNotes/git/git-config' }
    ],
    // 使用从 catalog 目录读取的侧边栏配置
    sidebar: sidebarConfig, 
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lu9709' }
    ],
    
    // 文档页脚配置
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    
    // 编辑链接配置
    editLink: {
      pattern: 'https://github.com/Lu9709/blog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    
    // 导航菜单标签
    langMenuLabel: '切换语言',
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题'
  },
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    },
    config: (md) => {
      md.use(MermaidMarkdown)
    }
  },
  vite: {
    // 添加构建优化配置
    build: {
      // 启用 chunk 分割
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 将大模块拆分成更小的块
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) {
                  return 'vue-vendor';
              }
              if (id.includes('vitepress') || id.includes('@vueuse')) {
                  return 'vitepress-vendor';
              }
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
            if (id.includes('sidebar-config')) {
              return 'sidebar-config'
            }
          }
        }
      }
    },
    plugins: [
      MermaidPlugin()
    ],
    optimizeDeps: {
      include: [
        'mermaid'
      ]
    },
    ssr: {
      noExternal: [
        'mermaid'
      ]
    }
  }
})
