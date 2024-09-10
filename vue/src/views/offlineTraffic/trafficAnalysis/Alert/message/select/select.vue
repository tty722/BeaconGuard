<template>
    <div class="selecter">
      <el-form label-width="auto" label-position="top" :model="filterForm">
        <el-form-item label="Select time" style="display: flex; flex-direction: column">
          <el-time-picker is-range range-separator="To" start-placeholder="Start time" end-placeholder="End time"
            v-model="filterForm.select_time" />
        </el-form-item>
        <el-form-item label="Attack">
          <el-select placeholder="Which type of attack you prefer?" placement="top" v-model="filterForm.select_attack">
            <el-option label="Bot" value="1" />
            <el-option label="DDoS" value="2" />
            <el-option label="DoS" value="3" />
            <el-option label="BruteForce" value="4" />
            <el-option label="Heartbleed" value="5" />
            <el-option label="Infiltration" value="6" />
            <el-option label="PortScan" value="7" />
            <el-option label="WebAttack" value="8" />
          </el-select>
        </el-form-item>
        <el-form-item class="submit_btn">
          <el-button type="primary" @click="submitHandler">Submit</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from "vue";
  
  let filterForm = reactive({
    select_time: '',
    select_attack: '1',
  });
  
  
  //提交表单回调
  const submitHandler = () => {
    console.log(filterForm);
  
  }
  </script>
  
  <style scoped>
  .selecter {
    width: 50%;
    height: 100%;
    margin: auto;
  
    .el-form {
      margin-top: 20px;
  
      .el-form-item {
        margin-top: 40px;
      }
  
      .submit_btn {
        .el-button {
          margin-top: 30px;
          margin-left: auto;
          margin-right: auto;
          width: 200px;
          background-color: transparent;
          color: black;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
          border: 2px solid rgb(139, 139, 139);
          transition: all 0.3s;
        }
  
        .el-button:hover {
          color: rgb(47, 47, 47);
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
        }
  
        .el-button:active {
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
  
  </style>