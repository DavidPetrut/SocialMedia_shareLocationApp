import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/signup/Login';
import SignUp from './components/signup/SignUp';
import Profile from './components/signup/Profile';
import UpdateProfile from './components/signup/UpdateProfile';
import PostComponent from './components/pages/PostComponent';
import CommentsComponent from './components/pages/CommentsComponent';
import { AuthProvider, useAuth } from './components/signup/AuthContext';
import CreatePost from './components/pages/CreatePost';  
import PostDetailComponent from './components/pages/PostDetailComponent';
import UpdatePost from './components/pages/UpdatePost';


function AuthenticatedRoutes() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or some other loading indicator
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile/:username/update" element={<UpdateProfile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id/comments" element={<CommentsComponent />} />
            <Route path="/posts/:postId" element={<PostDetailComponent />} />
            <Route path="/posts/update/:postId" element={<UpdatePost />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AuthenticatedRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
