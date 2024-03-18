print('test')

import { listDir } from "lib/utils"
import _manifest from './manifest.json'

export const manifest = _manifest;

listDir('/home/')

export default class Test {
    test() {
        print('test')
    }
}