# element-ui__el-table_流体高度自适应
```css
// 流体高度样式
.el-table {
  max-height: 100% !important;
  position: relative;
}

.el-table__body-wrapper,.el-table__fixed-body-wrapper {
  max-height: 100% !important;
  position: absolute;
  top: 48px!important; // 表格头部高度
  bottom: 0;
}
// table底部去除滚动栏的高度
.el-table__fixed-body-wrapper .el-table__body{
  padding-bottom:17px
}
```



