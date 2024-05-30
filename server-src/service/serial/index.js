import known_devices from "./known_serial_devices";
const serialport = require("serialport");

class SerialService {

	#serials_list;

	constructor(){
	}

	async refresh(){
		this.#serials_list = [];

		let list = await serialport.SerialPort.list();
		for(let item of list){
			let { path, vendorId, productId } = item;

			let recognized_as = null;
			for(let deviceName in known_devices){
				if(
					vendorId == known_devices[deviceName].vendorId &&
					productId == known_devices[deviceName].productId
				){
					recognized_as = deviceName;
					break;	
				}
			}
			if(recognized_as){
				this.#serials_list.push({
					path,
					device: recognized_as,
				});
			}
		}
	}

	async list(){
		await this.refresh();
		return this.#serials_list;
	}

}

let service = null;
export default function get_or_init(){
	if(!service) service = new SerialService();
	return service;
}