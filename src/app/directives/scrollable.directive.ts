import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollable]',
  standalone: true
})
export class ScrollableDirective {

  @Output() triggerReached = new EventEmitter<boolean>();

  @HostListener('window:scroll', [])
  onScroll(evt: Event & { target: HTMLElement }) {
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight; // Use o scrollHeight do documento
  
    if (window.pageYOffset + viewportHeight >= scrollHeight) {
      this.triggerReached.emit(true);
    }
  }

}
