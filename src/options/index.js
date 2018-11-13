import Vue from 'vue';
import Root from './Root.vue';
import config from '../common/config.js';

import 'muse-ui/dist/muse-ui.css';
import MuseUI from 'muse-ui';
Vue.use(MuseUI);
// Helpers
import Helpers from 'muse-ui/lib/Helpers';
Vue.use(Helpers);
// 进度条
import 'muse-ui-progress/dist/muse-ui-progress.css';
import MuseUIProgress from 'muse-ui-progress';
Vue.use(MuseUIProgress, {
    color: 'red'
});
// toast
import Toast from 'muse-ui-toast';
Vue.use(Toast, {
    position: 'top'
});
// loading
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Loading from 'muse-ui-loading';
Vue.use(Loading);
// 提示框
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
Vue.use(Message);
import '../components';
import '../common/base.less';

Vue.config.productionTip = false;

var data = {};
for (let k in config) {
    Object.defineProperty(data, k, {
        enumerable: true,
        configurable: true,
        get() {
            return config[k];
        },
        set(value) {
            if (config[k] === value) return;
            config[k] = value;
            chrome.storage.local.set({
                [k]: value
            });
        }
    });
}

/* eslint-disable no-new */
let vue = new Vue({
    el: '#root',
    data: data,
    render: h => h(Root)
});

chrome.storage.onChanged.addListener(changes => {
    for (let key in changes) {
        vue[key] = changes[key].newValue;
    }
});