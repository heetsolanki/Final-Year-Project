import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-10">
      
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
        focus:ring-2 focus:ring-[#0A1F44] focus:border-[#0A1F44] 
        outline-none transition"
      />
      
    </div>
  );
};

export default SearchBar;