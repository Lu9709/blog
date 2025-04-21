### [column-count](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-count)

#### 描述

`column-count` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性将一个元素的内容分成指定数量的列。

#### 语法

```
/* 关键字值 */
column-count: auto;

/* <integer> 值 */
column-count: 3;

/* 全局值 */
column-count: inherit;
column-count: initial;
column-count: revert;
column-count: revert-layer;
column-count: unset;
```
**取值**：

* `auto` —— 用来表示列的数量由其他 CSS 属性指定，例如 [column-width](https://developer.mozilla.org/en-US/docs/Web/CSS/column-width)。
* [`<integer>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/integer) —— 用来描述元素内容被划分的理想列数
#### 形式语法

```css
column-count = auto | <integer [1,∞]>
```
### [column-fill](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-fill)

#### 描述

`column-fill` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性可控制元素内容分成列时的平衡方式。

#### 语法

```css
/* 关键字值 */
column-fill: auto;
column-fill: balance;
column-fill: balance-all;

/* 全局值 */
column-fill: inherit;
column-fill: initial;
column-fill: revert;
column-fill: revert-layer;
column-fill: unset;
```
**取值**：

* [auto](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-fill#auto) —— 按顺序填充列。内容只占用其所需的空间，可能导致某些列保持空白。
* [balance](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-fill#balance) —— 内容平均分配到各列。在片段式上下文中，如 [CSS 分页媒体](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_paged_media)，只有最后一个片段是平衡的。因此，在分页媒体中，只有最后一页是平衡的。
* [balance-all](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-fill#balance-all) ——（实验性） 内容平均分配到各列。在片段式上下文中，如 [CSS 分页媒体](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_paged_media)，所有片段都是平衡的。
#### 形式语法

```css
column-fill = auto｜balance｜balance-all
```
### [column-gap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-gap)

#### 描述

`column-gap` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性用来设置元素列之间的间隔（[gutter](https://developer.mozilla.org/zh-CN/docs/Glossary/Gutters)）大小。

`column-gap` 一开始是 [Multi-column 布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_multicol_layout)下的特有属性，后来在其他布局中也使用这个属性。如 [CSS 盒子对齐](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_alignment)中的表述，该属性已经可以在 Multi-column（多列布局）、Flexible Box（弹性盒子）以及 Grid layout（网格布局）中使用。

#### 语法

```css
/* Keyword value */
column-gap: normal;

/* <length> values */
column-gap: 3px;
column-gap: 2.5em;

/* <percentage> value */
column-gap: 3%;

/* Global values */
column-gap: inherit;
column-gap: initial;
column-gap: revert;
column-gap: revert-layer;
column-gap: unset;
```
**取值**：

* [normal](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-gap#normal) —— 表示列之间的间隔宽度。在 多列布局 时默认间隔为 1em，其他类型布局默认间隔为 0。
* [`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length) —— 用 [`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length) 来定义列之间的间隔大小。而且 [`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length) 值必须是非负数的。
* [`<percentage>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage) —— 用 [`<percentage>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage)（百分比）来定义列之间的间隔大小。同样的，[`<percentage>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage) 值也必须是非负数的。
#### 形式语法

```css
column-gap = normal｜<length-percentage [0,∞]>

<length-percentage> = <length>｜<percentage>
```
### [column-rule](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule)

#### 描述

`column-rule` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) [简写属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Shorthand_properties)可以在多列布局中设定分割线的宽度、样式和颜色。

#### 语法

```css
column-rule: dotted;
column-rule: solid 8px;
column-rule: solid blue;
column-rule: thick inset blue;

/* 全局值 */
column-rule: inherit;
column-rule: initial;
column-rule: revert;
column-rule: revert-layer;
column-rule: unset;
```
**取值**：`column-rule` 属性可以按任何顺序指定为下面列出的一个、两个或三个值。

* [`<column-rule-width>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule#column-rule-width) —— 定义为 [`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length) 或是 thin、medium、thick 关键字的其中一个。请参阅 [border-width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-width)。
* [`<column-rule-style>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule#column-rule-style) —— 请参阅 [border-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-style) 以获取可能的值和详细信息。
* [`<column-rule-color>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule#column-rule-color) —— 一个 [`<color>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value) 值。
#### 形式语法

```css
column-rule =
  <'column-rule-width'>  ||
  <'column-rule-style'>  ||
  <'column-rule-color'>

<column-rule-width> =
  <line-width>

<column-rule-style> =
  <line-style>

<column-rule-color> =
  <color>

<line-width> =
  <length [0,∞]>  |
  thin            |
  medium          |
  thick

<line-style> =
  none    |
  hidden  |
  dotted  |
  dashed  |
  solid   |
  double  |
  groove  |
  ridge   |
  inset   |
  outset
```
### [column-rule-color](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule-color)

#### 描述

`column-rule-color` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性设置在多列布局中列与列之间绘制的线的颜色。

#### 语法

```css
/* <color> 值 */
column-rule-color: red;
column-rule-color: rgb(192 56 78);
column-rule-color: transparent;
column-rule-color: hsl(0 100% 50% / 60%);

/* 全局值 */
column-rule-color: inherit;
column-rule-color: initial;
column-rule-color: revert;
column-rule-color: revert-layer;
column-rule-color: unset;
```
**取值**：[`<color>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value) —— 用于单独设置列之间分割线的颜色。（只能指定单个`<color>`值）

#### 形式语法

```css
column-rule-color = <color>
```
### [column-rule-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule-style)

#### 描述

`column-rule-style` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性设置多列布局中列之间绘制的线条的样式。

#### 语法

```css
/* <'border-style'> 值 */
column-rule-style: none;
column-rule-style: hidden;
column-rule-style: dotted;
column-rule-style: dashed;
column-rule-style: solid;
column-rule-style: double;
column-rule-style: groove;
column-rule-style: ridge;
column-rule-style: inset;
column-rule-style: outset;

/* 全局值 */
column-rule-style: inherit;
column-rule-style: initial;
column-rule-style: revert;
column-rule-style: revert-layer;
column-rule-style: unset;
```
**取值**：[`<border-style>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule-style#border-style) —— 是由 [border-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-style) 定义的关键字，用于描述规则的样式，样式必须按照合并边框模型进行解释。

#### 形式语法

```css
column-rule-style =
  <line-style>

<line-style> =
  none    |
  hidden  |
  dotted  |
  dashed  |
  solid   |
  double  |
  groove  |
  ridge   |
  inset   |
  outset
```
### [column-rule-width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule-width)

#### 描述

`column-rule-width` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性设置多列布局中列之间绘制的线条的宽度。

#### 语法

```css
/* 关键字值 */
column-rule-width: thin;
column-rule-width: medium;
column-rule-width: thick;

/* <length> 值 */
column-rule-width: 1px;
column-rule-width: 2.5em;

/* 全局值 */
column-rule-width: inherit;
column-rule-width: initial;
column-rule-width: revert;
column-rule-width: revert-layer;
column-rule-width: unset;
```
**取值**：[`<border-width>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-rule-width#border-width)是由 [border-width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-width) 定义的关键字，定义列规则的宽度。它可以是 [`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length) 或 thin、 medium、或 thick 关键字之一。

#### 形式语法

```css
column-rule-width =
  <line-width>

<line-width> =
  <length [0,∞]>  |
  thin            |
  medium          |
  thick
```
### [column-span](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-span)

#### 描述

`column-span` [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性的值被设置为 all 时，可以让一个元素跨越所有的列。

#### 语法

```css
/* 关键字值 */
column-span: none;
column-span: all;

/* 全局值 */
column-span: inherit;
column-span: initial;
column-span: revert;
column-span: revert-layer;
column-span: unset;
```
**取值**：

* [none](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-span#none) —— 元素不跨多个列。
* [all](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-span#all) —— 元素横跨所有列。元素出现之前，出现在元素之前的正常流中的内容在所有列之间自动平衡。该元素建立一个新的区块格式化上下文。
#### 形式语法

```css
column-span = none|all
```
### [column-width](https://developer.mozilla.org/en-US/docs/Web/CSS/column-width)

#### 描述

`column-width` CSS 属性在多列布局中**设置理想的列宽**。容器将具有尽可能多的列，而其中任何列的宽度都不会小于列宽值。如果容器的宽度小于指定值，则单列的宽度将小于声明的列宽。

#### 语法

```css
/* Keyword value */
column-width: auto;

/* <length> values */
column-width: 60px;
column-width: 15.5em;
column-width: 3.3vw;

/* Global values */
column-width: inherit;
column-width: initial;
column-width: revert;
column-width: revert-layer;
column-width: unset;
```
**取值**：

* `length` —— 指定最佳列宽。实际的列宽可能与指定值不同：当需要填充可用空间时，它可能会更宽，而当可用空间太小时，它可能会更窄。该值必须严格为正值，否则声明无效。百分比值也是无效的。
* `auto` —— 列的宽度由其他 CSS 属性确定，例如 `column-count`。
#### 形式语法

```css
column-width =
  auto                                |
  <length [0,∞]>                      |
  min-content                         |
  max-content                         |
  fit-content( <length-percentage> )

<length-percentage> =
  <length>      |
  <percentage>
```
