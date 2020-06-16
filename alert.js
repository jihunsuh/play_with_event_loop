window.alertStack = [];

function modal_open() {
  document.getElementById("alert_message").innerText = window.alertStack.shift();
  document.getElementById("alert_modal_background").style.display = "block";
}

function modal_close() {
  if (window.alertStack.length !== 0) {
    modal_open();
  } else {
    document.getElementById("alert_modal_background").style.display = "";
    document.getElementById("alert_message").innerText = "";
  }
}

document.getElementById("alert_modal_close").onclick = (e) => {
  e.preventDefault();
  modal_close();
};

window.onclick = function(event) {
  if (event.target == document.getElementById("alert_modal_background")) {
    modal_close();
  }
};

window.alert = function(message) {
  alertStack.push(message);
  if (document.getElementById("alert_modal_background").style.display === "") {
    modal_open();
  }
};
