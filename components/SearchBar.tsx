'use client'
import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// function that checks Amazon URL => boolean
const isValidAmazonProductURL = (url: string) => {
  try {
    // separate hostname from url
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    
    // check if hostname is actually from Amazon
    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}


const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // check if URL is valid
    const isValidLink = isValidAmazonProductURL(searchPrompt);
    
    // if not valid
    if (!isValidLink) {
      toast.error('Sorry, that is not a valid link!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        // pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
    
    // if valid
    try {
      setIsLoading(true);
      // scrape product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <ToastContainer />
      <input
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        type="text"
        placeholder="Enter Product Link"
        className="searchbar-input" />
      
      <button
        type="submit"
        className="searchbar-btn cursor-pointer"
        disabled={searchPrompt === ''}
      >
        { isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar