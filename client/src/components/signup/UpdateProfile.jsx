// components/UpdateProfile.jsx
import React, { useState } from 'react';

function UpdateProfile({ username }) {
  const [profileDetails, setProfileDetails] = useState({
    profilePicture: '',
    bio: '',
    status: '',
    favorites: '',
    vision: '',
    contact: '',
    faqs: [{ question: '', answer: '' }]
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`/profile/${username}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileDetails)
    })
    .then(response => response.json())
    .then(data => {
      alert('Profile updated successfully!');
      console.log('Profile updated:', data);
    })
    .catch(error => console.error('Error updating profile:', error));
  };

  const handleInputChange = (event, field, index = null) => {
    if (field === 'faqs') {
      const newFaqs = profileDetails.faqs.map((faq, i) => {
        if (i === index) {
          return { ...faq, [event.target.name]: event.target.value };
        }
        return faq;
      });
      setProfileDetails({ ...profileDetails, faqs: newFaqs });
    } else {
      setProfileDetails({ ...profileDetails, [field]: event.target.value });
    }
  };

  const addFaqField = () => {
    setProfileDetails({
      ...profileDetails,
      faqs: [...profileDetails.faqs, { question: '', answer: '' }]
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-6 px-4">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl m-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture URL:</label>
          <input
            type="text"
            value={profileDetails.profilePicture}
            onChange={e => handleInputChange(e, 'profilePicture')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio:</label>
          <textarea
            value={profileDetails.bio}
            onChange={e => handleInputChange(e, 'bio')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status:</label>
          <input
            type="text"
            value={profileDetails.status}
            onChange={e => handleInputChange(e, 'status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Favorites:</label>
          <input
            type="text"
            value={profileDetails.favorites}
            onChange={e => handleInputChange(e, 'favorites')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vision:</label>
          <input
            type="text"
            value={profileDetails.vision}
            onChange={e => handleInputChange(e, 'vision')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact:</label>
          <input
            type="text"
            value={profileDetails.contact}
            onChange={e => handleInputChange(e, 'contact')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        {profileDetails.faqs.map((faq, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">FAQ Question:</label>
            <input
              type="text"
              name="question"
              value={faq.question}
              onChange={(e) => handleInputChange(e, 'faqs', index)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            <label className="block text-sm font-medium text-gray-700">FAQ Answer:</label>
            <textarea
              name="answer"
              value={faq.answer}
              onChange={(e) => handleInputChange(e, 'faqs', index)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        ))}
        <div className="flex justify-between">
          <button type="button" onClick={addFaqField} className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
            Add FAQ
          </button>
          <button type="submit" className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
