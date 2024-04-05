import Header from "../components/Header";
import FlatsTable from "../components/FlatsTable";

export default function Flats() {
    return (
        <div>
            <Header/>
        <h1>Home</h1>
            <FlatsTable type={'all-flats'} />
        </div>
    );
}
