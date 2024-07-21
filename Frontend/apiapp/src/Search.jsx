import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Search.css'; // Import the CSS file
import Navbar from './Navbar';

const Search = () => {
  const [filter, setFilter] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/login');
      }
    };

    fetchAuthStatus();
  }, [navigate]);

  const generateUrls = (filter) => {
    let urls = [];
    const isWildcard = (pattern) => filter.includes(pattern);

    if (isWildcard('xx')) {
      const prefix = filter.replace(/xx/g, '');
      for (let i = 0; i <= 99; i++) {
        let code = i < 10 ? `0${i}` : i.toString();
        urls.push(`https://http.dog/${prefix}${code}.jpg`);
      }
    } else if (isWildcard('x')) {
      const prefix = filter.replace(/x/g, '');
      for (let i = 0; i <= 9; i++) {
        urls.push(`https://http.dog/${prefix}${i}.jpg`);
      }
    } else if (isWildcard('2xx')) {
      for (let i = 200; i <= 299; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else if (isWildcard('20x')) {
      for (let i = 200; i <= 209; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else if (isWildcard('3xx')) {
      for (let i = 300; i <= 399; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else if (isWildcard('21x')) {
      for (let i = 210; i <= 219; i++) {
        urls.push(`https://http.dog/${i}.jpg`);
      }
    } else {
      urls.push(`https://http.dog/${filter}.jpg`);
    }
    return urls;
  };

  const handleSearch = async () => {
    let urls = generateUrls(filter);
    let fetchedImages = [];
    for (let url of urls) {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          fetchedImages.push(response.config.url);
        } else {
          console.error(`Image not found at URL: ${url}`);
        }
      } catch (error) {
        console.error(`Error fetching image for URL: ${url}`, error);
      }
    }
    setImages(fetchedImages);
  };

  const handleSaveList = async () => {
    if (!filter.trim()) {
      console.error('Search key is required to save the list.');
      return;
    }
  
    let responseCodes = images.map(img => img.split('/').pop().replace('.jpg', ''));
    const createdAt = new Date().toISOString();
  
    try {
      const response = await axios.post('http://localhost:3001/api/lists', {
        name: filter,
        responseCodes,
        images,
        createdAt
      }, { withCredentials: true }); 
  
      console.log('List saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving list:', error.response ? error.response.data : error.message);
    }
  };
  
  
  return (
    <>
    <div className="search-container">
      <h2 className="title">Search for Response Code Images</h2>
      <p className="description">Enter a response code pattern to fetch images and save them to your lists. Use wildcards such as 'xx', 'x', or specific ranges like '2xx' to refine your search.</p>
      
      <div className="search-form">
        <input
          type="text"
          placeholder="Enter response code"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          <i className="fas fa-search"></i> Search
        </button>
        <button onClick={handleSaveList} className="save-btn">
          <i className="fas fa-save"></i> Save List
        </button>
      </div>
      
      <div className="images-container">
        {images.length > 0 ? (
          images.map((image, index) => (
            <img key={index} src={image} alt={`Response Code ${filter}`} className="result-image" />
          ))
        ) : (
          <p>No images found. Try modifying your search criteria.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Search;
