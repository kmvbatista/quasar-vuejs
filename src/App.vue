<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<div class="d-flex align-center">
				<v-img
					alt="HBSIS"
					class="shrink mt-1"
					contain
					min-width="100"
					src="./assets/abinbev.svg.png"
					width="150"
					@click.stop="drawer = !drawer"
				/>
			</div>
			<v-spacer></v-spacer>
			<h1>{{ headerName }}</h1>
		</v-app-bar>
		<v-content>
			<v-navigation-drawer v-model="drawer" fixed temporary>
				<v-list dense>
					<v-list-item
						v-for="router in routes"
						:key="router.title"
						link
						:to="router.link"
					>
						<v-list-item-icon>
							<v-icon>{{ router.icon }}</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>{{ router.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-navigation-drawer>
			<router-view @headerNameChanged="headerName = $event"></router-view>
		</v-content>
	</v-app>
</template>

<script>
export default {
	name: 'App',
	components: {},
	data() {
		return {
			headerName: '',
			drawer: null,
			routes: [
				{ title: 'Usuário', icon: 'account_box', link: '/user' },
				{ title: 'Período de locação', icon: 'event', link: '/rental-period' },
				{ title: 'Termo de uso', icon: 'assignment', link: '/use-term' }
			]
		};
	}
};
</script>

<style lang="css" scoped></style>
