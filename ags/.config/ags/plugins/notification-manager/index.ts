import { Plugin, Manifest } from "lib/plugin"
import _manifest from './manifest.json'
print(_manifest.name)
export default class Test implements Plugin {
    public manifest = _manifest

    test() {
        print('test')
    }
}