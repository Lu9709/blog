
```
const options = {
  toolbox: {
    feature: {
      dataZoom: { yAxisIndex: 'none' }, // 数据区域缩放
      restore: { show: true }, // 重置
      saveAsImage: { show: true }, // 导出图片
      myFull: { // 全屏
        show: true,
        title: '全屏',
        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
        onclick: (e) => {
          // 全屏查看
          if (domName.requestFullScreen) { // HTML W3C 提议
            domName.requestFullScreen()
          } else if (domName.msRequestFullscreen) { // IE11
            domName.msRequestFullScreen()
          } else if (domName.webkitRequestFullScreen) { // Webkit
            domName.webkitRequestFullScreen()
          } else if (domName.mozRequestFullScreen) { // Firefox
            domName.mozRequestFullScreen()
          }
          // 退出全屏
          if (domName.requestFullScreen) {
            document.exitFullscreen()
          } else if (domName.msRequestFullScreen) {
            document.msExitFullscreen()
          } else if (domName.webkitRequestFullScreen) {
            document.webkitCancelFullScreen()
          } else if (domName.mozRequestFullScreen) {
            document.mozCancelFullScreen()
          }
        }
      }
    }
  }
}
```
