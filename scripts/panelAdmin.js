function inicializarPanelAdmin() {
  // Verificar si el usuario tiene el rol de Admin
  $.getJSON('servidor/obtenerSesion.php', function (response) {
    if (response.role === 'Admin') {
      // Si el usuario es Admin, inicializar el panel de administración
      $('#section_admin').remove(); // Eliminar cualquier sección de admin existente
      $('main').prepend('<section id="section_admin"></section>');
      actualizarInterfazUsuario();
    }
  }).fail(function (error) {
    toastr.error('Error al obtener la sesión del usuario. Por favor, inténtelo de nuevo más tarde.');
  });
}

// Función separada para actualizar la interfaz del usuario
function actualizarInterfazUsuario() {
  // Agregar la hoja de estilos al header si no está ya añadida
  if ($("head link[href='css/panelAdmin.css']").length === 0) {
    $("head").append('<link rel="stylesheet" href="css/panelAdmin.css">');
  }
  let panelAdmin = `
          <fieldset id="panelAdmin">
              <legend>Panel de Administrador</legend>
          </fieldset>
      `;
  $("#section_admin").append(panelAdmin);
  // Carreras
  var gestion_circuitos = $('<a href="#" id="gestion_circuitos" class="link">Gestionar Circuitos</a>');
  $('#panelAdmin').append(gestion_circuitos);
  // Equipos
  var gestion_equipos = $('<a href="#" id="gestion_equipos" class="link">Gestionar Equipos</a>');
  $('#panelAdmin').append(gestion_equipos);
  // Pilotos
  var gestion_pilotos = $('<a href="#" id="gestion_pilotos" class="link">Gestionar Pilotos</a>');
  $('#panelAdmin').append(gestion_pilotos);
  // Resultados
  var gestion_resultados = $('<a href="#" id="gestion_resultados" class="link">Gestionar Resultados</a>');
  $('#panelAdmin').append(gestion_resultados);
  // Calendario
  var gestion_calendario = $('<a href="#" id="gestion_calendario" class="link">Gestionar Calendario</a>');
  $('#panelAdmin').append(gestion_calendario);
  // Actualizar Img BD carrera
  var gestion_imgCarrera = $('<a href="#actualizarImg" id="gestion_actualizarImg" class="link">Actualizar Imágenes de la BD</a>');
  $('#panelAdmin').append(gestion_imgCarrera);

  // Eliminar cualquier evento click existente para evitar múltiples alertas
  $(document).off('click', '#gestion_actualizarImg');

  // Evento para actualizar imágenes de carreras
  $(document).on('click', '#gestion_actualizarImg', function (event) {
    event.preventDefault();
    window.location.hash = '#actualizarImgCarreras'; // Cambiar la URL
    $.getJSON('servidor/añadirImgBD.php', function (response) {
      toastr.success('Imágenes actualizadas correctamente.');
    }).fail(function (error) {
      toastr.error('Error al actualizar las imágenes. Por favor, inténtelo de nuevo más tarde.');
    });
  });
}