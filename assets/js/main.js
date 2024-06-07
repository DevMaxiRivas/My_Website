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
const apiKey = "LmyQcXpZUW63AcyylfcB8S8oCpcPC0cV2tKrabnI";

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

function validarEmail(email) {
  // Expresión regular para validar un email
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


// AL CARGAR EL DOCUMENTO
$(document).ready(() => {
  // Agregar un evento de clic para el menú desplegable
  $('.dropdown-item').click(function () {
    // Obtener el texto de la opción seleccionada
    var selectedLanguage = $(this).text().trim();

    // Realizar acciones según el idioma seleccionado
    if (selectedLanguage === 'SPANISH' || selectedLanguage === 'ESPAÑOL') {
      // Cabiar title de la pagina
      $(document).prop('title', 'Maximiliano Rivas Análista de Sistemas');
      // Cambiar el contenido de la página al español
      changeLanguaje('es');
    } else if (selectedLanguage === 'ENGLISH' || selectedLanguage === 'ÍNGLES') {
      // Cabiar title de la pagina
      $(document).prop('title', 'Maximiliano Rivas System Analyst');
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
  $("#emailForm").submit(async function (event) {

    // Validamos el email
    let email = $("#form-email").val();
    let language = $("#form-subject").attr('placeholder').startsWith("Enter") ? 'en' : 'es';
    event.preventDefault(); // Prevenir el envío del formulario

    if (!validarEmail(email)) {
      if (language == 'en')
        return alert('invalid e-mail address');
      else
        return alert('El correo electrónico no es válido');
    }


    // Envio con API
    const form = new FormData(this);
    const response =
      await fetch(this.action, {
        method: this.method,
        body: form,
        headers: {
          'Accept': 'application/json'
        }
      });

    if (response.ok) {
      this.reset()
      if (language == 'en')
        alert('Thank you for contacting me, I will write you soon');
      else
        alert('Gracias por contactarme, te escribiré pronto');
    } else {
      if (language == 'en')
        alert('An error occurred while sending the form, please reload the page.');
      else
        alert('Ocurrio un error al enviar el formulario, recargue la página');
    }

  });

  // Cargar Cita Aleatoria
  obtenerCitaAleatoria()
});