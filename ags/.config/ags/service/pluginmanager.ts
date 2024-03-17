import { listDir } from "../lib/utils"

print('plugin manager init')
class PluginManager extends Service {
    static {
        Service.register(this, {}, {
            "plugins": ["jsobject", "rw"],
        })
    }

    plugins = []

    async getPlugins() {
        try {
            this.plugins = await listDir(`${App.configDir}/plugins`)
        } catch(err) {
            print(err)
        }
        print(this.plugins)
    }

    activateHook() {

    }

    constructor() {
        super()
        this.getPlugins()
    }
}

export default new PluginManager()