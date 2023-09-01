import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios.jsx"

const Registrar = () => {

  const [nombre, setNombre] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [repetirPassword, setRepetirPassword] = useState("")
  const [alerta,setAlerta] = useState({})

  const handleSubmit = async e =>{
    e.preventDefault();
    if([nombre,email,password,repetirPassword].includes('')){
      setAlerta({
        msg: "Todos los Campos son obligatorios",
        error: true,
      })
      return
    }
    if(password !== repetirPassword){
      setAlerta({
        msg: "Los password No son iguales",
        error: true,
      })
      return
    }
    if(password.length < 6){
      setAlerta({
        msg: "El password es muy corto, agrega minimo 6 caracteres",
        error: true,
      })
      return
    }
    setAlerta({})

    //CREAR EL USUARIO EN LA API
    try {
      //Se movio la url hacia un cliente Axios
      const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password})
      setAlerta({
        msg: data.msg,
        error: false
      })
      //Resetear el formulario
      setNombre('')
      setemail('')
      setpassword('')
      setRepetirPassword('')

      
    } catch (error) {
      setAlerta({
        msg:error.response.data.msg,
        error: true
      })
    }
  }

  const {msg} = alerta

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">
      Crea tu Cuenta y administra tus   
      <span className="text-slate-700"> proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta}/>}

      <form 
      className="my-10 bg-white shadow rounded-lg p-10"
      onSubmit={handleSubmit}
      > 
          <div className="my-5">
            <label 
            htmlFor="nombre" 
            className=" uppercase text-gray-600 block text-xl font-bold">Nombre</label>
            <input
            id="nombre"
            type="text"
            placeholder="Escribe tu nombre"
            className="w-full p-3 mt-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            />
          </div>
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
            onChange={e => setemail(e.target.value)}
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
            onChange={e => setpassword(e.target.value)}
            />
          </div>
          <div className="my-5">
            <label 
            htmlFor="password2" 
            className=" uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
            <input
            id="password2"
            type="password"
            placeholder="Repite tu clave"
            className="w-full p-3 mt-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}
            />
          </div>
          <input
          type="submit"
          value="Crear Cuenta"
          className="bg-sky-700 mb-5 w-full py-3 uppercase font-bold rounded hover:bg-sky-800 transition-colors cursor-pointer"
          
          />
      </form>
      <nav className="lg:flex lg:justify-between">
          <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
          >Ya tienes una Cuenta? Inicia Sesión
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

export default Registrar
