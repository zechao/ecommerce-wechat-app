import type { XtxGuessInstance } from '@/components/components'
import { ref } from 'vue'

export const useGuessList = () => {
  const guessRef = ref<XtxGuessInstance>()

  const onScrolltoLower = () => {
    guessRef.value?.getMore()
  }
  return {
    guessRef,
    onScrolltoLower,
  }
}
