import { ZardCommandDividerComponent } from '@/shared/components/zard/command/command-divider.component';
import { ZardCommandEmptyComponent } from '@/shared/components/zard/command/command-empty.component';
import { ZardCommandInputComponent } from '@/shared/components/zard/command/command-input.component';
import { ZardCommandListComponent } from '@/shared/components/zard/command/command-list.component';
import { ZardCommandOptionGroupComponent } from '@/shared/components/zard/command/command-option-group.component';
import { ZardCommandOptionComponent } from '@/shared/components/zard/command/command-option.component';
import { ZardCommandComponent } from '@/shared/components/zard/command/command.component';

export const ZardCommandImports = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandEmptyComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
] as const;
