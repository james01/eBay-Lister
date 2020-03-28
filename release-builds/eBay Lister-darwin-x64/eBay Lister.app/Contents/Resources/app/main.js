const electron = require("electron")

const app = electron.app

const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const path = require("path")
const url = require("url")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows = []

function createWindow() {

	const height = electron.screen.getPrimaryDisplay().workAreaSize.height

	// Create the browser window.
	let mainWindow = new BrowserWindow({
		width: 1400,
		height: height,
		minWidth: 1040,
		minHeight: 600,
		icon: path.join(__dirname, "icons/png/64.png")
	})

	// Moves mainWindow to second monitor, to make testing easier.
	// mainWindow.setPosition(1800, -100)
	// Opens dev tools, to make testing easier.
	// mainWindow.webContents.openDevTools()

	// Positions extra windows at offset from current.
	if (windows.length > 0) {
		const windowPosition = windows[windows.length-1].getPosition()
		mainWindow.setPosition(windowPosition[0]+20, windowPosition[1]+20)
	}

	windows.push(mainWindow)

	// Load index.html.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, "index.html"),
		protocol: "file",
		slashes: true
	}))

	// Set up menu ribbon.
	const menuTemplate = [
		{
		label: "eBay Lister",
		submenu: [
			{ label: "About eBay Lister", selector: "orderFrontStandardAboutPanel:" },
			{ type: "separator" },
			{ label: "Toggle Dev Tools", role: "toggledevtools" },
			{ type: "separator" },
			{ label: "Quit eBay Lister", accelerator: "CmdOrCtrl+Q", role: "quit" }
		]}, {
		label: "File",
		submenu: [
			{ label: "New Listing", accelerator: "CmdOrCtrl+N", click: createWindow }
		]}, {
		label: "Edit",
		role: "editMenu"
		}, {
		label: "Window",
		role: "windowMenu"
		}
	]
	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)

	mainWindow.on("closed", function() {
		windows.splice(windows.indexOf(this), 1)
		mainWindow = null
	})
}


app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", function() {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (windows.length==0) {
		createWindow()
	}
})