<template>
  <v-container fluid class="home">
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        Date du Rendez-vous
        <small>Sélectionnez une date et une heure parmi les choix disponibles</small>
      </v-stepper-step>
      <v-stepper-content step="1">
       <calendar></calendar>
        <v-btn color="primary" @click.native="OkToNextStep(2)">Suivant</v-btn>
        <v-btn flat @click.native="reset()">Annuler</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="e6 > 2" step="2">
        Vos coordonnées
        <small>Merci de renseigner vos coordonnées pour la confirmation du rendez-vous</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <authentication></authentication>
        <v-btn color="primary" v-on:click="bookApt(shareApt)" @click.native="OkToNextStep(3)">Suivant</v-btn>
        <v-btn flat @click.native="goBackToFirstStep()">Annuler</v-btn>
      </v-stepper-content>
      <v-stepper-step :complete="e6 > 3" step="3">
       Confirmation
       <small></small>
     </v-stepper-step>
     <v-stepper-content step="3">
      <confirmation></confirmation>
      <v-btn color="primary" :to="{name:'bye'}">Suivant</v-btn>
    </v-stepper-content>
    </v-stepper>

  </v-container>
</template>


<script>

import { store } from './../../store/store';
import { mapGetters } from 'vuex'
import http from './../../helpers/http';
import calendar from '@/modules/components/calendar';
import authentication from '@/modules/components/authentication';
import confirmation from '@/modules/components/confirmation';


export default {
  name: 'home',
  components: {
    calendar,
    authentication,
    confirmation
  },
  data () {
    return {
     e6:1
    }
  },
  computed:{
      ...mapGetters([
        'shareApt'
        ])
  },
  methods:{
    OkToNextStep(step){
      this.e6 = step;
    },
    goBackToFirstStep(){
      this.e6 = 1;
    },
    reset(){
      //cette fonction devra remettre à zéro le apttime et aptslot du store. le store renverra ensuite apttime et aptslot au calendar
    },
    bookApt(apt){
      console.log('this.shareApt:', this.shareApt);
      http.post('client', this.shareApt)
      .then(
        res => {
          console.log('res from POST aptDetails: ', res);
          this.$store.commit('getConfirmation', res.data.message);
        })
      .catch(
        error => {
          console.log(error.response);
          this.$store.commit('getConfirmation', error.response);
        });
    }
  }
};
</script>


<style scoped>

</style>
