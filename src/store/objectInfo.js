export default {
   state: {
      object_name: '',
      location_name: '',
      location_price_policy: '',
      location_materials_category: ''
   },
   mutations: {
      setObjectName(state, data) {
         state.object_name = data
      },
      setLocationName(state, data) {
         state.location_name = data
      },
      setLocationPricePolicy(state, data) {
         state.location_price_policy = data
      },
      setLocationMaterialsCategory(state, data) {
         state.location_materials_category = data
      },
      // clearState(state) {
      //    state.object_name = ''
      //    state.location_name = ''
      // }
   },
   // getters: {},
   // actions: {}
}