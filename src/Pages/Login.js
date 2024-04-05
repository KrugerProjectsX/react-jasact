import { Box, Button, Link, Snackbar, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import ApartmentImage from "../assets/apartment.jpg"; // Importa la imagen

export default function Login() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usersRef = collection(db, 'users');
    const navigate = useNavigate();
    const [isProgress, setIsProgress] = useState(false);
    const [errorAlert, setErrorAlert] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsProgress(true);

        const emailValue = emailRef.current.value;
        const passwordValue = passwordRef.current.value;

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
                    setErrorAlert("Contraseña incorrecta");
                }
            } else {
                setErrorAlert("Usuario no encontrado");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setErrorAlert("Ocurrió un error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.");
        }

        setIsProgress(false);
    }

    const handleCloseAlert = () => {
        setErrorAlert(null);
    };

    const handleRegisterRedirect = () => {
        navigate('/register', { replace: true });
    };

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
                    label="Contraseña"
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
                    {isProgress ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
                <Typography variant="body1" gutterBottom>
                    ¿No tienes una cuenta? <Link component="button" variant="body1" onClick={handleRegisterRedirect} style={{ color: '#4CAF50' }}>Regístrate aquí</Link>
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