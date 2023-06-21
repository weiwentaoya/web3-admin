import request from '@/utils/request'
import * as types from './type'
enum API {
  LOGIN = '/v1/admin_login',
  NFT_SET_LIST = '/v1/nft_set_list',
  NFTSETDETAIL = '/v1/nft_set_detail',
  WHITE_LIST = '/v1/white_list',
  REFRESH = '/v1/white_list_refresh',
}

export const adminLogin = (params?: any) =>
  request.post<types.LoginResponseData>(API.LOGIN, { ...params })

export const nftSetList = (params?: any) =>
  request.post<types.nftSetListResponseData>(API.NFT_SET_LIST, { ...params })

export const nftDetail = (params?: any) =>
  request.post<types.nftSetDetailResponse>(API.NFTSETDETAIL, { ...params })

export const whiteList = (params?: any) =>
  request.post<types.whiteListResponseData>(API.WHITE_LIST, { ...params })

export const refresh = (params?: any) =>
  request.post(API.REFRESH, { ...params })
