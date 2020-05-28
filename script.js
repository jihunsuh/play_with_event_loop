class VARIABLE {
  constructor(name, value) {
    if (typeof name !== "string") throw "내 이름이 string이 아님. -VARIABLE";
    if (typeof value === "function") throw "나한테 function을 할당하지 말 것. -VARIABLE";
    if (typeof value === "object") throw "나한테 object를 할당하지 말 것. -VARIABLE";
    if (document.getElementById(name)) throw "이미 내 이름의 VARIABLE이 있음. -VARIABLE";

    this.name = name;
    this.value = value;
  }

  setNode(location) {
    // DOM NODE를 만드는 함수
    if (!document.querySelector(location)) throw "LOCATION이 정확하지 않음. -VARIABLE";

    let { $node, name } = this;
    if (!$node) {
      // node가 없을 경우 html element 생성
      $node = document.createElement("div");
      $node.object = this;
      $node.id = name;
      $node.innerText = name;
      $node.classList.add("variable", "draggable");
      //draggable
      $node.draggable = true;
      $node.ondragstart = (e) => {
        e.dataTransfer.setData("id", e.target.id);
        let draggables = document.getElementsByClassName("draggable");
        for (let i = 0; i < draggables.length; i++) {
          draggables[i].classList.add("whiledrag");
        }
      };
      $node.ondragover = (e) => e.preventDefault();
      $node.ondragend = (e) => {
        e.preventDefault();
        let draggables = document.getElementsByClassName("draggable");
        for (let i = 0; i < draggables.length; i++) {
          draggables[i].classList.remove("whiledrag");
        }
      };
      $node.ondragenter = (e) => {
        e.preventDefault();
        e.target.classList.add("ondragel");
      };
      $node.ondragleave = (e) => {
        e.preventDefault();
        e.target.classList.remove("ondragel");
      };
      $node.ondrop = (e) => {
        e.preventDefault();
        e.target.classList.remove("ondragel");

        if (!e.target.classList.contains("variable")) {
          let id = e.dataTransfer.getData("id");
          try {
            e.target.appendChild(document.getElementById(id));
          } catch (error) {}
        }
      };
      this.$node = $node;
    }
    //location에 추가
    document.querySelector(location).appendChild(this.$node);
  }

  setValue(value) {
    // value를 할당한다.
    if (typeof value === "function")
      throw `나한테 function을 할당하지 말 것. -VARIABLE ${this.name}`;
    if (typeof value === "object") throw `나한테 object를 할당하지 말 것. -VARIABLE ${this.name}`;
    this.value = value;
  }
}

class FUNCTION {
  constructor(name, callback) {
    if (typeof name !== "string") throw "내 이름이 string이 아님. -FUNCTION";
    if (typeof callback !== "function")
      throw "나한테 function이 아닌 것을 할당하지 말 것. -FUNCTION";
    if (document.getElementById(name)) throw "이미 내 이름의 FUNCTION이 있음. -FUNCTION";

    this.name = name;
    this.callback = callback;
  }

  setNode(location) {
    if (!document.querySelector(location)) throw "LOCATION이 정확하지 않음. -FUNCTION";

    let { $node, name } = this;
    if (!$node) {
      // $node가 없으면 html element를 만든다.
      $node = document.createElement("div");
      $node.object = this;
      $node.id = name;
      $node.innerText = name + "()";
      $node.classList.add("function", "draggable");
      //draggable
      $node.draggable = true;
      $node.ondragstart = (e) => {
        e.dataTransfer.setData("id", e.target.id);
        let draggables = document.getElementsByClassName("draggable");
        for (let i = 0; i < draggables.length; i++) {
          draggables[i].classList.add("whiledrag");
        }
      };
      $node.ondragover = (e) => e.preventDefault();
      $node.ondragend = (e) => {
        e.preventDefault();
        let draggables = document.getElementsByClassName("draggable");
        for (let i = 0; i < draggables.length; i++) {
          draggables[i].classList.remove("whiledrag");
        }
      };
      $node.ondragenter = (e) => {
        e.preventDefault();
        e.target.classList.add("ondragel");
      };
      $node.ondragleave = (e) => {
        e.preventDefault();
        e.target.classList.remove("ondragel");
      };
      $node.ondrop = (e) => {
        e.preventDefault();
        e.target.classList.remove("ondragel");

        if (!e.target.classList.contains("variable")) {
          let id = e.dataTransfer.getData("id");
          try {
            e.target.appendChild(document.getElementById(id));
          } catch (error) {}
        }
      };
      this.$node = $node;
    }
    document.querySelector(location).appendChild($node);
  }

  setFunc(callback) {
    if (typeof callback !== "function")
      throw `나한테 function이 아닌 것을 할당하지 말 것. -FUNCTION ${this.name}`;
    this.callback = callback;
  }

  execute() {
    let children = this.$node.children;
    let params = [];
    for (let i = 0; i < children.length; i++) {
      let { object } = children[i];
      if (object instanceof FUNCTION) {
        params.push(object.execute());
      } else if (object instanceof VARIABLE) {
        params.push(object.value);
      }
    }
    return this.callback(...params);
  }
}

document.getElementById("submit_variable").onclick = (e) => {
  e.preventDefault();
  let name = document.getElementById("variable_name").value;
  let value = name;

  if (name) {
    let variable = new VARIABLE(name, value);
    variable.setNode("#codes");
  }

  document.getElementById("variable_name").value = "";
};

document.getElementById("submit_function").onclick = (e) => {
  e.preventDefault();
  let name = document.getElementById("function_name").value;
  let value = (el) => el;

  if (name) {
    let func = new FUNCTION(name, value);
    func.setNode("#codes");
  }

  document.getElementById("function_name").value = "";
};

document.getElementById("codes").ondragover = (e) => e.preventDefault();
document.getElementById("codes").ondrop = (e) => {
  e.preventDefault();
  e.target.classList.remove("ondragel");
  if (!e.target.classList.contains("variable")) {
    let id = e.dataTransfer.getData("id");
    let draggables = document.getElementsByClassName("draggable");
    for (let i = 0; i < draggables.length; i++) {
      draggables[i].classList.remove("whiledrag");
    }
    try {
      e.target.appendChild(document.getElementById(id));
    } catch (error) {}
  }
};

document.getElementById("testing").ondragover = (e) => e.preventDefault();
document.getElementById("testing").ondrop = (e) => {
  e.preventDefault();
  e.target.classList.remove("ondragel");
  if (!e.target.classList.contains("variable")) {
    let id = e.dataTransfer.getData("id");
    let draggables = document.getElementsByClassName("draggable");
    for (let i = 0; i < draggables.length; i++) {
      draggables[i].classList.remove("whiledrag");
    }
    try {
      e.target.appendChild(document.getElementById(id));
    } catch (error) {}
  }
};

let alert_F = new FUNCTION("alert", (...text) => {
  alert(text);
  return text;
});
alert_F.setNode("#codes");

let alert_F2 = new FUNCTION("alert2", (...text) => {
  alert(text);
  return text;
});
alert_F2.setNode("#codes");

let alert_F3 = new FUNCTION("alert3", (...text) => {
  alert(text);
  return text;
});
alert_F3.setNode("#codes");

let alert_F4 = new FUNCTION("alert4", (...text) => {
  alert(text);
  return text;
});
alert_F4.setNode("#codes");

let upperCase_F = new FUNCTION("upperCase", (text) => {
  if (typeof text === "string") {
    return text.toUpperCase();
  } else {
    return text;
  }
});
upperCase_F.setNode("#codes");

let lowerCase_F = new FUNCTION("lowerCase", (text) => {
  if (typeof text === "string") {
    return text.toLowerCase();
  } else {
    return text;
  }
});
lowerCase_F.setNode("#codes");

document.getElementById("submit_codes").onclick = (e) => {
  e.preventDefault();
  let children = document.getElementById("testing").children;
  for (let i = 0; i < children.length; i++) {
    if (children[i].object instanceof FUNCTION) {
      children[i].object.execute();
    }
  }
};

document.getElementById("type_variable").onchange = (e) => {
  if (e.target.value === "boolean") {
    document.getElementById("variable_name").style.display = "none";
    document.getElementById("variable_boolean").style.display = "inline-block";
  } else {
    document.getElementById("variable_name").style.display = "inline-block";
    document.getElementById("variable_boolean").style.display = "none";
  }
};

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

// class CALLSTACK {
//   constructor(location) {
//     if (!document.querySelector(location)) throw "내가 있을 자리가 보이지 않음. -CALLSTACK";
//     this.$spot = document.querySelector(location);
//     this.stack = [];
//   }

//   execute(location, step) {
//     if (!document.querySelector(location)) throw "내가 실행할 블록들이 보이지 않음. -CALLSTACK";
//     let children = document.querySelector(location).children;
//     for (let i = 0; i < children.length; i++) {
//       if (children[i].object instanceof FUNCTION) {
//       } else if (children[i].object instanceof VARIABLE) {
//       }
//     }
//   }
// }
