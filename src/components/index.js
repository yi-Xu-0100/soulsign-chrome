import Vue from 'vue';
import filter from './filter';
for (let k in filter) {
    Vue.filter(k, filter[k]);
}
import IDate from './IDate.vue';
Vue.component('IDate', IDate);
import IRate from './IRate.vue';
Vue.component('IRate', IRate);