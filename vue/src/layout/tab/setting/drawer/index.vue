<template #header="{ avatar }">
  <div class="drawer_container">
    <div class="gender">
      <p>
        <User style="width: 20px; margin-right: 10px" />Gender
      </p>
      <el-icon size="25px">
        <Female v-if="userStore.gender == 'female'" />
        <Male v-if="userStore.gender == 'male'" />
      </el-icon>
    </div>
    <div class="phone">
      <p>
        <Phone style="width: 20px; margin-right: 10px" />Phone number
      </p>
      <p style="margin-top: 5px">{{ userStore.phoneNumber == -1 ? '' : userStore.phoneNumber }}</p>
    </div>
    <div class="userEmail">
      <p>
        <Message style="width: 20px; margin-right: 10px" />Email
      </p>
      <p style="margin-top: 5px">{{ userStore.email }}</p>
    </div>
    <div class="birthday">
      <p>
        <Discount style="width: 20px; margin-right: 10px" />Birthday
      </p>
      <p style="margin-top: 5px" v-if="userStore.birthday !== ''">
        {{ userStore.birthday }}
      </p>
    </div>
    <div class="personality_tab">
      <p>
        <ChatLineSquare style="width: 20px; margin-right: 10px" />Personality tabs
      </p>
    </div>
    <div class="tabs">
      {{
        userStore.personalityTag === ''
          ? "此人很懒，什么都没有留下"
          : userStore.personalityTag
      }}
    </div>
    <div class="logout">
      <el-button @click="openDialog = true">Edit</el-button>
      <el-dialog v-model="openDialog" width="40%">
        <InformationEdit @close-dialog="openDialog = false"></InformationEdit>
      </el-dialog>
      <el-button @click="open">Log out</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import InformationEdit from "./informationEdit.vue";
import useUserStore from "@/store/modules/user";
import { ElMessageBox } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";

let openDialog = ref(false);
let userStore = useUserStore();
let $router = useRouter();
//退出登录按钮回调
const open = () => {
  ElMessageBox.confirm("Are you sure you want to quit?", "Confirm", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "info",
  })
    .then(() => {
      logoutHandler();
    })
    .catch(() => { });
};

const logoutHandler = async () => {
  //需要想服务器发送请求[推出登录接口]
  //仓库当中关于用户的数据都要清空[token]
  await userStore.userLogout();
  //跳转到登录页面
  $router.push({ path: "/" });
};

</script>

<style scoped lang="scss">
.drawer_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  /* 垂直排列 */
  .gender {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }

  .phone {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }

  .userEmail {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }

  .birthday {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }

  .personality_tab {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }

  .tabs {
    width: 100%;
    height: 150px;
    margin-top: 50px;
    font-family: "ali";
    padding: 30px;
    border-radius: 5px 5px 5px 5px;
    background-color: rgba(202, 202, 202, 0.342);
  }

  .logout {
    width: 100%;
    height: 50px;
    display: flex;
    margin-top: auto;
    justify-content: space-between;

    .el-button {
      width: 100px;
      height: 40px;
      margin-left: 20px;
      margin-right: 20px;
      background-color: transparent;
      border: 2px solid rgb(131, 131, 131);
      font-family: Arial, Helvetica, sans-serif;
      color: rgb(47, 47, 47);
      font-weight: 600;
      transition: all 0.3s;
    }

    .el-button:hover {
      color: rgb(47, 47, 47);
      box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.7);
    }

    .el-button:active {
      box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
