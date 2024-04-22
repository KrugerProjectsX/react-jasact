import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import * as React from "react";

export default function UserFormProfile({ type, userId }) {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: new Date().toISOString().slice(0, 10),
    });
    const [userLoaded, setUserLoaded] = useState(false);
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const birthDateRef = useRef('');
    const userTypeRef = useRef('landlords');
    const refCreate = collection(db, "users");
    let ref = null;
    
    if (!userId && type !== 'create') {
        userId = JSON.parse(localStorage.getItem('user_logged'));
    }
    if (userId && type !== 'create'){
        ref = doc(db, "users", userId);
    }
    
    const getUserData = async () => {
        const dataUser = await getDoc(ref);
        const responseUser = { ...dataUser.data() };
        setUser(responseUser);
        setUserLoaded(true);
    }
    
    const processData = async () => {
        if (type === 'view' || type === 'update') {
            await getUserData(); 
        } else {
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
            role: userTypeRef.current.value,
        }
        
        if (type === 'create') {
            await addDoc(refCreate, userSend);
        }

        if (type === 'update') {
            await updateDoc(ref, userSend);
        }
    }

    return (
        <Box component={'form'} onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
            {userLoaded ? (
                <>
                    <TextField disabled={type === 'view'} label="First Name" inputRef={firstNameRef} value={user.firstName} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} label="Last Name" inputRef={lastNameRef} value={user.lastName} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} type='email' label='Email' inputRef={emailRef} value={user.email} variant='outlined' className="mb-4 w-full" />
                    <TextField disabled={type === 'view'} label='Birth Date' type='date' inputRef={birthDateRef} value={user.birthDate} variant='outlined' className="mb-4 w-full" />
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        className="w-full mb-5"
                        inputRef={userTypeRef}
                        value={user.role || 'landlords'}
                    >
                        <option key="landlord" value="landlord">landlord</option>
                        <option key="renter" value="renter">renter</option>
                    </TextField>
                    {type !== 'view' && (
                        <Button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-auto block w-32">
                            {type === 'update' ? 'Edit' : 'Create'}
                        </Button>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
}
