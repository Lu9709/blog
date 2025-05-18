# Vue-i18n
新版本的Vue-i18n插件，**必须**在使用`Vue.use(VueI18n)`**之后**构造新的VueI18n。

```javascript
import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
// must be called after vue.use
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    // ...langs
  }
})

new Vue({
  el: '#app',
  i18n,
  render: (h) => h(App)
})
```

