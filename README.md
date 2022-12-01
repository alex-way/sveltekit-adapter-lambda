# adapter-lambda for SvelteKit

An adapter to build a [SvelteKit](https://kit.svelte.dev/) app into a lambda ready for deployment with lambda proxy via the Serverless framework.

## Installation

```bash
# Install with npm
npm install --save-dev @alex-way/adapter-lambda

# Install with yarn
yarn add --dev @alex-way/adapter-lambda

# Install with pnpm
pnpm add --save-dev @alex-way/adapter-lambda
```

## Usage

In your `svelte.config.js` configure the adapter as bellow;

```js
import preprocess from 'svelte-preprocess'; //Optional
import adapter from '@alex-way/adapter-lambda';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(), //Optional

  kit: {
    adapter: adapter(),
  },

};

export default config;
```

Copy `serverless.yml` from the root of this repo to the root of your project, make sure to change the service name.

After building your app run `sls deploy` to deploy code to AWS using the build tool [serverless](https://www.serverless.com/).

Your app can then be accessed via the CloudFront distribution created as a part of the stack.

## Static Assets and precompiled pages

To server static assets and precompiled pages this adapter makes use of S3. In order to route traffic the correct destination a Lambda@edge fuction is used to perfrom a origin rewrite to redirect traffic to the S3 Bucket.

## Help! I'm getting an error while building or serving my app

As SvelteKit is still in early development, there are often breaking changes made to the adapter API and other associated functions. If this is the case, please raise an issue on [Github](https://github.com/alex-way/sveltekit-adapter-lambda/issues), and I will be happy to issue a fix.

## Versions

| Adapter Version | Sveltekit Version |
| --------------- | ----------------- |
| 0.12.x          | 1.0.0-next.433    |
| 0.11.x          | 1.0.0-next.401    |
| 0.10.x          | 1.0.0-next.380    |
| 0.9.x           | 1.0.0-next.348    |
| 0.6.x - 0.8.x   | 1.0.0-next.301    |
| 0.5.x           | 1.0.0-next.286    |
| 0.3.x - 0.4.x   | 1.0.0-next.286    |
| 0.2.x           | 1.0.0-next.239    |
| 0.1.x           | 1.0.0-next.169    |
