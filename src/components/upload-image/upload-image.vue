/**
* @author zhangwenlong
* @date 2018/3/31
* @Description: 上传图片
*/
<template>
  <div class="upload">
    <slot></slot>
    <input type="file" class="upload" @change="fileChange" :accept="accepts">
  </div>
</template>

<script>
  import * as api from '@/api/common'

  export default {
    props: {
      // 上传格式
      accepts: {
        type: String,
        default: 'image/*'
      },
      // 总是上传
      isAuto: {
        type: Boolean,
        default: true,
      },
      // 上传地址
      apiMethod: {
        type: String,
        default: 'uploadImage64',
      }
    },
    data() {
      return {
        percent: 0,
        files: [],
        accepts: ""
      }
    },
    methods: {
      fileChange(e) {
        let self = this;
        if (e.target.files.length == 0) return false
        // 读取本地图片转成base64显示到页面待使用
        let fr = new FileReader()
        fr.readAsDataURL(e.target.files[0]);
        let size = e.target.files[0].size
        let minSize = 512000
        let maxSize = 1048576
        let TwoMaxSize = 2097152
        fr.onload = e => {
          console.log(e.target.result)
          if (!!self.isAuto) {
            // 图片 小于500kb 不压缩
            if (size < minSize) {
              self.uploadToSever(e.target.result)
              // 1M
            } else if (size < maxSize) {
              self.canvasDataURL(e.target.result, {quality: 0.7}, function (base64Codes) {
                self.uploadToSever(base64Codes)
              })
              // 2M
            } else if (size < TwoMaxSize) {
              self.canvasDataURL(e.target.result, {quality: 0.5}, function (base64Codes) {
                self.uploadToSever(base64Codes)
              })
              // 2M以上
            } else {
              self.canvasDataURL(e.target.result, {quality: 0.4}, function (base64Codes) {
                self.uploadToSever(base64Codes)
              })
            }
          } else {
            this.$emit('success', e.target.result)
          }
        }
      },
      canvasDataURL(path, obj, callback) {
        let img = new Image();
        img.src = path;
        img.onload = function () {
          let that = this;
          // 默认按比例压缩
          let w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          let quality = 0.7;  // 默认图片质量为0.7
          //生成canvas
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          // 创建属性节点
          let anw = document.createAttribute("width");
          anw.nodeValue = w;
          let anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // gif 压缩不了
          if (/gif/ig.test(that.src)) {
            var base64 = that.src
          } else {
            var base64 = canvas.toDataURL('image/jpeg', quality);
          }
          // quality值越小，所绘制出的图像越模糊
          // 回调函数返回base64的值
          callback(base64);
        }
      },
      uploadToSever(data) {
        api[this.apiMethod]({upimg: data}).then((res) => {
          this.$emit('success', res)
          this.$Notice.success({
            title: '上传成功！'
          })
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .upload {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: inherit;
  }

  .upload > input {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
  }

  .upload .progress {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, .8);
  }
</style>
