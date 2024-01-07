import "websocket-polyfill";
import { main } from "./main";

// TODO:
// cli
// [ ] disable hot reload on startup
// [x] take screenshot in base: only if not exists
// [x] take screenshot in current: when test running
// [ ] take light/dark screenshot variants
// [ ] caching for screenshots comparison (run only when image changed ?)
// config
// [ ] read from config file
// -- devices
// [ ] ios (deviceID)
// [ ] android (deviceID)
// options
// [x] abort on first fail
// [ ] watch mode
// [ ] detect old screenshots and remove them

main();
