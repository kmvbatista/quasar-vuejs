<template>
	<v-app>
		<v-form ref="form" v-model="valid" lazy-validation>
			<div class="container">
				<v-row>
					<v-col class="d-flex" cols="12" sm="6">
						<v-select
							v-model="vehicleType"
							:items="items"
							label="Selecione o tipo de veículo"
							:rules="vehicleTypeRules"
						></v-select>
					</v-col>
				</v-row>
			</div>
			<div>
				<TextEditor :text.sync="formatedText" ref="textEditor" />
			</div>
			<div class="container">
				<v-row>
					<v-col cols="12" class="box-buttons">
						<v-btn large color="secondary" @click="cleanFields">Limpar Campos</v-btn>
						<v-btn :disabled="!valid" large color="primary" @click="postUseTerm"
							>Gravar</v-btn
						>
					</v-col>
				</v-row>
				<v-card class="container">
					<v-card-title>
						Termos de uso
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
						:search="search"
						item-key="id"
						:items="useTerms"
						hide-default-footer
						:expanded.sync="expanded"
						show-expand
						class="elevation-1"
						:single-expand="true"
					>
						<template v-slot:item.formatedText="{ item }">
							<span v-html="item.formatedText.slice(0, 15) + '...'"></span>
						</template>
						<template v-slot:expanded-item="{ item }">
							<td :colspan="headers.length">
								<span v-html="item.formatedText"></span>
							</td>
						</template>
						<template v-slot:top>
							<v-dialog v-model="dialog" max-width="500px">
								<template v-slot:activator="{ on }"></template>
								<v-card> </v-card>
							</v-dialog>
						</template>
					</v-data-table>
				</v-card>
			</div>
		</v-form>
		<Notification
			v-if="snackBar"
			@closeSnack="snackBar = false"
			:sucess="isSucess"
			:errorMessage="errorMsg"
			:succesMessage="successMsg"
		/>
	</v-app>
</template>

<script>
import Api from '../services/api';
import Notification from '../components/Notification';
import TextEditor from '@/components/TextEditor.vue';

export default {
	components: { TextEditor, Notification },
	data: () => ({
		expanded: [],
		dialog: false,
		valid: false,
		snackBar: false,
		isSucess: false,
		errorMsg: '',
		successMsg: '',
		items: [],
		formatedText: '',
		useTerms: Api.get('useTerm/Active').data,
		vehicleType: '',
		vehicleTypeRules: [v => !!v || 'Tipo de veículo é obrigatório!'],
		selected: [],
		headers: [
			{
				text: 'Tipo veículo',
				value: 'vehicleType'
			},
			{ text: 'Texto formatado', value: 'formatedText' }
		],
		editedIndex: -1,
		editedItem: {
			id: '',
			formatedText: '',
			vehicleType: ''
		},
		search: ''
	}),
	methods: {
		async getVehicleTypes() {
			const response = await Api.get('enums/vehicle-types');
			this.items = response.data;
		},
		async postUseTerm() {
			if (this.$refs.form.validate() || this.formatedText != '') {
				const useTerm = {
					formatedText: this.formatedText,
					vehicleType: this.items.indexOf(this.vehicleType)
				};
				try {
					await Api.post('useterm', useTerm);
					this.snackBar = true;
					this.isSucess = true;
					this.successMsg = 'Sucesso';
					this.reset();
					this.cleanFields();
					this.getUseTerm();
				} catch (error) {
					this.snackBar = true;
					this.isSucess = false;
					this.errorMsg = 'Erro ao cadastrar termo de usuário';
					setTimeout(() => {
						this.snackBar = false;
					}, 3000);
				}
			} else {
				this.snackBar = true;
				this.isSucess = false;
				this.errorMsg = 'Termo de uso é obrigatório';
			}
		},
		close() {
			this.dialog = false;
			setTimeout(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			}, 300);
		},
		async getUseTerm() {
			const response = await Api.get('useTerm/Active');
			this.useTerms = response.data;
			setTimeout(() => {
				this.snackBar = false;
			}, 3000);
		},
		reset() {
			this.$refs.form.reset();
			this.$refs.form.resetValidation();
		},
		resetValidation() {
			this.$refs.form.resetValidation();
		},
		cleanFields() {
			this.vehicleType = '';
			this.$refs.textEditor.cleanContent();
		},
		desativeUpdate() {
			this.isUpdating = false;
			this.cleanFields();
		}
	},
	async created() {
		this.$emit('headerNameChanged', 'Cadastro de Termos de veículos');
		this.getVehicleTypes();
		await this.getUseTerm();
	},
	computed: {},
	watch: {
		dialog(val) {
			val || this.close();
		}
	}
};
</script>

<style lang="css" scoped>
.box-buttons {
	display: flex;
	justify-content: space-between;
}
</style>
