import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../signup/AuthContext';
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTrash, faPencilAlt, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../layout/Sidebar';
import ReactionComponent from './ReactionComponent'; // Ensure this import is correct
import "../../App.css";
import ConfirmationModal from '../layout/ConfirmationModal';




function Home() {
    const { logout, isAuthenticated, userProfile } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            axios.get('http://localhost:3000/posts', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }).then(response => {
                setPosts(response.data);  // Directly use the response data without altering it.
            }).catch(error => {
                console.error('Error fetching posts:', error);
            });
        }
    }, [isAuthenticated, navigate]);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };


    const filteredPosts = useMemo(() => {
        return posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedTags.length === 0 || post.tags.some(tag => selectedTags.includes(tag)))
        );
    }, [posts, searchQuery, selectedTags]);


    // handleDelete, openDeleteModal and close one are managing the delete post
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/posts/${selectedPostId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPosts(posts.filter(post => post._id !== selectedPostId));
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };
      const openDeleteModal = (postId) => {
        setSelectedPostId(postId);
        setIsModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsModalOpen(false);
    };

    // this function make sure content on HOME page not exceed 45 words
    const truncateContent = (content, limit = 45) => {
        const words = content.split(/\s+/);
        if (words.length > limit) {
          return words.slice(0, limit).join(" ") + ` ... read more.`;
        }
        return content;
      };

    const handleProfileClick = () => {
        navigate(`/profile/${userProfile.username}`);
    };

    const handleCreatePost = () => {
        navigate('/create-post');
    };

    return (
        <div>
            {/* Navbar */}
            <div className="flex bg-[#f0f7f6] border border-gray-200 p-2 w-full z-10 fixed">
                <div className="w-2/5 flex items-center pl-4">
                    <img src={logo} alt="Logo" className="h-7" />
                </div>
                <div className="w-5/6">
                    <input type="text" placeholder="Search..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-gray-100 text-gray-700 border border-gray-700 rounded-md p-2 w-full focus:outline-none focus:border-green-500" />
                </div>
                <div className="w-2/5 flex justify-end ml-2 mr-5">
                    <button onClick={handleProfileClick} className="mx-1 bg-gray-700 border border-gray-700 text-white font-bold px-3 hover:bg-[#30C48D] hover:border-[#30C48D] specialLinksNavHome">Profile</button>
                    <button onClick={logout} className="mx-1 bg-gray-700 border border-gray-700 text-white font-bold px-3 hover:bg-[#30C48D] hover:border-[#30C48D] specialLinksNavHome">Logout</button>
                    <button onClick={handleCreatePost} className="mx-1 bg-gray-700 border border-gray-700 text-white font-bold px-3 hover:bg-[#30C48D] hover:border-[#30C48D] specialLinksNavHome">Create Post</button>
                </div>
            </div>



            {/* Main Content */}
            <div className="flex pt-14">
                {/* Left Column */}
            <div className="w-2/6 h-screen p-4 h-screen overflow-y-scroll scrollbar-hide">
                <Sidebar selectedTags={selectedTags} toggleTag={toggleTag} />
            </div>

                {/* Middle Column */}
                <div className="w-3/4 bg-[#E5E7EB] h-screen overflow-y-scroll scrollbar-hide">
                    <div className="p-4">
                    {filteredPosts.map((post, index) => (
                        <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow flex flex-col">
                            <h2 className="font-bold text-lg">{post.title}</h2>
                            <div className='mb-1'>
                            {post.tags.map(tag => (
                            <span key={tag} className="text-blue-500 mx-1">#{tag}</span>
                            ))}
                            </div>
                            <div className="flex justify-center bg-black rounded-lg mb-3 overflow-hidden postImageClick"
                            onClick={() => navigate(`/posts/${post._id}`)}
                            >
                            {post.image ? (
                                <img src={`http://localhost:3000${post.image}`} alt="Post" className='object-cover specialHeight'/>
                            ) : (
                                post.mapImageUrl && <img src={post.mapImageUrl} alt="Map Location" />
                            )}
                            </div>
                            {/* profile picture and author */}
                            <small className='flex'>Posted by 
                                <span className='flex ms-1'>                                    
                                {post.author.profilePicture && (
                                    <img 
                                        src={`http://localhost:3000${post.author.profilePicture}`} 
                                        alt={post.author.username} 
                                        className="h-7 w-7 rounded-full mr-1 smallImgPostProfile" // Adjust the size as needed
                                    />
                                )}
                                {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}    
                                </span> 
                            </small>
                            {/* location */}
                            <div className='mb-2'>
                                {post.location && (
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center">
                                        <FontAwesomeIcon icon={faLocationDot} className="mr-2" />{post.location}
                                    </a>
                                )}
                            </div>
                            <p className='postImageClick' onClick={() => navigate(`/posts/${post._id}`)}>{truncateContent(post.content)}</p>
                            <div className='flex justify-between'>
                            <ReactionComponent postId={post._id} />
                            <div className='flex items-center'>
                                <button
                                    className="mt-2 text-blue-500 hover:text-blue-700 flex items-center commentButton"
                                    onClick={() => navigate(`/posts/${post._id}`)}
                                    >
                                    <FontAwesomeIcon icon={faComments} /> <span className="ml-2 mr-4">{post.commentCount} Comments</span>
                                </button>
                                {userProfile && userProfile._id === post.author._id && (
                                <button onClick={() => navigate(`/posts/update/${post._id}`)} className="text-blue-500 hover:text-blue-700 mr-2">
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                )}
                                {userProfile && userProfile._id === post.author._id && (
                                        <button onClick={() => openDeleteModal(post._id)} className="text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                )}
                                <ConfirmationModal
                                    isOpen={isModalOpen}
                                    onClose={closeDeleteModal}
                                    onConfirm={handleDelete}
                                    message="Are you sure you wish to permanently delete this post? All comments and reactions will be deleted too."
                                />
                             </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                 {/* Right Column */}
                 <div className="w-2/6 bg-gray-200 h-screen p-4 h-screen overflow-y-scroll scrollbar-hide">
                    <div className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUuP4NiVu44Sv4jR9q9d1OR71QVbKXc-vYww&usqp=CAU" alt="Image" className="w-full h-auto rounded-lg" />
                        <span className="block text-gray-800 text-lg mt-2 flex justify-center">Hotel Cassana, L.A, highly recommanded!</span>
                    </div>
                    <div className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ02UXjOXGDYGvDAVTRdn_WpLdm4z2HZZE1rQ&usqp=CAU" alt="Image" className="w-full h-auto rounded-lg" />
                        <span className="block text-gray-800 text-lg mt-2 flex justify-center">Best hood i visit in New York, near Lake Park!</span>
                    </div>
                    <div className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2cFmrK9LA2wlMBkvmBGmeaiaWeC-_j9thhQ&usqp=CAU" alt="Image" className="w-full h-auto rounded-lg" />
                        <span className="block text-gray-800 text-lg mt-2 flex justify-center">Went to this Turkish Restaurant. Authentic!</span>
                    </div>
                    <div className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmwmcCnpQrvEIHkLGyrMFOvIjdkn58X07j8Q&usqp=CAU" alt="Image" className="w-full h-auto rounded-lg" />
                        <span className="block text-gray-800 text-lg mt-2 flex justify-center">Gina Coffee Shop! Holl Street, London, simply the best coffee shop from that district!</span>
                    </div>
                    <div className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI2YIhxN6hRdaWak4pP2OuKCFE_GTU7Z5Njoj7IuS4HNSXZIe0Qqeht0xWG0fzgxKwnGE&usqp=CAU" alt="Image" className="w-full h-auto rounded-lg" />
                        <span className="block text-gray-800 text-lg mt-2 flex justify-center">Best deal for the prints! I recommand!</span>
                    </div>
                    <div className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbjpGklwtd5ZYb8bWX_4lyV1Kk1ad_s4QXSA&usqp=CAU" alt="Image" className="w-full h-auto rounded-lg" />
                        <span className="block text-gray-800 text-lg mt-2 flex justify-center">Cheap Travel Agency, Stunning experience I had!! Friendly and cheaper than any on internet...</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Home;


