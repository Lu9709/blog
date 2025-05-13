# 动画、SVG Sprite与滑动手势

### 多重RouterView与Transition
即同级页面展示多个视图，可以通过[命名视图](https://router.vuejs.org/zh/guide/essentials/named-views.html#%E5%91%BD%E5%90%8D%E8%A7%86%E5%9B%BE)。

修改`Welcome.tsx`，添加动画需要使用到`Transition`，还可以分别定义他们的样式。

```tsx
import { defineComponent, Transition, VNode } from 'vue'
import { RouteLocationNormalizedLoaded, RouterView } from 'vue-router'
import s from './Welcome.module.scss'
import logo from '../assets/icons/mangosteen.svg'
export const Welcome = defineComponent({
	setup: (props, context) => {
		return () =>
			<div class={s.wrapper}>
				<header>
					<img src={logo} />
					<h1>山竹记账</h1>
				</header>
				<main class={s.main}>
					<RouterView name="main">
						{({ Component: Content, route: R }: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
							<Transition enterFromClass={s.slide_fade_enter_from} enterActiveClass={s.slide_fade_enter_active}
								leaveToClass={s.slide_fade_leave_to} leaveActiveClass={s.slide_fade_leave_active}>
								{Content}
							</Transition>
						}
					</RouterView>
				</main>
				<footer>
					<RouterView name="footer" />
				</footer>
			</div>
	}
}
```

```css
.slide_fade_enter_active,
.slide_fade_leave_active {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease-out;
}

.slide_fade_enter_from {
  transform: translateX(100vw);
}
.slide_fade_leave_to {
  transform: translateX(-100vw);
} 
```

该处修改代码详细见[Github](https://github.com/Lu9709/mangosteen-font/commit/5258a1648ba75e57bd4ab741cdb8dd58abaacb65)。

### 自制Vite SVG Sprites插件
原理就是将所有的SVG放入一个大的SVG内，于是自写了一个用于vite的svg sprite插件，需要安装svgo和svgstore的依赖，`pnpm install svgo svgstore`，然后创建一个`svgstore.js`文件在`vite_plugins`文件夹下。

```javascript
/* eslint-disable */
import path from "path";
import fs from "fs";
import store from "svgstore"; // 用于制作 SVG Sprites
import { optimize } from "svgo"; // 用于优化 SVG 文件

export const svgstore = (options = {}) => {
  const inputFolder = options.inputFolder || "src/assets/icons"; // 获取icons文件夹的位置
  return {
    name: "svgstore",
    resolveId(id) { // 使得编译器跳过检查 
      if (id === "@svgstore") {
        return "svg_bundle.js";
      }
    },
    load(id) {
      if (id === "svg_bundle.js") {
        const sprites = store(options);
        const iconsDir = path.resolve(inputFolder);
        for (const file of fs.readdirSync(iconsDir)) { // 遍历读取的icons的文件夹下的路径
          const filepath = path.join(iconsDir, file); // 将svg文件的路径拼接成绝对路径
          const svgid = path.parse(file).name; // 将路径地址转换为对象取得文件名
          let code = fs.readFileSync(filepath, { encoding: "utf-8" }); // 读取文件夹的路径并转为编码utf-8
          sprites.add(svgid, code);
        }
        // 优化svg的属性内容，去除无用属性
        const { data: code } = optimize(
          sprites.toString({ inline: options.inline }),
          {
            plugins: [
              "cleanupAttrs",
              "removeDoctype",
              "removeComments",
              "removeTitle",
              "removeDesc",
              "removeEmptyAttrs",
              {
                name: "removeAttrs",
                params: { attrs: "(data-name|data-xxx)" },
              },
            ],
          }
        );
        // 将svg大标签放到页面元素中去
        return `const div = document.createElement('div')
        div.innerHTML = \`${code}\`
        const svg = div.getElementsByTagName('svg')[0]
        if (svg) {
        svg.style.position = 'absolute'
        svg.style.width = 0
        svg.style.height = 0
        svg.style.overflow = 'hidden'
        svg.setAttribute("aria-hidden", "true")
        }
        // listen dom ready event
        document.addEventListener('DOMContentLoaded', () => {
        if (document.body.firstChild) {
        document.body.insertBefore(div, document.body.firstChild)
        } else {
        document.body.appendChild(div)
        }
        })`;
      }
    },
  };
};

```

需要在`tsconfig.node.json`中配置包括执行的插件，因为`svgstore.js`加载SVG大标签需要在node环境在执行。

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "node"
  },
  "include": ["vite.config.ts","src/vite_plugins/**/*"]
}
```

还需要在`vite.config.ts`文件内导入配置。并在`main.ts`内导入使用的`svgstore.js`，需要添加`import '@svgstore'`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// @ts-nocheck
import { svgstore } from './src/vite_plugins/svgstore'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      transformOn: true,
      mergeProps: true
    }),
    svgstore()
  ]
})
```

### 封装useSwipe Hook
为了支持在手机可以通过滑动来实现翻页面，可以使用自定义的Hooks来支持滑动事件。通过ref来获取dom节点然后使用计算属性来算出滑动的距离，在来判定滑动的方向。

```tsx
import { computed, onMounted, onUnmounted, ref, Ref } from "vue";

type Point = {
  x: number;
  y: number;
}
export const useSwipe = (element: Ref<HTMLElement | null>) => {
  const start = ref<Point | null>(null)
  const end = ref<Point | null>(null)
  const swiping = ref(false)
  const distance = computed(() => {
    if (!start.value || !end.value) { return null }
    return {
      x: start.value.x - end.value.x,
      y: start.value.y - end.value.y
    }
  })
  const direction = computed(() => {
    if (!distance.value) { return '' }
    const { x, y } = distance.value
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'right' : 'left'
    } else {
      return y > 0 ? 'down' : 'up'
    }
  })
  const onStart = (e: TouchEvent) => {
    swiping.value = true
    end.value = start.value = { x: e.touches[0].screenX, y: e.touches[0].screenY }
  }
  const onMove = (e: TouchEvent) => {
    if (!start.value) { return }
    end.value = { x: e.touches[0].screenX, y: e.touches[0].screenY }
  }
  const onEnd = (e: TouchEvent) => {
    swiping.value = false
  }
  onMounted(() => {
    if (!element.value) { return }
    element.value.addEventListener('touchstart', onStart)
    element.value.addEventListener('touchmove', onMove)
    element.value.addEventListener('touchend', onEnd)
  })
  onUnmounted(() => {
    if (!element.value) { return }
    element.value.removeEventListener('touchstart', onStart)
    element.value.removeEventListener('touchmove', onMove)
    element.value.removeEventListener('touchend', onEnd)
  })
  return {
    swiping,
    direction,
    distance
  }
}
```



然后在`welcome.ts`x组件中使用`useSwipe`的hooks。

```tsx
import { defineComponent, ref, Transition, VNode, watchEffect } from 'vue'
import { RouteLocationNormalizedLoaded, RouterView } from 'vue-router'
import s from './Welcome.module.scss'
import { useSwipe } from '../hooks/useSwipe'
export const Welcome = defineComponent({
	setup: (props, context) => {
		const main = ref<HTMLElement | null>(null)
    const { direction, swiping } = useSwipe(main)
    watchEffect(() => {
      console.log(swiping.value, direction.value)
    })
		return () =>
			<div class={s.wrapper}>
				<header>
					<svg>
						<use xlinkHref='#mangosteen'/>
					</svg>
					<h1>山竹记账</h1>
				</header>
				<main class={s.main} ref={main}>
					<RouterView name="main">
						{({ Component: Content, route: R }: { Component: VNode, route: RouteLocationNormalizedLoaded }) =>
							<Transition enterFromClass={s.slide_fade_enter_from} enterActiveClass={s.slide_fade_enter_active}
								leaveToClass={s.slide_fade_leave_to} leaveActiveClass={s.slide_fade_leave_active}>
								{Content}
							</Transition>
						}
					</RouterView>
				</main>
				<footer>
					<RouterView name="footer" />
				</footer>
			</div>
	}
})
```

### 补充
技巧一：如何从一个最新的项目中git记录打一个补丁，拷贝至另一个旧项目中去，或是将另一个分支的git记录拷贝到另一个旧的分支中去。

先通过`git log`查看需要打补丁的`commit`记录，然后拷贝`commit`的编号，执行`git format-patch -1 <commit_record>`，然后将生成的补丁文件拷r本至旧项目中去(或者为旧分支)，执行`git am <patch_file>`，具体可查看该[链接](https://devconnected.com/how-to-create-and-apply-git-patch-files/)。

技巧二：`git diff <commit_record>`可以查看记录之间的不同点。

技巧三：`git commit . --amend -m <commit_record>`可以将现在提交的内容合并到上次提交的记录，若要修改`commit`的标题可以直接输入`git commit . --amend`

技巧四：`git show <commit_record>`可以查看提交的`commit`记录内容。`git show HEAD`查看当前最新提交的记录。

