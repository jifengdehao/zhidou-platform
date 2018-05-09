/**
* @author zhangwenlong
* @date 2018/4/20
* @Description: 登录
*/
<template>
  <div id="login" @keyup.enter="handleSubmit">
    <Form ref="formLogin" :model="formLogin" :rules="formLoginRules" class="login-box">
      <Form-item class="vm-textCenter">
        <h2>知了TV管理后台</h2>
      </Form-item>
      <Form-item prop="account">
        <Input size="large" type="text" v-model.trim="formLogin.account" placeholder="请输入手机号" clearable>
        <Icon type="person" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input size="large" type="password" v-model.trim="formLogin.password" placeholder="密码" clearable>
        <Icon type="locked" slot="prepend"></Icon>
        </Input>
      </Form-item>
      </Form-item>
      <Form-item>
        <Button type="primary" long @click="handleSubmit" size="large">登录</Button>
      </Form-item>
      <Form-item class="vm-textCenter" style="margin-bottom: 0;">
        <a href="javascript:">前往知了TV官网</a>
      </Form-item>
    </Form>
  </div>
</template>

<script>
  import * as api from '@/api/common'

  export default {
    name: 'login',
    data() {
      return {
        formLogin: {
          account: '',
          password: ''
        },
        formLoginRules: {
          account: [
            {required: true, message: '请填写手机号', trigger: 'blur'},
            {type: 'string', min: 11, message: '手机号不能小于11位', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        if (!this.tid) {
          this.$refs.formLogin.validate(valid => {
            if (valid) {
              // 登录
              api.login(this.formLogin).then((res) => {
                if (res) {
                 //  sessionStorage.setItem('isLogin', '1')
                  this.tid = true
                  this.$router.push('/home')
                }
              })
            } else {
              this.tid = false
              this.$Notice.error({
                title: '登录验证失败！'
              })
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
