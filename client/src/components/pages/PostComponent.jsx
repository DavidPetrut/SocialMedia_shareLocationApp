import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComments } from '@fortawesome/free-solid-svg-icons';

function PostComponent({ post }) {
    const navigate = useNavigate();

    if (!post) {
        console.error('PostComponent received undefined post');
        return <div>Loading post or post not available...</div>;
    }

    // Optional chaining to safely access nested properties
    return (
        <div className="post bg-white shadow-lg rounded-lg p-4 my-4">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" className="my-3" />}
            <div className="flex space-x-4">
                <button onClick={() => {}}><FontAwesomeIcon icon={faThumbsUp} /></button>
                <button onClick={() => {}}><FontAwesomeIcon icon={faThumbsDown} /></button>
                <button onClick={() => navigate(`/posts/${post._id}/comments`)}><FontAwesomeIcon icon={faComments} /></button>
            </div>
        </div>
    );
}



export default PostComponent;
