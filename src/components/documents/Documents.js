import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import Nav from '../Nav';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [fileDescription, setFileDescription] = useState('');
    const [fileInput, setFileInput] = useState(null);
    const [editFileDescription, setEditFileDescription] = useState('');
    const [currentFileId, setCurrentFileId] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedDocuments = JSON.parse(localStorage.getItem('documents')) || [];
        setDocuments(storedDocuments);
    }, []);
   
    const handleUpload = () => {
        if (fileDescription.trim() === '' || !fileInput) {
            setErrorMessage('Please fill in the file description and select a file.');
            setShowError(true);
            return;
        }

        const newUpload = {
            id: Number(new Date()),
            fileName: fileInput.name,
            fileDescription: fileDescription
        };

        const updatedDocuments = [...documents, newUpload];
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        setDocuments(updatedDocuments);
        setShowUploadModal(false);
        setFileDescription('');
        setFileInput(null);
        setShowError(false);
    };

    const handleDelete = () => {
        const updatedDocuments = documents.filter(upload => upload.id !== currentFileId);
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        setDocuments(updatedDocuments);
        setShowDeleteModal(false);
    };

    const handleEditSave = () => {
        if (editFileDescription.trim() === '') {
            setErrorMessage('File description cannot be empty.');
            setShowError(true);
            return;
        }

        const updatedDocuments = documents.map(upload => 
            upload.id === currentFileId ? { ...upload, fileDescription: editFileDescription } : upload
        );
        localStorage.setItem('documents', JSON.stringify(updatedDocuments));
        setDocuments(updatedDocuments);
        setShowEditModal(false);
        setShowError(false);
    };

    return (
        <>
        <Nav />
        <div className="container">
            <h1 className="text-center mt-3 mb-3">My Documents</h1>

            <Table striped hover id="documentListTable">
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Filename</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="documentListTableBody">
                    {documents.map((upload) => (
                        <tr key={upload.id}>
                            <td>{upload.fileDescription}</td>
                            <td>{upload.fileName}</td>
                            <td>
                                <Button variant="danger" onClick={() => { setShowDeleteModal(true); setCurrentFileId(upload.id); }}>
                                    Delete
                                </Button>
                                <Button variant="primary" onClick={() => { setShowEditModal(true); setCurrentFileId(upload.id); setEditFileDescription(upload.fileDescription); }}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                + Add Upload
            </Button>

            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='mb-3'>
                        <div className="form-group">
                            <label htmlFor="fileDescription">File Description</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="fileDescription" 
                                value={fileDescription}
                                onChange={(e) => setFileDescription(e.target.value)}
                                placeholder="File Description" 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fileInput">File</label><br />
                            <input  type="file"  className="form-control-file"  id="fileInput"  onChange={(e) => setFileInput(e.target.files[0])}  />
                        </div>
                    </form>
                    {showError && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            {errorMessage}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleUpload}>Upload Now</Button>
                    <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='mb-3'>
                        <div className="form-group">
                            <label htmlFor="edit_document_filedescription">File Description</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="edit_document_filedescription" 
                                value={editFileDescription}
                                onChange={(e) => setEditFileDescription(e.target.value)}
                                placeholder="File Description" 
                            />
                        </div>
                    </form>
                    {showError && (
                        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                            {errorMessage}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEditSave}>Save</Button>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Delete File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this file?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
    );
};

export default Documents;
