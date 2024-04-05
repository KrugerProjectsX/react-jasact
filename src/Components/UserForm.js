import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function UserForm({ type }) {
    const currentDate = new Date().toJSON().slice(0, 10);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: currentDate
    });
    const [userLoaded, setUserLoaded] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const confirmPasswordRef = useRef('');
    const birthDateRef = useRef('');
    const userTypeRef = useRef('landlords');
    const refCreate = collection(db, "users");

    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    let nameButton = 'Create';
    if (type === 'update') {
        nameButton = 'Update';
    }

    const processData = async () => {
        setUserLoaded(true);
    }

    useEffect(() => {
        processData();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, email, password, confirmPassword, birthDate } = user;

        // Validar campos requeridos
        if (!firstName || !lastName || !email || !password || !confirmPassword || !birthDate) {
            setAlertMessage('All fields are required');
            return;
        }

        // Validar formato de email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            setAlertMessage('Invalid email format');
            return;
        }

        // Validar longitud de nombres
        if (firstName.length < 2 || lastName.length < 2) {
            setAlertMessage('First name and last name must be at least 2 characters long');
            return;
        }

        // Validar coincidencia de contraseñas
        if (password !== confirmPassword) {
            setAlertMessage('Passwords do not match');
            return;
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            setAlertMessage('Password must be at least 6 characters long');
            return;
        }

        // Verificar si el correo electrónico ya existe
        const emailExistsQuery = query(refCreate, where("email", "==", email));
        const emailExistsSnapshot = await getDocs(emailExistsQuery);
        if (!emailExistsSnapshot.empty) {
            setAlertMessage('Email already exists');
            return;
        }

        const newUser = {
            firstName,
            lastName,
            email,
            password,
            birthDate,
            role: userTypeRef.current.value
        };

        try {
            await addDoc(refCreate, newUser);
            setAlertMessage('User created successfully!');
            setTimeout(() => {
                setAlertMessage(null);
                navigate('/');
            }, 6000);
        } catch (error) {
            console.error('Error creating user:', error);
            setAlertMessage('An error occurred. Please try again later.');
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 400, width: '100%', padding: 2, border: '1px solid #ccc', borderRadius: 5, backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}
        >
            {userLoaded ? (
                <>
                    <TextField
                        label="First Name"
                        inputRef={firstNameRef}
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        variant='outlined'
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label="Last Name"
                        inputRef={lastNameRef}
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        variant='outlined'
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        type='email'
                        label='Email'
                        inputRef={emailRef}
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        variant='outlined'
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        type='password'
                        label='Password'
                        inputRef={passwordRef}
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        variant='outlined'
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        type='password'
                        label='Confirm Password'
                        inputRef={confirmPasswordRef}
                        value={user.confirmPassword}
                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                        variant='outlined'
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        label='Birth Date'
                        type='date'
                        inputRef={birthDateRef}
                        value={user.birthDate}
                        onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                        variant='outlined'
                        sx={{ mb: 2 }}
                        required
                        inputProps={{ min: maxBirthDate, max: minBirthDate }}
                    />
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        sx={{ mb: 2 }}
                        inputRef={userTypeRef}
                        defaultValue="landlord"
                        required
                    >
                        <option key="landlord" value="landlord">Landlord</option>
                        <option key="renter" value="renter">Renter</option>
                    </TextField>
                    {alertMessage && (
                        <Alert severity={alertMessage === 'User created successfully!' ? 'success' : 'error'} sx={{ mb: 2 }}>{alertMessage}</Alert>
                    )}
                    <Button
                        type='submit'
                        variant="contained"
                        sx={{ bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#388E3C' }, alignSelf: 'center', mb: 2 }}
                    >
                        {nameButton}
                    </Button>
                    <Typography align="center">
                        Already have an account? <Link to="/">Login</Link>
                    </Typography>
                </>
            ) : (
                <Typography>Loading...</Typography>
            )}
        </Box>
    );
}
