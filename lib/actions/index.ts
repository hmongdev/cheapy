'use server'

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
// this file holds the server actions
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getLowestPrice } from "../utils";

// scrapes + saves to DB
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
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    // if exists, update the price!
    if (existingProduct) {
      const updatedPriceHistory: any = [
        // spread existing product
        ...existingProduct.priceHistory,
        // update the price for the scrapedProduct
        { price: scrapedProduct.currentPrice }
      ]
      // modify the product object
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory)
        
      }
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
    } catch (error: any ) {
      throw new Error(`Failed to create/update product: ${error.message}`)
    }
}