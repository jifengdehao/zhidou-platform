<template>
  <div class="container add">
    <div class="top">
      <h3>单次课&nbsp;&gt;&nbsp;<span class="blue">新增</span></h3>
      <Button type="primary" @click="$router.back()">返回上一级</Button>
    </div>
    <div class="content">
      <Form :label-width="180" class="form" ref="formValidate" :model="formValidate" :rules="ruleInline">
        <FormItem label="课程主题" prop="name">
          <Input v-model.trim="formValidate.name" placeholder="请输入课程主题，最多40个字"></Input>
        </FormItem>
        <FormItem label="课程形式">
          <Select v-model="formValidate.period_type">
            <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="课程内容">
          <div v-show="formValidate.period_type == 1">
            <Upload action="http://up-z0.qiniup.com"
                    :on-success="uploadAudioSuccess"
                    :on-error="uploadAudioError"
                    :before-upload="uploadAudioBefore"
                    accept="audio/*"
                    ref="uploadAudio"
                    :data="{token:audioUploadKey.token}">
              <Button type="ghost" icon="ios-cloud-upload-outline">选择课程文件</Button>
            </Upload>
          </div>
          <div v-show="formValidate.period_type == 2">
            <label for="uploadVideoNow-file">
              <input id="uploadVideoNow-file" type="file" style="display:none;"
                     @change="uploadVideo"
                     accept="video/*"
                     ref="uploadVideo"/>
              <Button type="ghost" icon="ios-cloud-upload-outline" @click="openUpload">选择课程文件</Button>
            </label>
            <p>{{videoFile.name}}</p>
            <Progress :percent="uploadPercent" :stroke-width="2" v-if="uploadStatus">
              <Icon type="checkmark-circled"></Icon>
              <span>成功</span>
            </Progress>
          </div>
          <p class="grev">音频文件目前支持MP3格式，视频文件支持MP4格式</p>
        </FormItem>
        <FormItem label="课程分类">
          <Select v-model="formValidate.category_id">
            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="课程banner">
          <div class="upload-item" v-if="item" v-for="(item, key) in list" :key="key">
            <Icon type="close-circled" @click.native="deleteItem(key)" class="upload-close"></Icon>
            <img :src="item.url" width="280" height="190"/>
          </div>
          <upload-img @success="uploadCallback">
            <img src="../../assets/icon-add-img.png" width="280" height="190"/>
          </upload-img>
        </FormItem>
        <p class="grev" style="margin-left:180px;margin-bottom: 20px;">可以上传多张图片，建议：xxx.jpg,xxx.png,图片小于5M</p>
        <FormItem label="收费类型">
          <div class="tab">
            <div class="tab-title">
              <div class="tab-item free" :class="{active:formValidate.pay_type === 0}" @click="selectTab(0)"></div>
              <div class="tab-item pass" :class="{active:formValidate.pay_type === 3}" @click="selectTab(3)"></div>
              <div class="tab-item cash" :class="{active:formValidate.pay_type === 1}" @click="selectTab(1)"></div>
              <div class="tab-item bean" :class="{active:formValidate.pay_type === 2}" @click="selectTab(2)"></div>
            </div>
            <div class="tab-content line" v-show="formValidate.pay_type === 0">
              <p>任何人都可以收听直播</p>
            </div>
            <div class="tab-content pass" v-show="formValidate.pay_type === 3">
              <p>设置一个固定密码</p>
              <Input type="text" placeholder="支持英文和数字，不区分大小写，不支持特殊字符" v-model="formValidate.pwd"></Input>
            </div>
            <div class="tab-content cash" v-show="formValidate.pay_type === 1">
              <p>设置一个固定金额</p>
              <Input type="number" placeholder="最少金额1元" v-model="formValidate.price"></Input>
            </div>
            <div class="tab-content bean" v-show="formValidate.pay_type === 2">
              <p>设置一个固定智豆数量</p>
              <Input type="number" placeholder="最少1个智豆" v-model="formValidate.price"></Input>
            </div>
          </div>
        </FormItem>
        <FormItem label="课程简介">
          <Input type="textarea" placeholder="请输入课程简介"
                 :autosize="{minRows: 5}"
                 class="mb20" v-model="title"></Input>
          <div v-for="(item,index) in courseIntro" :key="index">
            <img :src="item.url" width="280" height="190" v-if="item.url" class="mb20"/>
            <Icon type="close-circled"
                  @click.native="deleteUploadIntroImg(index)"
                  class="upload-close"
                  v-if="item.url"
                  style="position: relative;top:-90px;font-size: 16px;left: -20px;">
            </Icon>
            <Input v-model="item.dec"
                   type="textarea" placeholder="请输入课程简介"
                   :autosize="{minRows: 5}"
                   class="mb20"></Input>
          </div>
          <upload-img @success="uploadIntroImg" style="display: inline-block;width: auto;">
            <Button type="ghost" class="mr10" icon="image">添加图片文字</Button>
          </upload-img>
          <!-- <Button type="ghost" icon="document-text" @click="addIntroText">添加文字</Button>-->
        </FormItem>
        <FormItem>
          <Button type="primary" @click.stop="handleSubmit('formValidate')" size="large" style="width: 200px;">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'
  import uploadImg from '@/components/upload-image/upload-image'

  export default {
    name: 'addCourse',
    components: {
      uploadImg
    },
    data() {
      return {
        uploadPercent: 0,
        uploadStatus: false,
        title: '',// 课程简介
        courseIntro: [],// 课程简介
        formValidate: {
          name: '', // 课程名程
          intro: '', // 课程简介
          file_id: '', //课程文件
          file_name: '', // 文件名
          course_type: 0, // 课程类型
          pwd: '', // 课程加密
          price: '', // 课程价格
          period_type: 1, // 上课类型
          pay_type: 0, // 支付类型
          category_id: '' //课程类目
        },
        ruleInline: {
          name: [
            {required: true, message: '请输入课程标题', trigger: 'blur'}
          ]
        },
        list: [], // 上传的banner图
        modeList: [
          {
            label: '音频',
            value: 1
          },
          {
            label: '视频',
            value: 2
          }
        ],
        categoryList: [], // 分类
        audioUploadKey: {},
        videoFile: {} // 上传视频的文件
      }
    },
    created() {
      this.getResourceGuide()
      this.getUploadAudioKey()
    },
    methods: {
      // 添加课程简介图片
      uploadIntroImg(data) {
        console.log(data)
        this.courseIntro.push({url: data.url, fileId: data.fileId, dec: ''})
      },
      // 删除课程简介图片
      deleteUploadIntroImg(index) {
        this.courseIntro.splice(index, 1);
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let message = ''
            let params = this.formValidate
            if (!params.file_id) {
              message = '请上传课程文件！'
            } else if (!params.category_id) {
              message = '请选择分类！'
            } else if (!this.list.length > 0) {
              message = '请上传banner图'
            } else if (params.pay_type === 3 && !params.pwd) {
              message = '密码不能为空'
            } else if (params.pay_type === 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
              message = '密码输入不正确'
            } else if (params.pay_type === 1 && !(params.price && params.price > 1)) {
              message = '输入金额不正确'
            } else if (params.pay_type === 2 && !(params.price && params.price > 1)) {
              message = '输入智豆数量不正确'
            }
            if (message) {
              this.$Notice.error({
                title: message
              })
              return
            }
            if (this.list.length > 0) {
              let fileIds = [];
              this.list.forEach((item) => {
                fileIds.push(item.fileId);
              });
              params.images = fileIds.join('|') // 课程图片
            }
            if (this.title) {
              this.courseIntro.unshift({fileId: '', dec: this.title})
            }
            if (this.courseIntro.length > 0) {
              let intro = []
              this.courseIntro.forEach((item) => {
                intro.push({fileId: item.fileId, dec: item.dec})
              })
              params.intro = JSON.stringify(intro)
            }
            params.price = Math.floor(params.price * 10) / 10
            console.log(params)
            api.createCourse(params).then((res) => {
              if (res) {
                this.$router.push('/course/details/' + res.id)
              }
            })
          } else {
            this.$Notice.error({
              title: '验证失败！'
            })
          }
        })
      },
      // 分类
      getResourceGuide() {
        api.getResourceGuide().then((res) => {
          if (res) {
            this.categoryList = res
          }
        })
      },
      // 上传图片回调 banner
      uploadCallback(data) {
        console.log(data)
        this.list.push(data)
      },
      // 删除上传图片banner
      deleteItem(index) {
        this.list.splice(index, 1);
      },
      // 上传音频成功回调
      uploadAudioSuccess(response) {
        console.log(response)
        this.formValidate.file_id = response.fileId
        this.formValidate.file_name = response.name
        this.$Notice.success({
          title: '上传成功！',
        })
        this.getUploadAudioKey()
      },
      // 上传音频失败回调
      uploadAudioError(error) {
        console.log(error)
        this.$Notice.error({
          title: '上传失败！',
        })
      },
      uploadVideo(e) {
        let vm = this
        let file = e.target.files[0]
        vm.videoFile = file
        vm.uploadStatus = true
        if (vm.videoFile.name) {
          this.loadScript(function () {
            setTimeout(() => {
              qcVideo.ugcUploader.start({
                videoFile: vm.videoFile,
                getSignature: vm.getSignature,
                error: function (result) {//上传失败时的回调函数
                  console.log('上传失败的原因：' + result.msg);
                  vm.$Notice.error({
                    title: '上传失败！',
                  })
                },
                progress: function(result){
                  vm.uploadPercent = result.curr * 100
                  console.log('上传进度：' + result.curr);
                },
                finish: function (result) {//上传成功时的回调函数
                  vm.formValidate.file_id = result.fileId
                  vm.formValidate.file_name = result.videoName
                  console.log('上传结果的fileId：' + result.fileId);
                  console.log('上传结果的视频名称：' + result.videoName);
                  console.log('上传结果的视频地址：' + result.videoUrl);
                  vm.$Notice.success({
                    title: '上传成功！',
                  })
                }
              })
            }, 20)
          });
        }
      },
      selectTab(type) {
        this.formValidate.pay_type = type
      },
      // 获取上传视频的签名
      getSignature(callback) {
        this.$http.post('/api/user/anchor/video-key', {'Action': 'GetVodSignatureV2'}).then((res) => {
          callback(res.data)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 添加javascript
      loadScript(callback) {
        if (!window.qcVideo) {
          const jQScript = document.createElement('script');
          const myScript = document.createElement('script');
          jQScript.setAttribute('src', '//code.jquery.com/jquery-1.12.4.min.js');
          myScript.setAttribute('src', '//imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js');
          myScript.onload = callback;
          document.body.appendChild(jQScript);
          document.body.appendChild(myScript);
        } else {
          callback();
        }
      },
      openUpload() {
        this.$refs.uploadVideo.click()
      },
      uploadAudioBefore(file) {
        console.log(file)
        this.$refs.uploadAudio.clearFiles()
      },
      // 获取上传音频的参数
      getUploadAudioKey() {
        api.getUploadAudioKey().then((res) => {
          console.log(res)
          this.audioUploadKey = res
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .add
    .content
      padding 40px 0
      .form
        width 800px
        .tab
          .tab-title
            display flex
            .tab-item
              height 144px
              flex 1
              cursor pointer
            .free
              background-size 144px 144px
              background url("../../assets/icon-free.png") no-repeat center
              background-size contain
              &.active
                background url("../../assets/icon-free-active.png") no-repeat center
            .pass
              background-size 144px 144px
              background url("../../assets/icon-pass.png") no-repeat center
              background-size contain
              &.active
                background url("../../assets/icon-pass-active.png") no-repeat center
            .cash
              background-size 144px 144px
              background url("../../assets/icon-cash.png") no-repeat center
              background-size contain
              &.active
                background url("../../assets/icon-cash-active.png") no-repeat center
            .bean
              background-size 144px 144px
              background url("../../assets/icon-bean.png") no-repeat center
              background-size contain
              &.active
                background url("../../assets/icon-bean-active.png") no-repeat center
          .tab-content
            height 90px
            border 1px solid #dddee1
            padding 10px 20px
            position relative
            border-radius 4px
            &.line
              margin-top 30px
              line-height 90px
              padding 0 20px
              &:before
                position absolute
                top -30px
                left 70px
                width 0
                height 0
                border-bottom 30px solid #E4E4E2
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
              &:after
                position absolute
                top -29px
                left 70px
                width 0
                height 0
                border-bottom 30px solid #fff
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
            &.pass
              margin-top 30px
              &:before
                position absolute
                top -30px
                left 225px
                width 0
                height 0
                border-bottom 30px solid #E4E4E2
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
              &:after
                position absolute
                top -29px
                left 225px
                width 0
                height 0
                border-bottom 30px solid #fff
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
            &.cash
              margin-top 30px
              &:before
                position absolute
                top -30px
                left 380px
                width 0
                height 0
                border-bottom 30px solid #E4E4E2
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
              &:after
                position absolute
                top -29px
                left 380px
                width 0
                height 0
                border-bottom 30px solid #fff
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
            &.bean
              margin-top 30px
              &:before
                position absolute
                top -30px
                left 535px
                width 0
                height 0
                border-bottom 30px solid #E4E4E2
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''
              &:after
                position absolute
                top -29px
                left 535px
                width 0
                height 0
                border-bottom 30px solid #fff
                border-left 15px solid transparent
                border-right 15px solid transparent
                content ''

        .upload-item
          position relative
          width 280px
          height 190px
          float left
          margin 0 20px 20px 0
          .upload-close
            position absolute
            right 5px
            top 5px
            font-size 18px
            z-index 20
            cursor: pointer
</style>
