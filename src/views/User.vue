<template>
	<div class="screen">
		<v-form v-model="valid" ref="form" lazy-validation class="v-form">
			<v-container>
				<v-row>
					<v-col cols="12" md="5">
						<v-text-field
							v-model="user.name"
							:rules="nameRules"
							label="Nome"
							required
						></v-text-field>
					</v-col>
					<v-col cols="12" md="5">
						<v-text-field
							v-model="user.email"
							:rules="emailRules"
							label="E-mail"
							required
						></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="5">
						<v-text-field
							v-model="user.password"
							:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
							:rules="[rules.required, rules.min, rules.max]"
							:type="show1 ? 'text' : 'password'"
							name="input-10-1"
							label="Senha"
							hint="Pelo menos 8 caracteres"
							counter
							@click:append="show1 = !show1"
						></v-text-field>
					</v-col>
					<v-col cols="12" md="5">
						<v-text-field
							v-model="confirmPassword"
							:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
							:rules="[passwordConfirmationRule]"
							:type="show1 ? 'text' : 'password'"
							name="input-10-1"
							label="Confime sua senha"
							counter
							@click:append="show1 = !show1"
						></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="5">
						<v-text-field
							v-model="user.registration"
							label="Matrícula"
							:rules="registrationRules"
							required
						></v-text-field>
					</v-col>
					<v-col cols="12" md="5">
						<Calendar
							v-model="user.birthDate"
							:label="'Data de nascimento'"
							:rule="dateRulePost"
						></Calendar>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="d-flex" cols="12" sm="5">
						<v-select
							v-model="user.userProfile"
							:items="userProfiles"
							label="Selecione o tipo de perfil do usuário"
							:rules="userProfileRules"
						></v-select>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="5">
						<v-checkbox
							v-model="user.livesOutTown"
							label="Resido fora de Blumenau"
							required
						></v-checkbox>
					</v-col>
					<v-col cols="12" md="5">
						<v-checkbox
							v-model="user.carPool"
							label="Ofereço carona diária para outros colaboradores HBSIS"
							required
						></v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="5">
						<v-checkbox v-model="user.pcd" label="PCD" required> </v-checkbox>
					</v-col>
					<v-col cols="12" md="5">
						<v-checkbox
							v-model="user.nightShift"
							label="Trabalho Noturno"
							required
						></v-checkbox>
					</v-col>
				</v-row>
				<v-row>
					<div class="col-md-5 col-sm-3">
						<v-btn color="warning" @click="reset">Limpar campos</v-btn>
					</div>
					<div class="col-md-5 col-sm-3">
						<v-btn :disabled="!valid" color="primary" @click="postUser">Gravar</v-btn>
					</div>
				</v-row>
			</v-container>
		</v-form>
		<v-card class="container">
			<v-card-title>
				Usuários
				<v-spacer></v-spacer>
				<v-text-field
					v-model="search"
					label="Procurar"
					single-line
					hide-details
				></v-text-field>
			</v-card-title>
			<v-data-table
				v-model="selected"
				:headers="headers"
				:items="users"
				:search="search"
				item-key="id"
			>
				<template v-slot:top>
					<v-dialog v-model="dialog" max-width="850px">
						<template v-slot:activator="{ on }"></template>
						<v-form v-model="validUpdate" ref="form" lazy-validation class="v-form">
							<v-card>
								<v-card-title>
									<span class="headline">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-row>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editingUser.name"
													label="Nome"
													:rules="nameRules"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-text-field
													v-model="editingUser.email"
													label="Email"
													:rules="emailRules"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<Calendar
													v-model="editingUser.birthDate"
													:rule="dateRuleEdit"
													:label="'Data de nascimento'"
												></Calendar>
											</v-col>
											<v-col class="d-flex" cols="12" sm="6" md="6">
												<v-select
													v-model="editingUser.userProfile"
													:items="userProfiles"
													label="Selecione o tipo de perfil do usuário"
													:rules="userProfileRules"
												></v-select>
											</v-col>
											<v-col cols="12" sm="6" md="4">
												<v-checkbox
													v-model="editingUser.livesOutTown"
													label="Resido fora de Blumenau"
													required
													class="col-md-5"
												></v-checkbox>
											</v-col>
											<v-col cols="12" sm="6" md="8">
												<v-checkbox
													v-model="editingUser.carPool"
													label="Ofereço carona diária para outros colaboradores HBSIS"
													required
													class="col-md-5"
												></v-checkbox>
											</v-col>
											<v-col cols="12" sm="3" md="3">
												<v-checkbox
													class="col-md-5"
													v-model="editingUser.pcd"
													label="PCD"
													required
												></v-checkbox>
											</v-col>
											<v-col cols="12" sm="9" md="9">
												<v-checkbox
													v-model="editingUser.nightShift"
													label="Trabalho Noturno"
													required
													class="col-md-5"
												></v-checkbox>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
									<v-btn
										:disabled="!validUpdate"
										color="blue darken-1"
										text
										@click="updateUser"
										>Salvar</v-btn
									>
								</v-card-actions>
							</v-card>
						</v-form>
					</v-dialog>
				</template>
				<template v-slot:item.action="{ item }">
					<v-icon small @click="editUser(item)">edit</v-icon>
					<v-icon color="error" small @click="deleteUser(item)">delete</v-icon>
				</template>
			</v-data-table>
		</v-card>
		<Notification
			v-if="snackBar"
			@closeSnack="snackBar = false"
			:sucess="isSucess"
			:succesMessage="'Sucesso'"
			:errorMessage="errorMsg"
		/>
	</div>
</template>

<script>
import Api from '../services/api';
import Notification from '../components/Notification';
import Calendar from '../components/Calendar';

export default {
	components: {
		Notification,
		Calendar
	},
	data: () => ({
		dialog: false,
		valid: false,
		validUpdate: false,
		user: {
			name: '',
			registration: '',
			birthDate: '',
			password: '',
			email: '',
			livesOutTown: false,
			carPool: false,
			pcd: false,
			nightShift: false,
			userProfile: ''
		},
		userProfileRules: [v => !!v || 'Tipo de perfil de usuário é obrigatório!'],
		registrationRules: [v => !!v || 'Matrícula é obrigatório'],
		nameRules: [v => !!v || 'Nome é obrigatório'],
		confirmPassword: '',
		rules: {
			required: value => !!value || 'Obrigatório',
			max: v => (v && v.length < 20) || 'Max 20 caracteres',
			min: v => (v && v.length >= 8) || 'Min 8 caracteres',
			matchPassword: v => v == this.user.password || 'As senhas estão disparatadas'
		},
		emailRules: [
			v => !!v || 'E-mail é obrigatório',
			v => /.+@.+/.test(v) || 'E-mail inválido'
		],
		show1: false,
		show2: true,
		search: '',
		singleSelect: true,
		selected: [],
		headers: [
			{
				text: 'Nome',
				value: 'name'
			},
			{ text: 'E-mail', value: 'email' },
			{
				text: 'Resido fora de Blumenau',
				value: 'livesOutTown'
			},
			{
				text: 'Ofereço carona diária para outros colaboradores HBSIS',
				value: 'carPool'
			},
			{
				text: 'PCD',
				value: 'pcd'
			},
			{
				text: 'Trabalha Noturno',
				value: 'nightShift'
			},
			{
				text: 'Matrículas',
				value: 'registration'
			},
			{
				text: 'Tipo de Usuário',
				value: 'userProfile'
			},
			{
				text: 'Ações',
				value: 'action',
				sortable: false
			}
		],
		users: [],
		userProfiles: [],
		snackBar: false,
		isSucess: false,
		errorMsg: '',
		editedIndex: -1,
		editingUser: {
			id: '',
			name: '',
			email: '',
			birthDate: '',
			livesOutTown: '',
			carPool: '',
			pcd: '',
			nightShift: '',
			userProfile: ''
		},
		defaultUser: {
			id: '',
			name: '',
			email: '',
			birthDate: '',
			livesOutTown: '',
			carPool: '',
			pcd: '',
			nightShift: '',
			userProfile: ''
		}
	}),
	methods: {
		async postUser() {
			if (this.$refs.form.validate()) {
				try {
					this.user.userProfile =
						this.user.userProfile === 'Administrador'
							? 'Admin'
							: this.user.userProfile === 'Gente'
							? 'HumanResources'
							: 'Collaborator';
					this.user.carPool = this.user.carPool === 'Sim';
					this.user.pcd = this.user.pcd === 'Sim';
					this.user.nightShift = this.user.nightShift === 'Sim';
					this.user.livesOutTown = this.user.livesOutTown === 'Sim';
					await Api.post('user', this.user);
					this.snackBar = true;
					this.isSucess = true;
					this.getUsers();
					this.reset();
				} catch (error) {
					this.isSucess = false;
					this.errorMsg = 'Erro ao cadastrar usuário';
				}
			}
		},
		reset() {
			this.$refs.form.reset();
			this.$refs.form.resetValidation();
			this.user = Object.assign({}, this.defaultUser);
		},
		resetValidation() {
			this.$refs.form.resetValidation();
		},
		async getUsers() {
			const response = await Api.get('user/Active');
			this.users = response.data;
			setTimeout(() => {
				this.snackBar = false;
			}, 3000);
		},
		async getUserProfiles() {
			const response = await Api.get('enums/user-profiles');
			this.userProfiles = response.data;
		},
		editUser(user) {
			this.editedIndex = this.users.indexOf(user);
			this.editingUser = Object.assign({}, user);
			this.editingUser.carPool = this.editingUser.carPool === 'Sim';
			this.editingUser.pcd = this.editingUser.pcd === 'Sim';
			this.editingUser.nightShift = this.editingUser.nightShift === 'Sim';
			this.editingUser.livesOutTown = this.editingUser.livesOutTown === 'Sim';
			this.dialog = true;
		},
		async deleteUser(user) {
			try {
				this.$swal
					.fire({
						icon: 'question',
						title: 'Gostaria mesmo de deletar usuário?',
						showCancelButton: true
					})
					.then(async result => {
						if (result.value) {
							await Api.delete(`user/${user.id}`);
							this.isSucess = true;
							this.snackBar = true;
							this.getUsers();
						} else {
							this.snackBar = true;
							this.isSucess = false;
							this.errorMsg = 'Usuário não deletado';
						}
					});
			} catch {
				this.snackBar = true;
				this.isSucess = false;
				this.errorMsg = 'Usuário não deletado';
			}
		},
		async updateUser() {
			try {
				this.editingUser.userProfile =
					this.editingUser.userProfile === 'Administrador'
						? 'Admin'
						: this.editingUser.userProfile === 'Gente'
						? 'HumanResources'
						: 'Collaborator';
				this.editingUser.birthDate = this.getAmericanDate(this.editingUser.birthDate);
				await Api.put(`user/${this.editingUser.id}`, this.editingUser);
				this.getUsers();
				this.isSucess = true;
				this.snackBar = true;
			} catch (e) {
				this.isSucess = false;
				this.errorMsg = 'Erro ao editar usuário';
			}
			this.close();
		},
		close() {
			this.dialog = false;
			setTimeout(() => {
				this.editingUser = Object.assign({}, this.defaultUser);
				this.editedIndex = -1;
			}, 300);
		},
		getAmericanDate(birthDate) {
			const [day, month, year] = birthDate.split('/');
			return `${year}-${month}-${day}`;
		},
		getRuleBirthDate(birthDate) {
			const currentDate = new Date();
			return (
				birthDate < currentDate || 'Data de nascimento deve ser menor que a data atual'
			);
		}
	},
	async created() {
		this.$emit('headerNameChanged', 'Cadastro de Usuário');
		await this.getUsers();
		await this.getUserProfiles();
	},
	computed: {
		passwordConfirmationRule() {
			return () =>
				this.user.password === this.confirmPassword || 'A senha deve corresponder';
		},
		formTitle() {
			return this.editedIndex === -1 ? 'Novo Usuário' : 'Editar Usuário';
		},
		dateRulePost() {
			const birthDate = new Date(this.user.birthDate);
			return this.getRuleBirthDate(birthDate);
		},
		dateRuleEdit() {
			const birthDate = new Date(this.getAmericanDate(this.editingUser.birthDate));
			return this.getRuleBirthDate(birthDate);
		}
	},
	watch: {
		dialog(val) {
			val || this.close();
		}
	}
};
</script>

<style lang="css" scoped></style>
