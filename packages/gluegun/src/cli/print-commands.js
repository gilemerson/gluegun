const print = require('../utils/print')
const {
  pipe,
  isNil,
  map,
  sortBy,
  prop,
  propEq,
  reject,
  replace,
  unnest,
  equals
} = require('ramda')
const { dotPath } = require('ramdasauce')
const { isBlank } = require('../utils/string-utils')

/**
 * Is this a hidden command?
 */
const isHidden = propEq('hidden', true)

/**
 * Prints the list of commands.
 *
 * @param {RunContext} context     The context that was used
 * @param {string[]} commandRoot   Optional, only show commands with this root
 */
function printCommands (context, commandRoot) {
  const data = pipe(
    reject(isHidden),
    reject(command => {
      if (!commandRoot) { return false }
      return !equals(
        command.commandPath.slice(0, commandRoot.length),
        commandRoot
      )
    }),
    map(command => {
      const alias = command.hasAlias() ? `(${command.aliases.join(', ')})` : ''
      return [
        `${command.commandPath.join(' ')} ${alias}`,
        replace('$BRAND', context.runtime.brand, command.description || '-')
      ]
    })
  )(context.commands)

  print.newline() // a spacer
  print.table(data) // the data
}

module.exports = printCommands
