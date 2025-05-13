# 制作echarts图表

### 封装TimeLayouts组件
由于顶部的时间Tab组件有相同之处，则将其封装成TimeLayouts，这个组件中的props需要传入一个`defineComponent`类型的对象，使用了一个demo用于在props定义的时候方便进行推断，StatisticsPage页面也可以使用，具体详细代码可以见[链接](https://github.com/Lu9709/mangosteen-font/commit/7b42df86522cabdaa8365ca2672b46f1afd413bf)。

```tsx
import { Overlay } from 'vant';
import { defineComponent, PropType, reactive, ref } from 'vue';
import { Form, FormItem } from '../shared/Form';
import { OverlayIcon } from '../shared/Overlay';
import { Tab, Tabs } from '../shared/Tabs';
import { Time } from '../shared/time';
import s from './TimeTabsLayout.module.scss';
import { MainLayout } from './MainLayout';
const demo = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true
    },
    endDate: {
      type: String as PropType<string>,
      required: true
    }
  },
})
export const TimeTabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true
    }
  },
  setup: (props, context) => {
    const refSelected = ref('本月')
    const time = new Time()
    const customTime = reactive({
      start: new Time().format(),
      end: new Time().format()
    })
    const timeList = [
      {
        start: time.firstDayOfMonth(),
        end: time.lastDayOfMonth()
      },
      {
        start: time.add(-1, 'month').firstDayOfMonth(),
        end: time.add(-1, 'month').lastDayOfMonth()
      },
      {
        start: time.firstDayOfYear(),
        end: time.lastDayOfYear()
      }
    ]
    const refOverlayVisible = ref(false)
    const onSubmitCustomTime = (e: Event) => {
      e.preventDefault()
      refOverlayVisible.value = false
    }
    const onSelect = (value: string) => {
      if (value === '自定义时间') {
        refOverlayVisible.value = true
      }
    },
      return () => (
      <MainLayout>{
        {
          title: () => '山竹记账',
          icon: () => <OverlayIcon />,
          default: () => <>
            <Tabs classPrefix='customTabs' v-model:selected={refSelected.value}
              onUpdate:selected={onSelect}>
              <Tab name="本月">
                <props.component
                  startDate={timeList[0].start.format()}
                  endDate={timeList[0].end.format()} />
              </Tab>
              <Tab name="上月">
                <props.component
                  startDate={timeList[1].start.format()}
                  endDate={timeList[1].end.format()} />
              </Tab>
              <Tab name="今年">
                <props.component
                  startDate={timeList[2].start.format()}
                  endDate={timeList[2].end.format()} />
              </Tab>
              <Tab name="自定义时间">
                <props.component
                  startDate={customTime.start}
                  endDate={customTime.end} />
              </Tab>
            </Tabs>
            <Overlay show={refOverlayVisible.value} class={s.overlay} >
              <div class={s.overlay_inner}>
                <header>
                  请选择时间
                </header>
                <main>
                  <Form onSubmit={onSubmitCustomTime}>
                    <FormItem label='开始时间' v-model={customTime.start} type='date' />
                    <FormItem label='结束时间' v-model={customTime.end} type='date' />
                    <FormItem>
                      <div class={s.actions}>
                        <button type="button" onClick={() => refOverlayVisible.value = false}>取消</button>
                        <button type="submit">确认</button>
                      </div>
                    </FormItem>
                  </Form>
                </main>
              </div>
            </Overlay>
          </>
        }
      }</MainLayout>
    )
  }
}) 
```

### 引入Echarts，创建三个图表组件
引入echarts，`pnpm install echarts`，具体可以见[echarts官网](https://echarts.apache.org/handbook/zh/get-started/)。根据设计稿创建三个组件，分别为圆饼图、折线图，还有百分比图，填充的数据为假数据，具体详细可以见[链接](https://github.com/Lu9709/mangosteen-font/commit/a44c6b53a0e6318f3fdee74cc18faaa43f19339e)。echarts的配置项里的grid可以控制图表的上下左右高度，引入图表的时候要默认给图表设置高度，不然高度为0，不会显示。

```tsx
import { defineComponent, onMounted, PropType, ref } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';
export const LineChart = defineComponent({
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(refDiv.value);
      // 绘制图表
      myChart.setOption({
        grid: [
          { left: 0, top: 0, right: 0, bottom: 20 }
        ],
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      });

    })
    return () => (
      <div ref={refDiv} class={s.wrapper}></div>
    )
  }
}) 
```

```tsx
import { defineComponent, onMounted, PropType, ref } from 'vue';
import s from './PieChart.module.scss';
import * as echarts from 'echarts';
export const PieChart = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv2 = ref<HTMLDivElement>()
    onMounted(() => {
      if (refDiv2.value === undefined) { return }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(refDiv2.value);
      // 绘制图表
      const option = {
        grid: [
          { left: 0, top: 0, right: 0, bottom: 20 }
        ],
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    })
    return () => (
      <div ref={refDiv2} class={s.wrapper}></div>
    )
  }
}) 
```

```tsx
import { computed, defineComponent, PropType, reactive } from 'vue';
import s from './Bars.module.scss';
export const Bars = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const data3 = reactive([
      { tag: { id: 1, name: '房租', sign: 'x' }, amount: 3000 },
      { tag: { id: 2, name: '吃饭', sign: 'x' }, amount: 1000 },
      { tag: { id: 3, name: '娱乐', sign: 'x' }, amount: 900 },
    ])
    const betterData3 = computed(() => {
      const total = data3.reduce((sum, item) => sum + item.amount, 0)
      return data3.map(item => ({
        ...item,
        percent: Math.round(item.amount / total * 100) + '%'
      }))
    })
    return () => (
      <div class={s.wrapper}>
          {betterData3.value.map(({ tag, amount, percent }) => {
            return (
              <div class={s.topItem}>
                <div class={s.sign}>
                  {tag.sign}
                </div>
                <div class={s.bar_wrapper}>
                  <div class={s.bar_text}>
                    <span> {tag.name} - {percent} </span>
                    <span> ￥{amount} </span>
                  </div>
                  <div class={s.bar}>
                    <div class={s.bar_inner}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
    )
  }
}) 
```

### 创建Charts组件
创建Charts组件存放三个图表的组件，具体详细代码见[链接](https://github.com/Lu9709/mangosteen-font/commit/e356961599a6fd01cdbbc82123b1c5f4ae21f380)。

```tsx
import { defineComponent, PropType, ref } from 'vue';
import s from './Charts.module.scss';
import { FormItem } from '../../shared/Form';
import { Bars } from './Bars';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';

export const Charts = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: true
    },
    endDate: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup: (props, context) => {
    const category = ref('expenses')
    return () => (
      <div class={s.wrapper}>
        <FormItem label='类型' type="select" options={[
          { value: 'expenses', text: '支出' },
          { value: 'income', text: '收入' }
        ]} v-model={category.value} />
        <LineChart/>
        <PieChart/>
        <Bars/>
      </div>
    )
  }
}) 
```

