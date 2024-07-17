import _ from "lodash";
import { Router } from "express";
import { channel, call } from "app/lib/endpoints";


function setup_router(router){

	router.all("/lock", async (req, res)=>{
		await call("service.pwmgr.engine.lock");
		res.send({ done: true }).end();
	});

	router.post("/unlock", async (req, res)=>{
		let error = null;
		try{
			await call("service.pwmgr.engine.unlock", {
				password: _.get(req, "body.password", ""),
			});
		} catch(e){
			error = e.toString();
		}
		let status = await call("service.pwmgr.engine.status");
		res.send({ status, error }).end();
	});

	router.get("/", async (req, res)=>{
		let status = await call("service.pwmgr.engine.status");
		res.send({ status }).end();
	});


}

const router = new Router();
setup_router(router);

export default router;