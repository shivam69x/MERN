import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isInitiator }) => {
    return (
        <Route
            render={() => {
                return isInitiator ? element : <Navigate to="*" />; // Redirect to unauthorized page
            }}
        />
    );
};

export default ProtectedRoute;