// this file holds the server actions
'use server';
import { revalidatePath } from 'next/cache';
import Product from '../models/product.model';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getAveragePrice, getLowestPrice } from '../utils';

//! POST => scrapes + saves to DB
export async function scrapeAndStoreProduct(productUrl: string) {
	// check that url exists
	if (!productUrl) return;
	// if exists then try
	try {
		// connect to db
		connectToDB();
		// scrape product
		const scrapedProduct = await scrapeAmazonProduct(productUrl);
		// check error
		if (!scrapedProduct) return;
		let product = scrapedProduct;
		// created the Product model in mongoose HERE
		// find existing product
		const existingProduct = await Product.findOne({
			url: scrapedProduct.url,
		});
		// if exists, update the price!
		if (existingProduct) {
			const updatedPriceHistory: any = [
				// spread existing product
				...existingProduct.priceHistory,
				// update the price for the scrapedProduct
				{ price: scrapedProduct.currentPrice },
			];
			// modify the product object
			product = {
				...scrapedProduct,
				priceHistory: updatedPriceHistory,
				lowestPrice:
					getLowestPrice(updatedPriceHistory),
				averagePrice:
					getAveragePrice(updatedPriceHistory),
			};
		}
		// create a new instance of this product
		const newProduct = await Product.findOneAndUpdate(
			// find the product with its url...
			{ url: scrapedProduct.url },
			// pass the new product object
			product,
			// if it doesn't exist, create a new one
			{ upsert: true, new: true }
		);

		// revalidatePath to automatically update the cache
		revalidatePath(`/products/${newProduct._id}`);
	} catch (error: any) {
		throw new Error(
			`Failed to create/update product: ${error.message}`
		);
	}
}

//! GET => product details by id
export async function getProductById(productId: string) {
	try {
		// must run every time
		connectToDB();

		const product = await Product.findOne({ _id: productId });

		if (!product) {
			return null;
		} else {
			return product;
		}
	} catch (error) {
		console.log(error);
	}
}

//! GET ALL products
export async function getAllProducts() {
	try {
		connectToDB();
		const allProducts = await Product.find();
		if (!allProducts) return null;

		return allProducts;
	} catch (error) {
		console.log(error);
	}
}

//! GET SIMILAR PRODUCT by id
export async function getSimilarProducts(productId: any) {
	try {
		connectToDB();
		const currentProduct = await Product.findById(productId);
		if (!currentProduct) return null;

		const similarProducts = await Product.find({
			_id: { $ne: productId },
		}).limit(3);

		return similarProducts;
	} catch (error) {
		console.log(error);
	}
}
