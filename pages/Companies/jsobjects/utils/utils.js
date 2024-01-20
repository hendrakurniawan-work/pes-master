export default {

	idConverter: (num) => {
		let str = num.toString();
		let leadingZeros = "00000".substring(0, 5 - str.length);
		return 'C' + leadingZeros + str;
	},

	getCompanies: async () => {
		const companies = await db_getCompany.run();

		return companies.map(co => {
			return {
				ID: co._id,
				CompanyName: co.company_name,
				CompanyAddress: co.company_address,
				Country: co.country,
				PostalCode: co.postal_code,
				CreatedAt: Date(co.created_at),
				UpdatedAt: Date(co.updated_at)
			}
		})
	},

	addCompany: async () => {
		await db_createCompany.run()

		closeModal('mdl_addCompany');

		await this.getCompanies();

		showAlert('Company created!', 'success');
	},

	updateCompany: async () => {
		await db_updateCompany.run()

		closeModal('mdl_companyDetails');

		await this.getCompanies();

		showAlert('Company updated!', 'success');

	},

	statusColor: (status) => {
		if (status === 'CANCELLED') {
			return 'RGB(255, 0, 0)'
		};
		if (status === 'UNFULFILLED' || status === 'PACKED') {
			return 'RGB(255, 165, 0)';
		};
		if (status === 'SHIPPED' || status === 'DELIVERED') {
			return 'RGB(0, 128, 0)'
		}
		return 'RGB(255, 165, 0)'
	},
}