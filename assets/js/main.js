AOS.init();
// También puede pasar un objeto de configuración opcional
// a continuación se enumeran los ajustes por defecto
AOS.init({

  // Ajustes que pueden anularse por elemento, mediante atributos `data-aos-*`:
  offset: 120, // desplazamiento (en px) desde el punto de activación original
  delay: 0, // valores de 0 a 3000, con paso de 50ms
  duration: 700, // values from 0 to 3000, with step 50ms
  easing: 'ease', // easing por defecto para animaciones AOS
  once: false, // si la animación debe ocurrir sólo una vez - mientras se desplaza hacia abajo
  mirror: false, // si los elementos deben animarse al pasar por ellos
  anchorPlacement: 'top-bottom', // define qué posición del elemento respecto a la ventana debe activar la animación

});

// Clave de acceso para hacer uso de la API
const apiKey = "6HWi4adluIYFncILxVXl7ZVpWdEfA0OkUWJ0XPD2";

// Encabezados que solicita la API con la clave 
const headers = {
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json"
};

// CONSUMIR API
// Función para obtener una cita aleatoria
async function obtenerCitaAleatoria() {

  // Usamos un proxy ya que la API tiene Problema de CORS (Cross-Origin Resource Sharing)
  // puede estar configurado para permitir solicitudes desde este dominio.
  const url = "https://quotes.rest/qod";
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";

  // Valores por defecto
  let quote = 'Do not worry if you have built your castles in the air. They are where they should be. Now put the foundations under them.'
  let author = 'Henry David Thoreau'

  try {
    // Fetch para consumir la API
    const response = await fetch(proxyUrl + url, { headers: headers });
    // const response = await fetch(url, { headers: headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Si tenemos una respuesta de la API la convertimos en json
    const data = await response.json();
    if (data.contents && data.contents.quotes && data.contents.quotes.length > 0) {
      quote = data.contents.quotes[0].quote;
      author = data.contents.quotes[0].author;
    } else {
      console.log("The answer does not contain citations.");
    }
  } catch (error) {
    console.log("Unable to obtain an appointment");
  }
  // Cargamos los valores a la página
  $('#motivation-phrase').text(quote);
  $('#motivation-phrase-author').text(author);

}


// AL CARGAR EL DOCUMENTO
$(document).ready(() => {
  // Agregar un evento de clic para el menú desplegable
  $('.dropdown-item').click(function () {
    // Obtener el texto de la opción seleccionada
    var selectedLanguage = $(this).text().trim();

    // Realizar acciones según el idioma seleccionado
    if (selectedLanguage === 'SPANISH' || selectedLanguage === 'ESPAÑOL') {
      // Cambiar el contenido de la página al español
      changeLanguaje('es');
    } else if (selectedLanguage === 'ENGLISH' || selectedLanguage === 'ÍNGLES') {
      // Cambiar el contenido de la página al inglés
      changeLanguaje('en');
    }
  });


  // Función para cambiar el idioma de la página
  function changeLanguaje(language) {
    fetch('./translate/translation.json')
      .then(response => response.json()) // Convertir la respuesta a JSON
      .then(data => {
        // data se convierte en un JSON al devolver la promesa
        let translate = data[language];

        for (const type_ in translate) {
          if (type_ != "atributes") {
            let selectors = translate[type_];
            for (const selector in selectors) {
              let values = selectors[selector].split('^');
              let labels = $(selector);
              for (const i in values) {
                labels.eq(i).html(values[i]);
              }
            }
          } else {
            let atributes = translate[type_];
            for (const atribute in atributes) {
              let selectors = atributes[atribute];
              for (const selector in selectors) {
                let values = selectors[selector].split('^');
                let labels = $(selector);
                for (const i in values) {
                  labels.eq(i).attr(atribute, values[i]);
                }
              }
            }
          }
        }
      })
      .catch(error => {
        // Manejar errores
        console.error("Error loading traduccion's file:", error);
        exit();
      });

  }

  // Manejo de envio de formulario de contacto
  // Se agrega un evento al boton contact me
  $("#emailForm").submit(function (event) {
    // Quitamos las opciones que vienen predefinidas
    event.preventDefault();

    // Obtenemos los valores del formulario
    let to = "maximilianorivas01@gmail.com";
    let subject = $("#form-subject").val();
    let name = $("#form-name").val();
    let message = $("#form-msg").val();
    let email = $("#form-email").val();

    let mailtoLink;
    if ($("#form-subject").attr('placeholder').startsWith("Enter")) {
      mailtoLink = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject) + "&body=Hello, my name is " + encodeURIComponent(name) + " my email address is email " + encodeURIComponent(email) + encodeURIComponent('\n' + message);
    } else {
      mailtoLink = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject) + "&body=Hola, mi nombre es " + encodeURIComponent(name) + " mi correo electrónico es " + encodeURIComponent(email) + encodeURIComponent('\n' + message);
    }
    window.open(mailtoLink, "_blank");
  });

  // Cargar Cita Aleatoria
  obtenerCitaAleatoria()
});