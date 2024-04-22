import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Favourites from '../pages/Favourites';
import Profile from '../pages/Profile';
import ProfileEdit from '../pages/ProfileUpdate';
import Flats from '../pages/Flats';
import Flat from '../pages/Flat';
import FlatEdit from '../pages/FlatEdit';
import Register from '../pages/Register';
import MyFlats from '../pages/MyFlats';
import Users from '../pages/Users';
import MyFavoritesFlats from '../pages/FlatsFavorites';
import Dashboard from '../pages/Home'; // Asegúrate de importar correctamente Home
import { getUserLogged } from "../services/users";

export default function AppRouter() {
    const user = getUserLogged(); // Obtener el usuario actualmente logueado

    // Función que renderiza la ruta solo si el usuario tiene el rol especificado
    const renderRouteForRole = (Component, allowedRoles) => {
        return () => {
            // Si el usuario no está autenticado, redirigirlo al inicio de sesión
            if (!user) {
                return <Navigate to="/" replace />;
            }
            // Si el usuario tiene un rol permitido, renderizar el componente de la ruta
            if (allowedRoles.includes(user.role)) {
                return <Component />;
            } else {
                // Si el usuario no tiene permisos para esta ruta, redirigirlo a una página de acceso denegado
                return <Navigate to="/access-denied" replace />;
            }
        };
    };

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={renderRouteForRole(Dashboard, ['renter', 'landlord', 'admin'])} />
            <Route path="/profile" element={renderRouteForRole(Profile, ['renter', 'landlord', 'admin'])} />
            <Route path="/profile/edit" element={renderRouteForRole(ProfileEdit, ['renter', 'landlord', 'admin'])} />
            <Route path="/favourites" element={renderRouteForRole(Favourites, ['renter'])} />
            <Route path="/flats" element={renderRouteForRole(Flats, ['landlord', 'admin'])} />
            <Route path="/flats/new" element={renderRouteForRole(Register, ['landlord', 'admin'])} />
            <Route path="/my-flats" element={renderRouteForRole(MyFlats, ['landlord', 'admin'])} />
            <Route path="/my-favorites-flats" element={renderRouteForRole(MyFavoritesFlats, ['landlord', 'admin'])} />
            <Route path="/users" element={renderRouteForRole(Users, ['admin'])} />
            <Route path="/flat/:id" element={renderRouteForRole(Flat, ['renter', 'landlord', 'admin'])} />
            <Route path="/flat/edit/:id" element={renderRouteForRole(FlatEdit, ['landlord', 'admin'])} />
            {/* Ruta para la página de acceso denegado */}
            <Route path="/access-denied" element={<p>Acceso denegado</p>} />
        </Routes>
    );
}
