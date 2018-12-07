import Vue from 'vue';
import filter from './filter';
for (let k in filter) {
    Vue.filter(k, filter[k]);
}
import IDate from './IDate.vue';
Vue.component('IDate', IDate);
import IRate from './IRate.vue';
Vue.component('IRate', IRate);
import IForm from './IForm.vue';
Vue.component('IForm', IForm);
Vue.directive('focus', {
    inserted: function(el) {
        let input;
        if (el.tagName == "input")
            input = el;
        else {
            let rows = el.querySelectorAll(`input,textarea,select,[contenteditable='true']`);
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                if (row.offsetWidth * row.offsetHeight > 0) {
                    input = row;
                    break;
                }
            }
        }
        if (input) setTimeout(function() {
			input.focus();
		}, 100);;
    }
});