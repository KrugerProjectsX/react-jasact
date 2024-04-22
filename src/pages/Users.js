import Header from "../components/Header";
import UsersTable from "../components/UsersTable";

export default function Users() {
    
    return (
        <div>
            <Header/>
            <h1 className="title">Users</h1>
            
            <UsersTable/>
        </div>
    );
}
