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
    if (!document.querySelector(location)) throw "LOCATION이 정확하지 않음. -VARIABLE";

    let { $node, name } = this;
    if (!$node) {
      // $node가 없으면 html element를 만든다.
      $node = document.createElement("div");
      $node.this = this;
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
    }
    //location에 추가
    document.querySelector(location).appendChild($node);
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
    this.params = [];
  }

  setNode(location) {
    if (!document.querySelector(location)) throw "LOCATION이 정확하지 않음. -FUNCTION";

    let { $node, name } = this;
    if (!$node) {
      // $node가 없으면 html element를 만든다.
      $node = document.createElement("div");
      $node.this = this;
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
    }
    document.querySelector(location).appendChild($node);
  }

  setFunc(callback) {
    if (typeof callback !== "function")
      throw `나한테 function이 아닌 것을 할당하지 말 것. -FUNCTION ${this.name}`;
    this.callback = callback;
  }

  execute() {
    for (let i of this.params) {
      if (this.params[i] instanceof FUNCTION) {
        this.params[i] = this.params[i].execute();
      } else if (this.params[i] instanceof VARIABLE) {
        this.params[i] = this.params[i].value;
      }
    }
    return this.trigger(...this.params);
  }
}

document.getElementById("submit_variable").onclick = (e) => {
  e.preventDefault();
  let name = document.getElementById("variable_name").value;
  let value = Math.floor(Math.random() * 10);

  let variable = new VARIABLE(name, value);
  variable.setNode("#playground");

  document.getElementById("variable_name").value = "";
};

document.getElementById("submit_function").onclick = (e) => {
  e.preventDefault();
  let name = document.getElementById("function_name").value;
  let value = () => {};

  let func = new FUNCTION(name, value);
  func.setNode("#playground");

  document.getElementById("function_name").value = "";
};

document.getElementById("playground").ondragover = (e) => e.preventDefault();
document.getElementById("playground").ondrop = (e) => {
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

let alert_F = new FUNCTION("alert", (text) => {
  alert(text);
});
alert_F.setNode("#playground");

let upperCase_F = new FUNCTION("upperCase", (text) => {
  if (typeof text === "string") {
    return text.toUpperCase();
  } else {
    return text;
  }
});
upperCase_F.setNode("#playground");
