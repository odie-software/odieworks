import { listDir } from "../lib/utils"
const PLUGINS_DIR = `/tmp/ags/plugins`

print('plugin manager init')
class PluginManager extends Service {
    static {
        Service.register(this, {}, {
            "plugins": ["jsobject", "rw"],
        })
    }

    plugins = []

    async getPlugins() {        
        let pluginDirs = await listDir(PLUGINS_DIR)
        this.plugins = []

        for (let file of pluginDirs) {
            try {
                // Load manifest
                let plugin = `file://${PLUGINS_DIR}/${file}`
                // let manifest = await Utils.readFileAsync(`${currentPluginDir}/manifest.json`)
                // manifest = JSON.parse(manifest)
                // this.plugins.push(manifest)
                // print(`Loaded manifest for plugin ${file}: '${manifest.name}'`)
                // TODO: check AGS version
                
                // Load plugin
                let { manifest } = await import(plugin)
                print(manifest.name)
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