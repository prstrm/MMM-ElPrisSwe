# MMM-ElPrisSwe

A module that fetches energyprices from [elprisetjustnu.se](https://www.elprisetjustnu.se/elpris-api)'s API and shows the previous, current and next spot prices for one of the four zones in Sweden (SE1/SE2/SE3/SE4)

## Installation

### Install

In your terminal, go to your [MagicMirror²](https://magicmirror.builders/) Module folder and clone MMM-ElPrisSwe:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/prstrm/MMM-ElPrisSwe/
cd ~/MagicMirror/modules/MMM-ElPrisSwe/
npm install
```

### Update

```bash
cd ~/MagicMirror/modules/MMM-ElPrisSwe/
git pull
npm install
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
        module: 'MMM-ElPrisSwe',
        position: 'top_left'
    },
```

Or you could use these options:

```js
    {
        module: 'MMM-ElPrisSwe',
        position: 'top_left',
        config: {
            region: "SE3",                        // The zone to fetch prices from
            updateInterval: (60 * 5) * 1000,      // 5 min delay between update
            animationSpeed: 1000
        }
    },
```

## Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`region:`|`SE1, SE2, SE3, SE4`|SE3|Which region to fetch prices from (SE1 = Luleå / Norra Sverige, SE2 = Sundsvall / Norra Mellansverige, SE3 = Stockholm / Södra Mellansverige, SE4 = Malmö / Södra Sverige)
`updateInterval:`|`int (ms)`|(60 * 5) * 1000 (5min) |How often you want the module to update and refresh the data.
`animationSpeed:`|`int (ms)`|1000|The speed for animations

## Issues or requests
This is my first public repo and first ever javascript thing so there is a 100% chance things can be made more efficient since I don't know what I'm doing basically, git or js-wise, I just really needed this module for my mirror :) 
So if you want to optimize something or request a feature just go right ahead. 

## Credits and Thanks
Infomation, inspiration and knowledge taken from:
* [MagicMirror](https://github.com/MagicMirrorOrg/MagicMirror)
* [MMM-PollenSwe by cgillinger](https://github.com/cgillinger/MMM-PollenSwe)
* [MMM-MyHomeWizard by htilburgs](https://github.com/htilburgs/MMM-MyHomeWizard)

To read more about the API:
[Elprisjustnu.se API](https://www.elprisetjustnu.se/elpris-api)
<p><a href="https://www.elprisetjustnu.se"><img src="https://ik.imagekit.io/ajdfkwyt/hva-koster-strommen/elpriser-tillhandahalls-av-elprisetjustnu_ttNExOIU_.png" alt="Elpriser tillhandahålls av Elpriset just nu.se" width="200" height="45"></a></p>
