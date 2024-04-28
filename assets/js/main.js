AOS.init();
// You can also pass an optional settings object
// below listed default settings
AOS.init({
  
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 700, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

$(document).ready(()=>{
  // Agregar un evento de clic para el menú desplegable
  $('.dropdown-item').click(function() {
      // Obtener el texto de la opción seleccionada
      var selectedLanguage = $(this).text().trim();
      
      // Realizar acciones según el idioma seleccionado
      if (selectedLanguage === 'SPANISH' || selectedLanguage ==='ESPAÑOL') {
        // Cambiar el contenido de la página al español
        changeLanguaje('es');
      } else if (selectedLanguage === 'ENGLISH' || selectedLanguage ==='ÍNGLES') {
          // Cambiar el contenido de la página al inglés
          changeLanguaje('en');
      }
  });

  
  // Función para cambiar el idioma de la página
  function changeLanguaje(language) {
    fetch('./translate/translation.json')
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
      // Aquí tienes acceso al objeto JSON
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
                    labels.eq(i).attr(atribute,values[i]);
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

  $("#emailForm").submit(function(event) {
    event.preventDefault();
    
    let to = "maximilianorivas01@gmail.com";
    let subject = $("#form-subject").val();
    let name = $("#form-name").val();
    let message = $("#form-msg").val();
    let email = $("#form-email").val();

    let mailto = null;
    if($("#form-subject").attr('placeholder').startsWith("Enter")){
      mailtoLink = "mailto:" + encodeURIComponent(to) + "?subject=" +encodeURIComponent(subject) + "&body=Hello, my name is "+ encodeURIComponent(name) + " my email address is email " + encodeURIComponent(email) + encodeURIComponent('\n'+message);
    }else{
      mailtoLink = "mailto:" + encodeURIComponent(to) + "?subject=" +encodeURIComponent(subject) + "&body=Hola, mi nombre es "+ encodeURIComponent(name) + " mi correo electrónico es " + encodeURIComponent(email) + encodeURIComponent('\n' + message);
    }
    window.open(mailtoLink, "_blank");
  });


});