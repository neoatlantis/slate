import "./usb_monitor";
import "./pci_monitor";
import "./login_monitor";

import { channel } from "app/lib/endpoints";

channel("service.guardian.login_monitor.changed").on(on_changed);
channel("service.guardian.pci_monitor.changed").on(on_changed);
channel("service.guardian.usb_monitor.changed").on(on_changed);

const EVENT_NAME = "service.guardian.change_detected";
channel(EVENT_NAME);

function on_changed(){
	channel(EVENT_NAME).trigger();
}