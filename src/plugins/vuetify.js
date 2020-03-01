import Vue from "vue";
import Vuetify from "vuetify/lib";
import ptBr from "./portuguese";
import { TiptapVuetifyPlugin } from "tiptap-vuetify";
import "tiptap-vuetify/dist/main.css";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
	lang: {
		current: "en"
	}
});

Vue.use(TiptapVuetifyPlugin, {
	vuetify,
	iconsGroup: "md"
});

Vue.use(VueSweetalert2);

export default new Vuetify({
	lang: {
		locales: { ptBr },
		current: "ptBr"
	},
	theme: {
		themes: {
			light: {
				primary: '#971B1E',
				secondary: '#F7951D',
				accent: '#971B1E'
			}
		}
	}
});
