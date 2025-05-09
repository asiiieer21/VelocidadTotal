function inicializarNoticias() {
    $('main').append('<section id="central"></section>');
    $('#central').append('<h1>Últimas noticias</h1>').append('<div id="contenedor_central"></div>').append('<button id="cargarMasBtn">Cargar más noticias</button>').append('<hr>');

    let inicio = 0;
    const limite = 10; // Número de noticias a cargar inicialmente y cada vez que se carguen más
    const totalNoticiasPermitidas = 50; // Límite total de noticias

    cargarNoticias(inicio, limite);

    $(document).off('click', '#cargarMasBtn').on('click', '#cargarMasBtn', function () {
        inicio += limite;
        cargarNoticias(inicio, limite);
    });

    async function cargarNoticias(inicio, limite) {
        try {
            // Verifica si el CSS de noticias ya está cargado
            if ($("head link[href='css/noticias.css']").length === 0) {
                $("head").append('<link rel="preload" href="css/noticias.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="css/noticias.css"></noscript>');
            }

            const urlRSS = "https://api.allorigins.win/get?url=" + encodeURIComponent("https://es.motorsport.com/rss/f1/news/");
            const response = await $.get(urlRSS);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.contents, "text/xml");
            const items = $(xmlDoc).find("item");

            items.slice(inicio, inicio + limite).each(function () {
                const titulo = $(this).find("title").text().replace(/<!\[CDATA\[|\]\]>/g, '');
                const descripcion = $(this).find("description").text();
                const enlaceMasMatch = descripcion.match(/href=['"](https:\/\/es\.motorsport\.com\/f1\/news\/[^'"]+)['"]/);
                const enlace = enlaceMasMatch ? enlaceMasMatch[1].trim() : '';
                const categoria = $(this).find("category").first().text();
                let fechaPublicacion = $(this).find("pubDate").text();
                fechaPublicacion = fechaPublicacion ? new Date(fechaPublicacion).toLocaleString() : "Fecha no disponible";
                const urlImagen = $(this).find("enclosure").attr("url");
                const urlImagenBorrosa = urlImagen ? urlImagen.replace(/(\.[\w\d_-]+)$/i, '-blur$1') : '';

                let noticiaHTML = `<div class="noticia-item">`;
                if (urlImagen) {
                    noticiaHTML += `<img src='${urlImagenBorrosa}' data-src='${urlImagen}' alt='Imagen de la noticia' class='noticia-imagen borrosa' loading='lazy'>`;
                }
                noticiaHTML += `<h3><a href="${enlace}" target="_blank">${titulo}</a></h3>`;
                noticiaHTML += `<p><strong>Categoría:</strong> ${categoria}</p>`;
                noticiaHTML += `<p><strong>Fecha:</strong> ${fechaPublicacion}</p>`;
                noticiaHTML += `</div>`;

                $('#contenedor_central').append(noticiaHTML);
            });

            // Lazy load de las imágenes completas
            const imagenesPerezosas = document.querySelectorAll('img[loading="lazy"]');
            imagenesPerezosas.forEach(img => {
                img.onload = () => {
                    img.classList.remove('borrosa');
                };
                img.src = img.dataset.src;
            });

            // Verifica si se ha alcanzado el límite de noticias
            if (inicio + limite >= totalNoticiasPermitidas) {
                $('#cargarMasBtn').hide();
            }
        } catch (error) {
            toastr.error('Error al cargar cargar las noticias. Por favor, inténtelo de nuevo más tarde.');
        }
    }
}