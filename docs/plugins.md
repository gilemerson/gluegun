# Plugins

Functionality is added to the `CLI runtime` with plugins. Plugins can be yours or the end users.

A plugin is directory that contains 3 optional sub-directories:

* `commands`
* `templates`
* `extensions`

And 1 optional file:

* `<brand>.toml`

Other than the 3 directories listed, you're welcome to put any other files or sub-directories in the plugin directory.

Since multiple plugins can be loaded, they must have unique names.  The names are indicated by reading the `name` property of the `<brand>.toml` inside the plugin directory, or the plugin directory name itself.

## commands

Commands are run from the command line (CLI).

```
movies actor
```

Here, the `actor` command is run. It is a JS file (`commands/actor.js`) that exports a structure that looks something like this:

```js
module.exports = {
  name: 'actor',
  alias: [ 'a' ],
  description: 'Displays the name of an actor',
  hidden: false,
  run: async (context) => {
    const { print } = context

    print.info(`Tom Hanks`)
  }
}
```

The `name` and `description` properties are used in `printCommands` calls to print out some help in a table.

`alias` allows you to invoke these commands using an alias.

`hidden` says whether to show the command in help screens or not.

The `run` property should be a function (async or not) that does whatever you want it to. You'll receive the gluegun `context` object which contains the [core extensions](./context-api.md) and any additional extensions you've loaded.

## templates

Templates are [ejs](http://www.embeddedjs.com/) files that get translated by a command into a source code file or similar.

TODO: Add more info, including examples.

## extensions

Extensions are additional functionality that you can monkeypatch onto the `context` object. They look something like this:

```js
// extensions/sayhello.js
function attach (context) {
  const { print } = context

  context.sayhello = () => { print.info('Hello from an extension!') }
}

module.exports = attach
```

When you have this extension, you can access it in any command file, like this:

```js
// ...
  run: async (context) => {
    const { sayhello } = context

    sayhello()

    // or

    context.sayhello()
  }
```

# Configuration File

## name

The name is a prefix to your commands.

```toml
name = 'something'
```

Since many plugins can be installed, we namespace them. If you're creating plugins
for others to use, try to be very specific about the name. Naming it after a project
is a good idea (e.g. `ignite` or `reactotron`). Calling it `dev` or `internet` is
probably asking for trouble.

If you're just making plugins for your project, then please, feel free to call it
whatever you'd like.

A name:

* can contain **numbers & letters**
* should be **lowercase**
* spaces-should-have-**dashes**-if-you-need-them

If `name` does not exist, the default will be the name of the directory.

## defaults

Default configuration settings which may be used by your commands and overridden by end users.

```toml
[defaults]
semicolons = true
colorTheme = ['red', 'no', 'blue', 'aaaaaaaaa']
```


## 3rd Party Modules

| module                                                          | purpose                 |
| --------------------------------------------------------------- | ----------------------- |
| [enquirer](https://github.com/enquirer/enquirer)                | prompts & user input    |
| [fs-jetpack](https://github.com/szwacz/fs-jetpack)              | files & folders         |
| [semver](https://github.com/npm/node-semver)                    | semantic versioning     |
| [ejs](https://github.com/mde/ejs)                               | templates               |
| [apisauce](https://github.com/skellock/apisauce)                | http requests           |
| [lodash](https://github.com/lodash/lodash)                      | utilities               |
| [colors](https://github.com/Marak/colors.js)                    | colors in your terminal |
| [ascii-table](https://github.com/sorensen/ascii-table)          | tables in your terminal |
| [ramda](https://github.com/ramda/ramda)                         | functional utilities    |
| [ramdasauce](https://github.com/skellock/ramdasauce)            | functional utilities    |
| [minimist](https://github.com/substack/minimist)                | command line parsing    |
| [toml](https://github.com/BinaryMuse/toml-node)                 | TOML files              |
| [cross-spawn](https://github.com/IndigoUnited/node-cross-spawn) | running sub-commands    |
| [execa](https://github.com/sindresorhus/execa)                  | running sub-commands    |
| [node-which](https://github.com/npm/node-which)                 | executable finder       |
| [ora](https://github.com/sindresorhus/ora)                      | spinner                 |

