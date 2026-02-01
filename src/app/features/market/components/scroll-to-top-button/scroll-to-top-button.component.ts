import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardIconComponent } from '@/shared/components/icon/icon.component';
import { ResponsiveService } from '@/shared/services/responsive.service';
import { Component, DOCUMENT, inject, NgZone, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top-button',
  imports: [
    ZardButtonComponent,
    ZardIconComponent
  ],
  template: `
    <div [hidden]="isScrollTopButtonHidden()" [style.left.px]="responsiveService.sidebarCurrentWidth()" class="fixed bottom-2 right-0 flex justify-center mt-4">
      <button (click)="scrollToTop()" z-button zType="outline"><i z-icon zType="arrow-up"></i></button>
    </div>
  `,
  styles: ``,
})
export class ScrollToTopButtonComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly ngZone = inject(NgZone);
  private readonly threshold = 300;
  private removeListener?: () => void;


  protected readonly responsiveService = inject(ResponsiveService);

  isScrollTopButtonHidden = signal<boolean>(true);

  scrollToTop(): void {
    this.document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.listenScroll());
  }

  ngOnDestroy(): void {
    this.removeListener?.();
  }

  private listenScroll(): void {
    const target = this.document;
    this.removeListener = this.renderer.listen(target, 'scroll', () =>
      this.toggleScrollToTopBtn(target.documentElement)
    )
  }

  private toggleScrollToTopBtn(target: HTMLElement): void {
    const scrollTop = target.scrollTop;
    if (scrollTop > this.threshold && this.isScrollTopButtonHidden()) {
      this.ngZone.run(() => this.isScrollTopButtonHidden.set(false));
    } else if (scrollTop < this.threshold && !this.isScrollTopButtonHidden()) {
      this.ngZone.run(() => this.isScrollTopButtonHidden.set(true));
    }
  }

}
