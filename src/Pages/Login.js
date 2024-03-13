import React, { useRef, useState } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { db } from '../Firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const email = useRef("");
  const password = useRef("");
  const usersRef = collection(db, 'users');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const search = query(usersRef, where('email', '==', email.current.value));
      const result = await getDocs(search);

      if (result.docs.length > 0) {
        const user = result.docs[0].data();
        const user_id = result.docs[0].id;

        if (user.password === password.current.value) {
          console.log('Login success');
          console.log('Redirect');
          localStorage.setItem('user_logged', JSON.stringify(user_id));
          navigate('/dashboard', { replace: true });
        } else {
          setError('Email/Password incorrect');
        }
      } else {
        setError('Email/Password incorrect');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError('An error occurred during login');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h1 className="text-2xl text-center mb-4">Login</h1>
        <Box component='form' onSubmit={login} className="bg-white p-8 rounded shadow-md">
          <TextField label="Email " inputRef={email} className="w-full mb-4" variant="outlined" type="email" />
          <TextField label="Password" inputRef={password} className="w-full mb-4" variant="outlined" type="password" />
          <Button type="submit" variant="contained" disabled={isLoading} className="w-full">
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </Box>
      </div>
    </div>
  );
}
