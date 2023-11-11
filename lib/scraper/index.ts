// contains logic for scraping
import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

//! scrape ONE amazon product
export async function scrapeAmazonProduct(url: string) {
  // url check
  if (!url) return;

  // BrightData proxy config
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }
  
  try {
		// fetch product page
		const response = await axios.get(url, options);
		// cheerio CHUNKS the data
		const $ = cheerio.load(response.data);

		// extract INFO you want
		const title = $('#productTitle').text().trim();

		const originalPrice = extractPrice(
			$('.a-offscreen'),
			$('.a-price a-text-price'),
			$('#priceblock_ourprice'),
			$('.a-price.a-text-price span.a-offscreen'),
			$('#listPrice'),
			$('#priceblock_dealprice'),
			$('.a-size-base.a-color-price')
		);

		const currentPrice = extractPrice(
			$('.a-price-whole'),
			$('.a-price-fraction')
		);

		const outOfStock =
			$('#availability span').text().trim().toLowerCase() ===
			'currently unavailable';

		const images =
			$('#imgBlkFront').attr('data-a-dynamic-image') ||
			$('#landingImage').attr('data-a-dynamic-image') ||
			'{}';

		// turns data into images
		const imageUrls = Object.keys(JSON.parse(images));

		const currency = extractCurrency($('.a-price-symbol'));

		const discountRate = $('.savingsPercentage')
			.text()
			.replace(/[-%]/g, '');

		const description = extractDescription($);

		// Construct data object with scraped information
		const data = {
			url,
			currency: currency || '$',
			image: imageUrls[0],
			title,
			currentPrice:
				Number(currentPrice) || Number(originalPrice),
			originalPrice:
				Number(originalPrice) || Number(currentPrice),
			priceHistory: [],
			discountRate: Number(discountRate),
			category: 'category',
			reviewsCount: 100,
			stars: 4.5,
			isOutOfStock: outOfStock,
			description,
			lowestPrice:
				Number(currentPrice) || Number(originalPrice),
			highestPrice:
				Number(originalPrice) || Number(currentPrice),
			averagePrice:
				Number(currentPrice) || Number(originalPrice),
		};

		console.log(data);
		return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}