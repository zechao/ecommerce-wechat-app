import XtxGuess from './XtxGuess.vue'
import XtxSwiper from './XtxSwiper.vue'

declare module 'vue' {
  export interface GlobalComponents {
    XtxGuess: typeof XtxGuess
    XtxSwiper: typeof XtxSwiper
  }
}

export type XtxGuessInstance = InstanceType<typeof XtxGuess>
