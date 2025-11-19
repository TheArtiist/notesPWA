import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverHighlight]',
  standalone: true
})
export class HoverHighlightDirective {
  @Input() appHoverHighlight: string = '#e0f7fa';

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.element.nativeElement, 'box-shadow', `0 0 10px ${this.appHoverHighlight}`);
    this.renderer.setStyle(this.element.nativeElement, 'transform', 'scale(1.02)');
    this.renderer.setStyle(this.element.nativeElement, 'transition', 'all 0.2s ease');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.element.nativeElement, 'box-shadow');
    this.renderer.removeStyle(this.element.nativeElement, 'transform');
  }
}
