import PopupWindow, { Padding } from "widget/PopupWindow"
import { type Stream } from "types/service/audio"
import { AppItem, QuickButton } from "./AppItem"
import icons from "lib/icons"
import options from "options"
import { launchApp } from "lib/utils"
const audio = await Service.import("audio")

const apps = await Service.import("applications")
const { query } = apps
const { width, margin, maxItem, favorites } = options.applauncher



const Audiomenu = () => {
    const applist = Variable(query(""))
    let first = applist.value[0]
    const SeparatedAppItem = (stream: Stream) => Widget.Box(
            { vertical: true },
            Widget.Separator(),
            AppItem(stream),
        )
    const list = Widget.Box({
        vertical: true,
        // children: applist.bind().as(list => list.map(SeparatedAppItem)),
        children: audio.bind("speakers").as(a => a.map(SeparatedAppItem)),
    })

    // list.hook(apps, () => applist.value = query(""), "notify::frequents")

    const entry = Widget.Entry({
        hexpand: true,
        primary_icon_name: icons.ui.search,
        on_accept: () => {
            // entry.text !== "" && launchApp(first)
            audio.speaker = first
            App.toggleWindow("audiomenu")
        },
        // on_change: ({ text }) => {
        //     first = query(text || "")[0]
        //     list.children.reduce((i, item) => {
        //         if (!text || i >= maxItem.value) {
        //             item.reveal_child = false
        //             return i
        //         }
        //         if (item.attribute.app.match(text)) {
        //             item.reveal_child = true
        //             return ++i
        //         }
        //         item.reveal_child = false
        //         return i
        //     }, 0)
        // },
    })

    const quicklaunch = Widget.Revealer({
        setup: self => self.hook(entry, () => self.reveal_child = !entry.text, "notify::text"),
        visible: favorites.bind().as(f => f.length > 0),
        child: Widget.Box({
            vertical: true,
            children: favorites.bind().as(favs => favs.flatMap(fs => [
                Widget.Separator(),
                Widget.Box({
                    class_name: "quicklaunch horizontal",
                    children: fs
                        .map(f => query(f)?.[0])
                        .filter(f => f)
                        .map(QuickButton),
                }),
            ])),
        }),
    })

    function focus() {
        entry.text = "Search"
        entry.set_position(-1)
        entry.select_region(0, -1)
        entry.grab_focus()
        quicklaunch.reveal_child = true
    }

    const layout = Widget.Box({
        css: width.bind().as(v => `min-width: ${v}pt;`),
        class_name: "audiomenu",
        vertical: true,
        vpack: "start",
        setup: self => self.hook(App, (_, win, visible) => {
            if (win !== "audiomenu")
                return

            entry.text = ""
            if (visible)
                focus()
        }),
        children: [
            // entry,
            // quicklaunch,
            list,
        ],
    })

    return Widget.Box(
        { vertical: true, css: "padding: 1px" },
        Padding("audiomenu", {
            css: margin.bind().as(v => `min-height: ${v}pt;`),
            vexpand: false,
        }),
        layout,
    )
}

export default () => PopupWindow({
    name: "audiomenu",
    layout: "top",
    child: Audiomenu(),
})
