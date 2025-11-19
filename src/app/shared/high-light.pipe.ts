import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highLight',
  standalone: true
})
export class HighLightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTearm: string): SafeHtml {
    if (!searchTearm || !value) return value;

    const escapedTerm = searchTearm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(escapedTerm, 'gi');
    const result = value.replace(re, match =>
      `<span style="background-color: yellow">${match}</span>`
    );

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

}
