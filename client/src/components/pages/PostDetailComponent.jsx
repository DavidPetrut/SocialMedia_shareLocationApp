import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentsComponent from './CommentsComponent';
import CommentFormComponent from './CommentFormComponent';
import ReactionComponent from './ReactionComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



function PostDetailComponent() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    

    useEffect(() => {
        const fetchData = async () => {
            const postResponse = await axios.get(`http://localhost:3000/posts/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPost(postResponse.data);

            const commentsResponse = await axios.get(`http://localhost:3000/comments/posts/${postId}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComments(commentsResponse.data);
        };

        fetchData();
    }, [postId]);

    const handleNewComment = (newComment) => {
        setComments(prevComments => {
            const updatedComments = [newComment, ...prevComments];
            return updatedComments;
        });
    };

    useEffect(() => {
        console.log("Comments updated", comments);
    }, [comments]);

    const handleDeleteComment = (commentId) => {
        setComments(currentComments => currentComments.filter(comment => comment._id !== commentId));
    };


    if (!post) {
        return <div>Loading post details...</div>;
    }

    const handleUpdateComment = (commentId, updatedComment) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment._id === commentId ? { ...comment, ...updatedComment } : comment
            )
        );
    };

    
    const handleNavigateHome = () => {
        navigate('/home');
    };
    
    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#d0f9eb] pt-10">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-5 relative">
                <div className='flex justify-between gap-5'>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
                    <button className="bg-transparent text-[#374151] font-bold py-4 px-4 rounded mt-3 focus:outline-none focus:shadow-outline flex float-right w-100 goHomeButtonComments hoverText"
                    onClick={handleNavigateHome}>Back to Home</button>
                </div>
                {post.image && (
                    <div className="flex justify-center bg-black rounded-xl mb-3 overflow-hidden object-cover specialHeight">
                        {post.image ? (
                            <img src={`http://localhost:3000${post.image}`} alt="Post" />
                        ) : (
                            post.mapImageUrl && <img src={post.mapImageUrl} alt="Map Location" />
                        )}  
                    </div>
                )}
                
                {post.mapImageUrl ? (
                <img src={post.mapImageUrl} alt="Post" className="max-h-[55vh] max-w-full w-full" />
                ) : null}
                {/* profile picture and author */}
                <h3 className='flex'> 
                    <span className='flex mb-1 text-gray-600'>                                    
                    {post.author.profilePicture && (
                        <img 
                            src={`http://localhost:3000${post.author.profilePicture}`} 
                            alt={post.author.username} 
                            className="h-7 w-7 rounded-full mr-1 smallImgPostProfile" // Adjust the size as needed
                        />
                    )}
                    {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}    
                    </span> 
                </h3>
                <div className='mb-2'>
                    {post.location && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-2" />{post.location}
                        </a>
                    )}
                </div>
                <p className="text-gray-600 mt-1">{post.content}</p>
                <ReactionComponent postId={post._id}/>
                <div className="pt-4">
                    <CommentFormComponent postId={postId} onCommentAdded={handleNewComment} />
                    <CommentsComponent postId={postId} comments={comments} handleDeleteComment={handleDeleteComment} handleUpdateComment={handleUpdateComment} />
                </div>
            </div>
        </div>
    );
}

export default PostDetailComponent;
