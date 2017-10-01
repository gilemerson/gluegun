const jetpack = require('fs-jetpack')
const loadCommandFromFile = require('./command-loader')
const loadExtensionFromFile = require('./extension-loader')
const { isNotDirectory, isFile } = require('../utils/filesystem-utils')
const { isBlank } = require('../utils/string-utils')
const { assoc, map, filter, complement, endsWith } = require('ramda')

/**
 * Loads a plugin from a directory.
 *
 * @param {RunContext}  context The current context
 * @param {string}      directory The full path to the directory to load.
 * @param {{}}          options   Additional options to customize the loading process.
 */
function loadFromDirectory (context, directory, options = {}) {
  let commands = []
  let extensions = []

  const {
    brand = 'gluegun',
    commandFilePattern = '*.js',
    extensionFilePattern = '*.js',
    hidden = false,
    name
  } = options

  // sanity check the input
  if (isBlank(directory)) {
    throw new Error(`Error: loadFromDirectory given a blank directory`)
  }

  // directory check
  if (isNotDirectory(directory)) {
    throw new Error(`Error: couldn't load plugin (not a directory): ${directory}`)
  }

  const jetpackPlugin = jetpack.cwd(plugin.directory)

  // load the commands found in the commands sub-directory
  if (jetpackPlugin.exists('commands') === 'dir') {
    const commands = jetpackPlugin
      .cwd('commands')
      .find({ matching: commandFilePattern, recursive: true })
      .filter(complement(endsWith('.test.js')))

    commands = map(
      file => loadCommandFromFile(`${directory}/commands/${file}`, { hidden }),
      commands
    )
  }

  // load the extensions found in the extensions sub-directory
  if (jetpackPlugin.exists('extensions') === 'dir') {
    const extensions = jetpackPlugin
      .cwd('extensions')
      .find({ matching: extensionFilePattern, recursive: false })
      .filter(complement(endsWith('.test.js')))

    extensions = map(
      file => loadExtensionFromFile(`${directory}/extensions/${file}`),
      extensions
    )
  }

  // add commands and extensions to the context
  context.commands = (context.commands || []).concat(commands)
  context.extensions = (context.extensions || []).concat(extensions)

  return context
}

module.exports = loadFromDirectory
