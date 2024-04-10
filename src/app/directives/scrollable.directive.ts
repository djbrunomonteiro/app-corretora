import { isPlatformBrowser } from '@angular/common';
import { Directive, EventEmitter, HostListener, Inject, Output, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appScrollable]',
  standalone: true
})
export class ScrollableDirective {

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
  ){}

  @Output() triggerReached = new EventEmitter<boolean>();

  @HostListener('window:scroll', [])
  onScroll(evt: Event & { target: HTMLElement }) {
    if(isPlatformBrowser(this.platformId)){
      const viewportHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight; // Use o scrollHeight do documento
    
      if (window.pageYOffset + viewportHeight >= scrollHeight) {
        this.triggerReached.emit(true);
      }

    }
    
  }

}
