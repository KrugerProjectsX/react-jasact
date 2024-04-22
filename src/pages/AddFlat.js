import FlatForm from "../components/FlatForm";
import Header from "../components/Header";

export default function AddFlat() {

    return (
        <>
            <Header/>
            <div>
                <h1 className="title">Add Flat</h1>
            </div>
            <div>
                <FlatForm type={'create'} id={null} />
            </div>
        </>
    );
}
