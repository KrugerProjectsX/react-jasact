import Header from "../components/Header";
import {useParams} from "react-router-dom";
import UserFormProfile from "../components/UserFormProfile";

export default function ProfileUpdate() {
    let { userId }  = useParams();
    if (userId === undefined) {
        userId = null;
    
    }
    //TODO: verificar si el que actualiza un usuario que no es el mismo sea admin si no mandar null

    return (
        <div>
            <Header/>
            <h1 className="title">Profile Update</h1>
            <UserFormProfile type="update" userId={userId} editable={true} />
        </div>
    );
}