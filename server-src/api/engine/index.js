import { Router } from "express";
import { channel, call } from "app/lib/endpoints";


function setup_router(router){

	router.all("/lock", async (req, res)=>{
		channel("service.pwmgr.engine.lock").trigger();
		res.end();
	});

	router.get("/", async (req, res)=>{
		let status = await call("service.pwmgr.engine.status");
		res.send({ status });
		res.end();
	});


}

const router = new Router();
setup_router(router);

export default router;