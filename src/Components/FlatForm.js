import { Box, Button, Switch, TextField, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function FlatForm({ type, id }) {
    const [flatLoaded, setFlatLoaded] = useState(false);
    const currentDate = new Date().toJSON().slice(0, 10);
    const [flat, setFlat] = useState({
        city: '',
        streetName: '',
        streetNumber: 0,
        areaSize: 0,
        hasAc: false,
        yearBuilt: 0,
        rentPrice: 0,
        dateAvailable: currentDate
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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

        const flatData = {
            city: city.current.value,
            streetName: streetName.current.value,
            streetNumber: parseInt(streetNumber.current.value),
            areaSize: parseInt(areaSize.current.value),
            hasAc: hasAc.current.checked,
            yearBuilt: parseInt(yearBuilt.current.value),
            rentPrice: parseInt(rentPrice.current.value),
            dateAvailable: dateAvailable.current.value,
            user: JSON.parse(localStorage.getItem('user_logged'))
        };

        if (validateData(flatData)) {
            try {
                if (type === 'create') {
                    await addDoc(ref, flatData);
                    setSnackbarMessage('Flat created successfully');
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        navigate('/flats', { replace: false });
                    }, 2000);
                }
            } catch (error) {
                console.error("Error creating flat:", error);
                setErrorMessage('Error creating flat');
            }
        }
    };

    const getFlatData = async () => {
        const dataFlat = await getDoc(refFlat);
        const responseFlat = { ...dataFlat.data() };
        setFlat(responseFlat);
        setFlatLoaded(true);
    };

    const processData = async () => {
        if (type === 'update' || type === 'view') {
            await getFlatData();
        } else {
            setFlatLoaded(true);
        }
    };

    useEffect(() => {
        processData();
    }, []);

    const validateData = (flat) => {
        if (!flat.city || !flat.streetName || !flat.streetNumber || !flat.areaSize || !flat.yearBuilt || !flat.rentPrice || !flat.dateAvailable) {
            setErrorMessage('Please fill in all required fields.');
            return false;
        }

        if (isNaN(flat.streetNumber) || isNaN(flat.areaSize) || isNaN(flat.yearBuilt) || isNaN(flat.rentPrice)) {
            setErrorMessage('Please enter valid numerical values.');
            return false;
        }

        const currentYear = new Date().getFullYear();
        if (flat.yearBuilt < 1900 || flat.yearBuilt > currentYear) {
            setErrorMessage('Please enter a valid year between 1900 and the current year.');
            return false;
        }

        if (flat.rentPrice <= 0) {
            setErrorMessage('Rent price must be greater than zero.');
            return false;
        }

        const today = new Date();
        const dateAvailable = new Date(flat.dateAvailable);
        if (dateAvailable <= today) {
            setErrorMessage('Date available must be in the future.');
            return false;
        }

        setErrorMessage('');
        return true;
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                {flatLoaded ? (
                    <>
                        <TextField disabled={type === 'view'} label="City" inputRef={city} defaultValue={flat.city} variant="outlined" fullWidth className="mb-4" required />
                        <TextField disabled={type === 'view'} label="Street Name" inputRef={streetName} defaultValue={flat.streetName} variant="outlined" fullWidth className="mb-4" required />
                        <TextField disabled={type === 'view'} label="Street Number" type="number" inputRef={streetNumber} defaultValue={flat.streetNumber} variant="outlined" fullWidth className="mb-4" required />
                        <TextField disabled={type === 'view'} label="Area Size" type="number" inputRef={areaSize} defaultValue={flat.areaSize} variant="outlined" fullWidth className="mb-4" required />
                        <Box className="flex items-center mb-4">
                            <Switch disabled={type === 'view'} inputRef={hasAc} defaultChecked={flat.hasAc} color="primary" />
                            <label>Has Air Conditioning</label>
                        </Box>
                        <TextField disabled={type === 'view'} label="Year Built" type="number" inputRef={yearBuilt} defaultValue={flat.yearBuilt} variant="outlined" fullWidth className="mb-4" required />
                        <TextField disabled={type === 'view'} label="Rent Price" type="number" inputRef={rentPrice} defaultValue={flat.rentPrice} variant="outlined" fullWidth className="mb-4" required />
                        <TextField disabled={type === 'view'} label="Date Available" type="date" defaultValue={flat.dateAvailable} inputRef={dateAvailable} variant="outlined" fullWidth className="mb-4" required />
                        {type === 'create' && (
                            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Add Flat
                            </Button>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </Box>
            {errorMessage && (
                <Snackbar open={true} autoHideDuration={6000} onClose={() => setErrorMessage('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Box sx={{ bgcolor: 'red', color: 'white', p: 2, borderRadius: 4 }}>{errorMessage}</Box>
                </Snackbar>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Box sx={{ bgcolor: 'green', color: 'white', p: 2, borderRadius: 4 }}>{snackbarMessage}</Box>
            </Snackbar>
        </>
    );
}
