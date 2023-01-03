import { Server } from "SERVER";
import { manifest } from "MANIFEST";
import { splitCookiesString } from "set-cookie-parser";

/**
 * This is the entry point for the serverless function.
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
export async function handler(event) {
  const server = new Server(manifest);
  const { rawPath, headers, rawQueryString, body, requestContext, isBase64Encoded, cookies } = event;

  /** @type {BufferEncoding | undefined} */
  const requestEncoding = headers["content-encoding"];
  const encoding = isBase64Encoded ? "base64" : requestEncoding || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;

  // If origin header is missing, set it equal to the host header.
  const origin = process.env.ORIGIN || headers["origin"] || `https://${headers["host"]}`;
  if (!headers.origin) headers["origin"] = origin;

  let url = `${origin}${rawPath}${rawQueryString ? `?${rawQueryString}` : ""}`;

  await server.init({ env: process.env });

  if (cookies) headers["cookie"] = cookies.join("; ");

  const response = await server.respond(
    new Request(url, {
      method: requestContext.http.method,
      headers: new Headers(headers),
      body: rawBody,
    })
  );

  if (!response)
    return {
      statusCode: 404,
    };

  const resp = {
    /** @type {{[k: string]: string}} */ headers: {},
    /** @type {string[]} */ cookies: [],
    body: await response.text(),
    statusCode: response.status,
  };

  for (let k of response.headers.keys()) {
    let header = response.headers.get(k);

    if (k == "set-cookie") {
      resp.cookies = resp.cookies.concat(splitCookiesString(header));
    } else {
      //For multivalue headers, join them
      if (header instanceof Array) {
        header = header.join(",");
      }
      resp.headers[k] = header;
    }
  }

  return resp;
}
