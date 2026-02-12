import { expect, Locator } from '@playwright/test';
import { StringUtility } from '@shared/utilities/string-utility';

export const customExpect = expect.extend({
  async toHaveMinimumRate(locator: Locator, expected: number) {
    const receivedLabel = await locator.getByTestId('rating').innerText();
    const receivedValue = StringUtility.extractNumberFromText(receivedLabel);
    const pass = receivedValue >= expected;

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedValue} to be >= ${expected}`
          : `Expected ${receivedValue} to be < ${expected}`,
    };
  },
});