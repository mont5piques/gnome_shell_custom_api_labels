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

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Config = imports.misc.config;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;


function init() {
    //
}

const CutomAPILabelsSettings = new GObject.Class({
    Name: 'CutomAPILabelsPrefs',
    Extends: Gtk.Grid,

    _init: function(params) {

        this.parent(params);
        this.margin = 5;
        this.column_spacing = 10;
        this.row_spacing = 10;
        this._settings = Convenience.getSettings();

        var labelCmd = new Gtk.Label({
            label: "Shell command to execute",
            hexpand: false,
            halign: Gtk.Align.START
        });

        this.attach(labelCmd, 0, 0, 1, 1);

        var entryCmd = new Gtk.Entry({halign: Gtk.Align.START, text: this._settings.get_string('shell-command')});
        entryCmd.set_sensitive(true);
        entryCmd.connect('changed', Lang.bind(this, function(w) {
            this._settings.set_string('shell-command', w.get_text());
        }));

        this.attach(entryCmd, 1, 0, 5, 1);

        var labelInterval = new Gtk.Label({
            label: "Refresh interval in seconds (0 to disable)",
            hexpand: false,
            halign: Gtk.Align.START
        });

        this.attach(labelInterval, 0, 1, 1, 1);

        var spinInterval = Gtk.SpinButton.new_with_range (0, 60 * 60 * 24, 1);
        spinInterval.value = this._settings.get_int ("refresh-interval");

        spinInterval.connect ("value_changed", Lang.bind (this, ()=>{
            this._settings.set_int ("refresh-interval", spinInterval.value);
        }))

        this.attach(spinInterval, 1, 1, 1, 1);

        var labelInfo = new Gtk.Label({
            label: "Disable and re-enable extension to apply settings.",
            hexpand: true,
            halign: Gtk.Align.START
        });

        this.attach(labelInfo, 0, 3, 1, 1);
    },

});

function buildPrefsWidget() {
     let widget = new CutomAPILabelsSettings();
     widget.show_all();

     return widget;
}
