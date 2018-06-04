<template>
	<div>
		<h1>{{shareApt.confirmation}}</h1>
	</div>
</template>


<script>

import { store } from './../../store/store';
import { mapGetters } from 'vuex'

export default {
  name: 'confirmation',
  data () {
    return {
      msg: ''
    }
  },
  computed:{
      ...mapGetters([
        'shareApt'
        ])
  }
};
</script>



<style lang="scss">
</style>