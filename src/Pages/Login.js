import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { useRef } from "react";
import {db} from '../Firebase'
import {getDocs, collection, query, where, getFirestore} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom'
import {isProgress, setIsProgress} from 

export default function Login(){
    const email = useRef("");
    const password = useRef("");
    const usersRef = collection(db, 'users');
    const navigate = useNavigate()

    const Login = async(e) => {
        e.preventDefault();
        setIsProgress(true)
        console.log(email.current.value, password.current.value)
        const search = query(usersRef, where('email', '==', email.current.value));
        const result = await getDocs(search);
        if (result.docs.length >0){
            const user = result.docs[0].data()
            const user_id = result.docs[0].id
            if(user.password === password.current.value){
                console.log('Login success');
                console.log('Redirect')
                localStorage.setItem('user_logged', JSON.stringify(user_id))
                setIsProgress(false)
                navigate('/dashboard', {replace: true})
            }else{
                console.log('Email/Password incorrect')
                setIsProgress(false)
            }
        }else{
            console.log('Email/Password incorrect')
            setIsProgress(false)
        }
        setIsProgress(false)
        }

    return(
        <div>
            <h1>Login</h1>
            <Box component='form' onSubmit={Login}>
                <TextField label="Email " inputRef={email} className={"w-full"} variant="outlined" type="email"></TextField><br/>
                <TextField label="Password" inputRef={password} className={"w-full my-4"} variant="outlined" type="password"></TextField><br/>
                <Button type="submit" disabled={isProgress} variant="contained">Login</Button>
            </Box>
        </div>
    );
}