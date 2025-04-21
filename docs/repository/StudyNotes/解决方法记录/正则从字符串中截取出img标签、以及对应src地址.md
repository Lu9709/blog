
```
var str = "this is test string <img src=\"http:baidu.com/test.jpg\" width='50' > 1 and the end <img src=\"所有地址也能匹配.jpg\" /> 33! <img src=\"/uploads/attached/image/20120426/20120426225658_92565.png\" alt=\"\" />"
var imgReg = /<img.*?(?:>|\/>)/gi;
var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
var arr = str.match(imgReg);  // arr 为包含所有img标签的数组

const srcArr = arr.map(item => item.match(srcReg)[1])
// srcArr 为包含src链接的数组
```
html的字符有时候会被转义需要重新转义

```
function escape2Html(str) {
  const arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,(all,t) =>{return arrEntities[t];});
}
```
