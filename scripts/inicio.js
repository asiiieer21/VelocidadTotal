$(document).ready(function () {
    // Limpiar el contenido actual del body
    $('body').empty()
        // Añadir un header con una sección para el contenido del header
        .append('<header><section id="header-section"></section></header>')
        // Añadir un main para el contenido principal
        .append('<main></main>')
        // Añadir un footer con una sección para el contenido del footer
        .append('<footer><section id="footer-section"></section></footer>');

    // Inicializar los componentes de la página
    inicializarHeader();          // Inicializar el header
    inicializarPanelAdmin();
    inicializarProximaCarrera();  // Inicializar la sección de la próxima carrera
    inicializarNoticias();        // Inicializar la sección de noticias
    inicializarClasificacion();   // Inicializar la sección de clasificación de pilotos y equipos
    inicializarExplorarF1();      // Inicializar la sección "Explora F1"
    inicializarFooter();          // Inicializar el footer
});