/**
 * (C) Copyright IBM Corp. 2020.
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

import os = require('os');

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

export type SdkHeaders = {
  'User-Agent': string;
};

/**
 * Get the request headers to be sent in requests by the SDK.
 *
 * If you plan to gather metrics for your SDK, the User-Agent header value must
 * be a string similar to the following:
 * autogen-node-sdk/0.0.1 (lang=node.js; os.name=Linux; os.version=19.3.0; node.version=v10.15.3)
 *
 * In the example above, the analytics tool will parse the user-agent header and
 * use the following properties:
 * "autogen-node-sdk" - the name of your sdk
 * "0.0.1"- the version of your sdk
 * "lang=node.js" - the language of the current sdk
 * "os.name=Linux; os.version=19.3.0; node.version=v10.15.3" - system information
 *
 * Note: It is very important that the sdk name ends with the string `-sdk`,
 * as the analytics data collector uses this to gather usage data.
 */
export function getSdkHeaders(
  serviceName: string,
  serviceVersion: string,
  operationId: string
): SdkHeaders | {} {
  const sdkName = 'autogen-node-sdk';
  const sdkVersion = pkg.version;
  const osName = os.platform();
  const osVersion = os.release();
  const nodeVersion = process.version;

  const headers = {
    'User-Agent': `${sdkName}/${sdkVersion} (lang=node.js; os.name=${osName} os.version=${osVersion} node.version=${nodeVersion})`,
  };

  return headers;
}
