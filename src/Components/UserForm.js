import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {doc, getDoc, updateDoc} from 'firebase/firestore'
import { db } from "../Firebase";

export default function UserForm(type) {
const firstNameRef = useRef("")
const lastNameRef = useRef("")
const emailRef = useRef("")
const passwordRef = useRef("")
const birthDateRef = useRef("")
const id = JSON.parse(localStorage.getItem('user_loged'));
console.log(id)
const ref = doc(db, "users", id)
  const currentDate = new Date().toJSON().slice(0, 10);
  const today = new Date();
  let nameButton = 'Create'
  if (type === 'update'){
    nameButton = 'Update'
  }
  const [userForm, setUserForm] = useState({firstName:"",lastName:'',email:'',birthDate:''})
  const getUserData= async()=>{
    const dataUser = await getDoc(ref)
    console.log(dataUser.data)
  }

  useEffect(()=>{
    if (type ==='view'){
        getUserData()
    }
  },[])
  const minBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const maxBirthDate = new Date(today.getFullYear() -120, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const handleSubmit = async(e) => {
        e.preventDefault();

        const user ={
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value, 
            birthDate: birthDateRef.current.value,
        } 
        if (type === 'create'){
            user = {...user,password: passwordRef.current.value}
        }
        if (type === 'update'){
         await updateDoc(ref, user);
    }}
  return (
    <>
      <Box component="form" className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
        <TextField disabled={type==='view'} label="First Name" defaultValue={user.firstName} inputRef={firstNameRef} variant="outlined" className="mb-4 w-full" />
        <TextField disabled={type==='view'} label="Last Name" defaultValue={user.lastName} inputRef={lastNameRef} variant="outlined" className="mb-4 w-full" />
        <TextField disabled={type==='view'} type={"email"} defaultValue={user.email} inputRef={emailRef} label="Email" variant="outlined" className="mb-4 w-full" />
        <TextField disabled={type==='view'} type={"password"} inputRef={passwordRef} label="Password" variant="outlined" className="mb-4 w-full" />
        {type === 'create' && <TextField type={"password"} inputRef={passwordRef}/>}
        <TextField type={"date"} inputRef={birthDateRef} defaultValue={user.birthDate} value={currentDate}inputProps= {{ min: minBirthDate, max: maxBirthDate }} label="Birth Date" variant="outlined" className="mb-4 w-full"/>
        <Button type={"submit"} onSubmit={handleSubmit} variant="contained" className="bg-primary hover:bg-primary2 text-white w-full">{nameButton}</Button>
      </Box>
    </>
  );
}
