import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SUPPORTED_LANGS, DEFAULT_LANG } from './core/config/i18n.config';

@Component({
  selector: 'app-root',
  imports: [
    TranslatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
    private readonly translateService = inject(TranslateService);

  ngOnInit(): void {
    this.loadLang();
  }

  private loadLang() {
    this.translateService.addLangs([...SUPPORTED_LANGS]);
    const browserLang = this.translateService.getBrowserLang();
    const langRegex = new RegExp(SUPPORTED_LANGS.join('|'));
    const lang = browserLang?.match(langRegex) ? browserLang : DEFAULT_LANG;
    this.translateService.use(lang);
  }
}
