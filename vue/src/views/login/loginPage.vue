<template>
  <div class="sign-in-container">
    <el-col id="left" :span="12" :xs="0">
      <h1>BeaconGuard</h1>
      <p>
        A powerful tool for capturing and
        analyzing network traffic, designed to provide deep insights into your
        network's activity.
      </p>
    </el-col>

    <el-col id="right" :span="12" :xs="24">
      <div class="form-box">
        <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Sign in using your username</h1>
          <el-form-item class="username_item" prop="username">
            <el-input class="username" :prefix-icon="User" type="text" v-model="loginForm.username"
              placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item class="password_item" prop="password">
            <el-input class="password" :prefix-icon="Lock" type="password" v-model="loginForm.password"
              placeholder="Password" show-password></el-input>
          </el-form-item>
          <el-form-item class="signUp">
            <p>Don’t have an account?</p>
            <a @click="signUpHandler">Sign up</a>
          </el-form-item>
          <el-form-item class="btn-container">
            <el-button type="primary" size="default" class="login_btn" @click="signInHandler" :loading-icon="Eleme"
              :loading="loading">Sign In</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>


  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
import { passwordValidator, usernameValidator } from '@/utils/verify';
import { Eleme, Lock, User } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';


let loginForm = reactive({
  username: 'llspotty',
  password: '111111',
})

let loginForms = ref();//获取loginForm实例

let loading = ref(false);//加载状态

//登录的校验表单
const rules = {
  username: [{ trigger: 'blur', validator: usernameValidator }],
  password: [{ trigger: 'blur', validator: passwordValidator }],
}

let $router = useRouter();

let userStore = useUserStore();

//注册事件回调
const signUpHandler = () => {
  $router.push('/register');
}

//登录事件回调
const signInHandler = async () => {
  await loginForms.value.validate();//确保校验成功

  loading.value = true;

  try {

    await userStore.userSignIn(loginForm);//登录

    await userStore.userInfo();//获取用户信息

    $router.push('/layout');
    ElNotification({
      title: `${getTime()}好，${userStore.username}`,
      message: "欢迎回来",
      type: "success",
    });
    loading.value = false;

  } catch (error) {
    loading.value = false;
    //登录的失败提示信息
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
}

</script>

<style scoped lang="scss">
.sign-in-container {
  width: 100%;
  height: 100vh;
  background-image: url('../../../http.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;

  #left {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;

    h1 {
      text-align: center;
      margin-top: 35%;
      color: rgb(230, 237, 243);
      font-family: "Mona Sans", "Mona Sans Header Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: 60px;
      font-weight: 700;
    }

    p {
      width: 80%;
      margin-left: 50px;
      margin-top: 50px;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: rgb(230, 237, 243);


    }
  }

  #right {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .form-box {
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 10%;
      width: 70%;
      height: 50%;
      background: rgba(220, 220, 220, 0.8);
      /* 透明背景 */
      backdrop-filter: blur(10px);
      /* 背景模糊效果 */
      border-radius: 5px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      padding: 20px;

      .el-form{
        width: 100%;
        height: 100%;
      }

      h1 {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 700;
        margin-top: 5%;
        text-align: center;
      }

      .username_item {
        width: 70%;
        height: 70px;
        margin-top: 5%;
        margin-left: auto;
        margin-right: auto;

        .username {
          height: 50px;
        }
      }

      .password_item {
        width: 70%;
        height: 70px;
        margin-top: 5%;
        margin-left: auto;
        margin-right: auto;

        .password {
          height: 50px;
        }
      }

      .signUp {
        margin-left: auto;
        margin-right: auto;
        width: 60%;
        height: 20px;

        p {
          margin-left: 10px;
        }

        a {
          font-weight: 700;
          color: rgb(57, 156, 248);
          text-decoration: none;
        }

        a:hover {
          color: rgb(0, 125, 241);
        }

        a:active {
          color: rgb(13, 36, 109);
        }
      }

      .btn-container {
        width: 100%;
        height: 15%;

        .login_btn {
          margin: auto;
          width: 30%;
          height: 35px;
          border: none;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 15px;
          font-weight: 600;
        }

        .login_btn:hover {
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
        }
      }


    }
  }
}
</style>