import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../signup/AuthContext";
import { useNavigate } from 'react-router-dom';

function CommentFormComponent({ postId, onCommentAdded }) {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // this will prevent empty comments
        if (!comment.trim()) return;

        try {
            const response = await axios.post(`http://localhost:3000/comments/posts/${postId}/comments`, {
                content: comment,
                author: userProfile._id 
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComment('');
            console.log("New comment response data:", response.data);
            onCommentAdded(response.data); 
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleNavigateHome = () => {
        navigate('/home');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="input-field input-focus h-24"
                placeholder="Write a comment..."
            />
            <div className='flex gap-2 float-right'>
                <button type="submit" className="bg-[#374151] hover:bg-[#0faa71] text-white font-bold py-2 px-4 rounded mt-1 focus:outline-none focus:shadow-outline">
                    Submit Comment
                </button>
            </div>
        </form>
    );
}

export default CommentFormComponent;
