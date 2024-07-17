import _ from "lodash";

const MENU_FILL_ID = "neoatlantis-slate-password";




function on_browser_menus_clicked(e){
	//let el = browser.contextMenus.getTargetElement(targetElementId);
	console.log("clicked", e);

	const menuItemId = _.get(e, "menuItemId");
	if(menuItemId != MENU_FILL_ID) return;

	const pageUrl = new URL(_.get(e, "pageUrl"));
	console.log(pageUrl);

}




browser.runtime.onInstalled.addListener(() => {

	console.log("Slate: init");

	browser.contextMenus.create({
		id: MENU_FILL_ID,
		title: "Fill password via NeoAtlantis Slate",
		documentUrlPatterns: ["*://*/*"],
		contexts: ["password", "editable"]
	});

	browser.contextMenus.onClicked.addListener(on_browser_menus_clicked);
});

