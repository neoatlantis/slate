const _ = require("lodash");
const command_code = {
	get_info: 0x01,
	send_kb_general_data: 0x02,
	send_kb_media_data: 0x03,
	get_para_cfg: 0x08,
	set_para_cfg: 0x09,
	set_default_cfg: 0x0c,
	reset: 0x0f,
};

function generate_command(addr, cmd, data){
	let ret = new Uint8Array(6+data.length);
	ret.set([0x57, 0xAB, addr & 0xFF, cmd & 0xFF, data & 0xFF], 0);
	ret.set(data, 5);
	let sum = _.sum(ret);
	ret.set([sum], 5+data.length);
	return ret;
}

function parse_response(frame){
	if(!_.isArray(frame) || frame.length < 5) throw Error();
	if(frame[0] != 0x57 || frame[1] != 0xAB) throw Error("Not CH9329 answer");
	let checksum_subarray = frame.slice(0, frame.length-1);
	let checksum = _.sum(checksum_subarray) & 0xFF;
	if(checksum != frame[frame.length-1]) throw Error("Checksum error.");

	let cmd_flag = frame[2];
	let flag_response = Boolean(cmd_flag & 0x80);
	let flag_error	  = Boolean(cmd_flag & 0x40);
	let original_cmd  = cmd_flag & 0x3F;
	let payload_length= Boolean(frame[4]);

	let payload = frame.slice(5, 5+payload.length);
	return {
		command_code: original_cmd,
		is_response: flag_response,
		is_error: flag_error,
		payload,
	};
}

function abstract_query_ch9329(addr, cmd, data){
	const timeout = 5000;
	if(_.isString(cmd)) cmd = command_code[cmd];
	if(!_.isInteger(cmd)) throw Error("invalid-command-code");

	let command = generate_command(addr, cmd, data);
	let response = null;
	let set_answer = function(answer){
		if(!_.isNil(response)) return;
		try{
			response = parse_response(answer);
		} catch(e){
			response = e;
		}
	};

	let ret_promise = async function(){
		const step = 100;
		for(let i=0; i<5000; i+=step){
			if(!_.isNil(response)) break;
			await new Promise((resolve, _)=>setTimeout(resolve, step));
		}
		if(_.isNil(response)) throw Error("timeout");
		if(_.isError(response)) throw response;

		if(response.command_code != cmd || !response.is_response){
			throw Error("response-not-expected");
		}

		return response;
	}

	ret_promise.command = command;
	ret_promise.set_answer = set_answer;
	return ret_promise;
}

module.exports = abstract_query_ch9329;