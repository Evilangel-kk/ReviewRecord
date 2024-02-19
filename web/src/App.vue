<template>
  <div id="box">
    <Calendar />
    <Record />
  </div>
</template>

<script>
import Calendar from './components/Calendar.vue';
import Record from './components/Record.vue';
export default {
  data(){
    return{
      
    }
  },
  components:{
    Calendar,
    Record
  }
}
</script>

<style scoped>
#box{
  position: relative;
  display: flex;
}
</style>
