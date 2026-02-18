/**
 * (C) Copyright IBM Corp. 2020.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

// Helper function to format date to 'YYYY-MM-DD HH:mm:ss'
function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

// Function to generate time series data
module.exports.generateTimeSeries = () => {
  const startDate = new Date(2023, 0, 1, 0, 0, 0); // Starting date: Jan 1, 2023, 00:00:00
  const numberOfElements = 512;

  // Create arrays for dates and targets
  const date = [];
  const target = [];

  for (let i = 0; i < numberOfElements; i += 1) {
    // Calculate the current timestamp (increment by 1 hour)
    const currentDate = new Date(startDate.getTime() + i * 60 * 60 * 1000);

    // Add the formatted date and random value to their respective arrays
    date.push(formatDate(currentDate));
    target.push(Math.random());
  }

  return { date, target };
};
