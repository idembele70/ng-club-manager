import { ZardButtonComponent } from "@/shared/components/button/button.component";
import { ZardIconComponent } from "@/shared/components/icon/icon.component";
import { ZardIcon } from "@/shared/components/icon/icons";
import { ContentComponent } from "@/shared/components/layout/content.component";
import { LayoutComponent } from "@/shared/components/layout/layout.component";
import { SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent } from "@/shared/components/layout/sidebar.component";
import { ZardTooltipDirective } from "@/shared/components/tooltip/tooltip";
import { SIDEBAR } from "@/shared/constants/layout.constant";
import { ResponsiveService } from "@/shared/services/responsive.service";
import { Component, computed, inject, linkedSignal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { HORIZONTAL_PADDING_COMPENSATION } from './../../shared/constants/layout.constant';

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
    RouterLink,
  ],
  template: `
  <z-layout
  class="overflow-hidden min-h-[100vh]">
  <!-- [class.]="isSmallScreen()" -->
  <z-sidebar class="fixed border-0"
  [class.inset-y-0]="isSmallScreen()"
  [zWidth]="sidebarCurrentWidth()"
  [zCollapsed]="sidebarCollapsed()"
  [zCollapsible]="isSmallScreen()"
  [zCollapsedWidth]="sidebarCurrentWidth()"
  (zCollapsedChange)="sidebarCollapsed.set($event)"
  >
  <nav [class]="'flex h-full flex-col overflow-hidden ' + (sidebarCollapsed() ? 'gap-1 p-1 pt-4' : 'gap-4 p-4') ">
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
        [routerLink]="item.link"
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
      [style.padding-left.px]="sidebarCurrentWidth() + horizontalPaddingCompensation"
      >
      <router-outlet />
    </z-content>
  </z-layout>
</z-layout>
  `,
})

export default class AuthenticatedLayoutComponent {
  private readonly responsiveService = inject(ResponsiveService);
  protected readonly horizontalPaddingCompensation = HORIZONTAL_PADDING_COMPENSATION;

  protected readonly isSmallScreen = this.responsiveService.isSmallScreen;
  protected readonly sidebarCollapsed = linkedSignal<boolean>(() => this.isSmallScreen());
  protected readonly sidebarCurrentWidth = computed(() =>
    this.isSmallScreen()
      ? SIDEBAR.COLLAPSED_WIDTH
      : SIDEBAR.WIDTH
  );

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
        link: 'market'
      }
    ]
}