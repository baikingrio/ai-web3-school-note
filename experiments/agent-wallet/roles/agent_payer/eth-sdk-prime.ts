import { getSepoliaSdk } from '@gnosis-guild/eth-sdk-client'
import { ethers } from 'ethers'

/** Load generated Sepolia SDK before zodiac-roles-sdk/kit builds `allow.sepolia`. */
void getSepoliaSdk(ethers.ZeroAddress)
