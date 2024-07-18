import "./usb_monitor";
import "./pci_monitor";
import "./login_monitor";

import { channel } from "app/lib/endpoints";
const debug = require("app/debug")("service/guardian/index.js");

channel("service.guardian.login_monitor.changed").on(on_changed);
channel("service.guardian.pci_monitor.changed").on(on_changed);
channel("service.guardian.usb_monitor.changed").on(on_changed);

const EVENT_NAME = "service.guardian.change_detected";
channel(EVENT_NAME);

function on_changed(){
	debug("Trigger event:" + EVENT_NAME);
	channel(EVENT_NAME).trigger();
}