import {Injectable, signal} from '@angular/core';
import {ToastMessage} from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messages = signal<ToastMessage[]>([])

  constructor() { }

  add(toast: ToastMessage, timeToLiveSeconds: number | 'indefinite' = 'indefinite'): ToastMessage {
    const t = structuredClone(toast)
    this.messages.set([...this.messages(), t]);
    if (timeToLiveSeconds !== 'indefinite') {
      setTimeout(() => {
        this.remove(t);
      }, timeToLiveSeconds * 1000);
    }
    return t;
  }

  remove(toast: ToastMessage) {
    const toasts = this.messages();
    this.messages.set(toasts.filter(t => t !== toast));
  }
}
