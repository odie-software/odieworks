import { listDir } from "../lib/utils"
const PLUGIN_DIR = `${App.configDir}/plugins`

print('plugin manager init')
class PluginManager extends Service {
    static {
        Service.register(this, {}, {
            "plugins": ["jsobject", "rw"],
        })
    }

    plugins = []

    async getPlugins() {        
        let pluginDirs = await listDir(PLUGIN_DIR)
        this.plugins = []

        for (let file of pluginDirs) {
            try {
                let manifest = await Utils.readFileAsync(`${PLUGIN_DIR}/${file}/manifest.json`)
                manifest = JSON.parse(manifest)
                this.plugins.push(manifest)
                print(`Loaded manifest for plugin ${file}: '${manifest.name}'`)
                // TODO: check AGS version
                
            } catch(err) {
                print(`Error loading plugin ${file}: ${err}`)
            }
        }
    }

    activateHook() {

    }

    constructor() {
        super()
        this.getPlugins()
    }
}

export default new PluginManager()