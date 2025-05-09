function claseEquipo(nombreEquipo) {
    const colores = {
        'Red Bull Racing': '--red-bull-racing',
        'Mercedes-AMG Petronas Formula One Team': '--mercedes',
        'Scuderia Ferrari': '--ferrari',
        'McLaren F1 Team': '--mclaren',
        'Alpine F1 Team': '--alpine',
        'Racing Bulls': '--racing-bulls',
        'Aston Martin Aramco Cognizant Formula One Team': '--aston-martin',
        'Williams Racing': '--williams',
        'Kick Sauber': '--kick-sauber',
        'Haas F1 Team': '--haas'
    };
    // Si el equipo no tiene un color definido, usa un color alternativo por defecto
    return colores[nombreEquipo] || '--historico';
}

function inicializarEquipos() {
    if ($("head link[href='css/equipos.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/equipos.css">');
    }

    $.getJSON('servidor/getEquipos.php')
        .done(function (equipos) {
            console.log(equipos);
            let equiposHtml = `<div class="equipHeader">
                                    <p>Equipos de la Fórmula 1:</p>
                                </div>
                                <div class="filtrosEquipo"> 
                                    <input type="text" id="filtroNombre" placeholder="Buscar equipo..." />
                                    <select id="filtroPais">
                                        <option value="">Todos los países</option>
                                    </select>
                                    <select id="filtroEstado">
                                        <option value="">Todos los equipos</option>
                                        <option value="activo">En Activo (2025)</option>
                                        <option value="historico">Históricos</option>
                                    </select>
                                </div>
                                <div class="equipos-container" id="equiposContainer">`;

            equipos.forEach((equipo, index) => {
                const colorVar = claseEquipo(equipo.nombre);
                equiposHtml += `
                <div class="equipo-card" style="--team-color: var(${colorVar});" 
                    data-id="${equipo.equipo_id}" 
                    data-nombre="${equipo.nombre.toLowerCase()}"
                    data-pais="${extraerPais(equipo.base).toLowerCase()}"
                    data-estado="${equipo.estado.toLowerCase()}">
                    <a href="#" class="equipo-link" data-id="${equipo.equipo_id}">${equipo.nombre}</a>
                </div>
            `;
            });

            equiposHtml += '</div>';

            $('main').html(equiposHtml);

            inicializarFiltroNombre(); // Inicializar el filtro de búsqueda
            inicializarFiltroPais(equipos); // Pasa los equipos para poblar las opciones de país
            inicializarFiltroEstado(); // Inicializar el filtro de estado
        })
        .fail(function (error) {
            toastr.error('Hubo un problema al cargar los equipos. Por favor, inténtelo de nuevo más tarde.');
        });
}

function inicializarFiltroNombre() {
    $('#filtroNombre').on('input', function () {
        filtrarEquipos();
    });
}

function inicializarFiltroPais(equipos) {
    const paises = new Set();

    // Extraer los países del campo "base"
    equipos.forEach(equipo => {
        const pais = extraerPais(equipo.base);
        paises.add(pais); // Agregar país al conjunto
    });

    // Poblar el menú desplegable
    const filtroPais = $('#filtroPais');
    paises.forEach(pais => {
        filtroPais.append(`<option value="${pais.toLowerCase()}">${pais}</option>`);
    });

    // Añadir evento para filtrar por país
    filtroPais.on('change', function () {
        filtrarEquipos();
    });
}

function inicializarFiltroEstado() {
    $('#filtroEstado').on('change', function () {
        filtrarEquipos();
    });
}

function filtrarEquipos() {
    const filtroNombre = $('#filtroNombre').val().toLowerCase();
    const filtroPais = $('#filtroPais').val();
    const filtroEstado = $('#filtroEstado').val();

    $('.equipo-card').each(function () {
        const nombreEquipo = $(this).data('nombre');
        const paisEquipo = $(this).data('pais');
        const estadoEquipo = $(this).data('estado');

        const coincideNombre = nombreEquipo.includes(filtroNombre);
        const coincidePais = !filtroPais || paisEquipo === filtroPais;
        const coincideEstado = !filtroEstado || estadoEquipo === filtroEstado;

        if (coincideNombre && coincidePais && coincideEstado) {
            $(this).show(); // Mostrar si coincide con todos los filtros
        } else {
            $(this).hide(); // Ocultar si no coincide
        }
    });
}

function extraerPais(base) {
    const partes = base.split(',');
    return partes[1] ? partes[1].trim() : base.trim();
}

function mostrarInfoEquipo(idEquipo) {
    $.getJSON(`servidor/getEquipo.php?id=${idEquipo}`) // Pasamos el idEquipo como parámetro
        .done(function (equipo) {
            const colorVar = claseEquipo(equipo.nombre);
            const nombreImagen = equipo.nombre.toLowerCase().replace(/ /g, '');

            const equipoHtml = `
            <div class="info-equipo" style="--team-color: var(${colorVar});">
                <img src="img/equipos/${nombreImagen}.png" alt="${equipo.nombre}" class="info-equipo-img">
                <div class="info-equipo-content">
                    <div>
                    <h2>${equipo.nombre}</h2>
                    <div class="stat-block">
                        <div class="stat"><i class="fa-solid fa-location-dot"></i> <strong>Base:</strong> ${equipo.base}</div>
                        <div class="stat"><i class="fa-solid fa-user-tie"></i> <strong>Jefe de Equipo:</strong> ${equipo.jefe_equipo}</div>
                        <div class="stat"><i class="fa-solid fa-trophy"></i> <strong>Campeonatos:</strong> ${equipo.campeonatos_ganados}</div>
                        <div class="stat"><i class="fa-solid fa-cogs"></i> <strong>Jefe Técnico:</strong> ${equipo.jefe_tecnico}</div>
                        <div class="stat"><i class="fa-solid fa-bolt"></i> <strong>Unidad de Potencia:</strong> ${equipo.unidad_potencia}</div>
                        <div class="stat"><i class="fa-solid fa-car"></i> <strong>Chasis:</strong> ${equipo.chasis}</div>
                        <div class="stat"><i class="fa-solid fa-calendar-day"></i> <strong>Primera Entrada:</strong> ${equipo.primera_entrada}</div>
                        <div class="stat"><i class="fa-solid fa-globe"></i> <strong>Sitio Web:</strong> <a href="${equipo.sitio_web}" target="_blank">Visitar</a></div>
                    </div>
                </div>
                <div>
                    <button id="volver_equipos" class="btn-volver">Volver</button>
                </div>
            </div>
        </div>`;

            $('main').html(equipoHtml);
        })
        .fail(function (error) {
            toastr.error('Hubo un problema al cargar la información del equipo. Por favor, inténtelo de nuevo más tarde.');
        });
}

// Mostrar información del equipo cuando se hace clic en un enlace de equipo
$(document).on('click', '.equipo-link', function (e) {
    e.preventDefault();
    const idEquipo = $(this).data('id');
    console.log("ID del equipo clicado:", idEquipo); // Depuración
    mostrarInfoEquipo(idEquipo);
});

// Volver a la lista de equipos
$(document).on('click', '#volver_equipos', function () {
    inicializarEquipos();
    window.location.hash = '#equipos';
});
