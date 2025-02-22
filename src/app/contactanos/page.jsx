"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Notificacion } from "@/componentes/notificacionRestrablecer/notificaciones.jsx";
import stylesContactanos from "../CSS/styles-contactanos.module.css";

const Contactanos = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const [contactInfo, setContactInfo] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [usuario, setUsuario] = useState();
  const [imagen, setImagen] = useState();
  const [nombreImagen, setNombreImagen] = useState();
  const [perfilCerrado, setPerfilCerrado] = useState(false);
  const [description, setDescription] = useState("");
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [descriptions, setDescriptions] = useState([]);
  const [correoNoValido, setCorreoNoValido] = useState(false);
  const [mensajeCorreoAceptado, setMensajeCorreoAceptado] = useState(false);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [estatusActivo, setEstatusActivo] = useState(false);
  const [nombreDeUsuario, setNombreDeUsuario] = useState("");
  if (correoNoValido) {
    setTimeout(() => {
      setCorreoNoValido(false);
    }, 4000);
  }

  useEffect(() => {
    const obtenerPerfil = async () => {
      if (perfilCerrado) return;
      try {
        const respuesta = await axios.get("../API/perfil");
        const usuarioActivo = respuesta.data.sesionUsuario;
        setUsuario(usuarioActivo);
        console.log(usuarioActivo.idRol);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerPerfil();
  }, [perfilCerrado]);
  useEffect(() => {
    obtenerContactInfo();
  }, []);

  useEffect(() => {
    if (usuario) {
      const nombreCompleto = usuario.nombreCompletoUsuario || "";
      const nombreApellido = nombreCompleto.split(" ");
      setNombreDeUsuario(
        `${nombreApellido[0] || ""} ${nombreApellido[2] || ""}`
      );
    }
  }, [usuario]);

  const cerrarPerfil = async () => {
    try {
      await axios.get("../API/cerrarPerfil");
      setPerfilCerrado(true);
    } catch (error) {
      console.log(error);
    } finally {
      router.push("/");
    }
  };

  const contactos = [
    { id: 10, red: "correo_electronico", valor: "epicomputers@gmail.epic.com" },
    { id: 11, red: "telefono", valor: "+58 20242024202420242024" },
    { id: 12, tipo: "instagram", valor: "https://instagram.com/@epicomputers" },
    {
      id: 13,
      red: "facebook",
      valor: "https://facebook.com/perfil/epicomputers",
    },
    { id: 14, red: "X", valor: "https://x.com/perfil/epicomputers" },
  ];

  const obtenerContactInfo = async () => {
    try {
      const response = await axios.get("../API/contacto");
      console.log(response.data);
      setContactInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerContactInfo();
  }, []);

  const [nuevoValor, setNuevoValor] = useState([]);

  const handleChange = (event, id) => {
    // Obtén el valor del target del evento
    const newValue = event.target.value;

    // Busca el índice del objeto con el id especificado
    const index = contactInfo.findIndex((contact) => contact.id_option === id);

    // Verifica si se encontró el objeto
    if (index !== -1) {
      // Actualiza directamente el objeto en el array original
      contactInfo[index].contenido = newValue;

      // Recupera solo el elemento modificado usando slice
      const modifiedElement = contactInfo.slice(index, index + 1);
      setNuevoValor(modifiedElement[0]); // Imprime el elemento modificado
    } else {
      console.log("Elemento no encontrado");
    }
  };

  const handleSave = async () => {
    try {
      console.log(nuevoValor);
      await axios.put("../API/contacto", { nuevoValor });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const enviarDatos = async (datos) => {
    const { nombre, asunto, mensaje, correo, telefono } = datos;
    console.log(correo);
    try {
      const respuesta = await axios.post("../API/authContacto", {
        nombre,
        asunto,
        mensaje,
        correo,
        telefono,
      });
      console.log(respuesta);

      const datos = respuesta.data;

      if (!datos) {
        return;
      }
      if (datos.resultadoFiltrado.length === 0) {
        return setCorreoNoValido(true);
      }
      if (respuesta) {
        setUsuarioRegistrado(true);
        setEstatusActivo(true);
        setMensajeCorreoAceptado(true);
      }
      setEmail(datos.resultadoFiltrado[0].correo_electronico);

      setPasoFormulario(pasoFormulario + 1);
      if (respuesta.status < 200 || respuesta.status >= 300) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setUsuarioRegistrado(false);
        setEstatusActivo(false);
        setMensajeCorreoAceptado(false);
      }, 4000);
    }
  };

  return (
    <>
      <head>
        <title>Contáctanos - EpíComputers</title>
        <link rel="icon" href="./IMG/IconoNoLineal.png" />
      </head>
      <body id={stylesContactanos.body}>
        <header className={stylesContactanos.header}>
          <Link href="/" className={stylesContactanos.enlaceNormal}>
            <h1 className={stylesContactanos.tituloHeader}>EpíComputers</h1>
          </Link>
          <section
            className={`${stylesContactanos.seccionEnlace} ${stylesContactanos.seccionEnlaceAumentada}`}
          >
            <Link className={stylesContactanos.enlace} href="/noticias">
              Noticias
            </Link>
            <Link className={stylesContactanos.enlace} href="/sobre_nosotros">
              Sobre Nosotros
            </Link>
            <Link className={stylesContactanos.enlace} href="/contactanos">
              Contáctanos
            </Link>
          </section>
          <section className={stylesContactanos.seccionEnlace}>
            {usuario ? (
              <>
                <Link
                  href="/perfil"
                  className={`${stylesContactanos.enlace} ${stylesContactanos.usuarioPerfil}`}
                  style={{ border: "none" }}
                >
                  <Image
                    className={stylesContactanos.imagenes}
                    width={35}
                    height={20}
                    src={usuario?.fotoPerfil || "/IMG/epigrafe73.png"}
                    alt={nombreImagen || "Imagen de Perfil Por Defecto"}
                  />
                  <section style={{ wordBreak: "keep-all" }}>
                    <section>{nombreDeUsuario}</section>
                    <section>{usuario.correoElectronicoDeUsuario}</section>
                  </section>
                </Link>
                <button
                  className={`${stylesContactanos.enlace} ${stylesContactanos.usuarioPerfil}`}
                  onClick={cerrarPerfil}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  className={stylesContactanos.enlace}
                  href="/iniciar_sesion"
                >
                  Iniciar Sesión
                </Link>
                <Link className={stylesContactanos.enlace} href="/registro">
                  Registrarse
                </Link>
              </>
            )}
          </section>
        </header>
        <main className={stylesContactanos.mainPrincipal}>
          <section className={stylesContactanos.main}>
            {usuario && (
              <section
                className={stylesContactanos.seccionSecundaria}
                style={{
                  width: "50rem",
                  height: "82vh",
                  margin: "0 1rem",
                  overflowY: "auto",
                }}
              >
                <section className={stylesContactanos.seccionAjustes}>
                  <h1 style={{ textAlign: "center", marginBottom: "4%" }}>
                    Contáctanos
                  </h1>

                  <section>
                    <>
                      <form onSubmit={handleSubmit(enviarDatos)}>
                        <h3 style={{ marginBottom: "4%" }}>
                          Nombre y Apellido:{" "}
                          <input
                            type="text"
                            className={`${stylesContactanos.input_texto} rounded-2`}
                            name="nombre"
                            {...register("nombre", {
                              required: "El nombre es requerido",
                            })}
                          />
                          {errors.nombre && (
                            <p style={{ color: "red" }}>
                              {errors.nombre.message}
                            </p>
                          )}
                        </h3>
                        <h3 style={{ marginBottom: "4%" }}>
                          Asunto:{" "}
                          <input
                            type="text"
                            className={`${stylesContactanos.input_texto} rounded-2`}
                            name="asunto"
                            {...register("asunto", {
                              required: "El asunto es requerido",
                            })}
                          />
                          {errors.asunto && (
                            <p style={{ color: "red" }}>
                              {errors.asunto.message}
                            </p>
                          )}
                        </h3>
                        <h3 style={{ marginBottom: "4%" }}>
                          Mensaje:{" "}
                          <textarea
                            name="mensaje"
                            className={`${stylesContactanos.input_texto} rounded-2`}
                            {...register("mensaje", {
                              required: "El mensaje es requerido",
                            })}
                          />
                          {errors.mensaje && (
                            <p style={{ color: "red" }}>
                              {errors.mensaje.message}
                            </p>
                          )}
                        </h3>
                        <h3 style={{ marginBottom: "4%" }}>
                          Su Correo Electrónico:{" "}
                          <input
                            type="email"
                            className={`${stylesContactanos.input_texto} rounded-2`}
                            name="correo"
                            {...register("correo", {
                              required: "El correo electrónico es requerido",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                message:
                                  "El formato del correo electrónico no es válido",
                              },
                            })}
                          />
                          {correoNoValido && (
                            <p style={{ color: "red" }}>
                              El Correo Electrónico No Esta Registrado
                            </p>
                          )}
                          {errors.correo && (
                            <p style={{ color: "red" }}>
                              {errors.correo.message}
                            </p>
                          )}
                        </h3>
                        <h3 style={{ marginBottom: "4%" }}>
                          Teléfono:{" "}
                          <input
                            type="number"
                            className={`${stylesContactanos.input_texto} rounded-2`}
                            name="telefono"
                            {...register("telefono", {
                              required: "El teléfono es requerido",
                              pattern: {
                                value: /^[0-9]+$/,
                                message:
                                  "El teléfono solo debe contener números",
                              },
                            })}
                          />
                          {errors.telefono && (
                            <p style={{ color: "red" }}>
                              {errors.telefono.message}
                            </p>
                          )}
                        </h3>
                        <button type="submit" style={{ marginTop: "10px" }}>
                          Enviar Correo
                        </button>
                      </form>
                      {mensajeCorreoAceptado && (
                        <Notificacion
                          usuarioRegistrado={usuarioRegistrado}
                          estatusActivo={estatusActivo}
                        />
                      )}
                    </>
                  </section>
                </section>
              </section>
            )}
            <section
              className={stylesContactanos.seccionSecundaria}
              style={{
                width: "50rem",
                height: "82vh",
                margin: "0 1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <section className={stylesContactanos.seccionAjustes}>
                <h1 style={{ textAlign: "center", marginBottom: "4%" }}>
                  Nuestras Redes Sociales
                </h1>
                <section>
                  {isEditing &&
                  usuario?.idRol !== 2 &&
                  usuario?.idRol !== 3 &&
                  usuario !== undefined ? (
                    <>
                      <h3 style={{ marginBottom: "4%" }}>
                        Correo Electrónico:{" "}
                        <input
                          type="text"
                          name="correo"
                          defaultValue={contactInfo[0]?.contenido}
                          onChange={() => handleChange(event, 9)}
                        />
                      </h3>
                      <h3 style={{ marginBottom: "4%" }}>
                        Teléfono:{" "}
                        <input
                          type="text"
                          name="telefono"
                          value={contactInfo[1]?.contenido}
                          defaultValue={() => handleChange(event, 10)}
                        />
                      </h3>
                      <h3 style={{ marginBottom: "4%" }}>
                        Instagram:{" "}
                        <input
                          type="text"
                          name="instagram"
                          defaultValue={contactInfo[2]?.contenido}
                          onChange={() => handleChange(event, 11)}
                        />
                      </h3>
                      <h3 style={{ marginBottom: "4%" }}>
                        Facebook:{" "}
                        <input
                          type="text"
                          name="facebook"
                          defaultValue={contactInfo[3]?.contenido}
                          onChange={() => handleChange(event, 12)}
                        />
                      </h3>
                      <h3>
                        X [Former Twitter]:{" "}
                        <input
                          type="text"
                          name="x"
                          defaultValue={contactInfo[4]?.contenido}
                          onChange={() => handleChange(event, 13)}
                        />
                      </h3>
                      <button
                        onClick={handleSave}
                        style={{ marginTop: "10px" }}
                      >
                        Guardar Cambios
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 style={{ marginBottom: "4%" }}>
                        Correo Electrónico: {contactInfo[0]?.contenido}
                      </h3>
                      <h3 style={{ marginBottom: "4%" }}>
                        Teléfono: {contactInfo[1]?.contenido}
                      </h3>
                      <h3 style={{ marginBottom: "4%" }}>
                        Instagram:{" "}
                        <Link
                          href={`${contactInfo[2]?.contenido}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {contactInfo[2]?.contenido}
                        </Link>
                      </h3>
                      <h3 style={{ marginBottom: "4%" }}>
                        Facebook:{" "}
                        <Link
                          href={`${contactInfo[3]?.contenido}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {contactInfo[3]?.contenido}
                        </Link>
                      </h3>
                      <h3>
                        X [Former Twitter]:{" "}
                        <Link
                          href={`${contactInfo[4]?.contenido}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {contactInfo[4]?.contenido}
                        </Link>
                      </h3>
                      {usuario?.idRol !== 2 &&
                        usuario?.idRol !== 3 &&
                        usuario !== undefined && (
                          <button
                            onClick={() => setIsEditing(true)}
                            style={{ marginTop: "10px" }}
                          >
                            Editar
                          </button>
                        )}
                    </>
                  )}
                </section>
              </section>
            </section>
          </section>
        </main>
      </body>
    </>
  );
};

export default Contactanos;
