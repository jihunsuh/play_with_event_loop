let blocks = [
  {
    name: "Apple",
    value: "apple",
    type: "variable",
  },
  {
    name: "Banana",
    value: "banana",
    type: "variable",
  },
  {
    name: "Clock",
    value: "clock",
    type: "variable",
  },
  {
    name: "alert",
    value: function(...params) {
      window.alert(params);
      return params;
    },
    type: "function",
  },
];

function dragable($node) {
  $node.draggable = true;
  $node.ondragstart = function(e) {
    e.dataTransfer.setData("id", e.target.id);
    let dropables = document.querySelectorAll(".dropable");
    for (let i = 0; i < dropables.length; i++) {
      dropables[i].classList.add("whiledrag");
    }
  };

  $node.ondragend = (e) => {
    e.preventDefault();
    let draggables = document.getElementsByClassName("dropable");
    for (let i = 0; i < draggables.length; i++) {
      draggables[i].classList.remove("whiledrag");
    }
  };

  $node.ondragenter = (e) => {
    e.preventDefault();
    if (e.target.classList.contains("dropable")) {
      e.target.classList.add("ondragel");
    }
  };
  $node.ondragleave = (e) => {
    e.preventDefault();
    e.target.classList.remove("ondragel");
  };
  return $node;
}

function dropable($node) {
  $node.classList.add("dropable");
  $node.ondragover = function(e) {
    e.preventDefault();
  };
  $node.ondrop = function(e) {
    e.preventDefault();
    if (!e.target.classList.contains("info")) e.stopPropagation();
    e.target.classList.remove("ondragel");

    let id = e.dataTransfer.getData("id");
    document.getElementById(id).object.locate($node);
  };
  return $node;
}

class BLOCK {
  constructor(name, value) {
    if (typeof name !== "string") throw "이름은 문자열로 넣어 주세요";
    if (document.getElementById(name)) throw "해당하는 이름의 엘리먼트가 이미 존재합니다";

    this.value = value;
    this.type = "block";

    this.$node = document.createElement("div");
    this.$node.id = name;
    this.$node.textContent = name;
    this.$node.object = this;
    this.$node = dragable(this.$node);
    this.$node.className = "block";

    let info = document.createElement("div");
    info.className = "info";
    info.textContent = value.toString();
    info.style.display = "none";
    this.$node.appendChild(info);

    this.$node.onclick = ((e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setinfo("toggle");
    }).bind(this);
  }

  locate(selector) {
    if (selector instanceof HTMLElement) {
      selector.appendChild(this.$node);
    } else if (typeof selector === "string") {
      if (document.querySelector(selector)) {
        document.querySelector(selector).appendChild(this.$node);
      }
    }
  }

  setinfo(order) {
    switch (order) {
      case "toggle":
        this.$node.querySelector(".info").style.display =
          this.$node.querySelector(".info").style.display === "none" ? "block" : "none";
        break;
      case "show":
        this.$node.querySelector(".info").style.display = "block";
        break;
      case "hide":
        this.$node.querySelector(".info").style.display = "none";
        break;
    }
  }

  toObj() {
    return {
      name: this.name,
      value: this.value,
      type: this.type,
    };
  }

  call() {}
}

class VARBLOCK extends BLOCK {
  constructor(name, value) {
    super(name, value);
    this.$node.classList.add("variable");
    this.type = "variable";
  }

  call() {
    return this.value;
  }
}

class FUNCBLOCK extends BLOCK {
  constructor(name, value) {
    if (typeof value !== "function") throw "적절한 함수를 넣어 주세요";
    super(name, value);
    this.$node = dropable(this.$node);
    this.$node.classList.add("function");
    this.type = "function";
  }

  call() {
    let child = this.$node.children;
    let params = [];
    for (let i = 0; i < child.length; i++) {
      if (child[i].object instanceof BLOCK) {
        params.push(child[i].object.call());
      }
    }
    return this.value(...params);
  }
}

blocks.forEach((el) => {
  let block;
  if (el.type === "function") block = new FUNCBLOCK(el.name, el.value);
  else if (el.type === "variable") block = new VARBLOCK(el.name, el.value);
  document.querySelector(".playground").appendChild(block.$node);
});

dropable(document.querySelector(".playground"));
dropable(document.querySelector(".call_codes"));

document.getElementById("type").onchange = (e) => {
  if (e.target.value === "variable") {
    document.getElementById("var_value").style.display = "inline";
    document.getElementById("func_value").style.display = "none";
  } else if (e.target.value === "function") {
    document.getElementById("var_value").style.display = "none";
    document.getElementById("func_value").style.display = "inline";
  }
};

document.getElementById("submit").onclick = (e) => {
  e.preventDefault();
  document.getElementById("error_message").textContent = "";

  try {
    let name = document.getElementById("name").value;
    if (name === "") throw "이름을 입력해 주세요";
    let type = document.getElementById("type").value;

    if (type === "function") {
      let params = document.getElementById("func_value_params").value;
      let func = document.getElementById("func_value_func").value;
      eval(`function test(${params}) {
          ${func}
        }`);

      let block = new FUNCBLOCK(name, test);

      blocks.push(block.toObj());

      document.querySelector(".playground").appendChild(block.$node);
    } else if (type === "variable") {
      let value = document.getElementById("var_value").value;
      let block = new VARBLOCK(name, value);

      blocks.push(block.toObj());

      document.querySelector(".playground").appendChild(block.$node);
    }

    document.getElementById("name").value = "";
    document.getElementById("var_value").value = "";
    document.getElementById("func_value_params").value = "";
    document.getElementById("func_value_func").value = "";
  } catch (err) {
    document.getElementById("error_message").textContent = err.toString();
    throw err;
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    let blocks = document.getElementsByClassName("block");
    let isTabed = true;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].querySelector(".info").style.display === "none") {
        isTabed = false;
      }
    }
    if (isTabed) {
      for (let i = 0; i < blocks.length; i++) {
        blocks[i].object.setinfo("hide");
      }
    } else {
      for (let i = 0; i < blocks.length; i++) {
        blocks[i].object.setinfo("show");
      }
    }
  }
});

document.getElementById("submit_codes").onclick = (e) => {
  e.preventDefault();
  let codes = document.querySelector(".call_codes").querySelectorAll(".block");
  for (let i = 0; i < codes.length; i++) {
    codes[i].object.call();
  }
};
