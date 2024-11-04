import React from 'react'

const DocumentUploadModalBody = (props) => {
  return (
    <>
        <div className="modal-header justify-content-center" style={{ backgroundColor: "#19395f" }}>
            <div className="modal-header-wrap text-white text-center">
                <h5 className="modal-title text-white">Document Upload Progress:</h5>
                <p>All file names are truncated to be 16 characters long plus the file extension maximum.</p>
            </div>
        </div>
        <div className="modal-body">
          <div id="file-previews">
                <div className="dz-preview dz-file-preview dz-processing dz-success dz-complete">  
                    <div className="dz-image">
                        <img data-dz-thumbnail=""/>
                    </div>  
                    <div className="dz-details">    
                        <div className="dz-size">
                            <span data-dz-size="">
                                <strong></strong> MB
                            </span>
                        </div>    
                        <div className="dz-filename">
                            <span data-dz-name="">
                                {props.uploadFile}
                            </span>
                        </div>  
                    </div>  
                    <div className="dz-progress">
                        <span className="dz-upload" data-dz-uploadprogress={props.uploadProgress} style={{width: props.uploadProgress+"%"}}>
                        </span>
                    </div>  
                    <div className="dz-error-message">
                        <span data-dz-errormessage="">

                        </span>
                    </div>  
                </div>
          </div>

        </div>
        <div className="modal-footer border-0 bg-white justify-content-end">
            <label className="popup-handle-label">
              <input type="checkbox"/> 
              Automatically Close Upload Confirmation Popup
            </label>
            <button onClick={props.hideModal} type="button" className="btn btn-success btn-file-close" data-dismiss="modal">
              Close
            </button>
        </div>
    </>
  )
}

export default DocumentUploadModalBody;