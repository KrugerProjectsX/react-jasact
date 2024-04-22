// Login.js
import { useState, useRef, useEffect } from "react";
import { Box, Button, Link, Snackbar, TextField, Typography } from "@mui/material";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import ApartmentImage from "../assets/apartment.jpg"; // Importa la imagen
import { db } from "../firebase";

export default function Login() {
    const emailRef = useRef(""); // Referencia al campo de correo
    const passwordRef = useRef(""); // Referencia al campo de contraseña
    const [isProgress, setIsProgress] = useState(false); // Estado para mostrar el progreso de inicio de sesión
    const [errorAlert, setErrorAlert] = useState(null); // Estado para mostrar alertas de error
    const usersRef = collection(db, 'users'); // Referencia a la colección de usuarios en Firestore
    const navigate = useNavigate(); // Función de navegación

    // Función para manejar el inicio de sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsProgress(true);

        const emailValue = emailRef.current.value; // Obtener el valor del campo de correo
        const passwordValue = passwordRef.current.value; // Obtener el valor del campo de contraseña

        try {
            const querySnapshot = await getDocs(query(usersRef, where("email", "==", emailValue)));
            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();
                const userId = querySnapshot.docs[0].id;

                if (user.password === passwordValue) {
                    console.log("Login success");
                    localStorage.setItem('user_logged', JSON.stringify(userId));
                    setIsProgress(false);
                    // Redirige al usuario a la página de dashboard
                    navigate('/dashboard', { replace: true });
                    return;
                } else {
                    setErrorAlert("Incorrect password");
                }
            } else {
                setErrorAlert("User not found");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorAlert("An error occurred while logging in. Please try again later.");
        }

        setIsProgress(false);
    };

    // Función para manejar el cierre de la alerta de error
    const handleCloseAlert = () => {
        setErrorAlert(null);
    };

    // Función para redirigir a la página de registro
    const handleRegisterRedirect = () => {
        navigate('/register', { replace: true });
    };

    // Datos del usuario registrado
    useEffect(() => {
        // Obtener las credenciales del usuario registrado del almacenamiento local
        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
        if (storedUser) {
            // Si hay credenciales almacenadas, completar automáticamente los campos del formulario
            emailRef.current.value = storedUser.email;
            passwordRef.current.value = storedUser.password;
        }
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundImage: `url(${ApartmentImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    p: 4,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    maxWidth: '400px',
                    width: '80%',
                    textAlign: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h3" gutterBottom style={{ fontFamily: 'Arial', marginBottom: '1.5rem' }}>JASACT</Typography>
                <TextField
                    label="Email"
                    inputRef={emailRef}
                    fullWidth
                    variant="outlined"
                    type="email"
                    className="mb-2"
                />
                <TextField
                    label="Password"
                    inputRef={passwordRef}
                    fullWidth
                    variant="outlined"
                    type="password"
                    className="mb-2"
                />
                <Button
                    type="submit"
                    disabled={isProgress}
                    fullWidth
                    variant="contained"
                    className="mb-2"
                    sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                    {isProgress ? 'Logging in...' : 'Login'}
                </Button>
                <Typography variant="body1" gutterBottom>
                    Don't have an account? <Link component="button" variant="body1" onClick={handleRegisterRedirect} style={{ color: '#4CAF50' }}>Sign up here</Link>
                </Typography>
            </Box>
            <Snackbar
                open={Boolean(errorAlert)}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                message={errorAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    );
}
