import * as React from 'react';
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import "./Profile.css";
import UserFormProfile from "../components/UserFormProfile";

export default function Profile() {
    let { userId } = useParams();
    
    return (
        <div>
            <Header />
            <div className="profile-container">
                <h1 className="title">Profile</h1>
                <UserFormProfile type={'view'} id={userId}/>
                <Link to={`/profile/edit/:userId${userId}`} className="edit-profile-link">Edit Profile</Link>
            </div>
        </div>
    );
}
