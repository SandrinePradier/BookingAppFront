<template>
	<v-container fluid>
				<v-content>{{ aptTime| dateFormatFullDayHour}}H</v-content>
				<v-form>
					<v-text-field label="Nom" v-model="name"></v-text-field>
					<v-text-field label="E-mail" v-model="email"></v-text-field>
				</v-form>
	</v-container>
</template>


<script>

import { store } from './../../store/store';
import http from './../../helpers/http';
import moment from 'moment';
import 'moment/locale/fr';

export default {
  name: 'authentication',
  data () {
    return {
    }
  },
  computed:{
    name:{
      get(){
        return this.$store.state.apt.aptName;
      },
      set(value){
        console.log('value name:', value);
        if (value){
          this.$store.commit('getAptName', value);
        }
      }
    },
    email:{
      get(){
        return this.$store.state.apt.aptEmail;
      },
      set(value){
        console.log('value email:', value);
        if (value){
          this.$store.commit('getAptEmail', value);
        }
      }
    },
    aptTime:{
      get(){
        return this.$store.state.apt.aptTime
      }
    }
  },
  filters:{
  	dateFormatFullDayHour: function(date){
			return moment(date).format('LLLL');
		}
  }
};
</script>



<style>

</style>