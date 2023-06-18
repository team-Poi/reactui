type Listener = (...datas: any[]) => any;

export default class Emitter {
  _events: { [key: string]: Listener[] };
  constructor() {
    this._events = {};
  }

  on(name: string, listener: Listener) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(listener);
  }

  once(name: string, listener: Listener) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    const listen = (...datas: any[]) => {
      listener(...datas);
      this.removeListener(name, listen);
    };

    this._events[name].push(listen);

    return listen;
  }

  removeListener(name: string, listenerToRemove: Listener) {
    if (!this._events[name]) {
      throw new Error(
        `Can't remove a listener. Event "${name}" doesn't exits.`
      );
    }

    const filterListeners = (listener: Listener) =>
      listener !== listenerToRemove;

    this._events[name] = this._events[name].filter(filterListeners);
  }

  emit(name: string, ...datas: any[]) {
    if (!this._events[name]) return;

    const fireCallbacks = (callback: Listener) => {
      callback(...datas);
    };

    this._events[name].forEach(fireCallbacks);
  }
}
