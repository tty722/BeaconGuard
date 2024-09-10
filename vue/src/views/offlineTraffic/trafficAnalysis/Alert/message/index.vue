<template>
    <div class="message-container">
        <section id="left">
            <div class="time">
                <Time></Time>
            </div>
            <div class="select">
                <Select></Select>
            </div>
        </section>
        <section id="right">
            <div class="table-box">
                <Table></Table>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import Time from './time/time.vue';
import Select from './select/select.vue';
import Table from './table/table.vue';
</script>

<style scoped lang="scss">
.message-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 10px;
    flex-direction: row;

    section#left {
        width: 40%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .time {
            width: 100%;
            height: 50%;
        }

        .select {
            width: 100%;
            height: 50%;
        }
    }

    section#right {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: row;

        .table-box {
            padding: 10px;
            width: 100%;
            height: 95%;
        }
    }
}
</style>