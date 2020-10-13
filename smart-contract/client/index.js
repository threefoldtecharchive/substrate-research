const yargs = require('yargs')
const { exit } = require('yargs')
const { createReservation, getReservation, payReservation, acceptContract, claimContractFunds } = require('./src/reservations')

const argv = yargs
  .command('create', 'Create a volume reservation', {
    nodeID: {
      description: 'ID of the node to deploy on',
      alias: 'n',
      type: 'string'
    },
    type: {
      description: 'Volume disk type',
      alias: 't',
      type: 'number'
    },
    size: {
      description: 'Volume size in GB',
      alias: 's',
      type: 'number'
    }
  })
  .command('getReservation', 'Get a reservation by ID', {
    reservationId: {
      description: 'Reservation ID',
      alias: 'id',
      type: 'string'
    }
  })
  .command('payReservation', 'Get a reservation by ID', {
    reservationId: {
      description: 'Reservation ID',
      alias: 'id',
      type: 'string'
    },
    amount: {
      description: 'Amount to pay',
      alias: 'a',
      type: 'number'
    }
  })
  .command('acceptContract', 'Accept a reservation by ID', {
    reservationId: {
      description: 'Reservation ID',
      alias: 'id',
      type: 'string'
    },
    mnemonic: {
      description: 'Mnemonic to sign with',
      alias: 'm',
      type: 'string'
    }
  })
  .command('claimContractFunds', 'Claim funds off a contract', {
    reservationId: {
      description: 'Reservation ID',
      alias: 'id',
      type: 'string'
    },
    mnemonic: {
      description: 'Mnemonic to sign with',
      alias: 'm',
      type: 'string'
    }
  })
  .help()
  .alias('help', 'h')
  .argv

if (argv._.includes('create')) {
  if (argv.n === '' || argv.t === '' || argv.s === '') console.log('Bad params')

  createReservation(argv.n, argv.t, argv.s, ({ events = [], status }) => {
    console.log(`Current status is ${status.type}`)

    if (status.isFinalized) {
      console.log(`Transaction included at blockHash ${status.asFinalized}`)

      // Loop through Vec<EventRecord> to display all events
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
      })
      exit(1)
    }
  }).catch(err => {
    console.log(err)
    exit(1)
  })
}
if (argv._.includes('getReservation')) {
  if (argv.id === '') console.log('Bad params')

  getReservation(argv.id)
    .then(contract => {
      console.log('\ncontract: ')
      console.log(contract)
      exit(0)
    })
    .catch(err => {
      console.log(err)
      exit(1)
    })
}
if (argv._.includes('payReservation')) {
  if (argv.id === '' || argv.a === 0) console.log('Bad params')

  payReservation(argv.id, argv.a.toString(), ({ events = [], status }) => {
    console.log(`Current status is ${status.type}`)

    if (status.isFinalized) {
      console.log(`Transaction included at blockHash ${status.asFinalized}`)

      // Loop through Vec<EventRecord> to display all events
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
      })
      exit(1)
    }
  }).catch(err => {
    console.log(err)
    exit(1)
  })
}
if (argv._.includes('acceptContract')) {
  if (argv.id === '' || !argv.m) {
    console.log('Bad Params')
    exit(1)
  }

  acceptContract(argv.id, argv.m, ({ events = [], status }) => {
    console.log(`Current status is ${status.type}`)

    if (status.isFinalized) {
      console.log(`Transaction included at blockHash ${status.asFinalized}`)

      // Loop through Vec<EventRecord> to display all events
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
      })
      exit(1)
    }
  }).catch(err => {
    console.log(err)
    exit(1)
  })
}
if (argv._.includes('claimContractFunds')) {
  if (argv.id === '' || !argv.m) {
    console.log('Bad Params')
    exit(1)
  }

  claimContractFunds(argv.id, argv.m, ({ events = [], status }) => {
    console.log(`Current status is ${status.type}`)

    if (status.isFinalized) {
      console.log(`Transaction included at blockHash ${status.asFinalized}`)

      // Loop through Vec<EventRecord> to display all events
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
      })
      exit(1)
    }
  }).catch(err => {
    console.log(err)
    exit(1)
  })
}
