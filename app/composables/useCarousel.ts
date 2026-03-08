// Headless carousel logic, no DOM coupling, so it's easy to test and reuse.
export function useCarousel(length: MaybeRef<number>) {
  const activeIndex = ref(0)

  function next() {
    const len = toValue(length)
    if (len <= 0) return
    activeIndex.value = (activeIndex.value + 1) % len
  }

  function prev() {
    const len = toValue(length)
    if (len <= 0) return
    activeIndex.value = (activeIndex.value - 1 + len) % len
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    }
  }

  function goTo(index: number) {
    const len = toValue(length)
    const clamped = Math.max(0, Math.min(index, len - 1))
    activeIndex.value = len > 0 ? clamped : 0
  }

  return { activeIndex: readonly(activeIndex), next, prev, goTo, onKeydown }
}
