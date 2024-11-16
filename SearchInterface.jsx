import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';

const SearchInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'relevance',
    itemsPerPage: 10,
  });
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleData = [
    { id: 1, title: 'JavaScript Basics', category: 'programming', content: 'Learn the basics of JavaScript programming' },
    { id: 2, title: 'React Fundamentals', category: 'programming', content: 'Understanding React core concepts' },
    { id: 3, title: 'Database Design', category: 'database', content: 'Introduction to database design principles' },
  ];

  const fetchSearchResults = async (term, filters) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const filtered = sampleData.filter((item) => {
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      return item.title.toLowerCase().includes(term.toLowerCase()) || item.content.toLowerCase().includes(term.toLowerCase());
    });
    setResults(filtered);
    setLoading(false);
  };

  const debouncedSearch = debounce((term, filters) => {
    fetchSearchResults(term, filters);
  }, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm, filters);
    } else {
      setResults([]);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const matchingSuggestions = sampleData
        .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => item.title)
        .slice(0, 5);
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Database Search</h1>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search database..."
            className="w-full p-2 pr-10 border rounded-lg"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSearchTerm(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Categories</option>
            <option value="programming">Programming</option>
            <option value="database">Database</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
        {loading && <div className="text-center py-4">Loading...</div>}
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="text-sm text-gray-600">{result.category}</p>
              <p className="mt-2">{result.content}</p>
            </div>
          ))}
          {!loading && results.length === 0 && searchTerm && (
            <div className="text-center py-4 text-gray-500">No results found for "{searchTerm}"</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
