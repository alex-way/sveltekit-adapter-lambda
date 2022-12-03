# adapter-lambda for SvelteKit

An adapter to build a [SvelteKit](https://kit.svelte.dev/) app into a lambda ready for deployment via the Serverless framework, or any other framework (sst.dev, AWS SAM for example).

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
import adapter from '@alex-way/adapter-lambda';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

See `examples/serverless.yml` for an example of how to deploy the stack with the Serverless framework.

After building your app run `sls deploy` to deploy code to AWS using the build tool [serverless](https://www.serverless.com/).

Your app can then be accessed via the CloudFront distribution created as a part of the stack.

## Help! I'm getting an error while building or serving my app

As SvelteKit is still in early development, there are often breaking changes made to the adapter API and other associated functions. If this is the case, please raise an issue on [Github](https://github.com/alex-way/sveltekit-adapter-lambda/issues), and I will be happy to issue a fix.
