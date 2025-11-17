/**
 * UploadPage
 * Form to upload new documents
 */

import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { uploadDocument } from '../services/documentService';
import { FiUpload } from 'react-icons/fi';

function UploadPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    school: '',
    subject: '',
    tags: '',
    accessType: 'public',
    creditCost: 0
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('school', formData.school);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('accessType', formData.accessType);
    formDataToSend.append('creditCost', formData.creditCost);

    try {
      const response = await uploadDocument(formDataToSend);
      setSuccess(response.message);
      setTimeout(() => {
        navigate('/documents');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="main-content">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Body className="p-5">
              <h2 className="mb-4"><FiUpload /> Upload Document</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Document Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter document title"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the content of your document"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>School</Form.Label>
                      <Form.Control
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        placeholder="e.g., HUST, VNU"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g., Mathematics, Physics"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Comma-separated tags (e.g., calculus, exam, notes)"
                  />
                  <Form.Text className="text-muted">
                    Separate tags with commas
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Access Type</Form.Label>
                      <Form.Select
                        name="accessType"
                        value={formData.accessType}
                        onChange={handleChange}
                      >
                        <option value="public">Public (Free)</option>
                        <option value="premium">Premium (Requires Credits)</option>
                        <option value="private">Private</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Credit Cost</Form.Label>
                      <Form.Control
                        type="number"
                        name="creditCost"
                        value={formData.creditCost}
                        onChange={handleChange}
                        min="0"
                        disabled={formData.accessType !== 'premium'}
                      />
                      <Form.Text className="text-muted">
                        Only for premium documents
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>File *</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx"
                  />
                  <Form.Text className="text-muted">
                    Accepted formats: PDF, DOC, DOCX, PPT, PPTX, TXT, XLS, XLSX (Max 10MB)
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UploadPage;
