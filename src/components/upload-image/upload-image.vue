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
        fr.onload = e => {
          if (!!self.isAuto) {
            self.uploadToSever(e.target.result);
          } else {
            this.$emit('success', fr.target.result)
          }
        }
        fr.readAsDataURL(e.target.files[0]);
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
  .upload{
    position: relative;
    width: 100%;
    height:100%;
    cursor: pointer;
    border-radius: inherit;
  }
  .upload>input{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    opacity: 0;
    cursor: pointer;
  }
  .upload .progress{
    position: absolute;
    left:0;
    bottom:0;
    right:0;
    top:0;
    width:100%;
    box-sizing:border-box;
    background-color:rgba(0, 0, 0,.8);
  }
</style>
