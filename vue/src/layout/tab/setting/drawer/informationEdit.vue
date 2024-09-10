<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px" :rules="rules" ref="forms">
    <el-form-item label="Username" prop="username">
      <el-input v-model="form.username" prefix-icon="User" />
    </el-form-item>
    <el-form-item label="Phone number" prop="phone">
      <el-input v-model="form.phone" prefix-icon="Phone"></el-input>
    </el-form-item>
    <el-form-item label="Birthday" prop="birthday">
      <el-date-picker v-model="form.birthday" type="date" placeholder="Pick a date" style="width: 100%" />
    </el-form-item>
    <el-form-item label="Activity part" prop="type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox name="type" label="软件开发"></el-checkbox>
        <el-checkbox name="type" label="网络安全"></el-checkbox>
        <el-checkbox name="type" label="机器学习"></el-checkbox>
        <el-checkbox name="type" label="大语言模型"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Gender" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio value="male">Male</el-radio>
        <el-radio value="female">Female</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Personality tab" prop="personalityTag">
      <el-input v-model="form.personalityTag" type="textarea" placeholder="请告诉我们关于你" />
    </el-form-item>
    <el-form-item>
      <div class="button-group">
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button type="primary" @click="cancel">Cancel</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { phoneValidator, usernameValidator } from "@/utils/verify";
import { reactive } from "vue";
import { ref } from "vue";
import { ElNotification } from "element-plus";
import useUserStore from "@/store/modules/user";

let forms = ref();
let userStore = useUserStore();

const emit = defineEmits(['closeDialog'])

// do not use same name with ref
let form = reactive({
  username: userStore.username,
  phone: userStore.phoneNumber,
  birthday: '',
  type: [],
  gender: userStore.gender,
  personalityTag: userStore.personalityTag,
});

const rules = {
  username: [{ trigger: "blur", validator: usernameValidator }],
  phone: [{ trigger: "blur", validator: phoneValidator }],
}



const onSubmit = async () => {
  //确定表单校验完毕
  await forms.value.validate();
  try {
    await userStore.userInfoChange(form);
    ElNotification({
      title: "信息修改成功",
      type: "success",
    });
  } catch (error) {
    ElNotification({
      type: "error",
      message: (error as Error).message,
    });
  }
  emit('closeDialog');
};

//取消事件回调
const cancel = () => {
  emit('closeDialog');
}
</script>

<style scoped lang="scss">
.button-group {
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  display: flex;
  justify-content: space-between;
  /* 两端对齐，使按钮对称分布 */
  align-items: center;
  /* 垂直居中 */
}
</style>
