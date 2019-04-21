import Color from './color';
import { scale } from '../Utils';

const Layout = {
  mt10: { marginTop: scale(10) },
  mb10: { marginBottom: scale(10) },
  ml10: { marginLeft: scale(10) },
  mr10: { marginRight: scale(10) },

  mt20: { marginTop: scale(20) },
  mb20: { marginBottom: scale(20) },
  ml20: { marginLeft: scale(20) },
  mr20: { marginRight: scale(20) },

  mh10: { marginHorizontal: scale(10) },
  mh20: { marginHorizontal: scale(20) },
  mv10: { marginVertical: scale(10) },
  mv20: { marginVertical: scale(20) },

  pt10: { paddingTop: scale(10) },
  pb10: { paddingBottom: scale(10) },
  pl10: { paddingLeft: scale(10) },
  pr10: { paddingRight: scale(10) },

  pt20: { paddingTop: scale(20) },
  pb20: { paddingBottom: scale(20) },
  pl20: { paddingLeft: scale(20) },
  pr20: { paddingRight: scale(20) },

  ph10: { paddingHorizontal: scale(10) },
  ph20: { paddingHorizontal: scale(20) },
  pv10: { paddingVertical: scale(10) },
  pv20: { paddingVertical: scale(20) },
}


const Style = {
  Color,
  Layout,
}

export {
  Color,
  Layout,
}

export default Style;