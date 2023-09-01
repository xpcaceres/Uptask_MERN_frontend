import { useState,useEffect } from "react"
import {Link, useParams} from 'react-router-dom'
import clienteAxios from "../config/clienteAxios.jsx"
import Alerta from "../components/Alerta.jsx"

const NuevoPassword = () => {

    const [tokenValido,setTokenValido] = useState(false)
    const [alerta,setAlerta] = useState({})
    const [password,setPassword] = useState('')
    const [passwordModificado,setPasswordModificado] = useState(false)

    const params = useParams()

    const {token} = params

    useEffect(()=>{
      const comprobarToken = async ()=>{
        try {
          await clienteAxios(`/usuarios/olvide-password/${token}`)

          setTokenValido(true)
        } catch (error) {
          setAlerta({
            msg: error.response.data.msg,
            error: true
          })
        }
      }
      comprobarToken()
    },[])

    const {msg} = alerta

    const handleSubmit = async e =>{
        e.preventDefault()

        if(password === '' || password.length < 6){
          setAlerta({
            msg: "El password es Obligatorio",
            error: true
          })
          return
        }

        try {
          const {data} = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password})
          setAlerta({
            msg: data.msg,
            error: false
          })
          setPasswordModificado(true)
          setPassword('')
  
        } catch (error) {
          setAlerta({
            msg: error.response.data.msg,
            error: true
          })
        }
    }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
      Restablece tu password y no pierdas acceso a tus   
      <span className="text-slate-700"> proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta}/>}

      {tokenValido && (
        <form 
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
          > 
          
        <div className="my-5">
          <label 
          htmlFor="password" 
          className=" uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
          <input
          id="password"
          type="password"
          placeholder="Escribe tu nuevo password"
          className="w-full p-3 mt-3 border rounded-xl bg-gray-50"
          value={password}
          onChange={e => setPassword(e.target.value)}
          />
        </div>
        <input
        type="submit"
        value="Guardar Nuevo Password"
        className="bg-sky-700 mb-5 w-full py-3 uppercase font-bold rounded hover:bg-sky-800 transition-colors cursor-pointer"
        />
    </form>
      )}

      {passwordModificado && (
          <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
          >Inicia Sesión
          </Link>
        )}

    </>
  )
}

export default NuevoPassword
