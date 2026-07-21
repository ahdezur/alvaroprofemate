export class Timer {
  constructor(element, onTick) {
    this.el = element;
    this.onTick = onTick; // callback externo cada 1s o 10s
    this.intervalId = null;
    this.seconds = 0;
    this.isRunning = false;
  }

  start(initialSeconds) {
    if (this.isRunning) return;
    
    this.seconds = initialSeconds || 0;
    this.isRunning = true;
    
    this.intervalId = setInterval(() => {
      this.seconds++;
      this.onTick(this.seconds);
    }, 1000);
  }

  stop() {
    if (!this.isRunning) return;
    clearInterval(this.intervalId);
    this.isRunning = false;
  }

  render() {
    this.el.style.display = 'block';
    const m = Math.floor(this.seconds / 60);
    const s = this.seconds % 60;
    this.el.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`;
  }

  getSeconds() {
    return this.seconds;
  }
}
