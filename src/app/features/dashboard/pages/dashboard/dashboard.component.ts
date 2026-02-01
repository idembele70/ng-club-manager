import { HeaderComponent } from '@/shared/components/layout/header.component';
import { LayoutComponent } from '@/shared/components/layout/layout.component';
import { Component, inject, linkedSignal } from '@angular/core';
import { SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent } from "@/shared/components/layout/sidebar.component";
import { ContentComponent } from "@/shared/components/layout/content.component";
import { ZardIconComponent } from "@/shared/components/icon/icon.component";
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ZardIcon } from '@/shared/components/icon/icons';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';
import { PlayerCardComponent } from "@/features/market/components/player-card/player-card.component";
import { Player } from '@/features/market/models/player.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    SidebarGroupComponent,
    SidebarGroupLabelComponent,
    ZardIconComponent,
    ZardButtonComponent,
    TranslatePipe,
    ZardTooltipDirective,
    PlayerCardComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  protected readonly isSmallScreen = toSignal(inject(BreakpointObserver).observe([
    Breakpoints.XSmall,
    Breakpoints.Small
  ]).pipe(
    map(result => result.matches)
  ), { initialValue: false });
  protected readonly sidebarCollapsed = linkedSignal<boolean>(() => this.isSmallScreen());

  protected readonly menuItems: Array<{
    icon: ZardIcon,
    label: string,
    link: string
  }> = [
    {
      icon: 'house',
      label: 'DASHBOARD',
      link: 'dashboard'
    },
    {
      icon: 'credit-card',
      label: 'TRANSFERT_MARKET',
      link: 'transfert/market'
    }
  ]

}
