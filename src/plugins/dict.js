import Vue from 'vue'
import VueDataDict from 'vue-data-dict'
import { listByDictKey } from '@/api/system/dictDetail'

Vue.use(VueDataDict, {
  // onCreated(dict) {
  //   console.log('dict created: %o', dict)
  // },
  // onReady(dict) {
  //   console.log('dict ready: %o', dict)
  // },
  metas: {
    '*': {
      labelField: 'dictLabel',
      valueField: 'dictValue',
      request(dictMeta) {
        // console.log('request', dictMeta)
        return listByDictKey(dictMeta.type)
      },
      responseConverter(response, dictMeta) {
        // console.log('responseConverter', response, dictMeta)
        return (response.data || []).map(item => VueDataDict.DictConverter(item, dictMeta))
      }
    }
  }
})
