import FlatsTable from "../components/FlatsTable";
import Header from "../components/Header";

export default function MyFlats() {
    return (
        <div>
            <Header/>
            <h1>My Flats</h1>
            
            <FlatsTable type={'my-flats'} />
        </div>
    );
}
