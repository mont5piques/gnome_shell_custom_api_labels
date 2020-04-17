# Custom API Labels


This extension allow to show labels on the top panel based on a script output (in JSON format). It can be used for monitoring, alerting or any informational purposes.
It was tested on gnome-shell 3.12 to 3.33



## Installation

```
cp -r custom-api-labels@nytrio.com ~/.local/share/gnome-shell/extensions/

```

Or thru [http://extensions.gnome.org/](http://extensions.gnome.org/)

## Using the extension

1. Create a script that outputs the required JSON response (details below)
1. Make it executable
1. Set it as "Shell Command to execute" in extension settings
1. Set refresh frequency in seconds



## Required JSON format

The output format must be a valid JSON with this structure :
```
[{
    "text": "Meeting starting at 2pm",
    "css": "color:black; background: yellow",
    "link": "https://www.google.fr",
    "placement": "right"
}, {
    "text": "DNS FAIL",
    "css": "color:white; background: red; border-radius:10px;font-size:1em;padding: 0 5px; height:0.5em; margin-bottom:5px"
}]

```

Each record will results to a label with a maximum of 10 labels. See field description below for details.

| **Field** | **Description** | **Required / **Optional |
|:--- |:--- |:--- |
| text | The content of the label (could contain emojis or any utf-8 character) | Required |
| css | CSS Formatting of the label | Optional |
| link | Link to open if the label is clicked (you can use any xdg compatible protocol) |  |
| placement | Label placement [center/left/right]. Default is center |  |
