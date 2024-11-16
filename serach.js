
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const SearchInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'relevance',
    itemsPerPage: 10
  });
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulated data for demo purposes
  const sampleData = [
    { id: 1, title: 'JavaScript Basics', category: 'programming', content: 'Learn the basics of JavaScript programming' },
    { id: 2, title: 'React Fundamentals', category: 'programming', content: 'Understanding React core concepts' },
    { id: 3, title: 'Database Design', category: 'database', content: 'Introduction to database design principles' }
  ];

  // Simulate API call with delay
  const fetchSearchResults = async (term, filters) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter and sort results based on search term and filters
    const filtered = sampleData.filter(item => {
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      return item.title.toLowerCase().includes(term.toLowerCase()) ||
             item.content.toLowerCase().includes(term.toLowerCase());
    });

    setResults(filtered);
    setLoading(false);
  };

  // Debounced search to prevent too many API calls
  const debouncedSearch = debounce((term, filters) => {
    fetchSearchResults(term, filters);
  }, 300);

  // Update search results when search term or filters change
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm, filters);
    } else {
      setResults([]);
    }
  }, [searchTerm, filters]);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.length > 2) {
      const matchingSuggestions = sampleData
        .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(item => item.title)
        .slice(0, 5);
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database..."
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Search suggestions */}
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

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="programming">Programming</option>
              <option value="database">Database</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="p-2 border rounded-lg"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-4">
              Loading...
            </div>
          )}

          {/* Search results */}
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{result.title}</h3>
                <p className="text-sm text-gray-600">{result.category}</p>
                <p className="mt-2">{result.content}</p>
              </div>
            ))}
            {!loading && results.length === 0 && searchTerm && (
              <div className="text-center py-4 text-gray-500">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInterface;