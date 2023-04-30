/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { DenseTable } from './FetchComponent';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
// import { setupRequestMockHandlers } from '@backstage/test-utils';

// describe('FetchComponent', () => {
//   const server = setupServer();
//   // Enable sane handlers for network requests
//   setupRequestMockHandlers(server);
//
//   // setup mock response
//   beforeEach(() => {
//     server.use(
//       rest.get('https://randomuser.me/*', (_, res, ctx) =>
//         res(ctx.status(200), ctx.delay(2000), ctx.json({})),
//       ),
//     );
//   });
//   it('should render', async () => {
//     await render(<DenseTable />);
//     expect(await screen.findByTestId('progress')).toBeInTheDocument();
//   });
// });

export {}
