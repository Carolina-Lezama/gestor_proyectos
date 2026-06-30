### Fase 1: Arquitectura e Infraestructura Base (El Cimiento)

Antes de pintar las paredes, necesitamos que la casa no se caiga.

- **Inicialización:** Crear el proyecto con Next.js (App Router) y TypeScript.
- **Entorno Local:** Configurar PostgreSQL.
- **ORM y Migraciones:** Inicializar Prisma y conectar Next.js con el contenedor de Postgres.
- **Diseño del Sistema:** Instalar Tailwind CSS y configurar `shadcn/ui` para tener una paleta de componentes estandarizada (botones, modales, formularios) desde el día uno.

### Fase 2: Modelado de Datos (El Cerebro)

Un PMS vive o muere por su base de datos. Si el esquema de Prisma está mal diseñado, todo el código será un desastre.

- **Entidades Core:** Diseñar los modelos de `User`, `Workspace` (Organizaciones/Equipos), `Project`, `Task` y `Comment`.
- **Relaciones Complejas:** Configurar las relaciones uno-a-muchos y muchos-a-muchos (ej. un usuario pertenece a varios _workspaces_, una tarea tiene múltiples etiquetas).
- **Semilla (Seed):** Escribir un script en Prisma para poblar la base de datos con datos falsos (usuarios de prueba, proyectos aleatorios). Esto es vital para probar la interfaz sin tener que crear todo a mano.

### Fase 3: Autenticación y Control de Acceso (La Seguridad)

Nadie entra al sistema sin permiso, y nadie ve los proyectos de otro equipo.

- **Login/Registro:** Implementar autenticación. Podemos usar NextAuth (Auth.js) o Clerk, que nos resolverá el manejo de sesiones y seguridad de forma impecable.
- **Middleware:** Proteger las rutas de Next.js para que redirijan al login si el usuario no está autenticado.
- **Lógica de Autorización:** Asegurar que las consultas a la base de datos siempre filtren por el `Workspace` actual.

### Fase 4: Operaciones Core y Server Actions (El Motor)

Aquí empezamos a dar vida a la aplicación manejando el estado del servidor.

- **Gestión de Workspaces y Proyectos:** Vistas para crear un nuevo espacio de trabajo e invitar miembros.
- **CRUD de Tareas:** Crear la lógica en el _backend_ (Next.js Server Actions) para crear, leer, actualizar y eliminar tareas de forma segura.
- **Optimistic UI:** Configurar la interfaz para que cuando cambies el nombre de una tarea, se actualice en pantalla al instante mientras hace la petición a la base de datos por detrás.

### Fase 5: La Interfaz Interactiva (La Magia Visual)

El reto técnico de _frontend_ más grande del proyecto.

- **El Tablero Kanban:** Implementar `hello-pangea/dnd` para lograr una experiencia fluida de arrastrar y soltar tareas entre columnas (Por hacer $\rightarrow$ En progreso $\rightarrow$ Completado).
- **Filtros y Búsqueda:** Poder buscar tareas por responsable, estado o etiqueta sin recargar la página (modificando los parámetros de la URL).
- **Notificaciones en Tiempo Real:** (Opcional, pero nivel Senior) Usar _web sockets_ o _polling_ para que, si otro miembro del equipo mueve una tarea, tú lo veas en tu pantalla al instante.

### Fase 6: El Diferenciador Analítico (El "Show-off")

Aquí es donde cruzamos el desarrollo web con el mundo de los datos. Esta fase es la excusa perfecta para aplicar conceptos de _Data Science_ dentro de un producto funcional.

- **Métricas del Proyecto:** Crear un _Dashboard_ con gráficos (usando librerías como Recharts o Tremor) que muestren la velocidad del equipo, tareas completadas por semana y carga de trabajo por usuario.
- **Algoritmo de Predicción:** Construir una función que tome el historial de tareas pasadas y estime la fecha real de finalización de un proyecto en curso, identificando posibles bloqueos.

### Fase 7: Despliegue y Pulido (Lanzamiento)

- **Deploy en Vercel:** Conectar el repositorio de GitHub para despliegues automáticos.
- **Base de datos en la nube:** Migrar de nuestro contenedor local de Docker a un servicio en la nube gestionado como Supabase o Neon DB para producción.
- **Pruebas (Testing):** Escribir tests para asegurar que si un miembro es eliminado de un equipo, no pueda seguir viendo las tareas.

---

# BACK END

Fase 1: Autenticación y Control de Sesiones (El Candado)
Antes de pedirle datos a la base de datos, el sistema necesita saber quién los está pidiendo para aplicar la arquitectura Multi-Tenant que diseñamos.

Paso 1.1: Instalar Auth.js (NextAuth v5). Es el estándar de seguridad en Next.js.

Paso 1.2: Configurar el Adaptador de Prisma. Esto conectará Auth.js con tu tabla User de PostgreSQL automáticamente.

Paso 1.3: Proteger Rutas (Middleware). Crearemos un archivo middleware.ts para que nadie pueda entrar a la carpeta /(dashboard) sin tener una sesión activa, redirigiéndolos a la Landing Page o al Login.

Paso 1.4: Conectar el Login/Register. Haremos que tus formularios visuales de autenticación verifiquen las credenciales contra la base de datos.

Fase 2: React Server Components (Lectura de Datos)
Vamos a reemplazar los datos "quemados" (hardcodeados) de tus pantallas por consultas reales a Prisma.

Paso 2.1: El Layout del Dashboard. Modificaremos el layout.tsx para hacer una consulta await prisma.user.findUnique() y mostrar tu foto real y tu nombre en la barra superior.

Paso 2.2: Directorio de Proyectos. En la vista de Proyectos, cambiaremos el arreglo estático por un await prisma.project.findMany() filtrando solo los proyectos que pertenezcan a tu Workspace.

Paso 2.3: Vista de "Mis Tareas". Consultaremos la tabla Task buscando todas las que tengan tu userId asignado, ordenadas por fecha o prioridad.

Paso 2.4: Vista de Equipo. Leeremos la tabla WorkspaceMember para listar a los colaboradores reales.

Fase 3: Server Actions (Mutaciones y Formularios)
Aquí es donde la magia ocurre para modificar información sin recargar la página. Crearemos funciones asíncronas en nuestra carpeta src/actions/.

Paso 3.1: Actualización de Perfil. Un Server Action que reciba los datos del formulario de Perfil y ejecute prisma.user.update().

Paso 3.2: Gestión del Workspace. Funciones para cambiar el nombre del equipo o agregar nuevos miembros mediante su correo.

Paso 3.3: Creación de Entidades. Acciones para los botones de "Nuevo Proyecto" y "Nueva Tarea" que inserten filas en la base de datos y usen revalidatePath() para actualizar la pantalla al instante.

Fase 4: El Motor del Kanban (La Prueba de Fuego)
Esta es la integración más compleja e interesante del proyecto. Conectaremos la librería de Drag and Drop con la base de datos.

Paso 4.1: Sincronización de Lectura. Inyectar las tareas reales del proyecto de Olist en el estado inicial de @hello-pangea/dnd.

Paso 4.2: Server Action de Movimiento. Crear una función updateTaskStatus(taskId, newStatus, newPosition) que se comunique con Prisma.

Paso 4.3: Optimistic Updates (Actualización Optimista). Configuraremos el tablero para que cuando arrastres una tarjeta, la interfaz se actualice instantáneamente para el usuario, mientras el Server Action se ejecuta en segundo plano (igual que Trello o Jira). Si la base de datos falla por red, la tarjeta regresa a su lugar original.

Usuarios (Nivel 0 - ¡Completado!)

Workspaces / Equipos (Nivel 1 - La raíz de los datos)

Proyectos (Nivel 2 - Pertenecen a un Workspace)

Tareas (Nivel 3 - Pertenecen a un Proyecto y se asignan a un Usuario)

Dashboard, Reportes y Calendario (Nivel 4 - Solo leen y agrupan la información de los niveles anteriores).

La Base de Datos (Prisma): Revisaremos tu archivo schema.prisma para asegurarnos de que la tabla Workspace y la tabla intermedia WorkspaceMember (que define quién es Admin y quién es Invitado) estén bien estructuradas.

El Server Action: Crearemos la función para que puedas crear un nuevo Espacio de Trabajo desde la plataforma.

La Interfaz de Usuario (/workspaces): Haremos una pantalla donde veas las tarjetas de los equipos a los que perteneces, con un botón para "Crear Nuevo Equipo".

El Selector Global: ¿Recuerdas ese botón estático en la barra superior (DashboardTopbar) que dice "Data & Engineering Team"? Lo conectaremos a la base de datos para que el usuario pueda alternar entre sus diferentes equipos en tiempo real.

- **Semilla (Seed):** Escribir un script en Prisma para poblar la base de datos con datos falsos (usuarios de prueba, proyectos aleatorios). Esto es vital para probar la interfaz sin tener que crear todo a mano.

estructurar la lógica para los paneles de estadísticas y gráficos del Dashboard principal.

2. Diseñar el Componente de Formulario (ProfileForm.tsx)
   Qué haremos: Crearemos un Client Component ("use client") con los campos de texto necesarios. Este componente gestionará los estados de carga (el botón dirá "Guardando..." con un spinner) y mostrará mensajes de éxito o error al comunicarse con el Server Action.

Justificación: Al separar el formulario en un componente de cliente, le damos una experiencia interactiva al usuario sin recargar toda la página (SPA feel), reteniendo la usabilidad rápida que hemos construido hasta ahora.

3. El Orquestador de Servidor (/settings/page.tsx)
   Qué haremos: Construiremos la página principal de configuración. Este Server Component leerá el ID del usuario directamente de la sesión, hará una consulta a PostgreSQL para traer sus datos actuales (name, email, phone, city) y se los inyectará al formulario del Paso 2.

Justificación: Esto es lo que se conoce como Server-Side Rendering (SSR) de datos. Al inyectar los datos desde el servidor, el formulario aparecerá pre-llenado en milisegundos, evitando los molestos "parpadeos" o estados de carga vacíos que ocurren cuando se hace con useEffect en React tradicional.

Una vez que terminemos el perfil del usuario, la base estará lista para que en el futuro agreguemos una pestaña de "Configuración del Espacio de Trabajo" (para invitar miembros o cambiar el nombre del equipo).

¿Me das luz verde para comenzar de inmediato con el Paso 1 y 2 y construir el motor de actualización?
