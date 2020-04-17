/*
 * Custom API Labels Gnome Shell extension
 * Show top panel labels based on API response
 *
 *
 * This file is part of Custom API Labels extension
 *
 * Custom API Labels extension is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Custom API Labels extension is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with gnome-shell-extension-openweather.
 * If not, see <http://www.gnu.org/licenses/>.
  */

const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const Util = imports.misc.util;

const MAX_ICONS = 10;

let all_labels = [];
let timer = null;
let settings;


const APILabel = new Lang.Class({
    Name: "APILabel",
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent(null, "APILabel");

        this.label = new St.Label({ text: "Placeholder", y_align: Clutter.ActorAlign.CENTER });
        this.actor.add_actor(this.label);

        this.actor.connect('button-press-event', this.click.bind(this));
    },

    click: function () {
      if (this.link)
        Util.trySpawnCommandLine("xdg-open " + this.link);
    },

    set_text: function (text) {
        this.label.set_text(text);
    },

    set_link: function (link) {
        this.link = link;
    },

    set_placement: function (placement) {
        let ref = this.container;
        let old_pos = this.placement ? this.placement: 'center';
        let new_pos = placement;

        if (old_pos == new_pos)
          return;

        switch (old_pos) {
        case 'left':
            Main.panel._leftBox.remove_child(this.container);
            break;
        case 'center':
            Main.panel._centerBox.remove_child(this.container);
            break;
        case 'right':
            Main.panel._rightBox.remove_child(this.container);
            break;
        }

        switch (new_pos) {
        case 'left':
            Main.panel._leftBox.add_child(ref);
            break;
        case 'center':
            Main.panel._centerBox.add_child(ref);
            break;
        case 'right':
            Main.panel._rightBox.insert_child_at_index(ref, 0);
        }

        this.placement = placement;
    }
});

function executeShellCommand() {
    let cmd = settings.get_string("shell-command");
    let rInt = settings.get_int ("refresh-interval");

    if (cmd.trim() == '') {
        return
    }

    try {
      var res = GLib.spawn_command_line_sync(cmd);

      if (res[0]) {
        let resText = Convenience.byteArrayToString(res[1]).toString();
        let parsed_results = JSON.parse(resText);

        for (let i = 0; i < MAX_ICONS; i++){
          let item = parsed_results[i];
          let label = all_labels[i];
          if (item && item.text) {
            label.set_text(item.text);
            label.set_style(item.css ? item.css : '');
            label.set_placement(item.placement ? item.placement : 'center');
            label.set_link(item.link);
            label.show();
          }
          else {
            label.hide();
          }
        }

      }
    }
    catch (e) {
      for (let i = 0; i < MAX_ICONS; i++){
        all_labels[i].hide();
      }
      logError(e);
    }

    if (rInt != 0) {

        if (timer) {
            Mainloop.source_remove(timer);
            timer = null;
        }

        timer = Mainloop.timeout_add_seconds(rInt, Lang.bind(this, executeShellCommand));
    }
}

function init() {
}

function enable() {
  // Get settings
  settings = Convenience.getSettings();

  // Create labels
  for (let i=0; i<MAX_ICONS; i++){
    let indicator = new APILabel();
    let id_ = "api_label_" + String(i);
    Main.panel.addToStatusArea(id_, indicator, 20, "center");

    all_labels.push(indicator);
    indicator.hide();
  }

  // Run command execution loop
  executeShellCommand();
}

function disable() {

  // Disable timer
  if (timer) {
      Mainloop.source_remove(timer);
      timer = null;
  }

  // Remove all labels
  for (let i=0; i < MAX_ICONS; i++) {
    all_labels[i].destroy();
  }
  all_labels = [];
}
