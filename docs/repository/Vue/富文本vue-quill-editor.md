# 富文本vue-quill-editor
安装`npm install vue-quill-editor --save`或`yarn add vue-quill-editor`

toolbarOptions可以配置工具栏的选项。

```javascript
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ['clean'], // 清除文本格式-----['clean']
  ['image', 'video', 'link'] // 链接、图片、视频、文件-----['link', 'image', 'video']
]
export default toolbarOptions
```

使用vue-quill-editor

```javascript
<template>
  <div class="quill">
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      class="editor"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    />
  </div>
</template>

<script>
import {quillEditor} from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import toolbarOptions from "@/utils/toolbarOptions";

export default {
  name: 'Quill',
  components: {
    quillEditor
  },
  data() {
    // 工具栏配置
    return {
      quillUpdateImg: false,
      content: ``,
      editorOption: {
        //  富文本编辑器配置
        modules: {
          // 工具栏定义的
          toolbar: {
            container: toolbarOptions
          }
        },
        // 主题
        theme: 'snow',
        placeholder: '请输入正文'
      }
    }
  },
  methods: {
    onEditorBlur() {
    }, // 失去焦点事件
    onEditorFocus() {
    }, // 获得焦点事件
    onEditorChange(e) {
      this.$emit('editorChange', e.html)
    } // 内容改变事件
  }
}
</script>

<style lang="scss">
.quill {
  padding: 10px 20px;
  .quill-editor {
    height: 400px;
  }
}

</style>
```

由于富文本上传图片时候，会将图片处理成base64的格式，如果图片很大的话，则富文本的内容会很多，提交给后端的时候可能会导致数据库出错。图片上传的时候转为传至OSS服务，返回url地址，大大减少了富文本的内容长度。需要使用`el-upload`组件。

```javascript
<template>
  <div class="quill">
      <el-upload
        id="myQuillEditor"
        class="avatar-uploader"
        :action="baseURL"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :headers="headers"
        :on-error="uploadError"
      />
      <div v-loading="quillUpdateImg" class="edit_container">
        <quill-editor
          ref="myQuillEditor"
          v-model="content"
          :options="editorOption"
          class="editor"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        />
      </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import toolbarOptions from '@/utils/toolbarOptions'
export default {
  name: 'Quill',
  components: {
    quillEditor
  },
  props: {
    data: String
  },
  data() {
    // 工具栏配置
    return {
      headers: { token: getToken() },
      baseURL: process.env.VUE_APP_BASE_API + '/admin/oss/oss/upload',
      quillUpdateImg: false,
      content: ``,
      editorOption: {
        //  富文本编辑器配置
        modules: {
          // 工具栏定义的
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: (value) => {
                if (value) {
                  document.querySelector('#myQuillEditor input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        },
        // 主题
        theme: 'snow',
        placeholder: '请输入正文'
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    data(val) {
      this.content = val
    }
  },
  methods: {
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange(e) {
      this.$emit('editorChange', e.html)
    }, // 内容改变事件
    // 父组件调用子组件的方法
    onSubmit() {
      console.log(this.content)
      return this.content
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      const quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      const { code, data } = res
      if (code === 10000) {
        // 获取光标所在位置
        const length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', data)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        // this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true
    }
  }
}
</script>

<style lang="scss">
.quill {
  padding: 10px 20px;
  .quill-editor {
    height: 400px;
  }
}
</style>

```

