import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate ,Outlet} from "react-router-dom";


const  ProtectedRoute=({isAdmin,Component : Component, ...rest})=>{

  const {loading ,isAuthenticated,user}=useSelector((state)=> state.user);

    return (
    <Fragment>
        {loading===false && (
            <Outlet
            {...rest}
            render={(props)=>{
                if(isAuthenticated === false){
                    return <Navigate to="/login" />
                }
                if(isAdmin==true && user.role!=="admin"){
                  return <Navigate to="/login" />
                }
                return <Component {...props} />
            }}
            />
        )}
    </Fragment>
  )
}

export default ProtectedRoute;
