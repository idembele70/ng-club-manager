import { RegisterPayload } from '@libs/domain/models/register-payload.model';
import { test as baseTest } from '@playwright/test';
import { AuthFactory } from '@auth/auth-factory';
import fs from 'node:fs';
import path from 'node:path';
import { AuthUtilities } from './utilities/auth.utilities';

export const expect = baseTest.expect;

const PAYLOAD_LIST: RegisterPayload[] = [
  AuthFactory.buildRegisterPayload('', { clubName: 'test-club-barcelona', managerName: 'test-manager-mourinho' }),
  AuthFactory.buildRegisterPayload('', { clubName: 'test-club-porto', managerName: 'test-manager-guardiola' })
]

export const authTest = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
  workerStorageState: [async ({ browser }, use) => {
    const { parallelIndex } = authTest.info();
    const fileDirectoryPath = path.join('playwright', '.auth');
    const fileName = path.resolve(fileDirectoryPath, `worker-${parallelIndex}-user.json`);

    if (fs.existsSync(fileName)) {
      await use(fileName);
      return;
    }

    const page = await browser.newPage({ storageState: undefined });

    const payload = PAYLOAD_LIST[parallelIndex];
    await AuthUtilities.uiRegister(page, payload);
    await AuthUtilities.uiLogin(page, { managerOrClubName: payload.clubName, password: payload.password });

    fs.mkdirSync(fileDirectoryPath, { recursive: true })
    await page.context().storageState({ path: fileName });
    await page.close();

    await use(fileName);
  }, { scope: 'worker' }],
});