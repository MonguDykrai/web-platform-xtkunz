class Rectangle {
  constructor(xpoint, ypoint, width, height, color, context) {
    this.xpoint = xpoint;
    this.ypoint = ypoint;
    this.width = width;
    this.height = height;
    this.color = color;
    this.path2DInstance = null;
    this.context = context; // 画布上下文
    this.isTarget = false; // 事件对象
    this.uuid = Date.now() + `${parseInt(Math.random() * 10000000)}`;
  }

  draw(color = '') {
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath
    // https://www.rgraph.net/blog/path-objects.html
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
    this.path2DInstance = new Path2D();
    this.path2DInstance.rect(this.xpoint, this.ypoint, this.width, this.height);
    this.context.strokeStyle = 'red'; // 路径颜色
    this.context.lineWidth = 3; // 路径宽度
    this.context.fillStyle = color || this.color; // 填充的颜色
    this.context.stroke(this.path2DInstance); // 绘制路径
    this.context.fill(this.path2DInstance); // 填色
  }

  /**
   * 激活元素（用户选中元素）
   */
  activity() {
    this.draw('yellow');
  }

  /**
   * 元素失活与被元素激活相对
   */
  inactivity() {
    this.draw(this.color);
  }

  clickRectangle(xmouse, ymouse) {
    this.inactivity(); // 变更为失活状态

    if (this.context.isPointInPath(this.path2DInstance, xmouse, ymouse)) {
      this.isTarget = true;
    } else {
      this.isTarget = false;
    }
  }
}

class Canvas {
  constructor({ width, height, canvasId, backgroundColor = '#444' }) {
    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;
    this.backgroundColor = backgroundColor;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.canvas.style.backgroundColor = this.backgroundColor;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.addClickEventListener();
    this.eles = [];
    this.target = null; // 事件对象
  }

  addRect({ x, y, width, height, color }) {
    const rect = new Rectangle(x, y, width, height, color, this.context);
    this.eles.push(rect);
    rect.draw();
  }

  addClickEventListener(isStopBubble = false) {
    this.canvas.addEventListener('click', (event) => {
      this.eles.forEach((ele) => (ele.isTarget = false)); // 重置 isTarget

      if (isStopBubble) {
      } else {
        this.eles.forEach((ele) => {
          ele.clickRectangle(event.layerX, event.layerY);
        });
      }

      const targets = this.eles.filter((ele) => ele.isTarget);
      if (targets.length) {
        let targetIndex = 0; // 目标事件对象索引
        let target = targets.pop(); // 取出事件对象
        target.activity(); // 激活目标事件对象
        this.eles.some((ele, index) => {
          if (ele.uuid === target.uuid) {
            targetIndex = index;
            return true;
          }
        });
        this.eles.splice(targetIndex, 1); // 将事件对象从元素列表中移除（被点击的元素优先级需要提高！！！）
        // this.target = target; // 用户当前选中的元素
        this.eles.push(target); // 将事件对象添加到元素列表最后，保证元素被赋予最高优先级
      }
    });
  }
}

const canvas = new Canvas({
  canvasId: 'canvas',
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
});

canvas.addRect({
  x: 100,
  y: 100,
  width: 40,
  height: 60,
  color: 'orange',
});

canvas.addRect({
  x: 120,
  y: 120,
  width: 40,
  height: 60,
  color: 'purple',
});

canvas.addRect({
  x: 90,
  y: 90,
  width: 40,
  height: 60,
  color: 'ivory',
});
