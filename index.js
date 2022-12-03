import { copyFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path/posix";
import esbuild from "esbuild";

/**
 * @param {{
 *   out?: string;
 *   assetsDir?: string;
 * }} options
 */
export default function ({ out = "build", assetsDir = "assets" }) {
  /** @type {import('@sveltejs/kit').Adapter} */
  const adapter = {
    name: "adapter-lambda",

    async adapt(builder) {
      builder.rimraf(out);

      const static_directory = join(out, assetsDir);
      if (!existsSync(static_directory)) {
        builder.mkdirp(static_directory, { recursive: true });
      }

      const prerendered_directory = join(out, "prerendered");
      if (!existsSync(prerendered_directory)) {
        builder.mkdirp(prerendered_directory, { recursive: true });
      }

      const server_directory = join(out, "server");
      if (!existsSync(server_directory)) {
        builder.mkdirp(server_directory, { recursive: true });
      }

      const edge_directory = join(out, "edge");
      if (!existsSync(edge_directory)) {
        builder.mkdirp(edge_directory, { recursive: true });
      }

      builder.log.minor("Copying assets");
      builder.writeClient(static_directory);

      builder.log.minor("Copying server");
      builder.writeServer(out);
      copyFileSync(`${__dirname}/files/serverless.js`, `${server_directory}/_serverless.js`);
      copyFileSync(`${__dirname}/files/shims.js`, `${server_directory}/shims.js`);

      builder.log.minor("Building lambda");
      esbuild.buildSync({
        entryPoints: [`${server_directory}/_serverless.js`],
        outfile: `${server_directory}/serverless.js`,
        inject: [join(`${server_directory}/shims.js`)],
        external: ["node:*"],
        format: "cjs",
        bundle: true,
        platform: "node",
      });

      builder.log.minor("Prerendering static pages");
      builder.writePrerendered(prerendered_directory);

      builder.log.minor("Cleanup");
      unlinkSync(`${server_directory}/_serverless.js`);
      unlinkSync(`${out}/index.js`);
    },
  };

  return adapter;
}
