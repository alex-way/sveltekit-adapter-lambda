import { join, relative } from "path/posix";
import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

/** @type {import('.').default} **/
const plugin = function ({ out = "build", clientDir = "assets", precompress } = {}) {
  const adapter = {
    name: "adapter-lambda",

    async adapt(builder) {
      const tmp = builder.getBuildDirectory("adapter-lambda");

      builder.rimraf(out);
      builder.mkdirp(tmp);

      const server_directory = join(out, "server");
      builder.mkdirp(`${out}/server`);

      builder.log.minor("Copying assets");
      builder.writeClient(`${out}/${clientDir}`);
      builder.writePrerendered(`${out}/prerendered`);

      if (precompress) {
        builder.log.minor("Compressing assets");
        await Promise.all([builder.compress(`${out}/${clientDir}`), builder.compress(`${out}/prerendered`)]);
      }

      builder.log.minor("Building server");
      builder.writeServer(out);

      const relativePath = relative(tmp, builder.getServerDirectory());
      writeFileSync(
        `${tmp}/manifest.js`,
        `export const manifest = ${builder.generateManifest({
          relativePath,
        })};`
      );

      const files = fileURLToPath(new URL("./files", import.meta.url).href);

      builder.copy(`${files}/serverless.js`, `${tmp}/index.js`, {
        replace: {
          SERVER: `${relativePath}/index.js`,
          MANIFEST: "./manifest.js",
        },
      });

      builder.copy(`${files}/shims.js`, `${server_directory}/shims.js`);

      builder.log.minor("Building lambda");
      esbuild.buildSync({
        entryPoints: [`${tmp}/index.js`],
        outfile: `${server_directory}/serverless.js`,
        inject: [`${server_directory}/shims.js`],
        target: "es2020",
        external: ["node:*"],
        format: "cjs",
        bundle: true,
        platform: "node",
      });
    },
  };

  return adapter;
};

export default plugin;
