<template>
	<div class="screen">
		<v-form v-model="valid" ref="form" class="formPadding">
			<v-container>
				<v-row>
					<v-col cols="12" md="5">
						<Calendar
							v-model="rentalperiod.startTime"
							:label="'Data Inicial da locação'"
							:rule="true"
						></Calendar>
					</v-col>
					<v-col cols="12" md="5">
						<Calendar
							v-model="rentalperiod.endTime"
							:label="'Data Final da locação'"
							:rule="dateRule"
						></Calendar>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" md="5">
						<v-select
							:label="'Selecione o tipo de veículo'"
							:items="vehicleTypes"
							v-model="rentalperiod.vehicleType"
							:rules="[vehicleTypeRule]"
						></v-select>
					</v-col>
					<v-col cols="12" md="5">
						<v-text-field
							type="number"
							:label="'Informe a quantidade de vagas'"
							v-model="rentalperiod.parkingSpot"
							:rules="[parkingSpotRule]"
						></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<div class="col-md-5 col-sm-3">
						<v-btn color="secondary" @click="reset">Limpar campos</v-btn>
					</div>
					<div class="col-md-5 col-sm-3">
						<v-btn :disabled="!valid" color="primary" @click="post">Gravar</v-btn>
					</div>
				</v-row>
			</v-container>
		</v-form>
		<v-card class="container">
			<v-card-title>
				Períodos de locação
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
				:items="allRentalPeriods"
				:search="search"
				item-key="id"
			>
				<template v-slot:item.action="{ item }">
					<v-icon small color="error" @click="deleteRentalPeriod(item)">
						delete
					</v-icon>
				</template>
			</v-data-table>
		</v-card>
		<Notification
			v-if="snackBar"
			@closeSnack="snackBar = false"
			:sucess="isSucess"
			:errorMessage="errorMsg"
			:succesMessage="'Sucesso'"
		/>
	</div>
</template>

<script>
import Api from '../services/api';
import Calendar from '../components/Calendar';
import Notification from '../components/Notification';

export default {
	components: { Calendar, Notification },
	data: () => ({
		rentalperiodDefault: {
			vehicleType: '',
			startTime: '',
			endTime: '',
			parkingSpot: ''
		},
		rentalperiod: {
			vehicleType: '',
			startTime: '',
			endTime: '',
			parkingSpot: ''
		},
		allRentalPeriods: [],
		valid: false,
		vehicleTypes: [],
		headers: [
			{
				text: 'Data inicial',
				value: 'startTime'
			},
			{ text: 'Data final', value: 'endTime' },
			{ text: 'Tipo de veículo', value: 'vehicleType' },
			{ text: 'Quantidade de Vagas', value: 'parkingSpot' },
			{
				text: 'Deletar',
				value: 'action',
				sortable: false
			}
		],
		search: '',
		snackBar: false,
		isSucess: false,
		defaultErrorMsg: 'Erro na solicitação',
		errorMsg: '',
		successMsg: 'Operação efetuada com sucesso',
		selected: [],
		dialog: false,
		editedIndex: -1
	}),
	methods: {
		async getRentalPeriods() {
			try {
				const response = await Api.get('rentalperiod/Active');
				this.allRentalPeriods = response.data;
				setTimeout(() => {
					this.snackBar = false;
				}, 3000);
			} catch (error) {
				this.isSucess = false;
			}
		},
		async getVehicleTypes() {
			try {
				const response = await Api.get('enums/vehicle-types-rental-period');
				this.vehicleTypes = response.data;
				setTimeout(() => {
					this.snackBar = false;
				}, 3000);
			} catch (error) {
				this.isSucess = false;
				this.errorMsg = this.defaultErrorMsg;
			}
		},
		async post() {
			try {
				this.rentalperiod.vehicleType = this.vehicleTypes.indexOf(
					this.rentalperiod.vehicleType
				);
				const isRepeated = this.isRepeatedRentalPeriod();
				if (isRepeated) {
					this.errorMsg = 'Período de locação já existente';
					this.isSucess = false;
					this.snackBar = true;
					return;
				}
				await Api.post('rentalperiod', this.rentalperiod);
				this.isSucess = true;
				this.reset();
				this.getRentalPeriods();
			} catch (error) {
				this.isSucess = false;
				this.errorMsg = this.defaultErrorMsg;
			}
			this.snackBar = true;
		},
		reset() {
			this.$refs.form.reset();
			Object.assign(this.rentalperiod, this.rentalperiodDefault);
		},
		async deleteRentalPeriod(rentalperiod) {
			try {
				this.$swal
					.fire({
						icon: 'question',
						title: 'Você gostaria mesmo de deletar este período?',
						showCancelButton: true
					})
					.then(async result => {
						if (result.value) {
							await Api.delete(`rentalperiod/${rentalperiod.id}`);
							this.snackBar = true;
							this.isSucess = true;
							this.successMsg = 'Sucesso';
							this.getRentalPeriods();
						} else {
							this.snackbar = true;
							this.isSucess = false;
							this.successMsg = 'Período não deletado';
						}
					});
			} catch {
				this.snackbar = true;
				this.isSucess = false;
				this.successMsg = 'Período não deletado';
			}
		},
		close() {
			this.dialog = false;
			this.editedRentalPeriod = {};
		},
		getAmericanDate(date) {
			const [day, month, year] = date.split('/');
			return `${year}-${month}-${day}`;
		},
		getBrazilianDate(date) {
			const [year, month, day] = date.split('-');
			return `${day}/${month}/${year}`;
		},
		isRepeatedRentalPeriod() {
			let rentalToCompare = Object.assign({}, this.rentalperiod);
			rentalToCompare.vehicleType = this.vehicleTypes[rentalToCompare.vehicleType];
			rentalToCompare.endTime = this.getBrazilianDate(rentalToCompare.endTime);
			rentalToCompare.startTime = this.getBrazilianDate(rentalToCompare.startTime);
			const foundRental = this.allRentalPeriods.find(
				rental =>
					rental.endTime == rentalToCompare.endTime &&
					rental.startTime == rentalToCompare.startTime &&
					rental.vehicleType == rentalToCompare.vehicleType
			);
			return foundRental;
		}
	},
	async created() {
		this.$emit('headerNameChanged', 'Cadastro de Periodo de locação');
		await this.getRentalPeriods();
		await this.getVehicleTypes();
	},
	computed: {
		dateRule() {
			const final = new Date(this.rentalperiod.endTime);
			const initial = new Date(this.rentalperiod.startTime);
			return final > initial || 'A data final deve ser maior que a inicial';
		},
		vehicleTypeRule() {
			return this.rentalperiod.vehicleType !== '' || 'Escolha um tipo de veículo';
		},
		parkingSpotRule() {
			return (
				this.rentalperiod.parkingSpot > 0 ||
				'A quantidade de vagas deve ser maior que zero'
			);
		},
		formTitle() {
			return this.editedIndex === -1 ? 'Novo Período' : 'Editar Período';
		}
	}
};
</script>

<style lang="css"></style>
