import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {doc, updateDoc, getDoc, collection, addDoc} from "firebase/firestore";
import { db } from "../firebase";
import * as React from "react";


export default function UserForm2({ type, userId}) {
    const currentDate = new Date().toJSON().slice(0, 10);

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: currentDate
    });
    const [userLoaded, setUserLoaded] = useState(false);
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const birthDateRef = useRef('');
    const userTypeRef = useRef('landlords');
    const refCreate = collection(db, "users");
    let  ref = null;
    if (userId == null && type !== 'create') {
         userId = JSON.parse(localStorage.getItem('user_logged'));
    }
    if ( userId && type !== 'create'){
        ref = doc(db, "users", userId);
    }
    
    const today = new Date();
    const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    let nameButton = 'Create';
    if (type === 'update') {
        nameButton = 'Update'
    }
    const getUserData = async () => {
        const dataUser = await getDoc(ref);
        const responseUser = { ...dataUser.data() };
        setUser(responseUser);
        setUserLoaded(true);
    }
    const processData = async () => {
        if (type === 'view' || type === 'update'){
            await getUserData(); 
        }else{
            setUserLoaded(true); 
        }
    }
    useEffect(() => {
        processData();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let userSend = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            birthDate: birthDateRef.current.value,
            role: userTypeRef.current.value
        }
        
        if (type === 'create') {
            userSend = { ...userSend, password: passwordRef.current.value }
            await addDoc(refCreate, userSend);
            
        }

        if (type === 'update') {
            await updateDoc(ref, userSend);
        }
    }
    console.log(user)
    return (
        <Box component={'form'} onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
            {userLoaded ? (
                <>
                    <TextField disabled={type === 'view'} label="First Name" inputRef={firstNameRef} defaultValue={user.firstName} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} label="Last Name" inputRef={lastNameRef} defaultValue={user.lastName} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} type='email' label='Email' inputRef={emailRef} defaultValue={user.email} variant='outlined' className="mb-4 w-full" />
                    {type === 'create' && <TextField type={'password'} label='Password' inputRef={passwordRef} variant='outlined' className="mb-4 w-full" />}
                    <TextField disabled={type === 'view'} label='Birth Date' type='date' inputRef={birthDateRef} inputProps={{ min: maxBirthDate, max: minBirthDate }} defaultValue={user.birthDate} variant='outlined' className="mb-4 w-full" />
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-full mb-5"
                        inputRef={userTypeRef}
                    >
                        <option key="landlord" value="landlord">landlord</option>
                        <option key="renter" value="renter">renter</option>
                    </TextField>
                    {type !== 'view' && <Button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{nameButton}</Button>}
                    
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
}