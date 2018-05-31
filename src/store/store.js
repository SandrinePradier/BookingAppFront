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
		},
		slots: []
	},
	mutations:{
		getSlots(state,slots){
			state.slots = slots;
		},
		getAptTime(state,apt){
			state.apt.aptTime = apt;
		},
		getAptContact(state,contact){
			state.apt.aptName = contact.name;
			state.apt.aptEmail = contact.email;
		},
		getAptSlot(state,slot){
			state.apt.aptSlot = slot;
		}
	}
})