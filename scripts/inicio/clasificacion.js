// Función para cargar la clasificación de pilotos
function cargarClasificacionPilotos(targetContainer = '#contenido-clasificacion') {
    $.getJSON("servidor/clasificacion_pilotos.php")
        .done(function (pilotos) {
            const contenidoPilotos = `
                <h2>Clasificación de Pilotos</h2>
                <table class="resultados-tabla clasificacion-tabla"> <!-- Añadida clase clasificacion-tabla -->
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Número</th>
                            <th>Piloto</th>
                            <th>País</th>
                            <th>Equipo</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pilotos.map((piloto, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${piloto.numero}</td>
                                <td>${piloto.nombre}</td>
                                <td>${piloto.pais}</td>
                                <td>${piloto.equipo}</td>
                                <td>${piloto.puntos}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            $(targetContainer).empty().append(contenidoPilotos); // Usar el contenedor dinámico
        })
        .fail(function () {
            toastr.error('Error al cargar la clasificación de pilotos. Por favor, inténtelo de nuevo más tarde.');
        });
}

// Función para cargar la clasificación de equipos
function cargarClasificacionEquipos(targetContainer = '#contenido-clasificacion') {
    $.getJSON("servidor/clasificacion_equipos.php")
        .done(function (equipos) {
            const contenidoEquipos = `
                <h2>Clasificación de Equipos</h2>
                <table class="resultados-tabla clasificacion-tabla"> <!-- Añadida clase clasificacion-tabla -->
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Equipo</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${equipos.map((equipo, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${equipo.equipo}</td>
                                <td>${equipo.puntos}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            $(targetContainer).empty().append(contenidoEquipos); // Usar el contenedor dinámico
        })
        .fail(function () {
            toastr.error('Error al cargar la clasificación de equipos. Por favor, inténtelo de nuevo más tarde.');
        });
}

// Función para cargar los resultados de la última carrera
function cargarUltimaCarrera(targetContainer = '#contenido-clasificacion') {
    $.getJSON("servidor/resultados_ultima_carrera.php")
        .done(function (datos) {
            const contenidoUltimaCarrera = `
                <h2>${datos.gran_premio} - ${datos.fecha}</h2>
                <table class="clasificacion-tabla">
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Número</th>
                            <th>Piloto</th>
                            <th>Equipo</th>
                            <th>Vueltas</th>
                            <th>Tiempo (HH:MM:SS)</th>
                            <th>Estado</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.resultados.map(resultado => `
                            <tr>
                                <td>${resultado.posicion}</td>
                                <td>${resultado.numero}</td>
                                <td>${resultado.piloto}</td>
                                <td>${resultado.equipo}</td>
                                <td>${resultado.vueltas}</td>
                                <td>${resultado.tiempo}</td>
                                <td>${resultado.estado}</td>
                                <td>${resultado.puntos}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            $(targetContainer).empty().append(contenidoUltimaCarrera); // Usar el contenedor dinámico
        })
        .fail(function () {
            toastr.error('Error al cargar los datos de la última carrera. Por favor, inténtelo de nuevo más tarde.');
        });
}

// Función principal para inicializar la clasificación
function inicializarClasificacion() {
    // Verificar si el CSS `resultados.css` está cargado
    if ($("head link[href='css/resultados.css']").length > 0) {
        // Eliminar únicamente el CSS `resultados.css`
        $("head link[href='css/resultados.css']").remove();
    }

    // Agregar el CSS `clasificacion.css` si no está cargado
    if ($("head link[href='css/clasificacion.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/clasificacion.css">');
    }

    // Sección de clasificación de pilotos y equipos
    $('main').append('<section id="clasificacion"></section>');
    const clasificacionSection = $('#clasificacion');

    // Agregar el nuevo nav de tres elementos
    const navClasificacion = $('<nav id="nav-clasificacion"></nav>').appendTo(clasificacionSection);
    const navItemsClasificacion = [
        { name: 'ÚLTIMO GP', id: 'nav-last-race' },
        { name: 'PILOTOS', id: 'nav-drivers' },
        { name: 'EQUIPOS', id: 'nav-teams' }
    ];

    // Añadir los botones de navegación
    navItemsClasificacion.forEach(item => {
        $('<button>', { id: item.id }).text(item.name).appendTo(navClasificacion);
    });

    // Contenedor para el contenido dinámico
    clasificacionSection.append('<div id="contenido-clasificacion"></div>');

    // Manejar clics en las secciones de "LAST RACE", "DRIVERS" y "TEAMS"
    $(document).on('click', '#nav-last-race', function (e) {
        e.preventDefault();
        cargarUltimaCarrera(); // Usa el contenedor por defecto
        setActiveNavItem('#nav-last-race');
    });

    $(document).on('click', '#nav-drivers', function (e) {
        e.preventDefault();
        cargarClasificacionPilotos(); // Usa el contenedor por defecto
        setActiveNavItem('#nav-drivers');
    });

    $(document).on('click', '#nav-teams', function (e) {
        e.preventDefault();
        cargarClasificacionEquipos(); // Usa el contenedor por defecto
        setActiveNavItem('#nav-teams');
    });

    // Función para actualizar el estado activo del elemento del menú
    function setActiveNavItem(activeId) {
        $('#nav-clasificacion button').removeClass('active');
        $(activeId).addClass('active');
    }

    // Cargar por defecto la sección de "Último GP"
    cargarUltimaCarrera();
    setActiveNavItem('#nav-last-race');
}