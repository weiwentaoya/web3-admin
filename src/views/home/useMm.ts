import Web3 from 'web3'
import { ElMessage } from 'element-plus'
declare global {
  interface Window {
    ethereum?: any
    web3?: any
  }
}
class Mm {
  web3: any = null // web3实例
  error: string | undefined // 错误信息

  constructor() {
    this.init()
  }
  restart() {
    Mm.getInstance()
  }
  async init() {
    this.error = undefined
    if (typeof window.ethereum !== 'undefined') {
      const res = await window.ethereum.enable()
      console.log('当前钱包地址:' + res[0])
      this.web3 = new Web3(window.ethereum)
      this.web3.eth.getAccounts(function (error: any, result: any) {
        if (!error) console.log(result) //授权成功后result能正常获取到账号了
      })
    } else {
      this.error = 'MetaMask not found. Please install MetaMask extension.'
      ElMessage.error('MetaMask not found. Please install MetaMask extension.')
    }
  }
  // 查询钱包ETH余额
  async getBalance() {
    let userAdderss = await this.web3.eth.getAccounts()
    if (userAdderss.length === 0) {
      userAdderss = await window.ethereum.enable()
    }
    const res = await this.web3.eth.getBalance(userAdderss[0])
    const balance = this.web3.utils.fromWei(res, 'ether')
    ElMessage.success('当前钱包余额:' + balance)
  }
  // 查询代币余额
  async getEth(nft: any) {
    const web3: any = new Web3(window.web3.currentProvider)
    const fromAddress = web3.eth.accounts[0]
    // '代币合约Abi'
    const ethContract = web3.eth.contract(nft.contractABI)
    // '代币合约地址'
    const functionInstance = ethContract.at(nft.contractAddress)
    functionInstance.balanceOf(fromAddress, (err: any, res: any) => {
      if (!err) {
        //代币精度根据所发行的代币合约精度换算
        console.log('代币余额==', res.toNumber() / Math.pow(10, 18))
      }
    })
    // ElMessage.success('当前钱包余额:' + balance)
  }
  async freeAllow(
    nft: any,
    type: number,
    list: string | number[],
    fn: (arg0: string) => void,
  ) {
    const toAddress = nft.contractAddress
    // const amountWei = this.web3.utils.toWei(nft.mintPrice * 0.0001, 'ether')
    const contractABI = JSON.parse(atob(nft.contractABI))
    const contract = new this.web3.eth.Contract(contractABI, toAddress)
    const transaction = {
      to: toAddress,
      data: null,
      // value: null,
    }
    if (type === 1) {
      transaction.data = contract.methods.addFreeAllowList(list).encodeABI()
    } else {
      // transaction.value = amountWei
      transaction.data = contract.methods.addFeeAllowList(list).encodeABI()
    }
    try {
      let userAdderss = await this.web3.eth.getAccounts()
      if (userAdderss.length === 0) {
        userAdderss = await window.ethereum.enable()
      }
      const gas = await this.web3.eth.estimateGas({
        ...transaction,
        from: userAdderss[0],
      })
      this.web3.eth
        .sendTransaction({ ...transaction, from: userAdderss[0], gas })
        .on('transactionHash', function (hash: any) {
          console.info('transactionHash', hash)
          fn(hash)
        })
        .on('error', (err: any) => {
          console.info('error', err)
          ElMessage.error(err.message)
        })
        .catch((err: any) => {
          console.log('catch')
          ElMessage.error(err.message)
        })
    } catch (error: any) {
      console.log('error', error.message || error)
      ElMessage.error(error.message || error)
    }
  }
  static instance: Mm
  static getInstance() {
    if (!Mm.instance) {
      Mm.instance = new Mm()
    }
    return Mm.instance
  }
}

export default Mm
