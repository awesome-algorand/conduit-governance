import fs from 'node:fs'
import yaml from 'js-yaml'

const addresses = [
    'GULDQIEZ2CUPBSHKXRWUW7X3LCYL44AI5GGSHHOQDGKJAZ2OANZJ43S72U',
    '57QZ4S7YHTWPRAM3DQ2MLNSVLAQB7DTK4D7SUNRIEFMRGOU7DMYFGF55BY',
    'UD33QBPIM4ZO4B2WK5Y5DYT5J5LYY5FA3IF3G4AVYSCWLCSMS5NYDRW6GE',
    'UAME4M7T2NWECVNCUDGQX6LJ7OVDLZP234GFQL3TH6YZUPRV3VF5NGRSRI',
    '7K5TT4US7M3FM7L3XBJXSXLJGF2WCXPBV2YZJJO2FH46VCZOS3ICJ7E4QU',
    'SAHBJDRHHRR72JHTWSXZR5VHQQUVC7S757TJZI656FWSDO3TZZWV3IGJV4',
    'RFKCBRTPO76KTY7KSJ3HVWCH5HLBPNBHQYDC52QH3VRS2KIM7N56AS44M4',
    'FONC4XH5QPJNUPZPHCMFGPDQ43J3VWYJ7ECI43AVGAGDIHKVBHPOH7YEXA',
    'B6D7YFR7NUNZAA4E7OIHME4VUX4R554DMDIX3QM7JML33AMXXILRPJJM4M',
    '75X4V7CEN6HW3EYSJEJLWDNVX3BOJPPEHU2S34FSEKIN5WEB2OZN2VL5T4',
    '2K24MUDRJPOOZBUTE5WW44WCZZUPVWNYWVWG4Z2Z2ZZVCYJPVDWRVHVJEQ'
]

try {
    const data = yaml.load(fs.readFileSync('conduit.template.yml', 'utf8'))
    data.processors = {
        name: 'filter_processor',
        config: {
            "search-inner": true,
            "omit-group-transactions": true,
            filters: [
                {
                    any: addresses.map((address, i) => {
                        return {
                            all: [
                                {
                                    'tag': 'txn.rcv',
                                    'expression-type': 'equal',
                                    'expression': address
                                },
                                {
                                    'tag': 'txn.type',
                                    'expression-type': 'equal',
                                    'expression': 'pay'
                                },
                                {
                                    'tag': 'txn.note',
                                    'expression-type': 'regex',
                                    'expression': `af\/gov${i + 1}:j{*.*}`
                                }
                            ],
                        }

                    })
                }
            ]
        }
    }
    fs.writeFileSync('conduit.yml', yaml.dump(data))
} catch (e) {
    console.log(e)
}
