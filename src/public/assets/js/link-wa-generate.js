$(function () {
  $("#get-link-submit").click(function (e) {
    e.preventDefault();

    const url = buildUrl();

    $("#get-link-result").text(url).select();
    $("#get-link-open").attr("href", url);
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