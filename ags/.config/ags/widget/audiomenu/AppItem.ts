import { type Application } from "types/service/applications"
import options from "options"
import { launchApp, icon } from "lib/utils"
import icons from "lib/icons"
const audio = await Service.import("audio")
const { iconSize } = options.applauncher

export const QuickButton = (app: Application) => Widget.Button({
    hexpand: true,
    tooltip_text: app.name,
    on_clicked: () => {
        App.closeWindow("applauncher")
        launchApp(app)
    },
    child: Widget.Icon({
        size: iconSize.bind(),
        icon: icon(app.icon_name, icons.fallback.executable),
    }),
})

export const AppItem = (app: Application) => {
    const title = Widget.Label({
        class_name: "title",
        label: app.description,
        hexpand: true,
        xalign: 0,
        vpack: "center",
        truncate: "end",
    })

  

    const appicon = Widget.Icon({
        icon: icon(app.icon_name || "", icons.fallback.audio),
        size: iconSize.bind(),
    })

    const textBox = Widget.Box({
        vertical: true,
        vpack: "center",
        children: [title],
    })

    const activeIcon = Widget.Icon({
        icon: icons.ui.tick,
        hexpand: true,
        hpack: "end",
        visible: audio.speaker.bind("stream").as(s => s === app.stream),
    })

    return Widget.Button({
        class_name: "app-item",
        attribute: { app },
        child: Widget.Box({
            children: [appicon, textBox, activeIcon],
        }),
        on_clicked: () => {
            App.closeWindow("audiomenu")
            audio.speaker = app
       },
    })
}
