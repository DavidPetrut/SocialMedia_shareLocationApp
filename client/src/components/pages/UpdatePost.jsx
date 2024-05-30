import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`http://localhost:3000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTitle(response.data.title);
      setContent(response.data.content);
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('image', file);
    }

    try {
      await axios.put(`http://localhost:3000/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/home");
    } catch (error) {
      console.error('Failed to update post:', error.response ? error.response.data : error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#b4f4de]">
      <div className="p-8 shadow-lg rounded border-2 border-[#374151] bg-[#d0f9eb] max-w-md w-full custom-shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-center text-2xl font-extrabold text-gray-700">Update Post</h2>
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
            <label htmlFor="image" className="input-label">Image (optional):</label>
            <input
              type="file"
              id="image"
              onChange={e => setFile(e.target.files[0])}
              className="input-field input-focus"
            />
          </div>
          <button type="submit" className="w-full bg-[#374151] hover:bg-[#0faa71] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePost;
