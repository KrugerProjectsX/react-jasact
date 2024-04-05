import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function EditFlatForm() {
    const { id } = useParams();
    const [flatData, setFlatData] = useState({
        city: '',
        areaSize: '',
        rentPrice: '',
        hasAc: false,
        dateAvailable: '',
        streetName: '',
        streetNumber: '',
        yearBuilt: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const flatRef = doc(db, "flats", id);
            const docSnap = await getDoc(flatRef);
            if (docSnap.exists()) {
                setFlatData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFlatData({ ...flatData, [name]: newValue });
    };

    const handleSubmit = async () => {
        const flatRef = doc(db, "flats", id);
        await updateDoc(flatRef, flatData);
        console.log("Document updated successfully!");
    };

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={12} sm={8} md={6}>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <TextField
                        label="City"
                        name="city"
                        value={flatData.city}
                        onChange={handleInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        label="Area Size"
                        name="areaSize"
                        value={flatData.areaSize}
                        onChange={handleInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        label="Rent Price"
                        name="rentPrice"
                        value={flatData.rentPrice}
                        onChange={handleInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <FormControlLabel
                        control={<Switch
                            checked={flatData.hasAc}
                            onChange={handleInputChange}
                            name="hasAc"
                            color="primary"
                        />}
                        label="Has AC"
                    />
                    <TextField
                        label="Date Available"
                        name="dateAvailable"
                        type="date"
                        value={flatData.dateAvailable}
                        onChange={handleInputChange}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {/* Agrega los demás campos de manera similar */}

                    <Button variant="contained" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default EditFlatForm;
