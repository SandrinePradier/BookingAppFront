<template>
	<v-container fluid>
		<v-card>
			<v-toolbar dark color="primary" card class="card__head">
				<v-toolbar-title class="card__title">
					Confirmez votre RDV
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-content class="card__timeApt">{{ getAptDetails.aptTime| dateFormatFullDayHour}}</v-content>
			</v-toolbar card>
			<v-card-text>
				<v-form>
					<v-text-field label="Nom" v-model="name"></v-text-field>
					<v-text-field label="E-mail" v-model="email"></v-text-field>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn outline color="primary" v-on:click="bookApt(name,email)">Réservez</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>


<script>

import { store } from './../../store/store';
import http from './../../helpers/http';
import moment from 'moment';
import 'moment/locale/fr';

export default {
  name: 'authentication',
  computed:{
  	getAptDetails(){
  		return this.$store.state.apt;
  	}
  },
  data () {
    return {
      name:'',
      email:'',
      swalMessage:''
    }
  },
  methods:{
  	bookApt(name,email){
  		let aptDetails = {
  			name:name,
  			mail:email,
  			time:this.getAptDetails.aptTime,
        duration: this.getAptDetails.aptDuration,
        slotId: this.getAptDetails.aptSlot._id,
  		};
  		this.$store.commit('getAptContact',aptDetails );
      http.post('/', aptDetails)
      .then(
        res => {
          console.log('res from POST aptDetails: ', res);
          this.swalMessage = res.data.message;
          this.$swal({
            type:'success',
            title:'votre RDV',
            text:this.swalMessage,
            width: 300
          })
        })
      .catch(
        error => {
          console.log(error.response);
          this.swalMessage = error.response;
          this.$swal({
            type:'error',
            title:'votre RDV',
            text:this.swalMessage.data.message,
            width: 300
          })
        });
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