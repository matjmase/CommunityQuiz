import { Subject, Observable } from 'rxjs';

export class FormModalModel<T, K> {
  private open = new Subject<T>();
  private close = new Subject<K>();

  OnOpen(): Observable<T> {
    return this.open;
  }

  OpenInit(val: T) {
    this.open.next(val);
  }

  OnClose(): Observable<K> {
    return this.close;
  }

  CloseInit(item: K): void {
    this.close.next(item);
  }
}
