import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Lists.css'; // Import the CSS file

const Lists = () => {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/lists', { withCredentials: true });
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/lists/${id}`, { withCredentials: true });
      fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-list/${id}`);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="lists-container">
      <h2 className="title">My Lists</h2>
      <p className="description">
        Here you can view, edit, or delete your saved lists. Each list contains response codes and images corresponding to those codes.
      </p>
      
      <ul className="lists-list">
        {lists.length > 0 ? (
          lists.map((list) => (
            <li key={list._id} className="list-item">
              <h3 className="list-name">{list.name}</h3>
              <p className="list-info"><strong>Created At:</strong> {new Date(list.createdAt).toLocaleDateString()}</p>
              <p className="list-info"><strong>Response Codes:</strong> {list.responseCodes.join(', ')}</p>
              <div className="list-images">
                {list.images.length > 0 ? (
                  list.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Response Code ${list.responseCodes[index]}`}
                      className="list-image"
                    />
                  ))
                ) : (
                  <p>No images available for this list.</p>
                )}
              </div>
              <div className="list-actions">
                <button onClick={() => handleEdit(list._id)} className="action-btn edit-btn">
                  <i className="fas fa-edit"></i> Edit List
                </button>
                <button onClick={() => handleDelete(list._id)} className="action-btn delete-btn">
                  <i className="fas fa-trash"></i> Delete List
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="no-lists-message">No lists available. Create a new list to get started.</p>
        )}
      </ul>
    </div>
  );
};

export default Lists;
