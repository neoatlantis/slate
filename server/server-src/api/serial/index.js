import { Router } from "express";
import get_serial from "app/service/serial";


function setup_router(router){

	router.get("/", async (req, res)=>{
		let serial_serivce = get_serial();
		res.write(JSON.stringify(await serial_serivce.list()));
		res.end();
	});


}

const router = new Router();
setup_router(router);

export default router;