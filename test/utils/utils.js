/**
 * (C) Copyright IBM Corp. 2025.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

class MockingRequest {
  constructor(moduleInstance, functionName) {
    this.functionMock = null;
    this.moduleInstance = moduleInstance;
    this.functionName = functionName;
  }

  mock(response) {
    if (response)
      this.functionMock = jest
        .spyOn(this.moduleInstance, this.functionName)
        .mockImplementation(async () => response);
    else this.functionMock = jest.spyOn(this.moduleInstance, this.functionName);
  }

  unmock() {
    if (this.functionMock) {
      this.functionMock.mockRestore();
      this.functionMock = null;
    }
  }

  clearMock() {
    if (this.functionMock) {
      this.functionMock.mockClear();
    }
  }
}

module.exports = { wait, MockingRequest };
