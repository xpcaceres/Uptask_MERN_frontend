import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client'

let socket;

const ProyectosContext = createContext();
const ProyectosProvider = ({children})=>{

    const [proyectos, setProyectos] = useState([]);
    const [alerta,setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea,setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate();

    const {auth} = useAuth()

//PARA TRAERNOS LOS PROYECTOS DEL USUARIO QUE SE ACABA DE AUTENTICAR
    useEffect(()=>{
        const obtenerProyectos = async ()=>{
            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    },[auth])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
    },[])


    const mostrarAlerta = alerta =>{
        setAlerta(alerta)
        setTimeout(()=>{
            setAlerta({})
        }, 5000)
    }

    const submitProyecto = async proyecto =>{

        if(proyecto.id){
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }

    }
    
    const editarProyecto = async proyecto =>{
        console.log('EDITANDO...')
        
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers: {
                    "content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            //Sincronizar el State
             const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
             setProyectos(proyectosActualizados);
            //Mostrar una alerta de Cambios realizados con exito
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })
            //Redireccionar
            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },3000)
        } catch (error) {
            console.log(error)
        }
        
    }

    const nuevoProyecto = async proyecto =>{
        console.log('CREANDO...')

        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers: {
                    "content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos', proyecto, config)

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setProyectos([...proyectos, data])


            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },3000)

        } catch (error) {
            console.log(error)
        }
        
    }

    const obtenerProyecto = async id =>{
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config ={
                headers: {
                    "content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg:error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }finally{
            setCargando(false)
        }
        
        
    }

    const eliminarProyecto = async id =>{
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            const {data} = await clienteAxios.delete(`proyectos/${id}`,config)

            //Sincronizar el State
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error:false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },3000)
            
          } catch (error) {
            console.log(error)
          }
    }

    const handleModalTarea = ()=>{
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea =>{
        if(tarea?.id){
            await editarTarea(tarea)
        }else{
            await crearTarea(tarea)
        }        
    }
    const crearTarea = async tarea =>{
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const {data} = await clienteAxios.post('/tareas', tarea, config)

               //resetear todo
               setAlerta({})
               setModalFormularioTarea(false)
               
               //SOCKET IO
               socket.emit('nueva tarea',data)

        } catch (error) {
            console.log(error)
        }
    }
    const editarTarea = async tarea =>{
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`,tarea,config)    
            
            setModalFormularioTarea(false)

            //SOKET IO
            socket.emit('actualizar tarea', data)

            setAlerta({})
        } catch (error) {
           console.log(error) 
        }
    }
    const handleModalEditarTarea = tarea =>{
        setTarea(tarea)
        setModalFormularioTarea(true)
    }
    const handleModalEliminarTarea = tarea =>{
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }
    const elimminarTarea = async () =>{

        try {
            
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)//bien

            setAlerta({
                msg: data.msg,
                error: false
            })               
            setModalEliminarTarea(false)

            //SOCKET IO
            socket.emit('eliminar tarea',tarea)

            setTarea({})
            setTimeout(()=>{
                setAlerta({})
               }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email =>{
        setCargando(true)
       try {
        
        const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

            const {data} = await clienteAxios.post('/proyectos/colaboradores',{email},config) 
            setColaborador(data)
            setAlerta({})    
       } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
       }
       setCargando(false)
    }

    const agregarColaborador = async email =>{

       try {
        const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
        const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`,email,config) 
        setAlerta({
            msg: data.msg,
            error: false
        })
        setColaborador({})
        //setAlerta({})

       } catch (error) {
        setAlerta({
            msg:error.response.data.msg,
            error:true
        })
       }
       setTimeout(() => {
        setAlerta({})
       }, 3000);
    }

    const handleModalEliminarColaborador = colaborador =>{
        setModalEliminarColaborador(!modalEliminarColaborador)

        setColaborador(colaborador)
    }   

    const elimminarColaborador = async () =>{
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{id: colaborador._id},config)
            
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter
            (colaboradorState => colaboradorState._id !== colaborador.id)

            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
        } catch (error) {
            console.log(error.response)
        }
        setTimeout(() => {
            setAlerta({})
           }, 3000);
    }

    const completarTarea = async id =>{
        try {
            const token = localStorage.getItem('token')
                if(!token) return
    
                const config ={
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            
            setTarea({})
            setAlerta({})

            //SOCKET IO
            socket.emit('completar tarea', data)

        } catch (error) {
           console.log(error.response) 
        }
    }
    const handleBuscador = ()=>{
        setBuscador(!buscador)
    }

    //FUNCIONES PARA SOCKET IO
    const submitTareasProyecto = (tarea) => {
        //Agregar la tarea al State
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

        setProyecto(proyectoActualizado)
    }

    const eliminarTareasProyecto = (tarea) =>{
        //Obtener una copia del proyecto
        const proyectoActualizado = {...proyecto}
        //Actualizar el DOM
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState =>tareaState._id !== tarea._id)//bien
        //DOM actualizado 
        setProyecto(proyectoActualizado)
    }
    const editarTareasProyecto = tarea =>{
        //Actualizar el DOM
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
        //DOM actualizado
    }
    const completarTareasProyecto = tarea =>{
        const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => 
                tareaState._id === tarea._id ? tarea : tareaState)
            setProyecto(proyectoActualizado)
    }
    const cerrarSesionProyectos = ()=>{
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return(
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                elimminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                elimminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareasProyecto,
                editarTareasProyecto,
                completarTareasProyecto,
                cerrarSesionProyectos
            }}
        > {children}
        </ProyectosContext.Provider>
    )
}
export {
    ProyectosProvider
}
export default ProyectosContext
