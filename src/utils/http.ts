import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    // request 触发前拼接 url
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    // set default timeout to 10s
    options.timeout = 10000

    //set header for indentify app
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }

    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }

    console.log(options)
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)
