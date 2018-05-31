<template>
	<v-content>
		<v-card>
			<v-toolbar dark card color="primary" class="card__head">
				<v-toolbar-title class="card__title">Sélectionnez votre RDV</v-toolbar-title>
			</v-toolbar card>
			<v-card-text class="card__body">
				<table class="card__body__calendar">
					<thead class="card__body__calendar__head">
						<v-btn icon class="card__body__calendar__navicon"v-on:click="getPreviousDays()">
							<v-icon>navigate_before</v-icon>
						</v-btn>
						<!-- affichage de la date -->
						<tr class="card__body__calendar__headDays" v-for="(day,index) in dayRangeToDisplay">
							<ul class="card__body__calendar__headDayUl">
								<li class="card__body__calendar__headDayLi">{{day | dateFormatDayName}}</li>
								<li class="card__body__calendar__headDayLi">{{day | dateFormatDayNumberAndMonth}}</li>
							</ul>
						</tr>
						<v-btn icon class="card__body__calendar__navicon" v-on:click="getNextDays()">
							<v-icon>navigate_next</v-icon>
						</v-btn>
					</thead>
					<tbody class="card__body__calendar__body">
						<!-- affichage des boutons heures -->
						<tr class="card__body__calendar__bodyDay" v-for="(day,index) in dayRangeToDisplay" :key="index">
							<ul class="card__body__calendar__bodyUl" v-for="(button, index) in btnIdToDisplay" v-if="buttonIsInDay(day,button)" :key="index">
								<li class="card__body__calendar__bodyLi">
									<v-btn outline color="primary" class="card__body__calendar__btn" v-on:click="selectTime(button,getSlotsFromStore)" :key="index" v-bind:disabled="button.disabled" v-bind:button="button">{{button.id | displayButtonId}}
									</v-btn>
								</li>
							</ul>
						</tr>
					</tbody>
				</table>
			</v-card-text>
		</v-card>
	</v-content>
</template>


<script>

import { store } from './../../store/store';
import http from './../../helpers/http';
import cal from './../../helpers/calendar';
import moment from 'moment';
import 'moment/locale/fr';
import twix from 'twix';

export default {
	name: 'calendar',
	props:['visibleProp'],
	data () {
		return {
			hours:['10:00','11:00', '12:00', '13:00', '14:00', '15:00'],
			hour:'',
			day:'',
			beginDisplay:0,
			aptMoment:'',
			aptSlot:'',
			displayAuth:this.visibleProp,
			button:'',
			buttonList:[],
			filteredButtonList: [],
			disabled: ''
		}
	},
	computed:{
		getCurrentDay(){
			return moment();
		},
		getDaysRange(){
			let start= moment(this.getCurrentDay).add(1, 'days');
			let end = this.getCurrentDayPlus2month(moment(start));
			return this.getDaysOfTheTimeRange(start, end);
		},
		endDisplay(){
			return this.beginDisplay+3;
		},
		dayRangeToDisplay(){
			return this.getDaysRange.slice(this.beginDisplay,this.endDisplay);
		},
		getSlotsFromStore(){
      		return this.$store.state.slots;
    	},
    	btnIdToDisplay(){
      		return this.filterButtonIdToDisplay(this.dayRangeToDisplay, this.buttonList);
    },
	},
	created(){
		http.get('/')
    .then( 
      res => {
        console.log('res from get calendar:', res);
        this.$store.commit('getSlots',res.data.content);
        this.createButtonId(this.getDaysRange);
	 	this.updateButtonId(this.getSlotsFromStore, this.buttonList);
      })
    .catch( 
      err => {console.log('err:', err)});
	},
	methods:{
		getCurrentDayPlus2month(now){
			return moment(now).add(2,'month');
		},
		getDaysOfTheTimeRange(start,end){
			let arr = moment(start).twix(end).toArray('days');
			return arr;
		},
		getNextDays(){
			if (this.beginDisplay>=0){ 
				this.beginDisplay += 3
				this.filteredButtonList = [];
			}
		},
		getPreviousDays(){
			if (this.beginDisplay>=3){
				this.beginDisplay -= 3
				this.filteredButtonList = [];
			}
			
		},
		buttonIsInDay: function(day,btn){
	      // this is a conditional function, called in V-for to display under the day only the button with ID matching the day
	      let a = moment(day).format('YYYY-MM-DD').toString();
	      let b = btn.id.slice(0,10);
	      if(a == b) {
	        return true;
	      }
	    },
		selectTime(button,slots){
			//display the form to enter personnal details
			this.displayAuth = false;
			//pass to store the appointment time
			let aptTime = button.id.slice(0,16).toString();
			this.aptMoment = moment(aptTime,'YYYY-MM-DD-HH-mm' );
			this.$store.commit('getAptTime', this.aptMoment);
			//pass to store the matching slot
			this.getMatchingSlot(this.getSlotsFromStore);
			this.$store.commit('getAptSlot', this.aptSlot);
			//pass to parent component Home the event to change display Auth to visible
			this.updateDisplayAuth();
			
		},
		getMatchingSlot(slotList){
			for (let i=0; i<slotList.length; i++){
				let sl = moment(slotList[i].start)
				if (moment(sl).isSame(this.aptMoment)){
					console.log('matching slot:', slotList[i]);
					this.aptSlot = slotList[i];
				}
			}
			return this.aptSlot
		},
		updateDisplayAuth(){
			this.displayAuth = !this.displayAuth;
			this.$emit('displayAuth', this.displayAuth);
		},
		createButtonId(timeRange){
	      this.buttonList = [];
	      //based on a timeRange of days, and based on the hours to display in agenda
	      //this function create buttons with Id representatives of the date, hour.
	      //by default, they also represent status N( Non available)
	      let reg = /:/;
	      for (let i=0; i<timeRange.length; i++){
	        for(let j=0; j<this.hours.length; j++){
	          let id;
	          id = moment(timeRange[i]).format('YYYY-MM-DD').toString()+ '-' + this.hours[j]+ '-' +'N';
	          id = id.replace(reg, '-');
	          let button = {
	            id: id,
	            class:'N',
	            disabled: true
	          }
	          this.buttonList.push(button);
	        }
	      }
	      return this.buttonList;
	    },
	    updateButtonId(slots, btnList){
	      //this function will update ButtonID based on slots status, and modify the buttonsID accordingly
	      for (let i=0; i<slots.length; i++){
	        for (let j=0; j<btnList.length; j++){
	          let sl = moment(slots[i].start).format('YYYY-MM-DD-HH-mm').toString();
	          let id = btnList[j].id.slice(0,16);
	          if (sl == id) {
	            if(slots[i].status === 'available'){
	              btnList[j].id = btnList[j].id.slice(0,16)+'-'+'A';
	              btnList[j].class = 'A';
	              btnList[j].disabled = false;
	            }
	            if(slots[i].status === 'booked'){
	              btnList[j].id = btnList[j].id.slice(0,16)+'-'+'B';
	              btnList[j].class = 'B';
	              btnList[j].disabled = true;
	            }
	          }
	        }
	      }
	      return this.buttonList;
	    },
	    filterButtonIdToDisplay(timeRange, btnList){
	      for (let i=0; i<timeRange.length; i++){
	        let trday
	        trday = moment(timeRange[i]).format('YYYY-MM-DD').toString();
	        for (let j=0; j<btnList.length; j++){
	          let btnid = btnList[j].id.slice(0,10);
	          if (trday == btnid){
	            this.filteredButtonList.push(btnList[j]);
	          }
	        }
	      }
	      return this.filteredButtonList;
	    }
	},
	filters:{
		dateFormatDayName(date) {
			return moment(date).format('dddd');
		},
		dateFormatDayNumberAndMonth(date) {
			return moment(date).format('D MMM');
		},
		dateFormatFullDayHour(date){
			return moment(date).format('LLLL');
		},
		displayButtonId(id){
      		id = id.slice(11,16);
      		let reg = /-/;
			id = id.replace(reg, ':');
			return id;
    	}
	}
};
</script>



<style scoped>


</style>