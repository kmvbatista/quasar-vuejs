import Vue from 'vue';
import VueRouter from 'vue-router';
import User from '../views/User.vue';
import UseTerm from '../views/UseTerm.vue';
import RentalPeriods from '../views/RentalPeriods.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/user',
		name: 'User',
		component: User
	},
	{
		path: '/use-term',
		name: 'UseTerm',
		component: UseTerm
	},
	{
		path: '/rental-period',
		name: 'RentalPeriods',
		component: RentalPeriods
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
