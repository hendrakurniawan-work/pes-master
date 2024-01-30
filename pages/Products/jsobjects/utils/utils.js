export default {
	addProduct: async () => {
		try {
			const s3PutResponse = await s3_putDrawingImage.run()

			await db_addProduct.run({
				image_url: s3PutResponse.url
			});
			await this.getProducts();
			closeModal('mdl_addProduct');
			showAlert('Product Created!', 'success');
		} catch (error) {
			console.log('ERROR_CREATING_PRODUCT', error);
			showAlert('Error creating product!', 'error');
		}
	},
	updateProduct: async (updateType) => {
		// updateType allows this function to handle product updates from table rows and forms
		let updateProductParams;
		let updateVariantParams;
		try {
			if (updateType === 'TABLE') {
				updateProductParams = {
					productId: tbl_products.updatedRow.Id,
					name: tbl_products.updatedRow.Name,
					description: tbl_products.updatedRow.Description,
					type: tbl_products.updatedRow.Category,
					image: tbl_products.updatedRow.Image,
				};
				updateVariantParams = {
					variantId: tbl_products.updatedRow.VariationId,
					costPrice: tbl_products.updatedRow.CostPrice,
					salePrice: tbl_products.updatedRow.SalePrice,
					lowStock: tbl_products.updatedRow.LowStock || 0,
					sku: tbl_products.updatedRow.Sku || null,
				};

			} else {
				updateProductParams = {
					productId: tbl_products.triggeredRow.Id,
					name: inp_productDetailName.text,
					description: inp_productDetailDescription.text,
					image: inp_productDetailDrawingNumber.text,
				};
				updateVariantParams = {
					variantId: tbl_products.triggeredRow.VariationId,
					salePrice: inp_productDetailMaterial.text,
					sku: inp_productDetailTreatment.text || null,
				};
			}
			await updateProduct.run(updateProductParams);
			await updateProductVariant.run(updateVariantParams);
			// When updating product, update product stock in warehouses if required
			let tbl_productDetailStock;
			tbl_productDetailStock.updatedRows.map(async s => {
				// Check to see if the product exists in a particular warehouse
				console.log({
					variantId: updateVariantParams.variantId,
					locationId: s.allFields.Id
				})
				let productLocationExists;
				// If product exists, update the stock, if it doesnt exists, create a new entry
				if (productLocationExists && productLocationExists.length > 0) {
					await updateProductLocation.run({
						stock: s.allFields.Stock,
						id: s.allFields.Id,
					})
				} else {
					console.log('DATA:', {
						variantId: updateVariantParams.variantId,
						locationId: s.allFields.Id,
						stock: s.allFields.Stock,
					})
					await addProductLocation.run({
						variantId: updateVariantParams.variantId,
						locationId: s.allFields.Id,
						stock: s.allFields.Stock,
					})
				}

			})

			await this.getProducts();
			showAlert('Product Updated!', 'success');
		} catch (error) {
			console.log(error);
			showAlert('Error updating product!', 'error');
		}
	},
	updateProductDetailDrawingImagePreview : async () => {
		return await img_productDetail.setImage(fp_productDetailDrawingImage.files[0].data);
	},

	getProducts: async () => {
		return await db_getProduct.run();
	},

	getProductDrawingImage: () => {
		return s3_getDrawingImage.run();
	},
}