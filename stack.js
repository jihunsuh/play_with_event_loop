window.callStack = [];

/*



*/

class BLOCKSTACK {
  constructor(printer) {
    if (!document.querySelector(printer)) throw "출력할 엘리먼트가 존재하지 않습니다";

    this.$printer = document.querySelector(printer);

    this.stack = [];
  }

  getChildBlocks(target) {
    if (!(target instanceof HTMLElement)) {
      if (!document.querySelector(target)) throw "추적할 엘리먼트가 존재하지 않습니다";
      target = document.querySelector(target);
    }

    let blocks = [];
    let children = target.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].object instanceof FUNCBLOCK) {
        blocks.push(children[i]);
      }
    }

    return blocks;
  }

  getStacks(target, param) {
    let this_params = [];
    let childblocks = this.getChildBlocks(target);

    if (target.object instanceof FUNCBLOCK) {
      this.stack.push(() => {
        target.object.locate(this.$printer, -1);
      });
    }
    if (childblocks.length !== 0) {
      childblocks.map((el) => {
        this.getStacks(el, this_params);
      });
    }
    if (target.object instanceof FUNCBLOCK) {
      this.stack.push(() => {
        param.push(target.object.call(...this_params));
        target.object.locate(".playground");
      });
    }
  }
  next() {
    if (this.stack.length >= 1) {
      this.stack.shift()();
      return true;
    } else {
      return false;
    }
  }

  callAll() {
    for (let i = 0; i < this.stack.length; i++) {
      window.setTimeout(this.next.bind(this), 1000 * i);
    }
  }
}

let stack = new BLOCKSTACK("#call_stack");
stack.getStacks(".call_codes");

document.getElementById("step_next").onclick = (e) => {
  if (!stack.next()) {
    stack.getStacks(".call_codes");
    stack.next();
  }
};

document.getElementById("step_all").onclick = (e) => {
  if (!stack.next()) {
    stack.getStacks(".call_codes");
  }
  stack.callAll();
};
