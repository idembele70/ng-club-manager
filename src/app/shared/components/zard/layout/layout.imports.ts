import { ContentComponent } from '@/shared/components/zard/layout/content.component';
import { FooterComponent } from '@/shared/components/zard/layout/footer.component';
import { HeaderComponent } from '@/shared/components/zard/layout/header.component';
import { LayoutComponent } from '@/shared/components/zard/layout/layout.component';
import {
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
} from '@/shared/components/zard/layout/sidebar.component';

export const LayoutImports = [
  LayoutComponent,
  HeaderComponent,
  FooterComponent,
  ContentComponent,
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
] as const;
