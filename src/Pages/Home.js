import Header from "../components/Header";
import checkUserLogged from "../services/actions";
import FlatsTable from "../components/FlatsTable";
import './styles.css';

export default function Home() {
    checkUserLogged();
    
    return (
        <div>
            <Header/>
            <h1 className="title">Home</h1>
            <FlatsTable type={'all-flats'}/>
        </div>
    );
}
