import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import "./Admin.css";
import AdminItems from './AdminItems';
import AdminCategories from "./AdminCategories";

export function Admin() {
   const navigate = useNavigate();

   const { user, token } = useContext(AuthContext);

   useEffect(() => {
      if (user == null || !user || !user.isAdmin) {
         navigate('/');
      }
   }, [user]);

   return (
      <>
      <AdminItems      token={token}/>
      <AdminCategories token={token}/>
      </>
      
   );
}

export default Admin;