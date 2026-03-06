// Headless carousel logic, no DOM coupling, so it's easy to test and reuse.
export function useCarousel(length: MaybeRef<number>) {
  const activeIndex = ref(0)

  function next() {
    activeIndex.value = (activeIndex.value + 1) % toValue(length)
  }

  function prev() {
    activeIndex.value =
      (activeIndex.value - 1 + toValue(length)) % toValue(length)
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
    activeIndex.value = index
  }

  return { activeIndex: readonly(activeIndex), next, prev, goTo, onKeydown }
}
