#!/usr/bin/env node

'use strict'

var options = {
  getCurrentRules: ['current', 'c'],
  getPluginRules: ['plugin', 'p'],
  getAllAvailableRules: ['all-available', 'a'],
  getUnusedRules: ['unused', 'u'],
  n: ['no-error'],
  verbose: ['verbose', 'v'],
}

var argv = require('yargs')
  .boolean(Object.keys(options))
  .alias(options)
  .argv

var cli = require('../lib/cli-util')

var processExitCode = argv.u && !argv.n ? 1 : 0
var getRuleFinder = require('../lib/rule-finder')
var specifiedFile = argv._[0]

var ruleFinder = getRuleFinder(specifiedFile)

if (!argv.c && !argv.p && !argv.a && !argv.u) {
  console.log('no option provided, please provide a valid option') // eslint-disable-line no-console
  console.log('usage:') // eslint-disable-line no-console
  console.log('eslint-find-rules [option] <file> [flag]') // eslint-disable-line no-console
  process.exit(0)
}

Object.keys(options).forEach(function findRules(option) {
  var rules
  var ruleFinderMethod = ruleFinder[option]
  if (argv[option] && ruleFinderMethod) {
    rules = ruleFinderMethod()
    argv.verbose && cli.push('\n' + options[option][0] + ' rules\n' + rules.length + ' rules found\n')
    if (rules.length) {
      !argv.verbose && cli.push('\n' + options[option][0] + ' rules\n')
      cli.push(rules)
      cli.write()
    } else /* istanbul ignore else */ if (option === 'getUnusedRules') {
      processExitCode = 0
    }
  }
})

if (processExitCode) {
  process.exit(processExitCode)
}
