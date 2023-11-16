function ping() {
  setInterval(function() {
    fetch('/ping').then(response => {
      if (response.ok) {
        console.log('Actividad mantenida.');
      } else {
        console.error('Error al mantener la actividad.');
      }
    });
  }, 10 * 60 * 1000);
}
ping();


const previusTitle = document.title
window.addEventListener('blur', () => {
  previousTitle = document.title
  document.title = 'No te vallas! Vuelve 😭'
})

window.addEventListener('focus', () => {
  document.title = previousTitle
})

function run(e, t, r) {
  $(e)
    .html('<div class="alert alert-' + t + '">' + r + "</div>")
    .slideDown(300);
}

const input = document.querySelector("#phone");
const iti = window.intlTelInput(input, {
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
  initialCountry: "auto",
  geoIpLookup: function(callback) {
    fetch("https://ipapi.co/json")
      .then(function(res) { return res.json(); })
      .then(function(data) { callback(data.country_code); })
      .catch(function() { callback("us"); });
  }
});

  $(document).ready(function () {
    $("#app-login").submit(function (e) {
      e.preventDefault();

      let n = iti.getNumber();
      let p = $("#password").val();
      if (n && p) {
        let formData = {
          phone: n,
          password: p,
        };
        $.ajax({
          type: "POST",
          url: "/login",
          data: formData,
          success: function (res) {
            tod[res.icon]({
              status: res.tit,
              message: res.msg,
              align: "topcenter",
            });
            setTimeout(function () {
              window.location.href = res.ruta;
            }, res.time);
          },
          error: function () {
            tod.danger({
              status: "Error",
              message: "Error en la solicitud al servidor",
              align: "topcenter",
            });
          },
        });
      } else {
        tod.danger({
          status: "Error",
          message: "Debes llenar todos los campos!",
          align: "topcenter",
        });
        navigator.vibrate([500]);
      }
    });
  }),
  $(document).ready(function () {
    $("#app-register").submit(function (e) {
      e.preventDefault();

      let u = $("#username").val();
      let n = iti.getNumber();
      let p = $("#password").val();
      let c = $("#promoCode").val();

      if (u && n && p) {
        if (u.length < 6) {
          tod.warning({
            status: "Alerta",
            message: "El nombre de usuario debe tener al menos 6 caracteres.",
            align: "topcenter",
          });
        } else if (p.length < 6) {
          tod.warning({
            status: "Alerta",
            message: "La contraseña debe tener al menos 6 caracteres.",
            align: "topcenter",
          });
        } else {
          let formData = {
            username: u,
            phone: n,
            password: p,
            promoCode: c,
          };
          $.ajax({
            type: "POST",
            url: "/registro",
            data: formData,
            success: function (res) {
              tod[res.icon]({
                status: res.tit,
                message: res.msg,
                align: "topcenter",
              });
              setTimeout(function () {
                window.location.href = res.ruta;
              }, res.time);
            },
            error: function () {
              tod.danger({
                status: "Error",
                message: "Error en la solicitud al servidor",
                align: "topcenter",
              });
            },
          });
        }
      } else {
        tod.danger({
          status: "Error",
          message: "Debes llenar todos los campos!",
          align: "topcenter",
        });
        navigator.vibrate([500]);
      }
    });
  });