function inicializarCalendario() {
    if ($("head link[href='css/calendario.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/calendario.css">');
    }
    const mainSection = $('main');

    // Añadir el título del calendario
    const titulo = $('<h2>', { text: 'Calendario F1 2025', id: 'calendario-titulo' });
    mainSection.append(titulo);

    // Crear el contenedor del calendario
    const calendarioContainer = $('<div>', { id: 'calendario-container' });
    mainSection.append(calendarioContainer);

    // Crear la cabecera de navegación (Anterior / Siguiente)
    const cabecera = $('<div>', { id: 'calendario-header' });
    const botonAnterior = $('<button>', { id: 'anterior', text: '<< Anterior', disabled: true });
    const botonSiguiente = $('<button>', { id: 'siguiente', text: 'Siguiente >>' });
    const tituloMes = $('<span>', { id: 'titulo-mes' });

    cabecera.append(botonAnterior, tituloMes, botonSiguiente);
    calendarioContainer.append(cabecera);

    // Crear la tabla del calendario
    const calendario = $('<table>', { id: 'calendario', class: 'calendario' });
    calendarioContainer.append(calendario);

    // Variables globales de mes y año (solo en 2025)
    let mesActual = 4; // Mayo (mes 0-11)
    const añoActual = 2025;

    // Función para actualizar el calendario
    function actualizarCalendario() {
        generarCalendario(calendario, añoActual, mesActual);
        cargarEventosCalendario();
        $('#titulo-mes').text(`${obtenerNombreMes(mesActual)} ${añoActual}`);
        actualizarBotones();
    }

    // Función para habilitar o deshabilitar los botones
    function actualizarBotones() {
        $('#anterior').prop('disabled', mesActual === 0); // Deshabilitar en enero
        $('#siguiente').prop('disabled', mesActual === 11); // Deshabilitar en diciembre
    }

    // Inicializar el calendario
    actualizarCalendario();

    // Eventos para navegar entre meses
    $('#anterior').on('click', function () {
        if (mesActual > 0) {
            mesActual--;
            actualizarCalendario();
        }
    });

    $('#siguiente').on('click', function () {
        if (mesActual < 11) {
            mesActual++;
            actualizarCalendario();
        }
    });
}

function generarCalendario(calendario, year, month) {
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const diasEnMes = new Date(year, month + 1, 0).getDate(); // Número de días en el mes
    const primerDia = new Date(year, month, 1).getDay(); // Día de la semana del primer día (0-6)

    // Vaciar el contenido del calendario
    calendario.empty();

    // Crear encabezado con los días de la semana
    const encabezado = $('<tr>');
    diasSemana.forEach(dia => {
        encabezado.append($('<th>', { text: dia }));
    });
    calendario.append(encabezado);

    // Generar las filas de los días
    let diaActual = 1;
    for (let fila = 0; fila < 6; fila++) {
        const filaDias = $('<tr>');
        for (let columna = 0; columna < 7; columna++) {
            const celda = $('<td>', { class: 'dia' });

            // Ajustar el día según el primer día de la semana
            if (fila === 0 && columna < (primerDia === 0 ? 6 : primerDia - 1)) {
                celda.text('');
            } else if (diaActual <= diasEnMes) {
                celda.text(diaActual);
                celda.attr('data-date', `${year}-${String(month + 1).padStart(2, '0')}-${String(diaActual).padStart(2, '0')}`);
                diaActual++;
            } else {
                celda.text('');
            }

            filaDias.append(celda);
        }
        calendario.append(filaDias);

        // Detener si ya hemos terminado todos los días del mes
        if (diaActual > diasEnMes) break;
    }
}

function cargarEventosCalendario() {
    $.getJSON('servidor/getEventosCronograma.php', function (eventos) {
        eventos.forEach(evento => {
            const fecha = new Date(evento.hora_inicio).toISOString().split('T')[0];
            const celda = $(`td[data-date='${fecha}']`);

            if (celda.length) {
                // Agregar un contenedor para los eventos, si no existe
                if (!celda.find('.eventos-lista').length) {
                    celda.append('<div class="eventos-lista"></div>');
                }

                // Agregar el evento a la lista
                const eventoDiv = $('<div>', { class: 'evento-item' });
                eventoDiv.text(`${evento.gran_premio} - ${evento.tipo_sesion} (${evento.hora_inicio.split(' ')[1]})`);
                celda.find('.eventos-lista').append(eventoDiv);

                // Marcar la celda como día con eventos
                celda.addClass('evento');
            }
        });

        // Mostrar información del evento al pasar el mouse por encima
        $('.evento').on('mouseenter', function () {
            const eventosLista = $(this).find('.eventos-lista').html();
            const popup = $('<div>', { id: 'popup' });
            popup.html(eventosLista); // Mostrar la lista de eventos en el pop-up
            $('body').append(popup);

            // Posicionar el pop-up cerca del cursor
            $(document).on('mousemove', function (e) {
                $('#popup').css({
                    top: e.pageY + 10 + 'px',
                    left: e.pageX + 10 + 'px'
                });
            });
        });

        // Eliminar el pop-up al salir del día
        $('.evento').on('mouseleave', function () {
            $('#popup').remove();
            $(document).off('mousemove');
        });
    }).fail(function () {
        toastr.error('Error al cargar los eventos del cronograma.');
    });
}

function generarInfoEvento(evento) {
    return `${evento.tipo_sesion}: ${new Date(evento.hora_inicio).toLocaleTimeString()} - ${new Date(evento.hora_fin).toLocaleTimeString()}`;
}

function obtenerNombreMes(mes) {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes];
}