//分类相关的数据ts类型
export interface ResponseData {
  code: number
  message: string
}

export interface LoginResponseData {
  token: string
}
export interface InftSetList {
  nftSetId: number
  nftSetName: string
  collectionSize: number
  lastHourMintCount: number
}
export interface nftSetListResponseData {
  totalCount: number
  nftSetList: InftSetList[]
}
export interface whiteListResponseData {
  totalCount: number
  whiteList: string[]
}
export interface nftSetDetailResponse {
  nftSetId: number
  nftSetName: string
  contractAddress: string
  totalSupply: number
  lastHourMintCount: number
  mintPrice: number
  nftDetail: string
}
