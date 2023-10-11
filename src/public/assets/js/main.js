(function ($) {
  $.fn.glitch = function (options) {
    return this.each(function (key, element) {
      let settings = $.extend(
        {
          chars: "!<>-_\\/[]{}â€”=+*^?#________",
          charTime: 10,
          finalText: undefined,
          done: function () {
            console.log("done!");
          },
        },
        options
      );
      let dfd = $.Deferred();
      let that = "";
      element = $(element);
      let originalText = element.text();
      let TextScramble = (function () {
        let that = {};

        function TextScramble(elementRefrence, chars) {
          if (chars === undefined) {
            that.chars = settings.chars;
          }
          that.element = elementRefrence;
          that.originalText = settings.finalText || elementRefrence.text();
          that.scrambledText = initalizeScramble();
        }

        function initalizeScramble() {
          let scrambleSet = [];
          for (var i = 0; i < that.originalText.length; i++) {
            scrambleSet.push(randomChar());
          }
          return scrambleSet;
        }

        function randomChar() {
          return that.chars[Math.floor(Math.random() * that.chars.length)];
        }

        function setCharAt(str, index, chr) {
          if (index > str.length - 1) return str;
          return str.substr(0, index) + chr + str.substr(index + 1);
        }

        function animateChar(index) {
          let dfd = $.Deferred();
          let timeDiff = Math.floor(Math.random() * 40) + 10;
          let animateAmount = Math.floor(Math.random() * 2) + settings.charTime;
          let intervalSignit = setInterval(function () {
            if (animateAmount === 0) {
              clearInterval(intervalSignit);
              dfd.resolve();
              that.element.text(
                setCharAt(
                  that.element.text(),
                  index,
                  that.originalText.charAt(index)
                )
              );
            } else {
              that.element.text(
                setCharAt(that.element.text(), index, randomChar())
              );
              animateAmount--;
            }
          }, timeDiff);
          return dfd.promise();
        }
        TextScramble.prototype.getScrambledText = function () {
          return that.scrambledText.join("");
        };
        TextScramble.prototype.animate = function () {
          let dfd = $.Deferred();
          let promiseChain = [];
          for (var i = 0; i < element.text().length; i++) {
            promiseChain.push(animateChar(i));
          }
          Promise.all(promiseChain).then(function () {
            dfd.resolve();
          });
          return dfd.promise();
        };
        return TextScramble;
      })();
      let effect = new TextScramble(element);
      element.text(effect.getScrambledText());
      effect.animate().then(function () {
        settings.done(element);
      });
    });
  };
})(jQuery);

function run(e, t, r) {
  $(e)
    .html('<div class="alert alert-' + t + '">' + r + "</div>")
    .slideDown(300);
}

const input = document.querySelector("#phone");
const iti = window.intlTelInput(input, {
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
});

$("span#header").glitch({ charTime: 60 }),
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
  $(document).ready(function () {
    $("#app-order").submit(function (e) {
      e.preventDefault();
      let order = $("#packname").val();
  
      $.ajax({
        type: "POST",
        url: "/planes",
        data: order,
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
    });
  });