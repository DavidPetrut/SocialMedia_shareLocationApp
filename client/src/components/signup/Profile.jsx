import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);


  
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:3000/profile/${username}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Profile data fetched on mount:', response.data);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [username]);


    const handleFileChange = event => {
        const file = event.target.files[0];
        if (!file) {
            alert('No file selected');
            return;
        }
        console.log("Selected file:", file);
        uploadProfilePicture(file);
    };


    const uploadProfilePicture = async (selectedFile) => {
        const formData = new FormData();
        formData.append('image', selectedFile);
        console.log("this is the selectedFile value inside the uploadProfilePicture:", selectedFile)
        console.log("this is after appending the image with selectedFile the image: ", formData)

        try {
            console.log("this is formData in the try/catch: ", formData)
            const response = await axios.post(`http://localhost:3000/profile/upload/${username}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload successful, updating profile:', response.data);
            setProfile(prevState => ({ ...prevState, profilePicture: response.data.filePath }));
            fetchProfile();
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };
    

    const images = [
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUuP4NiVu44Sv4jR9q9d1OR71QVbKXc-vYww&usqp=CAU",
            description: "Hotel Cassana, L.A, highly recommended!"
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ02UXjOXGDYGvDAVTRdn_WpLdm4z2HZZE1rQ&usqp=CAU",
            description: "Best hood I visited in New York, near Lake Park!"
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2cFmrK9LA2wlMBkvmBGmeaiaWeC-_j9thhQ&usqp=CAU",
            description: "Went to this Turkish Restaurant. Authentic!"
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmwmcCnpQrvEIHkLGyrMFOvIjdkn58X07j8Q&usqp=CAU",
            description: "Gina Coffee Shop! Holl Street, London, simply the best coffee shop from that district!"
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI2YIhxN6hRdaWak4pP2OuKCFE_GTU7Z5Njoj7IuS4HNSXZIe0Qqeht0xWG0fzgxKwnGE&usqp=CAU",
            description: "Best deal for the prints! I recommend!"
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbjpGklwtd5ZYb8bWX_4lyV1Kk1ad_s4QXSA&usqp=CAU",
            description: "Cheap Travel Agency, Stunning experience I had!! Friendly and cheaper than any on internet..."
        }
    ];

    if (!profile) {
        return <div>Loading profile...</div>; // Display a loading message or spinner
    }

    const profileImageUrl = profile.profilePicture ? `http://localhost:3000${profile.profilePicture}?${new Date().getTime()}` : 'https://bootdey.com/img/Content/avatar/avatar7.png';


    return (
            <div className="min-h-screen bg-gray-100 p-5">
                <div className="card overflow-hidden shadow-lg rounded-lg mx-auto w-full">
                    <img src="https://images.pexels.com/photos/1388069/pexels-photo-1388069.jpeg?cs=srgb&dl=pexels-wildlittlethingsphoto-1388069.jpg&fm=jpg" alt="" className="img-fluid w-full object-cover h-64" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 bg-white">
                        <div className="col-span-1 flex justify-around p-4">
                            <div className="text-center">
                                <div className="text-blue-500 text-lg mb-2"><i className="fas fa-file"></i></div>
                                <h4 className="font-semibold text-lg">938</h4>
                                <p className="text-sm text-gray-600">Posts</p>
                            </div>
                            <div className="text-center">
                                <div className="text-blue-500 text-lg mb-2"><i className="fas fa-user"></i></div>
                                <h4 className="font-semibold text-lg">3,586</h4>
                                <p className="text-sm text-gray-600">Followers</p>
                            </div>
                            <div className="text-center">
                                <div className="text-blue-500 text-lg mb-2"><i className="fas fa-check"></i></div>
                                <h4 className="font-semibold text-lg">2,659</h4>
                                <p className="text-sm text-gray-600">Following</p>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center py-10 border-b lg:border-b-0 lg:border-r profileSpecial">
                            <div className="bg-gradient-to-tr from-blue-400 to-red-400 p-1 rounded-full">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{ zIndex: 1 }}  // Ensure input is above the image
                                />
                                <img 
                                    src={profileImageUrl} 
                                    alt={profile.username} 
                                    className="img-fluid object-cover h-64 w-64 rounded-full cursor-pointer" 
                                    onClick={() => fileInputRef.current.click()} 
                                    style={{ zIndex: 0 }} />
                            </div>
                            <h5 className="font-semibold text-lg mt-4">{username}</h5>
                            <p className="text-sm text-gray-600">Designer</p>
                        </div>
                        <div className="col-span-1 flex items-center justify-center p-4">
                            <div className="flex space-x-3">
                                <a href="#" className="bg-blue-600 p-3 text-white rounded-full"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="bg-gray-600 p-3 text-white rounded-full"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="bg-red-600 p-3 text-white rounded-full"><i className="fab fa-youtube"></i></a>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Add To Story
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        {images.map((img, index) => (
                            <div key={index} className="p-4 shadow-lg bg-gray-100 rounded-lg mb-4">
                                <img src={img.src} alt="Image" className="w-full h-auto rounded-lg" />
                                <span className="block text-gray-800 text-lg mt-2 flex justify-center">{img.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    export default Profile;