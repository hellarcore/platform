: <!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <a href="https://hellarwiki.notion.site/Hellar-Platform-def13bddaba64a9d944b4f3ed5fd7941/">
    <img alt="babel" src="https://github.com/hellarcore/hellar/blob/master/src/qt/res/images/hellar.png" width="546">
  </a>
</p>

<p align="center">
  Seriously fast decentralized applications for the Hellar network
</p>

<p align="center">
  <a href="https://github.com/hellarpay/platform/actions/workflows/all-packages.yml"><img alt="GitHub CI Status" src="https://github.com/hellarpay/platform/actions/workflows/all-packages.yml/badge.svg"></a>
  <a href="https://chat.hellardevs.org/"><img alt="Devs Chat" src="https://img.shields.io/badge/discord-Dev_chat-738adb"></a>
  <a href="https://discordapp.com/invite/PXbUxJB"><img alt="General Chat" src="https://img.shields.io/badge/discord-General_chat-738adb"></a>
  <a href="https://twitter.com/intent/follow?screen_name=Hellarpay"><img alt="Follow on Twitter" src="https://img.shields.io/twitter/follow/Hellarpay.svg?style=social&label=Follow"></a>
</p>

Hellar Platform is a technology stack for building decentralized applications on
the Hellar network. The two main architectural components, Drive and HAPI, turn
the Hellar P2P network into a cloud that developers can integrate with their
applications.

If you are looking for how to contribute to the project or need any help with
building an app on the Hellar Platform - message us on the [Devs
Discord](https://chat.hellardevs.org/)!

## Note: Hellar Platform is currently available on the Hellar Testnet only

## Intro

This is a multi-package repository - sometimes also known as monorepository -
that contains all packages that comprise the Hellar platform - for example, Drive,
which is the storage component of Hellar Platform, the JavaScript SDK, wallet-lib,
HAPI, and others. Every individual package contains its own readme. Packages are
located in the [packages](./packages) directory.

### Supported networks

Hellar Platform is currently undergoing testing and final development necessary to
support its release on the Hellar production network (mainnet). The packages in
this repository may be used on the following networks:

- [x] **Development networks** ([**devnets**](https://hellarplatform.readme.io/docs/reference-glossary#devnet))
- [x] [**Testnet**](https://hellarplatform.readme.io/docs/reference-glossary#testnet)
- [ ] [Mainnet](https://hellarplatform.readme.io/docs/reference-glossary#mainnet)

## FAQ

### How to build and set up a node from the code in this repo?

- Clone the repo
- Install prerequisites:
  - [node.js](https://nodejs.org/) v20
  - [docker](https://docs.docker.com/get-docker/) v20.10+
  - [rust](https://www.rust-lang.org/tools/install) v1.73+, with wasm32 target (`rustup target add wasm32-unknown-unknown`)
  - [wasm-bingen toolchain](https://rustwasm.github.io/wasm-bindgen/):
    - **IMPORTANT (OSX only)**: built-in `llvm` on OSX does not work, needs to be installed from brew:
      - `brew install llvm`
      - LLVM installed from brew is keg only, and path to it must be provided in the profile file,
        in terminal run `echo 'export PATH="/opt/homebrew/opt/llvm/bin:$PATH"' >> ~/.zshrc` or `echo 'export PATH="/opt/homebrew/opt/llvm/bin:$PATH"' >> ~/.bash_profile` depending on your default shell.
        You can find your default shell with `echo $SHELL`
      - Reload your shell with `source ~/.zshrc` or `source ~/.bash_profile` 
    - install `protoc` - protobuf compiler:
      - on debian/ubuntu: `apt install -y protobuf-compiler`
      - on Mac: `brew install protobuf`
      - on other systems, install most recent version from [Protocol Buffers releases page](https://github.com/protocolbuffers/protobuf/releases) (tested with protobuf 22.4)
      - if needed, set PROTOC environment variable to location of `protoc` binary
    - `cargo install wasm-bindgen-cli@0.2.85`
      - *double-check that wasm-bindgen-cli version above matches wasm-bindgen version in Cargo.lock file*
      - *Depending on system, additional packages may need to be installed as a prerequisite for wasm-bindgen-cli. If anything is missing, installation will error and prompt what packages are missing (i.e. clang, llvm, libssl-dev)*
  - essential build tools - example for Debian/Ubuntu: `apt install -y build-essential libssl-dev pkg-config clang`
- Run `corepack enable` to enable [corepack](https://nodejs.org/dist/latest/docs/api/corepack.html) and install yarn
- Run `yarn setup` to install dependencies and configure and build all packages
- Run `yarn start` to start the local dev environment built from the sources
- Run `yarn test` to run the whole test suite (note that running tests requires a running node,
 so be sure to call `yarn start` first). Alternatively, you can run tests for a specific
 package by running `yarn workspace <package_name> test`, for example running
 `yarn workspace @hellarpro/hapi-client test` will run tests for the JS HAPI client. To see
 all available packages, please see the [packages readme](./packages/README.md)
- `yarn stop` will stop the local dev environment. Running a dev environment requires a non-trivial amount of system resources,
 so it is best to stop the local node when not in use
- Run `yarn build` to rebuild the project after changes. If you have a local node
 running, you may need to restart it by running `yarn restart`
- To completely reset all local data and builds, run `yarn reset`

### Looking for support?

For questions and support, please join our [Devs
Discord](https://chat.hellardevs.org/)

### Where are the docs?

Our docs are hosted on
[readme.io](https://hellarplatform.readme.io/docs/introduction-what-is-hellar-platform).
You can create issues and feature requests in the
[issues](https://github.com/hellarpay/platform/issues) for this repository.

### Want to report a bug or request a feature?

Please read through our [CONTRIBUTING.md](CONTRIBUTING.md) and fill out the
issue template at [platform/issues](https://github.com/hellarpay/platform/issues)!

### Want to contribute to Hellar Platform?

Check out:

- Our [Developers Discord](https://chat.hellardevs.org/)
- Our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with setting up the
  repo.
- Our [news](https://www.hellar.io/news/) and [blog](https://www.hellar.io/blog/) which contains release posts and
  explanations.

## License

[MIT](LICENSE.md)
