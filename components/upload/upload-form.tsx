import React from 'react'
import { Button } from '../ui/button'
import UploadFormInput from './upload-form-input'

const UploadForm = () => {
    const handleSubmit = () => {
        console.log('submitted')
    }
  return (
    <div>
       <UploadFormInput onSubmit={handleSubmit}/>
    </div>
  )
}

export default UploadForm