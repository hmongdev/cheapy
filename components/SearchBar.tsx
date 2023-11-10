'use client'

const SearchBar = () => {
  const handleSubmit = () => {
    console.log(`object`);
  }
  
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter Product Link" className="searchbar-input" />
      
      <button type="submit" className="searchbar-btn">Search</button>
    </form>
  )
}

export default SearchBar