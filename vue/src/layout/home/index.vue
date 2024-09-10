<template>
  <div class="home-container">
    <section id="left">
      <div class="welcome">
        <h1>Welcome to BeaconGuard! {{ userStore.username }}</h1>
      </div>
      <div class="chart">
        <img src="../../../NetStore.png" alt="">
      </div>
    </section>
    <section id="right">
      <Right></Right>
    </section>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/modules/user";
import Right from './right/right.vue'


let userStore=useUserStore()


</script>

<style scoped lang="scss">
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#left {
    width: calc(70% - 30px);
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 30px;
    margin-left: 10px ;

    .welcome{
      width: 100%;
      height: 200px;
      margin-top: 10px;
      display: flex;
      flex-direction:column;
      box-shadow: 0px 0px 5px rgba($color: #676767, $alpha: 0.5);

      h1{
        font-family: Arial, Helvetica, sans-serif;
        font-size: 50px;
        font-weight: 700;
        margin: auto;
      }
    }

    .chart{
      width: 100%;
      margin-top: 20px;
      height: calc( 100% - 235px);
      display: flex;
      box-shadow: 0px 0px 5px rgba($color: #676767, $alpha: 0.5);

      img{
        height: 100%;
        margin: auto;
      }
    }

  }

  section#right {
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 10px;

  }
}
</style>