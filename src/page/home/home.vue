/**
* @author zhangwenlong
* @date 2018/4/20
* @Description: 首页
*/
<template>
  <div class="home">
    <Row class="author">
      <Col span="6" class="author-img">
        <img :src="user.avatar" width="108" height="108" style="border-radius: 50%;"/>
        <div class="content">
          <h2>{{user.space_name}}</h2>
          <p class="fans">关注人数：12</p>
        </div>
      </Col>
      <Col span="4">
        <div class="content">
          <h2>智豆总数</h2>
          <h2 class="num">{{user.bean.amount}}</h2>
        </div>
      </Col>
      <Col span="4">
        <div class="content">
          <h2>现金（元）</h2>
          <h2 class="num">{{user.cash.profit}}</h2>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24" class="mt30">
        <h2>直播间链接<a href="javascript:;" class="mr20 ml20">{{linkUrl}}</a>
          <Button type="primary" size="large"
                  v-clipboard:copy="linkUrl"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
          >复制链接
          </Button>
        </h2>
      </Col>
      <Col span="24" class="mt20">
        <img :src="qrcode" alt="" width="180" height="170"/>
        <h4 class="mt20">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;微信扫码进入直播间</h4>
      </Col>
    </Row>
  </div>
</template>

<script>
  import * as api from '@/api/common'

  export default {
    name: 'home',
    data() {
      return {
        user: {}
      }
    },
    computed: {
      qrcode() {
        return '/api' + '/user/anchor/qr-code'
      },
      linkUrl() {
        return 'http:www.zhiliaotv.com/classroom'
      }
    },
    created() {
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        api.getUserInfo().then((res) => {
          if (res) {
            console.log(res)
            this.user = res
          }
        })
      },
      copy() {
        let ele = document.getElementById("copy");
        ele.selected();
        document.execCommand("Copy");
        console.log('ele')
      },
      onCopy: function (e) {
        this.$Message.success('链接已经复制到剪切板');
        console.log('你刚刚复制: ' + e.text)
      },
      onError: function (e) {
        console.log('无法复制文本！')
      }
    }
  }
</script>

<style scoped lang="stylus">
  .home
    background-color #fff
    padding 50px
    min-height 100%
    .author
      height 135px
      padding-bottom 50px
      border-bottom 1px solid #f4f4f4
      .author-img
        display flex
        .content
          flex 1
          padding-left 20px
      .content
        height 80px
        position relative
        .fans
          position absolute
          bottom 0
          font-size 16px
        .num
          position absolute
          bottom 0
    .author-link
      margin-top 30px

</style>
