<template>
  <div class="layout">
    <div class="layout-header">
      <Row>
        <Col :xs="3" :sm="3" :md="3" :lg="3">
          <div class="layout-logo">知了TV管理后台</div>
        </Col>
        <Col :xs="2" :sm="2" :md="2" :lg="2" class="vm-textCenter" :offset="19">
          <span class="user mr20">{{name}}</span>
          <span class="logout" @click="logout">退出登录</span>
        </Col>
      </Row>
    </div>
    <div class="layout-content">
      <Row type='flex' style="height: 100%;overflow: hidden;">
        <Col :xs="3" :sm="3" :md="3" :lg="3" style="background-color:#495060;">
          <Menu active-name="home" theme="dark" width="auto"
                @on-select="route"
                :active-name="activeName"
                :open-names="[openName]">
            <MenuItem name="home">
              <Icon type="ios-home"></Icon>
              首页
            </MenuItem>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                课程管理
              </template>
              <MenuItem name="course">单次课程</MenuItem>
              <MenuItem name="series">系列课程</MenuItem>
            </Submenu>
          </Menu>
        </Col>
        <Col :xs="21" :sm="21" :md="21" :lg="21" style="padding: 20px;overflow-y: auto;height: 100%;">
          <router-view/>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/common'

  export default {
    name: 'layout',
    data() {
      return {
        name: ''
      }
    },
    created() {
      this.getUserInfo()
    },
    computed: {
      activeName() {
        return this.$route.path.split('/')[1]
      },
      openName() {
        if (this.$route.path.split('/')[1] !== 'home') {
          return '2'
        } else {
          return ''
        }
      }
    },
    methods: {
      // 跳转
      route(name) {
        this.$router.push('/' + name)
      },
      // 退出登录
      logout() {
        api.logout().then((res) => {
          if (res) {
            console.log(res)
            sessionStorage.removeItem('user')
            window.location.href = window.location.origin
          }
        })
      },
      getUserInfo() {
        api.getUserInfo().then((res) => {
          if (res) {
            this.name = res.name
            sessionStorage.setItem('user', JSON.stringify(res))
          }
        })
      },
    }
  }
</script>
