require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
    inquirerMenu, 
    pausa, 
    leerInput, 
    listadoTareasBorrar, 
    confirmar, 
    mostrarListadoChecklist } = require('./helpers/inquire');
const Tareas = require('./models/Tareas');



const main = async() =>{

    let opt = '';

    const tareas = new Tareas();

    const tareasDB  = leerDB();

    if (tareasDB) {
        //Establecer las tareas
        tareas.cargarTareasFromArray( tareasDB );
    }
    

    do{
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                //crear tarea
                const desc = await leerInput('Descripcion : ');
                tareas.crearTarea(desc); 
            break;

            case '2':
                tareas.listadoCompleto();
            break;

            case '3':
                tareas.listarPendientesCompletadas( completadas = true);
            break;

            case '4':
                tareas.listarPendientesCompletadas( completadas = false);
            break;

            case '5': // completado | pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                // console.log(ids)
            break;

            case '6': // Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('¿Está seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
            break;
        
        }

        guardarDB( tareas.listadoArr );

        await pausa();

        
    } while( opt !== '0' );

    

}

main();