import React from 'react';
import { useFunctions } from '../useFunctions';
import { Search } from 'lucide-react';

function SearchBox() {
  const { searchTerm, handleInputChange, handleSearch } = useFunctions();

  return (
    <form className="searchBox" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
      <div className="searchContainer">
        <button type="button" className="iconButton" onClick={handleSearch}>
          <Search />
        </button>
        <span className="separator">|</span>
        <input
          className="searchInput"
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />        
      </div>
    </form>
  );
}

export default SearchBox;
