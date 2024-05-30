import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../signup/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import "../../App.css"



function ReactionComponent({ postId }) {
    const auth = useAuth();
    const { userID } = auth;
    const [reactions, setReactions] = useState({
        likeCount: 0,
        dislikeCount: 0,
        reportCount: 0,
        userReaction: null
    });

    useEffect(() => {
        if (!userID) {
            console.error('ReactionComponent: No user ID available, cannot fetch reactions.');
            return;
        }

        const fetchReactions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reactions/${postId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'X-User-Id': userID }
                });
                setReactions(response.data);
            } catch (error) {
                console.error('ReactionComponent: Error fetching reactions:', error);
            }
        };
        fetchReactions();
    }, [postId, userID]);

    const handleReaction = async (type) => {
        if (!userID) {
            console.error("ReactionComponent: No user ID available, cannot process reaction.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3000/reactions/${postId}`, { type }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'X-User-Id': userID
                }
            });
            setReactions(response.data);
        } catch (error) {
            console.error('ReactionComponent: Error reacting:', error);
        }
    };

    const getButtonClass = (type) => {
        return reactions.userReaction === type ? `${type}-active` : '';
    };

    return (
        <div className='inline-flex'>
            <div className="reactions flex gap-4 bg-gray-200 p-2 reactionIconBackground mt-2">
                <button className={`like-button ${getButtonClass('like')} icon-border`} onClick={() => handleReaction('like')}>
                    <FontAwesomeIcon icon={faThumbsUp} /> {reactions.likeCount}
                </button>
                <button className={`dislike-button ${getButtonClass('dislike')} icon-border`} onClick={() => handleReaction('dislike')}>
                    <FontAwesomeIcon icon={faThumbsDown} /> {reactions.dislikeCount}
                </button>
                <button className={`report-button ${getButtonClass('report')}`} onClick={() => handleReaction('report')}>
                    <FontAwesomeIcon icon={faFlag} /> {reactions.reportCount}
                </button>
            </div>
        </div>
    );
}

export default ReactionComponent;
