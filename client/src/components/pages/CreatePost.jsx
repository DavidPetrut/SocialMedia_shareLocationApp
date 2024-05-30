import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [disableSearchLocation, setDisableSearchLocation] = useState(false);
  const [disableShareLocation, setDisableShareLocation] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const apiKey = process.env.GOOGLE_API_KEY

  const tagOptions = ["BudgetFriendly", "Service", "Personal", "Work", "HiddenGem", "Review", "Student", "Food", "Travel"];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else if (tags.length < 3) {
      // this will actually add the tag only if fewer than 3 tags are selected
      setTags([...tags, tag]);
    } else {
      alert('You can select up to 3 tags only.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));
    formData.append('location', location);
    formData.append('mapImageUrl', imageURL);
    if (file) {
      formData.append('image', file);
    } 

    console.log("This is imageURL before the formData is sent to backend: ", imageURL)

    const token = localStorage.getItem('token'); // Retrieve the token directly from localStorage

    try {
      const response = await axios.post('http://localhost:3000/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/home'); // Redirect to home after post creation
    } catch (error) {
      console.error('Failed to create post:', error.response ? error.response.data : error);
    }
  };


  useEffect(() => {
      let autocomplete;
      if (window.google) {
          autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('searchLocation'), {types: ['geocode']});
          autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry) {
                  setLocation(place.formatted_address);
                  const lat = place.geometry.location.lat();
                  const lng = place.geometry.location.lng();
                  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red|${lat},${lng}&key=${apiKey}`;
                  console.log("This is the mapImageUrl from useEffect value: ", mapImageUrl)
                  setImageURL(mapImageUrl);
                  setDisableShareLocation(true);
              } else {
                  alert('No details available for input: ' + place.name);
              }
          });
      }
  }, []);


  // google api
  // take location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
      setDisableSearchLocation(true);
      alert("We found your current location!")
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  
  const showPosition = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        setLocation(data.results[0].formatted_address);
        setDisableSearchLocation(true);
      });
  };

    const handleLocationSearch = (e) => {
      const input = e.target.value;
      setSearchInput(input);
      if (input.length > 2) {  
        searchLocation(input);
        setDisableShareLocation(true);
      }
    };


    const searchLocation = (query) => {
      if (!query.trim()) return;
  
      axios.get(`http://localhost:3000/api/search-location?query=${encodeURIComponent(query)}`)
        .then(response => {
          if (response.data && response.data.formatted_address) {
            setLocation(response.data.formatted_address);
            const mapImageUrl = response.data.mapImageUrl;
            setImageURL(mapImageUrl);
            setDisableShareLocation(true);
          } else {
            console.log("No valid location data found in response");
            alert('No results found.');
          }
        })
  };
  
    
  
  const showError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  };
  


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#b4f4de]">
    <div className="p-8 shadow-lg rounded border-2 border-[#374151] bg-[#d0f9eb] max-w-xl w-full custom-shadow">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-center text-2xl font-extrabold text-gray-700">Create New Post</h2>
        {/* tags */}
        <div className="flex gap-2 flex-wrap">
            {tagOptions.map((tag, index) => (
              <button key={index} type="button" onClick={() => toggleTag(tag)}
                className={`tagsCSS ${tags.includes(tag) ? 'activeTagCSS' : 'notActiveTagCSS'}`}>
                #{tag}
              </button>
            ))}
        </div>
        {/* title */}
        <div>
          <label htmlFor="title" className="input-label">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="input-field input-focus"
          />
        </div>
        <div>
          <label htmlFor="content" className="input-label">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            className="input-field input-focus h-40"
          />
        </div>
        <div>
          <label htmlFor="image" className="input-label">Image:</label>
          <input
            type="file"
            id="image"
            onChange={e => setFile(e.target.files[0])}
            className="input-field input-focus"
          />
        {!file && imageURL && (
          <img src={imageURL} alt="Map Preview" style={{ maxWidth: '100%', height: 'auto' }} />
        )}
        </div>
        <div className={`mt-4 ${disableSearchLocation ? 'opacity-50' : ''}`}>
            <label htmlFor="searchLocation" className="input-label">Search Location:</label>
            <input 
            type="text"
            id="searchLocation"
            value={searchInput}
            onChange={handleLocationSearch}
            disabled={disableSearchLocation}
            className="input-field input-focus"
            />
          </div>
        <div>
            <button type="button" onClick={getLocation} className={`bg-[#374151] hover:bg-[#0faa71]  text-white font-bold py-2 px-4 rounded ${disableShareLocation ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disableShareLocation}>
              Share Current Location
            </button>
            {location && <div className="mt-2 p-2 bg-gray-200 rounded">Location: {location}</div>}
        </div>

        <button type="submit" className="w-full bg-[#374151] hover:bg-[#0faa71] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create Post
        </button>
      </form>
    </div>
  </div>
  
  );
}

export default CreatePost;
