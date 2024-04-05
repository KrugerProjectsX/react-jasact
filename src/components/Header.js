import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuTransitions from "./MenuTransitions";
import { Link } from 'react-router-dom'; // Importa el componente Link
import { getUser, getUserLogged } from "../services/users";
import jasactImage from "../assets/jasact.png"; // Importa la imagen

export default function Header() {
    const [user, setUser] = useState(null);

    const processData = async () => {
        await getUserData();
    }

    const getUserData = async () => {
        const responseUser = await getUserLogged();
        setUser(responseUser);
    }

    useEffect(() => {
        processData();
    }, [])

    return (
        <div>
            <AppBar position="static">
                <Toolbar className={'bg-white'}>
                    <div className={'flex items-center m-4'}>
                        <Link to="/dashboard">
                            <img src={jasactImage} alt="JASACT" className="pointer-events-none my-auto w-24 lg:w-40 md:w-32" />
                        </Link>
                    </div>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                    <div className={'flex items-center justify-center mr-2'}>
                        {/* Utiliza el componente Link para redirigir a las direcciones */}
                        <Link to="/dashboard" className={'text-secondary'}>
                            <Button>Home</Button>
                        </Link>
                        {user && (user.role === 'landlord' || user.role === 'admin') && 
                            <Link to="/My-flats" className={'text-secondary'}>
                                <Button>My Flats</Button>
                            </Link>
                            
                        }
                        {user && (user.role === 'landlord' || user.role === 'admin') && 
                            <Link to="/flats/new" className={'text-secondary'}>
                                <Button>New flat</Button>
                             </Link>
                            
                        }
                        <Link to="/my-favorites-flats" className={'text-secondary'}>
                            <Button>Favourites</Button>
                        </Link>

                        
                        {user && user.role === 'admin' && 
                            <Link to="/Users" className={'text-secondary'}>
                                <Button>Users</Button>
                            </Link>
                        }
                    </div>
                    <MenuTransitions user={user} setUser={setUser} />
                </Toolbar>
            </AppBar>
        </div>
    );
}
