import { Directive, DOCUMENT, inject, input, NgZone, OnDestroy, OnInit, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly ngZone = inject(NgZone);
  private readonly threshold = 400;
  private removeListener?: () => void;

  canLoadMore = input.required<boolean>();
  loadMore = output();

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.listenScroll())
  }

  ngOnDestroy(): void {
    this.removeListener?.();
  }

  listenScroll(): void {
    this.removeListener = this.renderer.listen(this.document, 'scroll', () => {
      const target = this.document;
      const { scrollHeight, scrollTop, clientHeight } = target.documentElement;
      const scrollMaxHeight = scrollHeight - clientHeight;
      const scrollPosition = Math.ceil(scrollTop);
      if (
        scrollPosition + this.threshold >= scrollMaxHeight &&
        this.canLoadMore()
      ) {
        this.ngZone.run(() => this.loadMore.emit());
      }
    });
  }
}
