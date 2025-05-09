function inicializarResultados() {
    // Verificar si el CSS `clasificacion.css` está cargado
    if ($("head link[href='css/clasificacion.css']").length > 0) {
        // Eliminar únicamente el CSS `resultados.css`
        $("head link[href='css/clasificacion.css']").remove();
    }

    // Agregar el CSS `resultados.css` si no está cargado
    if ($("head link[href='css/resultados.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/resultados.css">');
    }

    const mainSection = $('main');

    // Crear contenedor para los filtros y la tabla de resultados
    const resultadosContainer = $('<div>', { id: 'resultados-container' });
    mainSection.append(resultadosContainer);

    // Crear el filtro para seleccionar entre vistas
    const filtroVista = $('<select>', { id: 'filtro-vista', class: 'filtroResult' })
        .append('<option value="">Seleccione una vista</option>')
        .append('<option value="2025">Temporada 2025</option>')
        .append('<option value="historicos">Campeones Históricos</option>')
        .append('<option value="clasificacion-pilotos">Clasificación Pilotos</option>')
        .append('<option value="clasificacion-equipos">Clasificación Equipos</option>');
    resultadosContainer.append('<label for="filtro-vista">Vista:</label>', filtroVista);

    // Crear contenedores para cada vista
    const temporada2025Container = $('<div>', { id: 'temporada-2025-container', style: 'display:none;' });
    const historicosContainer = $('<div>', { id: 'historicos-container', style: 'display:none;' });
    const clasificacionPilotosContainer = $('<div>', { id: 'clasificacion-pilotos-container', style: 'display:none;' });
    const clasificacionEquiposContainer = $('<div>', { id: 'clasificacion-equipos-container', style: 'display:none;' });

    // Agregar contenedores al DOM
    resultadosContainer.append(
        temporada2025Container,
        historicosContainer,
        clasificacionPilotosContainer,
        clasificacionEquiposContainer
    );

    // Vista de la temporada 2025
    const filtroCarrera = $('<select>', { id: 'filtro-carrera', class: 'filtroResult' }).append('<option value="">Seleccione una carrera</option>');
    temporada2025Container.append('<label for="filtro-carrera">Carrera:</label>', filtroCarrera);

    const filtroTipo = $('<select>', { id: 'filtro-tipo', class: 'filtroResult', style: 'display:none;' })
        .append('<option value="">Seleccione tipo</option>')
        .append('<option value="carrera">Carrera</option>')
        .append('<option value="sprint">Sprint</option>');
    temporada2025Container.append('<label for="filtro-tipo" style="display:none;">Tipo:</label>', filtroTipo);

    const infoEvento = $('<div>', { id: 'info-evento', class: 'info-evento', style: 'display:none;' });
    temporada2025Container.append(infoEvento);

    const tablaResultados = $('<table>', { id: 'tabla-resultados', class: 'resultados-tabla' });
    temporada2025Container.append(tablaResultados);

    // Vista de campeones históricos
    const tablaHistoricos = $('<table>', { id: 'tabla-historicos', class: 'resultados-tabla' });
    historicosContainer.append('<h2>Campeones Históricos</h2>', tablaHistoricos);

    // Evento para cambiar entre las vistas
    filtroVista.on('change', function () {
        const vistaSeleccionada = $(this).val();

        // Ocultar todos los contenedores
        temporada2025Container.hide();
        historicosContainer.hide();
        clasificacionPilotosContainer.hide();
        clasificacionEquiposContainer.hide();

        // Mostrar el contenedor correspondiente
        if (vistaSeleccionada === "2025") {
            temporada2025Container.show();
            cargarCarreras();
        } else if (vistaSeleccionada === "historicos") {
            historicosContainer.show();
            cargarHistoricos();
        } else if (vistaSeleccionada === "clasificacion-pilotos") {
            clasificacionPilotosContainer.show();
            cargarClasificacionPilotos('#clasificacion-pilotos-container');
        } else if (vistaSeleccionada === "clasificacion-equipos") {
            clasificacionEquiposContainer.show();
            cargarClasificacionEquipos('#clasificacion-equipos-container');
        }
    });

    // Evento para mostrar los resultados de la carrera seleccionada
    filtroCarrera.on('change', function () {
        const carreraId = $(this).val();
        const tieneSprint = $(this).find(':selected').data('sprint');

        // Limpia la tabla y oculta información previa
        infoEvento.hide().empty();
        tablaResultados.empty();

        if (carreraId) {
            if (tieneSprint) {
                filtroTipo.show().prev('label').show();
            } else {
                filtroTipo.hide().prev('label').hide();
                mostrarResultados(carreraId, 'carrera');
            }
        } else {
            filtroTipo.hide().prev('label').hide();
        }
    });

    // Evento para manejar el filtro de tipo de evento (carrera/sprint)
    filtroTipo.on('change', function () {
        const carreraId = filtroCarrera.val();
        const tipo = $(this).val();

        // Limpia la tabla y oculta información previa
        infoEvento.hide().empty();
        tablaResultados.empty();

        if (tipo && carreraId) {
            mostrarResultados(carreraId, tipo);
        }
    });

    // Función para cargar las carreras de la temporada 2025
    function cargarCarreras() {
        filtroCarrera.empty().append('<option value="">Seleccione una carrera</option>');
        $.getJSON('servidor/getCarreras.php', function (carreras) {
            carreras.forEach(carrera => {
                filtroCarrera.append(`<option value="${carrera.carrera_id}" data-sprint="${carrera.tiene_sprint}">${carrera.gran_premio}</option>`);
            });
        });
    }

    // Función para cargar los campeones históricos
    function cargarHistoricos() {
        tablaHistoricos.empty();
        tablaHistoricos.append('<tr><td colspan="3">Cargando campeones históricos...</td></tr>');

        $.getJSON('servidor/getCampeonesHistoricos.php', function (historicos) {
            if (historicos.length) {
                const encabezado = `
                    <thead>
                        <tr>
                            <th>Año</th>
                            <th>Piloto Campeón</th>
                            <th>Equipo Campeón</th>
                        </tr>
                    </thead>`;
                tablaHistoricos.empty().append(encabezado);

                const cuerpoTabla = $('<tbody>');
                historicos.forEach(historico => {
                    cuerpoTabla.append(`
                        <tr>
                            <td>${historico.temporada_id}</td>
                            <td>${historico.piloto}</td>
                            <td>${historico.equipo}</td>
                        </tr>`);
                });
                tablaHistoricos.append(cuerpoTabla);
            } else {
                tablaHistoricos.append('<tr><td colspan="3">No hay datos disponibles</td></tr>');
            }
        }).fail(() => {
            tablaHistoricos.empty().append('<tr><td colspan="3">Error al cargar los datos. Inténtelo más tarde.</td></tr>');
        });
    }

    // Función para mostrar los resultados de una carrera
    function mostrarResultados(carreraId, tipo) {
        tablaResultados.empty();
        infoEvento.hide().empty();

        $.getJSON(`servidor/getResultados.php?carrera_id=${carreraId}&tipo=${tipo}`, function (resultados) {
            if (resultados && resultados.length) {
                const granPremio = filtroCarrera.find(':selected').text();
                const tipoEvento = tipo === 'carrera' ? 'Carrera' : 'Sprint';
                infoEvento.html(`<h2>${granPremio} - ${tipoEvento}</h2>`).show();

                const encabezado = `
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Piloto</th>
                            <th>Equipo</th>
                            <th>Vueltas Completadas</th>
                            <th>Tiempo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>`;
                tablaResultados.append(encabezado);

                const cuerpoTabla = $('<tbody>');
                resultados.forEach(resultado => {
                    cuerpoTabla.append(`
                        <tr>
                            <td>${resultado.posicion}</td>
                            <td>${resultado.piloto}</td>
                            <td>${resultado.equipo}</td>
                            <td>${resultado.vueltas_completadas}</td>
                            <td>${resultado.tiempo || 'N/A'}</td>
                            <td>${resultado.estado}</td>
                        </tr>`);
                });
                tablaResultados.append(cuerpoTabla);
            } else {
                tablaResultados.append('<tr><td colspan="6">No hay resultados disponibles</td></tr>');
            }
        }).fail(() => {
            tablaResultados.empty().append('<tr><td colspan="6">Error al cargar los resultados. Inténtelo más tarde.</td></tr>');
        });
    }
}