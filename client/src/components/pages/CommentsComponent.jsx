import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../signup/AuthContext';
import axios from 'axios';
import { useState } from 'react';
import ConfirmationModal from '../layout/ConfirmationModal';


function CommentsComponent({ postId, comments, handleDeleteComment, handleUpdateComment }) {
    const { userProfile } = useAuth();
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null); 


    const handleEditChange = (e) => {
        setEditedContent(e.target.value);
    };

    const submitUpdate = async (commentId) => {
        if (editedContent.trim() === "") {
            console.error('Content cannot be empty');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:3000/comments/comments/${commentId}`, {
                content: editedContent
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            handleUpdateComment(commentId, response.data);
            setEditCommentId(null);
            setEditedContent("");
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const localHandleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:3000/comments/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            handleDeleteComment(commentId); 
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const openDeleteModal = (commentId) => {
        setDeleteCommentId(commentId);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/comments/comments/${deleteCommentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            handleDeleteComment(deleteCommentId);
            closeDeleteModal();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
            <div className="mt-8 space-y-3">
            {comments.map((comment) => (
                <div key={comment._id} className="bg-white p-3 rounded shadow">
                    {editCommentId === comment._id ? (
                        <div>
                            <textarea className="input-field input-focus h-24 w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" value={editedContent} onChange={handleEditChange} />
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => submitUpdate(comment._id)}>Update</button>
                        </div>
                    ) : (
                        <>
                        <h3 className='flex'> 
                            <span className='flex mb-1 text-gray-600'>                                    
                            {comment.author.profilePicture && (
                            <img 
                            src={`http://localhost:3000${comment.author.profilePicture}`} 
                                alt={comment.author.username} 
                                className="h-7 w-7 rounded-full mr-2" // Adjust the size as needed
                            /> 
                            )}
                            <span className='nameComments'>{comment.author.username}</span>:<small>{new Date(comment.createdAt).toLocaleDateString()}</small>   
                            </span> 
                        </h3>
                        <p className="text-gray-600 ms-9">{comment.content}</p>
                        <div className='mt-2 ms-9'>
                        {userProfile && userProfile._id === comment.author._id && (
                            <>
                                <button onClick={() => { setEditCommentId(comment._id); setEditedContent(comment.content); }} className="text-blue-500 hover:text-blue-700">
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                <button onClick={() => openDeleteModal(comment._id)} className="ml-2 text-red-500 hover:text-red-700">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </>
                        )}
                        </div>
                        </>
                    )}
                </div>
            ))}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                message="Are you sure you wish to permanently delete this comment? This action cannot be undone."
            />
        </div>
    );
}

export default CommentsComponent;
