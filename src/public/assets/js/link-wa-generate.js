$(function () {
  $("#get-link-submit").click(function (e) {
    e.preventDefault();

    const url = buildUrl();

    $("#get-link-result").text(url).select();
    $("#get-link-open").attr("href", url);

    qrlg($("#get-link-result").text())
  });

  $("#get-link-copy").click(function (e) {
    e.preventDefault();

    const url = $("#get-link-result").text();

    navigator.clipboard.writeText(url);
  });

  function buildUrl() {
    const phone = $("#get-link-phone").val().replace(/\D/g, "");
    const message = $("#get-link-message").val();
    const host = "https://api.whatsapp.com/send";

    const url = new URL(host);

    url.searchParams.set("phone", phone);
    url.searchParams.set("text", message);

    return url;
  }
});

function qrlg(link) {
  document.getElementById("get-link-result").value = link;
  document.getElementById("linkqrcode").innerHTML = "";
  var qrcode = new QRCode(document.getElementById("linkqrcode"), {
    text: link,
    width: 185,
    height: 185,
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}
function download_qr_image() {
  if ($("#linkqrcode canvas") && $("#linkqrcode canvas")[0]) {
    canvas = $("#linkqrcode canvas")[0];
    var dataURL = canvas.toDataURL("image/png", 1.0);
    if (dataURL) {
      downloadImage(dataURL, "drk-bot_qr.png");
    }
  }
}
function downloadImage(data, filename = "untitled.jpeg") {
  var a = document.createElement("a");
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}