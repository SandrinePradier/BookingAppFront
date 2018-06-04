import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state:{
		apt:{
			aptTime:'',
			aptDuration:60,
			aptName:'',
			aptEmail:'',
			aptSlot:'',
			confirmation:''
		},
		slots: []
	},
	getters:{
		shareApt(state){
			return state.apt;
		}
	},
	mutations:{
		getSlots(state,slots){
			state.slots = slots;
		},
		getAptTime(state,apt){
			state.apt.aptTime = apt;
		},
		getAptName(state,contact){
			state.apt.aptName = contact;
		},
		getAptEmail(state,contact){
			state.apt.aptEmail = contact;
		},
		getAptSlot(state,slot){
			state.apt.aptSlot = slot;
		},
		getConfirmation(state, message){
			state.apt.confirmation = message;
		}
	}
})