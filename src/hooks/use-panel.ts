import { useState, useRef, useEffect } from "react"

export function usePanel() {
  const [isMobile, setIsMobile] = useState(false)

  // Desktop sidebar
  const [desktopMounted, setDesktopMounted] = useState(false)
  const [desktopVisible, setDesktopVisible] = useState(false)

  // Mobile bottom sheet
  const [sheetMounted, setSheetMounted] = useState(false)
  const [sheetVisible, setSheetVisible] = useState(false)

  const panelOpenRef = useRef(false)

  // Sync panelOpenRef
  useEffect(() => {
    panelOpenRef.current = desktopMounted || sheetMounted
  }, [desktopMounted, sheetMounted])

  // Deteksi mobile + handle resize
  useEffect(() => {
    let prevMobile = window.innerWidth < 768

    const check = () => {
      const nowMobile = window.innerWidth < 768
      setIsMobile(nowMobile)
      if (nowMobile === prevMobile) return
      prevMobile = nowMobile

      restoreScroll()

      if (nowMobile) {
        setDesktopVisible(false)
        setDesktopMounted(false)
        if (panelOpenRef.current) openSheet()
      } else {
        setSheetVisible(false)
        setSheetMounted(false)
        if (panelOpenRef.current) openDesktop()
      }
    }

    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ESC untuk tutup desktop
  useEffect(() => {
    if (!desktopMounted) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeDesktop() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [desktopMounted])

  function lockScroll() {
    const scrollY = window.scrollY
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"
    document.body.style.overflow = "hidden"
  }

  function restoreScroll() {
    const top = document.body.style.top
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    document.body.style.overflow = ""
    if (top) window.scrollTo(0, -parseInt(top || "0"))
  }

  function openDesktop() {
    setDesktopMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setDesktopVisible(true)))
    lockScroll()
  }

  function closeDesktop() {
    setDesktopVisible(false)
    restoreScroll()
    setTimeout(() => setDesktopMounted(false), 300)
  }

  function openSheet() {
    setSheetMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setSheetVisible(true)))
    lockScroll()
  }

  function closeSheet() {
    setSheetVisible(false)
    restoreScroll()
    setTimeout(() => setSheetMounted(false), 350)
  }

  function handleTriggerClick() {
    if (isMobile) {
      sheetMounted ? closeSheet() : openSheet()
    } else {
      desktopMounted ? closeDesktop() : openDesktop()
    }
  }

  return {
    isMobile,
    desktopMounted, desktopVisible, closeDesktop,
    sheetMounted, sheetVisible, closeSheet,
    handleTriggerClick,
  }
}