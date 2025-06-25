import React, { useState, useEffect } from 'react';
import { Upload, Trash2, List, Shuffle, Calendar, Home, Building, MapPin, Plus, Search } from 'lucide-react';

const RandomContentGenerator = () => {
  const [content, setContent] = useState([]);
  const [newText, setNewText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('house');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [randomQuantity, setRandomQuantity] = useState(1);
  const [randomResults, setRandomResults] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Flat/Apartment', icon: Building },
    { value: 'land', label: 'Land', icon: MapPin }
  ];

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = JSON.parse(localStorage.getItem('contentData') || '[]');
    setContent(savedContent);
  }, []);

  // Save content to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('contentData', JSON.stringify(content));
  }, [content]);

  const uploadText = () => {
    if (!newText.trim()) return;
    
    const newItem = {
      id: Date.now(),
      text: newText.trim(),
      category: selectedCategory,
      createdAt: new Date().toISOString(),
      displayDate: new Date().toLocaleString()
    };
    
    setContent(prev => [...prev, newItem]);
    setNewText('');
  };

  const deleteText = (id) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  const getFilteredContent = () => {
    let filtered = content;
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'alphabetical') {
        return sortOrder === 'asc' 
          ? a.text.localeCompare(b.text)
          : b.text.localeCompare(a.text);
      }
      return 0;
    });
  };

  const generateRandom = () => {
    const filtered = getFilteredContent();
    if (filtered.length === 0) {
      setRandomResults([]);
      return;
    }
    
    const quantity = Math.min(randomQuantity, filtered.length);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setRandomResults(shuffled.slice(0, quantity));
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    const IconComponent = categoryData?.icon || Home;
    return <IconComponent size={16} />;
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'house': return 'bg-blue-100 text-blue-800';
      case 'apartment': return 'bg-green-100 text-green-800';
      case 'land': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Random Content API Generator</h1>
        <p className="text-gray-600">Upload, organize, and randomly generate your content by category</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload size={20} />
            Upload New Content
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Text
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter your content here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedCategory === category.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={uploadText}
              disabled={!newText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Upload Content
            </button>
          </div>
        </div>

        {/* Random Generator Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shuffle size={20} />
            Random Generator
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity to Generate
              </label>
              <input
                type="number"
                min="1"
                max={filteredContent.length || 1}
                value={randomQuantity}
                onChange={(e) => setRandomQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {filteredContent.length} items
              </p>
            </div>
            
            <button
              onClick={generateRandom}
              disabled={filteredContent.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Shuffle size={16} />
              Generate Random
            </button>
          </div>

          {randomResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Random Results ({randomResults.length}):</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {randomResults.map(item => (
                  <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-gray-800 mb-2">{item.text}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(item.category)}`}>
                            {getCategoryIcon(item.category)}
                            {categories.find(cat => cat.value === item.category)?.label}
                          </span>
                          <span className="text-xs text-gray-500">{item.displayDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <List size={20} />
            Content Library ({filteredContent.length})
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort);
                setSortOrder(order);
              }}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="alphabetical-asc">A-Z</option>
              <option value="alphabetical-desc">Z-A</option>
            </select>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <List size={48} className="mx-auto mb-4 opacity-50" />
            <p>No content found. Upload some content to get started!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredContent.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{item.text}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)}
                        {categories.find(cat => cat.value === item.category)?.label}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {item.displayDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteText(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete content"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomContentGenerator;