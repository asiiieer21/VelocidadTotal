function inicializarFooter() {
    const footerSection = $('#footer-section');

    // Crear encabezado de patrocinadores
    const sponsorsHeader = $('<div>', { class: 'sponsors-header' }).append(
        $('<h3>').text('Nuestros socios:')
    );
    footerSection.append(sponsorsHeader);

    const sponsorsContainer = $('<div>', { id: 'sponsorsContainer', class: 'sponsors' }).appendTo(footerSection);

    // Cargar patrocinadores desde el servidor
    cargarPatrocinadores();

    function cargarPatrocinadores() {
        $.getJSON("servidor/obtenerPatrocinadores.php")
            .done(function (datos) {
                const sponsorsContainer = $('#sponsorsContainer');
                if (!sponsorsContainer.length) {
                    console.error('No se encontró el contenedor con el ID #sponsorsContainer');
                    return;
                }

                sponsorsContainer.empty();

                $.each(datos, function () {
                    const sponsorElement = $('<span>', { class: 'sponsor' });
                    const sponsorUrl = `https://www.${this.nombre.toLowerCase().replace(/\s+/g, '')}.com/`;

                    $('<img>', {
                        src: this.imagen,
                        alt: this.nombre,
                        title: this.nombre
                    }).on('click', function () {
                        window.open(sponsorUrl, '_blank');
                    }).appendTo(sponsorElement);

                    sponsorElement.appendTo(sponsorsContainer);
                });
            })
            .fail(function () {
                toastr.error('No se pudieron cargar los patrocinadores. Por favor, inténtelo de nuevo más tarde.');
            });
    }

    footerSection.append('<hr>');

    // Sección de enlaces rápidos y redes sociales
    const footerLinksContainer = $('<div>', { class: 'footer-links-container' }).appendTo(footerSection);
    const footerSections = [
        {
            title: 'Enlaces Rápidos',
            links: navItems // Usa los mismos `id` que en el header
        },
        {
            title: 'Información',
            links: [
                { name: 'Sobre Nosotros', href: '' },
                { name: 'Contacto', href: '' },
                { name: 'Privacidad', href: '' }
            ]
        },
        {
            title: 'Síguenos',
            links: [
                { name: 'Facebook', href: 'https://www.facebook.com/Formula1', icon: 'fa-brands fa-facebook' },
                { name: 'Twitter', href: 'https://www.twitter.com/F1', icon: 'fa-brands fa-x-twitter' },
                { name: 'Instagram', href: 'https://www.instagram.com/F1', icon: 'fa-brands fa-instagram' },
                { name: 'YouTube', href: 'https://www.youtube.com/Formula1', icon: 'fa-brands fa-youtube' }
            ]
        }
    ];

    // Añadir enlaces rápidos, información y redes sociales al footer
    footerSections.forEach(section => {
        const sectionElement = $('<div>', { class: 'footer-section' }).append(`<h3>${section.title}</h3>`);
        section.links.forEach(link => {
            if (section.title === 'Síguenos') {
                // Enlaces de redes sociales
                $('<a>', { href: link.href, target: '_blank' })
                    .html(`<i class="${link.icon} social-icon"></i>`)
                    .appendTo(sectionElement);
            } else {
                // Enlaces de las otras secciones
                const enlace = $('<a>', { href: link.href, id: link.id || '' }).text(link.name);

                // Deshabilitar enlaces de la sección "Información"
                if (section.title === 'Información' && link.href === '') {
                    enlace.on('click', function (e) {
                        e.preventDefault(); // Evitar que realice cualquier acción
                    }).css({
                        cursor: 'not-allowed', // Cambiar el cursor para que se vea deshabilitado
                        color: '#777' // Cambiar el color para que parezca deshabilitado
                    });
                }

                enlace.appendTo(sectionElement);
            }
        });
        sectionElement.appendTo(footerLinksContainer);
    });

    footerSection.append('<hr>');
    footerSection.append('<p>&copy; 2025 VelocidadTotal. Todos los derechos reservados.</p>');
}