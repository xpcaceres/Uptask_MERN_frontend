import { useState, useEffect,createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({children})=>{

    const [auth,setAuth] = useState({})
    const [cargando,setCargando] = useState(true)

    const navigate = useNavigate()

    useEffect(()=>{
       const autenticarUsuario = async ()=>{
        const token = localStorage.getItem('token')
        if(!token){
            setCargando(false)
            return
        }

        const config = {
            headers:{
                "Content-Type": "application",
                Authorization: `Bearer ${token}`
            }
        }

        try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                //TODO: Opcional para no estarse autenticando cada vez que ingresa a la pagina (solo mientras dure el token)
               // navigate('/proyectos')
        } catch (error) {
            setAuth({})
        }
        
            setCargando(false)
        
       }
       autenticarUsuario()
    }, [])

    const cerrarSesionAuth = ()=>{
        setAuth({})
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;