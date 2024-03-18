const main = "/tmp/ags/main.js"
const entry = `${App.configDir}/main.ts`
const PLUGINS_DIR = `${App.configDir}/plugins`
import Gio from 'gi://Gio';

async function listDir(path) {
    const directory = Gio.File.new_for_path(path);
    
    let files = []
    const iter = await directory.enumerate_children('standard::*',
        Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);

    while (true) {
        const fileInfo = await iter.next_file(null);

        if (!fileInfo)
            break;

        files.push(fileInfo.get_name())
        print(fileInfo.get_name());
            
    }

    return files
}

const v = {
    ags: pkg.version.split(".").map(Number),
    expect: [1, 8, 0],
}

// Build plugins
let pluginDirs = await listDir(PLUGINS_DIR)
let plugins = []

for (let file of pluginDirs) {
    try {
        // Load manifest
        let currentPluginDir = `${PLUGINS_DIR}/${file}`
        let manifest = await Utils.readFileAsync(`${currentPluginDir}/manifest.json`)
        manifest = JSON.parse(manifest)
        plugins.push(manifest)
        print(`Loaded manifest for plugin ${file}: '${manifest.name}'`)
        // TODO: check AGS version
        
        // Load plugin
        await Utils.execAsync([
            "bun", "build", `${currentPluginDir}/index.ts`,
            "--outfile", `/tmp/ags/plugins/${file}.ts`,
            "--external", "resource://*",
            "--external", "gi://*",
            "--external", "file://*",
        ])
        print(`Built plugin ${file}: '${manifest.name}'`)
        
    } catch(err) {
        print(`Error loading plugin ${file}: ${err}`)
    }
}
try {
    
} catch(err) {

}

try {
    await Utils.execAsync([
        "bun", "build", entry,
        "--outfile", main,
        "--external", "resource://*",
        "--external", "gi://*",
        "--external", "file://*",
    ])
    if (v.ags[1] < v.expect[1] || v.ags[2] < v.expect[2]) {
        print(`my config needs at least v${v.expect.join(".")}, yours is v${v.ags.join(".")}`)
        App.quit()
    }
    await import(`file://${main}`)
} catch (error) {
    console.error(error)
    App.quit()
}
