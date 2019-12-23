import React, { useState } from 'react'
import { getFileHandle, getNewFileHandle, readFile, writeFile } from './helpers'
import styled from 'styled-components'

const EditorWrapper = styled.div`
  display: flex;
  flex-flow: column;
  padding: 50px;
`

const Button = styled.button`
  margin-left: 25px;
`

const TextArea = styled.textarea`
  min-height: 500px;
`

const NativeFSSupport = (): boolean => {
  if ('chooseFileSystemEntries' in window) {
    return true
  } else {
    alert(
      'ERROR: Native File System not supported! \n' +
        "I believe it's only for Chromium version>=78...\n" +
        "Go to 'chrome://flags' to enable this experimental (and probably unsafe) feature"
    )
    return false
  }
}

export default () => {
  const [text, setText] = useState<string>('')
  const [fileName, setFileName] = useState<string>('No name...')
  const [fileHandler, setFileHandler] = useState<Function>(() => {})

  const openFile = async () => {
    let fileHandler: Function = await getFileHandle()
    // @ts-ignore
    let file = await fileHandler.getFile()
    if (!file) return
    setText(await readFile(file))
    setFileName(file.name)
    setFileHandler(fileHandler)
  }

  const saveFile = async () => {
    if (fileHandler === undefined) {
      await saveFileAs()
    } else {
      await writeFile(fileHandler, text)
    }
  }

  // Save as a new file
  const saveFileAs = async () => {
    const fileHandle = await getNewFileHandle()
    await writeFile(fileHandle, text)
    setFileHandler(fileHandle)
    setFileName(fileHandle.name)
  }

  if (!NativeFSSupport()) {
    return (
      <h1>
        This component require the Native File System API. Please enable it.
      </h1>
    )
  } else {
    return (
      <EditorWrapper>
        <h1>{fileName}</h1>
        <TextArea
          value={text}
          onChange={event => {
            setText(event.target.value)
          }}
        />
        <div>
          <Button onClick={() => openFile()}>Open File</Button>
          <Button onClick={() => saveFileAs()}>Save As</Button>
          <Button onClick={() => saveFile()}>Save</Button>
        </div>
      </EditorWrapper>
    )
  }
}
