import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appWithoutImage]'
})
export class WithoutImageDirective {

  constructor( private elementRef: ElementRef ) { }

  @HostListener('error')
  loadDefaultImage(){
    const element = this.elementRef.nativeElement;
    element.src = 'https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/13/1490989105-twitter1.jpg?resize=480:*'
  }

}
