import UsersTable from "../components/UserForm";
import Header from "../components/Header";
import {useParams} from "react-router-dom";
import "./Profile.css";
import UserForm2 from "../components/UserForm2";
import { type } from "@testing-library/user-event/dist/type";

export default function Profile() {
    let { userId }  = useParams();
    return (
        <div>
            <Header/>
            <div className="profile-container">
            <h1>Profile</h1>
            <UserForm2  type={"update"} userId={userId}/>
            </div>
        </div>
    );
}
