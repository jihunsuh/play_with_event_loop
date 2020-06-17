window.alertStack = [];

function modal_open() {
  let { message, caller } = window.alertStack.shift();
  document.getElementById("alert_function").innerHTML = "by " + caller;
  document.getElementById("alert_message").innerText = message;
  document.getElementById("alert_modal_background").style.display = "block";
}

function modal_close() {
  if (window.alertStack.length !== 0) {
    modal_open();
    document.getElementById("alert_modal_left").innerText = window.alertStack.length + " 개 남음";
  } else {
    document.getElementById("alert_modal_background").style.display = "";
    document.getElementById("alert_message").innerText = "";
  }
}

document.getElementById("alert_modal_close").onclick = (e) => {
  e.preventDefault();
  modal_close();
};

document.getElementById("alert_modal_skip").onclick = (e) => {
  e.preventDefault();
  window.alertStack = [];
  modal_close();
};

window.onclick = function(event) {
  if (event.target == document.getElementById("alert_modal_background")) {
    modal_close();
  }
};

window.alert = function(message) {
  alertStack.push({
    message,
    caller: arguments.callee.caller.name,
  });
  if (document.getElementById("alert_modal_background").style.display === "") {
    modal_open();
  }
  document.getElementById("alert_modal_left").innerText = window.alertStack.length + " 개 남음";
};
