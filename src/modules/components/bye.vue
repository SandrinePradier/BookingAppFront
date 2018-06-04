<template>
  <v-container fluid class="hello">
    <v-layout class="text" column wrap justify-center>
    <v-flex class="msg"><h1>{{ msg }}</h1></v-flex>
    <v-flex class="msga"><h1>{{ msga }}</h1></v-flex>
    </v-layout>
    <v-btn outline color="white" :to="{name:'home'}">prendre un autre rendez-vous</v-btn>
  </v-container>
</template>


<script>


export default {
  name: 'bye',
  components: {
  },
  data () {
    return {
     msg:'Merci',
     msga:'A bientôt !'
    }
  },
  methods:{
  }
};
</script>


<style scoped>

.hello{
  background-image: linear-gradient(to top, #5f72bd 0%, #9b23ea 100%);
  height: 100%;
  color:white;
}

.text{
  margin-top: 25vh;
}

h1 {
  text-align: center;
  color:white;
  font-family: 'Raleway', sans-serif;
  font-weight: 1200;
  font-size: 60px;
  line-height: 60px;
 
}

.msga{
  margin-bottom: 5vh;
}

</style>
