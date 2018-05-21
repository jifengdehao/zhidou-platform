<template>
  <div class="courseDetails">
    <div class="top">
      <h3>单次课&gt;<span class="info">课程详情</span></h3>
      <Button type="primary" @click="$router.back()">返回上一级</Button>
    </div>
    <div class="content vm-clearfix">
      <Row class="list-group">
        <Col span="3" class="title">课程标题</COL>
        <Col span="21" v-html="formatTitle(course.title)"></Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">上课方式</Col>
        <Col span="21">
          <span v-if="course.file_type == 1">音频</span>
          <span v-else-if="course.file_type == 2">视频</span>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">课程分类</Col>
        <Col span="21">{{categoryName}}</Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">课程文件</Col>
        <Col span="21">
          <template v-if="course.file_type == 1">
            <audio :src="course.file" controls></audio>
          </template>
          <template v-if="course.file_type == 2">
            <!-- 设置播放器容器 -->
            <video id="player"
                   preload="auto"
                   playsinline
                   webkit-playinline
                   x5-playinline
                   controls class="video"></video>
          </template>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">审核状态</Col>
        <Col span="21">
          <span v-if="course.status == 2">审核未通过</span>
          <span v-else-if="course.status == 1">审核通过</span>
          <span v-else>审核中</span>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">上课类型</Col>
        <Col span="21">
          <span v-if="course.pay_type == 1">现金收费</span>
          <span v-else-if="course.pay_type == 2">智豆收费</span>
          <span v-else-if="course.pay_type == 3">密码</span>
          <span v-else>免费</span>
        </Col>
      </Row>
      <Row class="list-group" v-if="course.pay_type == 1">
        <Col span="3" class="title">价格（元）</Col>
        <Col span="21">{{course.price}}</Col>
      </Row>
      <Row class="list-group" v-if="course.pay_type == 2">
        <Col span="3" class="title">数量（个）</Col>
        <Col span="21">{{course.price}}</Col>
      </Row>
      <Row class="list-group" v-if="course.pay_type == 3">
        <Col span="3" class="title">密码</Col>
        <Col span="21">{{course.pwd}}</Col>
      </Row>

      <Row class="list-group">
        <Col span="3" class="title">课程banner</Col>
        <Col span="21">
          <div v-if="banner.length>0">
            <img :src="item.url" width="240" height="180" class="mr10" v-for="(item,index) in course.img" :key="index"/>
          </div>
          <div v-else>暂无课程banner</div>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">课程简介</Col>
        <Col span="21">
          <div class="intro" v-if="intro.length>0">
            <template v-for="item in intro">
              <img :src="item.url" width="240" height="180" class="mb10" v-if="item.url"/>
              <p class="mb10" v-if="item.dec" v-html="formatSolution(item.dec)"></p>
            </template>
          </div>
          <div v-else>暂无课程简介</div>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="21" offset="3">
          <Button type="primary" size="large" style="width: 200px;" @click="goToTeach">进入直播间</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'

  export default {
    name: 'courseDetails',
    data() {
      return {
        id: this.$route.params.id, // 课程id
        course: {},// 课程详情
        categoryName: '', // 分类
        banner: [], // 课程banner
        intro: []  // 课程简介
      }
    },
    created() {
      this.getCourseDetails()
    },
    beforeDestroy() {
      if (this.player) {
        this.player.dispose()
        this.player = null
      }
    },
    methods: {
      goToTeach() {
        window.open('http://wwww.zhiliaotv.com/course/teach/' + this.id)
      },
      formatTitle(s) {
        if (s) {
          return s.replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      formatSolution(s) {
        if (s) {
          return s.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      getCourseDetails() {
        api.getSingleDetails({id: this.id}).then((res) => {
          if (res) {
            console.log(res)
            this.course = res
            this.banner = res.img
            this.intro = res.note
            this.getResourceGuide();
            if (res.file_type == 2) {
              setTimeout(() => {
                this.player = TCPlayer('player', { // 播放器容器ID，必须与html中一致
                  fileID: res.file, // 请传入需要播放的视频filID 必须
                  appID: '1256245999', // 请传入点播账号的appID 必须
                  autoplay: false, //是否自动播放
                  width: '400px',
                  height: '250px'
                });
              }, 20)
            }
          }
        })
      },
      getResourceGuide() {
        api.getResourceGuide().then((res) => {
          if (res) {
            console.log(res)
            res.forEach((item) => {
              if (item.id === this.course.category) {
                this.categoryName = item.name
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .courseDetails
    background-color #fff
    min-height 100%
    .top
      padding 10px 20px
      display flex
      align-items center
      justify-content space-between
      border-bottom 1px solid #f4f4f4
    .content
      padding 40px 0
      .list-group
        margin-bottom 30px
        width 100%
        .title
          color #999
          text-align right
          padding-right 40px
          box-sizing border-box
        .intro
          width 540px
          border 1px solid #dddee1
          padding 20px 15px
          box-sizing border-box
          border-radius 4px
          line-height 2
          img
            display block

</style>
