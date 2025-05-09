function setActiveLink(linkId) {
    // Elimina la clase "active" de todos los enlaces
    $('#header-nav a').removeClass('active');
    // Añade la clase "active" al enlace clicado
    $(`#${linkId}`).addClass('active');
}

function inicializarHeader() {
    // los items del nav llegan del js variables
    const headerSection = $('#header-section');
    // LOGO y Botón de Menú
    headerSection.append('<img id="header-logo" alt="Logo página web VelocidadTotal" src="img/logo.webp">')
        .append('<div class="menu-toggle"><span class="material-icons">menu</span></div>') // Usar Material Icons
        .append('<nav id="header-nav"></nav>');

    // Agregar los enlaces de navegación
    navItems.forEach(item => {
        $('<a>', { href: item.href, id: item.id }).text(item.name).appendTo('#header-nav'); // Asegurarse de incluir el id
    });

    // Establecer el enlace "nav-inicio" como activo por defecto
    setActiveLink('nav-inicio');

    // Iniciar sesión o mostrar información del usuario
    if (sessionStorage.getItem('username')) {
        mostrarInfoUsuario(sessionStorage.getItem('username'), sessionStorage.getItem('role'));
    } else {
        headerSection.append('<div id="header-div"><button id="login-button"><span class="material-icons">person</span><span> INICIAR SESION</span></button></div>');
    }

    // Toggle menu
    $('.menu-toggle').click(function () {
        $(this).toggleClass('active');
        $('#header-nav').toggleClass('active');
        $(this).html($(this).hasClass('active') ? '<span class="material-icons">close</span>' : '<span class="material-icons">menu</span>'); // Usar Material Icons

        // Ajustar el margen superior del main cuando el menú está activo/inactivo
        if ($(this).hasClass('active')) {
            $('main').css('margin-top', $('#header-nav').outerHeight());
        } else {
            $('main').css('margin-top', '0');
        }
    });

    // Evento al pulsar en los diferentes items del nav:

    // Inicio
    $(document).on('click', '#nav-inicio', function (e) {
        e.preventDefault();
        setActiveLink('nav-inicio'); // Establecer como activo
        window.location.hash = '#inicio'; // Cambiar la URL
        $('main').empty(); // Limpiar el contenido actual del main
        inicializarPanelAdmin();      // Inicializar el panel de administrador
        inicializarProximaCarrera();  // Inicializar la sección de la próxima carrera
        inicializarNoticias();        // Inicializar la sección de noticias
        inicializarClasificacion();   // Inicializar la sección de clasificación de pilotos y equipos
        inicializarExplorarF1();      // Inicializar la sección "Explora F1"
    });

    // Circuitos
    $(document).on('click', '#nav-circuitos', function (e) {
        e.preventDefault();
        setActiveLink('nav-circuitos');
        window.location.hash = '#circuitos'; // Cambiar la URL
        $('main').empty(); // Limpiar el contenido actual del main
        inicializarCircuitos();
    });

    // Equipos
    $(document).on('click', '#nav-equipos', function (e) {
        e.preventDefault();
        setActiveLink('nav-equipos');
        window.location.hash = '#equipos'; // Cambiar la URL
        $('main').empty(); // Limpiar el contenido actual del main
        inicializarEquipos();
    });

    // Pilotos
    $(document).on('click', '#nav-pilotos', function (e) {
        e.preventDefault();
        setActiveLink('nav-pilotos');
        window.location.hash = '#pilotos'; // Cambiar la URL
        $('main').empty(); // Limpiar el contenido actual del main
        inicializarPilotos();
    });

    // Resultados
    $(document).on('click', '#nav-resultados', function (e) {
        e.preventDefault();
        setActiveLink('nav-resultados');
        window.location.hash = '#resultados'; // Cambiar la URL
        $('main').empty(); // Limpiar el contenido actual del main
        inicializarResultados();
    });

    // Calendario
    $(document).on('click', '#nav-calendario', function (e) {
        e.preventDefault();
        setActiveLink('nav-calendario');
        window.location.hash = '#calendario'; // Cambiar la URL
        $('main').empty(); // Limpiar el contenido actual del main
        inicializarCalendario();
    });

    // Botón Iniciar Sesión (abre una pop up donde aparece un form login)
    $(document).on('click', '#login-button', function () {
        // Verifica si el CSS de login ya está cargado
        if ($("head link[href='css/login-registro.css']").length === 0) {
            $("head").append('<link rel="preload" href="css/login-registro.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="css/login-registro.css"></noscript>');
            // Espera a que el CSS esté completamente cargado antes de mostrar el formulario
            $("head link[href='css/login-registro.css']").on('load', function () {
                mostrarLoginPopup();
            });
        } else {
            mostrarLoginPopup();
        }
    });

    function mostrarLoginPopup() {
        // Eliminar cualquier popup existente
        $('#login-popup').remove();
        $('#registro-popup').remove();

        // Crear la ventana emergente con el formulario de inicio de sesión
        const loginPopup = `
    <div id="login-popup" class="popup">
        <div class="popup-content">
            <span class="close-button">&times;</span>
            <h2>Iniciar Sesión</h2>
            <form id="login-form">
                <label for="username">Nombre de usuario:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Iniciar Sesión</button>
            </form>
            <a href="#" id="no-account-link" class="link-change">No tengo cuenta</a>
            <div id="info"></div>
        </div>
    </div>
    `;

        // Añadir la ventana emergente al cuerpo del documento
        $('body').append(loginPopup);

        // Mostrar la ventana emergente
        $('#login-popup').show();

        // Cerrar la ventana emergente al hacer clic en el botón de cerrar
        $(document).off('click', '.close-button').on('click', '.close-button', function () {
            $('#login-popup').remove();
        });

        // Manejar el envío del formulario de inicio de sesión
        $(document).off('submit', '#login-form').on('submit', '#login-form', function (event) {
            event.preventDefault();
            const username = $('#username').val();
            const password = $('#password').val();

            $.post('servidor/login.php', { username: username, password: password }, function (response) {
                if (response.status === 'success') {
                    $('#info').text('Inicio de sesión exitoso').css('color', 'green');
                    sessionStorage.setItem('username', response.username);
                    sessionStorage.setItem('role', response.role);
                    setTimeout(() => {
                        $('#login-popup').remove();
                        mostrarInfoUsuario(response.username, response.role);
                        // Recargar la página para actualizar el contenido
                        location.reload();
                    }, 2000);
                } else {
                    $('#info').text(response.message).css('color', 'red');
                }
            }, 'json');
        });

        // Manejar el clic en el enlace "No tengo cuenta"
        $(document).off('click', '#no-account-link').on('click', '#no-account-link', function (event) {
            event.preventDefault();
            $('#login-popup').remove();
            mostrarRegistroPopup();
        });
    }

    function mostrarInfoUsuario(username) {
        $('#header-div').remove();
        const userInfo = `
            <div id="user-info">
                <div id="user-icon">${username.charAt(0).toUpperCase()}</div>
                <a href="#" id="logout-link">Cerrar sesión</a>
            </div>
        `;
        $('#header-section').append(userInfo);

        // Manejar el clic en el ícono del usuario
        $(document).off('click', '#user-icon').on('click', '#user-icon', function (event) {
            event.preventDefault();
            mostrarUsuarioPopup();
        });

        // Manejar el clic en el enlace "Cerrar sesión"
        $(document).off('click', '#logout-link').on('click', '#logout-link', function (event) {
            event.preventDefault();
            $.post('servidor/logout.php', function () {
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('role');
                $('#user-info').remove();
                $('#header-section').append('<div id="header-div"><button id="login-button"><span class="material-icons">person</span><span> INICIAR SESION</span></button></div>');
            }, 'json');
        });
    }

    // Función para mostrar la ventana emergente de información del usuario
    function mostrarUsuarioPopup() {
        // Eliminar cualquier popup existente
        $('#usuario-popup').remove();

        // Obtener la información del usuario
        const username = sessionStorage.getItem('username');
        $.getJSON('servidor/infoUsuario.php', { username: username }, function (response) {
            if (response.status === 'success') {
                const usuarioPopup = `
                <div id="usuario-popup" class="popup">
                    <div class="popup-content">
                        <span class="close-button">&times;</span>
                        <h2>Información del Usuario</h2>
                        <form>
                            <label for="nombreUsuario">Nombre de usuario:</label>
                            <input type="text" id="nombreUsuario" name="nombreUsuario" value="${response.data.nombreUsuario}" readonly>
                            <label for="contraseña">Contraseña:</label>
                            <input type="password" id="contraseña" name="contraseña" value="********" readonly>
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" value="${response.data.email}" readonly>
                            <label for="idRol">Rol:</label>
                            <input type="text" id="idRol" name="idRol" value="${response.data.nombreRol}" readonly>
                        </form>
                    </div>
                </div>
                `;

                // Añadir la ventana emergente al cuerpo del documento
                $('body').append(usuarioPopup);

                // Mostrar la ventana emergente
                $('#usuario-popup').show();

                // Cerrar la ventana emergente al hacer clic en el botón de cerrar
                $(document).off('click', '.close-button').on('click', '.close-button', function () {
                    $('#usuario-popup').remove();
                });
            } else {
                toastr.error('Error al obtener la información del usuario. Por favor, inténtelo de nuevo más tarde.');
            }
        });
    }

    // Función para mostrar la ventana emergente de registro
    function mostrarRegistroPopup() {
        // Eliminar cualquier popup existente
        $('#login-popup').remove();
        $('#registro-popup').remove();

        // Crear la ventana emergente con el formulario de registro
        const registroPopup = `
    <div id="registro-popup" class="popup">
        <div class="popup-content">
            <span class="close-button">&times;</span>
            <h2>Registro</h2>
            <form id="registro-form">
                <label for="new-username">Nombre de usuario:</label>
                <input type="text" id="new-username" name="new-username" required>
                <label for="new-password">Contraseña:</label>
                <input type="password" id="new-password" name="new-password" required>
                <label for="repeat-password">Repetir Contraseña:</label>
                <input type="password" id="repeat-password" name="repeat-password" required>
                 <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <button type="submit">Registrarse</button>
            </form>
            <a href="#" id="already-account-link" class="link-change">Ya tengo cuenta</a>
            <div id="info"></div>
        </div>
    </div>
    `;

        // Añadir la ventana emergente al cuerpo del documento
        $('body').append(registroPopup);

        // Mostrar la ventana emergente
        $('#registro-popup').show();

        // Cerrar la ventana emergente al hacer clic en el botón de cerrar
        $(document).off('click', '.close-button').on('click', '.close-button', function () {
            $('#registro-popup').remove();
        });

        // Manejar el envío del formulario de registro
        $(document).off('submit', '#registro-form').on('submit', '#registro-form', function (event) {
            event.preventDefault();
            const newUsername = $('#new-username').val();
            const newPassword = $('#new-password').val();
            const repeatPassword = $('#repeat-password').val();
            const email = $('#email').val();

            // Validar que las contraseñas coincidan
            if (newPassword !== repeatPassword) {
                $('#info').text('Las contraseñas no coinciden').css('color', 'red');
                return;
            }

            $.post('servidor/register.php', { username: newUsername, password: newPassword, email: email }, function (response) {
                if (response.status === 'success') {
                    $('#info').text('Registro exitoso').css('color', 'green');
                    setTimeout(() => {
                        $('#registro-popup').remove();
                        // Aquí puedes agregar la lógica para aparecer como registrado en la página
                    }, 2000);
                } else {
                    $('#info').text(response.message).css('color', 'red');
                }
            }, 'json');
        });

        // Manejar el clic en el enlace "Ya tengo cuenta"
        $(document).off('click', '#already-account-link').on('click', '#already-account-link', function (event) {
            event.preventDefault();
            $('#registro-popup').remove();
            mostrarLoginPopup();
        });
    }
}