export default {
	replaceS3Url: (url) => {
		return String(url).replace("us-west-2", "ap-southeast-1");
	},

	addProduct: async () => {
		try {
			const file_path = fpk_addProductDrawingImage.files.length > 0 ? Date.now() + '_' + fpk_addProductDrawingImage.files[0].name : '' 
			const s3PutResponse = await s3_putDrawingImage.run({
				file_path : file_path
			});

			await db_addProduct.run({
				image_url: utils.replaceS3Url(s3PutResponse.url),
				file_path: file_path
			});

			await this.getProducts();
			closeModal('mdl_addProduct');
			showAlert('Product Created!', 'success');
		} catch (error) {
			console.log('ERROR_CREATING_PRODUCT', error);
			showAlert('Error creating product!', 'error');
		}
	},

	updateProduct: async () => {
		try {
			const file_path = fpk_updateProductDrawingImage.files.length > 0 ? Date.now() + '_' + fpk_updateProductDrawingImage.files[0].name : tbl_products.selectedRow.drawing_filepath ;
			
			let image_url= tbl_products.selectedRow.drawing_url ;
			
			if(tbl_products.selectedRow.drawing_filepath.length > 0 && fpk_updateProductDrawingImage.files.length > 0) {
				await s3_deleteDrawingImage.run({
					file_path: tbl_products.selectedRow.drawing_filepath
				});

				const s3PutResponse = await s3_putDrawingImageUpdate.run({
					file_path: file_path
				});
				
				image_url = utils.replaceS3Url(s3PutResponse.url);
			}

			await db_updateProduct.run({
				image_url: image_url,
				file_path: file_path
			});
			
			closeModal('mdl_productDetail');
			await this.getProducts();
			showAlert('Product Updated!', 'success');
		} catch (error) {
			console.log(error);
			showAlert('Error updating product!', 'error');
		}
	},
	getProducts: async () => {
		return await db_getProduct.run();
	},
}