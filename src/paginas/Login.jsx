import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [alerta,setAlerta] = useState({})

  const {setAuth} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault()

    if([email,password].includes('')){
      setAlerta({
        msg: "Todos los Campos son Obligatorios",
        error: true
      });
      return
    }

    try {
      const {data} = await clienteAxios.post('/usuarios/login', {email,password})
      setAlerta({})
      localStorage.setItem('token',data.token)
      setAuth(data)
      navigate('/proyectos')
    } catch (error) {
      console.log(error)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      });
    }
  }

  const {msg} = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Inicia Sesión y administra tus   
        <span className="text-slate-700"> proyectos</span>
        </h1>

        {msg && <Alerta alerta={alerta}/> }

        <form 
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        > 
            <div className="my-5">
              <label 
              htmlFor="email" 
              className=" uppercase text-gray-600 block text-xl font-bold">Email</label>
              <input
              id="email"
              type="email"
              placeholder="Email del Proyecto"
              className="w-full p-3 mt-3 border rounded-xl bg-gray-50"
              value={email}
              onChange={ e => setEmail(e.target.value)}
              />
            </div>
            <div className="my-5">
              <label 
              htmlFor="password" 
              className=" uppercase text-gray-600 block text-xl font-bold">Password</label>
              <input
              id="password"
              type="password"
              placeholder="Coloca tu clave"
              className="w-full p-3 mt-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={ e => setPassword(e.target.value)}
              />
            </div>
            <input
            type="submit"
            value="Iniciar Sesión"
            className="bg-sky-700 mb-5 w-full py-3 uppercase font-bold rounded hover:bg-sky-800 transition-colors cursor-pointer"
            />
        </form>
        <nav className="lg:flex lg:justify-between">
            <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/registrar"
            >No tienes una Cuenta? Registrate
            </Link>
            <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/olvide-password"
            >Olvide mi Password
            </Link>
        </nav>
    </>
  )
}

export default Login
