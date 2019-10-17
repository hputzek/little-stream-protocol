# little-stream-protocol

> [https://hputzek.github.io/little-stream-protocol/](https://hputzek.github.io/little-stream-protocol/)

A javascript implementation to send data via [little stream](https://github.com/IoTPanic/s) and [pixels](https://github.com/IoTPanic/pixels) protocols

**Requirement: Node >v12, because it uses es6 modules and no bundler.**

# Install

This lib is not yet released via npm.
You can install it directly from github until it is listed in npm.

Add this to your `package.json` as a dependency:
> `"little-stream-protocol": "git+https://git@github.com/hputzek/little-stream-protocol.git"`

# Usage

## Implement in your own project

You can use this library to use pixels protocol, s protocol or both.

[Example with comments](/examples/index.js)

You can find information about the protocols at their corresponding repos, too:
* [Udpx](https://github.com/martinberlin/udpx) by [Martin Fasani](https://twitter.com/martinfasani) - firmware
* [Pixels](https://github.com/IoTPanic/pixels) by [Samuel Archibald](https://twitter.com/IoTPanic) - A super simple LED application layer
* [s](https://github.com/IoTPanic/s) - Little Stream - Embedded streaming layer for UDPX

## How to use the testing tool

To
* quickly test possible parameters/options
* benchmark performance
* quick test led stripes using pixels(+s)

you can use the testing tool.
In this case you can set all configuration options for both pixels & s via a gui.
See next section for how to start it.


# Test

Checkout the repo, then
* `node --version`
  * if you got wrong version (< 12) the easiest solution is node version manager: [win](https://github.com/coreybutler/nvm-windows/) / [mac/linux](https://github.com/nvm-sh/nvm)
* `npm install`
* `npm run test` to run a basic test file from `examples` folder. (outputs to console)
* `npm run dev` to start testing tool locally using browser-sync
