import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export function Admin() {
    const navigate = useNavigate();

     const { user } = useContext(AuthContext);
     if (!user || !user.isAdmin) {
        navigate('/');
     }

     useEffect(() => {
        if (user == null || !user || !user.isAdmin) {
            navigate('/');
         }
    }, [user]);

    return <h2>Админка</h2>
}

export default Admin;