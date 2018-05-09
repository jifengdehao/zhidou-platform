/**
* @author zhangwenlong
* @date 2018/4/25
* @Description: 系列课详情
*/
<template>
  <div class="container seriesDetails">
    <div class="top">
      <h3>系列课&gt;<span class="blue">课程详情</span></h3>
      <Button type="primary" @click="$router.back()">返回上一级</Button>
    </div>
    <div class="content">
      <div class="title vm-clearfix">
        <img :src="seriesBg" width="130" height="90" class="vm-fl mr20"/>
        <h4>标题：{{series.title}}</h4>
        <p class="mt20 mb10">收费类型：
          <span v-if="series.pay_type == 1">现金收费&nbsp;&nbsp;/&nbsp;&nbsp;{{series.price}}元</span>
          <span v-else-if="series.status == 2">智豆收费&nbsp;&nbsp;/&nbsp;&nbsp;{{series.price}}个</span>
          <span v-else-if="series.status == 3">密码&nbsp;&nbsp;/&nbsp;&nbsp;{{series.pwd}}</span>
          <span v-else>免费</span>
        </p>
        <p class="grev">分类：{{categoryName}}</p>
      </div>
      <div class="search">
        <Form inline :label-width="80" :model="formInline">
          <Input type="text" v-model.trim="formInline.name" placeholder="请输入课程标题" style="width: 200px;"
                 icon="search" @on-click="search" @keyup.enter.native="search">
          </Input>
          <FormItem label="审核状态">
            <Select v-model="formInline.status" style="width:200px" @on-change="selectStatus">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <Button class="vm-fr" type="primary" @click="$router.push('/series/period/add/'+formInline.id)">新建话题</Button>
        </Form>
      </div>
      <div class="vm-clearfix" style="padding:40px 20px;">
        <Table :columns="columns" :data="data" :loading="loading"></Table>
        <Page :total="tableTotal" show-total class="mt20 vm-fr" :page-size="pageSize" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'
  import {formatDateTime} from '@/util/time'

  export default {
    name: 'seriesDetails',
    data() {
      return {
        formInline: {
          name: '', // 搜索
          status: '',// 审核状态
          id: this.$route.params.id, // 课程id
        },
        statusList: [
          {
            label: '审核中',
            value: 0
          },
          {
            label: '审核不通过',
            value: 2
          },
          {
            label: '审核通过',
            value: 1
          }
        ],
        data: [],
        tableTotal: 0,
        pageSize: 20,
        columns: [
          {
            title: '课程banner',
            align: 'center',
            key: 'img',
            render: (h, params) => {
              let url = params.row.img
              return h('img', {
                attrs: {
                  src: url,
                },
                style: {
                  width: '110px',
                  height: '80px',
                  margin: '10px 0'
                }
              })
            }
          },
          {
            title: '课程标题',
            align: 'center',
            key: 'title',
          },
          {
            title: '上课方式',
            align: 'center',
            key: 'type',
            render: (h, params) => {
              let type = params.row.type
              switch (type) {
                case 1:
                  return h('span', '音频');
                case 2:
                  return h('span', '视频');
                default:
                  return h('span', '');
              }
            }
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'times',
            render: (h, params) => {
              return h('span', formatDateTime(params.row.times))
            }
          },
          {
            title: '审核状态',
            align: 'center',
            key: 'status',
            render: (h, params) => {
              let stu = params.row.status
              switch (stu) {
                case 2:
                  return h('span', '审核未通过');
                case 1:
                  return h('span', '审核通过');
                default:
                  return h('span', '审核中');
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'options',
            width: 250,
            render: (h, params) => {
              let id = params.row.id
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push('/series/period/details/' + id)
                    }
                  }
                }, '进入直播间'),
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push('/series/period/edit/' + id)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  on: {
                    click: () => {
                      let that = this
                      that.$Modal.confirm({
                        content: '确定要删除这课程吗？',
                        onOk: () => {
                          let params = {
                            id: id
                          }
                          api.deletePeriod(params).then((res) => {
                            if (res) {
                              console.log(res)
                              that.getSeriesPeriodList()
                            }
                          })
                        }
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        series: {}, //系列课详情
        categoryName: '',
        seriesBg: ''
      }
    },
    created() {
      this.getSeriesPeriodList()
      this.getSeriesDetails(this.formInline.id)
    },
    methods: {
      // 获取系列课列表
      getSeriesPeriodList() {
        api.getSeriesPeriodList(this.formInline).then((res) => {
          if (res) {
            console.log(res)
            this.data = res._items
            this.tableTotal = res._meta.totalCount
          }
        })
      },
      // 获取系列课详情
      getSeriesDetails(id) {
        api.getSeriesDetails({id: id}).then((res) => {
          if (res) {
            console.log(res)
            this.series = res
            this.seriesBg = res.img[0].url
            this.getResourceGuide()
          }
        })
      },
      // 改变状态
      selectStatus(value) {
        console.log(value)
        this.formInline.page = 1
        this.formInline.status = parseInt(value)
        this.getSeriesPeriodList()
      },
      // 搜索
      search() {
        this.formInline.page = 1
        this.getSeriesPeriodList()
      },
      // 分类
      getResourceGuide() {
        api.getResourceGuide().then((res) => {
          if (res) {
            console.log(res)
            res.forEach((item) => {
              if (item.id === this.series.category) {
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
  .seriesDetails
    .content
      .title
        padding 40px 20px
        border-bottom 1px solid #f4f4f4
      .search
        padding 20px;

</style>
