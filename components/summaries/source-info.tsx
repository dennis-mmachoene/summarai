import React from 'react'

const SourceInfo = ({fileName} : {fileName: string}) => {
  return (
    <p>{fileName}</p>
  )
}

export default SourceInfo