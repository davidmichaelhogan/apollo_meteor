import React from 'react'

class UploadForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div>
        <div className="upload">
          <form id="upload">
            <div className="upload-area">
            <label htmlFor="file">{this.props.message}</label>
            <input type="file" name="file" id="file" ref="upload" onChange={this.props.onUpload} />
            </div>
          </form>
        </div>
        <div className="upload-note">
          Note: logo should be 100x100 pixels and either a .png or .jpg
        </div>
      </div>
    )
  }
}

export default UploadForm
