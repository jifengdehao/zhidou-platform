/**
* @author zhangwenlong
* @date 2018/4/25
* @Description: 新建系列课
*/
<template>
  <div class="container">
    <div class="top">
      <h3>系列课&gt;<span class="blue">新增</span></h3>
      <Button type="primary" @click="$router.back()">返回上一级</Button>
    </div>
    <div class="content">
      <Form :model="formValidate" :label-width="180" class="form" ref="form" :rules="ruleValidate">
        <FormItem label="课程主题" prop="name">
          <Input v-model.trim="formValidate.name" placeholder="请输入课程主题，最多40个字"></Input>
        </FormItem>
        <FormItem label="排课计划" prop="plan_period_count">
          <Input v-model.trim="formValidate.plan_period_count" placeholder="请填写具体的开课节数" type="number"></Input>
        </FormItem>
        <FormItem label="收费类型" prop="pay_type">
          <Select v-model="formValidate.pay_type">
            <Option v-for="item in payList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="价格" prop="price" v-show="formValidate.pay_type === 1">
          <Input v-model.trim="formValidate.price" placeholder="最少金额1元"></Input>
          <p class="mt10">
            <span class="mr20">设置邀请奖励</span>
            <i-switch v-model="isInvite"></i-switch>
          </p>
          <p class="mt10" v-if="isInvite">
            <span class="mr20">分成比例（%）</span>
            <Input type="number" placeholder="请输入分成比例，比例必须是整数" v-model="formValidate.share_gain_rate"
                   style="width: 250px;"></Input>
          </p>
          <p class="mt10" v-if="isInvite">
            <span class="mr20">分成</span>{{sharePrice}}
          </p>
        </FormItem>
        <FormItem label="价格" prop="price" v-show="formValidate.pay_type === 2">
          <Input v-model.trim="formValidate.price" placeholder="最少1个智豆"></Input>
          <p class="mt10">
            <span class="mr20">设置邀请奖励</span>
            <i-switch v-model="isInvite"></i-switch>
          </p>
          <p class="mt10" v-if="isInvite">
            <span class="mr20">分成比例（%）</span>
            <Input type="number" placeholder="请输入分成比例，比例必须是整数" v-model="formValidate.share_gain_rate"
                   style="width: 250px;"></Input>
          </p>
          <p class="mt10" v-if="isInvite">
            <span class="mr20">分成</span>{{sharePrice}}
          </p>
        </FormItem>
        <FormItem label="密码" prop="pwd" v-show="formValidate.pay_type === 3">
          <Input v-model.trim="formValidate.pwd" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="系列课分类" prop="category_id">
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
        <p class="grev" style="margin-left:180px;margin-bottom: 20px;">可以上传多张图片，建议：750 * 470px, jpg,png格式,图片小于5M</p>
        <FormItem label="课程简介" prop="intro">
          <Input v-model="title" type="textarea" placeholder="请输入课程介绍" :autosize="{minRows: 5}"
                 class="mb20"></Input>
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
            <Button type="ghost" class="mr10" icon="image">添加图片和文字</Button>
          </upload-img>
          <!-- <Button type="ghost" icon="document-text">添加文字</Button>-->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('form')" size="large" style="width: 200px;">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'
  import uploadImg from '@/components/upload-image/upload-image'

  export default {
    components: {
      uploadImg
    },
    name: 'addSeries',
    data() {
      return {
        isInvite: false, // 是否是分销课程
        courseIntro: [],
        title: '',
        formValidate: {
          name: '', // 课程标题
          pay_type: 0, // 收费类型
          plan_period_count: '', // 排课计划
          price: '', // 价格
          pwd: '',// 密码
          course_type: 1, // 系列课
          intro: '', // 课程简介
          images: '',// 课程banner图
          category_id: '',// 系列课分类
          share_gain_rate: '', // 分成比例
          is_share_gain: 0 // 0不是 1 是
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入课程标题', trigger: 'blur'}
          ],
          plan_period_count: [
            {required: true, message: '请填写具体的开课节数', trigger: 'blur'}
          ]
        },
        categoryList: [], // 分类
        payList: [
          {
            value: 0,
            label: '免费'
          },
          {
            value: 1,
            label: '现金收费'
          },
          {
            value: 2,
            label: '智豆收费'
          },
          {
            value: 3,
            label: '密码'
          }
        ],
        list: [] //系列课海报
      }
    },
    created() {
      this.getResourceGuide()
    },
    computed: {
      sharePrice() {
        if (this.isInvite && this.formValidate.pay_type == 1 && this.formValidate.share_gain_rate <= 100) {
          return (this.formValidate.share_gain_rate / 100 * this.formValidate.price).toFixed(1)
        } else if (this.isInvite && this.formValidate.pay_type == 2 && this.formValidate.share_gain_rate <= 100) {
          return Math.floor(this.formValidate.share_gain_rate / 100 * this.formValidate.price)
        }
      }
    },
    methods: {
      // 分类
      getResourceGuide() {
        api.getResourceGuide().then((res) => {
          if (res) {
            this.categoryList = res
          }
        })
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let message = ''
            let params = this.formValidate
            if (!params.category_id) {
              message = '请选择分类！'
            } else if (!this.list.length > 0) {
              message = '请上传课程banner图'
            } else if (params.pay_type === 3 && !params.pwd) {
              message = '密码不能为空'
            } else if (params.pay_type === 3 && !(/^[0-9a-zA-Z]+$/).test(params.pwd)) {
              message = '密码输入不正确'
            } else if (params.pay_type === 1 && !(params.price && params.price > 1)) {
              message = '输入金额不正确'
            } else if (params.pay_type === 2 && !(params.price && params.price > 1)) {
              message = '输入智豆数量不正确'
            } else if (this.isInvite && !params.share_gain_rate) {
              message = '分享提成比例不能为空';
            } else if (this.isInvite && params.share_gain_rate < 0) {
              message = '分享提成比例大于0或小于100'
            } else if (this.isInvite && params.share_gain_rate > 100) {
              message = '分享提成比例大于0小于100'
            }
            if (message) {
              this.$Notice.error({
                title: message
              })
              return
            }
            if (this.isInvite) {
              params.is_share_gain = 1
            } else {
              params.is_share_gain = 0
            }

            let fileIds = [];
            this.list.forEach((item) => {
              fileIds.push(item.fileId)
            })
            params.images = fileIds.join('|')
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
                console.log(res)
                this.$router.push('/series/details/' + res.id)
              }
            })
          } else {
            this.$Notice.error({
              title: '验证失败！'
            })
          }
        })
      },
      // 系列课海报
      uploadCallback(data) {
        console.log(data)
        this.list.push(data)
      },
      deleteItem(index) {
        this.list.splice(index, 1);
      },
      // 上传课程简介图片
      uploadIntroImg(data) {
        this.courseIntro.push({url: data.url, fileId: data.fileId, dec: ''})
      },
      // 删除课程简介图片
      deleteUploadIntroImg(index) {
        this.courseIntro.splice(index, 1);
      }
    }
  }
</script>

<style scoped lang="stylus">
  .content
    padding 40px 0
    .form
      width 800px
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
