import {Box, Button, Switch, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {db} from "../firebase";
import {collection, addDoc, doc, getDoc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export default function FlatForm({type, id}) {
    const [flatLoaded, setFlatLoaded] = useState(false);
    const currentDate = new Date().toJSON().slice(0, 10);
    const [flat, setFlat] = useState(
        {
            city: '',
            streetName: '',
            streetNumber: 0,
            areaSize: 0,
            hasAc: false,
            yearBuilt: 0,
            rentPrice: 0,
            dateAvailable: currentDate
        }
    );
    

    const navigate = useNavigate();
    
    const city = useRef('');
    const streetName = useRef('');
    const streetNumber = useRef(0);
    const areaSize = useRef(0);
    const hasAc = useRef(false);
    const yearBuilt = useRef(0);
    const rentPrice = useRef(0);
    const dateAvailable = useRef('');
    const ref = collection(db, "flats");
    let refFlat = null;
    if (id && type !== 'create') {
        refFlat = doc(db, "flats", id);
    }
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const flat = {
            city: city.current.value,
            streetName: streetName.current.value,
            streetNumber: streetNumber.current.value,
            areaSize: areaSize.current.value,
            hasAc: hasAc.current.checked,
            yearBuilt: yearBuilt.current.value,
            rentPrice: rentPrice.current.value,
            dateAvailable: dateAvailable.current.value,
            user: JSON.parse(localStorage.getItem('user_logged'))
        }
        if (type === 'create') {
            await addDoc(ref, flat);
            navigate('/flats', { replace: false });
        }
        
    }
    const getFlatData = async () => {
        const dataFlat = await getDoc(refFlat);
        const responseFlat = { ...dataFlat.data() };
        setFlat(responseFlat);
        setFlatLoaded(true);
    }
    
    const processData = async () => {
        if (type === 'update' || type === 'view') {
            await getFlatData();
        }else{
            setFlatLoaded(true)
        }
    }

    useEffect(() => {
        processData();
        
    },[]);
    
    return (
        <Box component="form" onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            {flatLoaded ? <>
                <TextField disabled={type === 'view'} label="City" inputRef={city} defaultValue={flat.city} variant="outlined" fullWidth className="mb-4" />
                <TextField disabled={type === 'view'} label="Street name" inputRef={streetName} defaultValue={flat.streetName} variant="outlined" fullWidth className="mb-4" />
                <TextField disabled={type === 'view'} label="Street number" inputRef={streetNumber} defaultValue={flat.streetNumber} variant="outlined" fullWidth className="mb-4" />
                <TextField  disabled={type === 'view'}label="Area size" type="number" inputRef={areaSize} defaultValue={flat.areaSize} variant="outlined" fullWidth className="mb-4" />
                <Box className="flex items-center mb-4">
                    <Switch disabled={type === 'view'} inputRef={hasAc} defaultValue={flat.hasAc} color="primary" />
                    <label>Has AC</label>
                </Box>
                <TextField disabled={type === 'view'} label="Year built" type={'number'} inputProps={{ min: 1900, max: 2050 }}  inputRef={yearBuilt} defaultValue={flat.yearBuilt} variant="outlined" fullWidth className="mb-4" />
                <TextField disabled={type === 'view'} label="Rent price" type={'number'} inputRef={rentPrice} defaultValue={flat.rentPrice} variant="outlined" fullWidth className="mb-4" />
                <TextField disabled={type === 'view'} label="Date Available" type={'date'} defaultValue={flat.dateAvailable}  inputRef={dateAvailable} variant="outlined" fullWidth className="mb-4" />
                { type ==='create' && <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Flat
                </Button> } 
                {/*TODO: Add the update button*/}
            </> : <p>Loading...</p>}
            
        </Box>

    )
}