import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditList.css'; // Import the CSS file

const EditList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState({ name: '', images: [], responseCodes: [] });
  const [tempName, setTempName] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/lists/${id}`, { withCredentials: true });
      setList(response.data);
      setTempName(response.data.name);
      setSearchFilter(response.data.responseCodes.join(',')); // Set search filter based on existing response codes
      // Update images based on initial response codes
      updateImages(response.data.responseCodes);
    } catch (error) {
      console.error('Error fetching list', error);
    }
  };

  const updateImages = async (responseCodes) => {
    let urls = generateUrls(responseCodes.join(','));
    let fetchedImages = [];
    for (let url of urls) {
      try {
        const response = await axios.get(url);
        fetchedImages.push(response.config.url);
      } catch (error) {
        console.error(`Error fetching image for URL: ${url}`, error);
      }
    }
    setSearchResults(fetchedImages);
    setList((prevList) => ({
      ...prevList,
      images: fetchedImages
    }));
  };

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

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/api/lists/${id}`, {
        name: tempName,
        images: list.images,
        responseCodes: searchFilter.split(',')
      }, { withCredentials: true });
      navigate('/lists'); // Redirect back to the lists page
    } catch (error) {
      console.error('Error updating list', error);
    }
  };

  const handleSearchFilterChange = (e) => {
    const newFilter = e.target.value;
    setSearchFilter(newFilter);
    updateImages(newFilter.split(',')); // Update images based on new filter
  };

  useEffect(() => {
    fetchList(); // Fetch list details when the component mounts
  }, [id]);

  return (
    <div className="edit-list-container">
      <h2 className="title">Edit List</h2>
      <div className="form-group">
        <label>
          <h4>Name:</h4>
        </label>
        <input
          type="text"
          className="form-control"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>
          <h4>Search Filter (comma-separated response codes):</h4>
        </label>
        <input
          type="text"
          className="form-control"
          value={searchFilter}
          onChange={handleSearchFilterChange}
        />
      </div>
      <div className="images-container">
        {list.images.length > 0 ? (
          list.images.map((image, index) => (
            <img key={index} src={image} alt={`Response Code ${list.responseCodes[index]}`} className="result-image" />
          ))
        ) : (
          <p>No images found. Try modifying your search criteria.</p>
        )}
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditList;
