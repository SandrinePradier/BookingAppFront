<template>
					<v-container fluid grid-list class="card__body">
					<v-layout fluid row wrap center class="card__body__calendar">
						
						<!-- //1 -->
						<v-flex class="a">
							<v-btn icon class="card__body__calendar__navicon"v-on:click="getPreviousDays()">
								<v-icon>navigate_before</v-icon>
							</v-btn>
						</v-flex>

						<!-- //2 -->
						<v-flex class="b">
							<v-container fluid grid-list>
								<v-layout row justify-center wrap>

									<v-flex xs12 sm12 md4 lg4 xl4 class="card__body__calendar__Days" v-for="(day,index) in dayRangeToDisplay" :key='index'>
										<li class="card__body__calendar__headDayLi">{{day | dateFormatDayName}}</li>
										<li class="card__body__calendar__headDayLi">{{day | dateFormatDayNumberAndMonth}}</li>
										<ul class="card__body__calendar__bodyUl" v-for="(button, index) in btnIdToDisplay" v-if="buttonIsInDay(day,button)" :key="index">
											<li class="card__body__calendar__bodyLi">
												<v-btn small outline color="primary" class="card__body__calendar__btn" v-on:click="selectTime(button,getSlotsFromStore)" :key="index"  v-bind:disabled="button.disabled" v-bind:button="button">{{button.id | displayButtonId}}
												</v-btn>
											</li>
										</ul>
									</v-flex>
									</v-layout>
								</v-container>
							</v-flex>

						<!-- //3 -->
						<v-flex class="c">
							<v-btn icon class="card__body__calendar__navicon" v-on:click="getNextDays()">
								<v-icon>navigate_next</v-icon>
							</v-btn>
						</v-flex>

						<v-layout fluid row wrap justify-center v-if="visible" class="sumup">
							<h3>Votre sélection:&nbsp</h3>
							<h3> {{aptMoment | dateFormatFullDayHour}}H</h3>
						</v-layout>

					</v-layout>
				</v-container>
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
	// props:['visibleProp'],
	data () {
		return {
			hours:['10:00','11:00', '12:00', '13:00', '14:00', '15:00'],
			hour:'',
			day:'',
			beginDisplay:0,
			aptMoment:'',
			aptSlot:'',
			visible:false,
			button:'',
			buttonList:[],
			filteredButtonList: [],
			disabled: '',
			activeColor:''
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
		updateVisible(){
			if (this.visible == false) {
				this.visible = !this.visible;
			}
			// this.$emit('displayAuth', this.displayAuth);
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
	    },
	    selectTime(button,slots){
			this.updateVisible();
			this.aptMoment = moment(button.id.slice(0,16).toString(),'YYYY-MM-DD-HH-mm' );
			this.$store.commit('getAptTime', this.aptMoment);
			//pass to store the matching slot
			this.getMatchingSlot(this.getSlotsFromStore);
			this.$store.commit('getAptSlot', this.aptSlot);
			},
			getMatchingSlot(slotList){
			for (let i=0; i<slotList.length; i++){
				let sl = moment(slotList[i].start)
				if (moment(sl).isSame(this.aptMoment)){
					this.aptSlot = slotList[i];
				}
			}
			return this.aptSlot
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