import { ZardButtonComponent } from "@/shared/components/button/button.component";
import { ZardIconComponent } from "@/shared/components/icon/icon.component";
import { ZardIcon } from "@/shared/components/icon/icons";
import { ContentComponent } from "@/shared/components/layout/content.component";
import { LayoutComponent } from "@/shared/components/layout/layout.component";
import { SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent } from "@/shared/components/layout/sidebar.component";
import { ZardTooltipDirective } from "@/shared/components/tooltip/tooltip";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, inject, linkedSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { map } from "rxjs";

@Component({
  selector: 'app-authenticated-layout',
  imports: [
    LayoutComponent,
    RouterOutlet,
    SidebarComponent,
    ContentComponent,
    SidebarGroupComponent,
    SidebarGroupLabelComponent,
    ZardIconComponent,
    ZardButtonComponent,
    TranslatePipe,
    ZardTooltipDirective,
  ],
  template: `
  <z-layout
  class="overflow-hidden min-h-[100vh]">
  <z-sidebar class="border-0"
  [class.fixed]="isSmallScreen()"
  [class.inset-y-0]="isSmallScreen()"
  [zWidth]="300"
  [zCollapsed]="sidebarCollapsed()"
  [zCollapsible]="isSmallScreen()"
  [zCollapsedWidth]="100"
  (zCollapsedChange)="sidebarCollapsed.set($event)"
  >
  <nav [class]="'flex h-full flex-col overflow-hidden ' + (sidebarCollapsed() ? 'ga-1 p-1 pt-4' : 'gap-4 p-4') ">
    <z-sidebar-group>
      @if (!sidebarCollapsed()) {
        <z-sidebar-group-label>
          NG CLUB MANAGER
        </z-sidebar-group-label>
      }
    </z-sidebar-group>
    @for (item of menuItems; track item.label) {
      @let label = 'SIDEBAR.' + item.label | translate;
      <button
        type="button"
        z-button
        zType="ghost"
        [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
        [zTooltip]="sidebarCollapsed() ? label : ''"
        zPosition="right"
      >
        <z-icon
          [zType]="item.icon"
          [class]="sidebarCollapsed() ? '' : 'mr-1'"
          />
          @if(!sidebarCollapsed()) {
            <span>{{ label }}</span>
          }
      </button>
    }
  </nav>
</z-sidebar>
  <z-layout>
    <z-content
      class="min-h-[200px]"
      [class.pl-[100px]]="isSmallScreen()"
      >
      <router-outlet />
    </z-content>
  </z-layout>
</z-layout>
  `,
})

export default class AuthenticatedLayoutComponent {
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