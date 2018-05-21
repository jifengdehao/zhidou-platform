<template>
  <div class="courseDetails">
    <div class="top">
      <h3>系列课&gt;<span class="info">课时详情</span></h3>
      <Button type="primary" @click="$router.back()">返回上一级</Button>
    </div>
    <div class="content vm-clearfix">
      <Row class="list-group">
        <Col span="3" class="title">课程标题</COL>
        <Col span="21">{{period.title}}</Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">上课方式</Col>
        <Col span="21">
          <span v-if="period.file_type == 1">音频</span>
          <span v-else-if="period.file_type == 2">视频</span>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">课程文件</Col>
        <Col span="21">
          <template v-if="period.file_type == 1">
            <audio :src="period.file" controls preload="auto"></audio>
          </template>
          <template v-if="period.file_type == 2">
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
          <span v-if="period.status == 2">审核未通过</span>
          <span v-else-if="period.status == 1">审核通过</span>
          <span v-else>审核中</span>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">课程banner</Col>
        <Col span="21">
          <div v-if="banner.length>0">
            <img :src="item.url" width="240" height="180" class="mr10" v-for="(item,index) in period.img" :key="index"/>
          </div>
          <div v-else>暂无课程banner</div>
        </Col>
      </Row>
      <Row class="list-group">
        <Col span="3" class="title">课程简介</Col>
        <Col span="21">
          <div class="intro" v-if="intro.length>0">
            <template v-for="item in period.note">
              <img :src="item.url" width="240" height="180" class="mb10" v-if="item.url"/>
              <p class="mb10" v-if="item.dec" v-html="formatSolution(item.dec)">{{item.dec}}</p>
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
    name: 'period',
    data() {
      return {
        id: this.$route.params.id, // 课时id
        period: {}, // 课时详情
        banner: [], // 课时banner
        intro: []   // 课时简介
      }
    },
    created() {
      this.getPeriodDetails()
    },
    beforeDestroy() {
      this.player.dispose()
      this.player = null
    },
    methods: {
      goToTeach() {
        window.open('http://www.zhiliaotv.com/classroom/series/period/teach/' + this.period.course_id + '/' + this.id)
      },
      formatSolution(s) {
        if (s) {
          return s.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        } else {
          return ''
        }
      },
      getPeriodDetails() {
        api.getSeriesPeriodDetails({id: this.id}).then((res) => {
          if (res) {
            console.log(res)
            this.period = res
            this.banner = res.img
            this.intro = res.note
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

</style>
