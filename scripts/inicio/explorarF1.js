function inicializarExplorarF1() {
    // Verifica si el CSS de la sección "Explora F1" ya está cargado
    if ($("head link[href='css/exploreF1.css']").length === 0) {
        $("head").append('<link rel="stylesheet" href="css/exploreF1.css">');
    }

    // Crear la estructura básica de la sección
    $('main').append(`
        <section id="explore-f1">
            <h2>Explora F1</h2>
            <hr>
            <div class="cards-container"></div>
        </section>
    `);

    // Definir las tarjetas a añadir
    const tarjetas = [
        {
            imagen: 'img/cards/esports.jpg',
            enlace: 'https://www.formula1.com/en/latest/tags/esports.N0CpHwC3MAUK4iwAEYi6e',
            titulo: 'Esports',
            descripcion: 'Descubre lo último en F1 Esports.'
        },
        {
            imagen: 'img/cards/store.jpg',
            enlace: 'https://f1store.formula1.com/en/',
            titulo: 'Tienda F1',
            descripcion: 'Compra mercancía oficial de F1.'
        },
        {
            imagen: 'img/cards/authentics.jpg',
            enlace: 'https://www.f1authentics.com/',
            titulo: 'F1 Authentics',
            descripcion: 'Compra memorabilia oficial de F1.'
        }
    ];

    // Añadir las tarjetas a la sección
    tarjetas.forEach(tarjeta => {
        $('.cards-container').append(`
            <div class="card" style="background-image: url('${tarjeta.imagen}');">
                <a href="${tarjeta.enlace}" target="_blank">
                    <div class="card-content">
                        <h3>${tarjeta.titulo}</h3>
                        <p>${tarjeta.descripcion}</p>
                    </div>
                </a>
            </div>
        `);
    });
}