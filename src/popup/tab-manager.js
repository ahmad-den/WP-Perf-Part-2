/**
 * Module for managing popup tabs
 */

console.log("=== TAB MANAGER LOADING ===")

/**
 * Sets up tab switching functionality
 * @param {Array} tabs - Array of tab configuration objects
 */
export function setupTabSwitching(tabs) {
  console.log("setupTabSwitching called with tabs:", tabs)

  // Create and insert the sliding indicator
  const tabsContainer = document.querySelector('.tabs')
  if (tabsContainer && !tabsContainer.querySelector('.tab-indicator')) {
    const indicator = document.createElement('div')
    indicator.className = 'tab-indicator'
    tabsContainer.appendChild(indicator)
  }

  function switchTab(activeTabId) {
    console.log("switchTab called with:", activeTabId)
    
    // Find the active tab element and update indicator position
    const activeTabElement = document.getElementById(activeTabId)
    if (activeTabElement) {
      updateTabIndicator(activeTabElement)
    }
    
    // Handle content switching with smooth transitions
    tabs.forEach((tabInfo) => {
      const tabEl = document.getElementById(tabInfo.id)
      const contentEl = document.getElementById(tabInfo.contentId)
      console.log(`Processing tab ${tabInfo.id}:`, !!tabEl, !!contentEl)

      if (tabEl && contentEl) {
        if (tabInfo.id === activeTabId) {
          tabEl.classList.add("active")
          
          // Smooth content transition
          setTimeout(() => {
            contentEl.classList.add("active")
          }, 50) // Small delay for smoother transition
          
          console.log(`Activated tab: ${tabInfo.id}`)
        } else {
          tabEl.classList.remove("active")
          contentEl.classList.remove("active")
        }
      } else {
        console.warn(`Missing elements for tab ${tabInfo.id}:`, { tabEl: !!tabEl, contentEl: !!contentEl })
      }
    })
    localStorage.setItem("activeExtensionTab", activeTabId)
    console.log("Active tab saved to localStorage:", activeTabId)
  }

  /**
   * Updates the position of the sliding tab indicator
   * @param {HTMLElement} activeTab - The active tab element
   */
  function updateTabIndicator(activeTab) {
    const indicator = document.querySelector('.tab-indicator')
    const tabsContainer = document.querySelector('.tabs')
    
    if (!indicator || !tabsContainer || !activeTab) return
    
    const containerRect = tabsContainer.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()
    
    // Calculate position relative to container
    const left = tabRect.left - containerRect.left - 3 // Account for container padding
    const width = tabRect.width
    
    indicator.style.left = `${left}px`
    indicator.style.width = `${width}px`
  }

  // Add click listeners to tabs
  tabs.forEach((tabInfo) => {
    const tabEl = document.getElementById(tabInfo.id)
    console.log(`Setting up click listener for tab ${tabInfo.id}:`, !!tabEl)

    if (tabEl) {
      // Remove any existing listeners
      const newTabEl = tabEl.cloneNode(true)
      tabEl.parentNode.replaceChild(newTabEl, tabEl)

      // Add new listener
      newTabEl.addEventListener("click", (e) => {
        console.log(`Tab ${tabInfo.id} clicked`)
        e.preventDefault()
        e.stopPropagation()
        switchTab(tabInfo.id)
      })
      console.log(`Click listener added to tab ${tabInfo.id}`)
    } else {
      console.error(`Tab element not found: ${tabInfo.id}`)
    }
  })

  // Restore last active tab or default to first tab
  const lastActiveTab = localStorage.getItem("activeExtensionTab")
  console.log("Last active tab from localStorage:", lastActiveTab)

  if (lastActiveTab && tabs.find((t) => t.id === lastActiveTab)) {
    console.log("Restoring last active tab:", lastActiveTab)
    switchTab(lastActiveTab)
  } else if (tabs.length > 0) {
    console.log("No last active tab, defaulting to first tab:", tabs[0].id)
    switchTab(tabs[0].id)
  }
  
  // Handle window resize for detached mode (update indicator position)
  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.tab.active')
    if (activeTab) {
      setTimeout(() => updateTabIndicator(activeTab), 100)
    }
  })

  console.log("Tab switching setup complete")
}

console.log("=== TAB MANAGER LOADED ===")
