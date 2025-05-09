// Función para obtener el nombre del archivo de la imagen del piloto
function obtenerNombreArchivoImagen(piloto_nombre) {
    return piloto_nombre.toLowerCase().replace(/\s+/g, '');
}

// Función para inicializar los pilotos con filtros de nombre, país y estado
function inicializarPilotos() {
    if ($("head link[href='css/pilotos.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/pilotos.css">');
    }

    // Solicitar datos de los pilotos
    $.getJSON('servidor/getPilotos.php')
        .done(function (pilotos) {
            if (!pilotos || pilotos.length === 0) {
                toastr.warning('No se encontraron pilotos para la temporada 2025.');
                return;
            }

            // Generar lista de países para el filtro
            const paises = [...new Set(pilotos.map((piloto) => piloto.nacionalidad))].sort();

            let pilotosHtml = `<div class="pilotHeader">
                                <p>Pilotos de la Fórmula 1:</p>
                                </div>
                                <div class="filtrosPiloto"> 
                                    <input type="text" id="filtroNombrePiloto" placeholder="Buscar por nombre..." />
                                    <select id="filtroPaisPiloto">
                                        <option value="">Todos los países</option>`;
            paises.forEach((pais) => {
                pilotosHtml += `<option value="${pais.toLowerCase()}">${pais}</option>`;
            });

            pilotosHtml += `
                                    </select>
                                    <select id="filtroEstadoPiloto">
                                        <option value="">Todos los estados</option>
                                        <option value="activo">En Activo (2025)</option>
                                        <option value="historico">Históricos</option>
                                    </select>
                                </div>
                                <div class="pilotos-container">`;

            // Generar tarjetas de pilotos
            pilotos.forEach((piloto) => {
                if (!piloto) {
                    return;
                }

                // Obtener el nombre del archivo de la imagen
                const nombreImg = obtenerNombreArchivoImagen(piloto.piloto_nombre);

                // Reutilizando claseEquipo para obtener el color
                const colorVar = claseEquipo(piloto.equipo_nombre);

                pilotosHtml += `
                <div class="piloto-card" style="--team-color: var(${colorVar});" 
                    data-id="${piloto.piloto_id}"
                    data-nombre="${piloto.piloto_nombre.toLowerCase()}"
                    data-pais="${piloto.nacionalidad.toLowerCase()}"
                    data-estado="${piloto.estado}">

                    <div class="piloto-dorsal">${piloto.numero}</div>
                    <div class="piloto-imagen"><img src="img/pilotos/${nombreImg}.png" alt="${piloto.piloto_nombre}"></div>
                    <div class="piloto-info">
                        <h3>${piloto.piloto_nombre}</h3>
                        <p>${piloto.nacionalidad}</p>
                    </div>
                </div>
                `;
            });

            pilotosHtml += '</div>';

            // Insertar el contenido en el DOM
            $('main').html(pilotosHtml);

            // Añadir eventos a los filtros
            $('#filtroNombrePiloto').on('input', aplicarFiltros);
            $('#filtroPaisPiloto').on('change', aplicarFiltros);
            $('#filtroEstadoPiloto').on('change', aplicarFiltros);
        })
        .fail(function () {
            toastr.error('Error al cargar los datos de los pilotos. Por favor, inténtelo de nuevo más tarde.');
        });
}

// Función para aplicar filtros
function aplicarFiltros() {
    const searchValue = $('#filtroNombrePiloto').val().toLowerCase();
    const filtroPais = $('#filtroPaisPiloto').val();
    const filtroEstado = $('#filtroEstadoPiloto').val();

    $('.piloto-card').each(function () {
        const pilotoNombre = $(this).data('nombre');
        const pilotoPais = $(this).data('pais');
        const pilotoEstado = $(this).data('estado');

        // Comprobar si el piloto coincide con todos los filtros
        const coincideNombre = !searchValue || pilotoNombre.includes(searchValue);
        const coincidePais = !filtroPais || pilotoPais === filtroPais;
        const coincideEstado = !filtroEstado || pilotoEstado === filtroEstado;

        // Mostrar/ocultar según los filtros
        if (coincideNombre && coincidePais && coincideEstado) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Función para mostrar información del piloto
function mostrarInfoPiloto(piloto_id) {
    // Solicitar los datos completos del piloto al servidor
    $.getJSON('servidor/obtener_datos_por_piloto.php', { piloto_id: piloto_id })
        .done(function (data) {
            if (data.error) {
                $('main').html(`<p>Error: ${data.error}</p>`);
                return;
            }

            const piloto = data.piloto;
            const equipo = data.equipo;

            // Usar función para obtener el nombre del archivo de la imagen
            const apellido = obtenerNombreArchivoImagen(piloto.nombre);

            const colorVar = claseEquipo(equipo.nombre); // Obtener color del equipo

            // Crear el HTML del perfil del piloto
            const pilotoHtml = `
            <div class="container-pilotos">
               <div class="biografia-piloto" style="--team-color: var(${colorVar})">
                    <div> 
                        <h2 class="info-title">Perfil Profesional</h2>
                    </div>
                    <div> 
                        <p class="bio-text">${piloto.biografia}</p>
                    </div>
                </div>
                <div class="info-piloto" style="--team-color: var(${colorVar});">
                    <img src="img/pilotos/${apellido}.png" alt="${piloto.nombre}">
                    <div class="info-piloto-content">
                        <div>
                            <h2>${piloto.nombre}</h2>
                            <div class="stat-block">
                                <div class="stat"><i class="fa-solid fa-flag"></i> <strong>Nacionalidad:</strong> ${piloto.nacionalidad}</div>
                                <div class="stat"><i class="fa-solid fa-cake-candles"></i> <strong>Nacimiento:</strong> ${piloto.fecha_nacimiento}</div>
                                <div class="stat"><i class="fa-solid fa-people-group"></i> <strong>Equipo:</strong> ${equipo.nombre}</div>
                                <div class="stat"><i class="fa-solid fa-hashtag"></i> <strong>Dorsal:</strong> #${piloto.numero}</div>
                                <div class="stat"><i class="fa-solid fa-trophy"></i> <strong>Campeonatos:</strong> ${piloto.campeonatos_ganados}</div>
                                <div class="stat"><i class="fa-solid fa-medal"></i> <strong>Podios:</strong> ${piloto.podios}</div>
                                <div class="stat"><i class="fa-solid fa-bolt"></i> <strong>Poles:</strong> ${piloto.poles}</div>
                                <div class="stat"><i class="fa-solid fa-flag-checkered"></i> <strong>Victorias:</strong> ${piloto.victorias}</div>
                            </div>
                        </div>
                        <div>
                            <button id="masInfo_pilotos">+ Info</button>
                        </div>
                        <button id="volver_pilotos">Volver</button>
                    </div>
                </div>
               <div class="resultados-piloto" style="--team-color: var(${colorVar})">      
                    <div> 
                        <h2 class="info-title">Resultados recientes:</h2>
                    </div>     
                    <div id="resultados-todos">
                        ${renderizarResultados(data.resultados)}
                    </div>
                </div>
            </div>`;

            $('main').html(pilotoHtml);
        })
        .fail(function () {
            toastr.error('Error al cargar la información del piloto.');
        });
}

// Función para renderizar resultados (carreras y sprints)
function renderizarResultados(resultados) {
    let resultadosCombinados = [];

    // Combinar carreras y sprints en un solo arreglo
    resultados.carreras.forEach(carrera => {
        resultadosCombinados.push({
            tipo: 'Carrera',
            gran_premio: carrera.carrera,
            fecha: carrera.fecha,
            posicion: carrera.posicion,
            puntos: carrera.puntos,
            estado: carrera.estado
        });
    });

    resultados.sprints.forEach(sprint => {
        resultadosCombinados.push({
            tipo: 'Sprint',
            gran_premio: sprint.carrera,
            fecha: sprint.fecha,
            posicion: sprint.posicion,
            puntos: sprint.puntos,
            estado: sprint.estado
        });
    });

    // Ordenar por fecha (de más reciente a más antigua)
    resultadosCombinados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Generar el HTML
    let resultadosHtml = '';
    if (resultadosCombinados.length > 0) {
        resultadosHtml += '<ul>';
        resultadosCombinados.forEach(resultado => {
            resultadosHtml += `
                <li>
                    <strong>${resultado.gran_premio} (${resultado.tipo}):</strong> 
                    Posición: ${resultado.posicion}, Puntos: ${resultado.puntos}, Estado: ${resultado.estado}
                </li>`;
        });
        resultadosHtml += '</ul>';
    } else {
        resultadosHtml += '<p>No hay resultados disponibles.</p>';
    }

    return resultadosHtml;
}

// Toggle para + Info
$(document).on('click', '#masInfo_pilotos', function () {
    const $biografia = $('.biografia-piloto');
    const $resultados = $('.resultados-piloto');

    // Alternar visibilidad de los dos divs
    $biografia.toggle();
    $resultados.toggle();

    // Cambiar el texto del botón dinámicamente
    const textoBoton = $biografia.is(':visible') || $resultados.is(':visible') ? 'Ocultar Info' : '+ Info';
    $(this).text(textoBoton);
});

// Mostrar información del piloto cuando se hace clic en una tarjeta de piloto
$(document).on('click', '.piloto-card', function (e) {
    e.preventDefault();
    const piloto_id = $(this).data('id'); // Extraer el piloto_id de la tarjeta
    mostrarInfoPiloto(piloto_id);
    window.location.hash = `#piloto=${piloto_id}`;
});

// Volver a la lista de pilotos
$(document).on('click', '#volver_pilotos', function () {
    inicializarPilotos();
    window.location.hash = '#pilotos';
});
