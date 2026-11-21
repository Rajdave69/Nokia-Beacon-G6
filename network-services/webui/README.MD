# Beacon G6 WebUI research

The WebUI is a browser application served by the router on HTTP and HTTPS. Its JavaScript renders the pages and sends GET and POST requests to `.cgi` handlers. The CGI layer reads configuration and status or asks the relevant Nokia service to apply a change. This directory holds the frontend material and request notes used to connect those layers.

## Follow a request

1. Start with the original bundle captures under [`js/`](js/). The local research checkout also has [JavaScript bundle notes](js-analysis/main.js.md) for finding component and endpoint names.
2. Use the [endpoint inventory](admin-accessible-endpoints.md) and [CGI research notes](cgi-requests/) to see how requests are grouped by feature. The inventory describes the inspected interface. Effective permissions depend on the firmware build, authenticated role, operator profile, and handler.
3. For the native side, follow the [WebUI and mobile app authentication writeup](../../writeups/webui-mobile-app-authentication/README.md) through login, session validation, and CGI authorization. The [firmware architecture writeup](../../writeups/firmware-architecture/README.md) explains where configuration values go after a handler accepts them.

The WebUI account names `admin` and `superadmin` describe browser roles. The [credential map](../../writeups/credential-map/README.md) traces them separately from Linux accounts and boot-console authentication.

## Where encryption fits

| Layer | What the examined firmware uses it for |
| --- | --- |
| TLS | HTTPS protects traffic between the browser and the router on port 443. |
| Login challenge | The inspected browser bundle has a nonce-based hash response branch. The selected login mode and operator profile can affect the path. |
| Request body | On applicable forms, the browser encrypts the payload with AES-CBC and uses the router’s RSA public key to wrap the AES key and IV. This is application-level encryption inside the request. |
| Configuration backup | The file downloaded from the WebUI has its own encryption format and key derivation. Its keys and wrapper differ from the ones used by the browser for forms. |

The [payload encryption notes](payload-encryption.md) identify the frontend implementation. The [configuration import/export writeup](../../writeups/configuration-import-export/README.md) follows the separate backup format. Encryption and session authorization answer different questions: who can read the bytes in transit, and whether the router accepts the operation.

## Related network services

The [external probing writeup](../../writeups/probing-from-outside/README.md) puts the HTTP and HTTPS listeners alongside the other ports observed from the LAN. The sibling [port 8099 project](../port-8099/README.md) covers mobile-app notifications. The [port 37591 project](../port-37591/README.md) covers Nokia’s mesh messaging. Each has its own protocol and test scope.
