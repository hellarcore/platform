# Hellarmate

[![Build Status](https://github.com/hellarpay/platform/actions/workflows/release.yml/badge.svg)](https://github.com/hellarpay/platform/actions/workflows/release.yml)
[![Release Date](https://img.shields.io/github/release-date/hellarpay/platform)](https://github.com/hellarpay/platform/releases/latest)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

Distribution package for Hellar node installation

## Table of Contents

- [Install](#install)
- [Update](#update)
- [Usage](#usage)
  - [Command line interface](#cli)
  - [Node setup](#node-setup)
  - [Configure node](#configure-node)
  - [Start node](#start-node)
  - [Stop node](#stop-node)
  - [Restart node](#restart-node)
  - [Show node status](#show-node-status)
  - [Execute Core CLI command](#execute-core-cli-command)
  - [Reset node data](#reset-node-data)
  - [Full node](#full-node)
  - [Node groups](#node-groups)
  - [Development](#development)
  - [Docker Compose](#docker-compose)
- [Contributing](#contributing)
- [License](#license)

## Install

### Dependencies

* [Docker](https://docs.docker.com/engine/installation/) (v20.10+)
* [Node.js](https://nodejs.org/en/download/) (v20, NPM v8.0+)

For Linux installations you may optionally wish to follow the Docker [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/) to manage Docker as a non-root user, otherwise you will have to run CLI and Docker commands with `sudo`.

### Distribution package

Use NPM to install hellarmate globally in your system:
```bash
$ npm install -g hellarmate
```

## Update

The `update` command is used to quickly get the latest patches for hellarmate components. It is necessary to restart the node after the update is complete.

```
USAGE
  $ hellarmate update [-v] [--config <value>]

FLAGS
  -v, --verbose     use verbose mode for output
  --config=<value>  configuration name to use
  --format=<option>  [default: plain] display output format
                   <options: json|plain>
```

Example usage:

```bash
$ hellarmate stop
$ npm update -g hellarmate
$ hellarmate update
╔══════════════════╤══════════════════════════════╤════════════╗
║ Service          │ Image                        │ Updated    ║
╟──────────────────┼──────────────────────────────┼────────────╢
║ Core             │ hellarpay/hellard:19.1.0         │ up to date ║
║ Drive ABCI       │ hellarpay/drive:0.24           │ updated    ║
║ Drive Tenderhellar │ hellarpay/tenderhellar:0.11.2    │ up to date ║
║ HAPI API         │ hellarpay/hapi:0.24            │ updated    ║
║ HAPI Envoy       │ hellarpay/envoy:0.24           │ updated    ║
║ Hellarmate Helper  │ hellarpay/hellarmate-helper:0.24 │ updated    ║
╚══════════════════╧══════════════════════════════╧════════════╝
$ hellarmate update --format=json 
[{"name":"core","title":"Core","updated":false,"image":"hellarpay/hellard:19.2.0"},{"name":"drive_abci","title":"Drive ABCI","pulled":false,"image":"hellarpay/drive:0.24"},{"name":"drive_tenderhellar","title":"Drive Tenderhellar","pulled":true,"image":"hellarpay/tenderhellar:0.11.2"},{"name":"hapi_api","title":"HAPI API","pulled":false,"image":"hellarpay/hapi:0.24"},{"name":"hapi_envoy","title":"HAPI Envoy","pulled":false,"image":"hellarpay/envoy:0.24"},{"name":"hellarmate_helper","title":"Hellarmate Helper","pulled":false,"image":"hellarpay/hellarmate-helper:0.24"}]
$ hellarmate start
```

In some cases, you must also additionally reset platform data:

* Upgrade contains non-compatible changes (e.g. switching between v22/v23)
* The ``hellarmate setup`` command exited with errors or was interrupted
* The platform layer was wiped on the network

```bash
$ hellarmate stop
$ npm update -g hellarmate
$ hellarmate reset --platform-only --hard
$ hellarmate update
$ hellarmate setup
$ hellarmate start
```

Before applying an upgrade, the local network should be stopped and reset with ``hellarmate reset --hard``. 

## Usage

The package contains a CLI, Docker Compose and configuration files.

### CLI

The CLI can be used to perform routine tasks. Invoke the CLI with `hellarmate`. To list available commands, either run `hellarmate` with no parameters or execute `hellarmate help`. To list the help on any command, execute the command followed by the `--help` option.

### Node setup

The `setup` command is used to quickly configure common node configurations. Arguments may be provided as options, otherwise they will be queried interactively with sensible values suggested.

```
USAGE
  $ hellarmate setup [PRESET] [-v] [-d] [-c <value>] [-m <value>]

ARGUMENTS
  PRESET  (mainnet|testnet|local) Node configuration preset

FLAGS
  -c, --node-count=<value>      number of nodes to set up
  -d, --[no-]debug-logs         enable debug logs
  -m, --miner-interval=<value>  interval between blocks
  -v, --verbose                 use verbose mode for output

DESCRIPTION
  Set up a new Hellar node
```

Supported presets:
 * `mainnet` - a node connected to the Hellar main network
 * `testnet` - a node connected to the Hellar test network
 * `local` - a full network environment on your machine for local development. To operate a group of nodes, use the [group commands](#node-groups)

To set up a testnet node:
```bash
$ hellarmate setup testnet
```

### Configure node

The `config` command is used to manage your node configuration before starting the node. Several system configurations are provided as a starting point:

 - base - basic config for use as template
 - local - template for local node configs
 - testnet - testnet node configuration
 - mainnet - mainnet node configuration

You can modify and use the system configs directly, or create your own. You can base your own configs on one of the system configs using the `hellarmate config create CONFIG [FROM]` command. You must set a default config with `hellarmate config default CONFIG` or specify a config with the `--config=<config>` option when running commands. The `base` config is initially set as default.

```
USAGE
  $ hellarmate config [-v] [--config <value>]

FLAGS
  -v, --verbose     use verbose mode for output
  --config=<value>  configuration name to use

DESCRIPTION
  Show default config

COMMANDS
  config create   Create new config
  config default  Manage default config
  config envs     Export config to envs
  config get      Get config option
  config list     List available configs
  config remove   Remove config
  config render   Render config's service configs
  config set      Set config option
```

### Start node

The `start` command is used to start a node with the default or specified config.

```
USAGE
  $ hellarmate start [-v] [--config <value>] [-w]

FLAGS
  -v, --verbose             use verbose mode for output
  -w, --wait-for-readiness  wait for nodes to be ready
  --config=<value>          configuration name to use
```

To start a masternode:
```bash
$ hellarmate start
```

### Stop node

The `stop` command is used to stop a running node.

```
USAGE
  $ hellarmate stop [-v] [--config <value>] [-f]

FLAGS
  -f, --force       force stop even if any is running
  -v, --verbose     use verbose mode for output
  --config=<value>  configuration name to use
```

To stop a node:
```bash
$ hellarmate stop
```

### Restart node

The `restart` command is used to restart a node with the default or specified config.

```
USAGE
  $ hellarmate restart [-v] [--config <value>]

FLAGS
  -v, --verbose     use verbose mode for output
  --config=<value>  configuration name to use
```

### Show node status

The `status` command outputs status information relating to either the host, masternode or services.

```
USAGE
  $ hellarmate status [-v] [--config <value>] [--format json|plain]

FLAGS
  -v, --verbose      use verbose mode for output
  --config=<value>   configuration name to use
  --format=<option>  [default: plain] display output format
                     <options: json|plain>

COMMANDS
  status core        Show core status details
  status host        Show host status details
  status masternode  Show masternode status details
  status platform    Show platform status details
  status services    Show service status details
```

To show the host status:
```bash
$ hellarmate status host
```

### Execute Core CLI command

The `core cli` command executes an `hellar-cli` command to the core container on the current config.

```
USAGE
  $ hellarmate core cli [COMMAND] [--config <value>]

ARGUMENTS
  COMMAND hellar-cli command written in the double quotes 

FLAGS
  --config=<value>  configuration name to use

DESCRIPTION
  Hellar Core CLI
```

Example:
```bash
$ hellarmate core cli "getblockcount"
1337
```

### Reset node data

The `reset` command removes all data corresponding to the specified config and allows you to start a node from scratch.

```
USAGE
  $ hellarmate reset [-v] [--config <value>] [-h] [-f] [-p]

FLAGS
  -f, --force          skip running services check
  -h, --hard           reset config as well as data
  -p, --platform-only  reset platform data only
  -v, --verbose        use verbose mode for output
  --config=<value>     configuration name to use
```

To reset a node:
```bash
$ hellarmate reset
```

#### Hard reset
With the hard reset mode enabled, the corresponding config will be reset in addition to the platform data. After a hard reset, it is necessary to run the node [setup](#node-setup) to proceed.
```bash
$ hellarmate reset --hard
```

#### Manual reset
Manual reset can be used if the local setup is corrupted and a hard reset does not fix it. This could happen due to hellarmate configuration incompatibilities after a major upgrade, leaving you unable to execute any commands.
```bash
docker stop $(docker ps -q)
docker system prune
docker volume prune
rm -rf ~/.hellarmate/
```


### Reindex core chain data

The `core reindex` command helps you to reindex your Core instance in the node.

The process displays interactive progress and may be interrupted at any time. After reindex is finished core and other services will become online without any interactions from the user.

The `core reindex` command works for regular and local configurations.

```
USAGE
  $ hellarmate core reindex [-v] [--config <value>] [-d] [-f]

FLAGS
  -d, --detach      run the reindex process in the background
  -f, --force       reindex already running node without confirmation
  -v, --verbose     use verbose mode for output
  --config=<value>  configuration name to use

DESCRIPTION
  Reindex Core data
```

### Full node
It is also possible to start a full node instead of a masternode. Modify the config setting as follows:
```bash
hellarmate config set core.masternode.enable false
```


### Node groups

The CLI allows [setup](#node-setup) and operation of multiple nodes. Only the `local` preset is supported at the moment.

#### Default group

The [setup](#node-setup) command sets the corresponding group as default. To output the current default group or set another one as default, use the `group:default` command.

```
USAGE
  $ hellarmate group default [GROUP] [-v]

ARGUMENTS
  GROUP  group name

FLAGS
  -v, --verbose  use verbose mode for output
```

#### List group configs

The `group list` command outputs a list of group configs.

```
USAGE
  $ hellarmate group list [-v] [--group <value>]

FLAGS
  -v, --verbose    use verbose mode for output
  --group=<value>  group name to use
```

#### Start group nodes

The `group start` command is used to start a group of nodes belonging to the default group or a specified group.

```
USAGE
  $ hellarmate group start [-v] [--group <value>] [-w]

FLAGS
  -v, --verbose             use verbose mode for output
  -w, --wait-for-readiness  wait for nodes to be ready
  --group=<value>           group name to use
```

#### Stop group nodes

The `group stop` command is used to stop group nodes belonging to the default group or a specified group.

```
USAGE
  $ hellarmate group stop [-v] [--group <value>] [-f]

FLAGS
  -f, --force      force stop even if any service is running
  -v, --verbose    use verbose mode for output
  --group=<value>  group name to use
```

#### Restart group nodes

The `group restart` command is used to restart group nodes belonging to the default group or a specified group.

```
USAGE
  $ hellarmate group restart [-v] [--group <value>]

FLAGS
  -v, --verbose    use verbose mode for output
  --group=<value>  group name to use
```

#### Show group status

The `group status` command outputs group status information.

```
USAGE
  $ hellarmate group status [-v] [--group <value>] [--format json|plain]

FLAGS
  -v, --verbose      use verbose mode for output
  --format=<option>  [default: plain] display output format
                     <options: json|plain>
  --group=<value>    group name to use
```

#### Reset group nodes

The `group reset` command removes all data corresponding to the specified group and allows you to start group nodes from scratch.

```
USAGE
  $ hellarmate group reset [-v] [--group <value>] [--hard] [-f] [-p]

FLAGS
  -f, --force          reset even running node
  -p, --platform-only  reset platform data only
  -v, --verbose        use verbose mode for output
  --group=<value>      group name to use
  --hard               reset config as well as data
```

With hard reset mode enabled, the corresponding node configs will be reset as well. It will be necessary to run node [setup](#node-setup) again from scratch to start a new local node group.

#### Reindex group nodes

The `group core reindex` reindexes all your local hellar core containers

```
USAGE
  $ hellarmate group core reindex [-v] [--group <value>] [-d] [-f]

FLAGS
  -d, --detach     run the reindex process in the background
  -f, --force      reindex already running node without confirmation
  -v, --verbose    use verbose mode for output
  --group=<value>  group name to use

DESCRIPTION
  Reindex group Core data
```

With hard reset mode enabled, the corresponding node configs will be reset as well. It will be necessary to run node [setup](#node-setup) again from scratch to start a new local node group.

#### Mint tHellar

The `wallet mint` command can be used to generate an arbitrary amount of tHellar to a new or specified recipient address on a local network. The network must be stopped before running this command.

```
USAGE
  $ hellarmate wallet mint [AMOUNT] [-v] [--config <value>] [-a <value>]

ARGUMENTS
  AMOUNT  amount of tHellar to be generated to address

FLAGS
  -a, --address=<value>  use recipient address instead of creating new
  -v, --verbose          use verbose mode for output
  --config=<value>       configuration name to use
```

#### Create config group

To group nodes together, set a group name using the `group` option with the corresponding configs.

Create a group of two testnet nodes:
```bash
# create a new config using `testnet` config as template
hellarmate config create testnet_2 testnet

# combine configs into the group
hellarmate config set --config=testnet group testnet
hellarmate config set --config=testnet_2 group testnet

# set the group as default
hellarmate group default testnet
```

#### Render config's service configs

If you changed your config manually and you'd like to hellarmate to render
again all your service configs (hellard.conf, config.toml, etc.), you can issue that command.

```bash
hellarmate config render
Config "testnet" service configs rendered
```

### Development

To start a local hellar network, the `setup` command with the `local` preset can be used to generate configs, mine some tHellar, register masternodes, and populate the nodes with the data required for local development.

To allow developers to quickly test changes to HAPI and Drive, a local path for this repository may be specified using the `platform.sourcePath` config options. A Docker image will be built from the provided path and then used by Hellarmate.

### Docker Compose

If you want to use Docker Compose directly, you will need to pass in configuration as a dotenv file. You can output a config to a dotenv file for Docker Compose as follows:

```bash
$ hellarmate config envs --config=testnet --output-file .env.testnet
```

Then specify the created dotenv file as an option for the `docker compose` command:

```bash
$ docker compose --env-file=.env.testnet up -d
```

## Troubleshooting

#### [FAILED] Node is not running
One of your nodes is not running, you may retry with the --force option:

`hellarmate stop --force` to stop single node (fullnode / masternode)

`hellarmate group:stop --force` to stop group of nodes (local)

#### Running services detected. Please ensure all services are stopped for this config before starting
Some nodes are still running and preventing hellarmate from starting properly. This may occur after a command exits with an error. Try to force stop the nodes using the `--force` option before trying to run the `start` command again.

`hellarmate stop --force` to stop single node (fullnode / masternode)

`hellarmate group:stop --force` to stop group of nodes (local)

#### externalIp option is not set in base config
This may happen when you switch back and forth between major versions, making config incompatible. In this case, do a manual reset and run setup again.

#### TypeError Plugin: hellarmate: Cannot read properties of undefined (reading 'hellar')
This can occur if other `.yarnrc` and `node_modules` directories exist in parent directories. Check your home directory for any `.yarnrc` and `node_modules`, delete them all and try again.


## Contributing

Feel free to dive in! [Open an issue](https://github.com/hellarpay/platform/issues/new/choose) or submit PRs.

## License

[MIT](LICENSE) &copy; Hellar Core Group, Inc.
