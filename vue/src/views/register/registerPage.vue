<template>
  <div class="sign-up-container">
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
        <el-form class="register-form" :model="registerForm" :rules="rules" ref="registerForms">
          <h1>Sign up using your email</h1>
          <el-form-item class="email_item" prop="email">
            <el-input
              class="email"
              :prefix-icon="ChatLineSquare"
              type="text"
              v-model="registerForm.email"
              placeholder="Email"
            ></el-input>
          </el-form-item>
          <el-form-item class="username_item" prop="username">
            <el-input class="username" :prefix-icon="User" type="text" v-model="registerForm.username"
              placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item class="password_item" prop="password">
            <el-input class="password" :prefix-icon="Lock" type="password" v-model="registerForm.password"
              placeholder="Password" show-password></el-input>
          </el-form-item>
          <el-form-item class="confirm_item" prop="confirmPass">
            <el-input
              class="confirmPass"
              :prefix-icon="Lock"
              type="password"
              v-model="registerForm.confirmPass"
              show-password
              placeholder="Comfirm Password"
            ></el-input>
          </el-form-item>
          <el-form-item class="signIn">
            <p>Already have an account?</p>
            <a @click="singInHandler">Sign in</a>
          </el-form-item>
          <el-form-item class="btn-container">
            <el-button
              type="primary"
              size="default"
              class="register_btn"
              @click="singUpHandler"
              :loading-icon="Eleme"
              :loading="loading"
              >Sign Up</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </div>
</template>
  
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  emailValidator,
  usernameValidator,
  passwordValidator,
  confirmPassValidator,
} from "@/utils/verify.ts"; //引入表单校验方法
import { ChatLineSquare, Eleme, Lock, User } from '@element-plus/icons-vue';
import useUserStore from '@/store/modules/user';
import { ElNotification } from 'element-plus';
import { getTime } from '@/utils/time';


let registerForm = reactive({
  email: "3088362312@qq.com",
  username: "llspotty",
  password: "111111",
  confirmPass: "111111",
});

let registerForms=ref();//获取registerForm的实例

let userStore=useUserStore();

let $router = useRouter();

let loading = ref(false);//加载状态

//定义表单校验规则,方法定义在@/utils/verify.ts中
const rules = {
  email: [{ trigger: "blur", validator: emailValidator }],
  username: [{ trigger: "blur", validator: usernameValidator }],
  password: [{ trigger: "blur", validator: passwordValidator }],
  confirmPass: [
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: Function) =>
        confirmPassValidator(rule, value, callback, registerForm),
    },
  ],
};

//登录事件回调
const singInHandler=()=>{
  $router.push('/login');
}

//注册事件回调
const singUpHandler=async()=>{
  //确保表单校验完整
  await registerForms.value.validate();
  loading.value=true;

  try {
    await userStore.userSignUp(registerForm);//注册响应
    //注册成功
    $router.push('/layout')
    loading.value = false;
    //注册提示信息
    ElNotification({
      title: `${getTime()}好，${registerForm.username}`,
      message: "欢迎使用",
      type: "success",
    });
  } catch (error) {
    loading.value = false;
    //注册的失败提示信息
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
}
</script>
  
<style scoped lang="scss">
.sign-up-container{
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

  #right{
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .form-box {
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 10%;
      width: 70%;
      height: 70%;
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
        margin-top: 10px;
        text-align: center;
      }

      .email_item {
        width: 70%;
        height: 60px;
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;

        .email {
          height: 50px;
        }
      }

      .username_item {
        width: 70%;
        height: 60px;
        margin-left: auto;
        margin-right: auto;

        .username {
          height: 50px;
        }
      }

      .password_item {
        width: 70%;
        height: 60px;
        margin-left: auto;
        margin-right: auto;

        .password {
          height: 50px;
        }
      }

      .confirm_item {
        width: 70%;
        height: 60px;
        margin-left: auto;
        margin-right: auto;

        .confirmPass {
          height: 50px;
        }
      }

      .signIn {
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

      .btn-container{
        width: 100%;
        height: 20%;

        .register_btn{
          margin: auto;
          width: 30%;
          height: 35px;
          border: none;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 15px;
          font-weight: 600;
        }
        .register_btn:hover {
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
}
</style>