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

  getStacks(target) {
    this.stack = [];
    let childblocks = this.getChildBlocks(target);

    if (target.object instanceof FUNCBLOCK) {
      this.stack.push(() => {
        target.object.locate(this.$printer);
      });
    }
    if (childblocks.length !== 0) {
      childblocks.map((el) => {
        this.getStacks(el);
      });
    }
    this.stack.push((...params) => {
      target.object.call(...params);
      target.object.locate(".playground");
    });
  }

  callOnce() {}
  next() {}
}
