export function getFileHandle(): Promise<Function> {
  try {
    // @ts-ignore
    return window.chooseFileSystemEntries()
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return new Promise(() => {})
    }
    const msg = 'An error occured trying to open the file.'
    console.error(msg, ex)
    alert(msg)
    return new Promise(() => {})
  }
}

export function getNewFileHandle(): Promise<Function> {
  const opts = {
    type: 'saveFile',
    accepts: [
      {
        description: 'Text file',
        extensions: ['txt'],
        mimeTypes: ['text/plain'],
      },
    ],
  }
  try {
    // @ts-ignore
    return window.chooseFileSystemEntries(opts)
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return new Promise(() => {})
    }
    const msg = 'An error occured trying to open the file.'
    console.error(msg, ex)
    alert(msg)
    return new Promise(() => {})
  }
}

export async function writeFile(fileHandle: any, contents: string) {
  try {
    // Create a writer
    const writer = await fileHandle.createWriter()
    // Write the full length of the contents
    await writer.write(0, contents)
    // Close the file and write the contents to disk
    await writer.close()
  } catch (ex) {
    const msg = 'Unable to save file.'
    console.error(msg, ex)
    alert(msg)
    return
  }
}

export async function readFile(file: any): Promise<string> {
  try {
    return await file.text()
  } catch (ex) {
    const msg = `An error occured reading ${file.name}`
    console.error(msg, ex)
    alert(msg)
    return ''
  }
}
