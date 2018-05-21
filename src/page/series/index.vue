/**
* @author zhangwenlong
* @date 2018/4/27
* @Description: 系列课
*/
<template>
  <div class="course">
    <div class="top">
      <h3>系列课</h3>
      <Button type="primary" @click="$router.push('/series/add')">新增系列课</Button>
    </div>
    <div class="search">
      <Form ref="formInline" :model="formInline" inline :label-width="80">
        <Input type="text" v-model.trim="formInline.name" placeholder="请输入课程标题" style="width: 200px;"
               icon="search" @on-change="search" @keyup.enter.native="search">
        </Input>
        <FormItem label="时间">
          <DatePicker type="datetime" placeholder="请输入时间" v-model="formInline.start"
                      style="width:200px" @on-change="selectStartDate"></DatePicker>
          <span style="margin: 0 5px;">-</span>
          <DatePicker type="datetime" placeholder="请输入时间" v-model="formInline.end" style="width:200px"
                      @on-change="selectEndDate"></DatePicker>
        </FormItem>
      </Form>
    </div>
    <div class="vm-clearfix" style="padding:40px 20px;">
      <Table :columns="columns" :data="data" :loading="loading"></Table>
      <Page :total="tableTotal" show-total class="mt20 vm-fr" :page-size="pageSize" @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'
  import {formatDate} from '@/util/time'

  export default {
    name: 'course',
    data() {
      return {
        formInline: {
          name: '', // 搜索
          start: '', // 开始时间
          end: '', // 结束时间
          course_type: 1,
          page: 1
        },
        loading: false,
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
            title: '课程分类',
            align: 'center',
            key: 'category'
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'times',
            render: (h, params) => {
              return h('span', formatDate(params.row.times))
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
                      this.$router.push('/series/details/' + id)
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push('/series/update/' + id)
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
                          api.deleteCourse(params).then((res) => {
                            if (res) {
                              console.log(res)
                              that.getCorseList()
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
        data: [],
        page: 1,
        pageSize: 20,
        tableTotal: 0
      }
    },
    created() {
      this.getCorseList()
    },
    methods: {
      search() {
        this.formInline.page = 1
        this.getCorseList()
      },
      getCorseList() {
        this.loading = true
        api.getCourseList(this.formInline).then((res) => {
          console.log(res)
          this.loading = false
          this.data = res._items
          this.tableTotal = res._meta.totalCount
        })
      },
      changePage(index) {
        this.formInline.page = index
        this.getCorseList()
      },
      selectDate() {
        this.formInline.page = 1
        this.getCorseList()
      },
      selectStartDate(current) {
        console.log(current)
        this.formInline.page = 1
        this.getCorseList()
      },
      selectEndDate(current) {
        console.log(current)
        this.formInline.page = 1
        this.getCorseList()
      }
    }
  }
</script>

<style scoped lang="stylus">
  .course
    min-height 100%
    background-color #fff
    .top
      padding 10px 20px
      display flex
      align-items center
      justify-content space-between
      border-bottom 1px solid #f4f4f4
    .search
      padding 20px;
</style>
