import { describe, it, expect } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import SearchBar from "~/components/SearchBar.vue"

describe("SearchBar", () => {
  it("renders with placeholder text", async () => {
    const wrapper = await mountSuspended(SearchBar)
    const input = wrapper.find("input")
    expect(input.attributes("placeholder")).toContain("Zoek op plaats")
  })

  it("pre-fills the input from initialQuery prop", async () => {
    const wrapper = await mountSuspended(SearchBar, {
      props: { initialQuery: "Rotterdam" },
    })
    const input = wrapper.find("input")
    expect((input.element as HTMLInputElement).value).toBe("Rotterdam")
  })

  it("emits search event with trimmed value on form submit", async () => {
    const wrapper = await mountSuspended(SearchBar)
    const input = wrapper.find("input")
    await input.setValue("  Amsterdam  ")
    await wrapper.find("form").trigger("submit")
    expect(wrapper.emitted("search")).toBeTruthy()
    expect(wrapper.emitted("search")![0]).toEqual(["Amsterdam"])
  })

  it("emits search with empty string when cleared", async () => {
    const wrapper = await mountSuspended(SearchBar, {
      props: { initialQuery: "Utrecht" },
    })
    const input = wrapper.find("input")
    await input.setValue("")
    await wrapper.find("form").trigger("submit")
    expect(wrapper.emitted("search")![0]).toEqual([""])
  })

  it("has a submit button labeled 'Zoeken'", async () => {
    const wrapper = await mountSuspended(SearchBar)
    const button = wrapper.find("button[type='submit']")
    expect(button.text()).toBe("Zoeken")
  })

  it("uses role='search' on the form for accessibility", async () => {
    const wrapper = await mountSuspended(SearchBar)
    expect(wrapper.find("form").attributes("role")).toBe("search")
  })
})
