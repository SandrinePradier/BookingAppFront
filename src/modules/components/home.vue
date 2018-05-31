<template>
  <v-container fluid class="home">
    <v-container class="calendar">
    <calendar v-bind:visibleProp="visible" v-on:displayAuth="showAuth($event)"></calendar>
    </v-container>
    <v-container class="authentication">
      <authentication v-if="visible" ></authentication>
    </v-container>
  </v-container>
</template>


<script>

import { store } from './../../store/store';
import http from './../../helpers/http';
import calendar from '@/modules/components/calendar';
import authentication from '@/modules/components/authentication';


export default {
  name: 'home',
  components: {
    calendar,
    authentication
  },
  data () {
    return {
     visible:false
    }
  },
  methods:{
   showAuth(updateVisible){
    this.visible = updateVisible;
    console.log('this.visible in home: ', this.visible);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

/*.home{
  width: 100%;
  display: flex;
}

.calendar{
  float:left; 
  width: 50%;
  height: 400px;
}

.authentication{
  float: right;
  width: 50%;
  height: 400px;
}*/

</style>
