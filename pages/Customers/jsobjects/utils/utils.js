export default {

	idConverter: (num) => {
		let str = num.toString();
		let leadingZeros = "00000".substring(0, 5 - str.length);
		return 'C' + leadingZeros + str;
	},

	getCustomers: async () => {
		const customers = await db_getCustomers.run()

		return customers
	},

	addCustomer: async () => {
		await db_createCustomer.run()

		closeModal('mdl_addCustomer');

		await this.getCustomers();

		showAlert('Customer created!', 'success');
	},

	updateCustomer: async () => {
		await db_updateCustomer.run()

		closeModal('mdl_updateCustomer');

		await this.getCustomers();

		showAlert('Customer updated!', 'success');
	}
}