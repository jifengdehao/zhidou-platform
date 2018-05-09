<template>
  <div class="container">
    <div class="top">
      <h3>系列课时&nbsp;&gt;&nbsp;<span class="blue">新增</span></h3>
      <Button type="primary" @click="$router.back()">返回上一级</Button>
    </div>
    <div class="content">
      <Form :label-width="180" class="form" ref="formValidate" :model="formValidate" :rules="ruleInline">
        <FormItem label="课程主题" prop="subject">
          <Input v-model.trim="formValidate.subject" placeholder="请输入课程主题，最多40个字"></Input>
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
              <input id="uploadVideoNow-file" type="file" style="display:none;" @change="uploadVideo" accept="video/*"
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
        <FormItem label="课程banner">
          <div class="upload-item" v-if="item" v-for="(item, key) in list" :key="key">
            <Icon type="close-circled" @click.native="deleteItem(key)" class="upload-close"></Icon>
            <img :src="item.url" width="280" height="190"/>
          </div>
          <upload-img @success="uploadCallback">
            <img src="../../assets/icon-add-img.png" width="280" height="190"/>
          </upload-img>
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
          <!--Button type="ghost" icon="document-text" @click="addIntroText">添加文字</Button>-->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')" size="large" style="width: 200px;">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'
  import uploadImg from '@/components/upload-image/upload-image'

  export default {
    name: 'add-Period',
    components: {
      uploadImg
    },
    data() {
      return {
        uploadPercent: 0,
        uploadStatus: false,
        title: '',
        courseIntro: [],// 课程简介
        videoFile: {},//上传视频文件
        formValidate: {
          subject: '',// 课程标题
          period_type: 1, // 上课类型
          course_id: this.$route.params.id, // 系列课id
          images: '',// 课程banner
          info: '', // 课程简介
          file_id: '', // 课程文件id
          file_name: '' // 文件名
        },
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
        ruleInline: {
          subject: [
            {required: true, message: '请输入课程标题', trigger: 'blur'}
          ]
        },
        list: [],
        categoryList: [],// 课程分类
        audioUploadKey: {} //上传音频参数
      }
    },
    created() {
      this.getUploadAudioKey()
    },
    methods: {
      // 课程简介图片
      uploadIntroImg(data) {
        console.log(data)
        this.courseIntro.push({url: data.url, fileId: data.fileId, dec: ''})
      },
      // 上传课程简介图片
      deleteUploadIntroImg(index) {
        this.courseIntro.splice(index, 1);
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
        this.videoFile = file
        this.uploadStatus = true
        if (vm.videoFile.name) {
          this.loadScript(function () {
            vm.videoStatus = true
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
            },20)
          });
        }
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
      // 获取上传音频的参数
      getUploadAudioKey() {
        api.getUploadAudioKey().then((res) => {
          console.log(res)
          this.audioUploadKey = res
        })
      },
      // 上传图片回调 banner
      uploadCallback(data) {
        console.log(data)
        this.list.push(data)
      },
      // 删除上传图片
      deleteItem(index) {
        this.list.splice(index, 1);
      },
      openUpload() {
        this.$refs.uploadVideo.click()
      },
      uploadAudioBefore(file) {
        console.log(file)
        this.$refs.uploadAudio.clearFiles()
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let message = ''
            let params = this.formValidate
            if (!params.file_id) {
              message = '请上传课程文件！'
            }else if (!this.list.length > 0) {
              message = '请上传banner图'
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
              params.info = JSON.stringify(intro)
            }
            console.log(params)
            api.createPeriod(params).then((res) => {
              if (res) {
                console.log(res)
                this.$router.push('/series/period/details/' + res.id)
              }
            })
          }
          else {
            this.$Notice.error({
              title: '验证失败！'
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
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
