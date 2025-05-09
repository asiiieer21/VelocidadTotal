const paisesBandera = {
    'Australia': 'au',
    'China': 'cn',
    'Japón': 'jp',
    'Baréin': 'bh',
    'Arabia Saudí': 'sa',
    'Estados Unidos': 'us',
    'Italia': 'it',
    'Mónaco': 'mc',
    'España': 'es',
    'Canadá': 'ca',
    'Austria': 'at',
    'Reino Unido': 'gb',
    'Bélgica': 'be',
    'Hungría': 'hu',
    'Países Bajos': 'nl',
    'Azerbaiyán': 'az',
    'Singapur': 'sg',
    'México': 'mx',
    'Brasil': 'br',
    'Catar': 'qa',
    'Emiratos Árabes Unidos': 'ae'
};

function obtenerCodigoBandera(ubicacion) {
    const partesUbicacion = ubicacion.split(', ');
    const pais = partesUbicacion[partesUbicacion.length - 1];
    return paisesBandera[pais] || ''; // Retorna el código de la bandera o una cadena vacía si no existe
}

// Función para obtener el ícono correspondiente al tipo de circuito
function obtenerIconoTipoCircuito(tipoCircuito) {
    switch (tipoCircuito) {
        case 'autodromo':
            return '<i class="fa-solid fa-road"></i>';
        case 'urbano':
            return '<i class="fa-solid fa-city"></i>';
        case 'hibrido':
            return '<i class="fa-solid fa-road"></i> <i class="fa-solid fa-city"></i>';
        default:
            return ''; // Si no hay tipo conocido, no mostrar ícono
    }
}

// Función para obtener el ícono correspondiente al tipo de carrera
function obtenerIconoTipoCarrera(tipoCarrera) {
    switch (tipoCarrera) {
        case 'nocturna':
            return '<i class="fa-solid fa-moon"></i>';
        case 'diurna':
            return '<i class="fa-solid fa-sun"></i>';
        case 'mixta':
            return '<i class="fa-solid fa-sun"></i> <i class="fa-solid fa-moon"></i>';
        default:
            return ''; // Si no hay tipo conocido, no mostrar ícono
    }
}

// Función para inicializar los circuitos
function inicializarCircuitos() {
    if ($("head link[href='css/circuitos.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/circuitos.css">');
    }
    // Cargar los datos desde el servidor
    $.getJSON('servidor/getCircuitos.php')
        .done(function (circuitos) {
            let circuitosHtml = `<div class="circuitosHeader">
                                    <h3>Descubre los Circuitos Más Famosos de la F1</h3>
                                </div>
                                <div class="filtrosCircuito">
                                    <input type="text" id="filtroNombre" placeholder="Buscar circuito...">
                                    <select id="filtroTipoCircuito">
                                        <option value="">Todos los tipos</option>
                                        <option value="autodromo">Autódromo</option>
                                        <option value="urbano">Urbano</option>
                                        <option value="hibrido">Híbrido</option>
                                    </select>
                                    <select id="filtroTipoCarrera">
                                        <option value="">Todas las carreras</option>
                                        <option value="diurna">Diurna</option>
                                        <option value="nocturna">Nocturna</option>
                                        <option value="mixta">Mixta</option>
                                    </select>
                                </div>
                                <div class="circuitos-container">`;

            circuitos.forEach((circuito) => {
                const codigoBandera = obtenerCodigoBandera(circuito.ubicacion); // Obtener código de bandera
                circuitosHtml += `
                <div class="circuito-card" 
                    data-id="${circuito.circuito_id}" 
                    data-nombre="${circuito.circuito_nombre.toLowerCase()}" 
                    data-tipo-circuito="${circuito.tipo_circuito}" 
                    data-tipo-carrera="${circuito.tipo_carrera}">
                    <div class="circuito-imagen">
                        <img src="img/circuitos/${circuito.gran_premio.replace(/\s+/g, '').replace(/de/g, 'De')}.webp" alt="${circuito.circuito_nombre}">
                    </div>
                    <img class="bandera" src="https://flagcdn.com/w40/${codigoBandera}.png" alt="Bandera de ${circuito.ubicacion}">
                    <div class="circuito-info">
                        <h3>
                            <div class="titulo-circuito">
                                <span>${circuito.circuito_nombre}</span>
                             </div>
                        </h3>
                        <p><strong>Ubicación:</strong> ${circuito.ubicacion}</p>
                    </div>
                </div>`;
            });

            circuitosHtml += '</div>';
            $('main').html(circuitosHtml);

            // Inicializar los filtros
            inicializarFiltroNombre();
            inicializarFiltroTipoCircuito();
            inicializarFiltroTipoCarrera();

            // Agregar evento de clic para mostrar detalles
            $('.circuito-card').on('click', function () {
                const idCircuito = $(this).data('id').toString(); // Convertir a cadena

                const circuito = circuitos.find(c => c.circuito_id === idCircuito); // Comparación directa como cadena

                if (!circuito) {
                    toastr.error('Error: No se pudo cargar la información del circuito.');
                    return;
                }
                mostrarInformacionCircuito(circuito);
            });
        })
        .fail(function (error) {
            toastr.error('Error: No se pudieron cargar los circuitos.');
        });
}

// Inicializar los filtros
function inicializarFiltroNombre() {
    $('#filtroNombre').on('input', function () {
        filtrarCircuitos();
    });
}

function inicializarFiltroTipoCircuito() {
    $('#filtroTipoCircuito').on('change', function () {
        filtrarCircuitos();
    });
}

function inicializarFiltroTipoCarrera() {
    $('#filtroTipoCarrera').on('change', function () {
        filtrarCircuitos();
    });
}

// Filtrar los circuitos
function filtrarCircuitos() {
    const filtroNombre = $('#filtroNombre').val().toLowerCase();
    const filtroTipoCircuito = $('#filtroTipoCircuito').val();
    const filtroTipoCarrera = $('#filtroTipoCarrera').val();

    $('.circuito-card').each(function () {
        const nombreCircuito = $(this).data('nombre');
        const tipoCircuito = $(this).data('tipo-circuito');
        const tipoCarrera = $(this).data('tipo-carrera');

        const coincideNombre = nombreCircuito.includes(filtroNombre);
        const coincideTipoCircuito = !filtroTipoCircuito || tipoCircuito === filtroTipoCircuito;
        const coincideTipoCarrera = !filtroTipoCarrera || tipoCarrera === filtroTipoCarrera;

        if (coincideNombre && coincideTipoCircuito && coincideTipoCarrera) {
            $(this).show(); // Mostrar si coincide con todos los filtros
        } else {
            $(this).hide(); // Ocultar si no coincide
        }
    });
}

// Función para mostrar la información detallada del circuito
function mostrarInformacionCircuito(circuito) {
    const codigoBandera = obtenerCodigoBandera(circuito.ubicacion);

    // Obtener los íconos correspondientes
    const iconoTipoCircuito = obtenerIconoTipoCircuito(circuito.tipo_circuito);
    const iconoTipoCarrera = obtenerIconoTipoCarrera(circuito.tipo_carrera);

    // Construir el HTML con la información detallada del circuito
    const infoHtml = `
        <div class="info-circuito">
            <div class="info-circuito-header">
                <div>
                    <h2>${circuito.circuito_nombre}</h2>
                    <div class="stat-block">
                        <div class="stat">
                            <i class="fa-solid fa-location-dot"></i> <strong>Ubicación:</strong> ${circuito.ubicacion}
                            <img class="img-bandera" src="https://flagcdn.com/w40/${codigoBandera}.png" alt="Bandera de ${circuito.ubicacion}" class="info-circuito-img">
                        </div>
                        <div class="stat"><strong>Evento:</strong> ${circuito.gran_premio}</div>
                        <div class="stat"><i class="fa-solid fa-calendar-days"></i> <strong>Fecha:</strong> ${circuito.fecha}</div>   
                    </div> 
                </div>
                <div class="imgs">
                    <img class="img-circuito" src="img/circuitos/${circuito.gran_premio.replace(/\s+/g, '').replace(/de/g, 'De')}.webp" alt="${circuito.circuito_nombre}">
                </div>
            </div>
            <div class="info-circuito-body">
                <h2>Ficha técnica</h2>
                <div class="stat-block">
                    <div class="stat"><i class="fa-solid fa-road"></i> <strong>Longitud:</strong> ${circuito.longitud} km</div>
                    <div class="stat"><i class="fa-solid fa-random"></i> <strong>Número de curvas:</strong> ${circuito.numero_de_curvas}</div>
                    <div class="stat"><i class="fa-solid fa-trophy"></i> <strong>Récord de vuelta:</strong> ${circuito.record_vuelta} (${circuito.titular_record_vuelta})</div>
                    <div class="stat"><i class="fa-solid fa-cogs"></i> <strong>Tipo de circuito:</strong> ${iconoTipoCircuito} ${circuito.tipo_circuito}</div>
                    <div class="stat"><i class="fa-solid fa-flag-checkered"></i> <strong>Tipo de carrera:</strong> ${iconoTipoCarrera} ${circuito.tipo_carrera}</div>
                </div>
            </div>
            <div>
                <button id="cerrar-detalle" class="btn-cerrar">Cerrar</button>
            </div>
        </div>
    `;

    // Mostrar la información en un contenedor o modal
    $('main').html(infoHtml);

    // Agregar el evento para cerrar y volver a la lista
    $('#cerrar-detalle').on('click', function () {
        inicializarCircuitos(); // Vuelve a mostrar la lista de circuitos
    });
}
