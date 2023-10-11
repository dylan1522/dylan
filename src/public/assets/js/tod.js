"use strict";
const tod = (function (o) {
  let t,
    e = !1,
    n = "",
    i = function () {
      o("body").prepend(
        "<style>*{box-sizing:border-box}@keyframes slideRight{0%{transform:translateX(100px)}70%{transform:translateX(-30px)}100%{transform:translateX(0)}}@keyframes slideLeft{0%{transform:translateX(-100px)}70%{transform:translateX(30px)}100%{transform:translateX(0)}}@keyframes slideDown{0%{transform:translateY(-100px)}70%{transform:translateY(30px)}100%{transform:translateY(0)}}@keyframes slideUp{0%{transform:translateY(100px)}70%{transform:translateY(-30px)}100%{transform:translateY(0)}}.Todtopright{left:initial;right:20px;animation:slideRight .8s}.Todtopleft{left:20px;animation:slideLeft .8s}.Todtopcenter{left:0;right:0;text-align:center;animation:slideDown .8s}.Todbottomcenter{left:0;right:0;bottom:20px;top:initial!important;text-align:center;animation:slideUp .8s}.Todbottomleft{left:20px;bottom:20px;top:initial!important;animation:slideLeft .8s}.Todbottomright{right:20px;bottom:20px;top:initial!important;animation:slideRight .8s}.TodContainer{position:fixed;top:20px;z-index:999999}.tod{display:inline-block;text-align:left;padding:10px 0;background-color:var(--background);border-radius:var(--radius);width:285px;top:0;position:relative;-webkit-box-shadow:var(--shadow);box-shadow:var(--shadow);transition:all .8s ease-in;z-index:99999}.tod:before{content:'';position:absolute;top:0;left:0;width:0px;height:100%;border-top-left-radius:4px;border-bottom-left-radius:4px}.TodIcon{position:absolute;top:50%;left:15px;transform:translateY(-50%);width:30px;height:30px;padding:5px;border-radius:50%;display:inline-block;font-size:15px;font-weight:700;text-align:center;padding-top:1px;color:#fff}.TodIcon svg{position:relative;top:4px}.TodStatus{text-transform:var(--status-transform);color:var(--status-color);font-weight:700;margin-top:0;margin-bottom:2px;font-size:var(--status-size);font-family:var(--status-font)}.TodMessage{font-family:var(--message-font);font-size:var(--message-size);text-transform:var(--message-transform);margin-top:0;margin-bottom:0;color:var(--message-color)}.TodContent{padding-left:60px;padding-right:40px}.Tod__close{display:none;position:absolute;right:15px;top:38%;width:14px;cursor:pointer;height:14px;color:#ada9a9;transform:translateY(-50%);font-size:28px}.TodLove .TodIcon{background-color:var(--love)}.TodLove:before{background-color:var(--love)}.TodWarning .TodIcon{background-color:var(--warning)}.TodWarning:before{background-color:var(--warning)}.TodSuccess .TodIcon{background-color:var(--success)}.TodSuccess:before{background-color:var(--success)}.TodInfo .TodIcon{background-color:var(--info)}.TodInfo:before{background-color:var(--info)}.TodDanger .TodIcon{background-color:var(--danger)}.TodDanger:before{background-color:var(--danger)}.tod-loader{border:3px solid var(--loader-color-1);border-radius:50%;border-top:3px solid var(--loader-color-2);width:28px;height:28px;-webkit-animation:todSpin var(--loader-speed) linear infinite;animation:todSpin var(--loader-speed) linear infinite;margin-left:-6px}@-webkit-keyframes todSpin{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes todSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.tod-line-loader{position:fixed;top:0;left:0;right:0;z-index:99999;height:5px;background-color:var(--line-color-1);background-image:linear-gradient(-45deg,var(--line-color-2) 25%,transparent 25%,transparent 50%,var(--line-color-2) 50%,var(--line-color-2) 75%,transparent 75%,transparent);background-size:30px 30px;animation:move 1s linear infinite}@keyframes move{0%{background-position:0 0}100%{background-position:30px 30px}}</style>"
      ),
        o("body").append('<div id="tod"></div>'),
        (e = !0);
    },
    a = function (t) {
      o(t).fadeOut(1e3, function () {
        t.remove();
      });
    },
    s = function (o, t) {
      setTimeout(function () {
        a(o);
      }, t || 3e3);
    };
  return {
    love: function (a) {
      !(function (a) {
        (n = a.align ? a.align.toLowerCase() : "topright"),
          (t = o(
            '<div class="TodContainer Tod' +
              n +
              '" onclick="tod.TodRemove(this)"><div class="tod TodLove"><div class="TodIcon"><svg width="16" height="16" fill="#fff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 471.701 471.701" style="position:relative;top:6px;enable-background:new 0 0 471.701 471.701;" xml:space="preserve"><g><path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3C444.801,187.101,434.001,213.101,414.401,232.701z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div><div class="TodContent"><p class="TodStatus">' +
              a.status +
              '</p><p class="TodMessage">' +
              a.message +
              '</p></div><div class="Tod__close"> × </div></div></div>'
          )),
          e || i(),
          o("#tod").append(t),
          s(t, a.delay);
      })(a);
    },
    warning: function (a) {
      !(function (a) {
        (n = a.align ? a.align.toLowerCase() : "topright"),
          (t = o(
            '<div class="TodContainer Tod' +
              n +
              '" onclick="tod.TodRemove(this)"><div class="tod TodWarning"><div class="TodIcon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.8576 4.3728C12.4692 3.72546 11.531 3.72546 11.1426 4.3728L2.67497 18.4855C2.27506 19.152 2.75517 20 3.53246 20H20.4677C21.245 20 21.7251 19.152 21.3252 18.4855L12.8576 4.3728ZM9.4276 3.34381C10.5928 1.40179 13.4074 1.4018 14.5726 3.34381L23.0402 17.4565C24.2399 19.4561 22.7996 22 20.4677 22H3.53246C1.20058 22 -0.239756 19.4561 0.959987 17.4565L9.4276 3.34381ZM12.0001 8C12.5524 8 13.0001 8.44771 13.0001 9V13C13.0001 13.5523 12.5524 14 12.0001 14C11.4478 14 11.0001 13.5523 11.0001 13V9C11.0001 8.44771 11.4478 8 12.0001 8ZM12.0001 15C12.5524 15 13.0001 15.4477 13.0001 16V17C13.0001 17.5523 12.5524 18 12.0001 18C11.4478 18 11.0001 17.5523 11.0001 17V16C11.0001 15.4477 11.4478 15 12.0001 15Z" fill="#fff"/></svg></div><div class="TodContent"><p class="TodStatus">' +
              a.status +
              '</p><p class="TodMessage">' +
              a.message +
              '</p></div><div class="Tod__close"> × </div></div></div>'
          )),
          e || i(),
          o("#tod").append(t),
          s(t, a.delay);
      })(a);
    },
    success: function (a) {
      !(function (a) {
        (n = a.align ? a.align.toLowerCase() : "topright"),
          (t = o(
            '<div class="TodContainer Tod' +
              n +
              '" onclick="tod.TodRemove(this)"><div class="tod TodSuccess"><div class="TodIcon"><svg class="lhine" xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></div><div class="TodContent"><p class="TodStatus">' +
              a.status +
              '</p><p class="TodMessage">' +
              a.message +
              '</p></div><div class="Tod__close"> × </div></div></div>'
          )),
          e || i(),
          o("#tod").append(t),
          s(t, a.delay);
      })(a);
    },
    danger: function (a) {
      !(function (a) {
        (n = a.align ? a.align.toLowerCase() : "topright"),
          (t = o(
            '<div class="TodContainer  Tod' +
              n +
              '"  onclick="tod.TodRemove(this)"><div  class="tod TodDanger"><div class="TodIcon"><svg fill="#fff"  viewBox="0 0 48 48"  xmlns="http://www.w3.org/2000/svg"><path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/><path d="M0 0h48v48h-48z" fill="none"/></svg></div><div class="TodContent"><p class="TodStatus">' +
              a.status +
              '</p><p class="TodMessage">' +
              a.message +
              '</p></div><div class="Tod__close"> × </div></div></div>'
          )),
          e || i(),
          o("#tod").append(t),
          s(t, a.delay);
      })(a);
    },
    info: function (a) {
      !(function (a) {
        (n = a.align ? a.align.toLowerCase() : "topright"),
          (t = o(
            '<div class="TodContainer  Tod' +
              n +
              '" onclick="tod.TodRemove(this)"><div  class="tod TodInfo"><div class="TodIcon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M16 14 L16 23 M16 8 L16 10" /> <circle cx="16" cy="16" r="14" /></svg></div><div class="TodContent"><p class="TodStatus">' +
              a.status +
              '</p><p class="TodMessage">' +
              a.message +
              '</p></div><div class="Tod__close"> × </div></div></div>'
          )),
          e || i(),
          o("#tod").append(t),
          s(t, a.delay);
      })(a);
    },
    TodRemove: function (o) {
      a(o);
    },
    loading: function (a) {
      return (function (a) {
        let s = "";
        return (
          1 == a.line && (s = '<div class="tod-line-loader"></div>'),
          (n = a.align ? a.align.toLowerCase() : "topright"),
          (t = o(
            "<div> " +
              s +
              '<div class="TodContainer Tod' +
              n +
              '" ><div  class="tod"><div class="TodIcon" style="background:transparent"><div class="tod-loader"></div> </div><div class="TodContent"><p class="TodStatus">' +
              a.status +
              '</p><p class="TodMessage">' +
              a.message +
              "</p></div></div></div></div>"
          )),
          e || i(),
          o("#tod").append(t),
          t
        );
      })(a);
    },
  };
})(jQuery);
