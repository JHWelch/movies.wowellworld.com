const setQueryString = (queryString: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      ...window.location,
      search: queryString,
    },
  })
}

const setCurrentHref = (href: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      ...window.location,
      href,
    },
  })
}

export {
  setCurrentHref,
  setQueryString,
}
