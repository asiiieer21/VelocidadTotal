function inicializarProximaCarrera() {
    // Añadir la sección para el próximo Gran Premio al contenido principal
    $('main').append('<section id="proximo_gp"></section>');
    // Llamar a la función para obtener información sobre el próximo Gran Premio
    infoHastaProximoGP();

    function infoHastaProximoGP() {
        // Verifica si el CSS de la sección "Próximo GP" ya está cargado
        if ($("head link[href='css/proximoGP.css']").length === 0) {
            $("head").append('<link rel="preload" href="css/proximoGP.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="css/proximoGP.css"></noscript>');
        }

        // Obtener los datos del próximo Gran Premio desde el servidor
        $.getJSON("servidor/proximo_gp.php")
            .done(function (datos) {
                // Si hay un error en los datos recibidos, mostrar un mensaje de error
                if (datos.error) {
                    $('#proximo_gp').html('<p>' + datos.error + '</p>');
                    return;
                }

                // Extraer información del próximo Gran Premio desde los datos recibidos
                const nombreGP = datos.gran_premio;
                const tipoGP = "Carrera"; // Asumimos que siempre es "Carrera", puedes ajustar esto si tienes otra lógica
                const horaInicio = new Date(datos.hora_inicio); // Usamos hora_inicio
                const horaFin = new Date(datos.hora_fin); // Usamos hora_fin
                const imagenGP = datos.imagen_base64; // Asegúrate de que la imagen esté en formato Base64
                const nombreCircuito = datos.nombre;
                const ubicacionCircuito = datos.ubicacion;

                // Verificar si las fechas son válidas
                if (isNaN(horaInicio.getTime()) || isNaN(horaFin.getTime())) {
                    $('#proximo_gp').html('<p>Error al interpretar las fechas del próximo Gran Premio.</p>');
                    return;
                }

                // Construir el contenido HTML para mostrar la información del próximo Gran Premio
                const contenido = `
                <h2>Próximo Gran Premio</h2>
                <div class="gp-card">
                    <div class="card-info">
                        <div class="gp-image">
                            <img src="data:image/jpeg;base64,${imagenGP}" alt="${nombreGP}">
                        </div>
                        <div class="gp-details">
                            <p><strong>Nombre:</strong> <span id="nombre_gp">${nombreGP}</span></p>
                            <p><strong>Circuito:</strong> <span id="nombre_circuito">${nombreCircuito}</span></p>
                            <p><strong>Ubicación:</strong> <span id="ubicacion_circuito">${ubicacionCircuito}</span></p>
                            <p><strong>Tipo:</strong> <span id="tipo_gp">${tipoGP}</span></p>
                            <p><strong>Fecha y hora de inicio:</strong> <span id="fecha_inicio">${horaInicio.toLocaleString()}</span></p>
                            <p><strong>Fecha y hora de fin:</strong> <span id="fecha_fin">${horaFin.toLocaleString()}</span></p>
                        </div>
                    </div>
                    <div class="timer">
                        <p>Tiempo restante: <span id="tiempo_restante"></span></p>
                    </div>
                </div>
            `;
                // Actualizar el contenido de la sección "Próximo GP" con la información del próximo Gran Premio
                $('#proximo_gp').html(contenido);

                // Función para actualizar el tiempo restante hasta el próximo Gran Premio
                function actualizarTiempoRestante() {
                    const ahora = new Date();

                    if (ahora >= horaInicio && ahora <= horaFin) {
                        $('#tiempo_restante').text("¡La carrera ya comenzó!");
                        return;
                    }

                    if (ahora > horaFin) {
                        $('#tiempo_restante').text("La carrera ha terminado.");
                        clearInterval(timerInterval);
                        setTimeout(infoHastaProximoGP, 5000); // Recargar datos después de 5 segundos
                        return;
                    }

                    const diferencia = horaInicio - ahora;

                    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

                    $('#tiempo_restante').text(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
                }

                // Llamar a la función para actualizar el tiempo restante inmediatamente
                actualizarTiempoRestante();
                // Configurar un intervalo para actualizar el tiempo restante cada segundo
                const timerInterval = setInterval(actualizarTiempoRestante, 1000);
            })
            .fail(function () {
                // Mostrar un mensaje de error si no se pueden cargar los datos del próximo Gran Premio
                toastr.error('No se pudo cargar el próximo Gran Premio. Por favor, inténtelo de nuevo más tarde.');
            });
    }
}