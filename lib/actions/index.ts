'use server'
// this file holds the server actions
import { scrapeAmazonProduct } from "../scraper";

// scrape product page
export async function scrapeAndStoreProduct(productUrl: string) {
  // check error
  if (!productUrl) return;
    // scrape product
  try {
    connectToDB();
      const scrapedProduct = await scrapeAmazonProduct(productUrl);
      if (!scrapedProduct) return;
      

    } catch (error: any ) {
      throw new Error(`Failed to create/update product: ${error.message}`)
    }  
}