import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Favourites from './Favourites';
import MyFlats from './MyFlats';
import Users from './Users';
import Header from './Header';
import { getUserLogged } from "../services/users";

export default function AppRouter() {
    const user = getUserLogged(); // Obtener el usuario actualmente logueado

    // Función que renderiza la ruta solo si el usuario tiene el rol especificado
    const renderRouteForRole = (Component, allowedRoles) => {
        return () => {
            // Si el usuario no tiene un rol permitido, redirige a la página de inicio
            if (!user || !allowedRoles.includes(user.role)) {
                return <Redirect to="/" />;
            }
            // De lo contrario, renderiza el componente de la ruta
            return <Component />;
        };
    };

    return (
        <Router>
            <Header />
            <Route exact path="/" component={Home} />
            {/* Renderizar las rutas basadas en el rol del usuario */}
            {user && user.role === 'renter' && (
                <>
                    <Route path="/Favourites" render={renderRouteForRole(Favourites, ['renter'])} />
                </>
            )}
            {user && user.role === 'landlord' && (
                <>
                    <Route path="/My-flats" render={renderRouteForRole(MyFlats, ['landlord'])} />
                </>
            )}
            {user && user.role === 'admin' && (
                <>
                    <Route path="/Users" render={renderRouteForRole(Users, ['admin'])} />
                </>
            )}
        </Router>
    );
}
