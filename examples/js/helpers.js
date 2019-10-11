/**
 * Saves form state to localstorage
 * @param key
 * @param state
 */
export const saveState = (key, state) => {
  window.localStorage.setItem(key, JSON.stringify(state))
}

/**
 * Loads form state from localstorage
 * @param key
 */
export const loadState = key => {
  return JSON.parse(window.localStorage.getItem(key)) || {}
}

/**
 * prefix a filename (string) with current date and time
 */
export const prefixWithDate = filename => {
  const dateObj = new Date()
  return `${dateObj.getTime()}-${filename}`
}

/**
 * Creates a file out of the given body parameter and triggers a download of the created file
 * @param body the payload to add to the file
 * @param filename
 * @param extension (of the file)
 */
export const createAndDownloadBlobFile = (
  body = [],
  filename = '',
  extension = 'bin'
) => {
  const blob = new Blob([body])
  const fileName = `${prefixWithDate(filename)}.${extension}`
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName)
  } else {
    const link = document.createElement('a')
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
